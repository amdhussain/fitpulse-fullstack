const { ObjectId } = require('mongodb');
const databaseService = require('../../services/databaseService');

const USER_FIELDS = { _id: 1, firstName: 1, lastName: 1, email: 1, phone: 1, profileImage: 1 };

function bookingLookupPipeline() {
  return [
    { $lookup: { from: 'users', localField: 'userId', foreignField: '_id', as: 'userArr', pipeline: [{ $project: USER_FIELDS }] } },
    { $lookup: { from: 'classes', localField: 'classId', foreignField: '_id', as: 'classArr', pipeline: [{ $project: { _id: 1, name: 1, category: 1, difficulty: 1, capacity: 1, availableSeats: 1, schedule: 1, duration: 1, price: 1, image: 1, status: 1 } }] } },
    {
      $lookup: {
        from: 'trainers',
        localField: 'trainerId',
        foreignField: '_id',
        as: 'trainerArr',
        pipeline: [
          { $lookup: { from: 'users', localField: 'userId', foreignField: '_id', as: 'userArr', pipeline: [{ $project: { _id: 1, firstName: 1, lastName: 1, email: 1 } }] } },
          { $addFields: { user: { $arrayElemAt: ['$userArr', 0] } } },
          { $project: { userArr: 0, _id: 1, userId: { $toString: '$userId' }, bio: 1, specialization: 1, designation: 1, experience: 1, rating: 1, user: 1 } },
        ],
      },
    },
    {
      $addFields: {
        user: { $arrayElemAt: ['$userArr', 0] },
        class: { $arrayElemAt: ['$classArr', 0] },
        trainer: { $arrayElemAt: ['$trainerArr', 0] },
        userId: { $toString: '$userId' },
        classId: { $cond: { if: '$classId', then: { $toString: '$classId' }, else: null } },
        trainerId: { $cond: { if: '$trainerId', then: { $toString: '$trainerId' }, else: null } },
      },
    },
    { $project: { userArr: 0, classArr: 0, trainerArr: 0 } },
  ];
}

function formatBooking(doc) {
  if (!doc) return null;
  const { _id, user, class: cls, trainer, ...rest } = doc;
  const formatted = { ...rest, id: _id.toString() };
  if (user) {
    formatted.user = { ...user, id: user._id.toString() };
    delete formatted.user._id;
  }
  if (cls) {
    formatted.class = { ...cls, id: cls._id.toString() };
    delete formatted.class._id;
  }
  if (trainer) {
    formatted.trainer = { ...trainer, id: trainer._id.toString() };
    if (formatted.trainer.user) {
      formatted.trainer.user = { ...formatted.trainer.user, id: formatted.trainer.user._id.toString() };
      delete formatted.trainer.user._id;
    }
  }
  return formatted;
}

function formatBookings(docs) {
  if (!Array.isArray(docs)) return [];
  return docs.map(formatBooking);
}

const BookingRepository = {
  async findById(id) {
    const pipeline = [
      { $match: { _id: new ObjectId(id) } },
      ...bookingLookupPipeline(),
    ];
    const results = await databaseService.client.bookings.aggregate(pipeline).toArray();
    return formatBooking(results[0] || null);
  },

  async findByIdBasic(id) {
    const doc = await databaseService.client.bookings.findOne({ _id: new ObjectId(id) });
    if (!doc) return null;
    const result = { ...doc, id: doc._id.toString(), userId: doc.userId.toString() };
    if (doc.classId) result.classId = doc.classId.toString();
    if (doc.trainerId) result.trainerId = doc.trainerId.toString();
    if (doc.serviceId) result.serviceId = doc.serviceId.toString();
    delete result._id;
    return result;
  },

  async create(data, session) {
    const now = new Date();
    const insertData = {
      userId: new ObjectId(data.userId),
      classId: data.classId ? new ObjectId(data.classId) : null,
      serviceId: data.serviceId ? new ObjectId(data.serviceId) : null,
      trainerId: data.trainerId ? new ObjectId(data.trainerId) : null,
      bookingDate: data.bookingDate || null,
      bookingTime: data.bookingTime || null,
      status: data.status || 'PENDING',
      attended: data.attended || false,
      notes: data.notes || null,
      cancelReason: data.cancelReason || null,
      createdAt: now,
      updatedAt: now,
    };
    const options = session ? { session } : {};
    const result = await databaseService.client.bookings.insertOne(insertData, options);
    return this.findById(result.insertedId.toString());
  },

  async update(id, data, session) {
    const updateFields = { ...data, updatedAt: new Date() };
    if (data.userId) updateFields.userId = new ObjectId(data.userId);
    if (data.classId) updateFields.classId = new ObjectId(data.classId);
    if (data.trainerId) updateFields.trainerId = new ObjectId(data.trainerId);
    if (data.serviceId) updateFields.serviceId = new ObjectId(data.serviceId);
    const options = session ? { session } : {};
    await databaseService.client.bookings.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateFields },
      options
    );
    return this.findById(id);
  },

  async delete(id, session) {
    const options = session ? { session } : {};
    await databaseService.client.bookings.deleteOne({ _id: new ObjectId(id) }, options);
  },

  async findDuplicate(userId, classId) {
    const doc = await databaseService.client.bookings.findOne({
      userId: new ObjectId(userId),
      classId: new ObjectId(classId),
      status: { $ne: 'CANCELLED' },
    });
    return databaseService.formatDoc(doc);
  },

  async findByUserId(userId, { where, page, limit, offset, sortBy, sortOrder }) {
    const match = { userId: new ObjectId(userId) };
    if (where.status) match.status = where.status;

    const pipeline = [{ $match: match }, ...bookingLookupPipeline()];

    if (where.$or) {
      const orConditions = [];
      for (const cond of where.$or) {
        if (cond.class && cond.class.name && cond.class.name.$regex) {
          orConditions.push({ 'class.name': { $regex: cond.class.name.$regex, $options: 'i' } });
        }
        if (cond.notes && cond.notes.$regex) {
          orConditions.push({ notes: { $regex: cond.notes.$regex, $options: 'i' } });
        }
      }
      if (orConditions.length > 0) pipeline.push({ $match: { $or: orConditions } });
    }

    const countPipeline = [...pipeline, { $count: 'total' }];
    const countResult = await databaseService.client.bookings.aggregate(countPipeline).toArray();
    const total = countResult[0] ? countResult[0].total : 0;

    const sort = {};
    if (sortBy) {
      sort[sortBy] = sortOrder === 'DESC' ? -1 : 1;
    } else {
      sort.createdAt = -1;
    }
    pipeline.push({ $sort: sort }, { $skip: offset }, { $limit: limit });
    const results = await databaseService.client.bookings.aggregate(pipeline).toArray();

    return { bookings: formatBookings(results), total };
  },

  async findByClassIds(classIds, { where, page, limit, offset, sortBy, sortOrder }) {
    const match = { classId: { $in: classIds.map((id) => new ObjectId(id)) } };
    if (where.status) match.status = where.status;

    const pipeline = [{ $match: match }, ...bookingLookupPipeline()];

    if (where.$or) {
      const orConditions = [];
      for (const cond of where.$or) {
        if (cond.user && cond.user.firstName && cond.user.firstName.$regex) {
          orConditions.push({ 'user.firstName': { $regex: cond.user.firstName.$regex, $options: 'i' } });
        }
        if (cond.user && cond.user.lastName && cond.user.lastName.$regex) {
          orConditions.push({ 'user.lastName': { $regex: cond.user.lastName.$regex, $options: 'i' } });
        }
        if (cond.user && cond.user.email && cond.user.email.$regex) {
          orConditions.push({ 'user.email': { $regex: cond.user.email.$regex, $options: 'i' } });
        }
        if (cond.notes && cond.notes.$regex) {
          orConditions.push({ notes: { $regex: cond.notes.$regex, $options: 'i' } });
        }
      }
      if (orConditions.length > 0) pipeline.push({ $match: { $or: orConditions } });
    }

    const countPipeline = [...pipeline, { $count: 'total' }];
    const countResult = await databaseService.client.bookings.aggregate(countPipeline).toArray();
    const total = countResult[0] ? countResult[0].total : 0;

    const sort = {};
    if (sortBy) {
      sort[sortBy] = sortOrder === 'DESC' ? -1 : 1;
    } else {
      sort.createdAt = -1;
    }
    pipeline.push({ $sort: sort }, { $skip: offset }, { $limit: limit });
    const results = await databaseService.client.bookings.aggregate(pipeline).toArray();

    return { bookings: formatBookings(results), total };
  },

  async findMany({ where, page, limit, offset, sortBy, sortOrder }) {
    const match = {};
    if (where.status) match.status = where.status;
    if (where.userId) match.userId = new ObjectId(where.userId);
    if (where.classId) match.classId = new ObjectId(where.classId);
    if (where.trainerId) match.trainerId = new ObjectId(where.trainerId);

    const pipeline = [{ $match: match }, ...bookingLookupPipeline()];

    if (where.$or) {
      const orConditions = [];
      for (const cond of where.$or) {
        if (cond.user && cond.user.firstName && cond.user.firstName.$regex) {
          orConditions.push({ 'user.firstName': { $regex: cond.user.firstName.$regex, $options: 'i' } });
        }
        if (cond.user && cond.user.lastName && cond.user.lastName.$regex) {
          orConditions.push({ 'user.lastName': { $regex: cond.user.lastName.$regex, $options: 'i' } });
        }
        if (cond.user && cond.user.email && cond.user.email.$regex) {
          orConditions.push({ 'user.email': { $regex: cond.user.email.$regex, $options: 'i' } });
        }
        if (cond.class && cond.class.name && cond.class.name.$regex) {
          orConditions.push({ 'class.name': { $regex: cond.class.name.$regex, $options: 'i' } });
        }
        if (cond.notes && cond.notes.$regex) {
          orConditions.push({ notes: { $regex: cond.notes.$regex, $options: 'i' } });
        }
      }
      if (orConditions.length > 0) pipeline.push({ $match: { $or: orConditions } });
    }

    const countPipeline = [...pipeline, { $count: 'total' }];
    const countResult = await databaseService.client.bookings.aggregate(countPipeline).toArray();
    const total = countResult[0] ? countResult[0].total : 0;

    const sort = {};
    if (sortBy) {
      sort[sortBy] = sortOrder === 'DESC' ? -1 : 1;
    } else {
      sort.createdAt = -1;
    }
    pipeline.push({ $sort: sort }, { $skip: offset }, { $limit: limit });
    const results = await databaseService.client.bookings.aggregate(pipeline).toArray();

    return { bookings: formatBookings(results), total };
  },

  async findClassById(id) {
    const doc = await databaseService.client.classes.findOne(
      { _id: new ObjectId(id) },
      { projection: { _id: 1, trainerId: 1, name: 1, capacity: 1, availableSeats: 1, status: 1 } }
    );
    if (!doc) return null;
    const result = { ...doc, id: doc._id.toString() };
    if (doc.trainerId) result.trainerId = doc.trainerId.toString();
    delete result._id;
    return result;
  },

  async findTrainerByUserId(userId) {
    const doc = await databaseService.client.trainers.findOne({ userId: new ObjectId(userId) });
    if (!doc) return null;
    return { ...doc, id: doc._id.toString(), userId: doc.userId.toString() };
  },

  async findClassIdsByTrainerId(trainerId) {
    const docs = await databaseService.client.classes
      .find({ trainerId: new ObjectId(trainerId) }, { projection: { _id: 1 } })
      .toArray();
    return docs.map((d) => d._id.toString());
  },
};

module.exports = BookingRepository;
