const authService = require('../services/auth.service');
const { successResponse, createdResponse } = require('../helpers/apiResponse');
const { HTTP_STATUS } = require('../config/constants');
const asyncHandler = require('../middlewares/asyncHandler');

// ─── Auth Controller ───────────────────────────────────────
// Handles HTTP requests for authentication endpoints.
// Delegates business logic to authService.
// ───────────────────────────────────────────────────────────

// @desc    Register a new user
// @route   POST /api/v1/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, role } = req.body;

  const result = await authService.register({ firstName, lastName, email, password, role });

  // Set JWT as httpOnly cookie
  res.cookie('token', result.token, result.cookieOptions);

  return createdResponse(res, {
    user: result.user,
    token: result.token,
  }, 'Registration successful');
});

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const result = await authService.login({ email, password });

  // Set JWT as httpOnly cookie
  res.cookie('token', result.token, result.cookieOptions);

  return successResponse(res, {
    user: result.user,
    token: result.token,
  }, 'Login successful');
});

// @desc    Logout user (clear cookie)
// @route   POST /api/v1/auth/logout
// @access  Private
const logout = asyncHandler(async (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
    path: '/',
  });

  return successResponse(res, null, 'Logged out successfully');
});

// @desc    Get current user profile
// @route   GET /api/v1/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  const result = await authService.getMe(req.user.id);

  return successResponse(res, result.user, 'Profile retrieved successfully');
});

module.exports = {
  register,
  login,
  logout,
  getMe,
};
