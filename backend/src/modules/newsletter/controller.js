const newsletterService = require('./service');
const { successResponse, createdResponse, updatedResponse, deletedResponse, paginatedResponse } = require('../../helpers/apiResponse');
const asyncHandler = require('../../middlewares/asyncHandler');

const getAllSubscribers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search, status, sortBy, sortOrder } = req.query;

  const result = await newsletterService.getAllSubscribers({
    page: parseInt(page, 10) || 1,
    limit: parseInt(limit, 10) || 10,
    search,
    status,
    sortBy,
    sortOrder,
  });

  return paginatedResponse(res, result);
});

const getSubscriberById = asyncHandler(async (req, res) => {
  const subscriber = await newsletterService.getSubscriberById(req.params.id);
  return successResponse(res, subscriber, 'Subscriber retrieved successfully');
});

const addSubscriber = asyncHandler(async (req, res) => {
  const { email, name, source } = req.body;
  const subscriber = await newsletterService.addSubscriber({ email, name, source });
  return createdResponse(res, subscriber, 'Subscriber added successfully');
});

const updateSubscriber = asyncHandler(async (req, res) => {
  const subscriber = await newsletterService.updateSubscriber(req.params.id, req.body);
  return updatedResponse(res, subscriber, 'Subscriber updated successfully');
});

const toggleStatus = asyncHandler(async (req, res) => {
  const subscriber = await newsletterService.toggleStatus(req.params.id);
  return updatedResponse(res, subscriber, 'Subscriber status toggled successfully');
});

const deleteSubscriber = asyncHandler(async (req, res) => {
  const result = await newsletterService.deleteSubscriber(req.params.id);
  return deletedResponse(res, result.message);
});

const getStats = asyncHandler(async (req, res) => {
  const stats = await newsletterService.getStats();
  return successResponse(res, stats, 'Newsletter stats retrieved successfully');
});

module.exports = {
  getAllSubscribers,
  getSubscriberById,
  addSubscriber,
  updateSubscriber,
  toggleStatus,
  deleteSubscriber,
  getStats,
};
