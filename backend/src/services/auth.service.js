const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const databaseService = require('./databaseService');
const { ConflictError, UnauthorizedError, NotFoundError } = require('../errors');
const env = require('../config/env');
const logger = require('../utils/logger');

// ─── Auth Service ──────────────────────────────────────────
// Business logic for authentication: register, login, logout,
// JWT token generation, and password hashing.
//
// All passwords are hashed with bcrypt (12 salt rounds).
// JWT tokens are issued as httpOnly cookies for security.
// ───────────────────────────────────────────────────────────

const SALT_ROUNDS = 12;

// ─── Token Generation ──────────────────────────────────────

function generateToken(payload) {
  return jwt.sign(payload, env.jwt.secret, {
    expiresIn: env.jwt.expiresIn,
  });
}

function verifyToken(token) {
  return jwt.verify(token, env.jwt.secret);
}

// ─── Cookie Options ────────────────────────────────────────

function getCookieOptions() {
  return {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: env.isProduction ? 'strict' : 'lax',
    maxAge: env.cookie.maxAge,
    path: '/',
  };
}

// ─── Register ──────────────────────────────────────────────

async function register({ firstName, lastName, email, password, role = 'MEMBER' }) {
  // Check if email already exists
  const existingUser = await databaseService.client.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (existingUser) {
    throw new ConflictError('Email address is already registered');
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  // Create user
  const user = await databaseService.client.user.create({
    data: {
      firstName,
      lastName,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
    },
  });

  // Generate JWT
  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  logger.info('User registered successfully', { userId: user.id, email: user.email });

  return {
    user: sanitizeUser(user),
    token,
    cookieOptions: getCookieOptions(),
  };
}

// ─── Login ─────────────────────────────────────────────────

async function login({ email, password }) {
  // Find user by email (include password since it's select: false)
  const user = await databaseService.client.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!user) {
    throw new UnauthorizedError('Invalid email or password');
  }

  if (!user.isActive) {
    throw new UnauthorizedError('Account has been deactivated. Please contact support.');
  }

  // Compare passwords
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new UnauthorizedError('Invalid email or password');
  }

  // Update last login timestamp
  await databaseService.client.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  // Generate JWT
  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  logger.info('User logged in successfully', { userId: user.id, email: user.email });

  return {
    user: sanitizeUser(user),
    token,
    cookieOptions: getCookieOptions(),
  };
}

// ─── Get Current User ──────────────────────────────────────

async function getMe(userId) {
  const user = await databaseService.client.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  return { user: sanitizeUser(user) };
}

// ─── Helpers ───────────────────────────────────────────────

function sanitizeUser(user) {
  const { password, ...safeUser } = user;
  return safeUser;
}

module.exports = {
  register,
  login,
  getMe,
  generateToken,
  verifyToken,
  getCookieOptions,
  sanitizeUser,
};
