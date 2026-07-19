const ClassRepository = require('./repository');
const TrainerRepository = require('../trainer/repository');
const { NotFoundError, BadRequestError, ForbiddenError, ConflictError } = require('../../errors');
const logger = require('../../utils/logger');

function parseJsonField(value) {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

function serializeJsonField(value) {
  if (value === null || value === undefined) return null;
  if (typeof value === 'string') return value;
  return JSON.stringify(value);
}

function formatClass(cls) {
  if (!cls) return null;
  return {
    ...cls,
    schedule: parseJsonField(cls.schedule),
  };
}

// ─── Admin APIs ───────────────────────────────────────────

async function createClass({ trainerId, name, description, category, difficulty, capacity, schedule, duration, price, image }) {
  const trainer = await TrainerRepository.findById(trainerId);

  if (!trainer) {
    throw new NotFoundError('Trainer not found');
  }

  const cls = await ClassRepository.create({
    trainerId,
    name,
    description: description || null,
    category: category || null,
    difficulty: difficulty || 'BEGINNER',
    capacity: capacity || 0,
    availableSeats: capacity || 0,
    schedule: serializeJsonField(schedule),
    duration: duration || null,
    price: price || null,
    image: image || null,
  });

  logger.info('Class created', { classId: cls.id, trainerId });

  return formatClass(cls);
}

async function updateClass(classId, data) {
  const existing = await ClassRepository.findByIdBasic(classId);

  if (!existing) {
    throw new NotFoundError('Class not found');
  }

  const updateData = {};

  const plainFields = ['trainerId', 'name', 'description', 'category', 'difficulty', 'capacity', 'duration', 'price', 'image', 'status'];

  for (const field of plainFields) {
    if (data[field] !== undefined) {
      updateData[field] = data[field];
    }
  }

  if (data.schedule !== undefined) {
    updateData.schedule = serializeJsonField(data.schedule);
  }

  if (data.capacity !== undefined && data.capacity !== existing.capacity) {
    const capacityDiff = data.capacity - existing.capacity;
    updateData.availableSeats = Math.max(0, existing.availableSeats + capacityDiff);
  }

  if (Object.keys(updateData).length === 0) {
    throw new BadRequestError('No fields to update');
  }

  const cls = await ClassRepository.update(classId, updateData);

  logger.info('Class updated', { classId });

  return formatClass(cls);
}

async function deleteClass(classId) {
  const existing = await ClassRepository.findByIdBasic(classId);

  if (!existing) {
    throw new NotFoundError('Class not found');
  }

  await ClassRepository.delete(classId);

  logger.info('Class deleted', { classId });

  return { message: 'Class deleted successfully' };
}

// ─── Trainer APIs ─────────────────────────────────────────

async function getMyClasses(trainerUserId, { page, limit, search, category, difficulty, status, sortBy, sortOrder }) {
  const trainer = await TrainerRepository.findByUserId(trainerUserId);

  if (!trainer) {
    throw new NotFoundError('Trainer profile not found');
  }

  const offset = (page - 1) * limit;

  const where = {};

  if (search) {
    where.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { category: { $regex: search, $options: 'i' } },
    ];
  }

  if (category) where.category = category;
  if (difficulty) where.difficulty = difficulty;
  if (status) where.status = status;

  const { classes, total } = await ClassRepository.findByTrainerId(trainer.id, {
    where,
    page,
    limit,
    offset,
    sortBy,
    sortOrder,
  });

  return {
    data: classes.map(formatClass),
    total,
    page,
    limit,
  };
}

async function updateMyClass(trainerUserId, classId, data) {
  const trainer = await TrainerRepository.findByUserId(trainerUserId);

  if (!trainer) {
    throw new NotFoundError('Trainer profile not found');
  }

  const existing = await ClassRepository.findByIdBasic(classId);

  if (!existing) {
    throw new NotFoundError('Class not found');
  }

  if (existing.trainerId !== trainer.id) {
    throw new ForbiddenError('You can only update your own classes');
  }

  const updateData = {};

  const allowedFields = ['name', 'description', 'category', 'difficulty', 'capacity', 'duration', 'price', 'image', 'status'];

  for (const field of allowedFields) {
    if (data[field] !== undefined) {
      updateData[field] = data[field];
    }
  }

  if (data.schedule !== undefined) {
    updateData.schedule = serializeJsonField(data.schedule);
  }

  if (data.capacity !== undefined && data.capacity !== existing.capacity) {
    const capacityDiff = data.capacity - existing.capacity;
    updateData.availableSeats = Math.max(0, existing.availableSeats + capacityDiff);
  }

  if (Object.keys(updateData).length === 0) {
    throw new BadRequestError('No fields to update');
  }

  const cls = await ClassRepository.update(classId, updateData);

  logger.info('Class updated by trainer', { classId, trainerId: trainer.id });

  return formatClass(cls);
}

async function cancelMyClass(trainerUserId, classId) {
  const trainer = await TrainerRepository.findByUserId(trainerUserId);

  if (!trainer) {
    throw new NotFoundError('Trainer profile not found');
  }

  const existing = await ClassRepository.findByIdBasic(classId);

  if (!existing) {
    throw new NotFoundError('Class not found');
  }

  if (existing.trainerId !== trainer.id) {
    throw new ForbiddenError('You can only cancel your own classes');
  }

  if (existing.status === 'DRAFT') {
    throw new ConflictError('Class is already cancelled');
  }

  const cls = await ClassRepository.update(classId, { status: 'DRAFT' });

  logger.info('Class cancelled by trainer', { classId, trainerId: trainer.id });

  return formatClass(cls);
}

// ─── Public APIs ──────────────────────────────────────────

async function getAllClasses({ page, limit, search, category, difficulty, trainerId, minPrice, maxPrice, minDate, maxDate, sortBy, sortOrder }) {
  const offset = (page - 1) * limit;

  const where = { status: 'ACTIVE' };

  if (search) {
    where.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { category: { $regex: search, $options: 'i' } },
    ];
  }

  if (category) where.category = category;
  if (difficulty) where.difficulty = difficulty;
  if (trainerId) where.trainerId = trainerId;

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined) where.price.gte = minPrice;
    if (maxPrice !== undefined) where.price.lte = maxPrice;
  }

  if (minDate !== undefined || maxDate !== undefined) {
    where.createdAt = {};
    if (minDate !== undefined) where.createdAt.gte = new Date(minDate);
    if (maxDate !== undefined) where.createdAt.lte = new Date(maxDate);
  }

  const { classes, total } = await ClassRepository.findMany({
    where,
    page,
    limit,
    offset,
    sortBy,
    sortOrder,
  });

  return {
    data: classes.map(formatClass),
    total,
    page,
    limit,
  };
}

async function getClassDetails(classId) {
  const cls = await ClassRepository.findById(classId);

  if (!cls) {
    throw new NotFoundError('Class not found');
  }

  return formatClass(cls);
}

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
