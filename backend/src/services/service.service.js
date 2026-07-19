const { ObjectId } = require('mongodb');
const { NotFoundError } = require('../errors');
const databaseService = require('./databaseService');
const { extractPagination } = require('../utils/pagination');
const logger = require('../utils/logger');

async function getAll(query = {}) {
  const { page, limit, offset } = extractPagination(query);
  const match = {};
  if (query.status) match.status = query.status;
  if (query.category) match.category = query.category;
  if (query.trainerId) match.trainerId = new ObjectId(query.trainerId);
  if (query.search) {
    match.$or = [
      { name: { $regex: query.search, $options: 'i' } },
      { description: { $regex: query.search, $options: 'i' } },
    ];
  }

  const total = await databaseService.client.services.countDocuments(match);
  const sort = {};
  if (query.sortBy) sort[query.sortBy] = query.sortOrder === 'DESC' ? -1 : 1;
  else sort.createdAt = -1;

  const docs = await databaseService.client.services
    .find(match).sort(sort).skip(offset).limit(limit).toArray();

  return {
    data: databaseService.formatDocs(docs),
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
}

async function getActive(query = {}) {
  return getAll({ ...query, status: 'ACTIVE' });
}

async function getById(id) {
  const doc = await databaseService.client.services.findOne({ _id: new ObjectId(id) });
  const service = databaseService.formatDoc(doc);
  if (!service) throw new NotFoundError('Service not found');
  return service;
}

async function getActiveById(id) {
  const doc = await databaseService.client.services.findOne({ _id: new ObjectId(id), status: 'ACTIVE' });
  const service = databaseService.formatDoc(doc);
  if (!service) throw new NotFoundError('Service not found');
  return service;
}

async function create(data) {
  const now = new Date();
  const insertData = {
    name: data.name,
    category: data.category || null,
    description: data.description || null,
    price: data.price || null,
    duration: data.duration || null,
    image: data.image || null,
    benefits: data.benefits || null,
    trainerId: data.trainerId ? new ObjectId(data.trainerId) : null,
    status: data.status || 'ACTIVE',
    createdAt: now,
    updatedAt: now,
  };
  const result = await databaseService.client.services.insertOne(insertData);
  const doc = await databaseService.client.services.findOne({ _id: result.insertedId });
  const service = databaseService.formatDoc(doc);
  logger.info('Service created', { serviceId: service.id, name: service.name });
  return service;
}

async function update(id, data) {
  await getById(id);
  const updateFields = { ...data, updatedAt: new Date() };
  if (data.trainerId) updateFields.trainerId = new ObjectId(data.trainerId);
  await databaseService.client.services.updateOne(
    { _id: new ObjectId(id) },
    { $set: updateFields }
  );
  const doc = await databaseService.client.services.findOne({ _id: new ObjectId(id) });
  const service = databaseService.formatDoc(doc);
  logger.info('Service updated', { serviceId: service.id });
  return service;
}

async function remove(id) {
  await getById(id);
  await databaseService.client.services.deleteOne({ _id: new ObjectId(id) });
  logger.info('Service deleted', { serviceId: id });
}

async function getCategories() {
  const result = await databaseService.client.services.distinct('category', { status: 'ACTIVE' });
  return result.filter(Boolean);
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
