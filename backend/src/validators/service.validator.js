const { validateRequest, validateParams } = require('./middlewares');
const rules = require('./helpers/rules.helper');
const { body } = require('express-validator');

// ─── Service Validators ─────────────────────────────────────
// Validation rules for service CRUD endpoints.

const create = [
  rules.text('name', { min: 2, max: 200 }),
  rules.optionalText('category', { max: 100 }),
  rules.optionalText('description', { max: 5000 }),
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('duration')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Duration must be a positive integer'),
  rules.optionalUrl('image'),
  rules.optionalText('benefits', { max: 5000 }),
  rules.optionalText('trainerId', { max: 191 }),
  body('status')
    .optional()
    .isIn(['ACTIVE', 'DRAFT'])
    .withMessage('Status must be ACTIVE or DRAFT'),
];

const update = [
  rules.optionalText('name', { max: 200 }),
  rules.optionalText('category', { max: 100 }),
  rules.optionalText('description', { max: 5000 }),
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('duration')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Duration must be a positive integer'),
  rules.optionalUrl('image'),
  rules.optionalText('benefits', { max: 5000 }),
  rules.optionalText('trainerId', { max: 191 }),
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
