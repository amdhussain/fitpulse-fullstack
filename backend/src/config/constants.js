const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

const MESSAGES = {
  WELCOME: 'FitPulse API is running',
  NOT_FOUND: 'Route not found',
  INTERNAL_ERROR: 'Internal server error',
  VALIDATION_ERROR: 'Validation failed',
  RATE_LIMIT: 'Too many requests, please try again later',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Forbidden access',
};

const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};

const SORT_ORDER = {
  ASC: 'ASC',
  DESC: 'DESC',
};

const APP = {
  NAME: 'FitPulse',
  VERSION: 'v1',
  API_PREFIX: '/api/v1',
};

module.exports = {
  HTTP_STATUS,
  MESSAGES,
  PAGINATION,
  SORT_ORDER,
  APP,
  API_VERSION: APP.VERSION,
};
