const cmsService = require('../services/cms.service');
const { successResponse, createdResponse } = require('../helpers/apiResponse');
const asyncHandler = require('../middlewares/asyncHandler');

// ─── CMS Controller ────────────────────────────────────────
// HTTP handlers for CMS section endpoints (Hero, About,
// Contact, Footer). Sections are singletons identified by type.
// ───────────────────────────────────────────────────────────

// @desc    Get all CMS sections (admin)
// @route   GET /api/v1/cms
// @access  Admin
const getAll = asyncHandler(async (req, res) => {
  const sections = await cmsService.getAll();
  return successResponse(res, sections, 'CMS sections retrieved successfully');
});

// @desc    Get CMS section by type (admin)
// @route   GET /api/v1/cms/:type
// @access  Admin
const getByType = asyncHandler(async (req, res) => {
  const section = await cmsService.getByType(req.params.type);
  if (!section) {
    return successResponse(res, null, 'CMS section not found');
  }
  return successResponse(res, section, 'CMS section retrieved successfully');
});

// @desc    Create or update CMS section by type (admin)
// @route   PUT /api/v1/cms/:type
// @access  Admin
const upsert = asyncHandler(async (req, res) => {
  const section = await cmsService.upsert(req.params.type, req.body);
  return successResponse(res, section, 'CMS section updated successfully');
});

// @desc    Get CMS section by type (public)
// @route   GET /api/v1/public/cms/:type
// @access  Public
const getPublicByType = asyncHandler(async (req, res) => {
  const section = await cmsService.getByType(req.params.type);
  if (!section) {
    return successResponse(res, null, 'CMS section not found');
  }
  return successResponse(res, section, 'CMS section retrieved successfully');
});

// @desc    Get all active CMS sections (public)
// @route   GET /api/v1/public/cms
// @access  Public
const getPublicAll = asyncHandler(async (req, res) => {
  const sections = await cmsService.getAll();
  const active = sections.filter((s) => s.status === 'ACTIVE');
  return successResponse(res, active, 'CMS sections retrieved successfully');
});

module.exports = {
  getAll,
  getByType,
  upsert,
  getPublicByType,
  getPublicAll,
};
