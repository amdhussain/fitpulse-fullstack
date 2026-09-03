const trainingGoals = [
  { id: "weight-loss", label: "Weight Loss", icon: "scale" },
  { id: "weight-gain", label: "Weight Gain", icon: "trending-up" },
  { id: "bodybuilding", label: "Body Building", icon: "dumbbell" },
  { id: "crossfit", label: "CrossFit", icon: "zap" },
  { id: "yoga", label: "Yoga", icon: "heart" },
  { id: "cardio", label: "Cardio", icon: "activity" },
  { id: "strength-training", label: "Strength Training", icon: "target" },
  { id: "personal-training", label: "Personal Training", icon: "user" },
];

const genderOptions = [
  { id: "male", label: "Male" },
  { id: "female", label: "Female" },
  { id: "other", label: "Other" },
  { id: "prefer-not-to-say", label: "Prefer not to say" },
];

const timeSlots = [
  { id: "05:00", label: "Early Morning (5AM - 7AM)" },
  { id: "07:00", label: "Morning (7AM - 10AM)" },
  { id: "10:00", label: "Midday (10AM - 1PM)" },
  { id: "13:00", label: "Afternoon (1PM - 4PM)" },
  { id: "16:00", label: "Evening (4PM - 7PM)" },
  { id: "19:00", label: "Night (7PM - 10PM)" },
];

const pageMetadata = {
  title: "Book Your Session",
  subtitle: "Book Now",
  description: "Schedule your personalized fitness session with our expert trainers. Choose your goals, pick your trainer, and start your transformation journey today.",
  heroImage: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&h=800&fit=crop&auto=format&q=80",
};

export function getTrainingGoals() {
  return trainingGoals;
}

export function getGenderOptions() {
  return genderOptions;
}

export function getTimeSlots() {
  return timeSlots;
}

export function getPageMetadata() {
  return pageMetadata;
}
