const { validateRequest, validateParams } = require('./middlewares');
const rules = require('./helpers/rules.helper');

// ─── Community Validators ─────────────────────────────────
// Uncomment and wire into routes as the community module is built.

/*
const createPost = [
  rules.text('title', { min: 3, max: 200 }),
  rules.text('content', { min: 10, max: 10000 }),
  rules.optionalArray('tags'),
  rules.optionalUrl('image'),
];

const updatePost = [
  validateParams({ id: 'mongoId' }),
  rules.optionalText('title', { max: 200 }),
  rules.optionalText('content', { max: 10000 }),
  rules.optionalArray('tags'),
];

const deletePost = [
  validateParams({ id: 'mongoId' }),
];

const getPost = [
  validateParams({ id: 'mongoId' }),
];

const listPosts = [
  rules.page(),
  rules.limit(),
  rules.sort(['createdAt', 'likes', 'comments']),
  rules.queryText('search'),
  rules.queryText('tag'),
];

const createComment = [
  validateParams({ id: 'mongoId' }),
  rules.text('content', { min: 1, max: 2000 }),
];

const deleteComment = [
  validateParams({ id: 'mongoId', commentId: 'mongoId' }),
];

const likePost = [
  validateParams({ id: 'mongoId' }),
];
*/

module.exports = {
  // createPost: validateRequest(createPost),
  // updatePost: validateRequest(updatePost),
  // deletePost: validateRequest(deletePost),
  // getPost: validateRequest(getPost),
  // listPosts: validateRequest(listPosts),
  // createComment: validateRequest(createComment),
  // deleteComment: validateRequest(deleteComment),
  // likePost: validateRequest(likePost),
};
