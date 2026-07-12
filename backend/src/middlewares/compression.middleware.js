const compression = require('compression');
const env = require('../config/env');

const shouldCompress = (req, res) => {
  if (req.headers['x-no-compression']) {
    return false;
  }
  return compression.filter(req, res);
};

const compressionMiddleware = compression({
  filter: shouldCompress,
  level: env.isProduction ? 6 : 1,
  threshold: 1024,
  memLevel: 8,
});

module.exports = compressionMiddleware;
