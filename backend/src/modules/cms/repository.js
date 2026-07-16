const databaseService = require('../../services/databaseService');

const CMS_SECTION_SELECT = {
  id: true,
  type: true,
  title: true,
  subtitle: true,
  content: true,
  status: true,
  createdAt: true,
  updatedAt: true,
};

const GALLERY_SELECT = {
  id: true,
  title: true,
  category: true,
  description: true,
  image: true,
  featured: true,
  status: true,
  createdAt: true,
  updatedAt: true,
};

const CmsRepository = {
  // ─── Section Queries ───────────────────────────────────

  async findSectionByType(type) {
    return databaseService.client.cmsSection.findUnique({
      where: { type },
      select: CMS_SECTION_SELECT,
    });
  },

  async findSectionById(id) {
    return databaseService.client.cmsSection.findUnique({
      where: { id },
      select: CMS_SECTION_SELECT,
    });
  },

  async findAllSections({ where = {} } = {}) {
    return databaseService.client.cmsSection.findMany({
      where,
      select: CMS_SECTION_SELECT,
      orderBy: { type: 'asc' },
    });
  },

  async createSection(data) {
    return databaseService.client.cmsSection.create({
      data,
      select: CMS_SECTION_SELECT,
    });
  },

  async updateSection(type, data) {
    return databaseService.client.cmsSection.update({
      where: { type },
      data,
      select: CMS_SECTION_SELECT,
    });
  },

  async updateSectionById(id, data) {
    return databaseService.client.cmsSection.update({
      where: { id },
      data,
      select: CMS_SECTION_SELECT,
    });
  },

  async deleteSection(type) {
    return databaseService.client.cmsSection.delete({
      where: { type },
    });
  },

  async deleteSectionById(id) {
    return databaseService.client.cmsSection.delete({
      where: { id },
    });
  },

  async upsertSection(type, data) {
    return databaseService.client.cmsSection.upsert({
      where: { type },
      create: { type, ...data },
      update: data,
      select: CMS_SECTION_SELECT,
    });
  },

  async countSections(where = {}) {
    return databaseService.client.cmsSection.count({ where });
  },

  // ─── Media / Gallery Queries ───────────────────────────

  async findMediaById(id) {
    return databaseService.client.gallery.findUnique({
      where: { id },
      select: GALLERY_SELECT,
    });
  },

  async findManyMedia({ where, page, limit, offset, sortBy, sortOrder }) {
    const allowedSortFields = ['createdAt', 'title', 'category', 'featured'];
    const orderField = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const orderDirection = sortOrder === 'ASC' ? 'asc' : 'desc';

    const [media, total] = await Promise.all([
      databaseService.client.gallery.findMany({
        where,
        select: GALLERY_SELECT,
        skip: offset,
        take: limit,
        orderBy: { [orderField]: orderDirection },
      }),
      databaseService.client.gallery.count({ where }),
    ]);

    return { media, total };
  },

  async createMedia(data) {
    return databaseService.client.gallery.create({
      data,
      select: GALLERY_SELECT,
    });
  },

  async updateMedia(id, data) {
    return databaseService.client.gallery.update({
      where: { id },
      data,
      select: GALLERY_SELECT,
    });
  },

  async deleteMedia(id) {
    return databaseService.client.gallery.delete({
      where: { id },
    });
  },

  async countMedia(where = {}) {
    return databaseService.client.gallery.count({ where });
  },

  async findDuplicateMedia(title, excludeId) {
    const where = { title };
    if (excludeId) {
      where.id = { not: excludeId };
    }
    return databaseService.client.gallery.findFirst({
      where,
      select: { id: true, title: true },
    });
  },
};

module.exports = CmsRepository;
