const notificationService = require('./service');
const { successResponse, createdResponse, updatedResponse, deletedResponse, paginatedResponse } = require('../../helpers/apiResponse');
const asyncHandler = require('../../middlewares/asyncHandler');

const getNotifications = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, type, read } = req.query;

  const result = await notificationService.getNotifications({
    page: parseInt(page, 10) || 1,
    limit: parseInt(limit, 10) || 20,
    type,
    read: read !== undefined ? read === 'true' : undefined,
    userId: req.user.role !== 'ADMIN' ? req.user.id : undefined,
  });

  return paginatedResponse(res, result);
});

const getNotificationById = asyncHandler(async (req, res) => {
  const notification = await notificationService.getNotificationById(req.params.id);
  return successResponse(res, notification, 'Notification retrieved successfully');
});

const markAsRead = asyncHandler(async (req, res) => {
  const notification = await notificationService.markAsRead(req.params.id);
  return updatedResponse(res, notification, 'Notification marked as read');
});

const markAllAsRead = asyncHandler(async (req, res) => {
  const userId = req.user.role !== 'ADMIN' ? req.user.id : undefined;
  const result = await notificationService.markAllAsRead(userId);
  return updatedResponse(res, result, 'All notifications marked as read');
});

const deleteNotification = asyncHandler(async (req, res) => {
  const result = await notificationService.deleteNotification(req.params.id);
  return deletedResponse(res, result.message);
});

const deleteAll = asyncHandler(async (req, res) => {
  const result = await notificationService.deleteAll();
  return deletedResponse(res, result.message);
});

module.exports = {
  getNotifications,
  getNotificationById,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAll,
};
