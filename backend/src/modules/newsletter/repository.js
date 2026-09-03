const { ObjectId } = require('mongodb');
const databaseService = require('../../services/databaseService');

function formatSubscriber(doc) {
  if (!doc) return null;
  const { _id, ...rest } = doc;
  return { id: _id.toString(), ...rest };
}

const NewsletterRepository = {
  async findById(id) {
    const doc = await databaseService.client.newsletters.findOne({ _id: new ObjectId(id) });
    return formatSubscriber(doc);
  },

  async findByEmail(email) {
    const doc = await databaseService.client.newsletters.findOne({ email: email.toLowerCase() });
    return formatSubscriber(doc);
  },

  async create(data) {
    const now = new Date();
    const insertData = {
      email: data.email.toLowerCase(),
      name: data.name || null,
      status: data.status || 'ACTIVE',
      source: data.source || 'Manual',
      subscribedAt: now,
      createdAt: now,
      updatedAt: now,
    };
    const result = await databaseService.client.newsletters.insertOne(insertData);
    return this.findById(result.insertedId.toString());
  },

  async update(id, data) {
    const updateFields = { ...data, updatedAt: new Date() };
    await databaseService.client.newsletters.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateFields }
    );
    return this.findById(id);
  },

  async delete(id) {
    await databaseService.client.newsletters.deleteOne({ _id: new ObjectId(id) });
  },

  async findMany({ where, page, limit, offset, sortBy, sortOrder }) {
    const match = {};
    if (where.status) match.status = where.status;

    const pipeline = [{ $match: match }];

    if (where.$or) {
      const orConditions = [];
      for (const cond of where.$or) {
        if (cond.email && cond.email.$regex) orConditions.push({ email: { $regex: cond.email.$regex, $options: 'i' } });
        if (cond.name && cond.name.$regex) orConditions.push({ name: { $regex: cond.name.$regex, $options: 'i' } });
      }
      if (orConditions.length > 0) pipeline.push({ $match: { $or: orConditions } });
    }

    const countPipeline = [...pipeline, { $count: 'total' }];
    const countResult = await databaseService.client.newsletters.aggregate(countPipeline).toArray();
    const total = countResult[0] ? countResult[0].total : 0;

    const sort = {};
    if (sortBy) sort[sortBy] = sortOrder === 'DESC' ? -1 : 1;
    else sort.createdAt = -1;
    pipeline.push({ $sort: sort }, { $skip: offset }, { $limit: limit });
    const results = await databaseService.client.newsletters.aggregate(pipeline).toArray();

    return { subscribers: results.map(formatSubscriber), total };
  },

  async countByStatus() {
    const results = await databaseService.client.newsletters.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]).toArray();
    const counts = { ACTIVE: 0, UNSUBSCRIBED: 0 };
    for (const r of results) {
      counts[r._id] = r.count;
    }
    return counts;
  },
};

module.exports = NewsletterRepository;
