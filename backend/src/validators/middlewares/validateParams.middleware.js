const { param, validationResult } = require('express-validator');
const { HTTP_STATUS } = require('../../config/constants');
const msg = require('../helpers/messages.helper');

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const MONGO_ID_REGEX = /^[0-9a-fA-F]{24}$/;

// ─── Supported Param Types ─────────────────────────────────
const PARAM_TYPES = {
  mongoId: (name) =>
    param(name)
      .trim()
      .notEmpty().withMessage(msg.required(name))
      .matches(MONGO_ID_REGEX).withMessage(msg.objectId(name)),

  uuid: (name) =>
    param(name)
      .trim()
      .notEmpty().withMessage(msg.required(name))
      .matches(UUID_REGEX).withMessage(msg.uuid),

  integer: (name, { min = 1 } = {}) =>
    param(name)
      .trim()
      .notEmpty().withMessage(msg.required(name))
      .isInt({ min }).withMessage(msg.integer(name))
      .toInt(),

  string: (name) =>
    param(name)
      .trim()
      .notEmpty().withMessage(msg.required(name)),

  slug: (name) =>
    param(name)
      .trim()
      .notEmpty().withMessage(msg.required(name))
      .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).withMessage(msg.slug),
};

// ─── Validate Params Middleware ────────────────────────────
// Validates URL route parameters.
// Usage:
//   router.get('/:id', validateParams({ id: 'mongoId' }));
//   router.get('/:slug', validateParams({ slug: 'slug' }));
//   router.get('/:userId/posts/:postId', validateParams({ userId: 'uuid', postId: 'integer' }));
//
function validateParams(paramDefs, options = {}) {
  const {
    statusCode = HTTP_STATUS.BAD_REQUEST,
    message = 'Invalid route parameters',
  } = options;

  const validations = Object.entries(paramDefs).map(([name, type]) => {
    // Support type as string or object with type + options
    if (typeof type === 'object') {
      const validator = PARAM_TYPES[type.type];
      if (!validator) {
        throw new Error(`Unsupported param type: ${type.type}. Use one of: ${Object.keys(PARAM_TYPES).join(', ')}`);
      }
      return validator(name, type.options || {});
    }

    const validator = PARAM_TYPES[type];
    if (!validator) {
      throw new Error(`Unsupported param type: ${type}. Use one of: ${Object.keys(PARAM_TYPES).join(', ')}`);
    }
    return validator(name);
  });

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
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
        value: err.value,
      })),
    });
  };
}

module.exports = validateParams;
