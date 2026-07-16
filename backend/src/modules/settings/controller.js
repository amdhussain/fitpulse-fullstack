const settingsService = require('./service');
const { successResponse, createdResponse, updatedResponse, deletedResponse, paginatedResponse } = require('../../helpers/apiResponse');
const asyncHandler = require('../../middlewares/asyncHandler');

// ─── Admin APIs ──────────────────────────────────────────

const getAllSettings = asyncHandler(async (req, res) => {
  const { page, limit, search, group, sortBy, sortOrder } = req.query;

  if (page && limit) {
    const result = await settingsService.getAllSettings({
      page: parseInt(page, 10) || 1,
      limit: parseInt(limit, 10) || 50,
      search,
      group,
      sortBy,
      sortOrder,
    });
    return paginatedResponse(res, result);
  }

  const result = await settingsService.getAllSettings({ group });
  return successResponse(res, result, 'Settings retrieved successfully');
});

const getSettingByKey = asyncHandler(async (req, res) => {
  const setting = await settingsService.getSettingByKey(req.params.key);
  return successResponse(res, setting, 'Setting retrieved successfully');
});

const getSettingsByGroup = asyncHandler(async (req, res) => {
  const settings = await settingsService.getSettingsByGroup(req.params.group);
  return successResponse(res, settings, 'Settings retrieved successfully');
});

const updateSetting = asyncHandler(async (req, res) => {
  const { value } = req.body;

  const setting = await settingsService.updateSetting(req.params.key, value);
  return updatedResponse(res, setting, 'Setting updated successfully');
});

const updateSettings = asyncHandler(async (req, res) => {
  const { settings } = req.body;

  const results = await settingsService.updateSettings(settings);
  return updatedResponse(res, results, 'Settings updated successfully');
});

const updateGroupSettings = asyncHandler(async (req, res) => {
  const results = await settingsService.updateGroupSettings(req.params.group, req.body);
  return updatedResponse(res, results, 'Group settings updated successfully');
});

const deleteSetting = asyncHandler(async (req, res) => {
  const result = await settingsService.deleteSetting(req.params.key);
  return deletedResponse(res, result.message);
});

const deleteGroupSettings = asyncHandler(async (req, res) => {
  const result = await settingsService.deleteGroupSettings(req.params.group);
  return deletedResponse(res, result.message);
});

const initializeDefaults = asyncHandler(async (req, res) => {
  const results = await settingsService.initializeDefaults();
  return successResponse(res, results, 'Default settings initialized successfully');
});

// ─── Public APIs ─────────────────────────────────────────

const getPublicSettings = asyncHandler(async (req, res) => {
  const settings = await settingsService.getPublicSettings();
  return successResponse(res, settings, 'Public settings retrieved successfully');
});

const getPublicSettingsByGroup = asyncHandler(async (req, res) => {
  const settings = await settingsService.getPublicSettingsByGroup(req.params.group);
  return successResponse(res, settings, 'Public settings retrieved successfully');
});

const getPublicSettingByKey = asyncHandler(async (req, res) => {
  const setting = await settingsService.getPublicSettingByKey(req.params.key);
  return successResponse(res, setting, 'Public setting retrieved successfully');
});

module.exports = {
  getAllSettings,
  getSettingByKey,
  getSettingsByGroup,
  updateSetting,
  updateSettings,
  updateGroupSettings,
  deleteSetting,
  deleteGroupSettings,
  initializeDefaults,
  getPublicSettings,
  getPublicSettingsByGroup,
  getPublicSettingByKey,
};
