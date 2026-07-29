const cors = require('cors');
const env = require('../config/env');

const ALLOWED_ORIGINS = [
  env.clientUrl,
  'http://localhost:5173',
  'https://fitpulse-fullstack-1zmwtnq3x-md-hussain-ahmed-s-projects.vercel.app',
];

if (env.isDevelopment) {
  ALLOWED_ORIGINS.push('http://localhost:3000');
  ALLOWED_ORIGINS.push('http://localhost:5000');
}

const corsOptions = {
  origin(origin, callback) {
    if (!origin || ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['X-Total-Count', 'X-Pagination-Page', 'X-Pagination-Limit'],
  maxAge: 86400,
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

module.exports = cors(corsOptions);
