const NotificationRepository = require('./repository');
const { NotFoundError, BadRequestError } = require('../../errors');
const logger = require('../../utils/logger');

async function createNotification({ type, title, message, relatedId, metadata, userId }) {
  if (!type || !title || !message) {
    throw new BadRequestError('type, title, and message are required');
  }
  const notification = await NotificationRepository.create({ type, title, message, relatedId, metadata, userId });
  logger.info('Notification created', { id: notification.id, type });
  return notification;
}

async function bookingCreated(bookingId, userName, className, dateTime) {
  const notification = await NotificationRepository.create({
    type: 'booking',
    title: 'Booking Successful',
    message: `Your booking for ${className} on ${dateTime} has been confirmed.`,
    relatedId: bookingId,
    metadata: { bookedBy: userName },
    userId: null,
  });
  logger.info('Booking notification created', { id: notification.id });
  return notification;
}

async function bookingCancelled(bookingId, userName, sessionType) {
  const notification = await NotificationRepository.create({
    type: 'booking',
    title: 'Booking Cancelled',
    message: `Your ${sessionType} booking has been cancelled.`,
    relatedId: bookingId,
    metadata: { cancelledBy: userName },
    userId: null,
  });
  logger.info('Booking cancellation notification created', { id: notification.id });
  return notification;
}

async function paymentCompleted(paymentId, userName, amount, plan) {
  const notification = await NotificationRepository.create({
    type: 'payment',
    title: 'Payment Completed',
    message: `Your payment of $${amount} for ${plan} has been completed.`,
    relatedId: paymentId,
    metadata: { amount: parseFloat(amount), plan },
    userId: null,
  });
  logger.info('Payment completion notification created', { id: notification.id });
  return notification;
}

async function paymentVerificationRequired(bookingId, userName, email, serviceName, amount, paymentMethod, transactionId) {
  const notification = await NotificationRepository.create({
    type: 'payment',
    title: 'Payment Verification Required',
    message: `New booking payment verification required from ${userName} (${email}). Service: ${serviceName}, Amount: $${amount}, Method: ${paymentMethod}, Transaction: ${transactionId}`,
    relatedId: bookingId,
    metadata: { bookingId, amount: parseFloat(amount), paymentMethod, transactionId, email },
    userId: null,
  });
  logger.info('Payment verification required notification created', { id: notification.id });
  return notification;
}

async function trainerAdded(trainerId, trainerName, specialization) {
  const notification = await NotificationRepository.create({
    type: 'trainer',
    title: 'New Trainer Added',
    message: `Trainer ${trainerName} has been added with specialization: ${specialization}.`,
    relatedId: trainerId,
    metadata: { specialization },
    userId: null,
  });
  logger.info('Trainer added notification created', { id: notification.id });
  return notification;
}

async function trainerApproved(trainerId, trainerName) {
  const notification = await NotificationRepository.create({
    type: 'trainer',
    title: 'Trainer Approved',
    message: `Trainer ${trainerName} has been approved.`,
    relatedId: trainerId,
    metadata: { trainerName },
    userId: null,
  });
  logger.info('Trainer approved notification created', { id: notification.id });
  return notification;
}

async function getNotifications({ page, limit, type, read, userId }) {
  const where = {};
  if (type) where.type = type;
  if (read !== undefined) where.read = read;
  if (userId) where.userId = userId;

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

async function markAllAsRead(userId) {
  await NotificationRepository.markAllAsRead(userId);
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
  bookingCreated,
  bookingCancelled,
  paymentCompleted,
  paymentVerificationRequired,
  trainerAdded,
  trainerApproved,
  getNotifications,
  getNotificationById,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAll,
};
