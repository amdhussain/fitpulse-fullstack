const SettingsRepository = require('./repository');
const { NotFoundError, BadRequestError, ConflictError } = require('../../errors');
const logger = require('../../utils/logger');

// ─── Setting Key Groups ──────────────────────────────────

const SETTING_GROUPS = {
  general: [
    'site_name',
    'site_description',
    'logo',
    'favicon',
    'contact_email',
    'contact_phone',
    'address',
    'business_hours',
  ],
  social: [
    'social_facebook',
    'social_instagram',
    'social_linkedin',
    'social_youtube',
    'social_twitter',
  ],
  email: [
    'smtp_host',
    'smtp_port',
    'smtp_username',
    'smtp_password',
    'sender_email',
  ],
  seo: [
    'meta_title',
    'meta_description',
    'meta_keywords',
    'og_image',
  ],
  security: [
    'session_timeout',
    'password_policy',
    'login_attempt_limit',
  ],
};

const PUBLIC_GROUPS = ['general', 'social', 'seo'];

const ALL_KEYS = Object.values(SETTING_GROUPS).flat();

function parseJsonValue(value) {
  if (value === null || value === undefined) return null;
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

function serializeJsonValue(value) {
  if (value === null || value === undefined) return null;
  if (typeof value === 'string') return value;
  return JSON.stringify(value);
}

function formatSetting(setting) {
  if (!setting) return null;
  return {
    ...setting,
    value: parseJsonValue(setting.value),
  };
}

function formatSettings(settings) {
  return settings.map(formatSetting);
}

function groupSettings(settings) {
  const grouped = {};
  for (const [group, keys] of Object.entries(SETTING_GROUPS)) {
    grouped[group] = {};
    for (const key of keys) {
      const found = settings.find((s) => s.key === key);
      grouped[group][key] = found ? parseJsonValue(found.value) : null;
    }
  }
  return grouped;
}

// ─── Admin APIs ──────────────────────────────────────────

async function getAllSettings({ page, limit, search, group, sortBy, sortOrder } = {}) {
  if (page && limit) {
    const offset = (page - 1) * limit;

    const where = {};

    if (search) {
      where.key = { contains: search };
    }

    if (group && SETTING_GROUPS[group]) {
      where.key = { in: SETTING_GROUPS[group] };
    }

    const { settings, total } = await SettingsRepository.findMany({
      where,
      page,
      limit,
      offset,
      sortBy,
      sortOrder,
    });

    return {
      data: formatSettings(settings),
      total,
      page,
      limit,
    };
  }

  let settings;
  if (group && SETTING_GROUPS[group]) {
    settings = await SettingsRepository.findManyByKeys(SETTING_GROUPS[group]);
  } else {
    settings = await SettingsRepository.findAll();
  }

  return {
    data: formatSettings(settings),
    grouped: groupSettings(settings),
    total: settings.length,
  };
}

async function getSettingByKey(key) {
  const setting = await SettingsRepository.findByKey(key);

  if (!setting) {
    throw new NotFoundError(`Setting '${key}' not found`);
  }

  return formatSetting(setting);
}

async function getSettingsByGroup(group) {
  if (!SETTING_GROUPS[group]) {
    throw new BadRequestError(`Invalid group '${group}'. Valid groups: ${Object.keys(SETTING_GROUPS).join(', ')}`);
  }

  const settings = await SettingsRepository.findManyByKeys(SETTING_GROUPS[group]);
  return formatSettings(settings);
}

async function updateSetting(key, value) {
  const existing = await SettingsRepository.findByKey(key);

  const serialized = serializeJsonValue(value);

  let setting;
  if (existing) {
    setting = await SettingsRepository.update(key, serialized);
  } else {
    setting = await SettingsRepository.create(key, serialized);
  }

  logger.info('Setting updated', { key });

  return formatSetting(setting);
}

async function updateSettings(settingsArray) {
  const results = [];

  for (const { key, value } of settingsArray) {
    if (!key) continue;
    const serialized = serializeJsonValue(value);
    const setting = await SettingsRepository.upsert(key, serialized);
    results.push(formatSetting(setting));
  }

  logger.info('Settings batch updated', { count: results.length });

  return results;
}

async function updateGroupSettings(group, settingsObj) {
  if (!SETTING_GROUPS[group]) {
    throw new BadRequestError(`Invalid group '${group}'. Valid groups: ${Object.keys(SETTING_GROUPS).join(', ')}`);
  }

  const allowedKeys = SETTING_GROUPS[group];
  const settingsArray = [];

  for (const [key, value] of Object.entries(settingsObj)) {
    if (allowedKeys.includes(key)) {
      settingsArray.push({ key, value });
    }
  }

  if (settingsArray.length === 0) {
    throw new BadRequestError('No valid settings to update');
  }

  return updateSettings(settingsArray);
}

async function deleteSetting(key) {
  const existing = await SettingsRepository.findByKey(key);

  if (!existing) {
    throw new NotFoundError(`Setting '${key}' not found`);
  }

  await SettingsRepository.delete(key);

  logger.info('Setting deleted', { key });

  return { message: `Setting '${key}' deleted successfully` };
}

async function deleteGroupSettings(group) {
  if (!SETTING_GROUPS[group]) {
    throw new BadRequestError(`Invalid group '${group}'. Valid groups: ${Object.keys(SETTING_GROUPS).join(', ')}`);
  }

  const keys = SETTING_GROUPS[group];
  await SettingsRepository.deleteMany(keys);

  logger.info('Settings group deleted', { group });

  return { message: `Settings group '${group}' deleted successfully` };
}

async function initializeDefaults() {
  const defaults = {
    general: {
      site_name: 'FitPulse',
      site_description: 'Your ultimate fitness destination',
      logo: '',
      favicon: '',
      contact_email: 'info@fitpulse.com',
      contact_phone: '',
      address: '',
      business_hours: '{"monday":"06:00-22:00","tuesday":"06:00-22:00","wednesday":"06:00-22:00","thursday":"06:00-22:00","friday":"06:00-22:00","saturday":"08:00-20:00","sunday":"08:00-18:00"}',
    },
    social: {
      social_facebook: '',
      social_instagram: '',
      social_linkedin: '',
      social_youtube: '',
      social_twitter: '',
    },
    email: {
      smtp_host: '',
      smtp_port: '587',
      smtp_username: '',
      smtp_password: '',
      sender_email: 'noreply@fitpulse.com',
    },
    seo: {
      meta_title: 'FitPulse - Fitness Booking Platform',
      meta_description: 'Book fitness classes, train with expert trainers, and achieve your fitness goals.',
      meta_keywords: 'fitness, gym, classes, trainers, booking',
      og_image: '',
    },
    security: {
      session_timeout: '3600',
      password_policy: '{"minLength":8,"requireUppercase":true,"requireLowercase":true,"requireNumber":true,"requireSpecial":true}',
      login_attempt_limit: '5',
    },
  };

  const results = {};
  for (const [group, settings] of Object.entries(defaults)) {
    results[group] = [];
    for (const [key, value] of Object.entries(settings)) {
      const existing = await SettingsRepository.findByKey(key);
      if (!existing) {
        const setting = await SettingsRepository.create(key, value);
        results[group].push(formatSetting(setting));
      }
    }
  }

  logger.info('Default settings initialized');

  return results;
}

// ─── Public APIs ─────────────────────────────────────────

async function getPublicSettings() {
  const keys = PUBLIC_GROUPS.flatMap((group) => SETTING_GROUPS[group]);
  const settings = await SettingsRepository.findManyByKeys(keys);
  return groupSettings(settings);
}

async function getPublicSettingsByGroup(group) {
  if (!PUBLIC_GROUPS.includes(group)) {
    throw new BadRequestError(`Group '${group}' is not publicly accessible`);
  }

  if (!SETTING_GROUPS[group]) {
    throw new BadRequestError(`Invalid group '${group}'. Valid groups: ${Object.keys(SETTING_GROUPS).join(', ')}`);
  }

  const settings = await SettingsRepository.findManyByKeys(SETTING_GROUPS[group]);
  return formatSettings(settings);
}

async function getPublicSettingByKey(key) {
  const isPublic = PUBLIC_GROUPS.some((group) => SETTING_GROUPS[group].includes(key));

  if (!isPublic) {
    throw new BadRequestError(`Setting '${key}' is not publicly accessible`);
  }

  const setting = await SettingsRepository.findByKey(key);

  if (!setting) {
    throw new NotFoundError(`Setting '${key}' not found`);
  }

  return formatSetting(setting);
}

module.exports = {
  SETTING_GROUPS,
  PUBLIC_GROUPS,
  getAllSettings,
  getSettingByKey,
  getSettingsByGroup,
  updateSetting,
  updateSettings,
  updateGroupSettings,
  deleteSetting,
  deleteGroupSettings,
  initializeDefaults,
  getPublicSettings,
  getPublicSettingsByGroup,
  getPublicSettingByKey,
};
