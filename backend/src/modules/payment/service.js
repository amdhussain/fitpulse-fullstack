const PaymentRepository = require('./repository');
const notificationService = require('../../services/notificationService');
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

async function createPayment({ bookingId, userId, amount, currency, paymentMethod, notes, transactionId, month }) {
  if (bookingId) {
    const existingPayment = await PaymentRepository.findByBookingId(bookingId);
    if (existingPayment) {
      return PaymentRepository.update(existingPayment.id, {
        paymentMethod: paymentMethod || existingPayment.paymentMethod,
        transactionId: transactionId || existingPayment.transactionId,
        notes: notes || existingPayment.notes,
        amount: amount || existingPayment.amount,
        currency: currency || existingPayment.currency,
        month: month || existingPayment.month,
        status: 'PENDING',
      });
    }
  }

  const transactionIdGen = transactionId || await PaymentRepository.generateTransactionId();
  const invoiceNumber = await PaymentRepository.generateInvoiceNumber();

  const payment = await PaymentRepository.create({
    bookingId: bookingId || null,
    userId,
    amount: parseFloat(amount) || 0,
    currency: currency || 'BDT',
    status: 'PENDING',
    paymentMethod: paymentMethod || null,
    transactionId: transactionIdGen,
    invoiceNumber,
    month: month || null,
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
    PENDING: ['PAID', 'FAILED', 'PENDING'],
    PAID: ['REFUNDED'],
    FAILED: ['PENDING', 'FAILED'],
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

  notificationService.paymentCompleted(paymentId, `User ${payment.userId}`, `$${payment.amount}`, 'plan', payment.userId).catch(() => {});

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

  await PaymentRepository.delete(paymentId);

  logger.info('Payment deleted', { paymentId });

  return { message: 'Payment deleted successfully' };
}

async function updatePaymentDetails(paymentId, data) {
  const payment = await PaymentRepository.findByIdBasic(paymentId);

  if (!payment) {
    throw new NotFoundError('Payment not found');
  }

  const updateFields = {};
  if (data.amount !== undefined) updateFields.amount = parseFloat(data.amount);
  if (data.status !== undefined) updateFields.status = data.status;
  if (data.currency !== undefined) updateFields.currency = data.currency;
  if (data.paymentMethod !== undefined) updateFields.paymentMethod = data.paymentMethod;
  if (data.notes !== undefined) updateFields.notes = data.notes;
  if (data.transactionId !== undefined) updateFields.transactionId = data.transactionId;
  if (data.month !== undefined) updateFields.month = data.month;
  if (data.bookingId !== undefined) updateFields.bookingId = data.bookingId || null;

  const updated = await PaymentRepository.update(paymentId, updateFields);

  logger.info('Payment updated', { paymentId, fields: Object.keys(updateFields) });

  return updated;
}

async function getReceipt(paymentId) {
  const receipt = await PaymentRepository.getReceiptData(paymentId);

  if (!receipt) {
    throw new NotFoundError('Payment not found');
  }

  return {
    receiptNumber: receipt.invoiceNumber || receipt.id,
    transactionId: receipt.transactionId,
    date: receipt.createdAt,
    status: receipt.status,
    amount: receipt.amount,
    currency: receipt.currency,
    paymentMethod: receipt.paymentMethod,
    month: receipt.month,
    notes: receipt.notes,
    member: receipt.user ? {
      name: `${receipt.user.firstName || ''} ${receipt.user.lastName || ''}`.trim(),
      email: receipt.user.email,
      phone: receipt.user.phone,
    } : null,
    booking: receipt.booking ? {
      id: receipt.booking.id,
      date: receipt.booking.bookingDate,
      time: receipt.booking.bookingTime,
      status: receipt.booking.status,
    } : null,
    className: receipt.class ? receipt.class.name : null,
  };
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

async function findByBookingId(bookingId) {
  return PaymentRepository.findByBookingId(bookingId);
}

async function updatePayment(id, data) {
  return PaymentRepository.update(id, data);
}

module.exports = {
  getMyPayments,
  getPaymentDetails,
  getAllPayments,
  getPaymentById,
  createPayment,
  updatePaymentStatus,
  updatePaymentDetails,
  processPayment,
  refundPayment,
  deletePayment,
  getReceipt,
  getRevenueStats,
  getRevenueByMethod,
  getDailyRevenue,
  findByBookingId,
  updatePayment,
};
