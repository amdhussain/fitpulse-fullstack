const userService = require('./service');
const { successResponse, updatedResponse, deletedResponse, paginatedResponse } = require('../../helpers/apiResponse');
const asyncHandler = require('../../middlewares/asyncHandler');
const { fromNodeHeaders } = require('better-auth/node');

const getMyProfile = asyncHandler(async (req, res) => {
  const user = await userService.getMyProfile(req.user.id);

  return successResponse(res, user, 'Profile retrieved successfully');
});

const updateMyProfile = asyncHandler(async (req, res) => {
  const { firstName, lastName, phone, profileImage } = req.body;

  const user = await userService.updateMyProfile(req.user.id, { firstName, lastName, phone, profileImage });

  return updatedResponse(res, user, 'Profile updated successfully');
});

const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const headers = fromNodeHeaders(req.headers);

  const result = await userService.changePassword(req.user.id, { currentPassword, newPassword }, headers);

  return updatedResponse(res, null, result.message);
});

const updateProfileImage = asyncHandler(async (req, res) => {
  const { profileImage } = req.body;

  const user = await userService.updateProfileImage(req.user.id, profileImage);

  return updatedResponse(res, user, 'Profile image updated successfully');
});

const deleteMyAccount = asyncHandler(async (req, res) => {
  const result = await userService.deleteMyAccount(req.user.id);

  return deletedResponse(res, result.message);
});

const getAllUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search, role, isActive, sortBy, sortOrder } = req.query;

  const paginationParams = {
    page: parseInt(page, 10) || 1,
    limit: parseInt(limit, 10) || 10,
    search,
    role,
    isActive: isActive !== undefined ? isActive === 'true' : undefined,
    sortBy,
    sortOrder,
  };

  const result = await userService.getAllUsers(paginationParams);

  return paginatedResponse(res, result);
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id);

  return successResponse(res, user, 'User retrieved successfully');
});

const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;

  const user = await userService.updateUserRole(req.params.id, role);

  return updatedResponse(res, user, 'User role updated successfully');
});

const blockUser = asyncHandler(async (req, res) => {
  const user = await userService.blockUser(req.params.id);

  return updatedResponse(res, user, 'User blocked successfully');
});

const unblockUser = asyncHandler(async (req, res) => {
  const user = await userService.unblockUser(req.params.id);

  return updatedResponse(res, user, 'User unblocked successfully');
});

const deleteUser = asyncHandler(async (req, res) => {
  const result = await userService.deleteUser(req.params.id);

  return deletedResponse(res, result.message);
});

const updateAdminProfile = asyncHandler(async (req, res) => {
  const { firstName, lastName, profileImage } = req.body;

  const user = await userService.updateAdminProfile(req.user.id, { firstName, lastName, profileImage });

  return updatedResponse(res, user, 'Admin profile updated successfully');
});

const updateAdminEmail = asyncHandler(async (req, res) => {
  const { newEmail, password } = req.body;
  const headers = fromNodeHeaders(req.headers);

  const user = await userService.updateAdminEmail(req.user.id, { newEmail, password }, headers);

  return updatedResponse(res, user, 'Admin email updated successfully');
});

const changeAdminPassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const headers = fromNodeHeaders(req.headers);

  const result = await userService.changeAdminPassword(req.user.id, { currentPassword, newPassword }, headers);

  return updatedResponse(res, null, result.message);
});

module.exports = {
  getMyProfile,
  updateMyProfile,
  changePassword,
  updateProfileImage,
  deleteMyAccount,
  getAllUsers,
  getUserById,
  updateUserRole,
  blockUser,
  unblockUser,
  deleteUser,
  updateAdminProfile,
  updateAdminEmail,
  changeAdminPassword,
};
