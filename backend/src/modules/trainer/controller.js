const trainerService = require('./service');
const { successResponse, createdResponse, updatedResponse, deletedResponse, paginatedResponse } = require('../../helpers/apiResponse');
const asyncHandler = require('../../middlewares/asyncHandler');

// ─── Admin APIs ───────────────────────────────────────────

const createTrainer = asyncHandler(async (req, res) => {
  const trainer = await trainerService.createTrainer(req.body);

  return createdResponse(res, trainer, 'Trainer created successfully');
});

const getAllTrainers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search, status, sortBy, sortOrder } = req.query;

  const result = await trainerService.getAllTrainers({
    page: parseInt(page, 10) || 1,
    limit: parseInt(limit, 10) || 10,
    search,
    status,
    sortBy,
    sortOrder,
  });

  return paginatedResponse(res, result);
});

const getTrainerById = asyncHandler(async (req, res) => {
  const trainer = await trainerService.getTrainerById(req.params.id);

  return successResponse(res, trainer, 'Trainer retrieved successfully');
});

const updateTrainer = asyncHandler(async (req, res) => {
  const trainer = await trainerService.updateTrainer(req.params.id, req.body);

  return updatedResponse(res, trainer, 'Trainer updated successfully');
});

const deleteTrainer = asyncHandler(async (req, res) => {
  const result = await trainerService.deleteTrainer(req.params.id);

  return deletedResponse(res, result.message);
});

// ─── Trainer Self APIs ────────────────────────────────────

const updateProfile = asyncHandler(async (req, res) => {
  const trainer = await trainerService.updateTrainerProfile(req.user.id, req.body);

  return updatedResponse(res, trainer, 'Trainer profile updated successfully');
});

const updateAvailability = asyncHandler(async (req, res) => {
  const trainer = await trainerService.updateAvailability(req.user.id, req.body);

  return updatedResponse(res, trainer, 'Availability updated successfully');
});

const updateCertifications = asyncHandler(async (req, res) => {
  const trainer = await trainerService.updateCertifications(req.user.id, req.body);

  return updatedResponse(res, trainer, 'Certifications updated successfully');
});

const updateExperience = asyncHandler(async (req, res) => {
  const trainer = await trainerService.updateExperience(req.user.id, req.body);

  return updatedResponse(res, trainer, 'Experience updated successfully');
});

const updateSpecializations = asyncHandler(async (req, res) => {
  const trainer = await trainerService.updateSpecializations(req.user.id, req.body);

  return updatedResponse(res, trainer, 'Specializations updated successfully');
});

// ─── Public APIs ──────────────────────────────────────────

const listTrainers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search, specialization, minExperience, availableDay, sortBy, sortOrder } = req.query;

  const result = await trainerService.listTrainers({
    page: parseInt(page, 10) || 1,
    limit: parseInt(limit, 10) || 10,
    search,
    specialization,
    minExperience: minExperience ? parseInt(minExperience, 10) : undefined,
    availableDay,
    sortBy,
    sortOrder,
  });

  return paginatedResponse(res, result);
});

module.exports = {
  createTrainer,
  getAllTrainers,
  getTrainerById,
  updateTrainer,
  deleteTrainer,
  updateProfile,
  updateAvailability,
  updateCertifications,
  updateExperience,
  updateSpecializations,
  listTrainers,
};
