const databaseService = require('../../services/databaseService');

const USER_SELECT = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  phone: true,
  profileImage: true,
  role: true,
  isActive: true,
  isVerified: true,
  createdAt: true,
};

const TRAINER_SELECT = {
  id: true,
  userId: true,
  bio: true,
  specialization: true,
  designation: true,
  experience: true,
  hourlyRate: true,
  rating: true,
  reviewsCount: true,
  status: true,
  createdAt: true,
  user: { select: USER_SELECT },
};

const CLASS_SELECT = {
  id: true,
  name: true,
  category: true,
  difficulty: true,
  capacity: true,
  availableSeats: true,
  price: true,
  status: true,
  createdAt: true,
  trainer: {
    select: {
      id: true,
      user: { select: { id: true, firstName: true, lastName: true } },
    },
  },
};

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
  createdAt: true,
  user: { select: { id: true, firstName: true, lastName: true, email: true } },
  class: { select: { id: true, name: true, category: true } },
  trainer: {
    select: {
      id: true,
      user: { select: { id: true, firstName: true, lastName: true } },
    },
  },
};

const DashboardRepository = {
  // ─── Count Queries ─────────────────────────────────────

  async countUsers(where = {}) {
    return databaseService.client.user.count({ where });
  },

  async countTrainers(where = {}) {
    return databaseService.client.trainer.count({ where });
  },

  async countClasses(where = {}) {
    return databaseService.client.class.count({ where });
  },

  async countBookings(where = {}) {
    return databaseService.client.booking.count({ where });
  },

  async sumRevenue(where = {}) {
    const result = await databaseService.client.payment.aggregate({
      where,
      _sum: { amount: true },
    });
    return result._sum.amount || 0;
  },

  // ─── Statistics ────────────────────────────────────────

  async getOverviewStats() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    const [
      totalUsers,
      totalTrainers,
      totalClasses,
      totalBookings,
      totalRevenue,
      activeMembers,
      activeTrainers,
      monthlyBookings,
      monthlyRevenue,
    ] = await Promise.all([
      this.countUsers(),
      this.countTrainers(),
      this.countClasses(),
      this.countBookings(),
      this.sumRevenue({ status: 'PAID' }),
      this.countUsers({ role: 'MEMBER', isActive: true }),
      this.countTrainers({ status: 'ACTIVE' }),
      this.countBookings({ createdAt: { gte: startOfMonth } }),
      this.sumRevenue({ status: 'PAID', createdAt: { gte: startOfMonth } }),
    ]);

    return {
      totalUsers,
      totalTrainers,
      totalClasses,
      totalBookings,
      totalRevenue,
      activeMembers,
      activeTrainers,
      monthlyBookings,
      monthlyRevenue,
    };
  },

  // ─── Analytics ─────────────────────────────────────────

  async getMonthlyBookings({ startDate, endDate, months = 12 }) {
    const where = {};

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    } else {
      const now = new Date();
      where.createdAt = {
        gte: new Date(now.getFullYear(), now.getMonth() - months + 1, 1),
      };
    }

    const bookings = await databaseService.client.booking.findMany({
      where,
      select: {
        createdAt: true,
        status: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    const monthlyMap = {};
    for (const b of bookings) {
      const key = `${b.createdAt.getFullYear()}-${String(b.createdAt.getMonth() + 1).padStart(2, '0')}`;
      if (!monthlyMap[key]) {
        monthlyMap[key] = { month: key, total: 0, confirmed: 0, cancelled: 0, pending: 0, completed: 0 };
      }
      monthlyMap[key].total += 1;
      if (b.status === 'CONFIRMED') monthlyMap[key].confirmed += 1;
      if (b.status === 'CANCELLED') monthlyMap[key].cancelled += 1;
      if (b.status === 'PENDING') monthlyMap[key].pending += 1;
      if (b.status === 'COMPLETED') monthlyMap[key].completed += 1;
    }

    return Object.values(monthlyMap);
  },

  async getMonthlyRevenue({ startDate, endDate, months = 12 }) {
    const where = { status: 'PAID' };

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    } else {
      const now = new Date();
      where.createdAt = {
        gte: new Date(now.getFullYear(), now.getMonth() - months + 1, 1),
      };
    }

    const payments = await databaseService.client.payment.findMany({
      where,
      select: {
        amount: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    const monthlyMap = {};
    for (const p of payments) {
      const key = `${p.createdAt.getFullYear()}-${String(p.createdAt.getMonth() + 1).padStart(2, '0')}`;
      if (!monthlyMap[key]) {
        monthlyMap[key] = { month: key, totalRevenue: 0, transactionCount: 0 };
      }
      monthlyMap[key].totalRevenue = Number(monthlyMap[key].totalRevenue) + Number(p.amount);
      monthlyMap[key].transactionCount += 1;
    }

    return Object.values(monthlyMap);
  },

  async getClassPopularity({ startDate, endDate, limit = 10 }) {
    const where = {};

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    const classes = await databaseService.client.class.findMany({
      where: where.class ? undefined : undefined,
      select: {
        id: true,
        name: true,
        category: true,
        difficulty: true,
        capacity: true,
        price: true,
        _count: {
          select: { bookings: true },
        },
      },
      orderBy: {
        bookings: { _count: 'desc' },
      },
      take: limit,
    });

    return classes.map((c) => ({
      id: c.id,
      name: c.name,
      category: c.category,
      difficulty: c.difficulty,
      capacity: c.capacity,
      price: c.price,
      bookingCount: c._count.bookings,
    }));
  },

  async getTrainerPerformance({ startDate, endDate, limit = 10 }) {
    const trainers = await databaseService.client.trainer.findMany({
      where: { status: 'ACTIVE' },
      select: {
        id: true,
        userId: true,
        specialization: true,
        rating: true,
        reviewsCount: true,
        experience: true,
        user: { select: { id: true, firstName: true, lastName: true, email: true, profileImage: true } },
        _count: {
          select: { classes: true, bookings: true },
        },
      },
      orderBy: { rating: 'desc' },
      take: limit,
    });

    const trainerIds = trainers.map((t) => t.id);

    const bookingStats = await databaseService.client.booking.groupBy({
      by: ['trainerId', 'status'],
      where: {
        trainerId: { in: trainerIds },
        ...(startDate || endDate
          ? {
              createdAt: {
                ...(startDate ? { gte: new Date(startDate) } : {}),
                ...(endDate ? { lte: new Date(endDate) } : {}),
              },
            }
          : {}),
      },
      _count: true,
    });

    const statsMap = {};
    for (const bs of bookingStats) {
      if (!statsMap[bs.trainerId]) {
        statsMap[bs.trainerId] = { total: 0, confirmed: 0, completed: 0, cancelled: 0 };
      }
      statsMap[bs.trainerId].total += bs._count;
      if (bs.status === 'CONFIRMED') statsMap[bs.trainerId].confirmed += bs._count;
      if (bs.status === 'COMPLETED') statsMap[bs.trainerId].completed += bs._count;
      if (bs.status === 'CANCELLED') statsMap[bs.trainerId].cancelled += bs._count;
    }

    const revenueStats = await databaseService.client.payment.groupBy({
      by: ['bookingId'],
      where: {
        status: 'PAID',
        booking: { trainerId: { in: trainerIds } },
        ...(startDate || endDate
          ? {
              createdAt: {
                ...(startDate ? { gte: new Date(startDate) } : {}),
                ...(endDate ? { lte: new Date(endDate) } : {}),
              },
            }
          : {}),
      },
      _sum: { amount: true },
    });

    const bookingTrainerMap = {};
    const bookingIds = revenueStats.map((r) => r.bookingId);
    if (bookingIds.length > 0) {
      const bookings = await databaseService.client.booking.findMany({
        where: { id: { in: bookingIds } },
        select: { id: true, trainerId: true },
      });
      for (const b of bookings) {
        bookingTrainerMap[b.id] = b.trainerId;
      }
    }

    const revenueMap = {};
    for (const rs of revenueStats) {
      const trainerId = bookingTrainerMap[rs.bookingId];
      if (trainerId) {
        if (!revenueMap[trainerId]) revenueMap[trainerId] = 0;
        revenueMap[trainerId] = Number(revenueMap[trainerId]) + Number(rs._sum.amount || 0);
      }
    }

    return trainers.map((t) => ({
      id: t.id,
      userId: t.userId,
      firstName: t.user.firstName,
      lastName: t.user.lastName,
      email: t.user.email,
      profileImage: t.user.profileImage,
      specialization: t.specialization,
      rating: t.rating,
      reviewsCount: t.reviewsCount,
      experience: t.experience,
      totalClasses: t._count.classes,
      totalBookings: statsMap[t.id]?.total || 0,
      confirmedBookings: statsMap[t.id]?.confirmed || 0,
      completedBookings: statsMap[t.id]?.completed || 0,
      cancelledBookings: statsMap[t.id]?.cancelled || 0,
      totalRevenue: revenueMap[t.id] || 0,
    }));
  },

  async getRecentRegistrations({ limit = 10 }) {
    return databaseService.client.user.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        profileImage: true,
        role: true,
        isActive: true,
        isVerified: true,
        createdAt: true,
      },
    });
  },

  async getRecentBookings({ limit = 10 }) {
    return databaseService.client.booking.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: BOOKING_SELECT,
    });
  },

  // ─── Admin Dashboard ───────────────────────────────────

  async getLatestUsers({ limit = 5 }) {
    return databaseService.client.user.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        profileImage: true,
        role: true,
        isActive: true,
        isVerified: true,
        lastLoginAt: true,
        createdAt: true,
      },
    });
  },

  async getLatestTrainers({ limit = 5 }) {
    return databaseService.client.trainer.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: TRAINER_SELECT,
    });
  },

  async getLatestBookings({ limit = 5 }) {
    return databaseService.client.booking.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: BOOKING_SELECT,
    });
  },

  async getSystemOverview() {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalUsers,
      totalTrainers,
      totalMembers,
      totalClasses,
      activeClasses,
      totalBookings,
      todayBookings,
      weekBookings,
      monthBookings,
      totalPayments,
      pendingPayments,
      totalServices,
      totalGalleryItems,
      totalContactMessages,
      unreadMessages,
    ] = await Promise.all([
      this.countUsers(),
      this.countTrainers(),
      this.countUsers({ role: 'MEMBER' }),
      this.countClasses(),
      this.countClasses({ status: 'ACTIVE' }),
      this.countBookings(),
      this.countBookings({ createdAt: { gte: today } }),
      this.countBookings({ createdAt: { gte: startOfWeek } }),
      this.countBookings({ createdAt: { gte: startOfMonth } }),
      this.countPayments(),
      this.countPayments({ status: 'PENDING' }),
      databaseService.client.service.count(),
      databaseService.client.gallery.count(),
      databaseService.client.contactMessage.count(),
      databaseService.client.contactMessage.count({ where: { isRead: false } }),
    ]);

    return {
      users: { total: totalUsers, totalTrainers, totalMembers },
      classes: { total: totalClasses, active: activeClasses },
      bookings: { total: totalBookings, today: todayBookings, thisWeek: weekBookings, thisMonth: monthBookings },
      payments: { total: totalPayments, pending: pendingPayments },
      services: { total: totalServices },
      gallery: { total: totalGalleryItems },
      contactMessages: { total: totalContactMessages, unread: unreadMessages },
    };
  },

  async countPayments(where = {}) {
    return databaseService.client.payment.count({ where });
  },

  async getRevenueSummary({ startDate, endDate }) {
    const where = { status: 'PAID' };

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    const [
      totalRevenue,
      monthRevenue,
      lastMonthRevenue,
      yearRevenue,
      totalTransactions,
      monthTransactions,
    ] = await Promise.all([
      this.sumRevenue(where),
      this.sumRevenue({ status: 'PAID', createdAt: { gte: startOfMonth } }),
      this.sumRevenue({ status: 'PAID', createdAt: { gte: startOfLastMonth, lte: endOfLastMonth } }),
      this.sumRevenue({ status: 'PAID', createdAt: { gte: startOfYear } }),
      this.countPayments(where),
      this.countPayments({ status: 'PAID', createdAt: { gte: startOfMonth } }),
    ]);

    const lastMonthNum = Number(lastMonthRevenue);
    const currentMonthNum = Number(monthRevenue);
    const growth = lastMonthNum > 0
      ? ((currentMonthNum - lastMonthNum) / lastMonthNum * 100).toFixed(2)
      : currentMonthNum > 0
        ? 100
        : 0;

    return {
      totalRevenue,
      thisMonthRevenue: monthRevenue,
      lastMonthRevenue,
      yearRevenue,
      totalTransactions,
      monthTransactions,
      monthOverMonthGrowth: parseFloat(growth),
    };
  },

  async getBookingSummary({ startDate, endDate }) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const [
      totalBookings,
      todayBookings,
      weekBookings,
      monthBookings,
      lastMonthBookings,
      pendingBookings,
      confirmedBookings,
      completedBookings,
      cancelledBookings,
    ] = await Promise.all([
      this.countBookings(),
      this.countBookings({ createdAt: { gte: today } }),
      this.countBookings({ createdAt: { gte: startOfWeek } }),
      this.countBookings({ createdAt: { gte: startOfMonth } }),
      this.countBookings({ createdAt: { gte: startOfLastMonth, lte: endOfLastMonth } }),
      this.countBookings({ status: 'PENDING' }),
      this.countBookings({ status: 'CONFIRMED' }),
      this.countBookings({ status: 'COMPLETED' }),
      this.countBookings({ status: 'CANCELLED' }),
    ]);

    const lastMonthNum = lastMonthBookings;
    const currentMonthNum = monthBookings;
    const growth = lastMonthNum > 0
      ? ((currentMonthNum - lastMonthNum) / lastMonthNum * 100).toFixed(2)
      : currentMonthNum > 0
        ? 100
        : 0;

    return {
      totalBookings,
      todayBookings,
      thisWeekBookings: weekBookings,
      thisMonthBookings: monthBookings,
      lastMonthBookings,
      pendingBookings,
      confirmedBookings,
      completedBookings,
      cancelledBookings,
      monthOverMonthGrowth: parseFloat(growth),
    };
  },

  async getBookingStatusBreakdown({ startDate, endDate }) {
    const where = {};

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    const results = await databaseService.client.booking.groupBy({
      by: ['status'],
      where,
      _count: true,
    });

    return results.map((r) => ({
      status: r.status,
      count: r._count,
    }));
  },

  async getTopClassesByBookings({ limit = 5, startDate, endDate }) {
    const where = {};

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    const classes = await databaseService.client.class.findMany({
      select: {
        id: true,
        name: true,
        category: true,
        difficulty: true,
        price: true,
        _count: {
          select: { bookings: where.createdAt ? { where } : true },
        },
      },
      orderBy: {
        bookings: { _count: 'desc' },
      },
      take: limit,
    });

    return classes.map((c) => ({
      id: c.id,
      name: c.name,
      category: c.category,
      difficulty: c.difficulty,
      price: c.price,
      bookingCount: c._count.bookings,
    }));
  },

  async getTopTrainersByBookings({ limit = 5, startDate, endDate }) {
    const trainers = await databaseService.client.trainer.findMany({
      where: { status: 'ACTIVE' },
      select: {
        id: true,
        user: { select: { firstName: true, lastName: true, email: true, profileImage: true } },
        rating: true,
        specialization: true,
        _count: {
          select: {
            bookings: startDate || endDate
              ? {
                  where: {
                    createdAt: {
                      ...(startDate ? { gte: new Date(startDate) } : {}),
                      ...(endDate ? { lte: new Date(endDate) } : {}),
                    },
                  },
                }
              : true,
          },
        },
      },
      orderBy: {
        bookings: { _count: 'desc' },
      },
      take: limit,
    });

    return trainers.map((t) => ({
      id: t.id,
      firstName: t.user.firstName,
      lastName: t.user.lastName,
      email: t.user.email,
      profileImage: t.user.profileImage,
      rating: t.rating,
      specialization: t.specialization,
      bookingCount: t._count.bookings,
    }));
  },
};

module.exports = DashboardRepository;
