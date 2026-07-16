const trainerController = require('./controller');
const protect = require('../../middlewares/auth.middleware');
const authorize = require('../../middlewares/role.middleware');
const trainerValidation = require('./validation');

function trainerRoutes(router) {
  // Public routes
  router.get('/public', trainerValidation.listPublicTrainers, trainerController.listTrainers);

  // Trainer self routes (must be before /:id to avoid param conflict)
  router.put('/me/profile', protect, authorize('TRAINER'), trainerValidation.updateProfile, trainerController.updateProfile);
  router.put('/me/availability', protect, authorize('TRAINER'), trainerValidation.updateAvailability, trainerController.updateAvailability);
  router.put('/me/certifications', protect, authorize('TRAINER'), trainerValidation.updateCertifications, trainerController.updateCertifications);
  router.put('/me/experience', protect, authorize('TRAINER'), trainerValidation.updateExperience, trainerController.updateExperience);
  router.put('/me/specializations', protect, authorize('TRAINER'), trainerValidation.updateSpecializations, trainerController.updateSpecializations);

  // Admin routes
  router.get('/', protect, authorize('ADMIN'), trainerValidation.getAllTrainers, trainerController.getAllTrainers);
  router.post('/', protect, authorize('ADMIN'), trainerValidation.createTrainer, trainerController.createTrainer);
  router.get('/:id', protect, authorize('ADMIN'), trainerValidation.idParam, trainerController.getTrainerById);
  router.put('/:id', protect, authorize('ADMIN'), trainerValidation.idParam, trainerValidation.updateTrainer, trainerController.updateTrainer);
  router.delete('/:id', protect, authorize('ADMIN'), trainerValidation.idParam, trainerController.deleteTrainer);
}

module.exports = trainerRoutes;
