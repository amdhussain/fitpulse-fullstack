const databaseService = require('../../services/databaseService');

const SETTINGS_SELECT = {
  id: true,
  key: true,
  value: true,
  createdAt: true,
  updatedAt: true,
};

const SettingsRepository = {
  async findByKey(key) {
    return databaseService.client.siteSettings.findUnique({
      where: { key },
      select: SETTINGS_SELECT,
    });
  },

  async findManyByKeys(keys) {
    return databaseService.client.siteSettings.findMany({
      where: { key: { in: keys } },
      select: SETTINGS_SELECT,
    });
  },

  async findAll() {
    return databaseService.client.siteSettings.findMany({
      select: SETTINGS_SELECT,
      orderBy: { key: 'asc' },
    });
  },

  async findMany({ where, page, limit, offset, sortBy, sortOrder }) {
    const allowedSortFields = ['key', 'createdAt', 'updatedAt'];
    const orderField = allowedSortFields.includes(sortBy) ? sortBy : 'key';
    const orderDirection = sortOrder === 'ASC' ? 'asc' : 'desc';

    const [settings, total] = await Promise.all([
      databaseService.client.siteSettings.findMany({
        where,
        select: SETTINGS_SELECT,
        skip: offset,
        take: limit,
        orderBy: { [orderField]: orderDirection },
      }),
      databaseService.client.siteSettings.count({ where }),
    ]);

    return { settings, total };
  },

  async create(key, value) {
    return databaseService.client.siteSettings.create({
      data: { key, value },
      select: SETTINGS_SELECT,
    });
  },

  async update(key, value) {
    return databaseService.client.siteSettings.update({
      where: { key },
      data: { value },
      select: SETTINGS_SELECT,
    });
  },

  async upsert(key, value) {
    return databaseService.client.siteSettings.upsert({
      where: { key },
      create: { key, value },
      update: { value },
      select: SETTINGS_SELECT,
    });
  },

  async upsertMany(settings) {
    const results = [];
    for (const { key, value } of settings) {
      const result = await this.upsert(key, value);
      results.push(result);
    }
    return results;
  },

  async delete(key) {
    return databaseService.client.siteSettings.delete({
      where: { key },
    });
  },

  async deleteMany(keys) {
    return databaseService.client.siteSettings.deleteMany({
      where: { key: { in: keys } },
    });
  },

  async count(where = {}) {
    return databaseService.client.siteSettings.count({ where });
  },

  async findByKeyLike(prefix) {
    return databaseService.client.siteSettings.findMany({
      where: { key: { startsWith: prefix } },
      select: SETTINGS_SELECT,
      orderBy: { key: 'asc' },
    });
  },
};

module.exports = SettingsRepository;
