const { ObjectId } = require('mongodb');
const databaseService = require('../../services/databaseService');

const USER_FIELDS = {
  _id: 1, email: 1, firstName: 1, lastName: 1, role: 1, profileImage: 1, phone: 1, isVerified: 1, isActive: 1, createdAt: 1,
};

function trainerLookupPipeline() {
  return [
    { $lookup: { from: 'users', localField: 'userId', foreignField: '_id', as: 'userArr', pipeline: [{ $project: USER_FIELDS }] } },
    { $addFields: { user: { $arrayElemAt: ['$userArr', 0] }, userId: { $toString: '$userId' } } },
    { $project: { userArr: 0 } },
  ];
}

function formatTrainer(doc) {
  if (!doc) return null;
  const { _id, user, ...rest } = doc;
  const formatted = { ...rest, id: _id.toString() };
  if (user) {
    formatted.user = { ...user, id: user._id.toString() };
    delete formatted.user._id;
  }
  return formatted;
}

function formatTrainers(docs) {
  if (!Array.isArray(docs)) return [];
  return docs.map(formatTrainer);
}

const TrainerRepository = {
  async findById(id) {
    const pipeline = [
      { $match: { _id: new ObjectId(id) } },
      ...trainerLookupPipeline(),
    ];
    const results = await databaseService.client.trainers.aggregate(pipeline).toArray();
    return formatTrainer(results[0] || null);
  },

  async findByUserId(userId) {
    const pipeline = [
      { $match: { userId: new ObjectId(userId) } },
      ...trainerLookupPipeline(),
    ];
    const results = await databaseService.client.trainers.aggregate(pipeline).toArray();
    return formatTrainer(results[0] || null);
  },

  async create({ userId, bio, specialization, designation, experience, hourlyRate, skills, programs, certificates, achievements, availableDays, socialLinks, profileImage }, session) {
    const now = new Date();
    const insertData = {
      userId: new ObjectId(userId),
      bio: bio || null,
      specialization: specialization || null,
      designation: designation || null,
      experience: experience || 0,
      hourlyRate: hourlyRate || 0,
      rating: 0,
      reviewsCount: 0,
      skills: skills || null,
      programs: programs || null,
      certificates: certificates || null,
      achievements: achievements || null,
      availableDays: availableDays || null,
      socialLinks: socialLinks || null,
      profileImage: profileImage || null,
      status: 'ACTIVE',
      createdAt: now,
      updatedAt: now,
    };
    const options = session ? { session } : {};
    const result = await databaseService.client.trainers.insertOne(insertData, options);
    return this.findById(result.insertedId.toString());
  },

  async update(id, data, session) {
    const updateFields = {};
    for (const [key, value] of Object.entries(data)) {
      if (key === 'userId' && typeof value === 'string') {
        updateFields[key] = new ObjectId(value);
      } else {
        updateFields[key] = value;
      }
    }
    updateFields.updatedAt = new Date();
    const options = session ? { session } : {};

    await databaseService.client.trainers.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateFields },
      options
    );
    return this.findById(id);
  },

  async delete(id, session) {
    const options = session ? { session } : {};
    await databaseService.client.trainers.deleteOne({ _id: new ObjectId(id) }, options);
  },

  async findAll({ page, limit, offset, search, status, sortBy, sortOrder }) {
    const match = {};
    if (status) match.status = status;

    const pipeline = [
      { $match: match },
      ...trainerLookupPipeline(),
    ];

    if (search) {
      pipeline.push({
        $match: {
          $or: [
            { 'user.firstName': { $regex: search, $options: 'i' } },
            { 'user.lastName': { $regex: search, $options: 'i' } },
            { 'user.email': { $regex: search, $options: 'i' } },
            { specialization: { $regex: search, $options: 'i' } },
            { designation: { $regex: search, $options: 'i' } },
          ],
        },
      });
    }

    const countPipeline = [...pipeline, { $count: 'total' }];
    const countResult = await databaseService.client.trainers.aggregate(countPipeline).toArray();
    const total = countResult[0] ? countResult[0].total : 0;

    const sort = {};
    if (sortBy) {
      sort[sortBy] = sortOrder === 'DESC' ? -1 : 1;
    } else {
      sort.createdAt = -1;
    }

    pipeline.push({ $sort: sort }, { $skip: offset }, { $limit: limit });
    const results = await databaseService.client.trainers.aggregate(pipeline).toArray();

    return { trainers: formatTrainers(results), total };
  },

  async findPublic({ page, limit, offset, search, specialization, minExperience, availableDay, sortBy, sortOrder }) {
    const match = { status: 'ACTIVE' };

    const pipeline = [
      { $match: match },
      ...trainerLookupPipeline(),
    ];

    if (search) {
      pipeline.push({
        $match: {
          $or: [
            { 'user.firstName': { $regex: search, $options: 'i' } },
            { 'user.lastName': { $regex: search, $options: 'i' } },
            { specialization: { $regex: search, $options: 'i' } },
            { designation: { $regex: search, $options: 'i' } },
          ],
        },
      });
    }

    if (specialization) {
      pipeline.push({ $match: { specialization: { $regex: specialization, $options: 'i' } } });
    }

    if (minExperience) {
      pipeline.push({ $match: { experience: { $gte: Number(minExperience) } } });
    }

    if (availableDay) {
      pipeline.push({ $match: { availableDays: { $regex: availableDay, $options: 'i' } } });
    }

    const countPipeline = [...pipeline, { $count: 'total' }];
    const countResult = await databaseService.client.trainers.aggregate(countPipeline).toArray();
    const total = countResult[0] ? countResult[0].total : 0;

    const sort = {};
    if (sortBy) {
      sort[sortBy] = sortOrder === 'DESC' ? -1 : 1;
    } else {
      sort.createdAt = -1;
    }

    pipeline.push({ $sort: sort }, { $skip: offset }, { $limit: limit });
    const results = await databaseService.client.trainers.aggregate(pipeline).toArray();

    return { trainers: formatTrainers(results), total };
  },
};

module.exports = TrainerRepository;
