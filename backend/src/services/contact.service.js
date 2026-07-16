const databaseService = require('./databaseService');
const { NotFoundError } = require('../errors');
const { extractPagination } = require('../utils/pagination');
const logger = require('../utils/logger');

// ─── Contact Service ────────────────────────────────────────
// Manages contact form submissions (ContactMessage) and
// contact information (stored as CmsSection type=CONTACT).
//
// Public: submit contact messages.
// Admin: list, read, mark as read, delete messages.
// ───────────────────────────────────────────────────────────

// ─── Contact Messages ──────────────────────────────────────

async function createMessage(data) {
  const message = await databaseService.client.contactMessage.create({
    data: {
      name: data.name,
      email: data.email.toLowerCase(),
      phone: data.phone || null,
      subject: data.subject || null,
      message: data.message,
      userId: data.userId || null,
    },
  });

  logger.info('Contact message created', { messageId: message.id, email: message.email });
  return message;
}

async function getMessages(query = {}) {
  const { page, limit, offset } = extractPagination(query);
  const where = {};

  if (query.isRead !== undefined) where.isRead = query.isRead === 'true';
  if (query.search) {
    where.OR = [
      { name: { contains: query.search } },
      { email: { contains: query.search } },
      { subject: { contains: query.search } },
    ];
  }

  const [messages, total] = await Promise.all([
    databaseService.client.contactMessage.findMany({
      where,
      skip: offset,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    databaseService.client.contactMessage.count({ where }),
  ]);

  return {
    data: messages,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
}

async function getMessageById(id) {
  const message = await databaseService.client.contactMessage.findUnique({
    where: { id },
  });

  if (!message) {
    throw new NotFoundError('Contact message not found');
  }

  return message;
}

async function markAsRead(id) {
  await getMessageById(id);

  const message = await databaseService.client.contactMessage.update({
    where: { id },
    data: { isRead: true },
  });

  logger.info('Contact message marked as read', { messageId: id });
  return message;
}

async function markAllAsRead() {
  await databaseService.client.contactMessage.updateMany({
    where: { isRead: false },
    data: { isRead: true },
  });

  logger.info('All contact messages marked as read');
}

async function removeMessage(id) {
  await getMessageById(id);

  await databaseService.client.contactMessage.delete({ where: { id } });
  logger.info('Contact message deleted', { messageId: id });
}

async function getUnreadCount() {
  const count = await databaseService.client.contactMessage.count({
    where: { isRead: false },
  });
  return count;
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
