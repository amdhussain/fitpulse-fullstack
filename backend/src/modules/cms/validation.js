const { validateRequest, validateParams, validateQuery } = require('../../validators/middlewares');
const rules = require('../../validators/helpers/rules.helper');
const { body } = require('express-validator');

const CMS_TYPES = ['HERO', 'ABOUT', 'FEATURES', 'SERVICES', 'TRAINERS', 'PRICING', 'TESTIMONIALS', 'FAQ', 'CONTACT', 'FOOTER'];

// ─── Section Validation ──────────────────────────────────

const createSection = validateRequest([
  body('type')
    .trim()
    .notEmpty().withMessage('Type is required')
    .isIn(CMS_TYPES).withMessage(`Type must be one of: ${CMS_TYPES.join(', ')}`),
  rules.optionalText('title', { max: 200 }),
  rules.optionalText('subtitle', { max: 500 }),
  body('content')
    .optional()
    .custom((value) => {
      if (typeof value === 'string') {
        try {
          JSON.parse(value);
          return true;
        } catch {
          return typeof value === 'string';
        }
      }
      return true;
    })
    .withMessage('Content must be valid JSON or an object'),
  body('status')
    .optional()
    .isIn(['ACTIVE', 'DRAFT'])
    .withMessage('Status must be ACTIVE or DRAFT'),
]);

const updateSection = validateRequest([
  rules.optionalText('title', { max: 200 }),
  rules.optionalText('subtitle', { max: 500 }),
  body('content')
    .optional()
    .custom((value) => {
      if (typeof value === 'string') {
        try {
          JSON.parse(value);
          return true;
        } catch {
          return typeof value === 'string';
        }
      }
      return true;
    })
    .withMessage('Content must be valid JSON or an object'),
  body('status')
    .optional()
    .isIn(['ACTIVE', 'DRAFT'])
    .withMessage('Status must be ACTIVE or DRAFT'),
]);

const upsertSection = validateRequest([
  body('type')
    .trim()
    .notEmpty().withMessage('Type is required')
    .isIn(CMS_TYPES).withMessage(`Type must be one of: ${CMS_TYPES.join(', ')}`),
  rules.optionalText('title', { max: 200 }),
  rules.optionalText('subtitle', { max: 500 }),
  body('content')
    .optional()
    .custom((value) => {
      if (typeof value === 'string') {
        try {
          JSON.parse(value);
          return true;
        } catch {
          return typeof value === 'string';
        }
      }
      return true;
    })
    .withMessage('Content must be valid JSON or an object'),
  body('status')
    .optional()
    .isIn(['ACTIVE', 'DRAFT'])
    .withMessage('Status must be ACTIVE or DRAFT'),
]);

// ─── Media Validation ────────────────────────────────────

const createMedia = validateRequest([
  rules.text('title', { min: 1, max: 200 }),
  rules.optionalText('category', { max: 100 }),
  rules.optionalText('description', { max: 1000 }),
  body('image')
    .trim()
    .notEmpty().withMessage('Image URL is required'),
  body('featured')
    .optional()
    .isBoolean()
    .withMessage('Featured must be a boolean')
    .toBoolean(true),
  body('status')
    .optional()
    .isIn(['ACTIVE', 'DRAFT'])
    .withMessage('Status must be ACTIVE or DRAFT'),
]);

const updateMedia = validateRequest([
  rules.optionalText('title', { max: 200 }),
  rules.optionalText('category', { max: 100 }),
  rules.optionalText('description', { max: 1000 }),
  body('image')
    .optional()
    .trim()
    .notEmpty().withMessage('Image URL cannot be empty'),
  body('featured')
    .optional()
    .isBoolean()
    .withMessage('Featured must be a boolean')
    .toBoolean(true),
  body('status')
    .optional()
    .isIn(['ACTIVE', 'DRAFT'])
    .withMessage('Status must be ACTIVE or DRAFT'),
]);

// ─── Query / Params ──────────────────────────────────────

const getMediaList = validateQuery([
  rules.page(),
  rules.limit(),
  rules.sort(['createdAt', 'title', 'category', 'featured']),
  rules.queryText('search'),
  rules.queryText('category'),
  rules.queryText('featured'),
  rules.queryEnum('status', ['ACTIVE', 'DRAFT']),
]);

const typeParam = validateParams({ type: 'string' });
const idParam = validateParams({ id: 'string' });

const getSectionsQuery = validateQuery([
  rules.queryEnum('status', ['ACTIVE', 'DRAFT']),
]);

module.exports = {
  createSection,
  updateSection,
  upsertSection,
  createMedia,
  updateMedia,
  getMediaList,
  typeParam,
  idParam,
  getSectionsQuery,
};
