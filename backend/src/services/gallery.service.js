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
  if (query.search) {
    match.$or = [
      { title: { $regex: query.search, $options: 'i' } },
      { description: { $regex: query.search, $options: 'i' } },
    ];
  }

  const total = await databaseService.client.gallery.countDocuments(match);
  const sort = {};
  if (query.sortBy) sort[query.sortBy] = query.sortOrder === 'DESC' ? -1 : 1;
  else sort.createdAt = -1;

  const docs = await databaseService.client.gallery
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
  const doc = await databaseService.client.gallery.findOne({ _id: new ObjectId(id) });
  const item = databaseService.formatDoc(doc);
  if (!item) throw new NotFoundError('Gallery item not found');
  return item;
}

async function getActiveById(id) {
  const doc = await databaseService.client.gallery.findOne({ _id: new ObjectId(id), status: 'ACTIVE' });
  const item = databaseService.formatDoc(doc);
  if (!item) throw new NotFoundError('Gallery item not found');
  return item;
}

async function create(data) {
  const now = new Date();
  const insertData = {
    title: data.title,
    category: data.category || null,
    description: data.description || null,
    image: data.image,
    featured: data.featured || false,
    status: data.status || 'ACTIVE',
    createdAt: now,
    updatedAt: now,
  };
  const result = await databaseService.client.gallery.insertOne(insertData);
  const doc = await databaseService.client.gallery.findOne({ _id: result.insertedId });
  const item = databaseService.formatDoc(doc);
  logger.info('Gallery item created', { galleryId: item.id, title: item.title });
  return item;
}

async function update(id, data) {
  await getById(id);
  const updateFields = { ...data, updatedAt: new Date() };
  await databaseService.client.gallery.updateOne(
    { _id: new ObjectId(id) },
    { $set: updateFields }
  );
  const doc = await databaseService.client.gallery.findOne({ _id: new ObjectId(id) });
  const item = databaseService.formatDoc(doc);
  logger.info('Gallery item updated', { galleryId: item.id });
  return item;
}

async function remove(id) {
  await getById(id);
  await databaseService.client.gallery.deleteOne({ _id: new ObjectId(id) });
  logger.info('Gallery item deleted', { galleryId: id });
}

async function getCategories() {
  const result = await databaseService.client.gallery.distinct('category', { status: 'ACTIVE' });
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
