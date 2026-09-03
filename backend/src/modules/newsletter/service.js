const NewsletterRepository = require('./repository');
const { NotFoundError, ConflictError, BadRequestError } = require('../../errors');
const logger = require('../../utils/logger');

async function getAllSubscribers({ page, limit, search, status, sortBy, sortOrder }) {
  const offset = (page - 1) * limit;
  const where = {};

  if (status) where.status = status;

  if (search) {
    where.$or = [
      { email: { $regex: search } },
      { name: { $regex: search } },
    ];
  }

  const { subscribers, total } = await NewsletterRepository.findMany({
    where, page, limit, offset, sortBy, sortOrder,
  });

  return { data: subscribers, total, page, limit };
}

async function getSubscriberById(id) {
  const subscriber = await NewsletterRepository.findById(id);
  if (!subscriber) throw new NotFoundError('Subscriber not found');
  return subscriber;
}

async function addSubscriber({ email, name, source }) {
  const existing = await NewsletterRepository.findByEmail(email);
  if (existing) {
    if (existing.status === 'ACTIVE') {
      throw new ConflictError('Email is already subscribed');
    }
    return NewsletterRepository.update(existing.id, { status: 'ACTIVE', name: name || existing.name });
  }
  return NewsletterRepository.create({ email, name, source });
}

async function updateSubscriber(id, data) {
  const subscriber = await NewsletterRepository.findById(id);
  if (!subscriber) throw new NotFoundError('Subscriber not found');

  if (data.email && data.email !== subscriber.email) {
    const existing = await NewsletterRepository.findByEmail(data.email);
    if (existing) throw new ConflictError('Email is already in use');
  }

  return NewsletterRepository.update(id, data);
}

async function toggleStatus(id) {
  const subscriber = await NewsletterRepository.findById(id);
  if (!subscriber) throw new NotFoundError('Subscriber not found');

  const newStatus = subscriber.status === 'ACTIVE' ? 'UNSUBSCRIBED' : 'ACTIVE';
  return NewsletterRepository.update(id, { status: newStatus });
}

async function deleteSubscriber(id) {
  const subscriber = await NewsletterRepository.findById(id);
  if (!subscriber) throw new NotFoundError('Subscriber not found');

  await NewsletterRepository.delete(id);
  logger.info('Newsletter subscriber deleted', { id, email: subscriber.email });
  return { message: 'Subscriber deleted successfully' };
}

async function getStats() {
  const counts = await NewsletterRepository.countByStatus();
  return {
    total: counts.ACTIVE + counts.UNSUBSCRIBED,
    active: counts.ACTIVE,
    unsubscribed: counts.UNSUBSCRIBED,
  };
}

module.exports = {
  getAllSubscribers,
  getSubscriberById,
  addSubscriber,
  updateSubscriber,
  toggleStatus,
  deleteSubscriber,
  getStats,
};
