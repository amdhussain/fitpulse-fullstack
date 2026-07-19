const databaseService = require('../../services/databaseService');

const SettingsRepository = {
  async findByKey(key) {
    const doc = await databaseService.client.siteSettings.findOne({ key });
    return databaseService.formatDoc(doc);
  },

  async findManyByKeys(keys) {
    const docs = await databaseService.client.siteSettings.find({ key: { $in: keys } }).toArray();
    return databaseService.formatDocs(docs);
  },

  async findAll() {
    const docs = await databaseService.client.siteSettings.find().sort({ key: 1 }).toArray();
    return databaseService.formatDocs(docs);
  },

  async findMany({ where, page, limit, offset, sortBy, sortOrder }) {
    const match = {};
    if (where.key && where.key.$regex) {
      match.key = { $regex: where.key.$regex, $options: 'i' };
    } else if (where.key && where.key.$in) {
      match.key = { $in: where.key.$in };
    }

    const total = await databaseService.client.siteSettings.countDocuments(match);
    const sort = {};
    if (sortBy) sort[sortBy] = sortOrder === 'DESC' ? -1 : 1;
    else sort.key = 1;

    const docs = await databaseService.client.siteSettings
      .find(match).sort(sort).skip(offset).limit(limit).toArray();

    return { settings: databaseService.formatDocs(docs), total };
  },

  async create(key, value) {
    const now = new Date();
    const result = await databaseService.client.siteSettings.insertOne({
      key, value, createdAt: now, updatedAt: now,
    });
    const doc = await databaseService.client.siteSettings.findOne({ _id: result.insertedId });
    return databaseService.formatDoc(doc);
  },

  async update(key, value) {
    const doc = await databaseService.client.siteSettings.findOneAndUpdate(
      { key },
      { $set: { value, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );
    return databaseService.formatDoc(doc);
  },

  async upsert(key, value) {
    const now = new Date();
    const doc = await databaseService.client.siteSettings.findOneAndUpdate(
      { key },
      { $setOnInsert: { key }, $set: { value, updatedAt: now } },
      { upsert: true, returnDocument: 'after' }
    );
    return databaseService.formatDoc(doc);
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
    await databaseService.client.siteSettings.deleteOne({ key });
  },

  async deleteMany(keys) {
    await databaseService.client.siteSettings.deleteMany({ key: { $in: keys } });
  },

  async count(where = {}) {
    return databaseService.client.siteSettings.countDocuments(where);
  },

  async findByKeyLike(prefix) {
    const docs = await databaseService.client.siteSettings
      .find({ key: { $regex: `^${prefix}` } })
      .sort({ key: 1 })
      .toArray();
    return databaseService.formatDocs(docs);
  },
};

module.exports = SettingsRepository;
