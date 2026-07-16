const cmsController = require('./controller');
const protect = require('../../middlewares/auth.middleware');
const authorize = require('../../middlewares/role.middleware');
const cmsValidation = require('./validation');

function cmsRoutes(router) {
  // ─── Public Routes ─────────────────────────────────────
  router.get('/public/sections', cmsController.getPublicSections);
  router.get('/public/sections/:type', cmsValidation.typeParam, cmsController.getPublicSectionByType);

  // ─── Admin: Section Management ─────────────────────────
  router.get('/sections', protect, authorize('ADMIN'), cmsValidation.getSectionsQuery, cmsController.getAllSections);
  router.get('/sections/:type', protect, authorize('ADMIN'), cmsValidation.typeParam, cmsController.getSectionByType);
  router.post('/sections', protect, authorize('ADMIN'), cmsValidation.createSection, cmsController.createSection);
  router.put('/sections/:type', protect, authorize('ADMIN'), cmsValidation.typeParam, cmsValidation.updateSection, cmsController.updateSection);
  router.post('/sections/upsert', protect, authorize('ADMIN'), cmsValidation.upsertSection, cmsController.upsertSection);
  router.delete('/sections/:type', protect, authorize('ADMIN'), cmsValidation.typeParam, cmsController.deleteSection);
  router.post('/sections/initialize', protect, authorize('ADMIN'), cmsController.initializeDefaultSections);

  // ─── Admin: Media Management ───────────────────────────
  router.get('/media', protect, authorize('ADMIN'), cmsValidation.getMediaList, cmsController.getMediaList);
  router.get('/media/:id', protect, authorize('ADMIN'), cmsValidation.idParam, cmsController.getMediaById);
  router.post('/media', protect, authorize('ADMIN'), cmsValidation.createMedia, cmsController.createMedia);
  router.put('/media/:id', protect, authorize('ADMIN'), cmsValidation.idParam, cmsValidation.updateMedia, cmsController.updateMedia);
  router.delete('/media/:id', protect, authorize('ADMIN'), cmsValidation.idParam, cmsController.deleteMedia);
}

module.exports = cmsRoutes;
