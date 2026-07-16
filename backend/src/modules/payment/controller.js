const paymentService = require('./service');
const { successResponse, createdResponse, updatedResponse, deletedResponse, paginatedResponse } = require('../../helpers/apiResponse');
const asyncHandler = require('../../middlewares/asyncHandler');

// ─── Member APIs ──────────────────────────────────────────

const getMyPayments = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search, status, sortBy, sortOrder } = req.query;

  const result = await paymentService.getMyPayments(req.user.id, {
    page: parseInt(page, 10) || 1,
    limit: parseInt(limit, 10) || 10,
    search,
    status,
    sortBy,
    sortOrder,
  });

  return paginatedResponse(res, result);
});

const getPaymentDetails = asyncHandler(async (req, res) => {
  const payment = await paymentService.getPaymentDetails(req.user.id, req.params.id);

  return successResponse(res, payment, 'Payment retrieved successfully');
});

// ─── Admin APIs ───────────────────────────────────────────

const getAllPayments = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search, status, userId, bookingId, sortBy, sortOrder } = req.query;

  const result = await paymentService.getAllPayments({
    page: parseInt(page, 10) || 1,
    limit: parseInt(limit, 10) || 10,
    search,
    status,
    userId,
    bookingId,
    sortBy,
    sortOrder,
  });

  return paginatedResponse(res, result);
});

const getPaymentById = asyncHandler(async (req, res) => {
  const payment = await paymentService.getPaymentById(req.params.id);

  return successResponse(res, payment, 'Payment retrieved successfully');
});

const createPayment = asyncHandler(async (req, res) => {
  const { bookingId, userId, amount, currency, paymentMethod, notes } = req.body;

  const payment = await paymentService.createPayment({
    bookingId,
    userId,
    amount,
    currency,
    paymentMethod,
    notes,
  });

  return createdResponse(res, payment, 'Payment created successfully');
});

const updatePaymentStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const payment = await paymentService.updatePaymentStatus(req.params.id, status);

  return updatedResponse(res, payment, 'Payment status updated successfully');
});

const processPayment = asyncHandler(async (req, res) => {
  const payment = await paymentService.processPayment(req.params.id);

  return updatedResponse(res, payment, 'Payment processed successfully');
});

const refundPayment = asyncHandler(async (req, res) => {
  const payment = await paymentService.refundPayment(req.params.id);

  return updatedResponse(res, payment, 'Payment refunded successfully');
});

const deletePayment = asyncHandler(async (req, res) => {
  const result = await paymentService.deletePayment(req.params.id);

  return deletedResponse(res, result.message);
});

const getRevenueStats = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;

  const stats = await paymentService.getRevenueStats({ startDate, endDate });

  return successResponse(res, stats, 'Revenue stats retrieved successfully');
});

const getRevenueByMethod = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;

  const breakdown = await paymentService.getRevenueByMethod({ startDate, endDate });

  return successResponse(res, breakdown, 'Revenue by method retrieved successfully');
});

const getDailyRevenue = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;

  const daily = await paymentService.getDailyRevenue({ startDate, endDate });

  return successResponse(res, daily, 'Daily revenue retrieved successfully');
});

module.exports = {
  getMyPayments,
  getPaymentDetails,
  getAllPayments,
  getPaymentById,
  createPayment,
  updatePaymentStatus,
  processPayment,
  refundPayment,
  deletePayment,
  getRevenueStats,
  getRevenueByMethod,
  getDailyRevenue,
};
