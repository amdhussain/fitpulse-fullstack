const { fromNodeHeaders } = require('better-auth/node');
const { getAuth } = require('../../config/betterAuth');
const UserRepository = require('./repository');
const { NotFoundError, ConflictError, ForbiddenError, BadRequestError } = require('../../errors');
const logger = require('../../utils/logger');

function sanitizeUser(user) {
  const { password, ...safeUser } = user;
  return safeUser;
}

async function getMyProfile(userId) {
  const user = await UserRepository.findById(userId);

  if (!user) {
    throw new NotFoundError('User not found');
  }

  return user;
}

async function updateMyProfile(userId, { firstName, lastName, phone, profileImage }) {
  const user = await UserRepository.findById(userId);

  if (!user) {
    throw new NotFoundError('User not found');
  }

  const updateData = {};
  if (firstName !== undefined) updateData.firstName = firstName;
  if (lastName !== undefined) updateData.lastName = lastName;
  if (phone !== undefined) updateData.phone = phone;
  if (profileImage !== undefined) updateData.profileImage = profileImage;

  if (Object.keys(updateData).length === 0) {
    throw new BadRequestError('No fields to update');
  }

  const updated = await UserRepository.updateProfile(userId, updateData);

  logger.info('User profile updated', { userId });

  return updated;
}

async function changePassword(userId, { currentPassword, newPassword }, headers) {
  const user = await UserRepository.findById(userId);

  if (!user) {
    throw new NotFoundError('User not found');
  }

  if (currentPassword === newPassword) {
    throw new BadRequestError('New password must be different from current password');
  }

  const auth = getAuth();

  try {
    await auth.api.changePassword({
      body: {
        newPassword,
        currentPassword,
        revokeOtherSessions: false,
      },
      headers,
    });
  } catch (err) {
    if (err.message && err.message.toLowerCase().includes('password')) {
      throw new BadRequestError('Current password is incorrect');
    }
    throw new BadRequestError('Failed to change password');
  }

  logger.info('User password changed', { userId });

  return { message: 'Password changed successfully' };
}

async function updateProfileImage(userId, profileImage) {
  const user = await UserRepository.findById(userId);

  if (!user) {
    throw new NotFoundError('User not found');
  }

  const updated = await UserRepository.updateProfile(userId, { profileImage });

  logger.info('User profile image updated', { userId });

  return updated;
}

async function deleteMyAccount(userId) {
  const user = await UserRepository.findById(userId);

  if (!user) {
    throw new NotFoundError('User not found');
  }

  await UserRepository.delete(userId);

  logger.info('User account deleted', { userId });

  return { message: 'Account deleted successfully' };
}

async function getAllUsers({ page, limit, search, role, isActive, sortBy, sortOrder }) {
  const offset = (page - 1) * limit;

  const { users, total } = await UserRepository.findAll({
    page,
    limit,
    offset,
    search,
    role,
    isActive,
    sortBy,
    sortOrder,
  });

  return { data: users, total, page, limit };
}

async function getUserById(userId) {
  const user = await UserRepository.findById(userId);

  if (!user) {
    throw new NotFoundError('User not found');
  }

  return user;
}

async function updateUserRole(userId, role) {
  const user = await UserRepository.findById(userId);

  if (!user) {
    throw new NotFoundError('User not found');
  }

  if (user.role === role) {
    throw new ConflictError(`User already has role '${role}'`);
  }

  const updated = await UserRepository.updateRole(userId, role);

  logger.info('User role updated', { userId, newRole: role });

  return updated;
}

async function blockUser(userId) {
  const user = await UserRepository.findById(userId);

  if (!user) {
    throw new NotFoundError('User not found');
  }

  if (!user.isActive) {
    throw new ConflictError('User is already blocked');
  }

  const updated = await UserRepository.setActive(userId, false);

  logger.info('User blocked', { userId });

  return updated;
}

async function unblockUser(userId) {
  const user = await UserRepository.findById(userId);

  if (!user) {
    throw new NotFoundError('User not found');
  }

  if (user.isActive) {
    throw new ConflictError('User is already active');
  }

  const updated = await UserRepository.setActive(userId, true);

  logger.info('User unblocked', { userId });

  return updated;
}

async function deleteUser(userId) {
  const user = await UserRepository.findById(userId);

  if (!user) {
    throw new NotFoundError('User not found');
  }

  await UserRepository.delete(userId);

  logger.info('User deleted by admin', { userId });

  return { message: 'User deleted successfully' };
}

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
};
