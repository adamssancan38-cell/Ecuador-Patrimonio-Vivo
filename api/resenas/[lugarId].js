const core = require("../_lib/core");
const { getSql, envolver } = require("../_lib/http");

// GET /api/resenas/:lugarId?antes=ID&limite=10
module.exports = envolver("GET", (req) =>
  core.listar(getSql(), String(req.query.lugarId || ""), req.query.antes, req.query.limite)
);
