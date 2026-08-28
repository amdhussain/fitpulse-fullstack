const { validateRequest } = require('../../validators/middlewares');
const rules = require('../../validators/helpers/rules.helper');
const { body } = require('express-validator');

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

const forgotPassword = [
  rules.email('email'),
];

const resetPassword = [
  body('token')
    .trim()
    .notEmpty()
    .withMessage('Reset token is required'),
  body('newPassword')
    .isLength({ min: 8, max: 128 })
    .withMessage('Password must be between 8 and 128 characters'),
];

module.exports = {
  register: validateRequest(register),
  login: validateRequest(login),
  forgotPassword: validateRequest(forgotPassword),
  resetPassword: validateRequest(resetPassword),
};
