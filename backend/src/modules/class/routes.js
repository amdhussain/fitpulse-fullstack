const classController = require('./controller');
const protect = require('../../middlewares/auth.middleware');
const authorize = require('../../middlewares/role.middleware');
const classValidation = require('./validation');

function classRoutes(router) {
  // Public routes
  router.get('/public', classValidation.getAllClasses, classController.getAllClasses);
  router.get('/public/:id', classValidation.idParam, classController.getClassDetails);

  // Trainer routes (must be before /:id to avoid param conflict)
  router.get('/me', protect, authorize('TRAINER'), classValidation.getMyClasses, classController.getMyClasses);
  router.put('/me/:id', protect, authorize('TRAINER'), classValidation.idParam, classValidation.updateMyClass, classController.updateMyClass);
  router.patch('/me/:id/cancel', protect, authorize('TRAINER'), classValidation.idParam, classController.cancelMyClass);

  // Admin routes
  router.get('/', protect, authorize('ADMIN'), classValidation.getAllClasses, classController.getAllClasses);
  router.post('/', protect, authorize('ADMIN'), classValidation.createClass, classController.createClass);
  router.put('/:id', protect, authorize('ADMIN'), classValidation.idParam, classValidation.updateClass, classController.updateClass);
  router.delete('/:id', protect, authorize('ADMIN'), classValidation.idParam, classController.deleteClass);
}

module.exports = classRoutes;
