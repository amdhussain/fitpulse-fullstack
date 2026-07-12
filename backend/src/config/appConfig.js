const env = require('./env');
const constants = require('./constants');

const config = {
  env,
  ...constants,
};

module.exports = config;
