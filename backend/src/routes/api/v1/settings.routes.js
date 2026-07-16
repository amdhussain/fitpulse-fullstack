const settingsController = require('../../../controllers/settings.controller');
const protect = require('../../../middlewares/auth.middleware');
const authorize = require('../../../middlewares/role.middleware');
const settingsValidator = require('../../../validators/settings.validator');

// ─── Settings Routes ───────────────────────────────────────
// Admin: manage all settings. Public: read filtered settings.

function settingsRoutes(router) {
  // ─── Admin Routes ──────────────────────────────────────
  router.get('/settings', protect, authorize('ADMIN'), settingsController.getAll);
  router.get('/settings/:key', protect, authorize('ADMIN'), settingsValidator.keyParam, settingsController.getByKey);
  router.put('/settings/:key', protect, authorize('ADMIN'), settingsValidator.keyParam, settingsValidator.set, settingsController.set);
  router.put('/settings', protect, authorize('ADMIN'), settingsValidator.setMany, settingsController.setMany);
  router.delete('/settings/:key', protect, authorize('ADMIN'), settingsValidator.keyParam, settingsController.remove);

  // ─── Public Routes ─────────────────────────────────────
  router.get('/public/settings', settingsController.getPublic);
}

module.exports = settingsRoutes;
