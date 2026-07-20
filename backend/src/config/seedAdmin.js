const { getAuth } = require('./betterAuth');
const databaseService = require('../services/databaseService');
const logger = require('../utils/logger');

const ADMIN_EMAIL = 'admin@fitpulse.com';
const ADMIN_PASSWORD = 'FitPulse@Admin123';
const ADMIN_FIRST_NAME = 'FitPulse';
const ADMIN_LAST_NAME = 'Admin';

async function normalizeRoles(usersCollection) {
  const roleMap = [
    { from: 'admin', to: 'ADMIN' },
    { from: 'member', to: 'MEMBER' },
    { from: 'trainer', to: 'TRAINER' },
  ];

  let totalFixed = 0;
  for (const { from, to } of roleMap) {
    const result = await usersCollection.updateMany(
      { role: from },
      { $set: { role: to, updatedAt: new Date() } }
    );
    if (result.modifiedCount > 0) {
      totalFixed += result.modifiedCount;
      logger.info(`Role migration: ${result.modifiedCount} user(s) upgraded from "${from}" to "${to}"`);
    }
  }
  return totalFixed;
}

async function seedAdmin() {
  try {
    const usersCollection = databaseService.client.users;
    const emailLower = ADMIN_EMAIL.toLowerCase();

    // Step 1: Fix all lowercase role values to uppercase
    const fixed = await normalizeRoles(usersCollection);
    if (fixed > 0) {
      logger.info(`Role migration complete: ${fixed} total role(s) normalized`);
    }

    // Step 2: Ensure the admin account always has role: 'ADMIN'
    const existingAppUser = await usersCollection.findOne({ email: emailLower });
    if (existingAppUser && existingAppUser.role !== 'ADMIN') {
      await usersCollection.updateOne(
        { email: emailLower },
        { $set: { role: 'ADMIN', updatedAt: new Date() } }
      );
      logger.info('Admin account role corrected to "ADMIN"');
    }

    // Step 3: Seed admin if it doesn't exist
    const existingBaUser = await databaseService.db.collection('user').findOne({ email: emailLower });

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
      await usersCollection.insertOne({
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
