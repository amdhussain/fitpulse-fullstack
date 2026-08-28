const notificationController = require('./controller');
const protect = require('../../middlewares/auth.middleware');
const authorize = require('../../middlewares/role.middleware');
const notificationValidation = require('./validation');

function notificationRoutes(router) {
  // Read routes — admin and members can access their own notifications
  router.get('/', protect, authorize('ADMIN', 'MEMBER'), notificationValidation.getNotifications, notificationController.getNotifications);
  router.get('/:id', protect, authorize('ADMIN'), notificationValidation.idParam, notificationController.getNotificationById);

  // Mark-as-read routes — admin and members can mark their own notifications as read
  router.patch('/read-all', protect, authorize('ADMIN', 'MEMBER'), notificationController.markAllAsRead);
  router.patch('/:id/read', protect, authorize('ADMIN', 'MEMBER'), notificationValidation.idParam, notificationController.markAsRead);

  // Delete routes — admin only
  router.delete('/', protect, authorize('ADMIN'), notificationController.deleteAll);
  router.delete('/:id', protect, authorize('ADMIN'), notificationValidation.idParam, notificationController.deleteNotification);
}

module.exports = notificationRoutes;
