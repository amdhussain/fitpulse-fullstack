const { validateRequest, validateParams } = require('./middlewares');
const rules = require('./helpers/rules.helper');

// ─── Class Validators ─────────────────────────────────────
// Uncomment and wire into routes as the class module is built.

/*
const createClass = [
  rules.text('title', { min: 3, max: 200 }),
  rules.optionalText('description', { max: 5000 }),
  rules.enumValue('category', ['yoga', 'pilates', 'cardio', 'strength', 'hiit', 'dance', 'martial-arts', 'swimming', 'cycling']),
  rules.enumValue('difficulty', ['beginner', 'intermediate', 'advanced']),
  rules.number('duration', { min: 15, max: 180 }),
  rules.positiveInteger('maxParticipants'),
  rules.number('price', { min: 0 }),
  rules.date('startTime', { future: true }),
  rules.optionalObjectId('trainerId'),
  rules.optionalLatitude(),
  rules.optionalLongitude(),
];

const updateClass = [
  validateParams({ id: 'mongoId' }),
  rules.optionalText('title', { max: 200 }),
  rules.optionalText('description', { max: 5000 }),
  rules.optionalEnum('category', ['yoga', 'pilates', 'cardio', 'strength', 'hiit', 'dance', 'martial-arts', 'swimming', 'cycling']),
  rules.optionalEnum('difficulty', ['beginner', 'intermediate', 'advanced']),
  rules.optionalNumber('duration', { min: 15, max: 180 }),
  rules.optionalPositiveInteger('maxParticipants'),
  rules.optionalNumber('price', { min: 0 }),
];

const getClass = [
  validateParams({ id: 'mongoId' }),
];

const deleteClass = [
  validateParams({ id: 'mongoId' }),
];

const listClasses = [
  rules.page(),
  rules.limit(),
  rules.sort(['createdAt', 'startTime', 'price', 'title']),
  rules.queryText('search'),
  rules.queryEnum('category', ['yoga', 'pilates', 'cardio', 'strength', 'hiit', 'dance', 'martial-arts', 'swimming', 'cycling']),
  rules.queryEnum('difficulty', ['beginner', 'intermediate', 'advanced']),
  rules.queryDateRange('startDate', 'endDate'),
];
*/

module.exports = {
  // createClass: validateRequest(createClass),
  // updateClass: validateRequest(updateClass),
  // getClass: validateRequest(getClass),
  // deleteClass: validateRequest(deleteClass),
  // listClasses: validateRequest(listClasses),
};
