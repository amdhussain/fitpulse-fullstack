const express = require('express');
const cookieParser = require('cookie-parser');
const env = require('../config/env');

const JSON_LIMIT = '10mb';
const URLENCODED_LIMIT = '10mb';

const jsonParser = express.json({
  limit: JSON_LIMIT,
  verify(req, res, buf) {
    req.rawBody = buf;
  },
  type: 'application/json',
});

const urlEncodedParser = express.urlencoded({
  extended: true,
  limit: URLENCODED_LIMIT,
  parameterLimit: 1000,
});

const cookieMiddleware = cookieParser(env.cookie.secret);

module.exports = {
  jsonParser,
  urlEncodedParser,
  cookieMiddleware,
};
