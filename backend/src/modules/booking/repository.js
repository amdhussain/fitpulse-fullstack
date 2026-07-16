const databaseService = require('../../services/databaseService');

const BOOKING_SELECT = {
  id: true,
  userId: true,
  classId: true,
  serviceId: true,
  trainerId: true,
  bookingDate: true,
  bookingTime: true,
  status: true,
  attended: true,
  notes: true,
  cancelReason: true,
  createdAt: true,
  updatedAt: true,
};

const USER_SELECT = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  phone: true,
  profileImage: true,
};

const CLASS_SELECT = {
  id: true,
  name: true,
  category: true,
  difficulty: true,
  capacity: true,
  availableSeats: true,
  schedule: true,
  duration: true,
  price: true,
  image: true,
  status: true,
};

const TRAINER_SELECT = {
  id: true,
  userId: true,
  bio: true,
  specialization: true,
  designation: true,
  experience: true,
  rating: true,
  user: { select: USER_SELECT },
};

const BookingRepository = {
  async findById(id) {
    return databaseService.client.booking.findUnique({
      where: { id },
      select: {
        ...BOOKING_SELECT,
        user: { select: USER_SELECT },
        class: { select: CLASS_SELECT },
        trainer: { select: TRAINER_SELECT },
      },
    });
  },

  async findByIdBasic(id) {
    return databaseService.client.booking.findUnique({
      where: { id },
      select: BOOKING_SELECT,
    });
  },

  async create(data) {
    return databaseService.client.booking.create({
      data,
      select: {
        ...BOOKING_SELECT,
        user: { select: USER_SELECT },
        class: { select: CLASS_SELECT },
        trainer: { select: TRAINER_SELECT },
      },
    });
  },

  async update(id, data) {
    return databaseService.client.booking.update({
      where: { id },
      data,
      select: {
        ...BOOKING_SELECT,
        user: { select: USER_SELECT },
        class: { select: CLASS_SELECT },
        trainer: { select: TRAINER_SELECT },
      },
    });
  },

  async delete(id) {
    return databaseService.client.booking.delete({
      where: { id },
    });
  },

  async findDuplicate(userId, classId, status) {
    return databaseService.client.booking.findFirst({
      where: {
        userId,
        classId,
        status: { notIn: ['CANCELLED'] },
      },
    });
  },

  async findByUserId(userId, { where, page, limit, offset, sortBy, sortOrder }) {
    const combinedWhere = { ...where, userId };

    const allowedSortFields = ['createdAt', 'bookingDate', 'status'];
    const orderField = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const orderDirection = sortOrder === 'ASC' ? 'asc' : 'desc';

    const [bookings, total] = await Promise.all([
      databaseService.client.booking.findMany({
        where: combinedWhere,
        select: {
          ...BOOKING_SELECT,
          class: { select: CLASS_SELECT },
          trainer: { select: { id: true, userId: true, user: { select: USER_SELECT } } },
        },
        skip: offset,
        take: limit,
        orderBy: { [orderField]: orderDirection },
      }),
      databaseService.client.booking.count({ where: combinedWhere }),
    ]);

    return { bookings, total };
  },

  async findByClassIds(classIds, { where, page, limit, offset, sortBy, sortOrder }) {
    const combinedWhere = { ...where, classId: { in: classIds } };

    const allowedSortFields = ['createdAt', 'bookingDate', 'status'];
    const orderField = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const orderDirection = sortOrder === 'ASC' ? 'asc' : 'desc';

    const [bookings, total] = await Promise.all([
      databaseService.client.booking.findMany({
        where: combinedWhere,
        select: {
          ...BOOKING_SELECT,
          user: { select: USER_SELECT },
          class: { select: CLASS_SELECT },
        },
        skip: offset,
        take: limit,
        orderBy: { [orderField]: orderDirection },
      }),
      databaseService.client.booking.count({ where: combinedWhere }),
    ]);

    return { bookings, total };
  },

  async findMany({ where, page, limit, offset, sortBy, sortOrder }) {
    const allowedSortFields = ['createdAt', 'bookingDate', 'status', 'userId'];
    const orderField = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const orderDirection = sortOrder === 'ASC' ? 'asc' : 'desc';

    const [bookings, total] = await Promise.all([
      databaseService.client.booking.findMany({
        where,
        select: {
          ...BOOKING_SELECT,
          user: { select: USER_SELECT },
          class: { select: CLASS_SELECT },
          trainer: { select: TRAINER_SELECT },
        },
        skip: offset,
        take: limit,
        orderBy: { [orderField]: orderDirection },
      }),
      databaseService.client.booking.count({ where }),
    ]);

    return { bookings, total };
  },

  async findClassById(id) {
    return databaseService.client.class.findUnique({
      where: { id },
      select: {
        id: true,
        trainerId: true,
        name: true,
        capacity: true,
        availableSeats: true,
        status: true,
      },
    });
  },

  async findTrainerByUserId(userId) {
    return databaseService.client.trainer.findUnique({
      where: { userId },
      select: { id: true, userId: true },
    });
  },

  async findClassIdsByTrainerId(trainerId) {
    const classes = await databaseService.client.class.findMany({
      where: { trainerId },
      select: { id: true },
    });
    return classes.map((c) => c.id);
  },
};

module.exports = BookingRepository;
