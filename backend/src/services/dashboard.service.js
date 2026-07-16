const databaseService = require('./databaseService');
const { extractPagination } = require('../utils/pagination');
const logger = require('../utils/logger');

// ─── Dashboard Service ─────────────────────────────────────
// Aggregation and analytics queries for the admin dashboard.
// All data is read-only — no mutations performed here.
//
// Revenue is calculated from booking + service price data
// (no payment gateway integration).
// ───────────────────────────────────────────────────────────

// ─── Overview Statistics ───────────────────────────────────

async function getStats() {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const [
    totalUsers,
    totalTrainers,
    totalServices,
    totalGalleryItems,
    totalBookings,
    unreadMessages,
    usersByRole,
    bookingsByStatus,
    newUsersThisWeek,
    newUsersThisMonth,
    newBookingsThisWeek,
    newBookingsThisMonth,
  ] = await Promise.all([
    databaseService.client.user.count(),
    databaseService.client.trainer.count(),
    databaseService.client.service.count(),
    databaseService.client.gallery.count(),
    databaseService.client.booking.count(),
    databaseService.client.contactMessage.count({ where: { isRead: false } }),
    databaseService.client.user.groupBy({
      by: ['role'],
      _count: { role: true },
    }),
    databaseService.client.booking.groupBy({
      by: ['status'],
      _count: { status: true },
    }),
    databaseService.client.user.count({
      where: { createdAt: { gte: sevenDaysAgo } },
    }),
    databaseService.client.user.count({
      where: { createdAt: { gte: thirtyDaysAgo } },
    }),
    databaseService.client.booking.count({
      where: { createdAt: { gte: sevenDaysAgo } },
    }),
    databaseService.client.booking.count({
      where: { createdAt: { gte: thirtyDaysAgo } },
    }),
  ]);

  const roleBreakdown = {};
  for (const r of usersByRole) {
    roleBreakdown[r.role] = r._count.role;
  }

  const statusBreakdown = {};
  for (const s of bookingsByStatus) {
    statusBreakdown[s.status] = s._count.status;
  }

  return {
    totals: {
      users: totalUsers,
      trainers: totalTrainers,
      services: totalServices,
      galleryItems: totalGalleryItems,
      bookings: totalBookings,
      unreadMessages,
    },
    usersByRole: roleBreakdown,
    bookingsByStatus: statusBreakdown,
    trends: {
      newUsersThisWeek,
      newUsersThisMonth,
      newBookingsThisWeek,
      newBookingsThisMonth,
    },
  };
}

// ─── User Statistics ───────────────────────────────────────

async function getUserStats() {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const [
    total,
    active,
    inactive,
    verified,
    byRole,
    newThisWeek,
    newThisMonth,
    recentlyActive,
  ] = await Promise.all([
    databaseService.client.user.count(),
    databaseService.client.user.count({ where: { isActive: true } }),
    databaseService.client.user.count({ where: { isActive: false } }),
    databaseService.client.user.count({ where: { isVerified: true } }),
    databaseService.client.user.groupBy({
      by: ['role'],
      _count: { role: true },
    }),
    databaseService.client.user.count({
      where: { createdAt: { gte: sevenDaysAgo } },
    }),
    databaseService.client.user.count({
      where: { createdAt: { gte: thirtyDaysAgo } },
    }),
    databaseService.client.user.count({
      where: { lastLoginAt: { gte: sevenDaysAgo } },
    }),
  ]);

  const roleBreakdown = {};
  for (const r of byRole) {
    roleBreakdown[r.role] = r._count.role;
  }

  return {
    total,
    active,
    inactive,
    verified,
    byRole: roleBreakdown,
    newThisWeek,
    newThisMonth,
    recentlyActive,
  };
}

// ─── Trainer Statistics ────────────────────────────────────

async function getTrainerStats() {
  const [
    total,
    active,
    withServices,
    avgExperience,
    avgRating,
  ] = await Promise.all([
    databaseService.client.trainer.count(),
    databaseService.client.trainer.count({ where: { status: 'ACTIVE' } }),
    databaseService.client.trainer.count({
      where: { services: { some: {} } },
    }),
    databaseService.client.trainer.aggregate({
      _avg: { experience: true },
    }),
    databaseService.client.trainer.aggregate({
      _avg: { rating: true },
      where: { rating: { not: null } },
    }),
  ]);

  return {
    total,
    active,
    inactive: total - active,
    withServices,
    avgExperience: avgExperience._avg.experience
      ? Math.round(avgExperience._avg.experience)
      : 0,
    avgRating: avgRating._avg.rating
      ? Number(avgRating._avg.rating.toFixed(2))
      : 0,
  };
}

// ─── Booking Statistics ────────────────────────────────────

async function getBookingStats(query = {}) {
  const where = buildDateFilter(query);

  const [total, byStatus, byService] = await Promise.all([
    databaseService.client.booking.count({ where }),
    databaseService.client.booking.groupBy({
      by: ['status'],
      where,
      _count: { status: true },
    }),
    databaseService.client.booking.groupBy({
      by: ['serviceId'],
      where,
      _count: { serviceId: true },
      orderBy: { _count: { serviceId: 'desc' } },
      take: 10,
    }),
  ]);

  const statusBreakdown = {};
  for (const s of byStatus) {
    statusBreakdown[s.status] = s._count.status;
  }

  // Resolve service names for top services
  const serviceIds = byService.map((s) => s.serviceId).filter(Boolean);
  const services = serviceIds.length
    ? await databaseService.client.service.findMany({
        where: { id: { in: serviceIds } },
        select: { id: true, name: true },
      })
    : [];

  const serviceMap = {};
  for (const s of services) {
    serviceMap[s.id] = s.name;
  }

  const topServices = byService.map((s) => ({
    serviceId: s.serviceId,
    name: serviceMap[s.serviceId] || 'Unknown',
    count: s._count.serviceId,
  }));

  return {
    total,
    byStatus: statusBreakdown,
    topServices,
  };
}

// ─── Recent Bookings ──────────────────────────────────────

async function getRecentBookings(limit = 10) {
  const bookings = await databaseService.client.booking.findMany({
    take: Math.min(limit, 50),
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      service: {
        select: {
          id: true,
          name: true,
          price: true,
        },
      },
      trainer: {
        select: {
          id: true,
          user: {
            select: { firstName: true, lastName: true },
          },
        },
      },
    },
  });

  return bookings;
}

// ─── Revenue Summary ───────────────────────────────────────

async function getRevenue(query = {}) {
  const where = {
    status: { in: ['CONFIRMED', 'COMPLETED'] },
    serviceId: { not: null },
  };

  if (query.dateFrom || query.dateTo) {
    where.bookingDate = {};
    if (query.dateFrom) where.bookingDate.gte = new Date(query.dateFrom);
    if (query.dateTo) where.bookingDate.lte = new Date(query.dateTo);
  }

  const bookings = await databaseService.client.booking.findMany({
    where,
    include: {
      service: {
        select: { id: true, name: true, price: true },
      },
    },
  });

  let totalRevenue = 0;
  const revenueByService = {};
  const revenueByMonth = {};

  for (const booking of bookings) {
    const price = booking.service?.price ? Number(booking.service.price) : 0;
    totalRevenue += price;

    // By service
    const serviceKey = booking.serviceId || 'unknown';
    const serviceName = booking.service?.name || 'Unknown';
    if (!revenueByService[serviceKey]) {
      revenueByService[serviceKey] = { name: serviceName, revenue: 0, count: 0 };
    }
    revenueByService[serviceKey].revenue += price;
    revenueByService[serviceKey].count += 1;

    // By month
    const monthKey = booking.bookingDate.toISOString().slice(0, 7); // YYYY-MM
    if (!revenueByMonth[monthKey]) {
      revenueByMonth[monthKey] = { month: monthKey, revenue: 0, count: 0 };
    }
    revenueByMonth[monthKey].revenue += price;
    revenueByMonth[monthKey].count += 1;
  }

  const monthlyRevenue = Object.values(revenueByMonth).sort((a, b) =>
    a.month.localeCompare(b.month)
  );

  return {
    totalRevenue: Math.round(totalRevenue * 100) / 100,
    totalBookings: bookings.length,
    avgBookingValue:
      bookings.length > 0
        ? Math.round((totalRevenue / bookings.length) * 100) / 100
        : 0,
    byService: Object.values(revenueByService).sort((a, b) => b.revenue - a.revenue),
    monthly: monthlyRevenue,
  };
}

// ─── User Activity ─────────────────────────────────────────

async function getUserActivity(query = {}) {
  const { page, limit, offset } = extractPagination(query);

  const where = {};
  if (query.dateFrom || query.dateTo) {
    where.createdAt = {};
    if (query.dateFrom) where.createdAt.gte = new Date(query.dateFrom);
    if (query.dateTo) where.createdAt.lte = new Date(query.dateTo);
  }

  const [users, total] = await Promise.all([
    databaseService.client.user.findMany({
      where,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
      },
      skip: offset,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    databaseService.client.user.count({ where }),
  ]);

  return {
    data: users,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
}

// ─── Helpers ───────────────────────────────────────────────

function buildDateFilter(query) {
  const where = {};
  if (query.dateFrom || query.dateTo) {
    where.createdAt = {};
    if (query.dateFrom) where.createdAt.gte = new Date(query.dateFrom);
    if (query.dateTo) where.createdAt.lte = new Date(query.dateTo);
  }
  return where;
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
