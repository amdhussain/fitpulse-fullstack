const { HTTP_STATUS } = require('../config/constants');

function notFoundHandler(req, res) {
  res.status(HTTP_STATUS.NOT_FOUND).json({
    success: false,
    statusCode: HTTP_STATUS.NOT_FOUND,
    message: 'API Route Not Found',
    path: req.originalUrl,
    method: req.method,
  });
}

module.exports = notFoundHandler;
