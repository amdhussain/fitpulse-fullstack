const { NotFoundError } = require('../errors');
const databaseService = require('./databaseService');
const logger = require('../utils/logger');

const VALID_TYPES = ['HERO', 'ABOUT', 'CONTACT', 'FOOTER'];

async function getByType(type) {
  const doc = await databaseService.client.cmsSections.findOne({ type });
  return doc ? formatSection(databaseService.formatDoc(doc)) : null;
}

async function getAll() {
  const docs = await databaseService.client.cmsSections.find().sort({ type: 1 }).toArray();
  return docs.map((doc) => formatSection(databaseService.formatDoc(doc)));
}

async function upsert(type, data) {
  const { title, subtitle, content, status } = data;

  const existing = await databaseService.client.cmsSections.findOne({ type });

  const contentString = content !== undefined
    ? (typeof content === 'string' ? content : JSON.stringify(content))
    : undefined;

  const now = new Date();

  let section;

  if (existing) {
    const updateFields = {};
    if (title !== undefined) updateFields.title = title;
    if (subtitle !== undefined) updateFields.subtitle = subtitle;
    if (contentString !== undefined) updateFields.content = contentString;
    if (status !== undefined) updateFields.status = status;
    updateFields.updatedAt = now;

    await databaseService.client.cmsSections.updateOne(
      { _id: existing._id },
      { $set: updateFields }
    );
    const updated = await databaseService.client.cmsSections.findOne({ _id: existing._id });
    section = databaseService.formatDoc(updated);
    logger.info(`CMS section ${type} updated`);
  } else {
    const insertData = { type, title: title || null, subtitle: subtitle || null, content: contentString || null, status: status || 'ACTIVE', createdAt: now, updatedAt: now };
    const result = await databaseService.client.cmsSections.insertOne(insertData);
    const created = await databaseService.client.cmsSections.findOne({ _id: result.insertedId });
    section = databaseService.formatDoc(created);
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
    const existing = await databaseService.client.cmsSections.findOne({ type: def.type });
    if (!existing) {
      const now = new Date();
      const result = await databaseService.client.cmsSections.insertOne({ ...def, content: null, status: 'ACTIVE', createdAt: now, updatedAt: now });
      const created = await databaseService.client.cmsSections.findOne({ _id: result.insertedId });
      results.push(formatSection(databaseService.formatDoc(created)));
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
