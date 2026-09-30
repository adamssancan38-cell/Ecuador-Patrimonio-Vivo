const core = require("./_lib/core");
const { getSql, envolver } = require("./_lib/http");

// GET /api/resumen
module.exports = envolver("GET", () => core.resumen(getSql()));
