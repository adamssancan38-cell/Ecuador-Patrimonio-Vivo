/**
 * api/_lib/http.js — Conexión a Neon y utilidades para las funciones de Vercel
 */
"use strict";

let _sql = null;

/**
 * Busca la cadena de conexión de Neon. Vercel puede ponerle un prefijo
 * personalizado (ej. STORAGE_DATABASE_URL), así que si no existe
 * DATABASE_URL se busca cualquier variable cuyo valor empiece con postgres://
 */
function urlBaseDatos() {
  const e = process.env;
  if (e.DATABASE_URL) return e.DATABASE_URL;
  if (e.POSTGRES_URL) return e.POSTGRES_URL;
  const candidatas = Object.entries(e).filter(([, v]) => /^postgres(ql)?:\/\//.test(v || ""));
  const conPool = candidatas.find(([k]) => !/UNPOOLED|NON_POOLING|NO_SSL/i.test(k));
  return (conPool || candidatas[0] || [])[1] || null;
}

function getSql() {
  if (!_sql) {
    const url = urlBaseDatos();
    if (!url) throw new Error("No se encontró la cadena de conexión de la base de datos (conecta Neon en Vercel → Storage y vuelve a publicar).");
    const { neon } = require("@neondatabase/serverless");
    _sql = neon(url);
  }
  return _sql;
}

function ipDe(req) {
  const xff = req.headers["x-forwarded-for"];
  if (xff) return String(xff).split(",")[0].trim();
  return req.headers["x-real-ip"] || (req.socket && req.socket.remoteAddress) || "desconocida";
}

function responder(res, { status, cuerpo }) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.status(status).json(cuerpo);
}

/** Envuelve un manejador: captura errores y nunca filtra detalles internos. */
function envolver(metodo, fn) {
  return async (req, res) => {
    try {
      if (req.method !== metodo) {
        res.setHeader("Allow", metodo);
        return responder(res, { status: 405, cuerpo: { error: "Método no permitido" } });
      }
      return responder(res, await fn(req));
    } catch (e) {
      console.error("Error en API de opiniones:", e);
      return responder(res, { status: 500, cuerpo: { error: "Error interno del servidor." } });
    }
  };
}

module.exports = { getSql, urlBaseDatos, ipDe, envolver };
