const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');
const env = require('../env');

// ─── Prisma Client Singleton ──────────────────────────────
// This module creates a single PrismaClient instance that is
// reused across the entire application.
//
// Prisma 7 requires a driver adapter for MySQL connections.
// The @prisma/adapter-mariadb adapter is used (works with MySQL too).
//
// In development, the client is cached on `globalThis` to
// prevent multiple instances during hot module reloading
// (e.g., when using nodemon).
//
// Future modules must NOT create their own Prisma instance.
// Import this client instead:
//
//   const { prisma } = require('../../config/database');
//   // or
//   const { db } = require('../../config/database');
//
// ───────────────────────────────────────────────────────────

function createPrismaClient() {
  // Parse DATABASE_URL to extract connection parameters
  // Format: mysql://USER:PASSWORD@HOST:PORT/DATABASE
  const dbUrl = new URL(env.database.url);

  const adapter = new PrismaMariaDb({
    host: dbUrl.hostname,
    port: parseInt(dbUrl.port, 10) || 3306,
    user: dbUrl.username,
    password: dbUrl.password,
    database: dbUrl.pathname.replace(/^\//, ''),
    connectionLimit: 5,
  });

  return new PrismaClient({
    adapter,
    log: env.isDevelopment
      ? ['error', 'warn']
      : ['error'],
  });
}

// Prevent multiple Prisma Client instances in development
const globalForPrisma = globalThis;

const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (env.isDevelopment) {
  globalForPrisma.prisma = prisma;
}

module.exports = prisma;
