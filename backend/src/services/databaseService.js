const { MongoClient, ObjectId } = require('mongodb');
const env = require('../config/env');
const logger = require('../utils/logger');

const DATABASE_NAME = env.database.name || 'fitpulse_db';

let client = null;
let db = null;

const COLLECTIONS = [
  'users',
  'trainers',
  'classes',
  'bookings',
  'payments',
  'services',
  'cmsSections',
  'gallery',
  'siteSettings',
  'contactMessages',
];

function formatDoc(doc) {
  if (!doc) return null;
  const { _id, ...rest } = doc;
  return { ...rest, id: _id.toString() };
}

function formatDocs(docs) {
  if (!Array.isArray(docs)) return [];
  return docs.map(formatDoc);
}

function toObjectId(id) {
  if (id instanceof ObjectId) return id;
  if (typeof id === 'string') return new ObjectId(id);
  return null;
}

const collections = {};

const databaseService = {
  client: {},

  async connect() {
    if (db) return true;
    try {
      const uri = env.database.url;
      client = new MongoClient(uri);
      await client.connect();
      db = client.db(DATABASE_NAME);

      for (const name of COLLECTIONS) {
        collections[name] = db.collection(name);
      }

      databaseService.client = collections;

      logger.info('MongoDB connected successfully', { database: db.databaseName });
      return true;
    } catch (error) {
      logger.error('MongoDB connection failed', { error: error.message });
      throw error;
    }
  },

  async disconnect() {
    try {
      if (client) {
        await client.close();
        client = null;
        db = null;
        logger.info('MongoDB disconnected');
      }
      return true;
    } catch (error) {
      logger.error('MongoDB disconnect failed', { error: error.message });
      return false;
    }
  },

  async healthCheck() {
    const start = Date.now();
    try {
      await db.command({ ping: 1 });
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

  async transaction(callback) {
    const session = client.startSession();
    try {
      session.startTransaction();
      const result = await callback(session);
      await session.commitTransaction();
      return result;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  },

  async raw(operation) {
    return db.command(operation);
  },

  get mongoClient() {
    return client;
  },

  get db() {
    return db;
  },

  formatDoc,
  formatDocs,
  toObjectId,
  collections,
};

module.exports = databaseService;
