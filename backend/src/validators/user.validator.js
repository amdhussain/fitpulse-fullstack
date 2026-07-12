const { validateRequest, validateParams } = require('./middlewares');
const rules = require('./helpers/rules.helper');

// ─── User Validators ──────────────────────────────────────
// Uncomment and wire into routes as the user module is built.

/*
const getProfile = [
  validateParams({ id: 'mongoId' }),
];

const updateProfile = [
  rules.optionalName('firstName'),
  rules.optionalName('lastName'),
  rules.optionalPhone(),
  rules.optionalUrl('profileImage'),
];

const updateEmail = [
  rules.email('email'),
  rules.password('currentPassword'),
];

const deleteAccount = [
  rules.password('password'),
];

const listUsers = [
  rules.page(),
  rules.limit(),
  rules.sort(['createdAt', 'firstName', 'lastName', 'email']),
  rules.queryEmail(),
  rules.queryText('search'),
  rules.queryEnum('role', ['member', 'trainer', 'admin']),
];

const getUser = [
  validateParams({ id: 'mongoId' }),
];
*/

module.exports = {
  // getProfile: validateRequest(getProfile),
  // updateProfile: validateRequest(updateProfile),
  // updateEmail: validateRequest(updateEmail),
  // deleteAccount: validateRequest(deleteAccount),
  // listUsers: validateRequest(listUsers),
  // getUser: validateRequest(getUser),
};
