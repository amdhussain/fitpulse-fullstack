const { getAuth } = require('./betterAuth');
const databaseService = require('../services/databaseService');
const logger = require('../utils/logger');

const ADMIN_EMAIL = 'admin@fitpulse.com';
const ADMIN_PASSWORD = 'FitPulse@Admin123';
const ADMIN_FIRST_NAME = 'FitPulse';
const ADMIN_LAST_NAME = 'Admin';

async function seedAdmin() {
  try {
    const emailLower = ADMIN_EMAIL.toLowerCase();

    const existingBaUser = await databaseService.db.collection('user').findOne({ email: emailLower });
    const existingAppUser = await databaseService.client.users.findOne({ email: emailLower });

    if (existingBaUser && existingAppUser) {
      logger.info('Admin account already exists, skipping seed');
      return;
    }

    const auth = getAuth();

    let baUserId;

    if (existingBaUser) {
      baUserId = existingBaUser._id.toString();
      logger.info('Admin Better Auth user already exists, skipping Better Auth creation');
    } else {
      const signUpResult = await auth.api.signUpEmail({
        body: {
          name: `${ADMIN_FIRST_NAME} ${ADMIN_LAST_NAME}`,
          email: ADMIN_EMAIL,
          password: ADMIN_PASSWORD,
        },
      });

      if (!signUpResult || signUpResult.error) {
        const message = signUpResult?.error?.message || '';
        if (message.includes('already') || message.includes('exists')) {
          const fallbackBaUser = await databaseService.db.collection('user').findOne({ email: emailLower });
          if (!fallbackBaUser) {
            logger.error('Admin seed failed: could not find Better Auth user after exists error');
            return;
          }
          baUserId = fallbackBaUser._id.toString();
          logger.info('Admin Better Auth user found via fallback lookup');
        } else {
          throw new Error(signUpResult?.error?.message || 'Admin seed failed');
        }
      } else {
        baUserId = signUpResult.user?.id;
        if (!baUserId) {
          throw new Error('Admin seed failed: no user returned from Better Auth');
        }
      }
    }

    if (!existingAppUser) {
      const now = new Date();
      await databaseService.client.users.insertOne({
        _id: databaseService.toObjectId(baUserId),
        firstName: ADMIN_FIRST_NAME,
        lastName: ADMIN_LAST_NAME,
        email: emailLower,
        role: 'ADMIN',
        phone: null,
        profileImage: null,
        isActive: true,
        isVerified: true,
        lastLoginAt: null,
        createdAt: now,
        updatedAt: now,
      });
      logger.info('Default admin account seeded successfully', { email: ADMIN_EMAIL });
    } else {
      logger.info('Admin app profile already exists, skipping');
    }
  } catch (error) {
    logger.error('Failed to seed admin account', { error: error.message });
  }
}

module.exports = seedAdmin;
