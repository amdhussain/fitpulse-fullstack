const { getAuth } = require('./betterAuth');
const databaseService = require('../services/databaseService');
const logger = require('../utils/logger');

const ADMIN_EMAIL = 'admin@fitpulse.com';
const ADMIN_PASSWORD = 'FitPulse@Admin123';
const ADMIN_FIRST_NAME = 'Admin';
const ADMIN_LAST_NAME = 'User';

async function seedAdmin() {
  try {
    const existingAdmin = await databaseService.client.users.findOne({ email: ADMIN_EMAIL.toLowerCase() });
    if (existingAdmin) {
      logger.info('Admin account already exists, skipping seed');
      return;
    }

    const auth = getAuth();

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
        logger.info('Admin account already exists in Better Auth, creating app profile only');
        const baUser = await databaseService.db.collection('user').findOne({ email: ADMIN_EMAIL.toLowerCase() });
        if (baUser) {
          const alreadyHasProfile = await databaseService.client.users.findOne({ email: ADMIN_EMAIL.toLowerCase() });
          if (!alreadyHasProfile) {
            const now = new Date();
            await databaseService.client.users.insertOne({
              _id: databaseService.toObjectId(baUser._id.toString()),
              firstName: ADMIN_FIRST_NAME,
              lastName: ADMIN_LAST_NAME,
              email: ADMIN_EMAIL.toLowerCase(),
              role: 'ADMIN',
              phone: null,
              profileImage: null,
              isActive: true,
              isVerified: true,
              lastLoginAt: null,
              createdAt: now,
              updatedAt: now,
            });
            logger.info('Admin app profile created from existing Better Auth user');
          }
        }
        return;
      }
      throw new Error(signUpResult?.error?.message || 'Admin seed failed');
    }

    const baUser = signUpResult.user;
    if (!baUser) {
      throw new Error('Admin seed failed: no user returned from Better Auth');
    }

    const now = new Date();
    await databaseService.client.users.insertOne({
      _id: databaseService.toObjectId(baUser.id),
      firstName: ADMIN_FIRST_NAME,
      lastName: ADMIN_LAST_NAME,
      email: ADMIN_EMAIL.toLowerCase(),
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
  } catch (error) {
    logger.error('Failed to seed admin account', { error: error.message });
  }
}

module.exports = seedAdmin;
