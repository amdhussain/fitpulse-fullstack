const { sanitizeObject, sanitizeQuery, trimAll } = require('../helpers/sanitize.helper');

// ─── Sanitize Request Middleware ───────────────────────────
// Sanitizes body, query, and params before they reach controllers.
// Usage:
//   app.use(sanitizeRequest());            // Sanitize body + query
//   app.use(sanitizeRequest({ body: true, query: true, params: true }));
//   router.post('/', sanitizeRequest(), validateRequest(rules), controller);
//
function sanitizeRequest(options = {}) {
  const {
    body: sanitizeBody = true,
    query: sanitizeQueryString = true,
    params: sanitizeParams = false,
  } = options;

  return (req, res, next) => {
    if (sanitizeBody && req.body && typeof req.body === 'object') {
      req.body = trimAll(sanitizeObject(req.body));
    }

    if (sanitizeQueryString && req.query && typeof req.query === 'object') {
      req.query = sanitizeQuery(req.query);
    }

    if (sanitizeParams && req.params && typeof req.params === 'object') {
      req.params = trimAll(sanitizeObject(req.params));
    }

    next();
  };
}

module.exports = sanitizeRequest;
