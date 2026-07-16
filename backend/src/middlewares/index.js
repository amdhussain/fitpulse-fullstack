const asyncHandler = require('./asyncHandler');
const errorHandler = require('./errorHandler');
const notFoundHandler = require('./notFoundHandler');
const healthCheck = require('./healthCheck');
const loadSecurityMiddleware = require('./loadSecurity.middleware');
const corsMiddleware = require('./cors.middleware');
const rateLimiter = require('./rateLimiter.middleware');
const compressionMiddleware = require('./compression.middleware');
const requestLogger = require('./requestLogger.middleware');
const configureSecurityHeaders = require('./security.middleware');
const { jsonParser, urlEncodedParser, cookieMiddleware } = require('./bodyParser.middleware');
const { sanitize, hppProtection, sanitizeXSS, hasNoSQLOperators, hasSQLInjection } = require('./sanitize.middleware');
const protect = require('./auth.middleware');
const authorize = require('./role.middleware');

module.exports = {
  asyncHandler,
  errorHandler,
  notFoundHandler,
  healthCheck,
  loadSecurityMiddleware,
  corsMiddleware,
  rateLimiter,
  compressionMiddleware,
  requestLogger,
  configureSecurityHeaders,
  jsonParser,
  urlEncodedParser,
  cookieMiddleware,
  sanitize,
  hppProtection,
  sanitizeXSS,
  hasNoSQLOperators,
  hasSQLInjection,
  protect,
  authorize,
};
