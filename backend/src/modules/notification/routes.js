const notificationController = require('./controller');
const protect = require('../../middlewares/auth.middleware');
const authorize = require('../../middlewares/role.middleware');
const notificationValidation = require('./validation');

function notificationRoutes(router) {
  // Read routes — all authenticated users can view notifications
  router.get('/', protect, authorize('ADMIN', 'TRAINER', 'MEMBER'), notificationValidation.getNotifications, notificationController.getNotifications);
  router.get('/:id', protect, authorize('ADMIN', 'TRAINER', 'MEMBER'), notificationValidation.idParam, notificationController.getNotificationById);

  // Mark-as-read routes — all authenticated users can mark their viewed notifications
  router.patch('/read-all', protect, authorize('ADMIN', 'TRAINER', 'MEMBER'), notificationController.markAllAsRead);
  router.patch('/:id/read', protect, authorize('ADMIN', 'TRAINER', 'MEMBER'), notificationValidation.idParam, notificationController.markAsRead);

  // Delete routes — admin only
  router.delete('/', protect, authorize('ADMIN'), notificationController.deleteAll);
  router.delete('/:id', protect, authorize('ADMIN'), notificationValidation.idParam, notificationController.deleteNotification);
}

module.exports = notificationRoutes;
