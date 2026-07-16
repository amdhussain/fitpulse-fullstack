const { validateRequest, validateParams, validateQuery } = require('../../validators/middlewares');
const rules = require('../../validators/helpers/rules.helper');
const { body } = require('express-validator');

const VALID_GROUPS = ['general', 'social', 'email', 'seo', 'security'];

// ─── Update Single Setting ───────────────────────────────

const updateSetting = validateRequest([
  body('value')
    .exists({ checkNull: false })
    .withMessage('Value is required'),
]);

// ─── Update Multiple Settings ────────────────────────────

const updateSettings = validateRequest([
  body('settings')
    .isArray({ min: 1 }).withMessage('Settings must be a non-empty array'),
  body('settings.*.key')
    .trim()
    .notEmpty().withMessage('Setting key is required'),
  body('settings.*.value')
    .exists({ checkNull: false })
    .withMessage('Setting value is required'),
]);

// ─── Update Group Settings ───────────────────────────────

const updateGroupSettings = validateRequest([
  body('site_name').optional().trim(),
  body('site_description').optional().trim(),
  body('logo').optional().trim(),
  body('favicon').optional().trim(),
  body('contact_email').optional().trim().isEmail().withMessage('Invalid email'),
  body('contact_phone').optional().trim(),
  body('address').optional().trim(),
  body('business_hours').optional(),
  body('social_facebook').optional().trim().isURL().withMessage('Invalid URL'),
  body('social_instagram').optional().trim().isURL().withMessage('Invalid URL'),
  body('social_linkedin').optional().trim().isURL().withMessage('Invalid URL'),
  body('social_youtube').optional().trim().isURL().withMessage('Invalid URL'),
  body('social_twitter').optional().trim().isURL().withMessage('Invalid URL'),
  body('smtp_host').optional().trim(),
  body('smtp_port').optional().trim().isInt({ min: 1, max: 65535 }).withMessage('Invalid port'),
  body('smtp_username').optional().trim(),
  body('smtp_password').optional().trim(),
  body('sender_email').optional().trim().isEmail().withMessage('Invalid email'),
  body('meta_title').optional().trim(),
  body('meta_description').optional().trim(),
  body('meta_keywords').optional().trim(),
  body('og_image').optional().trim(),
  body('session_timeout').optional().trim().isInt({ min: 60 }).withMessage('Minimum 60 seconds'),
  body('password_policy').optional(),
  body('login_attempt_limit').optional().trim().isInt({ min: 1 }).withMessage('Minimum 1 attempt'),
]);

// ─── Query / Params ──────────────────────────────────────

const getAllSettings = validateQuery([
  rules.page(),
  rules.limit(),
  rules.sort(['key', 'createdAt', 'updatedAt']),
  rules.queryText('search'),
  rules.queryEnum('group', VALID_GROUPS),
]);

const keyParam = validateParams({ key: 'string' });
const groupParam = validateParams({ group: 'string' });

module.exports = {
  updateSetting,
  updateSettings,
  updateGroupSettings,
  getAllSettings,
  keyParam,
  groupParam,
};
