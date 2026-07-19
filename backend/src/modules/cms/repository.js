const { ObjectId } = require('mongodb');
const databaseService = require('../../services/databaseService');

const CmsRepository = {
  async findSectionByType(type) {
    const doc = await databaseService.client.cmsSections.findOne({ type });
    return databaseService.formatDoc(doc);
  },

  async findSectionById(id) {
    const doc = await databaseService.client.cmsSections.findOne({ _id: new ObjectId(id) });
    return databaseService.formatDoc(doc);
  },

  async findAllSections({ where = {} } = {}) {
    const match = {};
    if (where.status) match.status = where.status;
    const docs = await databaseService.client.cmsSections.find(match).sort({ type: 1 }).toArray();
    return databaseService.formatDocs(docs);
  },

  async createSection(data) {
    const now = new Date();
    const result = await databaseService.client.cmsSections.insertOne({ ...data, createdAt: now, updatedAt: now });
    const doc = await databaseService.client.cmsSections.findOne({ _id: result.insertedId });
    return databaseService.formatDoc(doc);
  },

  async updateSection(type, data) {
    const doc = await databaseService.client.cmsSections.findOneAndUpdate(
      { type },
      { $set: { ...data, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );
    return databaseService.formatDoc(doc);
  },

  async updateSectionById(id, data) {
    const doc = await databaseService.client.cmsSections.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...data, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );
    return databaseService.formatDoc(doc);
  },

  async deleteSection(type) {
    await databaseService.client.cmsSections.deleteOne({ type });
  },

  async deleteSectionById(id) {
    await databaseService.client.cmsSections.deleteOne({ _id: new ObjectId(id) });
  },

  async upsertSection(type, data) {
    const now = new Date();
    const doc = await databaseService.client.cmsSections.findOneAndUpdate(
      { type },
      { $setOnInsert: { type }, $set: { ...data, updatedAt: now } },
      { upsert: true, returnDocument: 'after' }
    );
    return databaseService.formatDoc(doc);
  },

  async countSections(where = {}) {
    return databaseService.client.cmsSections.countDocuments(where);
  },

  async findMediaById(id) {
    const doc = await databaseService.client.gallery.findOne({ _id: new ObjectId(id) });
    return databaseService.formatDoc(doc);
  },

  async findManyMedia({ where, page, limit, offset, sortBy, sortOrder }) {
    const match = {};
    if (where.status) match.status = where.status;
    if (where.category) match.category = where.category;
    if (where.featured !== undefined) match.featured = where.featured;
    if (where.$or) {
      match.$or = where.$or.map((cond) => {
        const converted = {};
        for (const [key, val] of Object.entries(cond)) {
          if (val && val.$regex) converted[key] = { $regex: val.$regex, $options: val.$options || 'i' };
          else converted[key] = val;
        }
        return converted;
      });
    }

    const total = await databaseService.client.gallery.countDocuments(match);
    const sort = {};
    if (sortBy) sort[sortBy] = sortOrder === 'DESC' ? -1 : 1;
    else sort.createdAt = -1;

    const docs = await databaseService.client.gallery
      .find(match).sort(sort).skip(offset).limit(limit).toArray();

    return { media: databaseService.formatDocs(docs), total };
  },

  async createMedia(data) {
    const now = new Date();
    const result = await databaseService.client.gallery.insertOne({ ...data, createdAt: now, updatedAt: now });
    const doc = await databaseService.client.gallery.findOne({ _id: result.insertedId });
    return databaseService.formatDoc(doc);
  },

  async updateMedia(id, data) {
    const doc = await databaseService.client.gallery.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...data, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );
    return databaseService.formatDoc(doc);
  },

  async deleteMedia(id) {
    await databaseService.client.gallery.deleteOne({ _id: new ObjectId(id) });
  },

  async countMedia(where = {}) {
    return databaseService.client.gallery.countDocuments(where);
  },

  async findDuplicateMedia(title, excludeId) {
    const query = { title };
    if (excludeId) query._id = { $ne: new ObjectId(excludeId) };
    const doc = await databaseService.client.gallery.findOne(query, { projection: { _id: 1, title: 1 } });
    return databaseService.formatDoc(doc);
  },
};

module.exports = CmsRepository;
