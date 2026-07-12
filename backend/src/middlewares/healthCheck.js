function healthCheck(req, res) {
  const { HTTP_STATUS } = require('../config/constants');
  const { modulesHealthCheck } = require('../modules');

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'FitPulse API is healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    modules: modulesHealthCheck(),
  });
}

module.exports = healthCheck;
