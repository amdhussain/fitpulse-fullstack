const paymentMethodService = require('./service');
const { successResponse, createdResponse, updatedResponse, deletedResponse, paginatedResponse } = require('../../helpers/apiResponse');
const asyncHandler = require('../../middlewares/asyncHandler');

const getAllPaymentMethods = asyncHandler(async (req, res) => {
  const { page = 1, limit = 50, search, type, isActive, sortBy, sortOrder } = req.query;
  const result = await paymentMethodService.getAllPaymentMethods({ page, limit, search, type, isActive, sortBy, sortOrder });
  return paginatedResponse(res, result);
});

const getPaymentMethodById = asyncHandler(async (req, res) => {
  const method = await paymentMethodService.getPaymentMethodById(req.params.id);
  return successResponse(res, method, 'Payment method retrieved successfully');
});

const createPaymentMethod = asyncHandler(async (req, res) => {
  const { name, nameBn, type, description, icon, isActive, sortOrder } = req.body;
  const method = await paymentMethodService.createPaymentMethod({ name, nameBn, type, description, icon, isActive, sortOrder });
  return createdResponse(res, method, 'Payment method created successfully');
});

const updatePaymentMethod = asyncHandler(async (req, res) => {
  const { name, nameBn, type, description, icon, isActive, sortOrder } = req.body;
  const method = await paymentMethodService.updatePaymentMethod(req.params.id, { name, nameBn, type, description, icon, isActive, sortOrder });
  return updatedResponse(res, method, 'Payment method updated successfully');
});

const deletePaymentMethod = asyncHandler(async (req, res) => {
  const result = await paymentMethodService.deletePaymentMethod(req.params.id);
  return deletedResponse(res, result.message);
});

const getPaymentMethodStats = asyncHandler(async (req, res) => {
  const stats = await paymentMethodService.getPaymentMethodStats();
  return successResponse(res, stats, 'Payment method stats retrieved successfully');
});

module.exports = {
  getAllPaymentMethods,
  getPaymentMethodById,
  createPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
  getPaymentMethodStats,
};
