const { body, param, query, header, custom } = require('express-validator');
const msg = require('./messages.helper');

// ─── Identity ─────────────────────────────────────────────

const objectId = (field = 'id') =>
  body(field).trim().notEmpty().withMessage(msg.required(field)).isMongoId().withMessage(msg.objectId(field));

const optionalObjectId = (field = 'id') =>
  body(field).optional().trim().isMongoId().withMessage(msg.objectId(field));

const uuid = (field) =>
  body(field).trim().notEmpty().withMessage(msg.required(field)).isUUID().withMessage(msg.uuid);

const optionalUuid = (field) =>
  body(field).optional().trim().isUUID().withMessage(msg.uuid);

// ─── Route Params ─────────────────────────────────────────

const paramObjectId = (name = 'id') =>
  param(name).trim().notEmpty().withMessage(msg.required(name)).isMongoId().withMessage(msg.objectId(name));

const paramUUID = (name) =>
  param(name).trim().notEmpty().withMessage(msg.required(name)).isUUID().withMessage(msg.uuid);

const paramInteger = (name, { min = 1 } = {}) =>
  param(name).trim().notEmpty().withMessage(msg.required(name)).isInt({ min }).withMessage(msg.integer(name)).toInt();

// ─── Authentication ───────────────────────────────────────

const email = (field = 'email') =>
  body(field)
    .trim()
    .notEmpty().withMessage(msg.required(field))
    .isEmail().withMessage(msg.email)
    .normalizeEmail();

const optionalEmail = (field = 'email') =>
  body(field)
    .optional()
    .trim()
    .isEmail().withMessage(msg.email)
    .normalizeEmail();

const password = (field = 'password') =>
  body(field)
    .trim()
    .notEmpty().withMessage(msg.required(field))
    .isLength({ min: 8 }).withMessage(msg.tooShort(field, 8))
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#^()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z\d@$!%*?&.#^()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/)
    .withMessage(msg.password);

const passwordConfirmation = (passwordField = 'password', confirmField = 'passwordConfirm') =>
  body(confirmField)
    .trim()
    .notEmpty().withMessage(msg.required(confirmField))
    .custom((value, { req }) => value === req.body[passwordField])
    .withMessage(msg.passwordMismatch);

// ─── Names & Text ─────────────────────────────────────────

const name = (field = 'name', { min = 2, max = 100 } = {}) =>
  body(field)
    .trim()
    .notEmpty().withMessage(msg.required(field))
    .isLength({ min, max }).withMessage(msg.between(field, min, max))
    .matches(/^[a-zA-ZÀ-ÿ\u00C0-\u024F\s'-]+$/).withMessage(msg.alpha(field));

const optionalName = (field = 'name', { min = 2, max = 100 } = {}) =>
  body(field)
    .optional()
    .trim()
    .isLength({ min, max }).withMessage(msg.between(field, min, max))
    .matches(/^[a-zA-ZÀ-ÿ\u00C0-\u024F\s'-]+$/).withMessage(msg.alpha(field));

const text = (field, { min = 1, max = 5000 } = {}) =>
  body(field)
    .trim()
    .notEmpty().withMessage(msg.required(field))
    .isLength({ min, max }).withMessage(msg.between(field, min, max));

const optionalText = (field, { max = 5000 } = {}) =>
  body(field)
    .optional()
    .trim()
    .isLength({ max }).withMessage(msg.tooLong(field, max));

// ─── Contact ──────────────────────────────────────────────

const phone = (field = 'phone') =>
  body(field)
    .trim()
    .notEmpty().withMessage(msg.required(field))
    .isMobilePhone('any', { strictMode: false }).withMessage(msg.phone);

const optionalPhone = (field = 'phone') =>
  body(field)
    .optional()
    .trim()
    .isMobilePhone('any', { strictMode: false }).withMessage(msg.phone);

const url = (field) =>
  body(field)
    .trim()
    .notEmpty().withMessage(msg.required(field))
    .isURL({ protocols: ['http', 'https'], require_protocol: true }).withMessage(msg.url);

const optionalUrl = (field) =>
  body(field)
    .optional()
    .trim()
    .isURL({ protocols: ['http', 'https'], require_protocol: true }).withMessage(msg.url);

// ─── Numbers & Dates ──────────────────────────────────────

const number = (field, { min, max } = {}) =>
  body(field)
    .notEmpty().withMessage(msg.required(field))
    .isFloat({ min, max }).withMessage(msg.number(field));

const optionalNumber = (field, { min, max } = {}) =>
  body(field)
    .optional()
    .isFloat({ min, max }).withMessage(msg.number(field));

const positiveInteger = (field) =>
  body(field)
    .notEmpty().withMessage(msg.required(field))
    .isInt({ min: 1 }).withMessage(msg.integer(field))
    .toInt();

const optionalPositiveInteger = (field) =>
  body(field)
    .optional()
    .isInt({ min: 1 }).withMessage(msg.integer(field))
    .toInt();

const date = (field, { past = false, future = false } = {}) => {
  const chain = body(field)
    .trim()
    .notEmpty().withMessage(msg.required(field))
    .isISO8601().withMessage(msg.dateFormat);
  if (past) chain.custom((v) => new Date(v) < new Date()).withMessage(msg.pastDate(field));
  if (future) chain.custom((v) => new Date(v) > new Date()).withMessage(msg.futureDate(field));
  return chain;
};

const optionalDate = (field, { past = false, future = false } = {}) => {
  const chain = body(field)
    .optional()
    .trim()
    .isISO8601().withMessage(msg.dateFormat);
  if (past) chain.custom((v) => new Date(v) < new Date()).withMessage(msg.pastDate(field));
  if (future) chain.custom((v) => new Date(v) > new Date()).withMessage(msg.futureDate(field));
  return chain;
};

// ─── Enum & Boolean ───────────────────────────────────────

const enumValue = (field, values) =>
  body(field)
    .notEmpty().withMessage(msg.required(field))
    .isIn(values).withMessage(msg.enum(field, values));

const optionalEnum = (field, values) =>
  body(field)
    .optional()
    .isIn(values).withMessage(msg.enum(field, values));

const boolean = (field) =>
  body(field)
    .optional()
    .toBoolean(true);

// ─── Arrays ───────────────────────────────────────────────

const array = (field, { min = 0, max = Infinity } = {}) =>
  body(field)
    .isArray({ min, max }).withMessage(msg.array(field));

const optionalArray = (field, { min = 0, max = Infinity } = {}) =>
  body(field)
    .optional()
    .isArray({ min, max }).withMessage(msg.array(field));

const arrayOfObjectIds = (field, { min = 0, max = Infinity } = {}) =>
  body(field)
    .isArray({ min, max }).withMessage(msg.array(field))
    .custom((arr) => arr.every((v) => /^[0-9a-fA-F]{24}$/.test(v)))
    .withMessage(msg.objectId(field));

// ─── Slug ─────────────────────────────────────────────────

const slug = (field = 'slug') =>
  body(field)
    .trim()
    .notEmpty().withMessage(msg.required(field))
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).withMessage(msg.slug)
    .isLength({ max: 200 }).withMessage(msg.tooLong(field, 200));

const optionalSlug = (field = 'slug') =>
  body(field)
    .optional()
    .trim()
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).withMessage(msg.slug)
    .isLength({ max: 200 }).withMessage(msg.tooLong(field, 200));

// ─── File Upload ──────────────────────────────────────────

const file = (field, { maxSizeMB = 10, types = [] } = {}) => {
  const chain = body(field)
    .notEmpty().withMessage(msg.file(field));
  if (types.length > 0) {
    chain.isIn(types).withMessage(msg.fileType(field, types));
  }
  return chain;
};

// ─── Geolocation ──────────────────────────────────────────

const latitude = (field = 'latitude') =>
  body(field)
    .notEmpty().withMessage(msg.required(field))
    .isFloat({ min: -90, max: 90 }).withMessage(msg.latitude);

const longitude = (field = 'longitude') =>
  body(field)
    .notEmpty().withMessage(msg.required(field))
    .isFloat({ min: -180, max: 180 }).withMessage(msg.longitude);

const optionalLatitude = (field = 'latitude') =>
  body(field)
    .optional()
    .isFloat({ min: -90, max: 90 }).withMessage(msg.latitude);

const optionalLongitude = (field = 'longitude') =>
  body(field)
    .optional()
    .isFloat({ min: -180, max: 180 }).withMessage(msg.longitude);

// ─── Colors ───────────────────────────────────────────────

const hexColor = (field) =>
  body(field)
    .trim()
    .notEmpty().withMessage(msg.required(field))
    .isHexColor().withMessage(msg.hex(field));

const optionalHexColor = (field) =>
  body(field)
    .optional()
    .trim()
    .isHexColor().withMessage(msg.hex(field));

// ─── Network ──────────────────────────────────────────────

const ipAddress = (field) =>
  body(field)
    .trim()
    .notEmpty().withMessage(msg.required(field))
    .isIP().withMessage(msg.ip);

const optionalIpAddress = (field) =>
  body(field)
    .optional()
    .trim()
    .isIP().withMessage(msg.ip);

// ─── Conditional Rules ────────────────────────────────────

const requiredIf = (field, conditionField, conditionValue) =>
  body(field)
    .trim()
    .custom((value, { req }) => {
      if (conditionValue !== undefined) {
        if (req.body[conditionField] == conditionValue && !value) {
          return false;
        }
      } else {
        if (req.body[conditionField] && !value) {
          return false;
        }
      }
      return true;
    })
    .withMessage(msg.conditionalRequired(field, conditionField));

const optionalIf = (field, conditionField, conditionValue) =>
  body(field)
    .customSanitizer((value, { req }) => {
      if (conditionValue !== undefined) {
        return req.body[conditionField] == conditionValue ? value : undefined;
      }
      return req.body[conditionField] ? value : undefined;
    });

// ─── Custom ───────────────────────────────────────────────

const customValidation = (field, validatorFn, errorMessage) =>
  body(field)
    .custom(validatorFn)
    .withMessage(errorMessage);

// ─── Pagination & Sorting (Query) ─────────────────────────

const page = () =>
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage(msg.page)
    .toInt();

const limit = () =>
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage(msg.limit)
    .toInt();

const sort = (allowedFields = []) => {
  const chain = query('sort').optional().trim();
  if (allowedFields.length > 0) {
    chain.isIn(allowedFields).withMessage(msg.sort);
  }
  return chain;
};

// ─── Query Filters ────────────────────────────────────────

const queryEmail = (field = 'email') =>
  query(field)
    .optional()
    .trim()
    .isEmail().withMessage(msg.email)
    .normalizeEmail();

const queryText = (field) =>
  query(field)
    .optional()
    .trim()
    .isLength({ min: 1 }).withMessage(msg.required(field));

const queryEnum = (field, values) =>
  query(field)
    .optional()
    .isIn(values).withMessage(msg.enum(field, values));

const queryDateRange = (startField = 'startDate', endField = 'endDate') => [
  query(startField)
    .optional()
    .trim()
    .isISO8601().withMessage(msg.dateFormat),
  query(endField)
    .optional()
    .trim()
    .isISO8601().withMessage(msg.dateFormat),
];

// ─── Headers ──────────────────────────────────────────────

const bearerToken = () =>
  header('Authorization')
    .exists().withMessage(msg.required('Authorization'))
    .matches(/^Bearer\s+.{10,}$/).withMessage(msg.tokenInvalid);

const contentType = (expectedType = 'application/json') =>
  header('Content-Type')
    .equals(expectedType)
    .withMessage(`Content-Type must be ${expectedType}`);

module.exports = {
  // ─── Identity ──────────────────────────────────────────
  objectId,
  optionalObjectId,
  uuid,
  optionalUuid,

  // ─── Route Params ──────────────────────────────────────
  paramObjectId,
  paramUUID,
  paramInteger,

  // ─── Authentication ────────────────────────────────────
  email,
  optionalEmail,
  password,
  passwordConfirmation,

  // ─── Names & Text ──────────────────────────────────────
  name,
  optionalName,
  text,
  optionalText,

  // ─── Contact ───────────────────────────────────────────
  phone,
  optionalPhone,
  url,
  optionalUrl,

  // ─── Numbers & Dates ───────────────────────────────────
  number,
  optionalNumber,
  positiveInteger,
  optionalPositiveInteger,
  date,
  optionalDate,

  // ─── Enum & Boolean ────────────────────────────────────
  enumValue,
  optionalEnum,
  boolean,

  // ─── Arrays ────────────────────────────────────────────
  array,
  optionalArray,
  arrayOfObjectIds,

  // ─── Slug ──────────────────────────────────────────────
  slug,
  optionalSlug,

  // ─── File Upload ───────────────────────────────────────
  file,

  // ─── Geolocation ───────────────────────────────────────
  latitude,
  longitude,
  optionalLatitude,
  optionalLongitude,

  // ─── Colors ────────────────────────────────────────────
  hexColor,
  optionalHexColor,

  // ─── Network ───────────────────────────────────────────
  ipAddress,
  optionalIpAddress,

  // ─── Conditional ───────────────────────────────────────
  requiredIf,
  optionalIf,

  // ─── Custom ────────────────────────────────────────────
  customValidation,

  // ─── Pagination & Sorting ──────────────────────────────
  page,
  limit,
  sort,

  // ─── Query Filters ─────────────────────────────────────
  queryEmail,
  queryText,
  queryEnum,
  queryDateRange,

  // ─── Headers ───────────────────────────────────────────
  bearerToken,
  contentType,
};
