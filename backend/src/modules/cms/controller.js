const cmsService = require('./service');
const { successResponse, createdResponse, updatedResponse, deletedResponse, paginatedResponse } = require('../../helpers/apiResponse');
const asyncHandler = require('../../middlewares/asyncHandler');

// ─── Section APIs (Admin) ────────────────────────────────

const getAllSections = asyncHandler(async (req, res) => {
  const { status } = req.query;

  const sections = await cmsService.getAllSections({ status });
  return successResponse(res, sections, 'CMS sections retrieved successfully');
});

const getSectionByType = asyncHandler(async (req, res) => {
  const section = await cmsService.getSectionByType(req.params.type);
  return successResponse(res, section, 'CMS section retrieved successfully');
});

const createSection = asyncHandler(async (req, res) => {
  const { type, title, subtitle, content, status } = req.body;

  const section = await cmsService.createSection({ type, title, subtitle, content, status });
  return createdResponse(res, section, 'CMS section created successfully');
});

const updateSection = asyncHandler(async (req, res) => {
  const { title, subtitle, content, status } = req.body;

  const section = await cmsService.updateSection(req.params.type, { title, subtitle, content, status });
  return updatedResponse(res, section, 'CMS section updated successfully');
});

const upsertSection = asyncHandler(async (req, res) => {
  const { type, title, subtitle, content, status } = req.body;

  const section = await cmsService.upsertSection({ type, title, subtitle, content, status });
  return successResponse(res, section, 'CMS section upserted successfully');
});

const deleteSection = asyncHandler(async (req, res) => {
  const result = await cmsService.deleteSection(req.params.type);
  return deletedResponse(res, result.message);
});

const initializeDefaultSections = asyncHandler(async (req, res) => {
  const sections = await cmsService.initializeDefaultSections();
  return successResponse(res, sections, 'Default CMS sections initialized successfully');
});

// ─── Public APIs ─────────────────────────────────────────

const getPublicSections = asyncHandler(async (req, res) => {
  const sections = await cmsService.getPublicSections();
  return successResponse(res, sections, 'Public CMS sections retrieved successfully');
});

const getPublicSectionByType = asyncHandler(async (req, res) => {
  const section = await cmsService.getPublicSectionByType(req.params.type);
  return successResponse(res, section, 'Public CMS section retrieved successfully');
});

// ─── Media APIs (Admin) ─────────────────────────────────

const getMediaList = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search, category, featured, status, sortBy, sortOrder } = req.query;

  const result = await cmsService.getMediaList({
    page: parseInt(page, 10) || 1,
    limit: parseInt(limit, 10) || 10,
    search,
    category,
    featured: featured !== undefined ? featured === 'true' || featured === true : undefined,
    status,
    sortBy,
    sortOrder,
  });

  return paginatedResponse(res, result);
});

const getMediaById = asyncHandler(async (req, res) => {
  const media = await cmsService.getMediaById(req.params.id);
  return successResponse(res, media, 'Media retrieved successfully');
});

const createMedia = asyncHandler(async (req, res) => {
  const { title, category, description, image, featured, status } = req.body;

  const media = await cmsService.createMedia({ title, category, description, image, featured, status });
  return createdResponse(res, media, 'Media created successfully');
});

const updateMedia = asyncHandler(async (req, res) => {
  const { title, category, description, image, featured, status } = req.body;

  const media = await cmsService.updateMedia(req.params.id, { title, category, description, image, featured, status });
  return updatedResponse(res, media, 'Media updated successfully');
});

const deleteMedia = asyncHandler(async (req, res) => {
  const result = await cmsService.deleteMedia(req.params.id);
  return deletedResponse(res, result.message);
});

module.exports = {
  getAllSections,
  getSectionByType,
  createSection,
  updateSection,
  upsertSection,
  deleteSection,
  initializeDefaultSections,
  getPublicSections,
  getPublicSectionByType,
  getMediaList,
  getMediaById,
  createMedia,
  updateMedia,
  deleteMedia,
};
