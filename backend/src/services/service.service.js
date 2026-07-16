const databaseService = require('./databaseService');
const { NotFoundError, ConflictError } = require('../errors');
const { extractPagination } = require('../utils/pagination');
const logger = require('../utils/logger');

// ─── Service Service ────────────────────────────────────────
// CRUD operations for fitness services (Yoga, HIIT, etc.).
// Admin manages all services; public sees only ACTIVE ones.
// ───────────────────────────────────────────────────────────

async function getAll(query = {}) {
  const { page, limit, offset } = extractPagination(query);
  const where = {};

  if (query.category) where.category = query.category;
  if (query.status) where.status = query.status;
  if (query.search) {
    where.OR = [
      { name: { contains: query.search } },
      { description: { contains: query.search } },
    ];
  }

  const [services, total] = await Promise.all([
    databaseService.client.service.findMany({
      where,
      skip: offset,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    databaseService.client.service.count({ where }),
  ]);

  return {
    data: services,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
}

async function getActive(query = {}) {
  const { page, limit, offset } = extractPagination(query);
  const where = { status: 'ACTIVE' };

  if (query.category) where.category = query.category;
  if (query.search) {
    where.OR = [
      { name: { contains: query.search } },
      { description: { contains: query.search } },
    ];
  }

  const [services, total] = await Promise.all([
    databaseService.client.service.findMany({
      where,
      skip: offset,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    databaseService.client.service.count({ where }),
  ]);

  return {
    data: services,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
}

async function getById(id) {
  const service = await databaseService.client.service.findUnique({
    where: { id },
  });

  if (!service) {
    throw new NotFoundError('Service not found');
  }

  return service;
}

async function getActiveById(id) {
  const service = await databaseService.client.service.findFirst({
    where: { id, status: 'ACTIVE' },
  });

  if (!service) {
    throw new NotFoundError('Service not found');
  }

  return service;
}

async function create(data) {
  const service = await databaseService.client.service.create({
    data: {
      name: data.name,
      category: data.category || null,
      description: data.description || null,
      price: data.price || null,
      duration: data.duration || null,
      image: data.image || null,
      benefits: data.benefits || null,
      trainerId: data.trainerId || null,
      status: data.status || 'ACTIVE',
    },
  });

  logger.info('Service created', { serviceId: service.id, name: service.name });
  return service;
}

async function update(id, data) {
  await getById(id);

  const updateData = {};
  const fields = ['name', 'category', 'description', 'price', 'duration', 'image', 'benefits', 'trainerId', 'status'];

  for (const field of fields) {
    if (data[field] !== undefined) {
      updateData[field] = data[field];
    }
  }

  const service = await databaseService.client.service.update({
    where: { id },
    data: updateData,
  });

  logger.info('Service updated', { serviceId: service.id });
  return service;
}

async function remove(id) {
  await getById(id);

  await databaseService.client.service.delete({ where: { id } });
  logger.info('Service deleted', { serviceId: id });
}

async function getCategories() {
  const result = await databaseService.client.service.findMany({
    where: { status: 'ACTIVE' },
    select: { category: true },
    distinct: ['category'],
  });

  return result.map((r) => r.category).filter(Boolean);
}

module.exports = {
  getAll,
  getActive,
  getById,
  getActiveById,
  create,
  update,
  remove,
  getCategories,
};
