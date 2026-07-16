const settingsService = require('../services/settings.service');
const { successResponse } = require('../helpers/apiResponse');
const asyncHandler = require('../middlewares/asyncHandler');

// ─── Settings Controller ────────────────────────────────────
// HTTP handlers for site settings (key-value store).
// Admin manages all; public reads filtered settings.
// ───────────────────────────────────────────────────────────

// @desc    Get all settings (admin)
// @route   GET /api/v1/settings
// @access  Admin
const getAll = asyncHandler(async (req, res) => {
  const settings = await settingsService.getAll();
  return successResponse(res, settings, 'Settings retrieved successfully');
});

// @desc    Get setting by key (admin)
// @route   GET /api/v1/settings/:key
// @access  Admin
const getByKey = asyncHandler(async (req, res) => {
  const setting = await settingsService.getByKey(req.params.key);
  return successResponse(res, setting, 'Setting retrieved successfully');
});

// @desc    Update setting (admin)
// @route   PUT /api/v1/settings/:key
// @access  Admin
const set = asyncHandler(async (req, res) => {
  const { value } = req.body;
  const setting = await settingsService.set(req.params.key, value);
  return successResponse(res, setting, 'Setting updated successfully');
});

// @desc    Update multiple settings (admin)
// @route   PUT /api/v1/settings
// @access  Admin
const setMany = asyncHandler(async (req, res) => {
  const settings = await settingsService.setMany(req.body.settings);
  return successResponse(res, settings, 'Settings updated successfully');
});

// @desc    Delete setting (admin)
// @route   DELETE /api/v1/settings/:key
// @access  Admin
const remove = asyncHandler(async (req, res) => {
  await settingsService.remove(req.params.key);
  return successResponse(res, null, 'Setting deleted successfully');
});

// @desc    Get public settings (public)
// @route   GET /api/v1/public/settings
// @access  Public
const getPublic = asyncHandler(async (req, res) => {
  const publicKeys = [
    'site_name', 'site_description', 'logo', 'favicon',
    'contact_email', 'contact_phone', 'contact_address',
    'social_links', 'working_hours',
  ];

  const settings = await settingsService.getMany(publicKeys);
  return successResponse(res, settings, 'Public settings retrieved successfully');
});

module.exports = {
  getAll,
  getByKey,
  set,
  setMany,
  remove,
  getPublic,
};
