const { ObjectId } = require('mongodb');
const { NotFoundError } = require('../errors');
const databaseService = require('./databaseService');
const { extractPagination } = require('../utils/pagination');
const logger = require('../utils/logger');

async function createMessage(data) {
  const now = new Date();
  const insertData = {
    name: data.name,
    email: data.email,
    phone: data.phone || null,
    subject: data.subject || null,
    message: data.message,
    userId: data.userId ? new ObjectId(data.userId) : null,
    isRead: false,
    createdAt: now,
    updatedAt: now,
  };
  const result = await databaseService.client.contactMessages.insertOne(insertData);
  const doc = await databaseService.client.contactMessages.findOne({ _id: result.insertedId });
  const message = databaseService.formatDoc(doc);
  logger.info('Contact message created', { messageId: message.id, email: message.email });
  return message;
}

async function getMessages(query = {}) {
  const { page, limit, offset } = extractPagination(query);
  const match = {};
  if (query.isRead !== undefined) match.isRead = query.isRead === true || query.isRead === 'true';

  if (query.search) {
    match.$or = [
      { name: { $regex: query.search, $options: 'i' } },
      { email: { $regex: query.search, $options: 'i' } },
      { subject: { $regex: query.search, $options: 'i' } },
    ];
  }

  const total = await databaseService.client.contactMessages.countDocuments(match);
  const sort = {};
  if (query.sortBy) sort[query.sortBy] = query.sortOrder === 'DESC' ? -1 : 1;
  else sort.createdAt = -1;

  const docs = await databaseService.client.contactMessages
    .find(match).sort(sort).skip(offset).limit(limit).toArray();

  return {
    data: databaseService.formatDocs(docs),
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
}

async function getMessageById(id) {
  const doc = await databaseService.client.contactMessages.findOne({ _id: new ObjectId(id) });
  const message = databaseService.formatDoc(doc);
  if (!message) throw new NotFoundError('Contact message not found');
  return message;
}

async function markAsRead(id) {
  await getMessageById(id);
  await databaseService.client.contactMessages.updateOne(
    { _id: new ObjectId(id) },
    { $set: { isRead: true, updatedAt: new Date() } }
  );
  const doc = await databaseService.client.contactMessages.findOne({ _id: new ObjectId(id) });
  const message = databaseService.formatDoc(doc);
  logger.info('Contact message marked as read', { messageId: id });
  return message;
}

async function markAllAsRead() {
  await databaseService.client.contactMessages.updateMany(
    { isRead: false },
    { $set: { isRead: true, updatedAt: new Date() } }
  );
  logger.info('All contact messages marked as read');
}

async function removeMessage(id) {
  await getMessageById(id);
  await databaseService.client.contactMessages.deleteOne({ _id: new ObjectId(id) });
  logger.info('Contact message deleted', { messageId: id });
}

async function getUnreadCount() {
  return databaseService.client.contactMessages.countDocuments({ isRead: false });
}

module.exports = {
  createMessage,
  getMessages,
  getMessageById,
  markAsRead,
  markAllAsRead,
  removeMessage,
  getUnreadCount,
};
