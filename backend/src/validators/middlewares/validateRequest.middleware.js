const { validationResult } = require('express-validator');
const { HTTP_STATUS, MESSAGES } = require('../../config/constants');

// ─── Default Error Formatter ───────────────────────────────
function defaultFormatError(err) {
  return {
    field: err.path,
    message: err.msg,
    ...(err.value !== undefined && { value: err.value }),
  };
}

// ─── Validate Request Middleware ───────────────────────────
// Runs an array of express-validator validation chains.
// Usage:
//   router.post('/login', validateRequest(loginRules));
//   router.post('/login', validateRequest(loginRules, { stopOnFirstError: false }));
//
function validateRequest(validations, options = {}) {
  const {
    stopOnFirstError = false,
    formatError = defaultFormatError,
    statusCode = HTTP_STATUS.BAD_REQUEST,
    message = MESSAGES.VALIDATION_ERROR,
  } = options;

  return async (req, res, next) => {
    // Run all validation chains
    for (const validation of validations) {
      const result = await validation.run(req);

      // Short-circuit on first error if configured
      if (stopOnFirstError && result.errors.length) {
        break;
      }
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

module.exports = validateRequest;
