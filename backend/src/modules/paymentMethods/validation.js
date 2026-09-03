const { validateRequest, validateParams, validateQuery } = require('../../validators/middlewares');
const rules = require('../../validators/helpers/rules.helper');
const { body } = require('express-validator');

const createPaymentMethod = validateRequest([
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 1, max: 100 }).withMessage('Name must be between 1 and 100 characters'),
  rules.optionalText('nameBn', { max: 100 }),
  body('type')
    .trim()
    .notEmpty().withMessage('Type is required')
    .isIn(['MOBILE_BANKING', 'CARD', 'BANK_TRANSFER', 'CASH', 'OTHER'])
    .withMessage('Type must be MOBILE_BANKING, CARD, BANK_TRANSFER, CASH, or OTHER'),
  rules.optionalText('description', { max: 500 }),
  rules.optionalText('icon', { max: 50 }),
  rules.optionalText('isActive', { max: 5 }),
  rules.optionalPositiveInteger('sortOrder'),
]);

const updatePaymentMethod = validateRequest([
  rules.optionalText('name', { max: 100 }),
  rules.optionalText('nameBn', { max: 100 }),
  rules.optionalEnum('type', ['MOBILE_BANKING', 'CARD', 'BANK_TRANSFER', 'CASH', 'OTHER']),
  rules.optionalText('description', { max: 500 }),
  rules.optionalText('icon', { max: 50 }),
  body('isActive').optional().toBoolean(true),
  rules.optionalPositiveInteger('sortOrder'),
]);

const getAllPaymentMethods = validateQuery([
  rules.page(),
  rules.limit(),
  rules.sort(['name', 'type', 'sortOrder', 'createdAt']),
  rules.queryText('search'),
  rules.queryEnum('type', ['MOBILE_BANKING', 'CARD', 'BANK_TRANSFER', 'CASH', 'OTHER']),
]);

const idParam = validateParams({ id: 'string' });

module.exports = {
  createPaymentMethod,
  updatePaymentMethod,
  getAllPaymentMethods,
  idParam,
};
