const { verifyToken } = require('../services/auth.service');
const { databaseService } = require('../services');
const { UnauthorizedError } = require('../errors');
const asyncHandler = require('./asyncHandler');
const logger = require('../utils/logger');

// ─── Auth Middleware ────────────────────────────────────────
// Protects routes by verifying JWT from either:
//   1. Authorization header:  `Bearer <token>`
//   2. Cookie:                 `token=<token>`
//
// On success, attaches the full user object to `req.user`.
//
// Usage:
//   router.get('/profile', protect, controller.getProfile);
// ───────────────────────────────────────────────────────────

const protect = asyncHandler(async (req, res, next) => {
  let token = null;

  // 1. Check Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  // 2. Check cookie
  if (!token && req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    throw new UnauthorizedError('You are not logged in. Please log in to access this resource.');
  }

  // Verify token
  let decoded;
  try {
    decoded = verifyToken(token);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw new UnauthorizedError('Token has expired. Please log in again.');
    }
    throw new UnauthorizedError('Invalid token. Please log in again.');
  }

  // Fetch user from database
  const user = await databaseService.client.user.findUnique({
    where: { id: decoded.id },
  });

  if (!user) {
    throw new UnauthorizedError('User belonging to this token no longer exists.');
  }

  if (!user.isActive) {
    throw new UnauthorizedError('Account has been deactivated. Please contact support.');
  }

  // Attach user to request
  req.user = user;
  next();
});

module.exports = protect;
