const { validateRequest } = require('./middlewares');
const rules = require('./helpers/rules.helper');
const { body } = require('express-validator');

// ─── Auth Validators ──────────────────────────────────────
// Validation rules for authentication endpoints.
// Used by auth.routes.js.

const register = [
  rules.name('firstName'),
  rules.name('lastName'),
  rules.email('email'),
  rules.password('password'),
  rules.passwordConfirmation('password', 'passwordConfirm'),
  body('role')
    .optional()
    .isIn(['MEMBER', 'TRAINER'])
    .withMessage('Role must be MEMBER or TRAINER'),
];

const login = [
  rules.email('email'),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required'),
];

module.exports = {
  register: validateRequest(register),
  login: validateRequest(login),
};
