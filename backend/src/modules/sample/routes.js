const { HTTP_STATUS } = require('../../config/constants');

function sampleRoutes(router) {
  router.get('/', (req, res) => {
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Sample module is working',
      timestamp: new Date().toISOString(),
    });
  });
}

module.exports = sampleRoutes;
