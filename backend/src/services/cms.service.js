const databaseService = require('./databaseService');
const { NotFoundError } = require('../errors');
const logger = require('../utils/logger');

// ─── CMS Section Service ───────────────────────────────────
// Manages singleton CMS sections (Hero, About, Contact, Footer).
// Each section type exists as exactly one row, identified by `type`.
// The `content` field stores section-specific data as a JSON string.
// ───────────────────────────────────────────────────────────

const VALID_TYPES = ['HERO', 'ABOUT', 'CONTACT', 'FOOTER'];

async function getByType(type) {
  const section = await databaseService.client.cmsSection.findUnique({
    where: { type },
  });

  return section ? formatSection(section) : null;
}

async function getAll() {
  const sections = await databaseService.client.cmsSection.findMany({
    orderBy: { type: 'asc' },
  });

  return sections.map(formatSection);
}

async function upsert(type, data) {
  const { title, subtitle, content, status } = data;

  const existing = await databaseService.client.cmsSection.findUnique({
    where: { type },
  });

  const contentString = content !== undefined
    ? (typeof content === 'string' ? content : JSON.stringify(content))
    : undefined;

  let section;

  if (existing) {
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (subtitle !== undefined) updateData.subtitle = subtitle;
    if (contentString !== undefined) updateData.content = contentString;
    if (status !== undefined) updateData.status = status;

    section = await databaseService.client.cmsSection.update({
      where: { type },
      data: updateData,
    });

    logger.info(`CMS section ${type} updated`);
  } else {
    section = await databaseService.client.cmsSection.create({
      data: {
        type,
        title: title || null,
        subtitle: subtitle || null,
        content: contentString || null,
        status: status || 'ACTIVE',
      },
    });

    logger.info(`CMS section ${type} created`);
  }

  return formatSection(section);
}

async function initializeDefaults() {
  const defaults = [
    { type: 'HERO', title: 'Transform Your Body', subtitle: 'Join FitPulse today' },
    { type: 'ABOUT', title: 'About FitPulse', subtitle: 'Your fitness journey starts here' },
    { type: 'CONTACT', title: 'Contact Us', subtitle: 'Get in touch' },
    { type: 'FOOTER', title: 'FitPulse', subtitle: 'Fitness & Wellness' },
  ];

  const results = [];

  for (const def of defaults) {
    const existing = await databaseService.client.cmsSection.findUnique({
      where: { type: def.type },
    });

    if (!existing) {
      const section = await databaseService.client.cmsSection.create({ data: def });
      results.push(formatSection(section));
    }
  }

  return results;
}

function formatSection(section) {
  let parsedContent = null;

  if (section.content) {
    try {
      parsedContent = JSON.parse(section.content);
    } catch {
      parsedContent = section.content;
    }
  }

  return {
    id: section.id,
    type: section.type,
    title: section.title,
    subtitle: section.subtitle,
    content: parsedContent,
    status: section.status,
    createdAt: section.createdAt,
    updatedAt: section.updatedAt,
  };
}

module.exports = {
  getByType,
  getAll,
  upsert,
  initializeDefaults,
  VALID_TYPES,
};
