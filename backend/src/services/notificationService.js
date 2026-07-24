const NotificationRepository = require('../modules/notification/repository');
const logger = require('../utils/logger');

const notificationService = {
  async create({ type, title, message, relatedId, metadata }) {
    try {
      if (!type || !title || !message) {
        logger.warn('Missing required fields for notification', { type, title });
        return null;
      }
      return await NotificationRepository.create({ type, title, message, relatedId, metadata });
    } catch (error) {
      logger.error('Failed to create notification', { error: error.message, type, title });
      return null;
    }
  },

  async bookingCreated(bookingId, userName, className, dateTime) {
    return this.create({
      type: 'booking',
      title: 'New Booking Confirmed',
      message: `${userName} booked ${className} for ${dateTime}.`,
      relatedId: bookingId,
    });
  },

  async bookingCancelled(bookingId, userName, className) {
    return this.create({
      type: 'booking',
      title: 'Booking Cancelled',
      message: `${userName} cancelled their ${className} session.`,
      relatedId: bookingId,
    });
  },

  async userRegistered(userId, userName, email) {
    return this.create({
      type: 'membership',
      title: 'New Registration',
      message: `${userName} (${email}) has registered and is awaiting activation.`,
      relatedId: userId,
    });
  },

  async paymentCompleted(paymentId, userName, amount, planName) {
    return this.create({
      type: 'membership',
      title: 'Payment Received',
      message: `${userName} completed a payment of ${amount} for ${planName}.`,
      relatedId: paymentId,
    });
  },

  async trainerAdded(trainerId, trainerName, specialization) {
    return this.create({
      type: 'system',
      title: 'New Trainer Added',
      message: `${trainerName} has been added as a trainer (${specialization}).`,
      relatedId: trainerId,
    });
  },

  async trainerApproved(trainerId, trainerName) {
    return this.create({
      type: 'system',
      title: 'Trainer Approved',
      message: `${trainerName} has been approved and is now active.`,
      relatedId: trainerId,
    });
  },

  async contactMessageSubmitted(messageId, senderName, subject) {
    return this.create({
      type: 'message',
      title: 'New Contact Message',
      message: `${senderName} sent a message: "${subject}".`,
      relatedId: messageId,
    });
  },

  async settingsUpdated(settingKey, updatedBy) {
    return this.create({
      type: 'system',
      title: 'Settings Updated',
      message: `System settings were updated by ${updatedBy || 'an administrator'}.`,
      relatedId: settingKey,
    });
  },
};

module.exports = notificationService;
