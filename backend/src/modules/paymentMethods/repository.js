const { ObjectId } = require('mongodb');
const databaseService = require('../../services/databaseService');

function formatPaymentMethod(doc) {
  if (!doc) return null;
  const { _id, ...rest } = doc;
  return { ...rest, id: _id.toString() };
}

const PaymentMethodRepository = {
  async findById(id) {
    const doc = await databaseService.client.paymentMethods.findOne({ _id: new ObjectId(id) });
    return formatPaymentMethod(doc);
  },

  async findAll({ where = {}, sortBy = 'sortOrder', sortOrder = 'ASC', page = 1, limit = 50 } = {}) {
    const match = {};
    if (where.isActive !== undefined) match.isActive = where.isActive;
    if (where.type) match.type = where.type;
    if (where.name && where.name.$regex) match.name = { $regex: where.name.$regex, $options: 'i' };

    const countPipeline = [{ $match: match }, { $count: 'total' }];
    const countResult = await databaseService.client.paymentMethods.aggregate(countPipeline).toArray();
    const total = countResult[0] ? countResult[0].total : 0;

    const sort = {};
    sort[sortBy] = sortOrder === 'DESC' ? -1 : 1;

    const offset = (page - 1) * limit;
    const pipeline = [
      { $match: match },
      { $sort: sort },
      { $skip: offset },
      { $limit: limit },
    ];
    const results = await databaseService.client.paymentMethods.aggregate(pipeline).toArray();

    return { paymentMethods: results.map(formatPaymentMethod), total };
  },

  async create(data) {
    const now = new Date();
    const insertData = {
      name: data.name,
      nameBn: data.nameBn || null,
      type: data.type,
      description: data.description || null,
      icon: data.icon || null,
      isActive: data.isActive !== undefined ? data.isActive : true,
      sortOrder: data.sortOrder || 0,
      createdAt: now,
      updatedAt: now,
    };
    const result = await databaseService.client.paymentMethods.insertOne(insertData);
    return this.findById(result.insertedId.toString());
  },

  async update(id, data) {
    const updateFields = { ...data, updatedAt: new Date() };
    if (updateFields.name !== undefined) delete updateFields.id;
    await databaseService.client.paymentMethods.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateFields }
    );
    return this.findById(id);
  },

  async delete(id) {
    await databaseService.client.paymentMethods.deleteOne({ _id: new ObjectId(id) });
  },

  async countActive() {
    return databaseService.client.paymentMethods.countDocuments({ isActive: true });
  },

  async countByType() {
    return databaseService.client.paymentMethods.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } },
      { $project: { _id: 0, type: '$_id', count: 1 } },
    ]).toArray();
  },

  async getMaxSortOrder() {
    const result = await databaseService.client.paymentMethods
      .find()
      .sort({ sortOrder: -1 })
      .limit(1)
      .toArray();
    return result[0] ? result[0].sortOrder + 1 : 1;
  },
};

module.exports = PaymentMethodRepository;
