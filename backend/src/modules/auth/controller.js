const authService = require('./service');
const { successResponse, createdResponse } = require('../../helpers/apiResponse');
const asyncHandler = require('../../middlewares/asyncHandler');

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

module.exports = {
  register,
  login,
  logout,
  getMe,
};
