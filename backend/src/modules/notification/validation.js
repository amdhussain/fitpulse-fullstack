const { validateRequest, validateParams, validateQuery } = require('../../validators/middlewares');
const rules = require('../../validators/helpers/rules.helper');

const getNotifications = validateQuery([
  rules.page(),
  rules.limit(),
  rules.queryEnum('type', ['booking', 'membership', 'message', 'system']),
  rules.queryEnum('read', ['true', 'false']),
]);

const idParam = validateParams({ id: 'string' });

module.exports = {
  getNotifications,
  idParam,
};
