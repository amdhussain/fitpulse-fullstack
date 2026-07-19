const { getAuth } = require('../../config/betterAuth');
const TrainerRepository = require('./repository');
const UserRepository = require('../user/repository');
const databaseService = require('../../services/databaseService');
const { NotFoundError, ConflictError, BadRequestError } = require('../../errors');
const logger = require('../../utils/logger');

function parseJsonField(value) {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

function serializeJsonField(value) {
  if (value === null || value === undefined) return null;
  if (typeof value === 'string') return value;
  return JSON.stringify(value);
}

function formatTrainer(trainer) {
  if (!trainer) return null;
  return {
    ...trainer,
    skills: parseJsonField(trainer.skills),
    programs: parseJsonField(trainer.programs),
    certificates: parseJsonField(trainer.certificates),
    achievements: parseJsonField(trainer.achievements),
    availableDays: parseJsonField(trainer.availableDays),
    socialLinks: parseJsonField(trainer.socialLinks),
  };
}

// ─── Admin APIs ───────────────────────────────────────────

async function createTrainer({ email, password, firstName, lastName, phone, profileImage, bio, specialization, designation, experience, hourlyRate, skills, programs, certificates, achievements, availableDays, socialLinks }) {
  const existingUser = await UserRepository.findByEmail(email.toLowerCase());

  if (existingUser) {
    throw new ConflictError('Email address is already registered');
  }

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
    const message = signUpResult?.error?.message || 'Failed to create trainer account';
    if (message.includes('already') || message.includes('exists')) {
      throw new ConflictError('Email address is already registered');
    }
    throw new ConflictError(message);
  }

  const baUser = signUpResult.user || signUpResult.data?.user;

  if (!baUser) {
    throw new ConflictError('Failed to create trainer account');
  }

  const result = await databaseService.transaction(async (session) => {
    const user = await UserRepository.create(
      {
        _id: databaseService.toObjectId(baUser.id),
        email: email.toLowerCase(),
        firstName,
        lastName,
        phone,
        role: 'TRAINER',
        profileImage: profileImage || null,
      },
      session
    );

    const trainer = await TrainerRepository.create(
      {
        userId: user.id,
        bio: bio || null,
        specialization: specialization || null,
        designation: designation || null,
        experience: experience || null,
        hourlyRate: hourlyRate || null,
        profileImage: profileImage || null,
        skills: serializeJsonField(skills),
        programs: serializeJsonField(programs),
        certificates: serializeJsonField(certificates),
        achievements: serializeJsonField(achievements),
        availableDays: serializeJsonField(availableDays),
        socialLinks: serializeJsonField(socialLinks),
      },
      session
    );

    return { user, trainer };
  });

  logger.info('Trainer created', { userId: result.user.id, trainerId: result.trainer.id });

  return {
    ...formatTrainer(result.trainer),
    user: result.user,
  };
}

async function getAllTrainers({ page, limit, search, status, sortBy, sortOrder }) {
  const offset = (page - 1) * limit;

  const { trainers, total } = await TrainerRepository.findAll({
    page, limit, offset, search, status, sortBy, sortOrder,
  });

  return {
    data: trainers.map(formatTrainer),
    total,
    page,
    limit,
  };
}

async function getTrainerById(trainerId) {
  const trainer = await TrainerRepository.findById(trainerId);

  if (!trainer) {
    throw new NotFoundError('Trainer not found');
  }

  return formatTrainer(trainer);
}

async function updateTrainer(trainerId, data) {
  const trainer = await TrainerRepository.findById(trainerId);

  if (!trainer) {
    throw new NotFoundError('Trainer not found');
  }

  const updateData = {};

  const jsonFields = ['skills', 'programs', 'certificates', 'achievements', 'availableDays', 'socialLinks'];
  const plainFields = ['bio', 'specialization', 'designation', 'experience', 'hourlyRate', 'status'];

  for (const field of plainFields) {
    if (data[field] !== undefined) updateData[field] = data[field];
  }

  for (const field of jsonFields) {
    if (data[field] !== undefined) {
      updateData[field] = serializeJsonField(data[field]);
    }
  }

  if (Object.keys(updateData).length === 0) {
    throw new BadRequestError('No fields to update');
  }

  const updated = await TrainerRepository.update(trainerId, updateData);

  logger.info('Trainer updated by admin', { trainerId });

  return formatTrainer(updated);
}

async function deleteTrainer(trainerId) {
  const trainer = await TrainerRepository.findById(trainerId);

  if (!trainer) {
    throw new NotFoundError('Trainer not found');
  }

  await databaseService.transaction(async (session) => {
    await TrainerRepository.delete(trainerId, session);
    await UserRepository.delete(trainer.userId, session);
  });

  logger.info('Trainer deleted', { trainerId });

  return { message: 'Trainer deleted successfully' };
}

// ─── Trainer Self APIs ────────────────────────────────────

async function updateTrainerProfile(trainerUserId, { bio, designation, hourlyRate, socialLinks }) {
  const trainer = await TrainerRepository.findByUserId(trainerUserId);

  if (!trainer) {
    throw new NotFoundError('Trainer profile not found');
  }

  const updateData = {};
  if (bio !== undefined) updateData.bio = bio;
  if (designation !== undefined) updateData.designation = designation;
  if (hourlyRate !== undefined) updateData.hourlyRate = hourlyRate;
  if (socialLinks !== undefined) updateData.socialLinks = serializeJsonField(socialLinks);

  if (Object.keys(updateData).length === 0) {
    throw new BadRequestError('No fields to update');
  }

  const updated = await TrainerRepository.update(trainer.id, updateData);

  logger.info('Trainer profile updated', { trainerId: trainer.id });

  return formatTrainer(updated);
}

async function updateAvailability(trainerUserId, { availableDays }) {
  const trainer = await TrainerRepository.findByUserId(trainerUserId);

  if (!trainer) {
    throw new NotFoundError('Trainer profile not found');
  }

  const updated = await TrainerRepository.update(trainer.id, {
    availableDays: serializeJsonField(availableDays),
  });

  logger.info('Trainer availability updated', { trainerId: trainer.id });

  return formatTrainer(updated);
}

async function updateCertifications(trainerUserId, { certificates, achievements }) {
  const trainer = await TrainerRepository.findByUserId(trainerUserId);

  if (!trainer) {
    throw new NotFoundError('Trainer profile not found');
  }

  const updateData = {};
  if (certificates !== undefined) updateData.certificates = serializeJsonField(certificates);
  if (achievements !== undefined) updateData.achievements = serializeJsonField(achievements);

  if (Object.keys(updateData).length === 0) {
    throw new BadRequestError('No fields to update');
  }

  const updated = await TrainerRepository.update(trainer.id, updateData);

  logger.info('Trainer certifications updated', { trainerId: trainer.id });

  return formatTrainer(updated);
}

async function updateExperience(trainerUserId, { experience, skills, programs }) {
  const trainer = await TrainerRepository.findByUserId(trainerUserId);

  if (!trainer) {
    throw new NotFoundError('Trainer profile not found');
  }

  const updateData = {};
  if (experience !== undefined) updateData.experience = experience;
  if (skills !== undefined) updateData.skills = serializeJsonField(skills);
  if (programs !== undefined) updateData.programs = serializeJsonField(programs);

  if (Object.keys(updateData).length === 0) {
    throw new BadRequestError('No fields to update');
  }

  const updated = await TrainerRepository.update(trainer.id, updateData);

  logger.info('Trainer experience updated', { trainerId: trainer.id });

  return formatTrainer(updated);
}

async function updateSpecializations(trainerUserId, { specialization }) {
  const trainer = await TrainerRepository.findByUserId(trainerUserId);

  if (!trainer) {
    throw new NotFoundError('Trainer profile not found');
  }

  const updated = await TrainerRepository.update(trainer.id, { specialization });

  logger.info('Trainer specializations updated', { trainerId: trainer.id });

  return formatTrainer(updated);
}

// ─── Public APIs ──────────────────────────────────────────

async function listTrainers({ page, limit, search, specialization, minExperience, availableDay, sortBy, sortOrder }) {
  const offset = (page - 1) * limit;

  const { trainers, total } = await TrainerRepository.findPublic({
    page, limit, offset, search, specialization, minExperience, availableDay, sortBy, sortOrder,
  });

  return {
    data: trainers.map(formatTrainer),
    total,
    page,
    limit,
  };
}

module.exports = {
  createTrainer,
  getAllTrainers,
  getTrainerById,
  updateTrainer,
  deleteTrainer,
  updateTrainerProfile,
  updateAvailability,
  updateCertifications,
  updateExperience,
  updateSpecializations,
  listTrainers,
};
