const { validateRequest, validateParams } = require('./middlewares');
const rules = require('./helpers/rules.helper');

// ─── Auth Validators ──────────────────────────────────────
// Uncomment and wire into routes as the auth module is built.

/*
const register = [
  rules.email('email'),
  rules.password('password'),
  rules.passwordConfirmation('password', 'passwordConfirm'),
  rules.name('firstName'),
  rules.name('lastName'),
  rules.enumValue('role', ['member', 'trainer']),
];

const login = [
  rules.email('email'),
  body('password').trim().notEmpty().withMessage('Password is required'),
];

const forgotPassword = [
  rules.email('email'),
];

const resetPassword = [
  body('token').trim().notEmpty().withMessage('Reset token is required'),
  rules.password('password'),
  rules.passwordConfirmation('password', 'passwordConfirm'),
];

const changePassword = [
  body('currentPassword').trim().notEmpty().withMessage('Current password is required'),
  rules.password('newPassword'),
];

const refreshToken = [
  body('refreshToken').trim().notEmpty().withMessage('Refresh token is required'),
];
*/

module.exports = {
  // register: validateRequest(register),
  // login: validateRequest(login),
  // forgotPassword: validateRequest(forgotPassword),
  // resetPassword: validateRequest(resetPassword),
  // changePassword: validateRequest(changePassword),
  // refreshToken: validateRequest(refreshToken),
};
