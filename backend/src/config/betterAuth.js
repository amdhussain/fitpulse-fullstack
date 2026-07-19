const { betterAuth } = require('better-auth');
const { mongodbAdapter } = require('better-auth/adapters/mongodb');
const databaseService = require('../services/databaseService');
const env = require('./env');
const logger = require('../utils/logger');

let authInstance = null;

function getAuth() {
  if (authInstance) return authInstance;

  if (!databaseService.db) {
    throw new Error('Database must be connected before initializing Better Auth');
  }

  authInstance = betterAuth({
    baseURL: env.betterAuth.url,
    secret: env.betterAuth.secret,

    database: mongodbAdapter(databaseService.db, {
      client: databaseService.mongoClient,
    }),

    emailAndPassword: {
      enabled: true,
      autoSignIn: true,
      minPasswordLength: 8,
      maxPasswordLength: 128,
    },

    session: {
      expiresIn: 60 * 60 * 24 * 7,
      updateAge: 60 * 60 * 24,
    },

    user: {
      additionalFields: {
        firstName: {
          type: 'string',
          required: false,
        },
        lastName: {
          type: 'string',
          required: false,
        },
        role: {
          type: 'string',
          required: false,
          defaultValue: 'MEMBER',
        },
      },
    },

    logger: {
      level: 'error',
      log: (level, message, ...args) => {
        if (level === 'error') {
          logger.error(`Better Auth: ${message}`, ...args);
        }
      },
    },
  });

  logger.info('Better Auth initialized');
  return authInstance;
}

module.exports = { getAuth };
