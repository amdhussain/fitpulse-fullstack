const { HTTP_STATUS } = require('../config/constants');

// ─── XSS Protection ───────────────────────────────────────
// Strip HTML tags and dangerous characters from string inputs.
// When a sanitization library (e.g. xss, sanitize-html) is installed,
// replace this with the library's filter function.
function sanitizeXSS(value) {
  if (typeof value !== 'string') return value;
  return value
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

// ─── NoSQL Injection Protection ────────────────────────────
// Detect and reject objects with operator keys ($where, $gt, etc.)
// When mongoose-sanitize or similar is installed, replace this.
const NOSQL_OPERATORS = [
  '$where', '$gt', '$gte', '$lt', '$lte', '$ne', '$in',
  '$nin', '$regex', '$exists', '$and', '$or', '$not', '$nor',
];

function hasNoSQLOperators(obj) {
  if (!obj || typeof obj !== 'object') return false;
  if (Array.isArray(obj)) {
    return obj.some((item) => hasNoSQLOperators(item));
  }
  for (const key of Object.keys(obj)) {
    if (NOSQL_OPERATORS.includes(key)) return true;
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      if (hasNoSQLOperators(obj[key])) return true;
    }
  }
  return false;
}

// ─── SQL Injection Detection ───────────────────────────────
// Flag common SQL injection patterns in string values.
// When a proper library is installed, replace with parameterized queries.
const SQL_INJECTION_PATTERNS = [
  /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|FETCH|DECLARE|TRUNCATE)\b)/i,
  /(--|;|\/\*|\*\/|xp_|sp_)/i,
  /('(\s)*(OR|AND)(\s)*')/i,
  /(\b(OR|AND)\b\s+\d+\s*=\s*\d+)/i,
];

function hasSQLInjection(value) {
  if (typeof value !== 'string') return false;
  return SQL_INJECTION_PATTERNS.some((pattern) => pattern.test(value));
}

// ─── Recursively sanitize object values ────────────────────
function sanitizeObject(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeObject(item));
  }
  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeXSS(value);
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeObject(value);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
}

// ─── Main Sanitization Middleware ──────────────────────────
function sanitize(req, res, next) {
  // ── 1. Sanitize body ──
  if (req.body && typeof req.body === 'object') {
    if (hasNoSQLOperators(req.body)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        statusCode: HTTP_STATUS.BAD_REQUEST,
        message: 'Request body contains invalid characters',
      });
    }
    req.body = sanitizeObject(req.body);
  }

  // ── 2. Sanitize query parameters ──
  if (req.query && typeof req.query === 'object') {
    if (hasNoSQLOperators(req.query)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        statusCode: HTTP_STATUS.BAD_REQUEST,
        message: 'Query parameters contain invalid characters',
      });
    }
    req.query = sanitizeObject(req.query);
  }

  // ── 3. Sanitize URL params ──
  if (req.params && typeof req.params === 'object') {
    req.params = sanitizeObject(req.params);
  }

  next();
}

// ─── HTTP Parameter Pollution Protection ───────────────────
// Detect duplicate query parameters that could cause injection.
// Express 5's qs parser converts duplicate keys to arrays,
// so we detect arrays in query values as proof of duplication.
// When hpp is installed, replace this with hpp({ whitelist: [...] }).
function hppProtection(req, res, next) {
  for (const [key, value] of Object.entries(req.query)) {
    if (Array.isArray(value)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        statusCode: HTTP_STATUS.BAD_REQUEST,
        message: `Duplicate query parameter '${key}' is not allowed`,
      });
    }
  }
  next();
}

module.exports = {
  sanitize,
  hppProtection,
  sanitizeXSS,
  hasNoSQLOperators,
  hasSQLInjection,
};
