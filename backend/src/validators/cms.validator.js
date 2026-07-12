const { validateRequest, validateParams } = require('./middlewares');
const rules = require('./helpers/rules.helper');

// ─── CMS Validators ───────────────────────────────────────
// Uncomment and wire into routes as the CMS module is built.

/*
const createPage = [
  rules.text('title', { min: 3, max: 200 }),
  rules.slug('slug'),
  rules.text('content', { min: 10 }),
  rules.boolean('published'),
];

const updatePage = [
  validateParams({ id: 'mongoId' }),
  rules.optionalText('title', { max: 200 }),
  rules.optionalSlug('slug'),
  rules.optionalText('content'),
  rules.boolean('published'),
];

const getPage = [
  validateParams({ id: 'mongoId' }),
];

const deletePage = [
  validateParams({ id: 'mongoId' }),
];

const listPages = [
  rules.page(),
  rules.limit(),
  rules.sort(['createdAt', 'title', 'published']),
  rules.queryText('search'),
  rules.queryEnum('published', ['true', 'false']),
];

const createMedia = [
  rules.url('url'),
  rules.enumValue('type', ['image', 'video', 'document']),
  rules.optionalText('alt', { max: 200 }),
];

const deleteMedia = [
  validateParams({ id: 'mongoId' }),
];
*/

module.exports = {
  // createPage: validateRequest(createPage),
  // updatePage: validateRequest(updatePage),
  // getPage: validateRequest(getPage),
  // deletePage: validateRequest(deletePage),
  // listPages: validateRequest(listPages),
  // createMedia: validateRequest(createMedia),
  // deleteMedia: validateRequest(deleteMedia),
};
