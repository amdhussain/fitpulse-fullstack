const DashboardRepository = require('./repository');
const logger = require('../../utils/logger');

// ─── Dashboard Statistics ────────────────────────────────

async function getOverviewStats() {
  const stats = await DashboardRepository.getOverviewStats();
  return stats;
}

// ─── Analytics ───────────────────────────────────────────

async function getMonthlyBookings({ startDate, endDate, months }) {
  const data = await DashboardRepository.getMonthlyBookings({ startDate, endDate, months });
  return data;
}

async function getMonthlyRevenue({ startDate, endDate, months }) {
  const data = await DashboardRepository.getMonthlyRevenue({ startDate, endDate, months });
  return data;
}

async function getClassPopularity({ startDate, endDate, limit }) {
  const data = await DashboardRepository.getClassPopularity({ startDate, endDate, limit });
  return data;
}

async function getTrainerPerformance({ startDate, endDate, limit }) {
  const data = await DashboardRepository.getTrainerPerformance({ startDate, endDate, limit });
  return data;
}

async function getRecentRegistrations({ limit }) {
  const data = await DashboardRepository.getRecentRegistrations({ limit });
  return data;
}

async function getRecentBookings({ limit }) {
  const data = await DashboardRepository.getRecentBookings({ limit });
  return data;
}

// ─── Admin Dashboard ─────────────────────────────────────

async function getLatestUsers({ limit }) {
  const data = await DashboardRepository.getLatestUsers({ limit });
  return data;
}

async function getLatestTrainers({ limit }) {
  const data = await DashboardRepository.getLatestTrainers({ limit });
  return data;
}

async function getLatestBookings({ limit }) {
  const data = await DashboardRepository.getLatestBookings({ limit });
  return data;
}

async function getSystemOverview() {
  const data = await DashboardRepository.getSystemOverview();
  return data;
}

async function getRevenueSummary({ startDate, endDate }) {
  const data = await DashboardRepository.getRevenueSummary({ startDate, endDate });
  return data;
}

async function getBookingSummary({ startDate, endDate }) {
  const data = await DashboardRepository.getBookingSummary({ startDate, endDate });
  return data;
}

async function getBookingStatusBreakdown({ startDate, endDate }) {
  const data = await DashboardRepository.getBookingStatusBreakdown({ startDate, endDate });
  return data;
}

async function getTopClassesByBookings({ limit, startDate, endDate }) {
  const data = await DashboardRepository.getTopClassesByBookings({ limit, startDate, endDate });
  return data;
}

async function getTopTrainersByBookings({ limit, startDate, endDate }) {
  const data = await DashboardRepository.getTopTrainersByBookings({ limit, startDate, endDate });
  return data;
}

module.exports = {
  getOverviewStats,
  getMonthlyBookings,
  getMonthlyRevenue,
  getClassPopularity,
  getTrainerPerformance,
  getRecentRegistrations,
  getRecentBookings,
  getLatestUsers,
  getLatestTrainers,
  getLatestBookings,
  getSystemOverview,
  getRevenueSummary,
  getBookingSummary,
  getBookingStatusBreakdown,
  getTopClassesByBookings,
  getTopTrainersByBookings,
};
