/**
 * server.js — Servidor de Ecuador Patrimonio Vivo
 * ─────────────────────────────────────────────────────────────
 * Sirve el sitio web Y guarda las reseñas (estrellas + comentario)
 * en una base de datos SQLite (data/resenas.db).
 *
 * Requisitos: Node.js 22.5 o superior. NO necesita `npm install`
 * (usa el SQLite integrado de Node y nada más).
 *
 * Uso:   node server.js        →  http://localhost:3000
 *
 * Variables de entorno opcionales:
 *   PORT         Puerto (por defecto 3000)
 *   DB_PATH      Ruta del archivo de base de datos
 *   ADMIN_TOKEN  Si la defines, permite borrar reseñas inapropiadas:
 *                DELETE /api/resenas/:id   con cabecera  x-admin-token
 *   TRUST_PROXY  "1" si está detrás de un proxy (Render, Railway, Nginx…)
 *                para leer la IP real desde x-forwarded-for
 */
"use strict";

const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { DatabaseSync } = require("node:sqlite");

const PORT = Number(process.env.PORT) || 3000;
const ROOT = __dirname;
const DB_PATH = process.env.DB_PATH || path.join(ROOT, "data", "resenas.db");
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "";
const TRUST_PROXY = process.env.TRUST_PROXY === "1";

const MAX_COMENTARIO = 600;
const MAX_NOMBRE = 40;
const MAX_BODY_BYTES = 10 * 1024;

/* ═══════════════════════════════════════════════════════════════
   1. BASE DE DATOS
   ═══════════════════════════════════════════════════════════════ */
fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
const db = new DatabaseSync(DB_PATH);
db.exec(`
  PRAGMA journal_mode = WAL;
  CREATE TABLE IF NOT EXISTS resenas (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    lugar_id   TEXT    NOT NULL,
    estrellas  INTEGER NOT NULL CHECK (estrellas BETWEEN 1 AND 5),
    comentario TEXT    NOT NULL DEFAULT '',
    nombre     TEXT    NOT NULL DEFAULT '',   -- vacío = Anónimo
    creado_en  TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
  );
  CREATE INDEX IF NOT EXISTS idx_resenas_lugar ON resenas (lugar_id, id DESC);
`);

const q = {
  insertar: db.prepare(
    "INSERT INTO resenas (lugar_id, estrellas, comentario, nombre) VALUES (?, ?, ?, ?)"
  ),
  resumenTodos: db.prepare(
    `SELECT lugar_id, COUNT(*) AS total, ROUND(AVG(estrellas), 2) AS promedio
       FROM resenas GROUP BY lugar_id`
  ),
  resumenLugar: db.prepare(
    "SELECT COUNT(*) AS total, ROUND(AVG(estrellas), 2) AS promedio FROM resenas WHERE lugar_id = ?"
  ),
  distribucion: db.prepare(
    "SELECT estrellas, COUNT(*) AS n FROM resenas WHERE lugar_id = ? GROUP BY estrellas"
  ),
  listar: db.prepare(
    `SELECT id, estrellas, comentario, nombre, creado_en FROM resenas
      WHERE lugar_id = ? AND id < ? ORDER BY id DESC LIMIT ?`
  ),
  borrar: db.prepare("DELETE FROM resenas WHERE id = ?")
};

/* ═══════════════════════════════════════════════════════════════
   2. IDs DE LUGARES VÁLIDOS (se leen de js/data.js, una sola fuente)
   ═══════════════════════════════════════════════════════════════ */
function cargarIdsLugares() {
  const codigo = fs.readFileSync(path.join(ROOT, "js", "data.js"), "utf8");
  const ids = vm.runInNewContext(codigo + "\n;LUGARES.map(l => l.id)", {}, { timeout: 2000 });
  return new Set(ids);
}
const LUGARES_VALIDOS = cargarIdsLugares();

/* ═══════════════════════════════════════════════════════════════
   3. ANTI-ABUSO (en memoria; se reinicia con el servidor)
   ═══════════════════════════════════════════════════════════════ */
const VENTANA_1H = 60 * 60 * 1000;
const VENTANA_24H = 24 * VENTANA_1H;
const porIp = new Map();      // ip → [timestamps]  (máx. 8 reseñas / hora)
const porIpLugar = new Map(); // ip|lugar → timestamp (1 reseña / lugar / 24 h)

function ipDe(req) {
  if (TRUST_PROXY) {
    const xff = req.headers["x-forwarded-for"];
    if (xff) return String(xff).split(",")[0].trim();
  }
  return req.socket.remoteAddress || "desconocida";
}

function revisarLimites(ip, lugarId) {
  const ahora = Date.now();
  const recientes = (porIp.get(ip) || []).filter(t => ahora - t < VENTANA_1H);
  if (recientes.length >= 8) {
    return "Has enviado muchas opiniones en poco tiempo. Intenta de nuevo más tarde.";
  }
  const previa = porIpLugar.get(ip + "|" + lugarId);
  if (previa && ahora - previa < VENTANA_24H) {
    return "Ya enviaste una opinión para este lugar hoy. ¡Gracias por participar!";
  }
  return null;
}

function registrarEnvio(ip, lugarId) {
  const ahora = Date.now();
  const recientes = (porIp.get(ip) || []).filter(t => ahora - t < VENTANA_1H);
  recientes.push(ahora);
  porIp.set(ip, recientes);
  porIpLugar.set(ip + "|" + lugarId, ahora);
}

setInterval(() => { // limpieza periódica
  const ahora = Date.now();
  for (const [k, v] of porIp) if (v.every(t => ahora - t >= VENTANA_1H)) porIp.delete(k);
  for (const [k, t] of porIpLugar) if (ahora - t >= VENTANA_24H) porIpLugar.delete(k);
}, VENTANA_1H).unref();

/* ═══════════════════════════════════════════════════════════════
   4. UTILIDADES HTTP
   ═══════════════════════════════════════════════════════════════ */
function json(res, status, datos) {
  const cuerpo = JSON.stringify(datos);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff"
  });
  res.end(cuerpo);
}

function leerCuerpo(req) {
  return new Promise((resolve, reject) => {
    let tam = 0;
    const partes = [];
    req.on("data", (c) => {
      tam += c.length;
      if (tam > MAX_BODY_BYTES) { reject(new Error("grande")); req.destroy(); return; }
      partes.push(c);
    });
    req.on("end", () => {
      try { resolve(JSON.parse(Buffer.concat(partes).toString("utf8") || "{}")); }
      catch (_) { reject(new Error("json")); }
    });
    req.on("error", reject);
  });
}

// Quita caracteres de control y espacios sobrantes
const limpiarTexto = (t, max) =>
  String(t ?? "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, max);

/* ═══════════════════════════════════════════════════════════════
   5. API  /api/...
   ═══════════════════════════════════════════════════════════════ */
async function manejarApi(req, res, url) {
  const partes = url.pathname.split("/").filter(Boolean); // ["api","resenas",…]
  const recurso = partes[1];

  // GET /api/resumen → { lugar_id: {promedio, total}, … }
  if (req.method === "GET" && recurso === "resumen" && partes.length === 2) {
    const salida = {};
    for (const f of q.resumenTodos.all()) {
      salida[f.lugar_id] = { promedio: f.promedio, total: f.total };
    }
    return json(res, 200, salida);
  }

  if (recurso !== "resenas") return json(res, 404, { error: "No encontrado" });

  // GET /api/resenas/:lugarId?antes=ID&limite=10
  if (req.method === "GET" && partes.length === 3) {
    const lugarId = decodeURIComponent(partes[2]);
    if (!LUGARES_VALIDOS.has(lugarId)) return json(res, 404, { error: "Lugar no válido" });

    const limite = Math.min(Math.max(parseInt(url.searchParams.get("limite")) || 10, 1), 50);
    const antes = parseInt(url.searchParams.get("antes")) || Number.MAX_SAFE_INTEGER;

    const resumen = q.resumenLugar.get(lugarId);
    const distribucion = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    for (const f of q.distribucion.all(lugarId)) distribucion[f.estrellas] = f.n;
    const resenas = q.listar.all(lugarId, antes, limite).map(r => ({ ...r }));

    return json(res, 200, {
      promedio: resumen.promedio || 0,
      total: resumen.total,
      distribucion,
      resenas,
      hayMas: resenas.length === limite && resenas.length > 0 &&
        q.listar.all(lugarId, resenas[resenas.length - 1].id, 1).length > 0
    });
  }

  // POST /api/resenas   { lugar_id, estrellas, comentario?, nombre?, web? }
  if (req.method === "POST" && partes.length === 2) {
    let d;
    try { d = await leerCuerpo(req); }
    catch (e) {
      return json(res, e.message === "grande" ? 413 : 400, { error: "Solicitud no válida." });
    }

    // Honeypot: los bots suelen llenar este campo oculto
    if (d.web) return json(res, 201, { ok: true });

    const lugarId = String(d.lugar_id ?? "");
    if (!LUGARES_VALIDOS.has(lugarId)) return json(res, 400, { error: "Lugar no válido." });

    const estrellas = Number(d.estrellas);
    if (!Number.isInteger(estrellas) || estrellas < 1 || estrellas > 5) {
      return json(res, 400, { error: "Elige de 1 a 5 estrellas." });
    }

    const comentario = limpiarTexto(d.comentario, MAX_COMENTARIO);
    const nombre = limpiarTexto(d.nombre, MAX_NOMBRE).replace(/\n/g, " ");

    const ip = ipDe(req);
    const bloqueo = revisarLimites(ip, lugarId);
    if (bloqueo) return json(res, 429, { error: bloqueo });

    const r = q.insertar.run(lugarId, estrellas, comentario, nombre);
    registrarEnvio(ip, lugarId);
    return json(res, 201, { ok: true, id: Number(r.lastInsertRowid) });
  }

  // DELETE /api/resenas/:id  (solo administrador)
  if (req.method === "DELETE" && partes.length === 3) {
    if (!ADMIN_TOKEN || req.headers["x-admin-token"] !== ADMIN_TOKEN) {
      return json(res, 403, { error: "No autorizado" });
    }
    const r = q.borrar.run(parseInt(partes[2]) || 0);
    return json(res, r.changes ? 200 : 404, { ok: r.changes > 0 });
  }

  return json(res, 405, { error: "Método no permitido" });
}

/* ═══════════════════════════════════════════════════════════════
   6. ARCHIVOS ESTÁTICOS (solo index.html, css/, js/, img/, video/)
   ═══════════════════════════════════════════════════════════════ */
const MIME = {
  ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8", ".json": "application/json",
  ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
  ".webp": "image/webp", ".svg": "image/svg+xml", ".gif": "image/gif",
  ".mp4": "video/mp4", ".webm": "video/webm", ".txt": "text/plain; charset=utf-8"
};
const CARPETAS_PUBLICAS = new Set(["css", "js", "img", "video"]);

function servirEstatico(req, res, url) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.writeHead(405); return res.end();
  }
  let ruta;
  try { ruta = decodeURIComponent(url.pathname); } catch (_) { res.writeHead(400); return res.end(); }
  if (ruta === "/") ruta = "/index.html";

  // Se valida la ruta YA normalizada (evita trucos como /css/..%2fserver.js)
  const archivo = path.normalize(path.join(ROOT, ruta));
  const relativa = path.relative(ROOT, archivo).split(path.sep);
  const permitido =
    !relativa.includes("..") &&
    (relativa.join("/") === "index.html" ||
      (relativa.length > 1 && CARPETAS_PUBLICAS.has(relativa[0])));
  if (!permitido) {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    return res.end("404 — No encontrado");
  }

  fs.stat(archivo, (err, st) => {
    if (err || !st.isFile()) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      return res.end("404 — No encontrado");
    }
    const tipo = MIME[path.extname(archivo).toLowerCase()] || "application/octet-stream";
    const cabeceras = {
      "Content-Type": tipo,
      "Accept-Ranges": "bytes",
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": ruta.startsWith("/video") || ruta.startsWith("/img")
        ? "public, max-age=86400" : "no-cache"
    };

    // Soporte de Range (necesario para reproducir/adelantar video en Safari)
    const rango = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range || "");
    if (rango && (rango[1] || rango[2])) {
      let ini = rango[1] ? parseInt(rango[1]) : st.size - parseInt(rango[2]);
      let fin = rango[1] && rango[2] ? parseInt(rango[2]) : st.size - 1;
      if (ini > fin || ini >= st.size) {
        res.writeHead(416, { "Content-Range": `bytes */${st.size}` }); return res.end();
      }
      fin = Math.min(fin, st.size - 1);
      res.writeHead(206, {
        ...cabeceras,
        "Content-Range": `bytes ${ini}-${fin}/${st.size}`,
        "Content-Length": fin - ini + 1
      });
      if (req.method === "HEAD") return res.end();
      return fs.createReadStream(archivo, { start: ini, end: fin }).pipe(res);
    }

    res.writeHead(200, { ...cabeceras, "Content-Length": st.size });
    if (req.method === "HEAD") return res.end();
    fs.createReadStream(archivo).pipe(res);
  });
}

/* ═══════════════════════════════════════════════════════════════
   7. ARRANQUE
   ═══════════════════════════════════════════════════════════════ */
const servidor = http.createServer((req, res) => {
  const url = new URL(req.url, "http://localhost");
  if (url.pathname.startsWith("/api/")) {
    manejarApi(req, res, url).catch((e) => {
      console.error("Error en API:", e);
      if (!res.headersSent) json(res, 500, { error: "Error interno del servidor." });
    });
  } else {
    servirEstatico(req, res, url);
  }
});

servidor.listen(PORT, () => {
  console.log(`\n  🌿 Ecuador Patrimonio Vivo → http://localhost:${PORT}`);
  console.log(`  🗄️  Base de datos: ${DB_PATH}`);
  console.log(`  📍 Lugares válidos para reseñas: ${LUGARES_VALIDOS.size}\n`);
});

process.on("SIGINT", () => { db.close(); process.exit(0); });
process.on("SIGTERM", () => { db.close(); process.exit(0); });
