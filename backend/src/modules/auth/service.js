const { getAuth } = require('../../config/betterAuth');
const UserRepository = require('./repository');
const { ConflictError, UnauthorizedError, NotFoundError } = require('../../errors');
const databaseService = require('../../services/databaseService');
const logger = require('../../utils/logger');

function getCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    maxAge: 60 * 60 * 24 * 7 * 1000,
    path: '/',
  };
}

function sanitizeUser(user) {
  if (!user) return null;
  const { password, ...safeUser } = user;
  return safeUser;
}

async function register({ firstName, lastName, email, password, role = 'MEMBER' }) {
  const auth = getAuth();

  const fullName = `${firstName} ${lastName}`;

  const signUpResult = await auth.api.signUpEmail({
    body: {
      name: fullName,
      email,
      password,
    },
  });

  if (!signUpResult || signUpResult.error) {
    const message = signUpResult?.error?.message || 'Registration failed';
    if (message.includes('already') || message.includes('exists')) {
      throw new ConflictError('Email address is already registered');
    }
    throw new ConflictError(message);
  }

  const baUser = signUpResult.user;

  if (!baUser) {
    throw new ConflictError('Registration failed: no user returned');
  }

  const now = new Date();
  const appUser = await UserRepository.create({
    _id: databaseService.toObjectId(baUser.id),
    firstName,
    lastName,
    email: email.toLowerCase(),
    role,
    phone: null,
    profileImage: null,
    isActive: true,
    isVerified: false,
    lastLoginAt: null,
    createdAt: now,
    updatedAt: now,
  });

  const token = signUpResult.token || '';

  logger.info('User registered successfully', { userId: appUser.id, email: appUser.email });

  return {
    user: sanitizeUser(appUser),
    token,
    cookieOptions: getCookieOptions(),
  };
}

async function login({ email, password }) {
  const auth = getAuth();

  const signInResult = await auth.api.signInEmail({
    body: {
      email,
      password,
    },
  });

  if (!signInResult || signInResult.error) {
    const message = signInResult?.error?.message || 'Login failed';
    if (message.includes('deactivated') || message.includes('banned')) {
      throw new UnauthorizedError('Account has been deactivated. Please contact support.');
    }
    throw new UnauthorizedError('Invalid email or password');
  }

  const baUser = signInResult.user;

  if (!baUser) {
    throw new UnauthorizedError('Invalid email or password');
  }

  let appUser = await UserRepository.findByEmail(email);

  if (!appUser) {
    const nameParts = (baUser.name || '').split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    appUser = await UserRepository.create({
      _id: databaseService.toObjectId(baUser.id),
      firstName,
      lastName,
      email: email.toLowerCase(),
      role: 'MEMBER',
      phone: null,
      profileImage: null,
      isActive: true,
      isVerified: baUser.emailVerified || false,
      lastLoginAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    logger.info('Auto-created user profile from Better Auth', { userId: appUser.id, email: appUser.email });
  }

  if (!appUser.isActive) {
    throw new UnauthorizedError('Account has been deactivated. Please contact support.');
  }

  await UserRepository.updateLastLogin(appUser.id);

  const token = signInResult.token || '';

  logger.info('User logged in successfully', { userId: appUser.id, email: appUser.email });

  return {
    user: sanitizeUser(appUser),
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

async function signOut(headers) {
  const auth = getAuth();

  await auth.api.signOut({
    headers,
  });
}

module.exports = {
  register,
  login,
  getMe,
  signOut,
  getCookieOptions,
  sanitizeUser,
};
