const galleryService = require('../services/gallery.service');
const { successResponse, createdResponse, paginatedResponse } = require('../helpers/apiResponse');
const asyncHandler = require('../middlewares/asyncHandler');

// ─── Gallery Controller ─────────────────────────────────────
// HTTP handlers for gallery image CRUD endpoints.
// Admin manages all; public sees only active items.
// ───────────────────────────────────────────────────────────

// @desc    List all gallery items (admin)
// @route   GET /api/v1/gallery
// @access  Admin
const getAll = asyncHandler(async (req, res) => {
  const result = await galleryService.getAll(req.query);
  return paginatedResponse(res, result);
});

// @desc    Get gallery item by ID (admin)
// @route   GET /api/v1/gallery/:id
// @access  Admin
const getById = asyncHandler(async (req, res) => {
  const item = await galleryService.getById(req.params.id);
  return successResponse(res, item, 'Gallery item retrieved successfully');
});

// @desc    Create gallery item (admin)
// @route   POST /api/v1/gallery
// @access  Admin
const create = asyncHandler(async (req, res) => {
  const item = await galleryService.create(req.body);
  return createdResponse(res, item, 'Gallery item created successfully');
});

// @desc    Update gallery item (admin)
// @route   PUT /api/v1/gallery/:id
// @access  Admin
const update = asyncHandler(async (req, res) => {
  const item = await galleryService.update(req.params.id, req.body);
  return successResponse(res, item, 'Gallery item updated successfully');
});

// @desc    Delete gallery item (admin)
// @route   DELETE /api/v1/gallery/:id
// @access  Admin
const remove = asyncHandler(async (req, res) => {
  await galleryService.remove(req.params.id);
  return successResponse(res, null, 'Gallery item deleted successfully');
});

// @desc    Get active gallery items (public)
// @route   GET /api/v1/public/gallery
// @access  Public
const getActive = asyncHandler(async (req, res) => {
  const result = await galleryService.getActive(req.query);
  return paginatedResponse(res, result);
});

// @desc    Get active gallery item by ID (public)
// @route   GET /api/v1/public/gallery/:id
// @access  Public
const getActiveById = asyncHandler(async (req, res) => {
  const item = await galleryService.getActiveById(req.params.id);
  return successResponse(res, item, 'Gallery item retrieved successfully');
});

// @desc    Get gallery categories (public)
// @route   GET /api/v1/public/gallery/categories
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
  const categories = await galleryService.getCategories();
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
