const serviceService = require('../services/service.service');
const { successResponse, createdResponse, paginatedResponse } = require('../helpers/apiResponse');
const asyncHandler = require('../middlewares/asyncHandler');

// ─── Service Controller ─────────────────────────────────────
// HTTP handlers for fitness service CRUD endpoints.
// Admin manages all; public sees only active services.
// ───────────────────────────────────────────────────────────

// @desc    List all services (admin)
// @route   GET /api/v1/services
// @access  Admin
const getAll = asyncHandler(async (req, res) => {
  const result = await serviceService.getAll(req.query);
  return paginatedResponse(res, result);
});

// @desc    Get service by ID (admin)
// @route   GET /api/v1/services/:id
// @access  Admin
const getById = asyncHandler(async (req, res) => {
  const service = await serviceService.getById(req.params.id);
  return successResponse(res, service, 'Service retrieved successfully');
});

// @desc    Create service (admin)
// @route   POST /api/v1/services
// @access  Admin
const create = asyncHandler(async (req, res) => {
  const service = await serviceService.create(req.body);
  return createdResponse(res, service, 'Service created successfully');
});

// @desc    Update service (admin)
// @route   PUT /api/v1/services/:id
// @access  Admin
const update = asyncHandler(async (req, res) => {
  const service = await serviceService.update(req.params.id, req.body);
  return successResponse(res, service, 'Service updated successfully');
});

// @desc    Delete service (admin)
// @route   DELETE /api/v1/services/:id
// @access  Admin
const remove = asyncHandler(async (req, res) => {
  await serviceService.remove(req.params.id);
  return successResponse(res, null, 'Service deleted successfully');
});

// @desc    Get active services (public)
// @route   GET /api/v1/public/services
// @access  Public
const getActive = asyncHandler(async (req, res) => {
  const result = await serviceService.getActive(req.query);
  return paginatedResponse(res, result);
});

// @desc    Get active service by ID (public)
// @route   GET /api/v1/public/services/:id
// @access  Public
const getActiveById = asyncHandler(async (req, res) => {
  const service = await serviceService.getActiveById(req.params.id);
  return successResponse(res, service, 'Service retrieved successfully');
});

// @desc    Get service categories (public)
// @route   GET /api/v1/public/services/categories
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
  const categories = await serviceService.getCategories();
  return successResponse(res, categories, 'Categories retrieved successfully');
});

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
  getActive,
  getActiveById,
  getCategories,
};
