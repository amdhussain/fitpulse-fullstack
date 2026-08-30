const { betterAuth } = require('better-auth');
const { mongodbAdapter } = require('better-auth/adapters/mongodb');
const { google } = require('better-auth/social-providers');
const databaseService = require('../services/databaseService');
const env = require('./env');
const logger = require('../utils/logger');

let authInstance = null;

const pendingResetTokens = new Map();

function consumeResetToken(email) {
  const data = pendingResetTokens.get(email);
  if (!data) return null;
  pendingResetTokens.delete(email);
  return data;
}

function getAuth() {
  if (authInstance) return authInstance;

  if (!databaseService.db) {
    throw new Error('Database must be connected before initializing Better Auth');
  }

  authInstance = betterAuth({
    baseURL: env.betterAuth.url,
    secret: env.betterAuth.secret,
    basePath: '/api/v1/auth',

    trustedOrigins: [env.clientUrl],

    database: mongodbAdapter(databaseService.db, {
      client: databaseService.mongoClient,
    }),

    emailAndPassword: {
      enabled: true,
      autoSignIn: true,
      minPasswordLength: 8,
      maxPasswordLength: 128,
      sendResetPassword: async ({ user, url, token }, request) => {
        pendingResetTokens.set(user.email, { token, url, timestamp: Date.now() });
        logger.info('Password reset token generated', { email: user.email });
      },
    },

    socialProviders: {
      google: {
        clientId: env.google.clientId,
        clientSecret: env.google.clientSecret,
      },
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
  logger.info('Google OAuth configured', {
    clientId: env.google.clientId ? `${env.google.clientId.substring(0, 12)}...` : 'NOT SET',
    clientSecret: env.google.clientSecret ? 'SET' : 'NOT SET',
    redirectURI: `${env.betterAuth.url.replace(/\/+$/, '')}/api/v1/auth/google/callback`,
  });
  return authInstance;
}

module.exports = { getAuth, consumeResetToken };
