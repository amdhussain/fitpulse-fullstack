const crypto = require('crypto');
const databaseService = require('./databaseService');
const emailService = require('./emailService');
const logger = require('../utils/logger');

const OTP_EXPIRY_MINUTES = 10;
const OTP_LENGTH = 6;

function generateOtp() {
  const digits = '0123456789';
  let otp = '';
  const bytes = crypto.randomBytes(OTP_LENGTH);
  for (let i = 0; i < OTP_LENGTH; i++) {
    otp += digits[bytes[i] % 10];
  }
  return otp;
}

const otpService = {
  async create({ userId, purpose, metadata, email, userName }) {
    const code = generateOtp();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + OTP_EXPIRY_MINUTES * 60 * 1000);

    await databaseService.client.otps.deleteMany({
      userId: userId,
      purpose,
      verified: false,
    });

    const result = await databaseService.client.otps.insertOne({
      userId,
      code,
      purpose,
      metadata: metadata || {},
      verified: false,
      attempts: 0,
      createdAt: now,
      expiresAt,
    });

    logger.info('OTP created', { userId, purpose, otpId: result.insertedId.toString() });

    if (email) {
      emailService.sendOtpEmail({
        to: email,
        userName,
        otpCode: code,
        expiresInMinutes: OTP_EXPIRY_MINUTES,
      }).catch((err) => {
        logger.error('Failed to send OTP email', { userId, error: err.message });
      });
    }

    return {
      id: result.insertedId.toString(),
      code,
      expiresAt,
      expiresInMinutes: OTP_EXPIRY_MINUTES,
    };
  },

  async verify({ userId, purpose, code }) {
    const now = new Date();

    const otpDoc = await databaseService.client.otps.findOne({
      userId,
      purpose,
      verified: false,
      expiresAt: { $gt: now },
    }, { sort: { createdAt: -1 } });

    if (!otpDoc) {
      return { success: false, message: 'OTP expired or not found. Please request a new one.' };
    }

    if (otpDoc.attempts >= 5) {
      await databaseService.client.otps.updateOne(
        { _id: otpDoc._id },
        { $set: { verified: true } }
      );
      return { success: false, message: 'Too many attempts. Please request a new OTP.' };
    }

    if (otpDoc.code !== code) {
      await databaseService.client.otps.updateOne(
        { _id: otpDoc._id },
        { $inc: { attempts: 1 } }
      );
      return { success: false, message: `Invalid OTP. ${5 - otpDoc.attempts - 1} attempts remaining.` };
    }

    await databaseService.client.otps.updateOne(
      { _id: otpDoc._id },
      { $set: { verified: true } }
    );

    logger.info('OTP verified', { userId, purpose });

    return { success: true, message: 'OTP verified successfully', metadata: otpDoc.metadata };
  },

  async cleanup() {
    const result = await databaseService.client.otps.deleteMany({
      $or: [
        { expiresAt: { $lt: new Date() } },
        { verified: true, createdAt: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
      ],
    });
    if (result.deletedCount > 0) {
      logger.info('OTP cleanup completed', { deleted: result.deletedCount });
    }
  },

  async getRecentByPurpose(userId, purpose) {
    return databaseService.client.otps.findOne(
      { userId, purpose },
      { sort: { createdAt: -1 } }
    );
  },
};

module.exports = otpService;
