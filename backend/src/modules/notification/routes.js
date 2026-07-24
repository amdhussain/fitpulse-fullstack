const notificationController = require('./controller');
const protect = require('../../middlewares/auth.middleware');
const authorize = require('../../middlewares/role.middleware');
const notificationValidation = require('./validation');

function notificationRoutes(router) {
  // Admin routes
  router.get('/', protect, authorize('ADMIN'), notificationValidation.getNotifications, notificationController.getNotifications);
  router.patch('/read-all', protect, authorize('ADMIN'), notificationController.markAllAsRead);
  router.patch('/:id/read', protect, authorize('ADMIN'), notificationValidation.idParam, notificationController.markAsRead);
  router.get('/:id', protect, authorize('ADMIN'), notificationValidation.idParam, notificationController.getNotificationById);
  router.delete('/', protect, authorize('ADMIN'), notificationController.deleteAll);
  router.delete('/:id', protect, authorize('ADMIN'), notificationValidation.idParam, notificationController.deleteNotification);
}

module.exports = notificationRoutes;
