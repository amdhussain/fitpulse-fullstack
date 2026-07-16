const { validateRequest, validateParams } = require('./middlewares');
const rules = require('./helpers/rules.helper');
const { body } = require('express-validator');

// ─── Settings Validators ────────────────────────────────────
// Validation rules for site settings endpoints.

const set = [
  body('value')
    .exists()
    .withMessage('Value is required'),
];

const setMany = [
  body('settings')
    .isObject()
    .withMessage('Settings must be an object'),
  body('settings.*')
    .exists()
    .withMessage('Each setting must have a value'),
];

module.exports = {
  set: validateRequest(set),
  setMany: validateRequest(setMany),
  keyParam: validateParams({ key: 'string' }),
};
