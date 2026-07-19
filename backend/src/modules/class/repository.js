const { ObjectId } = require('mongodb');
const databaseService = require('../../services/databaseService');

function classLookupPipeline() {
  return [
    {
      $lookup: {
        from: 'trainers',
        localField: 'trainerId',
        foreignField: '_id',
        as: 'trainerArr',
        pipeline: [
          {
            $lookup: {
              from: 'users',
              localField: 'userId',
              foreignField: '_id',
              as: 'userArr',
              pipeline: [{ $project: { _id: 1, firstName: 1, lastName: 1, profileImage: 1, email: 1 } }],
            },
          },
          { $addFields: { user: { $arrayElemAt: ['$userArr', 0] }, userId: { $toString: '$userId' } } },
          { $project: { userArr: 0, _id: 1, userId: 1, bio: 1, specialization: 1, designation: 1, experience: 1, hourlyRate: 1, rating: 1, reviewsCount: 1, skills: 1, programs: 1, certificates: 1, achievements: 1, availableDays: 1, socialLinks: 1, status: 1, createdAt: 1, updatedAt: 1 } },
        ],
      },
    },
    { $addFields: { trainer: { $arrayElemAt: ['$trainerArr', 0] }, trainerId: { $toString: '$trainerId' } } },
    { $project: { trainerArr: 0 } },
  ];
}

function formatClass(doc) {
  if (!doc) return null;
  const { _id, trainer, ...rest } = doc;
  const formatted = { ...rest, id: _id.toString() };
  if (trainer) {
    formatted.trainer = { ...trainer, id: trainer._id.toString() };
    if (formatted.trainer.user) {
      formatted.trainer.user = { ...formatted.trainer.user, id: formatted.trainer.user._id.toString() };
      delete formatted.trainer.user._id;
    }
  }
  return formatted;
}

function formatClasses(docs) {
  if (!Array.isArray(docs)) return [];
  return docs.map(formatClass);
}

const ClassRepository = {
  async findById(id) {
    const pipeline = [
      { $match: { _id: new ObjectId(id) } },
      ...classLookupPipeline(),
    ];
    const results = await databaseService.client.classes.aggregate(pipeline).toArray();
    return formatClass(results[0] || null);
  },

  async findByIdBasic(id) {
    const doc = await databaseService.client.classes.findOne({ _id: new ObjectId(id) });
    if (!doc) return null;
    return formatClass(doc);
  },

  async create(data, session) {
    const now = new Date();
    const insertData = {
      trainerId: new ObjectId(data.trainerId),
      name: data.name,
      description: data.description || null,
      category: data.category || null,
      difficulty: data.difficulty || 'BEGINNER',
      capacity: data.capacity || 0,
      availableSeats: data.availableSeats || 0,
      schedule: data.schedule || null,
      duration: data.duration || null,
      price: data.price || null,
      image: data.image || null,
      status: data.status || 'ACTIVE',
      createdAt: now,
      updatedAt: now,
    };
    const options = session ? { session } : {};
    const result = await databaseService.client.classes.insertOne(insertData, options);
    return this.findById(result.insertedId.toString());
  },

  async update(id, data, session) {
    const updateFields = { ...data, updatedAt: new Date() };
    if (data.trainerId) updateFields.trainerId = new ObjectId(data.trainerId);
    const options = session ? { session } : {};
    await databaseService.client.classes.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateFields },
      options
    );
    return this.findById(id);
  },

  async delete(id, session) {
    const options = session ? { session } : {};
    await databaseService.client.classes.deleteOne({ _id: new ObjectId(id) }, options);
  },

  async findMany({ where, page, limit, offset, sortBy, sortOrder }) {
    const match = {};
    if (where.status) match.status = where.status;
    if (where.trainerId) match.trainerId = new ObjectId(where.trainerId);
    if (where.category) match.category = where.category;
    if (where.difficulty) match.difficulty = where.difficulty;

    if (where.$or) {
      match.$or = where.$or.map((condition) => {
        const converted = {};
        for (const [key, val] of Object.entries(condition)) {
          if (val && val.$regex) {
            converted[key] = { $regex: val.$regex, $options: val.$options || 'i' };
          } else {
            converted[key] = val;
          }
        }
        return converted;
      });
    }

    if (where.price) {
      match.price = {};
      if (where.price.$gte !== undefined) match.price.$gte = where.price.$gte;
      if (where.price.$lte !== undefined) match.price.$lte = where.price.$lte;
    }

    if (where.createdAt) {
      match.createdAt = {};
      if (where.createdAt.$gte) match.createdAt.$gte = where.createdAt.$gte;
      if (where.createdAt.$lte) match.createdAt.$lte = where.createdAt.$lte;
    }

    const pipeline = [
      { $match: match },
      ...classLookupPipeline(),
    ];

    const countPipeline = [...pipeline, { $count: 'total' }];
    const countResult = await databaseService.client.classes.aggregate(countPipeline).toArray();
    const total = countResult[0] ? countResult[0].total : 0;

    const sort = {};
    if (sortBy) {
      sort[sortBy] = sortOrder === 'DESC' ? -1 : 1;
    } else {
      sort.createdAt = -1;
    }

    pipeline.push({ $sort: sort }, { $skip: offset }, { $limit: limit });
    const results = await databaseService.client.classes.aggregate(pipeline).toArray();

    return { classes: formatClasses(results), total };
  },

  async decrementAvailableSeats(id, amount, session) {
    const options = session ? { session } : {};
    const doc = await databaseService.client.classes.findOneAndUpdate(
      { _id: new ObjectId(id), availableSeats: { $gt: 0 } },
      { $inc: { availableSeats: -(amount || 1) }, $set: { updatedAt: new Date() } },
      { returnDocument: 'after', ...options }
    );
    return formatClass(doc);
  },

  async incrementAvailableSeats(id, amount, session) {
    const options = session ? { session } : {};
    const doc = await databaseService.client.classes.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $inc: { availableSeats: amount || 1 }, $set: { updatedAt: new Date() } },
      { returnDocument: 'after', ...options }
    );
    return formatClass(doc);
  },

  async findByTrainerId(trainerId, { where, page, limit, offset, sortBy, sortOrder }) {
    const result = await this.findMany({
      where: { ...where, trainerId },
      page, limit, offset, sortBy, sortOrder,
    });
    return { classes: result.classes, total: result.total };
  },
};

module.exports = ClassRepository;
