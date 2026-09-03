const NotificationRepository = require('../modules/notification/repository');
const logger = require('../utils/logger');

const notificationService = {
  async create({ type, title, message, relatedId, metadata, userId }) {
    try {
      if (!type || !title || !message) {
        logger.warn('Missing required fields for notification', { type, title });
        return null;
      }
      return await NotificationRepository.create({ type, title, message, relatedId, metadata, userId });
    } catch (error) {
      logger.error('Failed to create notification', { error: error.message, type, title });
      return null;
    }
  },

  async bookingCreated(bookingId, userName, className, dateTime, userId) {
    return this.create({
      type: 'booking',
      title: 'New Booking Confirmed',
      message: `${userName} booked ${className} for ${dateTime}.`,
      relatedId: bookingId,
      userId: userId || null,
    });
  },

  async paymentVerificationRequired(bookingId, userName, email, service, amount, paymentMethod, transactionId) {
    return this.create({
      type: 'booking',
      title: 'New booking payment verification required',
      message: `New booking payment verification required.\n\nCustomer: ${userName}\nEmail: ${email}\nService: ${service}\nPayment: ${paymentMethod}\nAmount: ${amount}\nTransaction ID: ${transactionId}\nBooking ID: ${bookingId}`,
      relatedId: bookingId,
      userId: null,
    });
  },

  async bookingCancelled(bookingId, userName, className, userId) {
    return this.create({
      type: 'booking',
      title: 'Booking Cancelled',
      message: `${userName} cancelled their ${className} session.`,
      relatedId: bookingId,
      userId: userId || null,
    });
  },

  async userRegistered(userId, userName, email) {
    return this.create({
      type: 'membership',
      title: 'New Registration',
      message: `${userName} (${email}) has registered and is awaiting activation.`,
      relatedId: userId,
      userId: null,
    });
  },

  async paymentCompleted(paymentId, userName, amount, planName, userId) {
    return this.create({
      type: 'membership',
      title: 'Payment Received',
      message: `${userName} completed a payment of ${amount} for ${planName}.`,
      relatedId: paymentId,
      userId: userId || null,
    });
  },

  async trainerAdded(trainerId, trainerName, specialization) {
    return this.create({
      type: 'system',
      title: 'New Trainer Added',
      message: `${trainerName} has been added as a trainer (${specialization}).`,
      relatedId: trainerId,
      userId: null,
    });
  },

  async trainerApproved(trainerId, trainerName) {
    return this.create({
      type: 'system',
      title: 'Trainer Approved',
      message: `${trainerName} has been approved and is now active.`,
      relatedId: trainerId,
      userId: null,
    });
  },

  async contactMessageSubmitted(messageId, senderName, subject) {
    return this.create({
      type: 'message',
      title: 'New Contact Message',
      message: `${senderName} sent a message: "${subject}".`,
      relatedId: messageId,
      userId: null,
    });
  },

  async settingsUpdated(settingKey, updatedBy) {
    return this.create({
      type: 'system',
      title: 'Settings Updated',
      message: `System settings were updated by ${updatedBy || 'an administrator'}.`,
      relatedId: settingKey,
      userId: null,
    });
  },
};

module.exports = notificationService;
