/**
 * api/_lib/http.js — Conexión a Neon y utilidades para las funciones de Vercel
 */
"use strict";

let _sql = null;
function getSql() {
  if (!_sql) {
    const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
    if (!url) throw new Error("Falta la variable DATABASE_URL (conecta la base de datos Neon en Vercel → Storage).");
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

module.exports = { getSql, ipDe, envolver };
