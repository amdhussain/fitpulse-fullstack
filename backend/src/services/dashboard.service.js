const databaseService = require('./databaseService');
const { extractPagination } = require('../utils/pagination');
const logger = require('../utils/logger');

async function getStats() {
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [users, trainers, services, galleryItems, bookings, unreadMessages, usersByRole, bookingsByStatus, newUsersWeek, newUsersMonth, newBookingsWeek, newBookingsMonth] = await Promise.all([
    databaseService.client.users.countDocuments(),
    databaseService.client.trainers.countDocuments(),
    databaseService.client.services.countDocuments(),
    databaseService.client.gallery.countDocuments(),
    databaseService.client.bookings.countDocuments(),
    databaseService.client.contactMessages.countDocuments({ isRead: false }),
    databaseService.client.users.aggregate([{ $group: { _id: '$role', count: { $sum: 1 } } }]).toArray(),
    databaseService.client.bookings.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]).toArray(),
    databaseService.client.users.countDocuments({ createdAt: { $gte: weekAgo } }),
    databaseService.client.users.countDocuments({ createdAt: { $gte: monthAgo } }),
    databaseService.client.bookings.countDocuments({ createdAt: { $gte: weekAgo } }),
    databaseService.client.bookings.countDocuments({ createdAt: { $gte: monthAgo } }),
  ]);

  const roleMap = {};
  for (const r of usersByRole) roleMap[r._id] = r.count;
  const statusMap = {};
  for (const s of bookingsByStatus) statusMap[s._id] = s.count;

  return {
    totals: { users, trainers, services, galleryItems, bookings, unreadMessages },
    usersByRole: roleMap,
    bookingsByStatus: statusMap,
    trends: { newUsersThisWeek: newUsersWeek, newUsersThisMonth: newUsersMonth, newBookingsThisWeek: newBookingsWeek, newBookingsThisMonth: newBookingsMonth },
  };
}

async function getUserStats() {
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const [total, active, inactive, verified, byRole, newThisWeek, newThisMonth, recentlyActive] = await Promise.all([
    databaseService.client.users.countDocuments(),
    databaseService.client.users.countDocuments({ isActive: true }),
    databaseService.client.users.countDocuments({ isActive: false }),
    databaseService.client.users.countDocuments({ isVerified: true }),
    databaseService.client.users.aggregate([{ $group: { _id: '$role', count: { $sum: 1 } } }]).toArray(),
    databaseService.client.users.countDocuments({ createdAt: { $gte: weekAgo } }),
    databaseService.client.users.countDocuments({ createdAt: { $gte: monthAgo } }),
    databaseService.client.users.countDocuments({ lastLoginAt: { $gte: dayAgo } }),
  ]);

  const roleMap = {};
  for (const r of byRole) roleMap[r._id] = r.count;

  return { total, active, inactive, verified, byRole: roleMap, newThisWeek, newThisMonth, recentlyActive };
}

async function getTrainerStats() {
  const [total, active, inactive, avgResult] = await Promise.all([
    databaseService.client.trainers.countDocuments(),
    databaseService.client.trainers.countDocuments({ status: 'ACTIVE' }),
    databaseService.client.trainers.countDocuments({ status: { $ne: 'ACTIVE' } }),
    databaseService.client.trainers.aggregate([
      { $group: { _id: null, avgExperience: { $avg: '$experience' }, avgRating: { $avg: '$rating' } } },
    ]).toArray(),
  ]);

  const avgs = avgResult[0] || { avgExperience: 0, avgRating: 0 };

  return { total, active, inactive, avgExperience: avgs.avgExperience || 0, avgRating: avgs.avgRating || 0 };
}

async function getBookingStats(query = {}) {
  const match = {};
  if (query.dateFrom || query.dateTo) {
    match.createdAt = {};
    if (query.dateFrom) match.createdAt.$gte = new Date(query.dateFrom);
    if (query.dateTo) match.createdAt.$lte = new Date(query.dateTo);
  }

  const [total, byStatusResult] = await Promise.all([
    databaseService.client.bookings.countDocuments(match),
    databaseService.client.bookings.aggregate([
      { $match: match },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]).toArray(),
  ]);

  const byStatus = {};
  for (const s of byStatusResult) byStatus[s._id] = s.count;

  return { total, byStatus };
}

async function getRecentBookings(limit = 10) {
  const docs = await databaseService.client.bookings
    .find()
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray();

  return databaseService.formatDocs(docs);
}

async function getRevenue(query = {}) {
  const match = { status: { $in: ['CONFIRMED', 'COMPLETED'] } };
  if (query.dateFrom || query.dateTo) {
    match.createdAt = {};
    if (query.dateFrom) match.createdAt.$gte = new Date(query.dateFrom);
    if (query.dateTo) match.createdAt.$lte = new Date(query.dateTo);
  }

  const pipeline = [
    { $match: match },
    { $lookup: { from: 'services', localField: 'serviceId', foreignField: '_id', as: 'serviceArr' } },
    { $addFields: { service: { $arrayElemAt: ['$serviceArr', 0] } } },
    { $addFields: { revenue: { $ifNull: ['$service.price', 0] } } },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$revenue' },
        totalBookings: { $sum: 1 },
        avgBookingValue: { $avg: '$revenue' },
      },
    },
  ];

  const results = await databaseService.client.bookings.aggregate(pipeline).toArray();
  const summary = results[0] || { totalRevenue: 0, totalBookings: 0, avgBookingValue: 0 };

  const monthlyPipeline = [
    { $match: match },
    { $lookup: { from: 'services', localField: 'serviceId', foreignField: '_id', as: 'serviceArr' } },
    { $addFields: { service: { $arrayElemAt: ['$serviceArr', 0] } } },
    { $addFields: { revenue: { $ifNull: ['$service.price', 0] } } },
    { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } }, total: { $sum: '$revenue' }, count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
    { $project: { _id: 0, month: '$_id', total: 1, count: 1 } },
  ];

  const monthly = await databaseService.client.bookings.aggregate(monthlyPipeline).toArray();

  return { totalRevenue: summary.totalRevenue, totalBookings: summary.totalBookings, avgBookingValue: summary.avgBookingValue, monthly };
}

async function getUserActivity(query = {}) {
  const { page, limit, offset } = extractPagination(query);
  const match = {};
  if (query.role) match.role = query.role;
  if (query.isActive !== undefined) match.isActive = query.isActive === true || query.isActive === 'true';
  if (query.search) {
    match.$or = [
      { firstName: { $regex: query.search, $options: 'i' } },
      { lastName: { $regex: query.search, $options: 'i' } },
      { email: { $regex: query.search, $options: 'i' } },
    ];
  }

  const total = await databaseService.client.users.countDocuments(match);
  const sort = {};
  if (query.sortBy) sort[query.sortBy] = query.sortOrder === 'DESC' ? -1 : 1;
  else sort.createdAt = -1;

  const docs = await databaseService.client.users
    .find(match, { projection: { password: 0 } })
    .sort(sort).skip(offset).limit(limit).toArray();

  return {
    data: databaseService.formatDocs(docs),
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
}

module.exports = {
  getStats,
  getUserStats,
  getTrainerStats,
  getBookingStats,
  getRecentBookings,
  getRevenue,
  getUserActivity,
};
