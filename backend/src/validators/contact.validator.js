const { validateRequest, validateParams } = require('./middlewares');
const rules = require('./helpers/rules.helper');
const { body } = require('express-validator');

// ─── Contact Validators ─────────────────────────────────────
// Validation rules for contact form submission and message
// management endpoints.

const submit = [
  rules.name('name'),
  rules.email('email'),
  rules.optionalPhone('phone'),
  rules.optionalText('subject', { max: 200 }),
  rules.text('message', { min: 10, max: 5000 }),
];

module.exports = {
  submit: validateRequest(submit),
  idParam: validateParams({ id: 'string' }),
};
