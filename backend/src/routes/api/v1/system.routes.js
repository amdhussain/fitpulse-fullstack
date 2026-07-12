const { HTTP_STATUS, APP } = require('../../../config/constants');

function systemRoutes(router) {
  router.get('/system', (req, res) => {
    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: {
        application: {
          name: APP.NAME,
          version: '1.0.0',
        },
        environment: process.env.NODE_ENV,
        serverTime: new Date().toISOString(),
        apiVersion: APP.VERSION,
        node: {
          version: process.version,
          platform: process.platform,
          uptime: process.uptime(),
        },
      },
    });
  });
}

module.exports = systemRoutes;
