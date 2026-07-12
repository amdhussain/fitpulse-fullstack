const helmet = require('helmet');
const env = require('../config/env');

function configureSecurityHeaders() {
  const middlewares = [];

  // ─── Disable X-Powered-By ──────────────────────────────
  middlewares.push((req, res, next) => {
    res.removeHeader('X-Powered-By');
    next();
  });

  // ─── Helmet Configuration ──────────────────────────────
  const helmetConfig = {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        fontSrc: ["'self'"],
        connectSrc: ["'self'"],
        frameSrc: ["'none'"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: env.isProduction ? [] : null,
      },
    },
    crossOriginEmbedderPolicy: env.isProduction,
    crossOriginOpenerPolicy: { policy: 'same-origin' },
    crossOriginResourcePolicy: { policy: 'same-site' },
    dnsPrefetchControl: { allow: false },
    frameguard: { action: 'deny' },
    hidePoweredBy: true,
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
    ieNoOpen: true,
    noSniff: true,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    xssFilter: true,
  };

  if (env.isDevelopment) {
    helmetConfig.contentSecurityPolicy = false;
    helmetConfig.hsts = false;
  }

  middlewares.push(helmet(helmetConfig));

  return middlewares;
}

module.exports = configureSecurityHeaders;
