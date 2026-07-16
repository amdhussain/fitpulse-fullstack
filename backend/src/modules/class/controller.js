const classService = require('./service');
const { successResponse, createdResponse, updatedResponse, deletedResponse, paginatedResponse } = require('../../helpers/apiResponse');
const asyncHandler = require('../../middlewares/asyncHandler');

// ─── Admin APIs ───────────────────────────────────────────

const createClass = asyncHandler(async (req, res) => {
  const cls = await classService.createClass(req.body);

  return createdResponse(res, cls, 'Class created successfully');
});

const updateClass = asyncHandler(async (req, res) => {
  const cls = await classService.updateClass(req.params.id, req.body);

  return updatedResponse(res, cls, 'Class updated successfully');
});

const deleteClass = asyncHandler(async (req, res) => {
  const result = await classService.deleteClass(req.params.id);

  return deletedResponse(res, result.message);
});

// ─── Trainer APIs ─────────────────────────────────────────

const getMyClasses = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search, category, difficulty, status, sortBy, sortOrder } = req.query;

  const result = await classService.getMyClasses(req.user.id, {
    page: parseInt(page, 10) || 1,
    limit: parseInt(limit, 10) || 10,
    search,
    category,
    difficulty,
    status,
    sortBy,
    sortOrder,
  });

  return paginatedResponse(res, result);
});

const updateMyClass = asyncHandler(async (req, res) => {
  const cls = await classService.updateMyClass(req.user.id, req.params.id, req.body);

  return updatedResponse(res, cls, 'Class updated successfully');
});

const cancelMyClass = asyncHandler(async (req, res) => {
  const cls = await classService.cancelMyClass(req.user.id, req.params.id);

  return updatedResponse(res, cls, 'Class cancelled successfully');
});

// ─── Public APIs ──────────────────────────────────────────

const getAllClasses = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search, category, difficulty, trainerId, minPrice, maxPrice, minDate, maxDate, sortBy, sortOrder } = req.query;

  const result = await classService.getAllClasses({
    page: parseInt(page, 10) || 1,
    limit: parseInt(limit, 10) || 10,
    search,
    category,
    difficulty,
    trainerId,
    minPrice: minPrice ? parseFloat(minPrice) : undefined,
    maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
    minDate,
    maxDate,
    sortBy,
    sortOrder,
  });

  return paginatedResponse(res, result);
});

const getClassDetails = asyncHandler(async (req, res) => {
  const cls = await classService.getClassDetails(req.params.id);

  return successResponse(res, cls, 'Class retrieved successfully');
});

module.exports = {
  createClass,
  updateClass,
  deleteClass,
  getMyClasses,
  updateMyClass,
  cancelMyClass,
  getAllClasses,
  getClassDetails,
};
