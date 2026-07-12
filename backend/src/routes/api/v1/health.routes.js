const { HTTP_STATUS } = require('../../../config/constants');
const { modulesHealthCheck } = require('../../../modules');

function healthRoutes(router) {
  router.get('/health', (req, res) => {
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'FitPulse Backend is running successfully',
      version: 'v1',
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      modules: modulesHealthCheck(),
    });
  });
}

module.exports = healthRoutes;
