const NotificationRepository = require('./repository');
const { NotFoundError, BadRequestError } = require('../../errors');
const logger = require('../../utils/logger');

async function createNotification({ type, title, message, relatedId, metadata }) {
  if (!type || !title || !message) {
    throw new BadRequestError('type, title, and message are required');
  }
  const notification = await NotificationRepository.create({ type, title, message, relatedId, metadata });
  logger.info('Notification created', { id: notification.id, type });
  return notification;
}

async function getNotifications({ page, limit, type, read }) {
  const where = {};
  if (type) where.type = type;
  if (read !== undefined) where.read = read;

  return NotificationRepository.findMany({ where, page, limit });
}

async function getNotificationById(id) {
  const notification = await NotificationRepository.findById(id);
  if (!notification) throw new NotFoundError('Notification not found');
  return notification;
}

async function markAsRead(id) {
  const notification = await NotificationRepository.findById(id);
  if (!notification) throw new NotFoundError('Notification not found');
  return NotificationRepository.markAsRead(id);
}

async function markAllAsRead() {
  await NotificationRepository.markAllAsRead();
  return { message: 'All notifications marked as read' };
}

async function deleteNotification(id) {
  const notification = await NotificationRepository.findById(id);
  if (!notification) throw new NotFoundError('Notification not found');
  await NotificationRepository.deleteOne(id);
  return { message: 'Notification deleted successfully' };
}

async function deleteAll() {
  await NotificationRepository.deleteAll();
  return { message: 'All notifications deleted' };
}

module.exports = {
  createNotification,
  getNotifications,
  getNotificationById,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAll,
};
