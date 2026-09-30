const core = require("../_lib/core");
const { getSql, ipDe, envolver } = require("../_lib/http");

// POST /api/resenas
module.exports = envolver("POST", (req) => {
  let cuerpo = req.body;
  if (typeof cuerpo === "string") { try { cuerpo = JSON.parse(cuerpo); } catch (_) { cuerpo = null; } }
  if (!cuerpo) return { status: 400, cuerpo: { error: "Solicitud no válida." } };
  return core.crear(getSql(), cuerpo, ipDe(req));
});
