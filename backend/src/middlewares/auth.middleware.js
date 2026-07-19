const { UnauthorizedError } = require('../errors');
const asyncHandler = require('./asyncHandler');
const databaseService = require('../services/databaseService');
const logger = require('../utils/logger');

const protect = asyncHandler(async (req, res, next) => {
  let token = null;

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token && req.cookies) {
    const cookieNames = Object.keys(req.cookies);
    for (const name of cookieNames) {
      if (name.includes('session') || name === 'token') {
        token = req.cookies[name];
        break;
      }
    }
  }

  if (!token) {
    throw new UnauthorizedError('You are not logged in. Please log in to access this resource.');
  }

  let sessionUser;
  try {
    const db = databaseService.db;

    const sessionDoc = await db.collection('session').findOne({ token });

    if (!sessionDoc) {
      throw new UnauthorizedError('Invalid or expired session. Please log in again.');
    }

    if (sessionDoc.expiresAt && new Date(sessionDoc.expiresAt) < new Date()) {
      throw new UnauthorizedError('Invalid or expired session. Please log in again.');
    }

    const baUser = await db.collection('user').findOne(
      { _id: databaseService.toObjectId(sessionDoc.userId) }
    );

    if (!baUser) {
      throw new UnauthorizedError('Invalid or expired session. Please log in again.');
    }

    sessionUser = baUser;
  } catch (err) {
    if (err instanceof UnauthorizedError) throw err;
    logger.error('Session verification failed', { error: err.message });
    throw new UnauthorizedError('Invalid or expired session. Please log in again.');
  }

  const doc = await databaseService.client.users.findOne(
    { _id: databaseService.toObjectId(sessionUser.id || sessionUser._id?.toString()) },
    { projection: { password: 0 } }
  );
  const user = databaseService.formatDoc(doc);

  if (!user) {
    throw new UnauthorizedError('User belonging to this session no longer exists.');
  }

  if (!user.isActive) {
    throw new UnauthorizedError('Account has been deactivated. Please contact support.');
  }

  req.user = user;
  req.session = { token };
  next();
});

module.exports = protect;
