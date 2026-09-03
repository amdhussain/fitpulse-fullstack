const newsletterController = require('./controller');
const protect = require('../../middlewares/auth.middleware');
const authorize = require('../../middlewares/role.middleware');
const newsletterValidation = require('./validation');

function newsletterRoutes(router) {
  // ─── Admin Routes ──────────────────────────────────────
  router.get('/stats', protect, authorize('ADMIN'), newsletterController.getStats);
  router.get('/', protect, authorize('ADMIN'), newsletterValidation.getAllSubscribers, newsletterController.getAllSubscribers);
  router.get('/:id', protect, authorize('ADMIN'), newsletterValidation.idParam, newsletterController.getSubscriberById);
  router.post('/', protect, authorize('ADMIN'), newsletterValidation.addSubscriber, newsletterController.addSubscriber);
  router.patch('/:id', protect, authorize('ADMIN'), newsletterValidation.idParam, newsletterValidation.updateSubscriber, newsletterController.updateSubscriber);
  router.patch('/:id/toggle', protect, authorize('ADMIN'), newsletterValidation.idParam, newsletterController.toggleStatus);
  router.delete('/:id', protect, authorize('ADMIN'), newsletterValidation.idParam, newsletterController.deleteSubscriber);
}

module.exports = newsletterRoutes;
