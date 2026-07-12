export function calculateBMI(weight, height, unit = "metric") {
  let bmi;
  if (unit === "imperial") {
    bmi = (weight / (height * height)) * 703;
  } else {
    bmi = weight / ((height / 100) * (height / 100));
  }
  const rounded = Math.round(bmi * 10) / 10;
  let category, color, description;
  if (rounded < 18.5) {
    category = "Underweight";
    color = "cyan";
    description = "Your BMI suggests you are below a healthy weight range.";
  } else if (rounded < 25) {
    category = "Normal";
    color = "emerald";
    description = "Great! Your BMI is within the healthy weight range.";
  } else if (rounded < 30) {
    category = "Overweight";
    color = "amber";
    description = "Your BMI suggests you are above the healthy weight range.";
  } else {
    category = "Obese";
    color = "red";
    description = "Your BMI indicates a high body weight. Consider consulting a professional.";
  }
  return { bmi: rounded, category, color, description };
}

export function calculateBMR(weight, height, age, gender, unit = "metric") {
  let w = weight;
  let h = height;
  if (unit === "imperial") {
    w = weight * 0.453592;
    h = height * 2.54;
  }
  let bmr;
  if (gender === "male") {
    bmr = 10 * w + 6.25 * h - 5 * age + 5;
  } else {
    bmr = 10 * w + 6.25 * h - 5 * age - 161;
  }
  const rounded = Math.round(bmr);
  let level, description;
  if (gender === "male") {
    if (rounded < 1500) {
      level = "Low";
      description = "Your BMR is below average. This may indicate a slower metabolism.";
    } else if (rounded < 1800) {
      level = "Average";
      description = "Your BMR is within the normal range for males.";
    } else {
      level = "High";
      description = "Your BMR is above average, indicating a faster metabolism.";
    }
  } else {
    if (rounded < 1200) {
      level = "Low";
      description = "Your BMR is below average. This may indicate a slower metabolism.";
    } else if (rounded < 1500) {
      level = "Average";
      description = "Your BMR is within the normal range for females.";
    } else {
      level = "High";
      description = "Your BMR is above average, indicating a faster metabolism.";
    }
  }
  return { bmr: rounded, level, description, gender };
}

const activityMultipliers = [
  { value: "sedentary", label: "Sedentary", multiplier: 1.2, description: "Little or no exercise" },
  { value: "light", label: "Lightly Active", multiplier: 1.375, description: "Light exercise 1-3 days/week" },
  { value: "moderate", label: "Moderately Active", multiplier: 1.55, description: "Moderate exercise 3-5 days/week" },
  { value: "active", label: "Very Active", multiplier: 1.725, description: "Hard exercise 6-7 days/week" },
  { value: "extra", label: "Extra Active", multiplier: 1.9, description: "Very hard exercise, physical job" },
];

export function getActivityMultipliers() {
  return activityMultipliers;
}

export function calculateCalories(weight, height, age, gender, activityLevel, unit = "metric") {
  const bmrResult = calculateBMR(weight, height, age, gender, unit);
  const activity = activityMultipliers.find((a) => a.value === activityLevel) || activityMultipliers[0];
  const maintenance = Math.round(bmrResult.bmr * activity.multiplier);
  const lose = Math.round(maintenance - 500);
  const gain = Math.round(maintenance + 300);
  return {
    maintenance,
    lose: Math.max(lose, 1200),
    gain,
    bmr: bmrResult.bmr,
    activityLabel: activity.label,
    activityDescription: activity.description,
    description: `Based on your profile and ${activity.label.toLowerCase()} lifestyle, here are your estimated daily calorie needs.`,
  };
}

export function calculateIdealWeight(height, gender, unit = "metric") {
  let h = height;
  if (unit === "imperial") {
    h = height * 2.54;
  }
  const hInches = h / 2.54;
  let low, high;
  if (gender === "male") {
    low = Math.round(52 + 1.9 * (hInches - 60));
    high = Math.round(56 + 1.9 * (hInches - 60));
  } else {
    low = Math.round(49 + 1.7 * (hInches - 60));
    high = Math.round(52.7 + 1.7 * (hInches - 60));
  }
  const mid = Math.round((low + high) / 2);
  let lowDisplay = low;
  let highDisplay = high;
  let midDisplay = mid;
  if (unit === "imperial") {
    lowDisplay = Math.round(low * 2.20462);
    highDisplay = Math.round(high * 2.20462);
    midDisplay = Math.round(mid * 2.20462);
  }
  return {
    low: lowDisplay,
    high: highDisplay,
    ideal: midDisplay,
    unit: unit === "imperial" ? "lbs" : "kg",
    range: `${lowDisplay} - ${highDisplay} ${unit === "imperial" ? "lbs" : "kg"}`,
    description: `Based on your height and gender, your ideal weight range is ${lowDisplay} - ${highDisplay} ${unit === "imperial" ? "lbs" : "kg"}.`,
  };
}

export function calculateWaterIntake(weight, activityLevel, unit = "metric") {
  let w = weight;
  if (unit === "imperial") {
    w = weight * 0.453592;
  }
  const baseLiters = w * 0.033;
  const activityBonus = {
    sedentary: 0,
    light: 0.3,
    moderate: 0.5,
    active: 0.7,
    extra: 1.0,
  };
  const bonus = activityBonus[activityLevel] || 0;
  const totalLiters = Math.round((baseLiters + bonus) * 100) / 100;
  const totalOz = Math.round(totalLiters * 33.814);
  const totalGlasses = Math.round(totalLiters * 4);
  const perHour = Math.round((totalLiters / 16) * 100) / 100;
  return {
    liters: totalLiters,
    ounces: totalOz,
    glasses: totalGlasses,
    perHour,
    description: `For your body weight and activity level, you should aim for approximately ${totalLiters} liters (${totalOz} oz) of water daily.`,
  };
}

export function calculateProtein(weight, activityLevel, goal, unit = "metric") {
  let w = weight;
  if (unit === "imperial") {
    w = weight * 0.453592;
  }
  const ranges = {
    sedentary: { min: 0.8, max: 1.0 },
    light: { min: 1.0, max: 1.2 },
    moderate: { min: 1.2, max: 1.6 },
    active: { min: 1.6, max: 2.0 },
    extra: { min: 2.0, max: 2.4 },
  };
  const goalBonus = {
    maintain: 0,
    lose: 0.1,
    gain: 0.2,
    muscle: 0.4,
  };
  const base = ranges[activityLevel] || ranges.moderate;
  const bonus = goalBonus[goal] || 0;
  const minGrams = Math.round((base.min + bonus) * w);
  const maxGrams = Math.round((base.max + bonus) * w);
  const midGrams = Math.round((minGrams + maxGrams) / 2);
  return {
    min: minGrams,
    max: maxGrams,
    ideal: midGrams,
    perKg: Math.round(((base.min + base.max) / 2 + bonus) * 10) / 10,
    description: `Based on your body weight and activity level, you need ${minGrams} - ${maxGrams}g of protein daily.`,
  };
}

export function calculateBodyFat(gender, age, weight, neck, waist, height, unit = "metric") {
  let n = neck;
  let wa = waist;
  let h = height;
  if (unit === "imperial") {
    n = neck * 2.54;
    wa = waist * 2.54;
    h = height * 2.54;
  }
  let bodyFat;
  if (gender === "male") {
    bodyFat = 495 / (1.0324 - 0.19077 * Math.log10(wa - n) + 0.15456 * Math.log10(h)) - 450;
  } else {
    bodyFat = 495 / (1.29579 - 0.35004 * Math.log10(wa + n - 10.10) + 0.22100 * Math.log10(h)) - 450;
  }
  const rounded = Math.round(bodyFat * 10) / 10;
  let category, color, description;
  if (gender === "male") {
    if (rounded < 6) {
      category = "Essential Fat";
      color = "cyan";
      description = "Essential fat level. This is the minimum necessary for basic health.";
    } else if (rounded < 14) {
      category = "Athletic";
      color = "emerald";
      description = "Athletic body fat range. Excellent for competitive athletes.";
    } else if (rounded < 18) {
      category = "Fitness";
      color = "emerald";
      description = "Fitness level. A healthy and lean body composition.";
    } else if (rounded < 25) {
      category = "Average";
      color = "amber";
      description = "Average body fat range for adult males.";
    } else {
      category = "Obese";
      color = "red";
      description = "Above the healthy range. Consider lifestyle changes.";
    }
  } else {
    if (rounded < 14) {
      category = "Essential Fat";
      color = "cyan";
      description = "Essential fat level. This is the minimum necessary for basic health.";
    } else if (rounded < 21) {
      category = "Athletic";
      color = "emerald";
      description = "Athletic body fat range. Excellent for competitive athletes.";
    } else if (rounded < 25) {
      category = "Fitness";
      color = "emerald";
      description = "Fitness level. A healthy and lean body composition.";
    } else if (rounded < 32) {
      category = "Average";
      color = "amber";
      description = "Average body fat range for adult females.";
    } else {
      category = "Obese";
      color = "red";
      description = "Above the healthy range. Consider lifestyle changes.";
    }
  }
  return { bodyFat: rounded, category, color, description, age };
}
