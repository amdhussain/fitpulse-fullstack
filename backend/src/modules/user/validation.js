const { validateRequest, validateParams, validateQuery } = require('../../validators/middlewares');
const rules = require('../../validators/helpers/rules.helper');
const { body } = require('express-validator');

const updateProfile = [
  rules.optionalName('firstName'),
  rules.optionalName('lastName'),
  rules.optionalPhone('phone'),
  rules.optionalUrl('profileImage'),
];

const changePassword = [
  body('currentPassword')
    .trim()
    .notEmpty().withMessage('Current password is required'),
  rules.password('newPassword'),
];

const updateProfileImage = [
  body('profileImage')
    .trim()
    .notEmpty().withMessage('Profile image URL is required')
    .isURL({ protocols: ['http', 'https'], require_protocol: true })
    .withMessage('Please provide a valid image URL'),
];

const updateRole = [
  body('role')
    .trim()
    .notEmpty().withMessage('Role is required')
    .isIn(['ADMIN', 'TRAINER', 'MEMBER'])
    .withMessage('Role must be ADMIN, TRAINER, or MEMBER'),
];

const getAllUsers = validateQuery([
  rules.page(),
  rules.limit(),
  rules.sort(['createdAt', 'firstName', 'lastName', 'email', 'role']),
  rules.queryText('search'),
  rules.queryEnum('role', ['ADMIN', 'TRAINER', 'MEMBER']),
  rules.queryEnum('isActive', ['true', 'false']),
]);

const idParam = validateParams({ id: 'string' });

const updateAdminProfile = [
  rules.optionalName('firstName'),
  rules.optionalName('lastName'),
  rules.optionalUrl('profileImage'),
];

const updateAdminEmail = [
  rules.email('newEmail'),
  body('password')
    .trim()
    .notEmpty().withMessage('Password is required to change email'),
];

const changeAdminPassword = [
  body('currentPassword')
    .trim()
    .notEmpty().withMessage('Current password is required'),
  rules.password('newPassword'),
];

module.exports = {
  updateProfile: validateRequest(updateProfile),
  changePassword: validateRequest(changePassword),
  updateProfileImage: validateRequest(updateProfileImage),
  updateRole: validateRequest(updateRole),
  getAllUsers,
  idParam,
  updateAdminProfile: validateRequest(updateAdminProfile),
  updateAdminEmail: validateRequest(updateAdminEmail),
  changeAdminPassword: validateRequest(changeAdminPassword),
};
