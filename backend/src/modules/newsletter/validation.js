const { validateRequest, validateParams, validateQuery } = require('../../validators/middlewares');
const rules = require('../../validators/helpers/rules.helper');
const { body } = require('express-validator');

const addSubscriber = validateRequest([
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Must be a valid email')
    .normalizeEmail(),
  rules.optionalText('name', { max: 100 }),
  rules.optionalText('source', { max: 50 }),
]);

const updateSubscriber = validateRequest([
  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Must be a valid email')
    .normalizeEmail(),
  rules.optionalText('name', { max: 100 }),
  rules.optionalText('status'),
]);

const getAllSubscribers = validateQuery([
  rules.page(),
  rules.limit(),
  rules.sort(['createdAt', 'email', 'name', 'status']),
  rules.queryText('search'),
  rules.queryEnum('status', ['ACTIVE', 'UNSUBSCRIBED']),
]);

const idParam = validateParams({ id: 'string' });

module.exports = {
  addSubscriber,
  updateSubscriber,
  getAllSubscribers,
  idParam,
};
