const { validateRequest, validateParams } = require('./middlewares');
const rules = require('./helpers/rules.helper');

// ─── Trainer Validators ───────────────────────────────────
// Uncomment and wire into routes as the trainer module is built.

/*
const createProfile = [
  rules.text('bio', { min: 50, max: 2000 }),
  rules.arrayOfObjectIds('specializations'),
  rules.optionalNumber('experience', { min: 0 }),
  rules.optionalUrl('certifications'),
  rules.optionalNumber('hourlyRate', { min: 0 }),
  rules.optionalLatitude(),
  rules.optionalLongitude(),
];

const updateProfile = [
  rules.optionalText('bio', { max: 2000 }),
  rules.optionalArray('specializations'),
  rules.optionalNumber('experience', { min: 0 }),
  rules.optionalUrl('certifications'),
  rules.optionalNumber('hourlyRate', { min: 0 }),
];

const getTrainer = [
  validateParams({ id: 'mongoId' }),
];

const listTrainers = [
  rules.page(),
  rules.limit(),
  rules.sort(['createdAt', 'firstName', 'experience', 'hourlyRate']),
  rules.queryText('search'),
  rules.queryArray('specializations'),
];
*/

module.exports = {
  // createProfile: validateRequest(createProfile),
  // updateProfile: validateRequest(updateProfile),
  // getTrainer: validateRequest(getTrainer),
  // listTrainers: validateRequest(listTrainers),
};
