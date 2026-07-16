const databaseService = require('../../services/databaseService');

const SELECT_FIELDS = {
  id: true,
  userId: true,
  bio: true,
  specialization: true,
  designation: true,
  experience: true,
  hourlyRate: true,
  rating: true,
  reviewsCount: true,
  skills: true,
  programs: true,
  certificates: true,
  achievements: true,
  availableDays: true,
  socialLinks: true,
  status: true,
  createdAt: true,
  updatedAt: true,
};

const USER_SELECT = {
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  role: true,
  profileImage: true,
  phone: true,
  isVerified: true,
  isActive: true,
  createdAt: true,
};

const TrainerRepository = {
  async findById(id) {
    return databaseService.client.trainer.findUnique({
      where: { id },
      select: { ...SELECT_FIELDS, user: { select: USER_SELECT } },
    });
  },

  async findByUserId(userId) {
    return databaseService.client.trainer.findUnique({
      where: { userId },
      select: { ...SELECT_FIELDS, user: { select: USER_SELECT } },
    });
  },

  async create({ userId, bio, specialization, designation, experience, hourlyRate, skills, programs, certificates, achievements, availableDays, socialLinks }) {
    return databaseService.client.trainer.create({
      data: {
        userId,
        bio: bio || null,
        specialization: specialization || null,
        designation: designation || null,
        experience: experience || 0,
        hourlyRate: hourlyRate || null,
        skills: skills || null,
        programs: programs || null,
        certificates: certificates || null,
        achievements: achievements || null,
        availableDays: availableDays || null,
        socialLinks: socialLinks || null,
      },
      select: { ...SELECT_FIELDS, user: { select: USER_SELECT } },
    });
  },

  async update(id, data) {
    return databaseService.client.trainer.update({
      where: { id },
      data,
      select: { ...SELECT_FIELDS, user: { select: USER_SELECT } },
    });
  },

  async delete(id) {
    return databaseService.client.trainer.delete({
      where: { id },
    });
  },

  async findAll({ page, limit, offset, search, status, sortBy, sortOrder }) {
    const where = {};

    if (search) {
      where.OR = [
        { specialization: { contains: search } },
        { designation: { contains: search } },
        { user: { firstName: { contains: search } } },
        { user: { lastName: { contains: search } } },
      ];
    }

    if (status) {
      where.status = status;
    }

    const allowedSortFields = ['createdAt', 'experience', 'hourlyRate', 'rating'];
    const orderField = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const orderDirection = sortOrder === 'ASC' ? 'asc' : 'desc';

    const [trainers, total] = await Promise.all([
      databaseService.client.trainer.findMany({
        where,
        select: { ...SELECT_FIELDS, user: { select: USER_SELECT } },
        skip: offset,
        take: limit,
        orderBy: { [orderField]: orderDirection },
      }),
      databaseService.client.trainer.count({ where }),
    ]);

    return { trainers, total };
  },

  async findPublic({ page, limit, offset, search, specialization, minExperience, availableDay, sortBy, sortOrder }) {
    const where = { status: 'ACTIVE' };

    if (search) {
      where.OR = [
        { specialization: { contains: search } },
        { designation: { contains: search } },
        { bio: { contains: search } },
        { user: { firstName: { contains: search } } },
        { user: { lastName: { contains: search } } },
      ];
    }

    if (specialization) {
      where.specialization = { contains: specialization };
    }

    if (minExperience !== undefined) {
      where.experience = { gte: minExperience };
    }

    if (availableDay) {
      where.availableDays = { contains: availableDay };
    }

    const allowedSortFields = ['createdAt', 'experience', 'hourlyRate', 'rating'];
    const orderField = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const orderDirection = sortOrder === 'ASC' ? 'asc' : 'desc';

    const [trainers, total] = await Promise.all([
      databaseService.client.trainer.findMany({
        where,
        select: {
          id: true,
          bio: true,
          specialization: true,
          designation: true,
          experience: true,
          hourlyRate: true,
          rating: true,
          reviewsCount: true,
          skills: true,
          programs: true,
          availableDays: true,
          status: true,
          createdAt: true,
          user: { select: USER_SELECT },
        },
        skip: offset,
        take: limit,
        orderBy: { [orderField]: orderDirection },
      }),
      databaseService.client.trainer.count({ where }),
    ]);

    return { trainers, total };
  },
};

module.exports = TrainerRepository;
