const express = require('express');

const env = require('./config/env');
const { HTTP_STATUS, MESSAGES } = require('./config/constants');
const { loadSecurityMiddleware, errorHandler, notFoundHandler } = require('./middlewares');
const routes = require('./routes');

const app = express();

// ─── Security Middleware ──────────────────────────────────
loadSecurityMiddleware(app);

// ─── Root Welcome ────────────────────────────────────────
app.get('/', (req, res) => {
  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: MESSAGES.WELCOME,
    version: 'v1',
    docs: `${env.apiPrefix}`,
  });
});

// ─── API Routes ──────────────────────────────────────────
app.use('/api', routes);

// ─── 404 Handler ─────────────────────────────────────────
app.use(notFoundHandler);

// ─── Global Error Handler ────────────────────────────────
app.use(errorHandler);

module.exports = app;
