const PaymentMethodRepository = require('./repository');
const { NotFoundError, ConflictError } = require('../../errors');
const logger = require('../../utils/logger');

async function getAllPaymentMethods({ page, limit, search, type, isActive, sortBy, sortOrder }) {
  const where = {};
  if (type) where.type = type;
  if (isActive !== undefined && isActive !== '') where.isActive = isActive === 'true' || isActive === true;
  if (search) where.name = { $regex: search };

  const { paymentMethods, total } = await PaymentMethodRepository.findAll({
    where,
    page: parseInt(page, 10) || 1,
    limit: parseInt(limit, 10) || 50,
    sortBy: sortBy || 'sortOrder',
    sortOrder: sortOrder || 'ASC',
  });

  return { data: paymentMethods, total, page: parseInt(page, 10) || 1, limit: parseInt(limit, 10) || 50 };
}

async function getPaymentMethodById(id) {
  const method = await PaymentMethodRepository.findById(id);
  if (!method) throw new NotFoundError('Payment method not found');
  return method;
}

async function createPaymentMethod({ name, nameBn, type, description, icon, isActive, sortOrder }) {
  const maxOrder = sortOrder !== undefined ? sortOrder : await PaymentMethodRepository.getMaxSortOrder();
  const method = await PaymentMethodRepository.create({
    name,
    nameBn,
    type,
    description,
    icon,
    isActive,
    sortOrder: maxOrder,
  });
  logger.info('Payment method created', { methodId: method.id, name });
  return method;
}

async function updatePaymentMethod(id, data) {
  const existing = await PaymentMethodRepository.findById(id);
  if (!existing) throw new NotFoundError('Payment method not found');
  const updated = await PaymentMethodRepository.update(id, data);
  logger.info('Payment method updated', { methodId: id });
  return updated;
}

async function deletePaymentMethod(id) {
  const existing = await PaymentMethodRepository.findById(id);
  if (!existing) throw new NotFoundError('Payment method not found');
  await PaymentMethodRepository.delete(id);
  logger.info('Payment method deleted', { methodId: id });
  return { message: 'Payment method deleted successfully' };
}

async function getPaymentMethodStats() {
  const total = await PaymentMethodRepository.findAll({ limit: 1000 });
  const active = await PaymentMethodRepository.countActive();
  const byType = await PaymentMethodRepository.countByType();
  return {
    total: total.total,
    active,
    inactive: total.total - active,
    byType,
  };
}

module.exports = {
  getAllPaymentMethods,
  getPaymentMethodById,
  createPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
  getPaymentMethodStats,
};
