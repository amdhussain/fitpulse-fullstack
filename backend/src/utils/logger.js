const env = require('../config/env');

const LOG_LEVELS = {
  ERROR: 'ERROR',
  WARN: 'WARN',
  INFO: 'INFO',
  DEBUG: 'DEBUG',
};

function formatTimestamp() {
  return new Date().toISOString();
}

function formatLogEntry(level, message, meta = null) {
  const entry = {
    timestamp: formatTimestamp(),
    level,
    message,
  };

  if (meta && Object.keys(meta).length > 0) {
    entry.meta = meta;
  }

  return JSON.stringify(entry);
}

function logError(message, meta = null) {
  const entry = formatLogEntry(LOG_LEVELS.ERROR, message, meta);
  console.error(entry);
}

function logWarn(message, meta = null) {
  const entry = formatLogEntry(LOG_LEVELS.WARN, message, meta);
  console.warn(entry);
}

function logInfo(message, meta = null) {
  const entry = formatLogEntry(LOG_LEVELS.INFO, message, meta);
  console.log(entry);
}

function logDebug(message, meta = null) {
  if (env.isDevelopment) {
    const entry = formatLogEntry(LOG_LEVELS.DEBUG, message, meta);
    console.log(entry);
  }
}

function logRequestError(err, req = null) {
  const meta = {
    name: err.name,
    message: err.message,
    statusCode: err.statusCode,
    isOperational: err.isOperational || false,
  };

  if (req) {
    meta.request = {
      method: req.method,
      url: req.originalUrl || req.url,
      ip: req.ip,
      userAgent: req.get('user-agent'),
    };
  }

  if (!err.isOperational && err.stack) {
    meta.stack = err.stack;
  }

  logError(err.message, meta);
}

module.exports = {
  LOG_LEVELS,
  logError,
  logWarn,
  logInfo,
  logDebug,
  logRequestError,
  error: logError,
  warn: logWarn,
  info: logInfo,
  debug: logDebug,
};
