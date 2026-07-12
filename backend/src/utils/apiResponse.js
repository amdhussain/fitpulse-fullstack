const { HTTP_STATUS } = require('../config/constants');

class ApiResponse {
  static success(res, data = null, message = 'Success', statusCode = HTTP_STATUS.OK) {
    const response = {
      success: true,
      message,
    };

    if (data !== null && data !== undefined) {
      response.data = data;
    }

    return res.status(statusCode).json(response);
  }

  static created(res, data = null, message = 'Created successfully') {
    return this.success(res, data, message, HTTP_STATUS.CREATED);
  }

  static noContent(res) {
    return res.status(HTTP_STATUS.NO_CONTENT).end();
  }

  static error(res, message = 'Internal server error', statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR, errors = null) {
    const response = {
      success: false,
      message,
    };

    if (errors) {
      response.errors = errors;
    }

    return res.status(statusCode).json(response);
  }

  static badRequest(res, message = 'Bad request', errors = null) {
    return this.error(res, message, HTTP_STATUS.BAD_REQUEST, errors);
  }

  static unauthorized(res, message = 'Unauthorized access') {
    return this.error(res, message, HTTP_STATUS.UNAUTHORIZED);
  }

  static forbidden(res, message = 'Forbidden access') {
    return this.error(res, message, HTTP_STATUS.FORBIDDEN);
  }

  static notFound(res, message = 'Resource not found') {
    return this.error(res, message, HTTP_STATUS.NOT_FOUND);
  }

  static conflict(res, message = 'Resource already exists') {
    return this.error(res, message, HTTP_STATUS.CONFLICT);
  }

  static validationError(res, errors = [], message = 'Validation failed') {
    const response = {
      success: false,
      message,
      errors: errors.map((e) => ({
        field: e.path || e.param || e.loc?.path || e.field,
        message: e.msg || e.message,
        value: e.value,
      })),
    };

    return res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).json(response);
  }

  static rateLimited(res, message = 'Too many requests, please try again later') {
    return this.error(res, message, HTTP_STATUS.TOO_MANY_REQUESTS);
  }

  static internalError(res, message = 'Internal server error') {
    return this.error(res, message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }

  static serviceUnavailable(res, message = 'Service temporarily unavailable') {
    return this.error(res, message, HTTP_STATUS.SERVICE_UNAVAILABLE);
  }

  static paginated(res, { data, total, page, limit }) {
    const totalPages = Math.ceil(total / limit);

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  }
}

module.exports = ApiResponse;
