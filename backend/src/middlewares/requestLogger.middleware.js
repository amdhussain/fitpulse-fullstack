const morgan = require('morgan');
const env = require('../config/env');

const getFormat = () => {
  if (env.isDevelopment) {
    return 'dev';
  }
  if (env.isProduction) {
    return 'combined';
  }
  return 'short';
};

const requestLogger = morgan(getFormat(), {
  skip(req, res) {
    if (req.path === '/api/v1/health' && res.statusCode === 200) {
      return env.isProduction;
    }
    return false;
  },
});

module.exports = requestLogger;
