const { ObjectId } = require('mongodb');
const databaseService = require('../../services/databaseService');

function paymentLookupPipeline() {
  return [
    { $lookup: { from: 'users', localField: 'userId', foreignField: '_id', as: 'userArr', pipeline: [{ $project: { _id: 1, firstName: 1, lastName: 1, email: 1, phone: 1 } }] } },
    { $lookup: { from: 'bookings', localField: 'bookingId', foreignField: '_id', as: 'bookingArr', pipeline: [{ $project: { _id: 1, userId: 1, classId: 1, serviceId: 1, trainerId: 1, bookingDate: 1, bookingTime: 1, status: 1 } }] } },
    { $addFields: { user: { $arrayElemAt: ['$userArr', 0] }, booking: { $arrayElemAt: ['$bookingArr', 0] }, userId: { $toString: '$userId' } } },
    { $project: { userArr: 0, bookingArr: 0 } },
  ];
}

function formatPayment(doc) {
  if (!doc) return null;
  const { _id, user, booking, ...rest } = doc;
  const formatted = { ...rest, id: _id.toString() };
  if (user) {
    formatted.user = { ...user, id: user._id.toString() };
    delete formatted.user._id;
  }
  if (booking) {
    formatted.booking = { ...booking, id: booking._id.toString() };
    delete formatted.booking._id;
  }
  return formatted;
}

const PaymentRepository = {
  async findById(id) {
    const pipeline = [
      { $match: { _id: new ObjectId(id) } },
      ...paymentLookupPipeline(),
    ];
    const results = await databaseService.client.payments.aggregate(pipeline).toArray();
    return formatPayment(results[0] || null);
  },

  async findByIdBasic(id) {
    const doc = await databaseService.client.payments.findOne({ _id: new ObjectId(id) });
    if (!doc) return null;
    const result = { ...doc, id: doc._id.toString() };
    if (doc.userId) result.userId = doc.userId.toString();
    if (doc.bookingId) result.bookingId = doc.bookingId.toString();
    delete result._id;
    return result;
  },

  async create(data) {
    const now = new Date();
    const insertData = {
      bookingId: data.bookingId ? new ObjectId(data.bookingId) : null,
      userId: new ObjectId(data.userId),
      amount: data.amount,
      currency: data.currency || 'USD',
      status: data.status || 'PENDING',
      paymentMethod: data.paymentMethod || null,
      transactionId: data.transactionId || null,
      invoiceNumber: data.invoiceNumber || null,
      notes: data.notes || null,
      metadata: data.metadata || null,
      createdAt: now,
      updatedAt: now,
    };
    const result = await databaseService.client.payments.insertOne(insertData);
    return this.findById(result.insertedId.toString());
  },

  async update(id, data) {
    const updateFields = { ...data, updatedAt: new Date() };
    if (data.userId) updateFields.userId = new ObjectId(data.userId);
    if (data.bookingId) updateFields.bookingId = new ObjectId(data.bookingId);
    await databaseService.client.payments.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateFields }
    );
    return this.findById(id);
  },

  async delete(id) {
    await databaseService.client.payments.deleteOne({ _id: new ObjectId(id) });
  },

  async findByUserId(userId, { where, page, limit, offset, sortBy, sortOrder }) {
    const match = { userId: new ObjectId(userId) };
    if (where.status) match.status = where.status;

    const pipeline = [{ $match: match }, ...paymentLookupPipeline()];

    if (where.$or) {
      const orConditions = [];
      for (const cond of where.$or) {
        if (cond.transactionId && cond.transactionId.$regex) orConditions.push({ transactionId: { $regex: cond.transactionId.$regex, $options: 'i' } });
        if (cond.invoiceNumber && cond.invoiceNumber.$regex) orConditions.push({ invoiceNumber: { $regex: cond.invoiceNumber.$regex, $options: 'i' } });
        if (cond.notes && cond.notes.$regex) orConditions.push({ notes: { $regex: cond.notes.$regex, $options: 'i' } });
      }
      if (orConditions.length > 0) pipeline.push({ $match: { $or: orConditions } });
    }

    const countPipeline = [...pipeline, { $count: 'total' }];
    const countResult = await databaseService.client.payments.aggregate(countPipeline).toArray();
    const total = countResult[0] ? countResult[0].total : 0;

    const sort = {};
    if (sortBy) sort[sortBy] = sortOrder === 'DESC' ? -1 : 1;
    else sort.createdAt = -1;
    pipeline.push({ $sort: sort }, { $skip: offset }, { $limit: limit });
    const results = await databaseService.client.payments.aggregate(pipeline).toArray();

    return { payments: results.map(formatPayment), total };
  },

  async findMany({ where, page, limit, offset, sortBy, sortOrder }) {
    const match = {};
    if (where.status) match.status = where.status;
    if (where.userId) match.userId = new ObjectId(where.userId);
    if (where.bookingId) match.bookingId = new ObjectId(where.bookingId);

    const pipeline = [{ $match: match }, ...paymentLookupPipeline()];

    if (where.$or) {
      const orConditions = [];
      for (const cond of where.$or) {
        if (cond.user && cond.user.firstName && cond.user.firstName.$regex) orConditions.push({ 'user.firstName': { $regex: cond.user.firstName.$regex, $options: 'i' } });
        if (cond.user && cond.user.lastName && cond.user.lastName.$regex) orConditions.push({ 'user.lastName': { $regex: cond.user.lastName.$regex, $options: 'i' } });
        if (cond.user && cond.user.email && cond.user.email.$regex) orConditions.push({ 'user.email': { $regex: cond.user.email.$regex, $options: 'i' } });
        if (cond.transactionId && cond.transactionId.$regex) orConditions.push({ transactionId: { $regex: cond.transactionId.$regex, $options: 'i' } });
        if (cond.invoiceNumber && cond.invoiceNumber.$regex) orConditions.push({ invoiceNumber: { $regex: cond.invoiceNumber.$regex, $options: 'i' } });
        if (cond.notes && cond.notes.$regex) orConditions.push({ notes: { $regex: cond.notes.$regex, $options: 'i' } });
      }
      if (orConditions.length > 0) pipeline.push({ $match: { $or: orConditions } });
    }

    const countPipeline = [...pipeline, { $count: 'total' }];
    const countResult = await databaseService.client.payments.aggregate(countPipeline).toArray();
    const total = countResult[0] ? countResult[0].total : 0;

    const sort = {};
    if (sortBy) sort[sortBy] = sortOrder === 'DESC' ? -1 : 1;
    else sort.createdAt = -1;
    pipeline.push({ $sort: sort }, { $skip: offset }, { $limit: limit });
    const results = await databaseService.client.payments.aggregate(pipeline).toArray();

    return { payments: results.map(formatPayment), total };
  },

  async findByBookingId(bookingId) {
    const doc = await databaseService.client.payments.findOne({ bookingId: new ObjectId(bookingId) });
    if (!doc) return null;
    const result = { ...doc, id: doc._id.toString() };
    if (doc.userId) result.userId = doc.userId.toString();
    if (doc.bookingId) result.bookingId = doc.bookingId.toString();
    delete result._id;
    return result;
  },

  async findBookingById(id) {
    const doc = await databaseService.client.bookings.findOne(
      { _id: new ObjectId(id) },
      { projection: { _id: 1, userId: 1, classId: 1, serviceId: 1, status: 1 } }
    );
    if (!doc) return null;
    const result = { id: doc._id.toString() };
    if (doc.userId) result.userId = doc.userId.toString();
    if (doc.classId) result.classId = doc.classId.toString();
    if (doc.serviceId) result.serviceId = doc.serviceId.toString();
    result.status = doc.status;
    return result;
  },

  async getRevenueStats({ startDate, endDate }) {
    const match = {};
    if (startDate || endDate) {
      match.createdAt = {};
      if (startDate) match.createdAt.$gte = new Date(startDate);
      if (endDate) match.createdAt.$lte = new Date(endDate);
    }
    match.status = 'PAID';

    const results = await databaseService.client.payments.aggregate([
      { $match: match },
      { $group: { _id: null, totalRevenue: { $sum: '$amount' }, totalTransactions: { $sum: 1 } } },
    ]).toArray();

    return results[0] || { totalRevenue: 0, totalTransactions: 0 };
  },

  async getRevenueByMethod({ startDate, endDate }) {
    const match = { status: 'PAID' };
    if (startDate || endDate) {
      match.createdAt = {};
      if (startDate) match.createdAt.$gte = new Date(startDate);
      if (endDate) match.createdAt.$lte = new Date(endDate);
    }

    return databaseService.client.payments.aggregate([
      { $match: match },
      { $group: { _id: '$paymentMethod', total: { $sum: '$amount' }, count: { $sum: 1 } } },
      { $project: { _id: 0, method: '$_id', total: 1, count: 1 } },
    ]).toArray();
  },

  async getDailyRevenue({ startDate, endDate }) {
    const match = { status: 'PAID' };
    if (startDate || endDate) {
      match.createdAt = {};
      if (startDate) match.createdAt.$gte = new Date(startDate);
      if (endDate) match.createdAt.$lte = new Date(endDate);
    }

    return databaseService.client.payments.aggregate([
      { $match: match },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $project: { _id: 0, date: '$_id', total: 1, count: 1 } },
    ]).toArray();
  },

  async generateInvoiceNumber() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const monthStart = new Date(year, now.getMonth(), 1);
    const monthEnd = new Date(year, now.getMonth() + 1, 0, 23, 59, 59);
    const count = await databaseService.client.payments.countDocuments({
      createdAt: { $gte: monthStart, $lte: monthEnd },
    });
    const seq = String(count + 1).padStart(4, '0');
    return `INV-${year}${month}-${seq}`;
  },

  async generateTransactionId() {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `TXN-${timestamp}-${random}`;
  },
};

module.exports = PaymentRepository;
