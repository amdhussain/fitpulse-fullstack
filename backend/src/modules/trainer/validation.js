const { validateRequest, validateParams, validateQuery } = require('../../validators/middlewares');
const rules = require('../../validators/helpers/rules.helper');
const { body } = require('express-validator');

// ─── Admin: Create Trainer ────────────────────────────────

const createTrainer = validateRequest([
  rules.email('email'),
  rules.password('password'),
  rules.name('firstName'),
  rules.name('lastName'),
  rules.optionalPhone('phone'),
  rules.optionalUrl('profileImage'),
  rules.optionalText('bio', { max: 2000 }),
  rules.optionalText('specialization', { max: 200 }),
  rules.optionalText('designation', { max: 200 }),
  rules.optionalPositiveInteger('experience'),
  rules.optionalNumber('hourlyRate', { min: 0 }),
  body('skills').optional().isArray().withMessage('Skills must be an array'),
  body('skills.*').optional().trim().isLength({ min: 1, max: 100 }).withMessage('Each skill must be between 1 and 100 characters'),
  body('programs').optional().isArray().withMessage('Programs must be an array'),
  body('programs.*').optional().trim().isLength({ min: 1, max: 200 }).withMessage('Each program must be between 1 and 200 characters'),
  body('certificates').optional().isArray().withMessage('Certificates must be an array'),
  body('certificates.*').optional().trim().isLength({ min: 1, max: 200 }).withMessage('Each certificate must be between 1 and 200 characters'),
  body('achievements').optional().isArray().withMessage('Achievements must be an array'),
  body('achievements.*').optional().trim().isLength({ min: 1, max: 200 }).withMessage('Each achievement must be between 1 and 200 characters'),
  body('availableDays').optional().isArray().withMessage('Available days must be an array'),
  body('availableDays.*').optional().trim().isIn(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']).withMessage('Invalid day value'),
  body('socialLinks').optional().isObject().withMessage('Social links must be an object'),
]);

// ─── Admin: Update Trainer ────────────────────────────────

const updateTrainer = validateRequest([
  rules.optionalText('bio', { max: 2000 }),
  rules.optionalText('specialization', { max: 200 }),
  rules.optionalText('designation', { max: 200 }),
  rules.optionalPositiveInteger('experience'),
  rules.optionalNumber('hourlyRate', { min: 0 }),
  body('skills').optional().isArray().withMessage('Skills must be an array'),
  body('skills.*').optional().trim().isLength({ min: 1, max: 100 }).withMessage('Each skill must be between 1 and 100 characters'),
  body('programs').optional().isArray().withMessage('Programs must be an array'),
  body('programs.*').optional().trim().isLength({ min: 1, max: 200 }).withMessage('Each program must be between 1 and 200 characters'),
  body('certificates').optional().isArray().withMessage('Certificates must be an array'),
  body('certificates.*').optional().trim().isLength({ min: 1, max: 200 }).withMessage('Each certificate must be between 1 and 200 characters'),
  body('achievements').optional().isArray().withMessage('Achievements must be an array'),
  body('achievements.*').optional().trim().isLength({ min: 1, max: 200 }).withMessage('Each achievement must be between 1 and 200 characters'),
  body('availableDays').optional().isArray().withMessage('Available days must be an array'),
  body('availableDays.*').optional().trim().isIn(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']).withMessage('Invalid day value'),
  body('socialLinks').optional().isObject().withMessage('Social links must be an object'),
  body('status').optional().isIn(['ACTIVE', 'DRAFT']).withMessage('Status must be ACTIVE or DRAFT'),
]);

// ─── Trainer: Update Profile ──────────────────────────────

const updateProfile = validateRequest([
  rules.optionalText('bio', { max: 2000 }),
  rules.optionalText('designation', { max: 200 }),
  rules.optionalNumber('hourlyRate', { min: 0 }),
  body('socialLinks').optional().isObject().withMessage('Social links must be an object'),
]);

// ─── Trainer: Update Availability ─────────────────────────

const updateAvailability = validateRequest([
  body('availableDays')
    .isArray({ min: 1 }).withMessage('Available days must be a non-empty array'),
  body('availableDays.*')
    .trim()
    .isIn(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'])
    .withMessage('Invalid day value'),
]);

// ─── Trainer: Update Certifications ───────────────────────

const updateCertifications = validateRequest([
  body('certificates').optional().isArray().withMessage('Certificates must be an array'),
  body('certificates.*').optional().trim().isLength({ min: 1, max: 200 }).withMessage('Each certificate must be between 1 and 200 characters'),
  body('achievements').optional().isArray().withMessage('Achievements must be an array'),
  body('achievements.*').optional().trim().isLength({ min: 1, max: 200 }).withMessage('Each achievement must be between 1 and 200 characters'),
]);

// ─── Trainer: Update Experience ───────────────────────────

const updateExperience = validateRequest([
  rules.optionalPositiveInteger('experience'),
  body('skills').optional().isArray().withMessage('Skills must be an array'),
  body('skills.*').optional().trim().isLength({ min: 1, max: 100 }).withMessage('Each skill must be between 1 and 100 characters'),
  body('programs').optional().isArray().withMessage('Programs must be an array'),
  body('programs.*').optional().trim().isLength({ min: 1, max: 200 }).withMessage('Each program must be between 1 and 200 characters'),
]);

// ─── Trainer: Update Specializations ──────────────────────

const updateSpecializations = validateRequest([
  rules.text('specialization', { min: 1, max: 200 }),
]);

// ─── Query / Params ───────────────────────────────────────

const getAllTrainers = validateQuery([
  rules.page(),
  rules.limit(),
  rules.sort(['createdAt', 'experience', 'hourlyRate', 'rating']),
  rules.queryText('search'),
  rules.queryEnum('status', ['ACTIVE', 'DRAFT']),
]);

const listPublicTrainers = validateQuery([
  rules.page(),
  rules.limit(),
  rules.sort(['createdAt', 'experience', 'hourlyRate', 'rating']),
  rules.queryText('search'),
  rules.queryText('specialization'),
  rules.queryText('availableDay'),
  rules.queryText('minExperience'),
]);

const idParam = validateParams({ id: 'string' });

module.exports = {
  createTrainer,
  updateTrainer,
  updateProfile,
  updateAvailability,
  updateCertifications,
  updateExperience,
  updateSpecializations,
  getAllTrainers,
  listPublicTrainers,
  idParam,
};
