const databaseService = require('../services/databaseService');
const logger = require('../utils/logger');

const DEFAULT_CLASSES = [
  {
    name: 'Yoga Flow',
    description: 'A gentle yoga session for all levels focusing on flexibility and mindfulness.',
    category: 'Yoga',
    difficulty: 'BEGINNER',
    capacity: 20,
    availableSeats: 20,
    duration: 60,
    price: 25,
    status: 'ACTIVE',
  },
  {
    name: 'HIIT Burn',
    description: 'High-intensity interval training to maximize calorie burn and boost metabolism.',
    category: 'HIIT',
    difficulty: 'INTERMEDIATE',
    capacity: 15,
    availableSeats: 15,
    duration: 45,
    price: 35,
    status: 'ACTIVE',
  },
  {
    name: 'Strength Training',
    description: 'Build muscle and increase strength with guided weight training exercises.',
    category: 'Strength',
    difficulty: 'ADVANCED',
    capacity: 12,
    availableSeats: 12,
    duration: 60,
    price: 40,
    status: 'ACTIVE',
  },
  {
    name: 'Cardio Dance',
    description: 'Fun dance-based cardio workout that improves endurance and coordination.',
    category: 'Dance',
    difficulty: 'BEGINNER',
    capacity: 25,
    availableSeats: 25,
    duration: 50,
    price: 20,
    status: 'ACTIVE',
  },
  {
    name: 'Pilates Core',
    description: 'Strengthen your core muscles and improve posture with Pilates exercises.',
    category: 'Pilates',
    difficulty: 'BEGINNER',
    capacity: 18,
    availableSeats: 18,
    duration: 55,
    price: 30,
    status: 'ACTIVE',
  },
  {
    name: 'CrossFit WOD',
    description: 'Intense functional fitness workout combining weightlifting, cardio, and gymnastics.',
    category: 'CrossFit',
    difficulty: 'ADVANCED',
    capacity: 10,
    availableSeats: 10,
    duration: 60,
    price: 45,
    status: 'ACTIVE',
  },
];

async function seedClasses() {
  try {
    const classesCollection = databaseService.client.classes;
    const count = await classesCollection.countDocuments();

    if (count > 0) {
      logger.info(`Classes collection already has ${count} document(s), skipping seed`);
      return;
    }

    const trainersCollection = databaseService.client.trainers;
    const trainer = await trainersCollection.findOne({ status: 'ACTIVE' });

    if (!trainer) {
      logger.warn('No active trainer found, seeding classes without trainer assignment');
    }

    const now = new Date();
    const classesToInsert = DEFAULT_CLASSES.map((cls) => ({
      ...cls,
      trainerId: trainer ? trainer._id : null,
      schedule: null,
      image: null,
      createdAt: now,
      updatedAt: now,
    }));

    await classesCollection.insertMany(classesToInsert);
    logger.info(`Seeded ${classesToInsert.length} default classes`);
  } catch (error) {
    logger.error('Failed to seed classes', { error: error.message });
  }
}

module.exports = seedClasses;
