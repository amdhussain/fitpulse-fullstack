const databaseService = require('../../services/databaseService');

const PAYMENT_SELECT = {
  id: true,
  bookingId: true,
  userId: true,
  amount: true,
  currency: true,
  status: true,
  paymentMethod: true,
  transactionId: true,
  invoiceNumber: true,
  notes: true,
  metadata: true,
  createdAt: true,
  updatedAt: true,
};

const USER_SELECT = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  phone: true,
};

const BOOKING_SELECT = {
  id: true,
  userId: true,
  classId: true,
  serviceId: true,
  trainerId: true,
  bookingDate: true,
  bookingTime: true,
  status: true,
};

const PaymentRepository = {
  async findById(id) {
    return databaseService.client.payment.findUnique({
      where: { id },
      select: {
        ...PAYMENT_SELECT,
        user: { select: USER_SELECT },
        booking: { select: BOOKING_SELECT },
      },
    });
  },

  async findByIdBasic(id) {
    return databaseService.client.payment.findUnique({
      where: { id },
      select: PAYMENT_SELECT,
    });
  },

  async create(data) {
    return databaseService.client.payment.create({
      data,
      select: {
        ...PAYMENT_SELECT,
        user: { select: USER_SELECT },
        booking: { select: BOOKING_SELECT },
      },
    });
  },

  async update(id, data) {
    return databaseService.client.payment.update({
      where: { id },
      data,
      select: {
        ...PAYMENT_SELECT,
        user: { select: USER_SELECT },
        booking: { select: BOOKING_SELECT },
      },
    });
  },

  async delete(id) {
    return databaseService.client.payment.delete({
      where: { id },
    });
  },

  async findByUserId(userId, { where, page, limit, offset, sortBy, sortOrder }) {
    const combinedWhere = { ...where, userId };

    const allowedSortFields = ['createdAt', 'amount', 'status'];
    const orderField = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const orderDirection = sortOrder === 'ASC' ? 'asc' : 'desc';

    const [payments, total] = await Promise.all([
      databaseService.client.payment.findMany({
        where: combinedWhere,
        select: {
          ...PAYMENT_SELECT,
          booking: { select: BOOKING_SELECT },
        },
        skip: offset,
        take: limit,
        orderBy: { [orderField]: orderDirection },
      }),
      databaseService.client.payment.count({ where: combinedWhere }),
    ]);

    return { payments, total };
  },

  async findMany({ where, page, limit, offset, sortBy, sortOrder }) {
    const allowedSortFields = ['createdAt', 'amount', 'status', 'userId'];
    const orderField = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const orderDirection = sortOrder === 'ASC' ? 'asc' : 'desc';

    const [payments, total] = await Promise.all([
      databaseService.client.payment.findMany({
        where,
        select: {
          ...PAYMENT_SELECT,
          user: { select: USER_SELECT },
          booking: { select: BOOKING_SELECT },
        },
        skip: offset,
        take: limit,
        orderBy: { [orderField]: orderDirection },
      }),
      databaseService.client.payment.count({ where }),
    ]);

    return { payments, total };
  },

  async findByBookingId(bookingId) {
    return databaseService.client.payment.findFirst({
      where: { bookingId },
      select: PAYMENT_SELECT,
    });
  },

  async findBookingById(id) {
    return databaseService.client.booking.findUnique({
      where: { id },
      select: {
        id: true,
        userId: true,
        classId: true,
        serviceId: true,
        status: true,
        class: { select: { id: true, name: true, price: true } },
        service: { select: { id: true, name: true, price: true } },
      },
    });
  },

  async getRevenueStats({ startDate, endDate }) {
    const where = {
      status: 'PAID',
    };

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    const [result] = await databaseService.client.payment.aggregate({
      where,
      _sum: { amount: true },
      _count: true,
    });

    return {
      totalRevenue: result._sum.amount || 0,
      totalTransactions: result._count,
    };
  },

  async getRevenueByMethod({ startDate, endDate }) {
    const where = {
      status: 'PAID',
    };

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    const results = await databaseService.client.payment.groupBy({
      by: ['paymentMethod'],
      where,
      _sum: { amount: true },
      _count: true,
    });

    return results.map((r) => ({
      paymentMethod: r.paymentMethod || 'Unknown',
      totalAmount: r._sum.amount || 0,
      count: r._count,
    }));
  },

  async getDailyRevenue({ startDate, endDate }) {
    const where = {
      status: 'PAID',
    };

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    const payments = await databaseService.client.payment.findMany({
      where,
      select: {
        amount: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    const dailyMap = {};
    for (const p of payments) {
      const day = p.createdAt.toISOString().split('T')[0];
      if (!dailyMap[day]) {
        dailyMap[day] = { date: day, totalAmount: 0, count: 0 };
      }
      dailyMap[day].totalAmount = Number(dailyMap[day].totalAmount) + Number(p.amount);
      dailyMap[day].count += 1;
    }

    return Object.values(dailyMap);
  },

  async generateInvoiceNumber() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');

    const count = await databaseService.client.payment.count({
      where: {
        createdAt: {
          gte: new Date(year, now.getMonth(), 1),
          lt: new Date(year, now.getMonth() + 1, 1),
        },
      },
    });

    const seq = String(count + 1).padStart(4, '0');
    return `INV-${year}${month}-${seq}`;
  },

  async generateTransactionId() {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `TXN-${timestamp}-${random}`;
  },
};

module.exports = PaymentRepository;
