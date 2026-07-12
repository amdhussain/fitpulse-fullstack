const env = require('../config/env');
const { HTTP_STATUS, MESSAGES } = require('../config/constants');
const { logRequestError } = require('../utils/logger');

function errorHandler(err, req, res, _next) {
  const statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  const message = err.message || MESSAGES.INTERNAL_ERROR;

  logRequestError(err, req);

  if (err.name === 'SyntaxError' && err.status === 400 && 'body' in err) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      statusCode: HTTP_STATUS.BAD_REQUEST,
      message: 'Invalid JSON in request body',
    });
  }

  if (err.type === 'entity.too.large') {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      statusCode: HTTP_STATUS.BAD_REQUEST,
      message: 'Request body too large',
    });
  }

  if (err.isOperational) {
    const response = {
      success: false,
      statusCode,
      message,
    };

    if (err.errors) {
      response.errors = err.errors;
    }

    return res.status(statusCode).json(response);
  }

  if (Array.isArray(err.errors) && err.errors.length > 0) {
    return res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).json({
      success: false,
      statusCode: HTTP_STATUS.UNPROCESSABLE_ENTITY,
      message: MESSAGES.VALIDATION_ERROR,
      errors: err.errors.map((e) => ({
        field: e.path || e.param || e.loc?.path,
        message: e.msg || e.message,
        value: e.value,
      })),
    });
  }

  return res.status(statusCode).json({
    success: false,
    statusCode,
    message: env.isProduction ? MESSAGES.INTERNAL_ERROR : message,
  });
}

module.exports = errorHandler;
