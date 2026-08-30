const authService = require('./service');
const { successResponse, createdResponse } = require('../../helpers/apiResponse');
const asyncHandler = require('../../middlewares/asyncHandler');
const { fromNodeHeaders } = require('better-auth/node');
const env = require('../../config/env');

const register = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, role } = req.body;

  const result = await authService.register({ firstName, lastName, email, password, role });

  res.cookie('token', result.token, result.cookieOptions);

  return createdResponse(res, {
    user: result.user,
    token: result.token,
  }, 'Registration successful');
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const result = await authService.login({ email, password });

  res.cookie('token', result.token, result.cookieOptions);

  return successResponse(res, {
    user: result.user,
    token: result.token,
  }, 'Login successful');
});

const logout = asyncHandler(async (req, res) => {
  try {
    const headers = fromNodeHeaders(req.headers);
    await authService.signOut(headers);
  } catch (err) {
    // Ignore sign-out errors (session may already be invalid)
  }

  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
    path: '/',
  });

  return successResponse(res, null, 'Logged out successfully');
});

const getMe = asyncHandler(async (req, res) => {
  const result = await authService.getMe(req.user.id);

  return successResponse(res, result.user, 'Profile retrieved successfully');
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const result = await authService.forgotPassword(email);

  return successResponse(res, result, result.message);
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;

  const result = await authService.resetPassword(token, newPassword);

  return successResponse(res, result, result.message);
});

const googleAuth = asyncHandler(async (req, res) => {
  const callbackURL = req.query.callbackURL || `${env.clientUrl}/auth/callback`;
  const { url } = await authService.createGoogleAuthUrl(callbackURL);
  res.redirect(url);
});

const googleCallback = asyncHandler(async (req, res) => {
  const { code, state, error } = req.query;

  if (error) {
    const errorMessage = encodeURIComponent(error);
    return res.redirect(`${env.clientUrl}/auth/callback?error=${errorMessage}`);
  }

  if (!code || !state) {
    return res.redirect(`${env.clientUrl}/auth/callback?error=missing_parameters`);
  }

  try {
    const result = await authService.handleGoogleCallback(code, state);
    const userData = encodeURIComponent(JSON.stringify(result.user));
    return res.redirect(`${env.clientUrl}/auth/callback?token=${result.token}&user=${userData}`);
  } catch (err) {
    const errorMessage = encodeURIComponent(err.message || 'Google authentication failed');
    return res.redirect(`${env.clientUrl}/auth/callback?error=${errorMessage}`);
  }
});

module.exports = {
  register,
  login,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
  googleAuth,
  googleCallback,
};
