const { validationResult } = require('express-validator');
const { HTTP_STATUS } = require('../../config/constants');

// ─── Default Error Formatter ───────────────────────────────
function defaultFormatError(err) {
  return {
    field: err.path,
    message: err.msg,
    ...(err.value !== undefined && { value: err.value }),
  };
}

// ─── Validate Query Middleware ─────────────────────────────
// Validates query string parameters (filters, pagination, search, etc.).
// Usage:
//   router.get('/', validateQuery([
//     query('category').optional().isIn(['yoga', 'pilates']),
//     rules.page(),
//     rules.limit(),
//     rules.sort(['createdAt', 'name']),
//   ]));
//
function validateQuery(validations, options = {}) {
  const {
    statusCode = HTTP_STATUS.BAD_REQUEST,
    message = 'Invalid query parameters',
    formatError = defaultFormatError,
  } = options;

  return async (req, res, next) => {
    for (const validation of validations) {
      const result = await validation.run(req);
      if (result.errors.length) break;
    }

    const errors = validationResult(req);
    if (errors.isEmpty()) return next();

    return res.status(statusCode).json({
      success: false,
      statusCode,
      message,
      errors: errors.array().map(formatError),
    });
  };
}

module.exports = validateQuery;
