const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserRepository = require('./repository');
const { ConflictError, UnauthorizedError, NotFoundError } = require('../../errors');
const env = require('../../config/env');
const logger = require('../../utils/logger');

const SALT_ROUNDS = 12;

function generateToken(payload) {
  return jwt.sign(payload, env.jwt.secret, {
    expiresIn: env.jwt.expiresIn,
  });
}

function verifyToken(token) {
  return jwt.verify(token, env.jwt.secret);
}

function getCookieOptions() {
  return {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: env.isProduction ? 'strict' : 'lax',
    maxAge: env.cookie.maxAge,
    path: '/',
  };
}

function sanitizeUser(user) {
  const { password, ...safeUser } = user;
  return safeUser;
}

async function register({ firstName, lastName, email, password, role = 'MEMBER' }) {
  const existingUser = await UserRepository.findByEmail(email);

  if (existingUser) {
    throw new ConflictError('Email address is already registered');
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await UserRepository.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    role,
  });

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

async function login({ email, password }) {
  const user = await UserRepository.findByEmail(email);

  if (!user) {
    throw new UnauthorizedError('Invalid email or password');
  }

  if (!user.isActive) {
    throw new UnauthorizedError('Account has been deactivated. Please contact support.');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new UnauthorizedError('Invalid email or password');
  }

  await UserRepository.updateLastLogin(user.id);

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

async function getMe(userId) {
  const user = await UserRepository.findById(userId);

  if (!user) {
    throw new NotFoundError('User not found');
  }

  return { user: sanitizeUser(user) };
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
