const healthRoutes = require('./health.routes');
const systemRoutes = require('./system.routes');

function v1Routes(router) {
  // ─── Core Routes ──────────────────────────────────────
  // These are non-module routes that provide system info
  healthRoutes(router);
  systemRoutes(router);

  // ─── Module Routes ────────────────────────────────────
  // All other routes are loaded automatically via the module
  // system in src/modules/. The module loader discovers
  // modules and registers their routes at /api/v1/<prefix>.
}

module.exports = v1Routes;
