const BookingRepository = require('./repository');
const ClassRepository = require('../class/repository');
const databaseService = require('../../services/databaseService');
const notificationService = require('../../services/notificationService');
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

  const booking = await databaseService.transaction(async (session) => {
    const b = await BookingRepository.create(
      { userId, classId, trainerId: cls.trainerId, bookingDate, bookingTime, notes },
      session
    );
    await ClassRepository.decrementAvailableSeats(classId, 1, session);
    return b;
  });

  logger.info('Class booked', { userId, classId, bookingId: booking.id });

  const className = cls.name || 'a class';
  const dateTime = bookingDate && bookingTime ? `${bookingDate} at ${bookingTime}` : 'upcoming';
  notificationService.bookingCreated(booking.id, `User ${userId}`, className, dateTime).catch(() => {});

  return booking;
}

async function bookTrainer(userId, { trainerId, bookingDate, bookingTime, sessionType, notes }) {
  const trainer = await BookingRepository.findTrainerById(trainerId);
  if (!trainer) throw new NotFoundError('Trainer not found');
  if (trainer.status !== 'ACTIVE') throw new BadRequestError('Trainer is not available for booking');

  const booking = await BookingRepository.create({
    userId,
    trainerId,
    bookingDate,
    bookingTime,
    sessionType: sessionType || null,
    notes: notes || null,
  });

  logger.info('Trainer booked', { userId, trainerId, bookingId: booking.id });
  const trainerName = trainer.user ? `${trainer.user.firstName} ${trainer.user.lastName}` : 'trainer';
  const dateTime = bookingDate && bookingTime ? `${bookingDate} at ${bookingTime}` : 'upcoming';
  notificationService.bookingCreated(booking.id, `User ${userId}`, `session with ${trainerName}`, dateTime).catch(() => {});

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

  const updated = await databaseService.transaction(async (session) => {
    const u = await BookingRepository.update(
      bookingId,
      { status: 'CANCELLED', cancelReason: cancelReason || null },
      session
    );
    if (booking.classId) {
      await ClassRepository.incrementAvailableSeats(booking.classId, 1, session);
    }
    return u;
  });

  logger.info('Booking cancelled', { userId, bookingId });

  notificationService.bookingCancelled(bookingId, `User ${userId}`, 'session').catch(() => {});

  return updated;
}

async function getMyBookings(userId, { page, limit, search, status, sortBy, sortOrder }) {
  const offset = (page - 1) * limit;

  const where = {};

  if (status) {
    where.status = status;
  }

  if (search) {
    where.$or = [
      { notes: { $regex: search, $options: 'i' } },
      { 'class.name': { $regex: search, $options: 'i' } },
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
    where.$or = [
      { 'user.firstName': { $regex: search, $options: 'i' } },
      { 'user.lastName': { $regex: search, $options: 'i' } },
      { 'user.email': { $regex: search, $options: 'i' } },
      { notes: { $regex: search, $options: 'i' } },
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

  const updated = await databaseService.transaction(async (session) => {
    const u = await BookingRepository.update(bookingId, { status: 'CANCELLED' }, session);
    await ClassRepository.incrementAvailableSeats(booking.classId, 1, session);
    return u;
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
    where.$or = [
      { 'user.firstName': { $regex: search, $options: 'i' } },
      { 'user.lastName': { $regex: search, $options: 'i' } },
      { 'user.email': { $regex: search, $options: 'i' } },
      { 'class.name': { $regex: search, $options: 'i' } },
      { notes: { $regex: search, $options: 'i' } },
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

  const updated = await databaseService.transaction(async (session) => {
    const u = await BookingRepository.update(bookingId, { status }, session);
    if (status === 'CANCELLED' && booking.classId) {
      await ClassRepository.incrementAvailableSeats(booking.classId, 1, session);
    }
    return u;
  });

  logger.info('Booking status updated', { bookingId, newStatus: status });

  return updated;
}

async function deleteBooking(bookingId) {
  const booking = await BookingRepository.findByIdBasic(bookingId);

  if (!booking) {
    throw new NotFoundError('Booking not found');
  }

  await databaseService.transaction(async (session) => {
    await BookingRepository.delete(bookingId, session);
    if (booking.classId && booking.status !== 'CANCELLED') {
      await ClassRepository.incrementAvailableSeats(booking.classId, 1, session);
    }
  });

  logger.info('Booking deleted', { bookingId });

  return { message: 'Booking deleted successfully' };
}

async function updateBooking(bookingId, data) {
  const booking = await BookingRepository.findByIdBasic(bookingId);
  if (!booking) throw new NotFoundError('Booking not found');

  const updateData = {};
  if (data.bookingDate !== undefined) updateData.bookingDate = data.bookingDate;
  if (data.bookingTime !== undefined) updateData.bookingTime = data.bookingTime;
  if (data.sessionType !== undefined) updateData.sessionType = data.sessionType;
  if (data.notes !== undefined) updateData.notes = data.notes;
  if (data.trainerId !== undefined) updateData.trainerId = data.trainerId;
  if (data.status !== undefined) updateData.status = data.status;

  if (Object.keys(updateData).length === 0) throw new BadRequestError('No fields to update');

  const updated = await BookingRepository.update(bookingId, updateData);
  logger.info('Booking updated by admin', { bookingId });
  return updated;
}

async function memberUpdateBooking(userId, bookingId, data) {
  const booking = await BookingRepository.findByIdBasic(bookingId);
  if (!booking) throw new NotFoundError('Booking not found');
  if (booking.userId !== userId) throw new ForbiddenError('You can only edit your own bookings');
  if (booking.status !== 'PENDING') throw new BadRequestError('Can only edit pending bookings');

  const updateData = {};
  if (data.bookingDate !== undefined) updateData.bookingDate = data.bookingDate;
  if (data.bookingTime !== undefined) updateData.bookingTime = data.bookingTime;
  if (data.sessionType !== undefined) updateData.sessionType = data.sessionType;
  if (data.notes !== undefined) updateData.notes = data.notes;

  if (Object.keys(updateData).length === 0) throw new BadRequestError('No fields to update');

  const updated = await BookingRepository.update(bookingId, updateData);
  logger.info('Booking updated by member', { userId, bookingId });
  return updated;
}

module.exports = {
  bookClass,
  bookTrainer,
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
  updateBooking,
  memberUpdateBooking,
};
