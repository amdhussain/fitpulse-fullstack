const rateLimit = require('express-rate-limit');
const env = require('../config/env');
const { HTTP_STATUS } = require('../config/constants');

const limiter = rateLimit({
  windowMs: env.rateLimit.windowMs,
  max: env.rateLimit.maxRequests,
  message: {
    success: false,
    statusCode: HTTP_STATUS.TOO_MANY_REQUESTS,
    message: 'Too many requests, please try again later',
    retryAfter: Math.ceil(env.rateLimit.windowMs / 1000),
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler(req, res) {
    res.status(HTTP_STATUS.TOO_MANY_REQUESTS).json({
      success: false,
      statusCode: HTTP_STATUS.TOO_MANY_REQUESTS,
      message: 'Too many requests, please try again later',
      retryAfter: Math.ceil(env.rateLimit.windowMs / 1000),
    });
  },
});

module.exports = limiter;
