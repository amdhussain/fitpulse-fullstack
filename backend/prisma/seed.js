const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// ─── Helpers ─────────────────────────────────────────────

function parseJsonField(value) {
  if (value === null || value === undefined) return null;
  if (typeof value === 'string') return value;
  return JSON.stringify(value);
}

// ─── Seed Data ───────────────────────────────────────────

const USERS = [
  {
    email: 'admin@fitpulse.com',
    password: 'Admin@123',
    firstName: 'System',
    lastName: 'Admin',
    role: 'ADMIN',
    isVerified: true,
    isActive: true,
  },
  {
    email: 'trainer1@fitpulse.com',
    password: 'Trainer@123',
    firstName: 'Sarah',
    lastName: 'Johnson',
    role: 'TRAINER',
    isVerified: true,
    isActive: true,
  },
  {
    email: 'trainer2@fitpulse.com',
    password: 'Trainer@123',
    firstName: 'Mike',
    lastName: 'Chen',
    role: 'TRAINER',
    isVerified: true,
    isActive: true,
  },
  {
    email: 'trainer3@fitpulse.com',
    password: 'Trainer@123',
    firstName: 'Emily',
    lastName: 'Davis',
    role: 'TRAINER',
    isVerified: true,
    isActive: true,
  },
  {
    email: 'member1@fitpulse.com',
    password: 'Member@123',
    firstName: 'John',
    lastName: 'Smith',
    role: 'MEMBER',
    isVerified: true,
    isActive: true,
  },
  {
    email: 'member2@fitpulse.com',
    password: 'Member@123',
    firstName: 'Lisa',
    lastName: 'Wong',
    role: 'MEMBER',
    isVerified: true,
    isActive: true,
  },
  {
    email: 'member3@fitpulse.com',
    password: 'Member@123',
    firstName: 'David',
    lastName: 'Brown',
    role: 'MEMBER',
    isVerified: true,
    isActive: true,
  },
  {
    email: 'member4@fitpulse.com',
    password: 'Member@123',
    firstName: 'Anna',
    lastName: 'Taylor',
    role: 'MEMBER',
    isVerified: true,
    isActive: true,
  },
];

const TRAINERS = [
  {
    email: 'trainer1@fitpulse.com',
    bio: 'Certified yoga instructor with 8 years of experience. Specializing in Vinyasa and Hatha yoga for all levels.',
    specialization: 'Yoga & Flexibility',
    designation: 'Senior Yoga Instructor',
    experience: 8,
    hourlyRate: 75.00,
    rating: 4.9,
    reviewsCount: 124,
    skills: ['Vinyasa Yoga', 'Hatha Yoga', 'Meditation', 'Flexibility Training'],
    programs: ['Morning Flow', 'Power Yoga', 'Yoga for Beginners'],
    certificates: ['RYT-200', 'Yoga Alliance Certified', 'First Aid Certified'],
    achievements: ['Best Instructor 2023', '100+ Workshops Conducted'],
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    socialLinks: { instagram: 'https://instagram.com/sarahjoga', linkedin: 'https://linkedin.com/in/sarahjohnson' },
  },
  {
    email: 'trainer2@fitpulse.com',
    bio: 'Former professional athlete turned fitness coach. Expert in HIIT, strength training, and athletic performance.',
    specialization: 'HIIT & Strength',
    designation: 'Head Fitness Coach',
    experience: 12,
    hourlyRate: 90.00,
    rating: 4.8,
    reviewsCount: 98,
    skills: ['HIIT', 'Strength Training', 'CrossFit', 'Athletic Conditioning'],
    programs: ['Beast Mode', 'Power Hour', 'Functional Fitness'],
    certificates: ['NASM-CPT', 'CrossFit Level 2', 'CPR/AED Certified'],
    achievements: ['Former State Champion', 'Coached 50+ Competitors'],
    availableDays: ['Monday', 'Wednesday', 'Friday', 'Saturday'],
    socialLinks: { instagram: 'https://instagram.com/mikefitpro', youtube: 'https://youtube.com/@mikechenfitness' },
  },
  {
    email: 'trainer3@fitpulse.com',
    bio: 'Passionate about helping people achieve their fitness goals through personalized training programs.',
    specialization: 'Cardio & Weight Loss',
    designation: 'Fitness Trainer',
    experience: 5,
    hourlyRate: 60.00,
    rating: 4.7,
    reviewsCount: 67,
    skills: ['Cardio Training', 'Weight Loss', 'Group Fitness', 'Pilates'],
    programs: ['Cardio Blast', 'Weight Loss Challenge', 'Pilates Core'],
    certificates: ['ACE-CPT', 'Group Fitness Instructor', 'Pilates Certification'],
    achievements: ['Helped 200+ Members Reach Goals'],
    availableDays: ['Tuesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    socialLinks: { instagram: 'https://instagram.com/emilyfit' },
  },
];

const CLASSES = [
  {
    name: 'Morning Yoga Flow',
    description: 'Start your day with a rejuvenating yoga flow session. Perfect for all levels.',
    category: 'Yoga',
    difficulty: 'BEGINNER',
    capacity: 20,
    schedule: [{ day: 'Monday', startTime: '07:00', endTime: '08:00' }, { day: 'Wednesday', startTime: '07:00', endTime: '08:00' }, { day: 'Friday', startTime: '07:00', endTime: '08:00' }],
    duration: 60,
    price: 25.00,
    trainerEmail: 'trainer1@fitpulse.com',
  },
  {
    name: 'Power HIIT Blast',
    description: 'High-intensity interval training to torch calories and build endurance.',
    category: 'HIIT',
    difficulty: 'ADVANCED',
    capacity: 15,
    schedule: [{ day: 'Tuesday', startTime: '18:00', endTime: '19:00' }, { day: 'Thursday', startTime: '18:00', endTime: '19:00' }],
    duration: 60,
    price: 30.00,
    trainerEmail: 'trainer2@fitpulse.com',
  },
  {
    name: 'Strength Foundations',
    description: 'Build a solid strength foundation with proper form and progressive overload.',
    category: 'Strength',
    difficulty: 'BEGINNER',
    capacity: 12,
    schedule: [{ day: 'Monday', startTime: '10:00', endTime: '11:00' }, { day: 'Wednesday', startTime: '10:00', endTime: '11:00' }],
    duration: 60,
    price: 35.00,
    trainerEmail: 'trainer2@fitpulse.com',
  },
  {
    name: 'Cardio Dance Party',
    description: 'Fun cardio workout with dance moves. No dance experience needed!',
    category: 'Cardio',
    difficulty: 'BEGINNER',
    capacity: 25,
    schedule: [{ day: 'Saturday', startTime: '09:00', endTime: '10:00' }],
    duration: 60,
    price: 20.00,
    trainerEmail: 'trainer3@fitpulse.com',
  },
  {
    name: 'Pilates Core Burn',
    description: 'Strengthen your core and improve flexibility with focused Pilates exercises.',
    category: 'Pilates',
    difficulty: 'INTERMEDIATE',
    capacity: 18,
    schedule: [{ day: 'Tuesday', startTime: '09:00', endTime: '10:00' }, { day: 'Thursday', startTime: '09:00', endTime: '10:00' }],
    duration: 60,
    price: 28.00,
    trainerEmail: 'trainer3@fitpulse.com',
  },
  {
    name: 'Advanced CrossFit',
    description: 'Challenge yourself with advanced CrossFit workouts for experienced athletes.',
    category: 'CrossFit',
    difficulty: 'ADVANCED',
    capacity: 10,
    schedule: [{ day: 'Monday', startTime: '17:00', endTime: '18:00' }, { day: 'Wednesday', startTime: '17:00', endTime: '18:00' }, { day: 'Friday', startTime: '17:00', endTime: '18:00' }],
    duration: 60,
    price: 40.00,
    trainerEmail: 'trainer2@fitpulse.com',
  },
  {
    name: 'Meditation & Mindfulness',
    description: 'Learn meditation techniques and mindfulness practices for mental wellness.',
    category: 'Wellness',
    difficulty: 'BEGINNER',
    capacity: 30,
    schedule: [{ day: 'Sunday', startTime: '08:00', endTime: '09:00' }],
    duration: 60,
    price: 15.00,
    trainerEmail: 'trainer1@fitpulse.com',
  },
  {
    name: 'Intermediate Yoga',
    description: 'Take your yoga practice to the next level with intermediate poses and flows.',
    category: 'Yoga',
    difficulty: 'INTERMEDIATE',
    capacity: 18,
    schedule: [{ day: 'Tuesday', startTime: '07:00', endTime: '08:00' }, { day: 'Thursday', startTime: '07:00', endTime: '08:00' }],
    duration: 60,
    price: 30.00,
    trainerEmail: 'trainer1@fitpulse.com',
  },
];

const CMS_SECTIONS = [
  {
    type: 'HERO',
    title: 'Welcome to FitPulse',
    subtitle: 'Transform Your Body, Transform Your Life',
    content: {
      ctaText: 'Get Started',
      ctaLink: '/membership',
      backgroundImage: '/images/hero-bg.jpg',
      tagline: 'Premium Fitness Experience',
    },
  },
  {
    type: 'ABOUT',
    title: 'About FitPulse',
    subtitle: 'Your Partner in Fitness Journey',
    content: {
      description: 'FitPulse is a premier fitness facility dedicated to helping you achieve your health and fitness goals.',
      mission: 'To empower individuals to lead healthier lives through fitness and wellness.',
      image: '/images/about.jpg',
      stats: { members: '2000+', trainers: '15+', years: '5+' },
    },
  },
  {
    type: 'FEATURES',
    title: 'Why Choose Us',
    subtitle: 'Everything You Need to Succeed',
    content: {
      features: [
        { title: 'Expert Trainers', description: 'Certified professionals to guide you', icon: 'trainer' },
        { title: 'Modern Equipment', description: 'State-of-the-art fitness equipment', icon: 'equipment' },
        { title: 'Flexible Classes', description: 'Wide variety of classes for all levels', icon: 'classes' },
        { title: 'Nutrition Plans', description: 'Personalized nutrition guidance', icon: 'nutrition' },
      ],
    },
  },
  {
    type: 'SERVICES',
    title: 'Our Services',
    subtitle: 'Comprehensive Fitness Solutions',
    content: {
      services: ['Personal Training', 'Group Classes', 'Yoga Sessions', 'HIIT Training', 'Nutrition Consultation', 'Recovery Sessions'],
    },
  },
  {
    type: 'TRAINERS',
    title: 'Meet Our Trainers',
    subtitle: 'Dedicated to Your Success',
    content: {
      subtitle: 'Our team of certified professionals is committed to helping you reach your fitness goals.',
    },
  },
  {
    type: 'PRICING',
    title: 'Pricing Plans',
    subtitle: 'Flexible Plans for Every Budget',
    content: {
      plans: [
        { name: 'Basic', price: 29, period: 'month', features: ['Access to gym floor', 'Locker room access', 'Basic classes'] },
        { name: 'Pro', price: 59, period: 'month', features: ['All Basic features', 'Unlimited classes', '1 PT session/month', 'Sauna access'] },
        { name: 'Elite', price: 99, period: 'month', features: ['All Pro features', 'Unlimited PT sessions', 'Nutrition plan', 'Priority booking'] },
      ],
    },
  },
  {
    type: 'TESTIMONIALS',
    title: 'What Members Say',
    subtitle: 'Success Stories from Our Community',
    content: {
      testimonials: [
        { name: 'John D.', role: 'Member for 2 years', text: 'FitPulse changed my life. Lost 30lbs and gained confidence!', rating: 5 },
        { name: 'Sarah M.', role: 'Member for 1 year', text: 'Best gym I have ever been to. The trainers are amazing!', rating: 5 },
      ],
    },
  },
  {
    type: 'FAQ',
    title: 'Frequently Asked Questions',
    subtitle: 'Find Answers to Common Questions',
    content: {
      faqs: [
        { question: 'What are your operating hours?', answer: 'We are open Monday-Friday 6AM-10PM, Saturday 8AM-8PM, Sunday 8AM-6PM.' },
        { question: 'Do you offer free trials?', answer: 'Yes! We offer a 7-day free trial for new members.' },
        { question: 'Can I freeze my membership?', answer: 'Yes, you can freeze your membership for up to 3 months per year.' },
      ],
    },
  },
  {
    type: 'CONTACT',
    title: 'Contact Us',
    subtitle: 'Get in Touch',
    content: {
      email: 'info@fitpulse.com',
      phone: '+1 (555) 123-4567',
      address: '123 Fitness Street, Gym City, FC 12345',
      mapEmbed: '',
    },
  },
  {
    type: 'FOOTER',
    title: 'FitPulse',
    subtitle: 'Your Fitness Journey Starts Here',
    content: {
      description: 'Premium fitness facility with expert trainers and modern equipment.',
      quickLinks: ['Home', 'About', 'Services', 'Classes', 'Contact'],
      socialLinks: { facebook: 'https://facebook.com/fitpulse', instagram: 'https://instagram.com/fitpulse', twitter: 'https://twitter.com/fitpulse' },
      copyright: `© ${new Date().getFullYear()} FitPulse. All rights reserved.`,
    },
  },
];

const SETTINGS = [
  // General
  { key: 'site_name', value: 'FitPulse' },
  { key: 'site_description', value: 'Your ultimate fitness destination' },
  { key: 'logo', value: '/images/logo.png' },
  { key: 'favicon', value: '/images/favicon.ico' },
  { key: 'contact_email', value: 'info@fitpulse.com' },
  { key: 'contact_phone', value: '+1 (555) 123-4567' },
  { key: 'address', value: '123 Fitness Street, Gym City, FC 12345' },
  { key: 'business_hours', value: '{"monday":"06:00-22:00","tuesday":"06:00-22:00","wednesday":"06:00-22:00","thursday":"06:00-22:00","friday":"06:00-22:00","saturday":"08:00-20:00","sunday":"08:00-18:00"}' },
  // Social
  { key: 'social_facebook', value: 'https://facebook.com/fitpulse' },
  { key: 'social_instagram', value: 'https://instagram.com/fitpulse' },
  { key: 'social_linkedin', value: 'https://linkedin.com/company/fitpulse' },
  { key: 'social_youtube', value: 'https://youtube.com/@fitpulse' },
  { key: 'social_twitter', value: 'https://twitter.com/fitpulse' },
  // Email
  { key: 'smtp_host', value: 'smtp.gmail.com' },
  { key: 'smtp_port', value: '587' },
  { key: 'smtp_username', value: '' },
  { key: 'smtp_password', value: '' },
  { key: 'sender_email', value: 'noreply@fitpulse.com' },
  // SEO
  { key: 'meta_title', value: 'FitPulse - Premium Fitness & Gym Management Platform' },
  { key: 'meta_description', value: 'Transform your body with expert trainers, modern equipment, and personalized fitness plans at FitPulse.' },
  { key: 'meta_keywords', value: 'fitness, gym, classes, trainers, yoga, HIIT, strength training, wellness' },
  { key: 'og_image', value: '/images/og-image.jpg' },
  // Security
  { key: 'session_timeout', value: '3600' },
  { key: 'password_policy', value: '{"minLength":8,"requireUppercase":true,"requireLowercase":true,"requireNumber":true,"requireSpecial":true}' },
  { key: 'login_attempt_limit', value: '5' },
];

// ─── Seed Function ───────────────────────────────────────

async function main() {
  console.log('🌱 Starting database seed...\n');

  // Clean existing data
  console.log('  Cleaning existing data...');
  await prisma.payment.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.class.deleteMany();
  await prisma.service.deleteMany();
  await prisma.trainer.deleteMany();
  await prisma.contactMessage.deleteMany();
  await prisma.gallery.deleteMany();
  await prisma.cmsSection.deleteMany();
  await prisma.siteSettings.deleteMany();
  await prisma.user.deleteMany();
  console.log('  ✓ Cleaned existing data\n');

  // Seed Users
  console.log('  Seeding users...');
  const hashedPassword = await bcrypt.hash('Admin@123', 12);
  const memberPassword = await bcrypt.hash('Member@123', 12);
  const trainerPassword = await bcrypt.hash('Trainer@123', 12);

  const userMap = {};
  for (const userData of USERS) {
    let password;
    if (userData.role === 'ADMIN') password = hashedPassword;
    else if (userData.role === 'TRAINER') password = trainerPassword;
    else password = memberPassword;

    const user = await prisma.user.create({
      data: {
        email: userData.email,
        password,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role,
        isVerified: userData.isVerified,
        isActive: userData.isActive,
      },
    });
    userMap[userData.email] = user;
  }
  console.log(`  ✓ Created ${USERS.length} users\n`);

  // Seed Trainers
  console.log('  Seeding trainers...');
  for (const trainerData of TRAINERS) {
    const user = userMap[trainerData.email];
    if (!user) continue;

    const { email, ...data } = trainerData;
    await prisma.trainer.create({
      data: {
        userId: user.id,
        bio: data.bio,
        specialization: data.specialization,
        designation: data.designation,
        experience: data.experience,
        hourlyRate: data.hourlyRate,
        rating: data.rating,
        reviewsCount: data.reviewsCount,
        skills: parseJsonField(data.skills),
        programs: parseJsonField(data.programs),
        certificates: parseJsonField(data.certificates),
        achievements: parseJsonField(data.achievements),
        availableDays: parseJsonField(data.availableDays),
        socialLinks: parseJsonField(data.socialLinks),
        status: 'ACTIVE',
      },
    });
  }
  console.log(`  ✓ Created ${TRAINERS.length} trainers\n`);

  // Get trainer IDs for classes
  const trainerRecords = await prisma.trainer.findMany({
    include: { user: { select: { email: true } } },
  });
  const trainerByEmail = {};
  for (const t of trainerRecords) {
    trainerByEmail[t.user.email] = t.id;
  }

  // Seed Classes
  console.log('  Seeding classes...');
  for (const classData of CLASSES) {
    const trainerId = trainerByEmail[classData.trainerEmail];
    if (!trainerId) continue;

    const { trainerEmail, ...data } = classData;
    await prisma.class.create({
      data: {
        trainerId,
        name: data.name,
        description: data.description,
        category: data.category,
        difficulty: data.difficulty,
        capacity: data.capacity,
        availableSeats: data.capacity,
        schedule: parseJsonField(data.schedule),
        duration: data.duration,
        price: data.price,
        status: 'ACTIVE',
      },
    });
  }
  console.log(`  ✓ Created ${CLASSES.length} classes\n`);

  // Seed CMS Sections
  console.log('  Seeding CMS sections...');
  for (const sectionData of CMS_SECTIONS) {
    await prisma.cmsSection.create({
      data: {
        type: sectionData.type,
        title: sectionData.title,
        subtitle: sectionData.subtitle,
        content: parseJsonField(sectionData.content),
        status: 'ACTIVE',
      },
    });
  }
  console.log(`  ✓ Created ${CMS_SECTIONS.length} CMS sections\n`);

  // Seed Settings
  console.log('  Seeding settings...');
  for (const settingData of SETTINGS) {
    await prisma.siteSettings.create({
      data: {
        key: settingData.key,
        value: settingData.value,
      },
    });
  }
  console.log(`  ✓ Created ${SETTINGS.length} settings\n`);

  // Seed Sample Bookings
  console.log('  Seeding sample bookings...');
  const memberUsers = USERS.filter((u) => u.role === 'MEMBER').map((u) => userMap[u.email]);
  const classes = await prisma.class.findMany({ take: 4 });

  const bookingStatuses = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];
  let bookingCount = 0;

  for (let i = 0; i < Math.min(memberUsers.length, classes.length); i++) {
    const member = memberUsers[i];
    const cls = classes[i % classes.length];
    const status = bookingStatuses[i % bookingStatuses.length];

    const bookingDate = new Date();
    bookingDate.setDate(bookingDate.getDate() + (i * 2));

    await prisma.booking.create({
      data: {
        userId: member.id,
        classId: cls.id,
        trainerId: cls.trainerId,
        bookingDate,
        bookingTime: '09:00',
        status,
        attended: status === 'COMPLETED',
        notes: i % 2 === 0 ? 'Looking forward to this class!' : null,
      },
    });
    bookingCount++;
  }
  console.log(`  ✓ Created ${bookingCount} sample bookings\n`);

  console.log('✅ Database seed completed successfully!\n');
  console.log('  ┌──────────────────────────────────────────┐');
  console.log('  │           Seed Summary                    │');
  console.log('  ├──────────────────────────────────────────┤');
  console.log(`  │  Users:      ${String(USERS.length).padEnd(29)}│`);
  console.log(`  │  Trainers:   ${String(TRAINERS.length).padEnd(29)}│`);
  console.log(`  │  Classes:    ${String(CLASSES.length).padEnd(29)}│`);
  console.log(`  │  CMS:        ${String(CMS_SECTIONS.length).padEnd(29)}│`);
  console.log(`  │  Settings:   ${String(SETTINGS.length).padEnd(29)}│`);
  console.log(`  │  Bookings:   ${String(bookingCount).padEnd(29)}│`);
  console.log('  └──────────────────────────────────────────┘\n');
  console.log('  Test Credentials:');
  console.log('  ─────────────────');
  console.log('  Admin:   admin@fitpulse.com / Admin@123');
  console.log('  Trainer: trainer1@fitpulse.com / Trainer@123');
  console.log('  Member:  member1@fitpulse.com / Member@123');
  console.log('');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
