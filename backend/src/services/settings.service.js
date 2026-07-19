const SettingsRepository = require('../modules/settings/repository');
const logger = require('../utils/logger');

async function getAll() {
  const settings = await SettingsRepository.findAll();
  return settings.map(formatSetting);
}

async function getByKey(key) {
  const setting = await SettingsRepository.findByKey(key);
  return setting ? formatSetting(setting) : null;
}

async function getMany(keys) {
  const settings = await SettingsRepository.findManyByKeys(keys);
  const result = {};
  for (const s of settings) {
    result[s.key] = parseValue(s.value);
  }
  return result;
}

async function set(key, value) {
  const valueString = typeof value === 'string' ? value : JSON.stringify(value);
  const setting = await SettingsRepository.upsert(key, valueString);
  logger.info('Setting updated', { key });
  return formatSetting(setting);
}

async function setMany(settings) {
  const results = [];
  for (const [key, value] of Object.entries(settings)) {
    const result = await set(key, value);
    results.push(result);
  }
  return results;
}

async function remove(key) {
  await SettingsRepository.delete(key);
  logger.info('Setting deleted', { key });
}

function formatSetting(setting) {
  return {
    id: setting.id,
    key: setting.key,
    value: parseValue(setting.value),
    createdAt: setting.createdAt,
    updatedAt: setting.updatedAt,
  };
}

function parseValue(value) {
  if (value === null || value === undefined) return null;
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

module.exports = {
  getAll,
  getByKey,
  getMany,
  set,
  setMany,
  remove,
  formatSetting,
  parseValue,
};
