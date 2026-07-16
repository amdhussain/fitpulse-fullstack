const { validateRequest, validateParams, validateQuery } = require('../../validators/middlewares');
const rules = require('../../validators/helpers/rules.helper');
const { body } = require('express-validator');

const SCHEDULE_DAY_VALUES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// ─── Admin: Create Class ──────────────────────────────────

const createClass = validateRequest([
  body('trainerId')
    .trim()
    .notEmpty().withMessage('Trainer ID is required'),
  rules.text('name', { min: 2, max: 200 }),
  rules.optionalText('description', { max: 2000 }),
  rules.optionalText('category', { max: 100 }),
  body('difficulty')
    .optional()
    .isIn(['BEGINNER', 'INTERMEDIATE', 'ADVANCED'])
    .withMessage('Difficulty must be BEGINNER, INTERMEDIATE, or ADVANCED'),
  rules.positiveInteger('capacity'),
  body('schedule')
    .optional()
    .isArray({ min: 1 }).withMessage('Schedule must be a non-empty array'),
  body('schedule.*.day')
    .trim()
    .notEmpty().withMessage('Day is required')
    .isIn(SCHEDULE_DAY_VALUES).withMessage('Invalid day'),
  body('schedule.*.startTime')
    .trim()
    .notEmpty().withMessage('Start time is required')
    .matches(/^([01]\d|2[0-3]):[0-5]\d$/).withMessage('Start time must be in HH:MM format'),
  body('schedule.*.endTime')
    .trim()
    .notEmpty().withMessage('End time is required')
    .matches(/^([01]\d|2[0-3]):[0-5]\d$/).withMessage('End time must be in HH:MM format'),
  rules.positiveInteger('duration'),
  rules.optionalNumber('price', { min: 0 }),
  rules.optionalUrl('image'),
]);

// ─── Admin: Update Class ──────────────────────────────────

const updateClass = validateRequest([
  body('trainerId').optional().trim().notEmpty().withMessage('Trainer ID cannot be empty'),
  rules.optionalText('name', { max: 200 }),
  rules.optionalText('description', { max: 2000 }),
  rules.optionalText('category', { max: 100 }),
  body('difficulty')
    .optional()
    .isIn(['BEGINNER', 'INTERMEDIATE', 'ADVANCED'])
    .withMessage('Difficulty must be BEGINNER, INTERMEDIATE, or ADVANCED'),
  rules.optionalPositiveInteger('capacity'),
  body('schedule')
    .optional()
    .isArray({ min: 1 }).withMessage('Schedule must be a non-empty array'),
  body('schedule.*.day')
    .trim()
    .notEmpty().withMessage('Day is required')
    .isIn(SCHEDULE_DAY_VALUES).withMessage('Invalid day'),
  body('schedule.*.startTime')
    .trim()
    .notEmpty().withMessage('Start time is required')
    .matches(/^([01]\d|2[0-3]):[0-5]\d$/).withMessage('Start time must be in HH:MM format'),
  body('schedule.*.endTime')
    .trim()
    .notEmpty().withMessage('End time is required')
    .matches(/^([01]\d|2[0-3]):[0-5]\d$/).withMessage('End time must be in HH:MM format'),
  rules.optionalPositiveInteger('duration'),
  rules.optionalNumber('price', { min: 0 }),
  rules.optionalUrl('image'),
  body('status').optional().isIn(['ACTIVE', 'DRAFT']).withMessage('Status must be ACTIVE or DRAFT'),
]);

// ─── Trainer: Update My Class ─────────────────────────────

const updateMyClass = validateRequest([
  rules.optionalText('name', { max: 200 }),
  rules.optionalText('description', { max: 2000 }),
  rules.optionalText('category', { max: 100 }),
  body('difficulty')
    .optional()
    .isIn(['BEGINNER', 'INTERMEDIATE', 'ADVANCED'])
    .withMessage('Difficulty must be BEGINNER, INTERMEDIATE, or ADVANCED'),
  rules.optionalPositiveInteger('capacity'),
  body('schedule')
    .optional()
    .isArray({ min: 1 }).withMessage('Schedule must be a non-empty array'),
  body('schedule.*.day')
    .trim()
    .notEmpty().withMessage('Day is required')
    .isIn(SCHEDULE_DAY_VALUES).withMessage('Invalid day'),
  body('schedule.*.startTime')
    .trim()
    .notEmpty().withMessage('Start time is required')
    .matches(/^([01]\d|2[0-3]):[0-5]\d$/).withMessage('Start time must be in HH:MM format'),
  body('schedule.*.endTime')
    .trim()
    .notEmpty().withMessage('End time is required')
    .matches(/^([01]\d|2[0-3]):[0-5]\d$/).withMessage('End time must be in HH:MM format'),
  rules.optionalPositiveInteger('duration'),
  rules.optionalNumber('price', { min: 0 }),
  rules.optionalUrl('image'),
  body('status').optional().isIn(['ACTIVE', 'DRAFT']).withMessage('Status must be ACTIVE or DRAFT'),
]);

// ─── Query / Params ───────────────────────────────────────

const getAllClasses = validateQuery([
  rules.page(),
  rules.limit(),
  rules.sort(['createdAt', 'name', 'price', 'duration', 'difficulty', 'capacity']),
  rules.queryText('search'),
  rules.queryText('category'),
  rules.queryEnum('difficulty', ['BEGINNER', 'INTERMEDIATE', 'ADVANCED']),
  rules.queryText('trainerId'),
  rules.queryText('minPrice'),
  rules.queryText('maxPrice'),
  rules.queryText('minDate'),
  rules.queryText('maxDate'),
]);

const getMyClasses = validateQuery([
  rules.page(),
  rules.limit(),
  rules.sort(['createdAt', 'name', 'difficulty', 'capacity']),
  rules.queryText('search'),
  rules.queryText('category'),
  rules.queryEnum('difficulty', ['BEGINNER', 'INTERMEDIATE', 'ADVANCED']),
  rules.queryEnum('status', ['ACTIVE', 'DRAFT']),
]);

const idParam = validateParams({ id: 'string' });

module.exports = {
  createClass,
  updateClass,
  updateMyClass,
  getAllClasses,
  getMyClasses,
  idParam,
};
