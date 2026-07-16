const { validateRequest, validateParams } = require('./middlewares');
const rules = require('./helpers/rules.helper');
const { body, param } = require('express-validator');
const cmsService = require('../services/cms.service');

// ─── CMS Validators ────────────────────────────────────────
// Validation rules for CMS section endpoints.

const typeParam = [
  param('type')
    .trim()
    .notEmpty()
    .withMessage('Type is required')
    .isIn(cmsService.VALID_TYPES)
    .withMessage(`Type must be one of: ${cmsService.VALID_TYPES.join(', ')}`),
];

const upsert = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),
  body('subtitle')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Subtitle must be at most 500 characters'),
  body('content')
    .optional()
    .custom((value) => {
      if (typeof value === 'object' || typeof value === 'string') return true;
      throw new Error('Content must be an object or JSON string');
    }),
  body('status')
    .optional()
    .isIn(['ACTIVE', 'DRAFT'])
    .withMessage('Status must be ACTIVE or DRAFT'),
];

module.exports = {
  typeParam: validateParams({ type: 'string' }),
  upsert: [...typeParam, ...upsert],
};
