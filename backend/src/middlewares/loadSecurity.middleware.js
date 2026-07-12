const configureSecurityHeaders = require('./security.middleware');
const corsMiddleware = require('./cors.middleware');
const rateLimiter = require('./rateLimiter.middleware');
const compressionMiddleware = require('./compression.middleware');
const requestLogger = require('./requestLogger.middleware');
const { jsonParser, urlEncodedParser, cookieMiddleware } = require('./bodyParser.middleware');
const { sanitize, hppProtection } = require('./sanitize.middleware');

function loadSecurityMiddleware(app) {
  const securityHeaders = configureSecurityHeaders();

  securityHeaders.forEach((middleware) => app.use(middleware));

  app.use(corsMiddleware);

  app.use(rateLimiter);

  app.use(compressionMiddleware);

  app.use(requestLogger);

  app.use(jsonParser);
  app.use(urlEncodedParser);
  app.use(cookieMiddleware);

  app.use(sanitize);
  app.use(hppProtection);
}

module.exports = loadSecurityMiddleware;
