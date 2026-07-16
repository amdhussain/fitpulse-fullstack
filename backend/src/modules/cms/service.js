const CmsRepository = require('./repository');
const { NotFoundError, BadRequestError, ConflictError } = require('../../errors');
const logger = require('../../utils/logger');

const VALID_CMS_TYPES = ['HERO', 'ABOUT', 'FEATURES', 'SERVICES', 'TRAINERS', 'PRICING', 'TESTIMONIALS', 'FAQ', 'CONTACT', 'FOOTER'];

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

function formatSection(section) {
  if (!section) return null;
  return {
    ...section,
    content: parseJsonField(section.content),
  };
}

// ─── Section APIs (Admin) ────────────────────────────────

async function getAllSections({ status } = {}) {
  const where = {};
  if (status) where.status = status;

  const sections = await CmsRepository.findAllSections({ where });
  return sections.map(formatSection);
}

async function getSectionByType(type) {
  const section = await CmsRepository.findSectionByType(type);

  if (!section) {
    throw new NotFoundError(`Section '${type}' not found`);
  }

  return formatSection(section);
}

async function createSection({ type, title, subtitle, content, status }) {
  const existing = await CmsRepository.findSectionByType(type);

  if (existing) {
    throw new ConflictError(`Section '${type}' already exists. Use update instead.`);
  }

  const section = await CmsRepository.createSection({
    type,
    title: title || null,
    subtitle: subtitle || null,
    content: serializeJsonField(content),
    status: status || 'ACTIVE',
  });

  logger.info('CMS section created', { type, sectionId: section.id });

  return formatSection(section);
}

async function updateSection(type, { title, subtitle, content, status }) {
  const existing = await CmsRepository.findSectionByType(type);

  if (!existing) {
    throw new NotFoundError(`Section '${type}' not found`);
  }

  const updateData = {};

  if (title !== undefined) updateData.title = title;
  if (subtitle !== undefined) updateData.subtitle = subtitle;
  if (content !== undefined) updateData.content = serializeJsonField(content);
  if (status !== undefined) updateData.status = status;

  if (Object.keys(updateData).length === 0) {
    throw new BadRequestError('No fields to update');
  }

  const section = await CmsRepository.updateSection(type, updateData);

  logger.info('CMS section updated', { type });

  return formatSection(section);
}

async function upsertSection({ type, title, subtitle, content, status }) {
  const section = await CmsRepository.upsertSection(type, {
    title: title || null,
    subtitle: subtitle || null,
    content: serializeJsonField(content),
    status: status || 'ACTIVE',
  });

  logger.info('CMS section upserted', { type });

  return formatSection(section);
}

async function deleteSection(type) {
  const existing = await CmsRepository.findSectionByType(type);

  if (!existing) {
    throw new NotFoundError(`Section '${type}' not found`);
  }

  await CmsRepository.deleteSection(type);

  logger.info('CMS section deleted', { type });

  return { message: `Section '${type}' deleted successfully` };
}

async function initializeDefaultSections() {
  const defaults = [
    { type: 'HERO', title: 'Welcome to FitPulse', subtitle: 'Transform your body, transform your life' },
    { type: 'ABOUT', title: 'About Us', subtitle: 'Your fitness journey starts here' },
    { type: 'FEATURES', title: 'Our Features', subtitle: 'What makes us different' },
    { type: 'SERVICES', title: 'Our Services', subtitle: 'Everything you need to stay fit' },
    { type: 'TRAINERS', title: 'Expert Trainers', subtitle: 'Learn from the best' },
    { type: 'PRICING', title: 'Pricing Plans', subtitle: 'Choose the right plan for you' },
    { type: 'TESTIMONIALS', title: 'Testimonials', subtitle: 'What our members say' },
    { type: 'FAQ', title: 'FAQ', subtitle: 'Frequently asked questions' },
    { type: 'CONTACT', title: 'Contact Us', subtitle: 'Get in touch' },
    { type: 'FOOTER', title: 'Footer', subtitle: 'FitPulse' },
  ];

  const results = [];
  for (const def of defaults) {
    const existing = await CmsRepository.findSectionByType(def.type);
    if (!existing) {
      const section = await CmsRepository.createSection({
        ...def,
        status: 'ACTIVE',
      });
      results.push(formatSection(section));
    }
  }

  logger.info('Default CMS sections initialized', { count: results.length });

  return results;
}

// ─── Public APIs ─────────────────────────────────────────

async function getPublicSections() {
  const sections = await CmsRepository.findAllSections({ where: { status: 'ACTIVE' } });
  return sections.map(formatSection);
}

async function getPublicSectionByType(type) {
  const section = await CmsRepository.findSectionByType(type);

  if (!section || section.status !== 'ACTIVE') {
    throw new NotFoundError(`Section '${type}' not found`);
  }

  return formatSection(section);
}

// ─── Media APIs (Admin) ─────────────────────────────────

async function getMediaList({ page, limit, search, category, featured, status, sortBy, sortOrder }) {
  const offset = (page - 1) * limit;

  const where = {};

  if (search) {
    where.OR = [
      { title: { contains: search } },
      { description: { contains: search } },
      { category: { contains: search } },
    ];
  }

  if (category) where.category = category;
  if (featured !== undefined) where.featured = featured;
  if (status) where.status = status;

  const { media, total } = await CmsRepository.findManyMedia({
    where,
    page,
    limit,
    offset,
    sortBy,
    sortOrder,
  });

  return {
    data: media,
    total,
    page,
    limit,
  };
}

async function getMediaById(mediaId) {
  const media = await CmsRepository.findMediaById(mediaId);

  if (!media) {
    throw new NotFoundError('Media not found');
  }

  return media;
}

async function createMedia({ title, category, description, image, featured, status }) {
  const duplicate = await CmsRepository.findDuplicateMedia(title);

  if (duplicate) {
    throw new ConflictError('Media with this title already exists');
  }

  const media = await CmsRepository.createMedia({
    title,
    category: category || null,
    description: description || null,
    image,
    featured: featured || false,
    status: status || 'ACTIVE',
  });

  logger.info('Media created', { mediaId: media.id });

  return media;
}

async function updateMedia(mediaId, { title, category, description, image, featured, status }) {
  const existing = await CmsRepository.findMediaById(mediaId);

  if (!existing) {
    throw new NotFoundError('Media not found');
  }

  if (title && title !== existing.title) {
    const duplicate = await CmsRepository.findDuplicateMedia(title, mediaId);
    if (duplicate) {
      throw new ConflictError('Media with this title already exists');
    }
  }

  const updateData = {};

  if (title !== undefined) updateData.title = title;
  if (category !== undefined) updateData.category = category;
  if (description !== undefined) updateData.description = description;
  if (image !== undefined) updateData.image = image;
  if (featured !== undefined) updateData.featured = featured;
  if (status !== undefined) updateData.status = status;

  if (Object.keys(updateData).length === 0) {
    throw new BadRequestError('No fields to update');
  }

  const media = await CmsRepository.updateMedia(mediaId, updateData);

  logger.info('Media updated', { mediaId });

  return media;
}

async function deleteMedia(mediaId) {
  const existing = await CmsRepository.findMediaById(mediaId);

  if (!existing) {
    throw new NotFoundError('Media not found');
  }

  await CmsRepository.deleteMedia(mediaId);

  logger.info('Media deleted', { mediaId });

  return { message: 'Media deleted successfully' };
}

module.exports = {
  getAllSections,
  getSectionByType,
  createSection,
  updateSection,
  upsertSection,
  deleteSection,
  initializeDefaultSections,
  getPublicSections,
  getPublicSectionByType,
  getMediaList,
  getMediaById,
  createMedia,
  updateMedia,
  deleteMedia,
};
