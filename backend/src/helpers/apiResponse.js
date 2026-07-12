const { HTTP_STATUS } = require('../config/constants');

function successResponse(res, data = null, message = 'Request successful', statusCode = HTTP_STATUS.OK) {
  const response = {
    success: true,
    message,
  };

  if (data !== null && data !== undefined) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
}

function createdResponse(res, data = null, message = 'Resource created successfully') {
  return successResponse(res, data, message, HTTP_STATUS.CREATED);
}

function updatedResponse(res, data = null, message = 'Resource updated successfully') {
  return successResponse(res, data, message, HTTP_STATUS.OK);
}

function deletedResponse(res, message = 'Resource deleted successfully') {
  return res.status(HTTP_STATUS.OK).json({
    success: true,
    message,
  });
}

function noContentResponse(res) {
  return res.status(HTTP_STATUS.NO_CONTENT).end();
}

function errorResponse(res, message = 'Internal server error', statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR, errors = null) {
  const response = {
    success: false,
    statusCode,
    message,
  };

  if (errors) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
}

function paginatedResponse(res, { data, total, page, limit }) {
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

module.exports = {
  successResponse,
  createdResponse,
  updatedResponse,
  deletedResponse,
  noContentResponse,
  errorResponse,
  paginatedResponse,
};
