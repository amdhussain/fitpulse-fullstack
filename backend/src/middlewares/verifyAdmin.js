const authorize = require('./role.middleware');

module.exports = (...roles) => authorize(...(roles.length ? roles : ['ADMIN']));
