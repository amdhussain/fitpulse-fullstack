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

    // Step 2: Check existing records
    const existingBaUser = await databaseService.db.collection('user').findOne({ email: emailLower });
    const existingAppUser = await usersCollection.findOne({ email: emailLower });

    // Step 3: Ensure the admin account always has role: 'ADMIN'
    if (existingAppUser && existingAppUser.role !== 'ADMIN') {
      await usersCollection.updateOne(
        { email: emailLower },
        { $set: { role: 'ADMIN', updatedAt: new Date() } }
      );
      logger.info('Admin account role corrected to "ADMIN"');
    }

    // Step 4: Delete existing Better Auth user if present, then re-create with correct password
    if (existingBaUser) {
      await databaseService.db.collection('user').deleteOne({ email: emailLower });
      logger.info('Removed existing Better Auth admin user to force password re-hash');
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
      throw new Error(signUpResult?.error?.message || 'Admin seed failed during signUpEmail');
    }

    const baUserId = signUpResult.user?.id;
    if (!baUserId) {
      throw new Error('Admin seed failed: no user returned from Better Auth');
    }

    // Step 5: Ensure app profile exists in users collection with correct _id
    const now = new Date();
    const appProfileData = {
      _id: databaseService.toObjectId(baUserId),
      firstName: ADMIN_FIRST_NAME,
      lastName: ADMIN_LAST_NAME,
      email: emailLower,
      role: 'ADMIN',
      phone: existingAppUser?.phone || null,
      profileImage: existingAppUser?.profileImage || null,
      isActive: true,
      isVerified: true,
      lastLoginAt: existingAppUser?.lastLoginAt || null,
      createdAt: existingAppUser?.createdAt || now,
      updatedAt: now,
    };

    if (!existingAppUser) {
      await usersCollection.insertOne(appProfileData);
      logger.info('Default admin account seeded successfully', { email: ADMIN_EMAIL });
    } else if (existingAppUser._id.toString() !== baUserId) {
      // _id mismatch: delete old profile and re-insert with correct _id
      await usersCollection.deleteOne({ _id: existingAppUser._id });
      await usersCollection.insertOne(appProfileData);
      logger.info('Admin app profile re-linked to new Better Auth user');
    } else {
      // _id matches, just ensure role and timestamps are correct
      await usersCollection.updateOne(
        { _id: existingAppUser._id },
        { $set: { role: 'ADMIN', updatedAt: now } }
      );
      logger.info('Admin app profile verified, password re-hashed successfully');
    }
  } catch (error) {
    logger.error('Failed to seed admin account', { error: error.message });
  }
}

module.exports = seedAdmin;
