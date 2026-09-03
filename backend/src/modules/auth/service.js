const { getAuth, consumeResetToken } = require('../../config/betterAuth');
const { google } = require('better-auth/social-providers');
const UserRepository = require('./repository');
const { ConflictError, UnauthorizedError, NotFoundError, BadRequestError } = require('../../errors');
const databaseService = require('../../services/databaseService');
const notificationService = require('../../services/notificationService');
const logger = require('../../utils/logger');
const env = require('../../config/env');
const crypto = require('crypto');

const googleOAuthState = new Map();

function getCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
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

  const sessionToken = crypto.randomBytes(32).toString('hex');
  const sessionExpiresAt = new Date(Date.now() + 60 * 60 * 24 * 7 * 1000);

  await databaseService.db.collection('session').insertOne({
    token: sessionToken,
    userId: databaseService.toObjectId(appUser.id),
    expiresAt: sessionExpiresAt,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  logger.info('User registered successfully', { userId: appUser.id, email: appUser.email });

  notificationService.userRegistered(appUser.id, `${firstName} ${lastName}`, email).catch(() => {});

  return {
    user: sanitizeUser(appUser),
    token: sessionToken,
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

  const sessionToken = crypto.randomBytes(32).toString('hex');
  const sessionExpiresAt = new Date(Date.now() + 60 * 60 * 24 * 7 * 1000);

  await databaseService.db.collection('session').insertOne({
    token: sessionToken,
    userId: databaseService.toObjectId(appUser.id),
    expiresAt: sessionExpiresAt,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  logger.info('User logged in successfully', { userId: appUser.id, email: appUser.email });

  return {
    user: sanitizeUser(appUser),
    token: sessionToken,
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

  try {
    await auth.api.signOut({ headers });
  } catch {
    // Ignore Better Auth sign-out errors
  }

  // Also clean up custom session
  try {
    const authHeader = headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      await databaseService.db.collection('session').deleteOne({ token });
    }
  } catch {
    // Best-effort cleanup
  }
}

async function forgotPassword(email) {
  const auth = getAuth();

  try {
    await auth.api.forgetPassword({
      body: {
        email,
        redirectTo: `${env.clientUrl}/reset-password`,
      },
    });
  } catch {
    // Ignore errors - always return success to prevent email enumeration
  }

  const resetData = consumeResetToken(email);

  logger.info('Password reset requested', { email });

  return {
    message: 'If an account with that email exists, a password reset link has been sent.',
    ...(env.isDevelopment && resetData && {
      resetToken: resetData.token,
      resetUrl: resetData.url,
    }),
  };
}

async function resetPassword(token, newPassword) {
  const auth = getAuth();

  try {
    const result = await auth.api.resetPassword({
      body: {
        newPassword,
        token,
      },
    });

    if (result?.error) {
      throw new BadRequestError('Invalid or expired reset token');
    }
  } catch (err) {
    if (err instanceof BadRequestError) throw err;
    throw new BadRequestError('Invalid or expired reset token');
  }

  logger.info('Password reset completed');

  return { message: 'Password has been reset successfully' };
}

async function createGoogleAuthUrl(callbackURL) {
  const state = crypto.randomBytes(32).toString('hex');
  const codeVerifier = crypto.randomBytes(32).toString('base64url');
  const codeChallenge = crypto
    .createHash('sha256')
    .update(codeVerifier)
    .digest('base64url');

  googleOAuthState.set(state, {
    codeVerifier,
    callbackURL: callbackURL || `${env.clientUrl}/auth/callback`,
    createdAt: Date.now(),
  });

  for (const [key, val] of googleOAuthState) {
    if (Date.now() - val.createdAt > 600000) {
      googleOAuthState.delete(key);
    }
  }

  const baseURL = env.betterAuth.url.replace(/\/+$/, '');
  const redirectURI = `${baseURL}/api/v1/auth/google/callback`;

  logger.info('Google OAuth redirect URI', { redirectURI, baseURL });

  const params = new URLSearchParams({
    client_id: env.google.clientId,
    redirect_uri: redirectURI,
    response_type: 'code',
    scope: 'openid email profile',
    state,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
    access_type: 'offline',
    prompt: 'consent',
  });

  return {
    url: `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`,
    state,
  };
}

async function handleGoogleCallback(code, state) {
  const stateData = googleOAuthState.get(state);
  if (!stateData) {
    throw new BadRequestError('Invalid or expired OAuth state. Please try again.');
  }
  googleOAuthState.delete(state);

  const { codeVerifier, callbackURL } = stateData;
  const redirectURI = `${env.betterAuth.url.replace(/\/+$/, '')}/api/v1/auth/google/callback`;

  const tokens = await google({
    clientId: env.google.clientId,
    clientSecret: env.google.clientSecret,
  }).validateAuthorizationCode({
    code,
    codeVerifier,
    redirectURI,
  });

  const googleUser = await google({
    clientId: env.google.clientId,
    clientSecret: env.google.clientSecret,
  }).getUserInfo(tokens);

  if (!googleUser || !googleUser.user) {
    throw new UnauthorizedError('Could not retrieve user information from Google');
  }

  const { user: gUser } = googleUser;
  const email = gUser.email;
  const firstName = gUser.name?.split(' ')[0] || '';
  const lastName = gUser.name?.split(' ').slice(1).join(' ') || '';
  const profileImage = gUser.image || null;

  const auth = getAuth();

  let baUser;
  let isNewUser = false;

  try {
    const existingUser = await databaseService.db.collection('user').findOne({ email: email.toLowerCase() });

    if (existingUser) {
      baUser = existingUser;
      await databaseService.db.collection('user').updateOne(
        { _id: existingUser._id },
        { $set: { emailVerified: true, updatedAt: new Date() } }
      );
    } else {
      const insertResult = await databaseService.db.collection('user').insertOne({
        name: gUser.name || `${firstName} ${lastName}`,
        email: email.toLowerCase(),
        emailVerified: true,
        image: profileImage,
        firstName,
        lastName,
        role: 'MEMBER',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      baUser = {
        _id: insertResult.insertedId,
        id: insertResult.insertedId.toString(),
        name: gUser.name || `${firstName} ${lastName}`,
        email: email.toLowerCase(),
        emailVerified: true,
        image: profileImage,
        firstName,
        lastName,
        role: 'MEMBER',
      };
      isNewUser = true;
    }
  } catch (err) {
    logger.error('Failed to find/create Better Auth user for Google login', { error: err.message });
    throw new UnauthorizedError('Failed to process Google authentication');
  }

  const userId = (baUser._id || baUser.id).toString();

  let appUser = await UserRepository.findByEmail(email);

  if (!appUser) {
    appUser = await UserRepository.create({
      _id: databaseService.toObjectId(userId),
      firstName,
      lastName,
      email: email.toLowerCase(),
      role: 'MEMBER',
      phone: null,
      profileImage,
      isActive: true,
      isVerified: true,
      lastLoginAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    logger.info('Created new app user from Google OAuth', { userId: appUser.id, email: appUser.email });
    notificationService.userRegistered(appUser.id, `${firstName} ${lastName}`, email).catch(() => {});
  } else {
    const updates = {};
    if (profileImage && !appUser.profileImage) {
      updates.profileImage = profileImage;
    }
    if (!appUser.isVerified) {
      updates.isVerified = true;
    }
    if (Object.keys(updates).length > 0) {
      updates.updatedAt = new Date();
      await databaseService.db.collection('users').updateOne(
        { _id: databaseService.toObjectId(userId) },
        { $set: updates }
      );
      appUser = { ...appUser, ...updates };
    }
  }

  if (!appUser.isActive) {
    throw new UnauthorizedError('Account has been deactivated. Please contact support.');
  }

  const sessionToken = crypto.randomBytes(32).toString('hex');
  const sessionExpiresAt = new Date(Date.now() + 60 * 60 * 24 * 7 * 1000);

  await databaseService.db.collection('session').insertOne({
    token: sessionToken,
    userId: databaseService.toObjectId(userId),
    expiresAt: sessionExpiresAt,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  await UserRepository.updateLastLogin(userId);

  logger.info('User logged in via Google OAuth', { userId: appUser.id, email: appUser.email });

  return {
    user: sanitizeUser(appUser),
    token: sessionToken,
    callbackURL,
  };
}

module.exports = {
  register,
  login,
  getMe,
  signOut,
  getCookieOptions,
  sanitizeUser,
  forgotPassword,
  resetPassword,
  createGoogleAuthUrl,
  handleGoogleCallback,
};
