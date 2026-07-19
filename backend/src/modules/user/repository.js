const databaseService = require('../../services/databaseService');

const UserRepository = {
  async findByEmail(email) {
    const doc = await databaseService.client.users.findOne({ email: email.toLowerCase() });
    return databaseService.formatDoc(doc);
  },

  async findById(id) {
    const doc = await databaseService.client.users.findOne(
      { _id: databaseService.toObjectId(id) },
      { projection: { password: 0 } }
    );
    return databaseService.formatDoc(doc);
  },

  async findByIdWithPassword(id) {
    const doc = await databaseService.client.users.findOne({ _id: databaseService.toObjectId(id) });
    return databaseService.formatDoc(doc);
  },

  async create({ firstName, lastName, email, password, role, phone, profileImage }, session) {
    const now = new Date();
    const insertData = {
      firstName,
      lastName,
      email: email.toLowerCase(),
      password,
      role: role || 'MEMBER',
      phone: phone || null,
      profileImage: profileImage || null,
      isActive: true,
      isVerified: false,
      lastLoginAt: null,
      createdAt: now,
      updatedAt: now,
    };
    const options = session ? { session } : {};
    const result = await databaseService.client.users.insertOne(insertData, options);
    const doc = await databaseService.client.users.findOne({ _id: result.insertedId });
    return databaseService.formatDoc(doc);
  },

  async updateLastLogin(id) {
    await databaseService.client.users.updateOne(
      { _id: databaseService.toObjectId(id) },
      { $set: { lastLoginAt: new Date(), updatedAt: new Date() } }
    );
  },

  async findAll({ page, limit, offset, search, role, isActive, sortBy, sortOrder }) {
    const where = {};

    if (search) {
      where.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    if (role) where.role = role;
    if (isActive !== undefined && isActive !== null && isActive !== '') {
      where.isActive = isActive === 'true' || isActive === true;
    }

    const sort = {};
    if (sortBy) {
      sort[sortBy] = sortOrder === 'DESC' ? -1 : 1;
    } else {
      sort.createdAt = -1;
    }

    const total = await databaseService.client.users.countDocuments(where);
    const docs = await databaseService.client.users
      .find(where, { projection: { password: 0 } })
      .sort(sort)
      .skip(offset)
      .limit(limit)
      .toArray();

    return { users: databaseService.formatDocs(docs), total };
  },

  async updateProfile(id, data) {
    const doc = await databaseService.client.users.findOneAndUpdate(
      { _id: databaseService.toObjectId(id) },
      { $set: { ...data, updatedAt: new Date() } },
      { returnDocument: 'after', projection: { password: 0 } }
    );
    return databaseService.formatDoc(doc);
  },

  async updatePassword(id, password) {
    await databaseService.client.users.updateOne(
      { _id: databaseService.toObjectId(id) },
      { $set: { password, updatedAt: new Date() } }
    );
  },

  async updateRole(id, role) {
    const doc = await databaseService.client.users.findOneAndUpdate(
      { _id: databaseService.toObjectId(id) },
      { $set: { role, updatedAt: new Date() } },
      { returnDocument: 'after', projection: { password: 0 } }
    );
    return databaseService.formatDoc(doc);
  },

  async setActive(id, isActive) {
    const doc = await databaseService.client.users.findOneAndUpdate(
      { _id: databaseService.toObjectId(id) },
      { $set: { isActive, updatedAt: new Date() } },
      { returnDocument: 'after', projection: { password: 0 } }
    );
    return databaseService.formatDoc(doc);
  },

  async delete(id, session) {
    const options = session ? { session } : {};
    await databaseService.client.users.deleteOne({ _id: databaseService.toObjectId(id) }, options);
  },
};

module.exports = UserRepository;
