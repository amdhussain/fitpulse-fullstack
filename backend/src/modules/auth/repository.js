const databaseService = require('../../services/databaseService');

const UserRepository = {
  async findByEmail(email) {
    return databaseService.client.user.findUnique({
      where: { email: email.toLowerCase() },
    });
  },

  async findById(id) {
    return databaseService.client.user.findUnique({
      where: { id },
    });
  },

  async create({ firstName, lastName, email, password, role }) {
    return databaseService.client.user.create({
      data: {
        firstName,
        lastName,
        email: email.toLowerCase(),
        password,
        role,
      },
    });
  },

  async updateLastLogin(id) {
    return databaseService.client.user.update({
      where: { id },
      data: { lastLoginAt: new Date() },
    });
  },
};

module.exports = UserRepository;
