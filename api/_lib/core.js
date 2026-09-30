/**
 * api/_lib/core.js — Lógica de las opiniones (independiente de Vercel)
 * Recibe una función `sql` tipo plantilla (Neon) y devuelve {status, cuerpo}.
 * La carpeta empieza con "_" para que Vercel NO la exponga como ruta.
 */
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const MAX_COMENTARIO = 600;
const MAX_NOMBRE = 40;
const MAX_POR_HORA = 8;
const HORA = 60 * 60 * 1000;

/* ── IDs de lugares válidos (se leen de js/data.js: una sola fuente) ── */
let _ids = null;
function idsLugares() {
  if (_ids) return _ids;
  const candidatas = [
    path.join(process.cwd(), "js", "data.js"),
    path.join(__dirname, "..", "..", "js", "data.js")
  ];
  const archivo = candidatas.find((p) => fs.existsSync(p));
  if (!archivo) throw new Error("No se encontró js/data.js (revisa includeFiles en vercel.json)");
  const codigo = fs.readFileSync(archivo, "utf8");
  _ids = new Set(vm.runInNewContext(codigo + "\n;LUGARES.map(l => l.id)", {}, { timeout: 2000 }));
  return _ids;
}

/* ── Tabla (se crea sola la primera vez) ── */
let _listo = null;
function prepararTabla(sql) {
  if (!_listo) {
    _listo = (async () => {
      await sql`CREATE TABLE IF NOT EXISTS resenas (
        id         SERIAL PRIMARY KEY,
        lugar_id   TEXT NOT NULL,
        estrellas  SMALLINT NOT NULL CHECK (estrellas BETWEEN 1 AND 5),
        comentario TEXT NOT NULL DEFAULT '',
        nombre     TEXT NOT NULL DEFAULT '',
        ip_hash    TEXT,
        creado_en  TIMESTAMPTZ NOT NULL DEFAULT now()
      )`;
      await sql`CREATE INDEX IF NOT EXISTS idx_resenas_lugar ON resenas (lugar_id, id DESC)`;
      await sql`CREATE INDEX IF NOT EXISTS idx_resenas_ip ON resenas (ip_hash, creado_en)`;
    })().catch((e) => { _listo = null; throw e; });
  }
  return _listo;
}

const limpiarTexto = (t, max) =>
  String(t ?? "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, max);

const error = (status, mensaje) => ({ status, cuerpo: { error: mensaje } });

/* ── GET /api/resumen ── */
async function resumen(sql) {
  await prepararTabla(sql);
  const filas = await sql`
    SELECT lugar_id, COUNT(*)::int AS total,
           ROUND(AVG(estrellas)::numeric, 2)::float AS promedio
      FROM resenas GROUP BY lugar_id`;
  const salida = {};
  for (const f of filas) salida[f.lugar_id] = { promedio: Number(f.promedio), total: Number(f.total) };
  return { status: 200, cuerpo: salida };
}

/* ── GET /api/resenas/:lugarId?antes=ID&limite=10 ── */
async function listar(sql, lugarId, antesParam, limiteParam) {
  if (!idsLugares().has(lugarId)) return error(404, "Lugar no válido");
  await prepararTabla(sql);

  const limite = Math.min(Math.max(parseInt(limiteParam) || 10, 1), 50);
  const antes = parseInt(antesParam) || 2147483647;

  const [res] = await sql`
    SELECT COUNT(*)::int AS total,
           COALESCE(ROUND(AVG(estrellas)::numeric, 2), 0)::float AS promedio
      FROM resenas WHERE lugar_id = ${lugarId}`;
  const dist = await sql`
    SELECT estrellas, COUNT(*)::int AS n FROM resenas
     WHERE lugar_id = ${lugarId} GROUP BY estrellas`;
  const distribucion = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  for (const f of dist) distribucion[f.estrellas] = Number(f.n);

  // Se pide una fila extra para saber si hay más páginas
  const filas = await sql`
    SELECT id, estrellas, comentario, nombre, creado_en FROM resenas
     WHERE lugar_id = ${lugarId} AND id < ${antes}
     ORDER BY id DESC LIMIT ${limite + 1}`;
  const hayMas = filas.length > limite;
  const resenas = filas.slice(0, limite).map((r) => ({
    id: Number(r.id),
    estrellas: Number(r.estrellas),
    comentario: r.comentario,
    nombre: r.nombre,
    creado_en: new Date(r.creado_en).toISOString()
  }));

  return {
    status: 200,
    cuerpo: { promedio: Number(res.promedio) || 0, total: Number(res.total), distribucion, resenas, hayMas }
  };
}

/* ── POST /api/resenas ── */
async function crear(sql, datos, ip) {
  const d = datos && typeof datos === "object" ? datos : {};

  if (d.web) return { status: 201, cuerpo: { ok: true } }; // honeypot: bot

  const lugarId = String(d.lugar_id ?? "");
  if (!idsLugares().has(lugarId)) return error(400, "Lugar no válido.");

  const estrellas = Number(d.estrellas);
  if (!Number.isInteger(estrellas) || estrellas < 1 || estrellas > 5) {
    return error(400, "Elige de 1 a 5 estrellas.");
  }

  const comentario = limpiarTexto(d.comentario, MAX_COMENTARIO);
  const nombre = limpiarTexto(d.nombre, MAX_NOMBRE).replace(/\n/g, " ");

  await prepararTabla(sql);

  // Anti-abuso con la propia base de datos (las funciones no comparten memoria).
  // Solo se guarda un hash de la IP y se borra a los 2 días.
  const sal = process.env.IP_SALT || "epv-sal-por-defecto";
  const ipHash = crypto.createHash("sha256").update(sal + "|" + ip).digest("hex");
  const hace1h = new Date(Date.now() - HORA).toISOString();
  const hace24h = new Date(Date.now() - 24 * HORA).toISOString();

  const [a] = await sql`SELECT COUNT(*)::int AS n FROM resenas WHERE ip_hash = ${ipHash} AND creado_en > ${hace1h}`;
  if (Number(a.n) >= MAX_POR_HORA) {
    return error(429, "Has enviado muchas opiniones en poco tiempo. Intenta de nuevo más tarde.");
  }
  const [b] = await sql`SELECT COUNT(*)::int AS n FROM resenas
                         WHERE ip_hash = ${ipHash} AND lugar_id = ${lugarId} AND creado_en > ${hace24h}`;
  if (Number(b.n) > 0) {
    return error(429, "Ya enviaste una opinión para este lugar hoy. ¡Gracias por participar!");
  }

  const [nueva] = await sql`
    INSERT INTO resenas (lugar_id, estrellas, comentario, nombre, ip_hash)
    VALUES (${lugarId}, ${estrellas}, ${comentario}, ${nombre}, ${ipHash})
    RETURNING id`;

  // Privacidad: olvida los hashes de IP con más de 2 días
  const hace2d = new Date(Date.now() - 48 * HORA).toISOString();
  await sql`UPDATE resenas SET ip_hash = NULL WHERE ip_hash IS NOT NULL AND creado_en < ${hace2d}`;

  return { status: 201, cuerpo: { ok: true, id: Number(nueva.id) } };
}

module.exports = { resumen, listar, crear, idsLugares };
