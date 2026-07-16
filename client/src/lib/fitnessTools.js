import {
  FiPieChart, FiZap, FiActivity, FiTarget, FiHeart,
  FiDroplet, FiTrendingUp, FiGrid, FiAlertTriangle, FiClock,
  FiUsers, FiAward, FiNavigation, FiMap, FiSun, FiCrosshair,
  FiTrendingDown, FiArrowUp, FiCoffee, FiBookOpen, FiCompass,
} from "react-icons/fi";

export const tools = [
  { id: "bmi", name: "BMI Calculator", slug: "bmi", description: "Calculate Body Mass Index to assess weight category and health risk.", category: "health", icon: "FiPieChart", color: "emerald", dailyUsers: 342, monthlyUsers: 8420 },
  { id: "bmr", name: "BMR Calculator", slug: "bmr", description: "Find your Basal Metabolic Rate to know calories burned at rest.", category: "health", icon: "FiZap", color: "amber", dailyUsers: 287, monthlyUsers: 7100 },
  { id: "tdee", name: "TDEE Calculator", slug: "tdee", description: "Calculate your Total Daily Energy Expenditure based on activity level.", category: "health", icon: "FiActivity", color: "orange", dailyUsers: 310, monthlyUsers: 8800 },
  { id: "calories", name: "Daily Calories Calculator", slug: "calories", description: "Determine ideal daily calorie intake based on goals and activity level.", category: "nutrition", icon: "FiActivity", color: "orange", dailyUsers: 456, monthlyUsers: 12300 },
  { id: "body-fat", name: "Body Fat Calculator", slug: "body-fat", description: "Estimate body fat percentage using the U.S. Navy method.", category: "health", icon: "FiTarget", color: "red", dailyUsers: 167, monthlyUsers: 4100 },
  { id: "lean-body-mass", name: "Lean Body Mass Calculator", slug: "lean-body-mass", description: "Calculate your lean body mass excluding body fat.", category: "health", icon: "FiUsers", color: "emerald", dailyUsers: 134, monthlyUsers: 3500 },
  { id: "ffmi", name: "FFMI Calculator", slug: "ffmi", description: "Calculate Fat-Free Mass Index to assess muscular development.", category: "health", icon: "FiAward", color: "amber", dailyUsers: 98, monthlyUsers: 2800 },
  { id: "ideal-weight", name: "Ideal Weight Calculator", slug: "ideal-weight", description: "Discover your ideal weight range based on height and body frame.", category: "weight", icon: "FiHeart", color: "purple", dailyUsers: 234, monthlyUsers: 6800 },
  { id: "heart-rate", name: "Heart Rate Calculator", slug: "heart-rate", description: "Calculate your heart rate zones for optimal training intensity.", category: "health", icon: "FiHeart", color: "red", dailyUsers: 256, monthlyUsers: 7200 },
  { id: "target-heart-rate", name: "Target Heart Rate Calculator", slug: "target-heart-rate", description: "Find your target heart rate zone using the Karvonen formula.", category: "health", icon: "FiCrosshair", color: "rose", dailyUsers: 189, monthlyUsers: 5100 },
  { id: "water", name: "Water Intake Calculator", slug: "water", description: "Calculate optimal daily water intake for hydration and performance.", category: "lifestyle", icon: "FiDroplet", color: "blue", dailyUsers: 312, monthlyUsers: 9200 },
  { id: "protein", name: "Protein Intake Calculator", slug: "protein", description: "Calculate optimal daily protein for muscle building and recovery.", category: "nutrition", icon: "FiTrendingUp", color: "cyan", dailyUsers: 289, monthlyUsers: 7600 },
  { id: "macro", name: "Macro Calculator", slug: "macro", description: "Calculate optimal macronutrient split for protein, carbs, and fats.", category: "nutrition", icon: "FiGrid", color: "rose", dailyUsers: 198, monthlyUsers: 5200 },
  { id: "one-rep-max", name: "One Rep Max Calculator", slug: "one-rep-max", description: "Calculate your one-rep max for any lift using proven formulas.", category: "strength", icon: "FiAlertTriangle", color: "purple", dailyUsers: 145, monthlyUsers: 3900 },
  { id: "pace", name: "Pace Calculator", slug: "pace", description: "Calculate running pace, finish times, and training zones.", category: "cardio", icon: "FiClock", color: "red", dailyUsers: 198, monthlyUsers: 5400 },
  { id: "running-pace", name: "Running Pace Calculator", slug: "running-pace", description: "Calculate your running pace and estimated finish times.", category: "cardio", icon: "FiNavigation", color: "blue", dailyUsers: 278, monthlyUsers: 7800 },
  { id: "cycling", name: "Cycling Calculator", slug: "cycling", description: "Calculate cycling speed, distance, and calorie burn.", category: "cardio", icon: "FiCompass", color: "cyan", dailyUsers: 167, monthlyUsers: 4600 },
  { id: "walking-calories", name: "Walking Calories Calculator", slug: "walking-calories", description: "Estimate calories burned while walking based on weight and pace.", category: "cardio", icon: "FiMap", color: "emerald", dailyUsers: 223, monthlyUsers: 6100 },
  { id: "calories-burn", name: "Calories Burn Calculator", slug: "calories-burn", description: "Calculate calories burned during any exercise using MET values.", category: "nutrition", icon: "FiSun", color: "orange", dailyUsers: 345, monthlyUsers: 9500 },
  { id: "steps", name: "Steps Calculator", slug: "steps", description: "Convert steps to distance and estimate walking time.", category: "lifestyle", icon: "FiArrowUp", color: "blue", dailyUsers: 412, monthlyUsers: 11200 },
  { id: "nutrition", name: "Nutrition Calculator", slug: "nutrition", description: "Get a complete nutritional summary for your daily intake goals.", category: "nutrition", icon: "FiCoffee", color: "amber", dailyUsers: 156, monthlyUsers: 4200 },
  { id: "meal-planner", name: "Meal Planner", slug: "meal-planner", description: "Plan your meals and track daily macro and calorie targets.", category: "nutrition", icon: "FiBookOpen", color: "rose", dailyUsers: 134, monthlyUsers: 3800 },
];

export const iconMap = {
  FiPieChart, FiZap, FiActivity, FiTarget, FiHeart,
  FiDroplet, FiTrendingUp, FiGrid, FiAlertTriangle, FiClock,
  FiUsers, FiAward, FiNavigation, FiMap, FiSun, FiCrosshair,
  FiTrendingDown, FiArrowUp, FiCoffee, FiBookOpen, FiCompass,
};

export const colorMap = {
  emerald: { gradient: "from-emerald-500 to-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/40", text: "text-emerald-600 dark:text-emerald-400", border: "border-emerald-200 dark:border-emerald-800", ring: "ring-emerald-100 dark:ring-emerald-900" },
  amber: { gradient: "from-amber-500 to-amber-400", bg: "bg-amber-50 dark:bg-amber-950/40", text: "text-amber-600 dark:text-amber-400", border: "border-amber-200 dark:border-amber-800", ring: "ring-amber-100 dark:ring-amber-900" },
  orange: { gradient: "from-orange-500 to-orange-400", bg: "bg-orange-50 dark:bg-orange-950/40", text: "text-orange-600 dark:text-orange-400", border: "border-orange-200 dark:border-orange-800", ring: "ring-orange-100 dark:ring-orange-900" },
  red: { gradient: "from-red-500 to-red-400", bg: "bg-red-50 dark:bg-red-950/40", text: "text-red-600 dark:text-red-400", border: "border-red-200 dark:border-red-800", ring: "ring-red-100 dark:ring-red-900" },
  purple: { gradient: "from-purple-500 to-purple-400", bg: "bg-purple-50 dark:bg-purple-950/40", text: "text-purple-600 dark:text-purple-400", border: "border-purple-200 dark:border-purple-800", ring: "ring-purple-100 dark:ring-purple-900" },
  blue: { gradient: "from-blue-500 to-blue-400", bg: "bg-blue-50 dark:bg-blue-950/40", text: "text-blue-600 dark:text-blue-400", border: "border-blue-200 dark:border-blue-800", ring: "ring-blue-100 dark:ring-blue-900" },
  cyan: { gradient: "from-cyan-500 to-cyan-400", bg: "bg-cyan-50 dark:bg-cyan-950/40", text: "text-cyan-600 dark:text-cyan-400", border: "border-cyan-200 dark:border-cyan-800", ring: "ring-cyan-100 dark:ring-cyan-900" },
  rose: { gradient: "from-rose-500 to-rose-400", bg: "bg-rose-50 dark:bg-rose-950/40", text: "text-rose-600 dark:text-rose-400", border: "border-rose-200 dark:border-rose-800", ring: "ring-rose-100 dark:ring-rose-900" },
};

export const categories = [
  { value: "health", label: "Health" },
  { value: "weight", label: "Weight" },
  { value: "nutrition", label: "Nutrition" },
  { value: "strength", label: "Strength" },
  { value: "cardio", label: "Cardio" },
  { value: "lifestyle", label: "Lifestyle" },
];

export const activityLevels = [
  { value: 1.2, label: "Sedentary (little or no exercise)" },
  { value: 1.375, label: "Lightly Active (1-3 days/week)" },
  { value: 1.55, label: "Moderately Active (3-5 days/week)" },
  { value: 1.725, label: "Very Active (6-7 days/week)" },
  { value: 1.9, label: "Extra Active (very hard exercise)" },
];

function toMetric(weight, height, unit) {
  if (unit === "imperial") {
    return { weightKg: weight * 0.453592, heightCm: height * 2.54 };
  }
  return { weightKg: weight, heightCm: height };
}

export function calculateBMI(weight, height, unit = "metric") {
  const { weightKg, heightCm } = toMetric(weight, height, unit);
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  let category = "Normal";
  if (bmi < 18.5) category = "Underweight";
  else if (bmi < 25) category = "Normal";
  else if (bmi < 30) category = "Overweight";
  else category = "Obese";
  return { value: bmi.toFixed(1), category, unit: "kg/m²" };
}

export function calculateBMR(weight, height, age, gender, unit = "metric") {
  const { weightKg, heightCm } = toMetric(weight, height, unit);
  let bmr;
  if (gender === "male") {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  } else {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
  }
  return { value: Math.round(bmr), unit: "cal/day" };
}

export function calculateTDEE(weight, height, age, gender, activityLevel, unit = "metric") {
  const bmr = calculateBMR(weight, height, age, gender, unit);
  const tdee = Math.round(bmr.value * activityLevel);
  return { value: tdee, bmr: bmr.value, unit: "cal/day" };
}

export function calculateCalories(weight, height, age, gender, activityLevel, unit = "metric") {
  const bmr = calculateBMR(weight, height, age, gender, unit);
  const tdee = Math.round(bmr.value * activityLevel);
  return {
    bmr: bmr.value,
    maintenance: tdee,
    lose: tdee - 500,
    gain: tdee + 500,
    unit: "cal/day",
  };
}

export function calculateBodyFat(weight, height, neck, waist, gender, unit = "metric") {
  let w, h, n, wa;
  if (unit === "imperial") {
    w = weight; h = height; n = neck; wa = waist;
  } else {
    w = weight * 2.20462; h = height / 2.54; n = neck / 2.54; wa = waist / 2.54;
  }
  let bf;
  if (gender === "male") {
    bf = 86.101 * Math.log10(wa - n) - 70.041 * Math.log10(h) + 36.76;
  } else {
    bf = 163.205 * Math.log10(wa + (h * 0.15724) - n * 0.73278) - 97.684;
  }
  return { value: Math.max(0, bf).toFixed(1), unit: "%" };
}

export function calculateLeanBodyMass(weight, height, neck, waist, gender, unit = "metric") {
  const bf = calculateBodyFat(weight, height, neck, waist, gender, unit);
  const weightKg = unit === "imperial" ? weight * 0.453592 : weight;
  const leanMass = weightKg * (1 - parseFloat(bf.value) / 100);
  return { value: leanMass.toFixed(1), unit: "kg", bfPercent: bf.value };
}

export function calculateFFMI(weight, height, neck, waist, gender, unit = "metric") {
  const { weightKg, heightCm } = toMetric(weight, height, unit);
  const bf = calculateBodyFat(weight, height, neck, waist, gender, unit);
  const leanMass = weightKg * (1 - parseFloat(bf.value) / 100);
  const heightM = heightCm / 100;
  const ffmi = (leanMass / (heightM * heightM)) + 6.1 * (1.8 - heightM);
  return { value: ffmi.toFixed(1), unit: "kg/m²", category: ffmi < 18 ? "Below Average" : ffmi < 20 ? "Average" : ffmi < 22 ? "Above Average" : ffmi < 23 ? "Superior" : "Elite" };
}

export function calculateIdealWeight(height, gender, unit = "metric") {
  const heightCm = unit === "imperial" ? height * 2.54 : height;
  const heightIn = heightCm / 2.54;
  const base = gender === "male" ? 50 : 45.5;
  const perInch = gender === "male" ? 2.3 : 2.3;
  const low = Math.round(base + perInch * (heightIn - 60));
  const high = Math.round(low + 12);
  return { low, high, unit: unit === "imperial" ? "lbs" : "kg" };
}

export function calculateHeartRate(age, restingHR) {
  const maxHR = 220 - age;
  const zones = [
    { zone: "Zone 1 (Warm Up)", min: Math.round(maxHR * 0.5), max: Math.round(maxHR * 0.6) },
    { zone: "Zone 2 (Fat Burn)", min: Math.round(maxHR * 0.6), max: Math.round(maxHR * 0.7) },
    { zone: "Zone 3 (Aerobic)", min: Math.round(maxHR * 0.7), max: Math.round(maxHR * 0.8) },
    { zone: "Zone 4 (Anaerobic)", min: Math.round(maxHR * 0.8), max: Math.round(maxHR * 0.9) },
    { zone: "Zone 5 (VO2 Max)", min: Math.round(maxHR * 0.9), max: maxHR },
  ];
  const karvonenMin = Math.round((maxHR - restingHR) * 0.5 + restingHR);
  const karvonenMax = Math.round((maxHR - restingHR) * 0.85 + restingHR);
  return { maxHR, zones, karvonenMin, karvonenMax, unit: "bpm" };
}

export function calculateTargetHeartRate(age, restingHR, intensity) {
  const maxHR = 220 - age;
  const target = Math.round((maxHR - restingHR) * (intensity / 100) + restingHR);
  const minTarget = Math.round((maxHR - restingHR) * 0.5 + restingHR);
  const maxTarget = Math.round((maxHR - restingHR) * 0.85 + restingHR);
  return { value: target, min: minTarget, max: maxTarget, maxHR, unit: "bpm" };
}

export function calculateWater(weight, unit = "metric") {
  const weightKg = unit === "imperial" ? weight * 0.453592 : weight;
  const liters = (weightKg * 0.033).toFixed(1);
  const glasses = Math.ceil(liters * 4);
  return { liters, glasses };
}

export function calculateProtein(weight, activityLevel, unit = "metric") {
  const weightKg = unit === "imperial" ? weight * 0.453592 : weight;
  let factor = 0.8;
  if (activityLevel <= 1.375) factor = 1.0;
  else if (activityLevel <= 1.55) factor = 1.4;
  else if (activityLevel <= 1.725) factor = 1.8;
  else factor = 2.2;
  const min = Math.round(weightKg * (factor - 0.2));
  const max = Math.round(weightKg * (factor + 0.2));
  return { min, max, unit: "g/day" };
}

export function calculateMacros(weight, height, age, gender, activityLevel, goal, unit = "metric") {
  const cals = calculateCalories(weight, height, age, gender, activityLevel, unit);
  let target = cals.maintenance;
  if (goal === "lose") target = cals.lose;
  else if (goal === "gain") target = cals.gain;
  const { weightKg } = toMetric(weight, height, unit);
  const protein = Math.round(weightKg * 2.0);
  const fat = Math.round((target * 0.25) / 9);
  const carbs = Math.round((target - protein * 4 - fat * 9) / 4);
  return { calories: target, protein, fat, carbs };
}

export function calculateOneRepMax(weight, reps, unit = "metric") {
  const kg = unit === "imperial" ? weight * 0.453592 : weight;
  const lbs = unit === "imperial" ? weight : weight * 2.20462;
  const epley = Math.round(kg * (1 + reps / 30));
  const brzycki = Math.round(kg * (36 / (37 - reps)));
  const lombardi = Math.round(kg * Math.pow(reps, 0.1));
  return {
    epley: { kg: epley, lbs: Math.round(epley * 2.20462) },
    brzycki: { kg: brzycki, lbs: Math.round(brzycki * 2.20462) },
    lombardi: { kg: lombardi, lbs: Math.round(lombardi * 2.20462) },
  };
}

export function calculatePace(distance, hours, minutes, seconds) {
  const totalSeconds = hours * 3600 + minutes * 60 + seconds;
  const paceSeconds = totalSeconds / distance;
  const paceMin = Math.floor(paceSeconds / 60);
  const paceSec = Math.round(paceSeconds % 60);
  const speed = (distance / (totalSeconds / 3600)).toFixed(1);
  return { pace: `${paceMin}:${String(paceSec).padStart(2, "0")}`, speed, paceMin, paceSec };
}

export function calculateRunningPace(distance, hours, minutes, seconds) {
  const totalSeconds = hours * 3600 + minutes * 60 + seconds;
  const paceSeconds = totalSeconds / distance;
  const paceMin = Math.floor(paceSeconds / 60);
  const paceSec = Math.round(paceSeconds % 60);
  const speed = (distance / (totalSeconds / 3600)).toFixed(1);
  const fiveK = Math.round(paceSeconds * 5);
  const tenK = Math.round(paceSeconds * 10);
  const halfMarathon = Math.round(paceSeconds * 21.0975);
  const marathon = Math.round(paceSeconds * 42.195);
  const formatTime = (s) => `${Math.floor(s / 3600)}:${String(Math.floor((s % 3600) / 60)).padStart(2, "0")}:${String(Math.round(s % 60)).padStart(2, "0")}`;
  return {
    pace: `${paceMin}:${String(paceSec).padStart(2, "0")}`,
    speed,
    fiveK: formatTime(fiveK),
    tenK: formatTime(tenK),
    halfMarathon: formatTime(halfMarathon),
    marathon: formatTime(marathon),
    unit: "min/km",
  };
}

export function calculateCycling(speed, weight, hours, minutes) {
  const weightKg = weight;
  const totalHours = hours + minutes / 60;
  const met = speed < 16 ? 4 : speed < 20 ? 6.8 : speed < 25 ? 8 : speed < 30 ? 10 : 12;
  const calories = Math.round(met * weightKg * totalHours);
  const distance = (speed * totalHours).toFixed(1);
  return { calories, distance, met, unit: "kcal" };
}

export function calculateWalkingCalories(weight, pace, minutes, unit = "metric") {
  const weightKg = unit === "imperial" ? weight * 0.453592 : weight;
  const met = pace < 3 ? 2.0 : pace < 4 ? 2.5 : pace < 5 ? 3.0 : pace < 6 ? 3.5 : 4.0;
  const calories = Math.round(met * weightKg * (minutes / 60));
  const distance = ((pace * minutes) / 60).toFixed(2);
  return { calories, distance, met, unit: "kcal" };
}

export function calculateCaloriesBurn(weight, met, minutes, unit = "metric") {
  const weightKg = unit === "imperial" ? weight * 0.453592 : weight;
  const calories = Math.round(met * weightKg * (minutes / 60));
  return { value: calories, unit: "kcal" };
}

export function calculateSteps(distance, strideLength) {
  const strideCm = strideLength || 75;
  const steps = Math.round((distance * 100000) / strideCm);
  const timeMin = Math.round((distance * 1000) / (4.8 * 1000 / 60));
  return { steps, timeMin, unit: "steps" };
}

export function calculateNutrition(weight, height, age, gender, activityLevel, goal, unit = "metric") {
  const cals = calculateCalories(weight, height, age, gender, activityLevel, unit);
  const macros = calculateMacros(weight, height, age, gender, activityLevel, goal, unit);
  const water = calculateWater(weight, unit);
  const protein = calculateProtein(weight, activityLevel, unit);
  return { ...cals, ...macros, water: water.liters, proteinRange: protein, unit: "cal/day" };
}

export function calculateMealPlanner(weight, height, age, gender, activityLevel, goal, unit = "metric") {
  const nutrition = calculateNutrition(weight, height, age, gender, activityLevel, goal, unit);
  const breakfast = Math.round(nutrition.calories * 0.25);
  const lunch = Math.round(nutrition.calories * 0.35);
  const dinner = Math.round(nutrition.calories * 0.30);
  const snacks = Math.round(nutrition.calories * 0.10);
  return { ...nutrition, breakfast, lunch, dinner, snacks, unit: "cal" };
}
