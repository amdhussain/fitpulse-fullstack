const databaseService = require('./databaseService');
const { NotFoundError, ForbiddenError, BadRequestError } = require('../errors');
const { extractPagination } = require('../utils/pagination');
const logger = require('../utils/logger');

// ─── Booking Service ───────────────────────────────────────
// CRUD operations for bookings with role-based access:
//   - Admin:  full access to all bookings
//   - Member: manage own bookings only
//   - Trainer: view/update status of assigned bookings
//
// Status transitions:
//   PENDING  -> CONFIRMED | CANCELLED
//   CONFIRMED -> COMPLETED | CANCELLED
//   CANCELLED -> (terminal)
//   COMPLETED -> (terminal)
// ───────────────────────────────────────────────────────────

const VALID_STATUSES = ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'];

const STATUS_TRANSITIONS = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['COMPLETED', 'CANCELLED'],
  CANCELLED: [],
  COMPLETED: [],
};

// ─── Includes (shared across queries) ──────────────────────

const BOOKING_INCLUDES = {
  user: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      role: true,
    },
  },
  service: {
    select: {
      id: true,
      name: true,
      category: true,
      price: true,
      duration: true,
      image: true,
    },
  },
  trainer: {
    select: {
      id: true,
      userId: true,
      specialization: true,
      designation: true,
      user: {
        select: { id: true, firstName: true, lastName: true, email: true },
      },
    },
  },
};

// ─── Admin: List All Bookings ──────────────────────────────

async function adminGetAll(query = {}) {
  const { page, limit, offset } = extractPagination(query);
  const where = {};

  if (query.status) where.status = query.status;
  if (query.userId) where.userId = query.userId;
  if (query.serviceId) where.serviceId = query.serviceId;
  if (query.trainerId) where.trainerId = query.trainerId;

  if (query.dateFrom || query.dateTo) {
    where.bookingDate = {};
    if (query.dateFrom) where.bookingDate.gte = new Date(query.dateFrom);
    if (query.dateTo) where.bookingDate.lte = new Date(query.dateTo);
  }

  if (query.search) {
    where.OR = [
      { user: { firstName: { contains: query.search } } },
      { user: { lastName: { contains: query.search } } },
      { user: { email: { contains: query.search } } },
      { notes: { contains: query.search } },
    ];
  }

  const [bookings, total] = await Promise.all([
    databaseService.client.booking.findMany({
      where,
      include: BOOKING_INCLUDES,
      skip: offset,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    databaseService.client.booking.count({ where }),
  ]);

  return {
    data: bookings,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
}

// ─── Admin: Get Booking By ID ──────────────────────────────

async function adminGetById(id) {
  const booking = await databaseService.client.booking.findUnique({
    where: { id },
    include: BOOKING_INCLUDES,
  });

  if (!booking) {
    throw new NotFoundError('Booking not found');
  }

  return booking;
}

// ─── Admin: Create Booking ─────────────────────────────────

async function adminCreate(data) {
  if (data.serviceId) {
    const service = await databaseService.client.service.findUnique({ where: { id: data.serviceId } });
    if (!service) throw new NotFoundError('Service not found');
  }

  if (data.trainerId) {
    const trainer = await databaseService.client.trainer.findUnique({ where: { id: data.trainerId } });
    if (!trainer) throw new NotFoundError('Trainer not found');
  }

  const user = await databaseService.client.user.findUnique({ where: { id: data.userId } });
  if (!user) throw new NotFoundError('User not found');

  const booking = await databaseService.client.booking.create({
    data: {
      userId: data.userId,
      serviceId: data.serviceId || null,
      trainerId: data.trainerId || null,
      bookingDate: new Date(data.bookingDate),
      bookingTime: data.bookingTime,
      status: data.status || 'PENDING',
      notes: data.notes || null,
    },
    include: BOOKING_INCLUDES,
  });

  logger.info('Booking created (admin)', { bookingId: booking.id, userId: data.userId });
  return booking;
}

// ─── Admin: Update Booking ─────────────────────────────────

async function adminUpdate(id, data) {
  await adminGetById(id);

  const updateData = {};
  const fields = ['userId', 'serviceId', 'trainerId', 'bookingDate', 'bookingTime', 'notes'];

  for (const field of fields) {
    if (data[field] !== undefined) {
      updateData[field] = field === 'bookingDate' ? new Date(data[field]) : data[field];
    }
  }

  if (data.status !== undefined) {
    updateData.status = data.status;
  }

  const booking = await databaseService.client.booking.update({
    where: { id },
    data: updateData,
    include: BOOKING_INCLUDES,
  });

  logger.info('Booking updated (admin)', { bookingId: id });
  return booking;
}

// ─── Admin: Delete Booking ─────────────────────────────────

async function adminRemove(id) {
  await adminGetById(id);
  await databaseService.client.booking.delete({ where: { id } });
  logger.info('Booking deleted (admin)', { bookingId: id });
}

// ─── Member: Get Own Bookings ──────────────────────────────

async function memberGetAll(userId, query = {}) {
  const { page, limit, offset } = extractPagination(query);
  const where = { userId };

  if (query.status) where.status = query.status;

  if (query.dateFrom || query.dateTo) {
    where.bookingDate = {};
    if (query.dateFrom) where.bookingDate.gte = new Date(query.dateFrom);
    if (query.dateTo) where.bookingDate.lte = new Date(query.dateTo);
  }

  const [bookings, total] = await Promise.all([
    databaseService.client.booking.findMany({
      where,
      include: BOOKING_INCLUDES,
      skip: offset,
      take: limit,
      orderBy: { bookingDate: 'desc' },
    }),
    databaseService.client.booking.count({ where }),
  ]);

  return {
    data: bookings,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
}

// ─── Member: Get Own Booking By ID ─────────────────────────

async function memberGetById(userId, bookingId) {
  const booking = await databaseService.client.booking.findFirst({
    where: { id: bookingId, userId },
    include: BOOKING_INCLUDES,
  });

  if (!booking) {
    throw new NotFoundError('Booking not found');
  }

  return booking;
}

// ─── Member: Create Booking ────────────────────────────────

async function memberCreate(userId, data) {
  if (data.serviceId) {
    const service = await databaseService.client.service.findUnique({ where: { id: data.serviceId } });
    if (!service) throw new NotFoundError('Service not found');
  }

  if (data.trainerId) {
    const trainer = await databaseService.client.trainer.findUnique({ where: { id: data.trainerId } });
    if (!trainer) throw new NotFoundError('Trainer not found');
  }

  const booking = await databaseService.client.booking.create({
    data: {
      userId,
      serviceId: data.serviceId || null,
      trainerId: data.trainerId || null,
      bookingDate: new Date(data.bookingDate),
      bookingTime: data.bookingTime,
      notes: data.notes || null,
    },
    include: BOOKING_INCLUDES,
  });

  logger.info('Booking created (member)', { bookingId: booking.id, userId });
  return booking;
}

// ─── Member: Update Own Booking ────────────────────────────

async function memberUpdate(userId, bookingId, data) {
  const booking = await memberGetById(userId, bookingId);

  if (booking.status === 'CANCELLED' || booking.status === 'COMPLETED') {
    throw new BadRequestError(`Cannot update a ${booking.status.toLowerCase()} booking`);
  }

  const updateData = {};
  if (data.bookingDate !== undefined) updateData.bookingDate = new Date(data.bookingDate);
  if (data.bookingTime !== undefined) updateData.bookingTime = data.bookingTime;
  if (data.notes !== undefined) updateData.notes = data.notes;
  if (data.serviceId !== undefined) updateData.serviceId = data.serviceId;
  if (data.trainerId !== undefined) updateData.trainerId = data.trainerId;

  const updated = await databaseService.client.booking.update({
    where: { id: bookingId },
    data: updateData,
    include: BOOKING_INCLUDES,
  });

  logger.info('Booking updated (member)', { bookingId, userId });
  return updated;
}

// ─── Member: Cancel Own Booking ────────────────────────────

async function memberCancel(userId, bookingId, cancelReason) {
  const booking = await memberGetById(userId, bookingId);

  if (booking.status === 'CANCELLED') {
    throw new BadRequestError('Booking is already cancelled');
  }

  if (booking.status === 'COMPLETED') {
    throw new BadRequestError('Cannot cancel a completed booking');
  }

  const updated = await databaseService.client.booking.update({
    where: { id: bookingId },
    data: {
      status: 'CANCELLED',
      cancelReason: cancelReason || null,
    },
    include: BOOKING_INCLUDES,
  });

  logger.info('Booking cancelled (member)', { bookingId, userId, reason: cancelReason });
  return updated;
}

// ─── Trainer: Get Assigned Bookings ────────────────────────

async function trainerGetAll(trainerId, query = {}) {
  const { page, limit, offset } = extractPagination(query);
  const where = { trainerId };

  if (query.status) where.status = query.status;

  if (query.dateFrom || query.dateTo) {
    where.bookingDate = {};
    if (query.dateFrom) where.bookingDate.gte = new Date(query.dateFrom);
    if (query.dateTo) where.bookingDate.lte = new Date(query.dateTo);
  }

  const [bookings, total] = await Promise.all([
    databaseService.client.booking.findMany({
      where,
      include: BOOKING_INCLUDES,
      skip: offset,
      take: limit,
      orderBy: { bookingDate: 'desc' },
    }),
    databaseService.client.booking.count({ where }),
  ]);

  return {
    data: bookings,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
}

// ─── Trainer: Update Status of Assigned Booking ────────────

async function trainerUpdateStatus(trainerId, bookingId, status) {
  const booking = await databaseService.client.booking.findFirst({
    where: { id: bookingId, trainerId },
  });

  if (!booking) {
    throw new NotFoundError('Booking not found or not assigned to you');
  }

  const allowed = STATUS_TRANSITIONS[booking.status];
  if (!allowed.includes(status)) {
    throw new BadRequestError(
      `Cannot change status from '${booking.status}' to '${status}'`
    );
  }

  const updated = await databaseService.client.booking.update({
    where: { id: bookingId },
    data: { status },
    include: BOOKING_INCLUDES,
  });

  logger.info('Booking status updated (trainer)', { bookingId, trainerId, status });
  return updated;
}

// ─── Admin: Update Status ──────────────────────────────────

async function adminUpdateStatus(id, status) {
  const booking = await adminGetById(id);

  const updated = await databaseService.client.booking.update({
    where: { id },
    data: { status },
    include: BOOKING_INCLUDES,
  });

  logger.info('Booking status updated (admin)', { bookingId: id, status });
  return updated;
}

// ─── Helpers ───────────────────────────────────────────────

async function getTrainerIdForUser(userId) {
  const trainer = await databaseService.client.trainer.findUnique({
    where: { userId },
  });
  return trainer ? trainer.id : null;
}

module.exports = {
  VALID_STATUSES,
  STATUS_TRANSITIONS,
  adminGetAll,
  adminGetById,
  adminCreate,
  adminUpdate,
  adminRemove,
  adminUpdateStatus,
  memberGetAll,
  memberGetById,
  memberCreate,
  memberUpdate,
  memberCancel,
  trainerGetAll,
  trainerUpdateStatus,
  getTrainerIdForUser,
};
