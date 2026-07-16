const contactController = require('../../../controllers/contact.controller');
const protect = require('../../../middlewares/auth.middleware');
const authorize = require('../../../middlewares/role.middleware');
const contactValidator = require('../../../validators/contact.validator');

// ─── Contact Routes ────────────────────────────────────────
// Public: submit messages. Admin: manage messages.

function contactRoutes(router) {
  // ─── Public Routes ─────────────────────────────────────
  router.post('/public/contact', contactValidator.submit, contactController.submit);

  // ─── Admin Routes ──────────────────────────────────────
  router.get('/contact-messages', protect, authorize('ADMIN'), contactController.getAll);
  router.get('/contact-messages/unread/count', protect, authorize('ADMIN'), contactController.getUnreadCount);
  router.get('/contact-messages/:id', protect, authorize('ADMIN'), contactValidator.idParam, contactController.getById);
  router.put('/contact-messages/:id/read', protect, authorize('ADMIN'), contactValidator.idParam, contactController.markAsRead);
  router.put('/contact-messages/read-all', protect, authorize('ADMIN'), contactController.markAllAsRead);
  router.delete('/contact-messages/:id', protect, authorize('ADMIN'), contactValidator.idParam, contactController.remove);
}

module.exports = contactRoutes;
