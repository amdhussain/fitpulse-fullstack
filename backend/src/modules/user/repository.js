const databaseService = require('../../services/databaseService');

const UserRepository = {
  async findById(id) {
    return databaseService.client.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        profileImage: true,
        phone: true,
        isVerified: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  },

  async findByIdWithPassword(id) {
    return databaseService.client.user.findUnique({
      where: { id },
    });
  },

  async findByEmail(email) {
    return databaseService.client.user.findUnique({
      where: { email: email.toLowerCase() },
    });
  },

  async findAll({ page, limit, offset, search, role, isActive, sortBy, sortOrder }) {
    const where = {};

    if (search) {
      where.OR = [
        { firstName: { contains: search } },
        { lastName: { contains: search } },
        { email: { contains: search } },
      ];
    }

    if (role) {
      where.role = role;
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    const allowedSortFields = ['createdAt', 'firstName', 'lastName', 'email', 'role'];
    const orderField = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const orderDirection = sortOrder === 'ASC' ? 'asc' : 'desc';

    const [users, total] = await Promise.all([
      databaseService.client.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          profileImage: true,
          phone: true,
          isVerified: true,
          isActive: true,
          lastLoginAt: true,
          createdAt: true,
          updatedAt: true,
        },
        skip: offset,
        take: limit,
        orderBy: { [orderField]: orderDirection },
      }),
      databaseService.client.user.count({ where }),
    ]);

    return { users, total };
  },

  async updateProfile(id, data) {
    return databaseService.client.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        profileImage: true,
        phone: true,
        isVerified: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  },

  async updatePassword(id, password) {
    return databaseService.client.user.update({
      where: { id },
      data: { password },
    });
  },

  async updateRole(id, role) {
    return databaseService.client.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        profileImage: true,
        phone: true,
        isVerified: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  },

  async setActive(id, isActive) {
    return databaseService.client.user.update({
      where: { id },
      data: { isActive },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        profileImage: true,
        phone: true,
        isVerified: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  },

  async delete(id) {
    return databaseService.client.user.delete({
      where: { id },
    });
  },
};

module.exports = UserRepository;
