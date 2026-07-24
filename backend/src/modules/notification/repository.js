const { ObjectId } = require('mongodb');
const databaseService = require('../../services/databaseService');

const NotificationRepository = {
  async create(data) {
    const now = new Date();
    const insertData = {
      type: data.type,
      title: data.title,
      message: data.message,
      read: false,
      relatedId: data.relatedId || null,
      metadata: data.metadata || null,
      createdAt: now,
      updatedAt: now,
    };
    const result = await databaseService.client.notifications.insertOne(insertData);
    return this.findById(result.insertedId.toString());
  },

  async findById(id) {
    const doc = await databaseService.client.notifications.findOne({ _id: new ObjectId(id) });
    return databaseService.formatDoc(doc);
  },

  async findMany({ where = {}, page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'DESC' }) {
    const match = {};
    if (where.type) match.type = where.type;
    if (where.read !== undefined) match.read = where.read;

    const sort = {};
    sort[sortBy] = sortOrder === 'DESC' ? -1 : 1;

    const countPipeline = [{ $match: match }, { $count: 'total' }];
    const countResult = await databaseService.client.notifications.aggregate(countPipeline).toArray();
    const total = countResult[0] ? countResult[0].total : 0;

    const pipeline = [
      { $match: match },
      { $sort: sort },
      { $skip: (page - 1) * limit },
      { $limit: limit },
    ];
    const results = await databaseService.client.notifications.aggregate(pipeline).toArray();

    return { data: databaseService.formatDocs(results), total, page, limit };
  },

  async markAsRead(id) {
    await databaseService.client.notifications.updateOne(
      { _id: new ObjectId(id) },
      { $set: { read: true, updatedAt: new Date() } }
    );
    return this.findById(id);
  },

  async markAllAsRead() {
    await databaseService.client.notifications.updateMany(
      { read: false },
      { $set: { read: true, updatedAt: new Date() } }
    );
  },

  async deleteOne(id) {
    await databaseService.client.notifications.deleteOne({ _id: new ObjectId(id) });
  },

  async deleteAll() {
    await databaseService.client.notifications.deleteMany({});
  },
};

module.exports = NotificationRepository;
