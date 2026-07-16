const serviceController = require('../../../controllers/service.controller');
const protect = require('../../../middlewares/auth.middleware');
const authorize = require('../../../middlewares/role.middleware');
const serviceValidator = require('../../../validators/service.validator');

// ─── Service Routes ────────────────────────────────────────
// Admin: full CRUD. Public: read active services only.

function serviceRoutes(router) {
  // ─── Admin Routes ──────────────────────────────────────
  router.get('/services', protect, authorize('ADMIN'), serviceController.getAll);
  router.get('/services/:id', protect, authorize('ADMIN'), serviceValidator.idParam, serviceController.getById);
  router.post('/services', protect, authorize('ADMIN'), serviceValidator.create, serviceController.create);
  router.put('/services/:id', protect, authorize('ADMIN'), serviceValidator.idParam, serviceValidator.update, serviceController.update);
  router.delete('/services/:id', protect, authorize('ADMIN'), serviceValidator.idParam, serviceController.remove);

  // ─── Public Routes ─────────────────────────────────────
  router.get('/public/services/categories', serviceController.getCategories);
  router.get('/public/services', serviceController.getActive);
  router.get('/public/services/:id', serviceValidator.idParam, serviceController.getActiveById);
}

module.exports = serviceRoutes;
