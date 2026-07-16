const databaseService = require('../../services/databaseService');

const SELECT_FIELDS = {
  id: true,
  trainerId: true,
  name: true,
  description: true,
  category: true,
  difficulty: true,
  capacity: true,
  availableSeats: true,
  schedule: true,
  duration: true,
  price: true,
  image: true,
  status: true,
  createdAt: true,
  updatedAt: true,
};

const TRAINER_USER_SELECT = {
  id: true,
  firstName: true,
  lastName: true,
  profileImage: true,
  email: true,
};

const ClassRepository = {
  async findById(id) {
    return databaseService.client.class.findUnique({
      where: { id },
      select: {
        ...SELECT_FIELDS,
        trainer: {
          select: {
            id: true,
            userId: true,
            bio: true,
            specialization: true,
            designation: true,
            experience: true,
            rating: true,
            user: { select: TRAINER_USER_SELECT },
          },
        },
      },
    });
  },

  async findByIdBasic(id) {
    return databaseService.client.class.findUnique({
      where: { id },
      select: SELECT_FIELDS,
    });
  },

  async create(data) {
    return databaseService.client.class.create({
      data,
      select: {
        ...SELECT_FIELDS,
        trainer: {
          select: {
            id: true,
            userId: true,
            user: { select: TRAINER_USER_SELECT },
          },
        },
      },
    });
  },

  async update(id, data) {
    return databaseService.client.class.update({
      where: { id },
      data,
      select: {
        ...SELECT_FIELDS,
        trainer: {
          select: {
            id: true,
            userId: true,
            user: { select: TRAINER_USER_SELECT },
          },
        },
      },
    });
  },

  async delete(id) {
    return databaseService.client.class.delete({
      where: { id },
    });
  },

  async findMany({ where, page, limit, offset, sortBy, sortOrder }) {
    const allowedSortFields = ['createdAt', 'name', 'price', 'duration', 'difficulty', 'capacity'];
    const orderField = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const orderDirection = sortOrder === 'ASC' ? 'asc' : 'desc';

    const [classes, total] = await Promise.all([
      databaseService.client.class.findMany({
        where,
        select: {
          ...SELECT_FIELDS,
          trainer: {
            select: {
              id: true,
              userId: true,
              user: { select: TRAINER_USER_SELECT },
            },
          },
        },
        skip: offset,
        take: limit,
        orderBy: { [orderField]: orderDirection },
      }),
      databaseService.client.class.count({ where }),
    ]);

    return { classes, total };
  },

  async decrementAvailableSeats(id) {
    return databaseService.client.class.update({
      where: { id },
      data: {
        availableSeats: { decrement: 1 },
      },
      select: SELECT_FIELDS,
    });
  },

  async incrementAvailableSeats(id) {
    return databaseService.client.class.update({
      where: { id },
      data: {
        availableSeats: { increment: 1 },
      },
      select: SELECT_FIELDS,
    });
  },

  async findByTrainerId(trainerId, { where, page, limit, offset, sortBy, sortOrder }) {
    const combinedWhere = { ...where, trainerId };

    const allowedSortFields = ['createdAt', 'name', 'difficulty', 'capacity'];
    const orderField = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const orderDirection = sortOrder === 'ASC' ? 'asc' : 'desc';

    const [classes, total] = await Promise.all([
      databaseService.client.class.findMany({
        where: combinedWhere,
        select: SELECT_FIELDS,
        skip: offset,
        take: limit,
        orderBy: { [orderField]: orderDirection },
      }),
      databaseService.client.class.count({ where: combinedWhere }),
    ]);

    return { classes, total };
  },
};

module.exports = ClassRepository;
