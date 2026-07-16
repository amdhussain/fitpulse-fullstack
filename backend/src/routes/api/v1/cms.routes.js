const cmsController = require('../../../controllers/cms.controller');
const protect = require('../../../middlewares/auth.middleware');
const authorize = require('../../../middlewares/role.middleware');
const cmsValidator = require('../../../validators/cms.validator');

// ─── CMS Routes ────────────────────────────────────────────
// Admin: manage CMS sections (Hero, About, Contact, Footer).
// Public: read active sections.

function cmsRoutes(router) {
  // ─── Admin Routes ──────────────────────────────────────
  router.get('/cms', protect, authorize('ADMIN'), cmsController.getAll);
  router.get('/cms/:type', protect, authorize('ADMIN'), cmsValidator.typeParam, cmsController.getByType);
  router.put('/cms/:type', protect, authorize('ADMIN'), cmsValidator.upsert, cmsController.upsert);

  // ─── Public Routes ─────────────────────────────────────
  router.get('/public/cms', cmsController.getPublicAll);
  router.get('/public/cms/:type', cmsValidator.typeParam, cmsController.getPublicByType);
}

module.exports = cmsRoutes;
