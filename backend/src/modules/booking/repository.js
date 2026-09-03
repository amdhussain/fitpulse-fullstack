const { ObjectId } = require('mongodb');
const databaseService = require('../../services/databaseService');
const logger = require('../../utils/logger');

const USER_FIELDS = { _id: 1, firstName: 1, lastName: 1, email: 1, phone: 1, profileImage: 1 };

function toSafeObjectId(id) {
  if (!id) return null;
  if (id instanceof ObjectId) return id;
  if (typeof id === 'string') {
    const trimmed = id.trim();
    if (/^[0-9a-fA-F]{24}$/.test(trimmed)) {
      return new ObjectId(trimmed);
    }
  }
  return null;
}

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
          { $unset: 'userArr' },
          { $project: { _id: 1, userId: { $toString: '$userId' }, bio: 1, specialization: 1, designation: 1, experience: 1, rating: 1, user: 1 } },
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
    { $unset: ['userArr', 'classArr', 'trainerArr'] },
  ];
}

function formatBooking(doc) {
  if (!doc) return null;
  const { _id, user, class: cls, trainer, ...rest } = doc;
  const formattedId = _id ? _id.toString() : null;
  const formatted = { ...rest, _id: formattedId, id: formattedId };
  if (user && user._id) {
    formatted.user = { ...user, id: user._id.toString() };
    delete formatted.user._id;
  } else if (user) {
    formatted.user = { ...user };
  }
  if (cls && cls._id) {
    formatted.class = { ...cls, id: cls._id.toString() };
    delete formatted.class._id;
  } else if (cls) {
    formatted.class = { ...cls };
  }
  if (trainer) {
    formatted.trainer = { ...trainer };
    if (trainer._id) {
      formatted.trainer.id = trainer._id.toString();
      delete formatted.trainer._id;
    }
    if (trainer.user && trainer.user._id) {
      formatted.trainer.user = { ...trainer.user, id: trainer.user._id.toString() };
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
    const safeId = toSafeObjectId(id);
    if (!safeId) {
      throw new Error('Invalid booking ID format');
    }
    const pipeline = [
      { $match: { _id: safeId } },
      ...bookingLookupPipeline(),
    ];
    const results = await databaseService.client.bookings.aggregate(pipeline).toArray();
    return formatBooking(results[0] || null);
  },

  async findByIdBasic(id) {
    const safeId = toSafeObjectId(id);
    if (!safeId) {
      throw new Error('Invalid booking ID format');
    }
    const doc = await databaseService.client.bookings.findOne({ _id: safeId });
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
      userId: toSafeObjectId(data.userId),
      classId: data.classId ? toSafeObjectId(data.classId) : null,
      serviceId: data.serviceId ? toSafeObjectId(data.serviceId) : null,
      trainerId: data.trainerId ? toSafeObjectId(data.trainerId) : null,
      bookingDate: data.bookingDate || null,
      bookingTime: data.bookingTime || null,
      sessionType: data.sessionType || null,
      status: data.status || 'PENDING',
      paymentStatus: data.paymentStatus || 'PENDING_PAYMENT',
      paymentOption: data.paymentOption || 'FULL',
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
    const safeId = toSafeObjectId(id);
    if (!safeId) {
      throw new Error('Invalid booking ID format');
    }
    const updateFields = { ...data, updatedAt: new Date() };
    if (data.userId) updateFields.userId = toSafeObjectId(data.userId);
    if (data.classId) updateFields.classId = toSafeObjectId(data.classId);
    if (data.trainerId) updateFields.trainerId = toSafeObjectId(data.trainerId);
    if (data.serviceId) updateFields.serviceId = toSafeObjectId(data.serviceId);
    const options = session ? { session } : {};
    await databaseService.client.bookings.updateOne(
      { _id: safeId },
      { $set: updateFields },
      options
    );
    return this.findById(id);
  },

  async delete(id, session) {
    const safeId = toSafeObjectId(id);
    if (!safeId) {
      throw new Error('Invalid booking ID format');
    }
    const options = session ? { session } : {};
    await databaseService.client.bookings.deleteOne({ _id: safeId }, options);
  },

  async findDuplicate(userId, classId) {
    const safeUserId = toSafeObjectId(userId);
    const safeClassId = toSafeObjectId(classId);
    if (!safeUserId || !safeClassId) {
      return null;
    }
    const doc = await databaseService.client.bookings.findOne({
      userId: safeUserId,
      classId: safeClassId,
      status: { $ne: 'CANCELLED' },
    });
    return databaseService.formatDoc(doc);
  },

  async findByUserId(userId, { where, page, limit, offset, sortBy, sortOrder }) {
    const safeUserId = toSafeObjectId(userId);
    if (!safeUserId) {
      logger.error('Invalid userId passed to findByUserId', { userId });
      throw new Error('Invalid user ID format');
    }

    const match = { userId: safeUserId };
    if (where.status) match.status = where.status;

    const pipeline = [{ $match: match }, ...bookingLookupPipeline()];

    if (where.$or) {
      const orConditions = [];
      for (const cond of where.$or) {
        if (cond.notes && cond.notes.$regex) {
          orConditions.push({ notes: { $regex: cond.notes.$regex, $options: 'i' } });
        }
        if (cond.class && cond.class.name && cond.class.name.$regex) {
          orConditions.push({ 'class.name': { $regex: cond.class.name.$regex, $options: 'i' } });
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
    const safeClassIds = classIds.map((id) => toSafeObjectId(id)).filter(Boolean);
    if (safeClassIds.length === 0) {
      return { bookings: [], total: 0 };
    }
    const match = { classId: { $in: safeClassIds } };
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
    if (where.userId) {
      const safeUserId = toSafeObjectId(where.userId);
      if (safeUserId) match.userId = safeUserId;
    }
    if (where.classId) {
      const safeClassId = toSafeObjectId(where.classId);
      if (safeClassId) match.classId = safeClassId;
    }
    if (where.trainerId) {
      const safeTrainerId = toSafeObjectId(where.trainerId);
      if (safeTrainerId) match.trainerId = safeTrainerId;
    }

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
    const safeId = toSafeObjectId(id);
    if (!safeId) return null;
    const doc = await databaseService.client.classes.findOne(
      { _id: safeId },
      { projection: { _id: 1, trainerId: 1, name: 1, capacity: 1, availableSeats: 1, status: 1 } }
    );
    if (!doc) return null;
    const result = { ...doc, id: doc._id.toString() };
    if (doc.trainerId) result.trainerId = doc.trainerId.toString();
    delete result._id;
    return result;
  },

  async findTrainerByUserId(userId) {
    const safeUserId = toSafeObjectId(userId);
    if (!safeUserId) return null;
    const doc = await databaseService.client.trainers.findOne({ userId: safeUserId });
    if (!doc) return null;
    return { ...doc, id: doc._id.toString(), userId: doc.userId.toString() };
  },

  async findTrainerById(trainerId) {
    const safeId = toSafeObjectId(trainerId);
    if (!safeId) return null;
    const pipeline = [
      { $match: { _id: safeId } },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'userArr',
          pipeline: [{ $project: { _id: 1, firstName: 1, lastName: 1, email: 1 } }],
        },
      },
      { $addFields: { user: { $arrayElemAt: ['$userArr', 0] } } },
      { $unset: 'userArr' },
    ];
    const results = await databaseService.client.trainers.aggregate(pipeline).toArray();
    const doc = results[0];
    if (!doc) return null;
    const result = { ...doc, id: doc._id.toString(), userId: doc.userId.toString() };
    if (result.user) {
      result.user = { ...result.user, id: result.user._id.toString() };
      delete result.user._id;
    }
    delete result._id;
    return result;
  },

  async findClassIdsByTrainerId(trainerId) {
    const safeId = toSafeObjectId(trainerId);
    if (!safeId) return [];
    const docs = await databaseService.client.classes
      .find({ trainerId: safeId }, { projection: { _id: 1 } })
      .toArray();
    return docs.map((d) => d._id.toString());
  },
};

module.exports = BookingRepository;
