const healthRoutes = require('./health.routes');
const systemRoutes = require('./system.routes');

function v1Routes(router) {
  // ─── Core Routes ──────────────────────────────────────
  healthRoutes(router);
  systemRoutes(router);

  // ─── Future Module Routes ─────────────────────────────
  // Uncomment and create route files as modules are built:
  //
  // const authRoutes = require('./auth.routes');
  // const userRoutes = require('./user.routes');
  // const trainerRoutes = require('./trainer.routes');
  // const classRoutes = require('./class.routes');
  // const bookingRoutes = require('./booking.routes');
  // const paymentRoutes = require('./payment.routes');
  // const communityRoutes = require('./community.routes');
  // const dashboardRoutes = require('./dashboard.routes');
  // const fitnessToolsRoutes = require('./fitness-tools.routes');
  // const cmsRoutes = require('./cms.routes');
  // const settingsRoutes = require('./settings.routes');
  //
  // authRoutes(router);
  // userRoutes(router);
  // trainerRoutes(router);
  // classRoutes(router);
  // bookingRoutes(router);
  // paymentRoutes(router);
  // communityRoutes(router);
  // dashboardRoutes(router);
  // fitnessToolsRoutes(router);
  // cmsRoutes(router);
  // settingsRoutes(router);
}

module.exports = v1Routes;
