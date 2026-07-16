const databaseService = require('../../services/databaseService');
const BookingRepository = require('./repository');
const { NotFoundError, BadRequestError, ForbiddenError, ConflictError } = require('../../errors');
const logger = require('../../utils/logger');

// ─── Member APIs ──────────────────────────────────────────

async function bookClass(userId, { classId, bookingDate, bookingTime, notes }) {
  const cls = await BookingRepository.findClassById(classId);

  if (!cls) {
    throw new NotFoundError('Class not found');
  }

  if (cls.status !== 'ACTIVE') {
    throw new BadRequestError('Class is not available for booking');
  }

  if (cls.availableSeats <= 0) {
    throw new ConflictError('Class is fully booked. No seats available.');
  }

  const existingBooking = await BookingRepository.findDuplicate(userId, classId);

  if (existingBooking) {
    throw new ConflictError('You have already booked this class');
  }

  const booking = await databaseService.transaction(async (tx) => {
    const newBooking = await tx.booking.create({
      data: {
        userId,
        classId,
        trainerId: cls.trainerId,
        bookingDate: new Date(bookingDate),
        bookingTime,
        notes: notes || null,
        status: 'PENDING',
      },
      select: {
        id: true,
        userId: true,
        classId: true,
        trainerId: true,
        bookingDate: true,
        bookingTime: true,
        status: true,
        attended: true,
        notes: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    await tx.class.update({
      where: { id: classId },
      data: { availableSeats: { decrement: 1 } },
    });

    return newBooking;
  });

  logger.info('Class booked', { userId, classId, bookingId: booking.id });

  return booking;
}

async function cancelBooking(userId, bookingId, cancelReason) {
  const booking = await BookingRepository.findByIdBasic(bookingId);

  if (!booking) {
    throw new NotFoundError('Booking not found');
  }

  if (booking.userId !== userId) {
    throw new ForbiddenError('You can only cancel your own bookings');
  }

  if (booking.status === 'CANCELLED') {
    throw new ConflictError('Booking is already cancelled');
  }

  if (booking.status === 'COMPLETED') {
    throw new BadRequestError('Cannot cancel a completed booking');
  }

  const updated = await databaseService.transaction(async (tx) => {
    const cancelled = await tx.booking.update({
      where: { id: bookingId },
      data: {
        status: 'CANCELLED',
        cancelReason: cancelReason || null,
      },
      select: {
        id: true,
        userId: true,
        classId: true,
        trainerId: true,
        bookingDate: true,
        bookingTime: true,
        status: true,
        attended: true,
        notes: true,
        cancelReason: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (booking.classId) {
      await tx.class.update({
        where: { id: booking.classId },
        data: { availableSeats: { increment: 1 } },
      });
    }

    return cancelled;
  });

  logger.info('Booking cancelled', { userId, bookingId });

  return updated;
}

async function getMyBookings(userId, { page, limit, search, status, sortBy, sortOrder }) {
  const offset = (page - 1) * limit;

  const where = {};

  if (status) {
    where.status = status;
  }

  if (search) {
    where.OR = [
      { class: { name: { contains: search } } },
      { notes: { contains: search } },
    ];
  }

  const { bookings, total } = await BookingRepository.findByUserId(userId, {
    where,
    page,
    limit,
    offset,
    sortBy,
    sortOrder,
  });

  return {
    data: bookings,
    total,
    page,
    limit,
  };
}

async function getBookingDetails(userId, bookingId) {
  const booking = await BookingRepository.findById(bookingId);

  if (!booking) {
    throw new NotFoundError('Booking not found');
  }

  if (booking.userId !== userId) {
    throw new ForbiddenError('You can only view your own bookings');
  }

  return booking;
}

// ─── Trainer APIs ─────────────────────────────────────────

async function getBookingsForMyClasses(trainerUserId, { page, limit, search, status, classId, sortBy, sortOrder }) {
  const trainer = await BookingRepository.findTrainerByUserId(trainerUserId);

  if (!trainer) {
    throw new NotFoundError('Trainer profile not found');
  }

  const classIds = await BookingRepository.findClassIdsByTrainerId(trainer.id);

  if (classIds.length === 0) {
    return { data: [], total: 0, page, limit };
  }

  const offset = (page - 1) * limit;

  const where = {};

  if (status) {
    where.status = status;
  }

  if (classId) {
    if (!classIds.includes(classId)) {
      throw new ForbiddenError('Class does not belong to you');
    }
    where.classId = classId;
  } else {
    where.classId = { in: classIds };
  }

  if (search) {
    where.OR = [
      { user: { firstName: { contains: search } } },
      { user: { lastName: { contains: search } } },
      { user: { email: { contains: search } } },
      { notes: { contains: search } },
    ];
  }

  const { bookings, total } = await BookingRepository.findByClassIds(classIds, {
    where,
    page,
    limit,
    offset,
    sortBy,
    sortOrder,
  });

  return {
    data: bookings,
    total,
    page,
    limit,
  };
}

async function approveBooking(trainerUserId, bookingId) {
  const trainer = await BookingRepository.findTrainerByUserId(trainerUserId);

  if (!trainer) {
    throw new NotFoundError('Trainer profile not found');
  }

  const booking = await BookingRepository.findByIdBasic(bookingId);

  if (!booking) {
    throw new NotFoundError('Booking not found');
  }

  if (!booking.classId) {
    throw new BadRequestError('Booking is not for a class');
  }

  const cls = await BookingRepository.findClassById(booking.classId);

  if (!cls || cls.trainerId !== trainer.id) {
    throw new ForbiddenError('You can only approve bookings for your own classes');
  }

  if (booking.status !== 'PENDING') {
    throw new ConflictError(`Booking cannot be approved. Current status: ${booking.status}`);
  }

  const updated = await BookingRepository.update(bookingId, { status: 'CONFIRMED' });

  logger.info('Booking approved', { trainerId: trainer.id, bookingId });

  return updated;
}

async function rejectBooking(trainerUserId, bookingId) {
  const trainer = await BookingRepository.findTrainerByUserId(trainerUserId);

  if (!trainer) {
    throw new NotFoundError('Trainer profile not found');
  }

  const booking = await BookingRepository.findByIdBasic(bookingId);

  if (!booking) {
    throw new NotFoundError('Booking not found');
  }

  if (!booking.classId) {
    throw new BadRequestError('Booking is not for a class');
  }

  const cls = await BookingRepository.findClassById(booking.classId);

  if (!cls || cls.trainerId !== trainer.id) {
    throw new ForbiddenError('You can only reject bookings for your own classes');
  }

  if (booking.status !== 'PENDING') {
    throw new ConflictError(`Booking cannot be rejected. Current status: ${booking.status}`);
  }

  const updated = await databaseService.transaction(async (tx) => {
    const rejected = await tx.booking.update({
      where: { id: bookingId },
      data: { status: 'CANCELLED' },
      select: {
        id: true,
        userId: true,
        classId: true,
        trainerId: true,
        bookingDate: true,
        bookingTime: true,
        status: true,
        attended: true,
        notes: true,
        cancelReason: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    await tx.class.update({
      where: { id: booking.classId },
      data: { availableSeats: { increment: 1 } },
    });

    return rejected;
  });

  logger.info('Booking rejected', { trainerId: trainer.id, bookingId });

  return updated;
}

async function markAttendance(trainerUserId, bookingId, attended) {
  const trainer = await BookingRepository.findTrainerByUserId(trainerUserId);

  if (!trainer) {
    throw new NotFoundError('Trainer profile not found');
  }

  const booking = await BookingRepository.findByIdBasic(bookingId);

  if (!booking) {
    throw new NotFoundError('Booking not found');
  }

  if (!booking.classId) {
    throw new BadRequestError('Booking is not for a class');
  }

  const cls = await BookingRepository.findClassById(booking.classId);

  if (!cls || cls.trainerId !== trainer.id) {
    throw new ForbiddenError('You can only mark attendance for your own classes');
  }

  if (booking.status !== 'CONFIRMED') {
    throw new BadRequestError('Can only mark attendance for confirmed bookings');
  }

  const updated = await BookingRepository.update(bookingId, {
    attended,
    status: attended ? 'COMPLETED' : 'CONFIRMED',
  });

  logger.info('Attendance marked', { trainerId: trainer.id, bookingId, attended });

  return updated;
}

// ─── Admin APIs ───────────────────────────────────────────

async function getAllBookings({ page, limit, search, status, userId, classId, trainerId, sortBy, sortOrder }) {
  const offset = (page - 1) * limit;

  const where = {};

  if (status) {
    where.status = status;
  }

  if (userId) {
    where.userId = userId;
  }

  if (classId) {
    where.classId = classId;
  }

  if (trainerId) {
    where.trainerId = trainerId;
  }

  if (search) {
    where.OR = [
      { user: { firstName: { contains: search } } },
      { user: { lastName: { contains: search } } },
      { user: { email: { contains: search } } },
      { class: { name: { contains: search } } },
      { notes: { contains: search } },
    ];
  }

  const { bookings, total } = await BookingRepository.findMany({
    where,
    page,
    limit,
    offset,
    sortBy,
    sortOrder,
  });

  return {
    data: bookings,
    total,
    page,
    limit,
  };
}

async function updateBookingStatus(bookingId, status) {
  const booking = await BookingRepository.findByIdBasic(bookingId);

  if (!booking) {
    throw new NotFoundError('Booking not found');
  }

  if (booking.status === status) {
    throw new ConflictError(`Booking is already ${status}`);
  }

  const updated = await databaseService.transaction(async (tx) => {
    const result = await tx.booking.update({
      where: { id: bookingId },
      data: { status },
      select: {
        id: true,
        userId: true,
        classId: true,
        trainerId: true,
        bookingDate: true,
        bookingTime: true,
        status: true,
        attended: true,
        notes: true,
        cancelReason: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (status === 'CANCELLED' && booking.classId) {
      await tx.class.update({
        where: { id: booking.classId },
        data: { availableSeats: { increment: 1 } },
      });
    }

    return result;
  });

  logger.info('Booking status updated', { bookingId, newStatus: status });

  return updated;
}

async function deleteBooking(bookingId) {
  const booking = await BookingRepository.findByIdBasic(bookingId);

  if (!booking) {
    throw new NotFoundError('Booking not found');
  }

  await databaseService.transaction(async (tx) => {
    await tx.booking.delete({ where: { id: bookingId } });

    if (booking.classId && booking.status !== 'CANCELLED') {
      await tx.class.update({
        where: { id: booking.classId },
        data: { availableSeats: { increment: 1 } },
      });
    }
  });

  logger.info('Booking deleted', { bookingId });

  return { message: 'Booking deleted successfully' };
}

module.exports = {
  bookClass,
  cancelBooking,
  getMyBookings,
  getBookingDetails,
  getBookingsForMyClasses,
  approveBooking,
  rejectBooking,
  markAttendance,
  getAllBookings,
  updateBookingStatus,
  deleteBooking,
};
