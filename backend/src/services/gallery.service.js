const databaseService = require('./databaseService');
const { NotFoundError } = require('../errors');
const { extractPagination } = require('../utils/pagination');
const logger = require('../utils/logger');

// ─── Gallery Service ────────────────────────────────────────
// CRUD operations for gallery images.
// Admin manages all items; public sees only ACTIVE ones.
// ───────────────────────────────────────────────────────────

async function getAll(query = {}) {
  const { page, limit, offset } = extractPagination(query);
  const where = {};

  if (query.category) where.category = query.category;
  if (query.status) where.status = query.status;
  if (query.featured !== undefined) where.featured = query.featured === 'true';
  if (query.search) {
    where.OR = [
      { title: { contains: query.search } },
      { description: { contains: query.search } },
    ];
  }

  const [items, total] = await Promise.all([
    databaseService.client.gallery.findMany({
      where,
      skip: offset,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    databaseService.client.gallery.count({ where }),
  ]);

  return {
    data: items,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
}

async function getActive(query = {}) {
  const { page, limit, offset } = extractPagination(query);
  const where = { status: 'ACTIVE' };

  if (query.category) where.category = query.category;
  if (query.featured !== undefined) where.featured = query.featured === 'true';
  if (query.search) {
    where.OR = [
      { title: { contains: query.search } },
      { description: { contains: query.search } },
    ];
  }

  const [items, total] = await Promise.all([
    databaseService.client.gallery.findMany({
      where,
      skip: offset,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    databaseService.client.gallery.count({ where }),
  ]);

  return {
    data: items,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
}

async function getById(id) {
  const item = await databaseService.client.gallery.findUnique({
    where: { id },
  });

  if (!item) {
    throw new NotFoundError('Gallery item not found');
  }

  return item;
}

async function getActiveById(id) {
  const item = await databaseService.client.gallery.findFirst({
    where: { id, status: 'ACTIVE' },
  });

  if (!item) {
    throw new NotFoundError('Gallery item not found');
  }

  return item;
}

async function create(data) {
  const item = await databaseService.client.gallery.create({
    data: {
      title: data.title,
      category: data.category || null,
      description: data.description || null,
      image: data.image,
      featured: data.featured || false,
      status: data.status || 'ACTIVE',
    },
  });

  logger.info('Gallery item created', { galleryId: item.id, title: item.title });
  return item;
}

async function update(id, data) {
  await getById(id);

  const updateData = {};
  const fields = ['title', 'category', 'description', 'image', 'featured', 'status'];

  for (const field of fields) {
    if (data[field] !== undefined) {
      updateData[field] = data[field];
    }
  }

  const item = await databaseService.client.gallery.update({
    where: { id },
    data: updateData,
  });

  logger.info('Gallery item updated', { galleryId: item.id });
  return item;
}

async function remove(id) {
  await getById(id);

  await databaseService.client.gallery.delete({ where: { id } });
  logger.info('Gallery item deleted', { galleryId: id });
}

async function getCategories() {
  const result = await databaseService.client.gallery.findMany({
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
