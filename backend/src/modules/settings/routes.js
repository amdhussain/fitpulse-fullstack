const settingsController = require('./controller');
const protect = require('../../middlewares/auth.middleware');
const authorize = require('../../middlewares/role.middleware');
const settingsValidation = require('./validation');

function settingsRoutes(router) {
  // ─── Public Routes ─────────────────────────────────────
  router.get('/public', settingsController.getPublicSettings);
  router.get('/public/:group', settingsValidation.groupParam, settingsController.getPublicSettingsByGroup);
  router.get('/public/key/:key', settingsValidation.keyParam, settingsController.getPublicSettingByKey);

  // ─── Admin Routes ──────────────────────────────────────
  router.get('/', protect, authorize('ADMIN'), settingsValidation.getAllSettings, settingsController.getAllSettings);
  router.get('/group/:group', protect, authorize('ADMIN'), settingsValidation.groupParam, settingsController.getSettingsByGroup);
  router.get('/:key', protect, authorize('ADMIN'), settingsValidation.keyParam, settingsController.getSettingByKey);
  router.put('/:key', protect, authorize('ADMIN'), settingsValidation.keyParam, settingsValidation.updateSetting, settingsController.updateSetting);
  router.put('/', protect, authorize('ADMIN'), settingsValidation.updateSettings, settingsController.updateSettings);
  router.put('/group/:group', protect, authorize('ADMIN'), settingsValidation.groupParam, settingsValidation.updateGroupSettings, settingsController.updateGroupSettings);
  router.delete('/:key', protect, authorize('ADMIN'), settingsValidation.keyParam, settingsController.deleteSetting);
  router.delete('/group/:group', protect, authorize('ADMIN'), settingsValidation.groupParam, settingsController.deleteGroupSettings);
  router.post('/initialize', protect, authorize('ADMIN'), settingsController.initializeDefaults);
}

module.exports = settingsRoutes;
