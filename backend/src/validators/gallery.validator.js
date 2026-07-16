const { validateRequest, validateParams } = require('./middlewares');
const rules = require('./helpers/rules.helper');
const { body } = require('express-validator');

// ─── Gallery Validators ─────────────────────────────────────
// Validation rules for gallery CRUD endpoints.

const create = [
  rules.text('title', { min: 2, max: 200 }),
  rules.optionalText('category', { max: 100 }),
  rules.optionalText('description', { max: 5000 }),
  rules.url('image'),
  body('featured')
    .optional()
    .isBoolean()
    .withMessage('Featured must be a boolean'),
  body('status')
    .optional()
    .isIn(['ACTIVE', 'DRAFT'])
    .withMessage('Status must be ACTIVE or DRAFT'),
];

const update = [
  rules.optionalText('title', { max: 200 }),
  rules.optionalText('category', { max: 100 }),
  rules.optionalText('description', { max: 5000 }),
  rules.optionalUrl('image'),
  body('featured')
    .optional()
    .isBoolean()
    .withMessage('Featured must be a boolean'),
  body('status')
    .optional()
    .isIn(['ACTIVE', 'DRAFT'])
    .withMessage('Status must be ACTIVE or DRAFT'),
];

module.exports = {
  create: validateRequest(create),
  update: validateRequest(update),
  idParam: validateParams({ id: 'string' }),
};
