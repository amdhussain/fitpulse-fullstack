const databaseService = require('../../services/databaseService');

const UserRepository = {
  async findByEmail(email) {
    const doc = await databaseService.client.users.findOne({ email: email.toLowerCase() });
    return databaseService.formatDoc(doc);
  },

  async findById(id) {
    const doc = await databaseService.client.users.findOne({ _id: databaseService.toObjectId(id) });
    return databaseService.formatDoc(doc);
  },

  async create({ _id, firstName, lastName, email, password, role, phone, profileImage, isActive, isVerified, lastLoginAt, createdAt, updatedAt }, session) {
    const insertData = {
      firstName,
      lastName,
      email: email.toLowerCase(),
      role: role || 'MEMBER',
      phone: phone || null,
      profileImage: profileImage || null,
      isActive: isActive !== undefined ? isActive : true,
      isVerified: isVerified || false,
      lastLoginAt: lastLoginAt || null,
      createdAt: createdAt || new Date(),
      updatedAt: updatedAt || new Date(),
    };

    if (_id) {
      insertData._id = _id;
    }

    if (password) {
      insertData.password = password;
    }

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
};

module.exports = UserRepository;
