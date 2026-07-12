const { prisma } = require('../config/database');
const logger = require('../utils/logger');

// ─── Database Service ─────────────────────────────────────
// Centralized database service that wraps Prisma Client.
//
// All modules (Users, Trainers, Classes, Bookings, Payments,
// Community, CMS, Settings, Dashboard) must use this service
// to interact with the database.
//
// Usage:
//   const databaseService = require('../services/databaseService');
//   const user = await databaseService.client.user.findMany();
//
// Or via the barrel export:
//   const { databaseService } = require('../services');
//   const user = await databaseService.client.user.findMany();
//
// ─── Adding New Models ─────────────────────────────────────
// When a new model is added to schema.prisma and migrated,
// it becomes available via databaseService.client.<modelName>.
//
// Example:
//   // After adding User model to schema.prisma:
//   const users = await databaseService.client.user.findMany();
//   const user  = await databaseService.client.user.findUnique({ where: { id } });
//   const created = await databaseService.client.user.create({ data: { ... } });
//
// ───────────────────────────────────────────────────────────

const databaseService = {
  // ─── Prisma Client Reference ──────────────────────────
  // Direct access to the Prisma Client for all model operations.
  // Once models are defined in schema.prisma and migrated,
  // each model is available as: databaseService.client.<modelName>
  //
  // Example (after User model exists):
  //   databaseService.client.user.findMany()
  //   databaseService.client.user.findUnique({ where: { id } })
  //   databaseService.client.user.create({ data: { email, name } })
  //   databaseService.client.user.update({ where: { id }, data: { name } })
  //   databaseService.client.user.delete({ where: { id } })
  client: prisma,

  // ─── Connection Management ─────────────────────────────

  /**
   * Test the database connection.
   * @returns {Promise<boolean>} true if connected successfully
   */
  async connect() {
    try {
      await prisma.$connect();
      logger.info('Database connected successfully');
      return true;
    } catch (error) {
      logger.error('Failed to connect to database', { error: error.message });
      throw error;
    }
  },

  /**
   * Disconnect from the database.
   * Called during graceful shutdown.
   */
  async disconnect() {
    try {
      await prisma.$disconnect();
      logger.info('Database disconnected successfully');
      return true;
    } catch (error) {
      logger.error('Failed to disconnect from database', { error: error.message });
      throw error;
    }
  },

  /**
   * Check database health.
   * @returns {Promise<Object>} health status with latency
   */
  async healthCheck() {
    const start = Date.now();
    try {
      await prisma.$queryRaw`SELECT 1`;
      const latency = Date.now() - start;
      return {
        status: 'healthy',
        latency: `${latency}ms`,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  },

  // ─── Transaction Wrapper ───────────────────────────────

  /**
   * Execute a callback within a database transaction.
   * The transaction is automatically committed or rolled back.
   *
   * @param {Function} callback - Async function receiving the Prisma client
   * @param {Object} options - Transaction options (timeout, maxWait)
   * @returns {Promise<*>} The return value of the callback
   *
   * @example
   *   const result = await databaseService.transaction(async (tx) => {
   *     const user = await tx.user.create({ data: { name: 'John' } });
   *     const booking = await tx.booking.create({ data: { userId: user.id } });
   *     return { user, booking };
   *   });
   */
  async transaction(callback, options = {}) {
    const { timeout = 10000, maxWait = 5000 } = options;
    return prisma.$transaction(callback, { timeout, maxWait });
  },

  // ─── Raw Query Support ────────────────────────────────

  /**
   * Execute a raw SQL query.
   * Use sparingly - prefer Prisma's query builder when possible.
   *
   * @param {string} query - Raw SQL query
   * @param {Array} params - Query parameters
   * @returns {Promise<*>} Query result
   */
  async raw(query, ...params) {
    return prisma.$queryRawUnsafe(query, ...params);
  },
};

module.exports = databaseService;
