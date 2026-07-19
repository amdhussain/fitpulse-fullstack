const { ObjectId } = require('mongodb');
const databaseService = require('./databaseService');
const { NotFoundError, ForbiddenError, BadRequestError } = require('../errors');
const { extractPagination } = require('../utils/pagination');
const logger = require('../utils/logger');

const VALID_STATUSES = ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'];

const STATUS_TRANSITIONS = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['COMPLETED', 'CANCELLED'],
  CANCELLED: [],
  COMPLETED: [],
};

const BOOKING_LOOKUP_PIPELINE = [
  { $lookup: { from: 'users', localField: 'userId', foreignField: '_id', as: 'userArr', pipeline: [{ $project: { _id: 1, firstName: 1, lastName: 1, email: 1, phone: 1, role: 1 } }] } },
  { $lookup: { from: 'services', localField: 'serviceId', foreignField: '_id', as: 'serviceArr', pipeline: [{ $project: { _id: 1, name: 1, category: 1, price: 1, duration: 1, image: 1 } }] } },
  { $lookup: { from: 'trainers', localField: 'trainerId', foreignField: '_id', as: 'trainerArr', pipeline: [
    { $lookup: { from: 'users', localField: 'userId', foreignField: '_id', as: 'userArr', pipeline: [{ $project: { _id: 1, firstName: 1, lastName: 1, email: 1 } }] } },
    { $addFields: { user: { $arrayElemAt: ['$userArr', 0] } } },
    { $project: { userArr: 0, _id: 1, userId: 1, specialization: 1, designation: 1, user: 1 } },
  ] } },
  { $lookup: { from: 'classes', localField: 'classId', foreignField: '_id', as: 'classArr', pipeline: [{ $project: { _id: 1, name: 1, category: 1, difficulty: 1, capacity: 1, availableSeats: 1, schedule: 1, duration: 1, price: 1, image: 1, status: 1 } }] } },
  { $addFields: {
    user: { $arrayElemAt: ['$userArr', 0] },
    service: { $arrayElemAt: ['$serviceArr', 0] },
    trainer: { $arrayElemAt: ['$trainerArr', 0] },
    class: { $arrayElemAt: ['$classArr', 0] },
    userId: { $toString: '$userId' },
    serviceId: { $cond: { if: '$serviceId', then: { $toString: '$serviceId' }, else: null } },
    trainerId: { $cond: { if: '$trainerId', then: { $toString: '$trainerId' }, else: null } },
    classId: { $cond: { if: '$classId', then: { $toString: '$classId' }, else: null } },
  } },
  { $project: { userArr: 0, serviceArr: 0, trainerArr: 0, classArr: 0 } },
];

function formatBooking(doc) {
  if (!doc) return null;
  const { _id, user, service, trainer, class: cls, ...rest } = doc;
  const formatted = { ...rest, id: _id.toString() };
  if (user) { formatted.user = { ...user, id: user._id.toString() }; delete formatted.user._id; }
  if (service) { formatted.service = { ...service, id: service._id.toString() }; delete formatted.service._id; }
  if (trainer) {
    formatted.trainer = { ...trainer, id: trainer._id.toString() }; delete formatted.trainer._id;
    if (formatted.trainer.user) { formatted.trainer.user = { ...formatted.trainer.user, id: formatted.trainer.user._id.toString() }; delete formatted.trainer.user._id; }
  }
  if (cls) { formatted.class = { ...cls, id: cls._id.toString() }; delete formatted.class._id; }
  return formatted;
}

async function runBookingQuery(match, { page, limit, offset, sortBy, sortOrder }) {
  const pipeline = [{ $match: match }, ...BOOKING_LOOKUP_PIPELINE];
  const countPipeline = [...pipeline, { $count: 'total' }];
  const countResult = await databaseService.client.bookings.aggregate(countPipeline).toArray();
  const total = countResult[0] ? countResult[0].total : 0;
  const sort = {};
  if (sortBy) sort[sortBy] = sortOrder === 'DESC' ? -1 : 1;
  else sort.createdAt = -1;
  pipeline.push({ $sort: sort }, { $skip: offset }, { $limit: limit });
  const results = await databaseService.client.bookings.aggregate(pipeline).toArray();
  return { data: results.map(formatBooking), total };
}

async function adminGetAll(query = {}) {
  const { page, limit, offset } = extractPagination(query);
  const match = {};
  if (query.status) match.status = query.status;
  if (query.userId) match.userId = new ObjectId(query.userId);
  if (query.serviceId) match.serviceId = new ObjectId(query.serviceId);
  if (query.trainerId) match.trainerId = new ObjectId(query.trainerId);
  const { data, total } = await runBookingQuery(match, { page, limit, offset, sortBy: query.sortBy, sortOrder: query.sortOrder });
  return { data, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } };
}

async function adminGetById(id) {
  const pipeline = [{ $match: { _id: new ObjectId(id) } }, ...BOOKING_LOOKUP_PIPELINE];
  const results = await databaseService.client.bookings.aggregate(pipeline).toArray();
  const booking = formatBooking(results[0] || null);
  if (!booking) throw new NotFoundError('Booking not found');
  return booking;
}

async function adminCreate(data) {
  const now = new Date();
  const insertData = {
    userId: new ObjectId(data.userId),
    classId: data.classId ? new ObjectId(data.classId) : null,
    serviceId: data.serviceId ? new ObjectId(data.serviceId) : null,
    trainerId: data.trainerId ? new ObjectId(data.trainerId) : null,
    bookingDate: data.bookingDate || null,
    bookingTime: data.bookingTime || null,
    status: data.status || 'PENDING',
    attended: data.attended || false,
    notes: data.notes || null,
    cancelReason: data.cancelReason || null,
    createdAt: now,
    updatedAt: now,
  };
  const result = await databaseService.client.bookings.insertOne(insertData);
  const booking = await adminGetById(result.insertedId.toString());
  logger.info('Booking created (admin)', { bookingId: booking.id, userId: data.userId });
  return booking;
}

async function adminUpdate(id, data) {
  await adminGetById(id);
  const updateFields = { ...data, updatedAt: new Date() };
  if (data.userId) updateFields.userId = new ObjectId(data.userId);
  if (data.classId) updateFields.classId = new ObjectId(data.classId);
  if (data.serviceId) updateFields.serviceId = new ObjectId(data.serviceId);
  if (data.trainerId) updateFields.trainerId = new ObjectId(data.trainerId);
  await databaseService.client.bookings.updateOne(
    { _id: new ObjectId(id) },
    { $set: updateFields }
  );
  logger.info('Booking updated (admin)', { bookingId: id });
  return adminGetById(id);
}

async function adminRemove(id) {
  await adminGetById(id);
  await databaseService.client.bookings.deleteOne({ _id: new ObjectId(id) });
  logger.info('Booking deleted (admin)', { bookingId: id });
}

async function adminUpdateStatus(id, status) {
  const booking = await adminGetById(id);
  await databaseService.client.bookings.updateOne(
    { _id: new ObjectId(id) },
    { $set: { status, updatedAt: new Date() } }
  );
  logger.info('Booking status updated (admin)', { bookingId: id, status });
  return adminGetById(id);
}

async function memberGetAll(userId, query = {}) {
  const { page, limit, offset } = extractPagination(query);
  const match = { userId: new ObjectId(userId) };
  if (query.status) match.status = query.status;
  const { data, total } = await runBookingQuery(match, { page, limit, offset, sortBy: query.sortBy, sortOrder: query.sortOrder });
  return { data, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } };
}

async function memberGetById(userId, bookingId) {
  const booking = await adminGetById(bookingId);
  if (booking.userId !== userId) throw new NotFoundError('Booking not found');
  return booking;
}

async function memberCreate(userId, data) {
  const now = new Date();
  const insertData = {
    userId: new ObjectId(userId),
    classId: data.classId ? new ObjectId(data.classId) : null,
    serviceId: data.serviceId ? new ObjectId(data.serviceId) : null,
    trainerId: data.trainerId ? new ObjectId(data.trainerId) : null,
    bookingDate: data.bookingDate || null,
    bookingTime: data.bookingTime || null,
    status: 'PENDING',
    attended: false,
    notes: data.notes || null,
    createdAt: now,
    updatedAt: now,
  };
  const result = await databaseService.client.bookings.insertOne(insertData);
  const booking = await adminGetById(result.insertedId.toString());
  logger.info('Booking created (member)', { bookingId: booking.id, userId });
  return booking;
}

async function memberUpdate(userId, bookingId, data) {
  const booking = await memberGetById(userId, bookingId);
  if (booking.status === 'CANCELLED' || booking.status === 'COMPLETED') {
    throw new BadRequestError(`Cannot update a ${booking.status.toLowerCase()} booking`);
  }
  const updateFields = { ...data, updatedAt: new Date() };
  if (data.serviceId) updateFields.serviceId = new ObjectId(data.serviceId);
  if (data.trainerId) updateFields.trainerId = new ObjectId(data.trainerId);
  await databaseService.client.bookings.updateOne(
    { _id: new ObjectId(bookingId) },
    { $set: updateFields }
  );
  logger.info('Booking updated (member)', { bookingId, userId });
  return adminGetById(bookingId);
}

async function memberCancel(userId, bookingId, cancelReason) {
  const booking = await memberGetById(userId, bookingId);
  if (booking.status === 'CANCELLED') throw new BadRequestError('Booking is already cancelled');
  if (booking.status === 'COMPLETED') throw new BadRequestError('Cannot cancel a completed booking');
  await databaseService.client.bookings.updateOne(
    { _id: new ObjectId(bookingId) },
    { $set: { status: 'CANCELLED', cancelReason: cancelReason || null, updatedAt: new Date() } }
  );
  logger.info('Booking cancelled (member)', { bookingId, userId, reason: cancelReason });
  return adminGetById(bookingId);
}

async function trainerGetAll(trainerId, query = {}) {
  const { page, limit, offset } = extractPagination(query);
  const match = { trainerId: new ObjectId(trainerId) };
  if (query.status) match.status = query.status;
  const { data, total } = await runBookingQuery(match, { page, limit, offset, sortBy: query.sortBy, sortOrder: query.sortOrder });
  return { data, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } };
}

async function trainerUpdateStatus(trainerId, bookingId, status) {
  const booking = await adminGetById(bookingId);
  if (booking.trainerId !== trainerId) throw new NotFoundError('Booking not found or not assigned to you');
  const allowed = STATUS_TRANSITIONS[booking.status];
  if (!allowed.includes(status)) throw new BadRequestError(`Cannot change status from '${booking.status}' to '${status}'`);
  await databaseService.client.bookings.updateOne(
    { _id: new ObjectId(bookingId) },
    { $set: { status, updatedAt: new Date() } }
  );
  logger.info('Booking status updated (trainer)', { bookingId, trainerId, status });
  return adminGetById(bookingId);
}

async function getTrainerIdForUser(userId) {
  const trainer = await databaseService.client.trainers.findOne({ userId: new ObjectId(userId) });
  return trainer ? trainer._id.toString() : null;
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
