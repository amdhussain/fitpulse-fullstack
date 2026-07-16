const galleryController = require('../../../controllers/gallery.controller');
const protect = require('../../../middlewares/auth.middleware');
const authorize = require('../../../middlewares/role.middleware');
const galleryValidator = require('../../../validators/gallery.validator');

// ─── Gallery Routes ────────────────────────────────────────
// Admin: full CRUD. Public: read active items only.

function galleryRoutes(router) {
  // ─── Admin Routes ──────────────────────────────────────
  router.get('/gallery', protect, authorize('ADMIN'), galleryController.getAll);
  router.get('/gallery/:id', protect, authorize('ADMIN'), galleryValidator.idParam, galleryController.getById);
  router.post('/gallery', protect, authorize('ADMIN'), galleryValidator.create, galleryController.create);
  router.put('/gallery/:id', protect, authorize('ADMIN'), galleryValidator.idParam, galleryValidator.update, galleryController.update);
  router.delete('/gallery/:id', protect, authorize('ADMIN'), galleryValidator.idParam, galleryController.remove);

  // ─── Public Routes ─────────────────────────────────────
  router.get('/public/gallery/categories', galleryController.getCategories);
  router.get('/public/gallery', galleryController.getActive);
  router.get('/public/gallery/:id', galleryValidator.idParam, galleryController.getActiveById);
}

module.exports = galleryRoutes;
