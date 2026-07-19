const databaseService = require('../../services/databaseService');

function buildDateMatch(where) {
  const match = {};
  if (where && where.createdAt) {
    match.createdAt = {};
    if (where.createdAt.$gte) match.createdAt.$gte = where.createdAt.$gte;
    if (where.createdAt.$lte) match.createdAt.$lte = where.createdAt.$lte;
  }
  return match;
}

const DashboardRepository = {
  async countUsers(where = {}) {
    return databaseService.client.users.countDocuments(where);
  },

  async countTrainers(where = {}) {
    return databaseService.client.trainers.countDocuments(where);
  },

  async countClasses(where = {}) {
    return databaseService.client.classes.countDocuments(where);
  },

  async countBookings(where = {}) {
    return databaseService.client.bookings.countDocuments(where);
  },

  async sumRevenue(where = {}) {
    const match = buildDateMatch(where);
    const results = await databaseService.client.payments.aggregate([
      { $match: match },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]).toArray();
    return results[0] ? results[0].total : 0;
  },

  async getOverviewStats() {
    const [totalUsers, totalTrainers, totalClasses, totalBookings, activeMembers, activeTrainers] = await Promise.all([
      databaseService.client.users.countDocuments(),
      databaseService.client.trainers.countDocuments(),
      databaseService.client.classes.countDocuments(),
      databaseService.client.bookings.countDocuments(),
      databaseService.client.users.countDocuments({ isActive: true, role: 'MEMBER' }),
      databaseService.client.trainers.countDocuments({ status: 'ACTIVE' }),
    ]);

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const [monthlyBookings, monthlyRevenue] = await Promise.all([
      databaseService.client.bookings.countDocuments({ createdAt: { $gte: monthStart } }),
      this.sumRevenue({ createdAt: { $gte: monthStart } }),
    ]);

    const totalRevenue = await this.sumRevenue();

    return {
      totalUsers, totalTrainers, totalClasses, totalBookings,
      totalRevenue, activeMembers, activeTrainers, monthlyBookings, monthlyRevenue,
    };
  },

  async getMonthlyBookings({ startDate, endDate, months = 12 }) {
    const now = new Date();
    const start = startDate ? new Date(startDate) : new Date(now.getFullYear(), now.getMonth() - months + 1, 1);
    const end = endDate ? new Date(endDate) : now;

    return databaseService.client.bookings.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end } } },
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]).toArray();
  },

  async getMonthlyRevenue({ startDate, endDate, months = 12 }) {
    const now = new Date();
    const start = startDate ? new Date(startDate) : new Date(now.getFullYear(), now.getMonth() - months + 1, 1);
    const end = endDate ? new Date(endDate) : now;

    return databaseService.client.payments.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end }, status: 'PAID' } },
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]).toArray();
  },

  async getClassPopularity({ startDate, endDate, limit = 10 }) {
    const match = {};
    if (startDate || endDate) {
      match.createdAt = {};
      if (startDate) match.createdAt.$gte = new Date(startDate);
      if (endDate) match.createdAt.$lte = new Date(endDate);
    }

    return databaseService.client.bookings.aggregate([
      { $match: { ...match, classId: { $ne: null } } },
      { $group: { _id: '$classId', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: 'classes',
          localField: '_id',
          foreignField: '_id',
          as: 'classInfo',
          pipeline: [{ $project: { _id: 1, name: 1, category: 1, image: 1 } }],
        },
      },
      { $addFields: { class: { $arrayElemAt: ['$classInfo', 0] } } },
      { $project: { classInfo: 0, _id: 0, classId: '$_id', count: 1, class: 1 } },
    ]).toArray();
  },

  async getTrainerPerformance({ startDate, endDate, limit = 10 }) {
    const match = {};
    if (startDate || endDate) {
      match.createdAt = {};
      if (startDate) match.createdAt.$gte = new Date(startDate);
      if (endDate) match.createdAt.$lte = new Date(endDate);
    }

    return databaseService.client.bookings.aggregate([
      { $match: { ...match, trainerId: { $ne: null } } },
      { $group: { _id: '$trainerId', bookingCount: { $sum: 1 } } },
      { $sort: { bookingCount: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: 'trainers',
          localField: '_id',
          foreignField: '_id',
          as: 'trainerArr',
          pipeline: [
            { $lookup: { from: 'users', localField: 'userId', foreignField: '_id', as: 'userArr', pipeline: [{ $project: { _id: 1, firstName: 1, lastName: 1 } }] } },
            { $addFields: { user: { $arrayElemAt: ['$userArr', 0] } } },
            { $project: { userArr: 0, _id: 1, userId: 1, specialization: 1, rating: 1, user: 1 } },
          ],
        },
      },
      { $addFields: { trainer: { $arrayElemAt: ['$trainerArr', 0] } } },
      { $project: { trainerArr: 0, _id: 0, trainerId: '$_id', bookingCount: 1, trainer: 1 } },
    ]).toArray();
  },

  async getRecentRegistrations({ limit = 10 }) {
    const docs = await databaseService.client.users
      .find({}, { projection: { password: 0 } })
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();
    return databaseService.formatDocs(docs);
  },

  async getRecentBookings({ limit = 10 }) {
    const pipeline = [
      { $sort: { createdAt: -1 } },
      { $limit: limit },
      {
        $lookup: { from: 'users', localField: 'userId', foreignField: '_id', as: 'userArr', pipeline: [{ $project: { _id: 1, firstName: 1, lastName: 1, email: 1 } }] },
      },
      { $lookup: { from: 'classes', localField: 'classId', foreignField: '_id', as: 'classArr', pipeline: [{ $project: { _id: 1, name: 1, category: 1 } }] } },
      { $addFields: { user: { $arrayElemAt: ['$userArr', 0] }, class: { $arrayElemAt: ['$classArr', 0] }, userId: { $toString: '$userId' } } },
      { $project: { userArr: 0, classArr: 0 } },
    ];
    return databaseService.client.bookings.aggregate(pipeline).toArray();
  },

  async getLatestUsers({ limit = 5 }) {
    const docs = await databaseService.client.users
      .find({}, { projection: { password: 0 } })
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();
    return databaseService.formatDocs(docs);
  },

  async getLatestTrainers({ limit = 5 }) {
    const pipeline = [
      { $sort: { createdAt: -1 } },
      { $limit: limit },
      { $lookup: { from: 'users', localField: 'userId', foreignField: '_id', as: 'userArr', pipeline: [{ $project: { _id: 1, firstName: 1, lastName: 1, email: 1, profileImage: 1 } }] } },
      { $addFields: { user: { $arrayElemAt: ['$userArr', 0] } } },
      { $project: { userArr: 0 } },
    ];
    return databaseService.client.trainers.aggregate(pipeline).toArray();
  },

  async getLatestBookings({ limit = 5 }) {
    return this.getRecentBookings({ limit });
  },

  async getSystemOverview() {
    const [users, trainers, classes, bookings, payments, services, gallery, contactMessages] = await Promise.all([
      databaseService.client.users.countDocuments(),
      databaseService.client.trainers.countDocuments(),
      databaseService.client.classes.countDocuments(),
      databaseService.client.bookings.countDocuments(),
      databaseService.client.payments.countDocuments(),
      databaseService.client.services.countDocuments(),
      databaseService.client.gallery.countDocuments(),
      databaseService.client.contactMessages.countDocuments(),
    ]);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    const [todayBookings, thisWeekBookings, thisMonthBookings, pendingBookings, unreadMessages] = await Promise.all([
      databaseService.client.bookings.countDocuments({ createdAt: { $gte: today } }),
      databaseService.client.bookings.countDocuments({ createdAt: { $gte: weekStart } }),
      databaseService.client.bookings.countDocuments({ createdAt: { $gte: monthStart } }),
      databaseService.client.payments.countDocuments({ status: 'PENDING' }),
      databaseService.client.contactMessages.countDocuments({ isRead: false }),
    ]);

    return {
      users: { total: users, totalTrainers: trainers, totalMembers: users - trainers },
      classes: { total: classes, active: await databaseService.client.classes.countDocuments({ status: 'ACTIVE' }) },
      bookings: { total: bookings, today: todayBookings, thisWeek: thisWeekBookings, thisMonth: thisMonthBookings },
      payments: { total: payments, pending: pendingBookings },
      services: { total: services },
      gallery: { total: gallery },
      contactMessages: { total: contactMessages, unread: unreadMessages },
    };
  },

  async countPayments(where = {}) {
    return databaseService.client.payments.countDocuments(where);
  },

  async getRevenueSummary({ startDate, endDate }) {
    const totalRevenue = await this.sumRevenue();
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
    const yearStart = new Date(now.getFullYear(), 0, 1);

    const [thisMonthRevenue, lastMonthRevenue, yearRevenue, totalTransactions, monthTransactions] = await Promise.all([
      this.sumRevenue({ createdAt: { $gte: monthStart } }),
      this.sumRevenue({ createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd } }),
      this.sumRevenue({ createdAt: { $gte: yearStart } }),
      this.countPayments(),
      this.countPayments({ createdAt: { $gte: monthStart } }),
    ]);

    const monthOverMonthGrowth = lastMonthRevenue > 0
      ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
      : 0;

    return {
      totalRevenue, thisMonthRevenue, lastMonthRevenue, yearRevenue,
      totalTransactions, monthTransactions, monthOverMonthGrowth,
    };
  },

  async getBookingSummary({ startDate, endDate }) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

    const [totalBookings, todayBookings, thisWeekBookings, thisMonthBookings, lastMonthBookings, pendingBookings, confirmedBookings, completedBookings, cancelledBookings] = await Promise.all([
      databaseService.client.bookings.countDocuments(),
      databaseService.client.bookings.countDocuments({ createdAt: { $gte: today } }),
      databaseService.client.bookings.countDocuments({ createdAt: { $gte: weekStart } }),
      databaseService.client.bookings.countDocuments({ createdAt: { $gte: monthStart } }),
      databaseService.client.bookings.countDocuments({ createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd } }),
      databaseService.client.bookings.countDocuments({ status: 'PENDING' }),
      databaseService.client.bookings.countDocuments({ status: 'CONFIRMED' }),
      databaseService.client.bookings.countDocuments({ status: 'COMPLETED' }),
      databaseService.client.bookings.countDocuments({ status: 'CANCELLED' }),
    ]);

    const monthOverMonthGrowth = lastMonthBookings > 0
      ? ((thisMonthBookings - lastMonthBookings) / lastMonthBookings) * 100
      : 0;

    return {
      totalBookings, todayBookings, thisWeekBookings, thisMonthBookings,
      lastMonthBookings, pendingBookings, confirmedBookings, completedBookings,
      cancelledBookings, monthOverMonthGrowth,
    };
  },

  async getBookingStatusBreakdown({ startDate, endDate }) {
    const match = {};
    if (startDate || endDate) {
      match.createdAt = {};
      if (startDate) match.createdAt.$gte = new Date(startDate);
      if (endDate) match.createdAt.$lte = new Date(endDate);
    }

    return databaseService.client.bookings.aggregate([
      { $match: match },
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $project: { _id: 0, status: '$_id', count: 1 } },
    ]).toArray();
  },

  async getTopClassesByBookings({ limit = 5, startDate, endDate }) {
    const match = { classId: { $ne: null } };
    if (startDate || endDate) {
      match.createdAt = {};
      if (startDate) match.createdAt.$gte = new Date(startDate);
      if (endDate) match.createdAt.$lte = new Date(endDate);
    }

    return databaseService.client.bookings.aggregate([
      { $match: match },
      { $group: { _id: '$classId', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: limit },
      { $lookup: { from: 'classes', localField: '_id', foreignField: '_id', as: 'classArr', pipeline: [{ $project: { _id: 1, name: 1, category: 1 } }] } },
      { $addFields: { class: { $arrayElemAt: ['$classArr', 0] } } },
      { $project: { classArr: 0, _id: 0, classId: '$_id', count: 1, class: 1 } },
    ]).toArray();
  },

  async getTopTrainersByBookings({ limit = 5, startDate, endDate }) {
    const match = { trainerId: { $ne: null } };
    if (startDate || endDate) {
      match.createdAt = {};
      if (startDate) match.createdAt.$gte = new Date(startDate);
      if (endDate) match.createdAt.$lte = new Date(endDate);
    }

    return databaseService.client.bookings.aggregate([
      { $match: match },
      { $group: { _id: '$trainerId', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: limit },
      { $lookup: { from: 'trainers', localField: '_id', foreignField: '_id', as: 'trainerArr', pipeline: [
        { $lookup: { from: 'users', localField: 'userId', foreignField: '_id', as: 'userArr', pipeline: [{ $project: { _id: 1, firstName: 1, lastName: 1 } }] } },
        { $addFields: { user: { $arrayElemAt: ['$userArr', 0] } } },
        { $project: { userArr: 0 } },
      ] } },
      { $addFields: { trainer: { $arrayElemAt: ['$trainerArr', 0] } } },
      { $project: { trainerArr: 0, _id: 0, trainerId: '$_id', count: 1, trainer: 1 } },
    ]).toArray();
  },
};

module.exports = DashboardRepository;
