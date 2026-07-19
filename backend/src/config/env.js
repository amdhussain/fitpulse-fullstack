const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const REQUIRED_VARS = [
  'NODE_ENV',
  'PORT',
  'CLIENT_URL',
  'BETTER_AUTH_SECRET',
  'BETTER_AUTH_URL',
  'COOKIE_SECRET',
  'MONGODB_URI',
];

function validateEnv() {
  const missing = REQUIRED_VARS.filter((key) => !process.env[key] || process.env[key].trim() === '');

  if (missing.length > 0) {
    console.error('');
    console.error('  ╔══════════════════════════════════════════════╗');
    console.error('  ║        MISSING ENVIRONMENT VARIABLES        ║');
    console.error('  ╚══════════════════════════════════════════════╝');
    console.error('');
    missing.forEach((key) => {
      console.error(`    ✗  ${key}`);
    });
    console.error('');
    console.error('  Copy .env.example to .env and fill in the values.');
    console.error('  Then restart the server.');
    console.error('');
    process.exit(1);
  }
}

validateEnv();

function requireEnv(key) {
  return process.env[key];
}

function optionalEnv(key, defaultValue = '') {
  return process.env[key] || defaultValue;
}

function parseNumber(value, fallback) {
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? fallback : parsed;
}

const env = {
  nodeEnv: requireEnv('NODE_ENV'),
  port: parseNumber(requireEnv('PORT'), 5000),
  clientUrl: requireEnv('CLIENT_URL'),
  apiPrefix: optionalEnv('API_PREFIX', '/api/v1'),

  jwt: {
    secret: optionalEnv('JWT_SECRET', ''),
    expiresIn: optionalEnv('JWT_EXPIRES_IN', '7d'),
  },

  betterAuth: {
    secret: requireEnv('BETTER_AUTH_SECRET'),
    url: requireEnv('BETTER_AUTH_URL'),
  },

  cookie: {
    secret: requireEnv('COOKIE_SECRET'),
    maxAge: parseNumber(optionalEnv('COOKIE_MAX_AGE', '86400000'), 86400000),
  },

  database: {
    url: requireEnv('MONGODB_URI'),
    name: optionalEnv('MONGODB_DB', 'fitpulse_db'),
  },

  rateLimit: {
    windowMs: parseNumber(optionalEnv('RATE_LIMIT_WINDOW_MS', '900000'), 900000),
    maxRequests: parseNumber(optionalEnv('RATE_LIMIT_MAX_REQUESTS', '100'), 100),
  },

  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
  isTest: process.env.NODE_ENV === 'test',
};

module.exports = env;
