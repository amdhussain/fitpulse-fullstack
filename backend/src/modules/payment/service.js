const PaymentRepository = require('./repository');
const { NotFoundError, BadRequestError, ForbiddenError, ConflictError } = require('../../errors');
const logger = require('../../utils/logger');

// ─── Member APIs ──────────────────────────────────────────

async function getMyPayments(userId, { page, limit, search, status, sortBy, sortOrder }) {
  const offset = (page - 1) * limit;

  const where = {};

  if (status) {
    where.status = status;
  }

  if (search) {
    where.OR = [
      { transactionId: { contains: search } },
      { invoiceNumber: { contains: search } },
      { notes: { contains: search } },
    ];
  }

  const { payments, total } = await PaymentRepository.findByUserId(userId, {
    where,
    page,
    limit,
    offset,
    sortBy,
    sortOrder,
  });

  return {
    data: payments,
    total,
    page,
    limit,
  };
}

async function getPaymentDetails(userId, paymentId) {
  const payment = await PaymentRepository.findById(paymentId);

  if (!payment) {
    throw new NotFoundError('Payment not found');
  }

  if (payment.userId !== userId) {
    throw new ForbiddenError('You can only view your own payments');
  }

  return payment;
}

// ─── Admin APIs ───────────────────────────────────────────

async function getAllPayments({ page, limit, search, status, userId, bookingId, sortBy, sortOrder }) {
  const offset = (page - 1) * limit;

  const where = {};

  if (status) {
    where.status = status;
  }

  if (userId) {
    where.userId = userId;
  }

  if (bookingId) {
    where.bookingId = bookingId;
  }

  if (search) {
    where.OR = [
      { user: { firstName: { contains: search } } },
      { user: { lastName: { contains: search } } },
      { user: { email: { contains: search } } },
      { transactionId: { contains: search } },
      { invoiceNumber: { contains: search } },
      { notes: { contains: search } },
    ];
  }

  const { payments, total } = await PaymentRepository.findMany({
    where,
    page,
    limit,
    offset,
    sortBy,
    sortOrder,
  });

  return {
    data: payments,
    total,
    page,
    limit,
  };
}

async function getPaymentById(paymentId) {
  const payment = await PaymentRepository.findById(paymentId);

  if (!payment) {
    throw new NotFoundError('Payment not found');
  }

  return payment;
}

async function createPayment({ bookingId, userId, amount, currency, paymentMethod, notes }) {
  const booking = await PaymentRepository.findBookingById(bookingId);

  if (!booking) {
    throw new NotFoundError('Booking not found');
  }

  if (booking.userId !== userId) {
    throw new ForbiddenError('Booking does not belong to this user');
  }

  const existingPayment = await PaymentRepository.findByBookingId(bookingId);

  if (existingPayment && existingPayment.status !== 'FAILED') {
    throw new ConflictError('A payment already exists for this booking');
  }

  const transactionId = await PaymentRepository.generateTransactionId();
  const invoiceNumber = await PaymentRepository.generateInvoiceNumber();

  const payment = await PaymentRepository.create({
    bookingId,
    userId,
    amount: parseFloat(amount),
    currency: currency || 'USD',
    status: 'PENDING',
    paymentMethod: paymentMethod || null,
    transactionId,
    invoiceNumber,
    notes: notes || null,
  });

  logger.info('Payment created', { paymentId: payment.id, bookingId, userId });

  return payment;
}

async function updatePaymentStatus(paymentId, status) {
  const payment = await PaymentRepository.findByIdBasic(paymentId);

  if (!payment) {
    throw new NotFoundError('Payment not found');
  }

  if (payment.status === status) {
    throw new ConflictError(`Payment is already ${status}`);
  }

  const validTransitions = {
    PENDING: ['PAID', 'FAILED'],
    PAID: ['REFUNDED'],
    FAILED: ['PENDING'],
    REFUNDED: [],
  };

  if (!validTransitions[payment.status].includes(status)) {
    throw new BadRequestError(
      `Cannot transition payment from ${payment.status} to ${status}`
    );
  }

  const updated = await PaymentRepository.update(paymentId, { status });

  logger.info('Payment status updated', { paymentId, newStatus: status });

  return updated;
}

async function processPayment(paymentId) {
  const payment = await PaymentRepository.findByIdBasic(paymentId);

  if (!payment) {
    throw new NotFoundError('Payment not found');
  }

  if (payment.status !== 'PENDING') {
    throw new BadRequestError('Only pending payments can be processed');
  }

  const updated = await PaymentRepository.update(paymentId, {
    status: 'PAID',
  });

  logger.info('Payment processed', { paymentId });

  return updated;
}

async function refundPayment(paymentId) {
  const payment = await PaymentRepository.findByIdBasic(paymentId);

  if (!payment) {
    throw new NotFoundError('Payment not found');
  }

  if (payment.status !== 'PAID') {
    throw new BadRequestError('Only paid payments can be refunded');
  }

  const updated = await PaymentRepository.update(paymentId, {
    status: 'REFUNDED',
  });

  logger.info('Payment refunded', { paymentId });

  return updated;
}

async function deletePayment(paymentId) {
  const payment = await PaymentRepository.findByIdBasic(paymentId);

  if (!payment) {
    throw new NotFoundError('Payment not found');
  }

  if (payment.status === 'PAID') {
    throw new BadRequestError('Cannot delete a paid payment. Refund it first.');
  }

  await PaymentRepository.delete(paymentId);

  logger.info('Payment deleted', { paymentId });

  return { message: 'Payment deleted successfully' };
}

async function getRevenueStats({ startDate, endDate }) {
  const stats = await PaymentRepository.getRevenueStats({ startDate, endDate });
  return stats;
}

async function getRevenueByMethod({ startDate, endDate }) {
  const breakdown = await PaymentRepository.getRevenueByMethod({ startDate, endDate });
  return breakdown;
}

async function getDailyRevenue({ startDate, endDate }) {
  const daily = await PaymentRepository.getDailyRevenue({ startDate, endDate });
  return daily;
}

module.exports = {
  getMyPayments,
  getPaymentDetails,
  getAllPayments,
  getPaymentById,
  createPayment,
  updatePaymentStatus,
  processPayment,
  refundPayment,
  deletePayment,
  getRevenueStats,
  getRevenueByMethod,
  getDailyRevenue,
};
