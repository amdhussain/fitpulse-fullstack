import {
  FiActivity,
  FiDroplet,
  FiZap,
  FiHeart,
  FiShield,
  FiTarget,
  FiPieChart,
  FiSun,
  FiWatch,
} from "react-icons/fi";

const colorSchemes = {
  cyan: { bg: "from-cyan-500/15 to-teal-500/10", border: "border-cyan-500/30", text: "text-cyan-400", glow: "shadow-cyan-500/20", ring: "ring-cyan-500/30" },
  emerald: { bg: "from-emerald-500/15 to-green-500/10", border: "border-emerald-500/30", text: "text-emerald-400", glow: "shadow-emerald-500/20", ring: "ring-emerald-500/30" },
  amber: { bg: "from-amber-500/15 to-orange-500/10", border: "border-amber-500/30", text: "text-amber-400", glow: "shadow-amber-500/20", ring: "ring-amber-500/30" },
  red: { bg: "from-red-500/15 to-rose-500/10", border: "border-red-500/30", text: "text-red-400", glow: "shadow-red-500/20", ring: "ring-red-500/30" },
  purple: { bg: "from-purple-500/15 to-violet-500/10", border: "border-purple-500/30", text: "text-purple-400", glow: "shadow-purple-500/20", ring: "ring-purple-500/30" },
  blue: { bg: "from-blue-500/15 to-sky-500/10", border: "border-blue-500/30", text: "text-blue-400", glow: "shadow-blue-500/20", ring: "ring-blue-500/30" },
  rose: { bg: "from-rose-500/15 to-pink-500/10", border: "border-rose-500/30", text: "text-rose-400", glow: "shadow-rose-500/20", ring: "ring-rose-500/30" },
  orange: { bg: "from-orange-500/15 to-red-500/10", border: "border-orange-500/30", text: "text-orange-400", glow: "shadow-orange-500/20", ring: "ring-orange-500/30" },
};

export { colorSchemes };

const hubTools = [
  {
    id: "bmi",
    title: "BMI Calculator",
    shortDescription: "Calculate your Body Mass Index and understand your weight category.",
    icon: FiPieChart,
    gradient: "from-cyan-500/20 via-emerald-500/10 to-teal-500/20",
    borderGradient: "from-cyan-500/30 to-emerald-500/30",
    accentColor: "cyan",
    route: "/fitness-tools/bmi",
  },
  {
    id: "bmr",
    title: "BMR Calculator",
    shortDescription: "Find your Basal Metabolic Rate and know how many calories your body burns at rest.",
    icon: FiZap,
    gradient: "from-amber-500/20 via-orange-500/10 to-yellow-500/20",
    borderGradient: "from-amber-500/30 to-orange-500/30",
    accentColor: "amber",
    route: "/fitness-tools/bmr",
  },
  {
    id: "calories",
    title: "Daily Calorie Calculator",
    shortDescription: "Determine your ideal daily calorie intake based on your goals and activity.",
    icon: FiActivity,
    gradient: "from-emerald-500/20 via-green-500/10 to-teal-500/20",
    borderGradient: "from-emerald-500/30 to-green-500/30",
    accentColor: "emerald",
    route: "/fitness-tools/calories",
  },
  {
    id: "ideal-weight",
    title: "Ideal Weight Calculator",
    shortDescription: "Discover your ideal weight range based on your height, gender, and body frame.",
    icon: FiTarget,
    gradient: "from-purple-500/20 via-violet-500/10 to-indigo-500/20",
    borderGradient: "from-purple-500/30 to-violet-500/30",
    accentColor: "purple",
    route: "/fitness-tools/ideal-weight",
  },
  {
    id: "water",
    title: "Water Intake Calculator",
    shortDescription: "Learn how much water you should drink daily for optimal health and performance.",
    icon: FiDroplet,
    gradient: "from-blue-500/20 via-sky-500/10 to-cyan-500/20",
    borderGradient: "from-blue-500/30 to-sky-500/30",
    accentColor: "blue",
    route: "/fitness-tools/water",
  },
  {
    id: "protein",
    title: "Protein Intake Calculator",
    shortDescription: "Calculate your optimal daily protein intake for your fitness goals.",
    icon: FiHeart,
    gradient: "from-rose-500/20 via-pink-500/10 to-red-500/20",
    borderGradient: "from-rose-500/30 to-pink-500/30",
    accentColor: "rose",
    route: "/fitness-tools/protein",
  },
  {
    id: "body-fat",
    title: "Body Fat Calculator",
    shortDescription: "Estimate your body fat percentage using the U.S. Navy method.",
    icon: FiShield,
    gradient: "from-orange-500/20 via-red-500/10 to-amber-500/20",
    borderGradient: "from-orange-500/30 to-red-500/30",
    accentColor: "orange",
    route: "/fitness-tools/body-fat",
  },
];

export function getHubTools() {
  return hubTools;
}

export function getToolById(id) {
  return hubTools.find((t) => t.id === id) || null;
}

const toolConfigs = {
  bmi: {
    title: "BMI Calculator",
    subtitle: "Body Mass Index",
    description:
      "Body Mass Index (BMI) is a simple calculation using a person's height and weight. It is a screening tool that can indicate whether a person has a healthy weight for their height.",
    icon: FiPieChart,
    accentColor: "cyan",
    bannerGradient: "from-cyan-950/40 via-base-100 to-teal-950/20",
    unitOptions: [
      { value: "metric", label: "Metric (kg/cm)" },
      { value: "imperial", label: "Imperial (lbs/in)" },
    ],
    fields: {
      metric: [
        { name: "weight", label: "Weight", placeholder: "70", unit: "kg", type: "number", min: 20, max: 300 },
        { name: "height", label: "Height", placeholder: "170", unit: "cm", type: "number", min: 100, max: 250 },
      ],
      imperial: [
        { name: "weight", label: "Weight", placeholder: "154", unit: "lbs", type: "number", min: 50, max: 600 },
        { name: "height", label: "Height", placeholder: "67", unit: "in", type: "number", min: 36, max: 96 },
      ],
    },
    bmiScale: [
      { min: 0, max: 18.5, label: "Underweight", color: "text-cyan-400" },
      { min: 18.5, max: 25, label: "Normal", color: "text-emerald-400" },
      { min: 25, max: 30, label: "Overweight", color: "text-amber-400" },
      { min: 30, max: 100, label: "Obese", color: "text-red-400" },
    ],
    tips: [
      "BMI is a useful screening tool but does not diagnose body fatness or health.",
      "Athletes may have a high BMI due to increased muscle mass, not excess fat.",
      "For a complete health assessment, combine BMI with waist circumference and other measures.",
      "Children and teens use BMI-for-age percentiles, not standard BMI categories.",
    ],
    faq: [
      {
        question: "What is a healthy BMI range?",
        answer:
          "A healthy BMI is generally considered to be between 18.5 and 24.9. However, this can vary based on age, gender, muscle mass, and other factors.",
      },
      {
        question: "Is BMI accurate for athletes?",
        answer:
          "BMI does not distinguish between muscle and fat. Athletes with high muscle mass may have a high BMI despite having low body fat. Use additional measurements for a complete picture.",
      },
      {
        question: "How often should I check my BMI?",
        answer:
          "Checking BMI monthly is sufficient for most people. Focus more on consistent healthy habits rather than frequent measurements.",
      },
      {
        question: "Does BMI change with age?",
        answer:
          "BMI tends to increase with age due to loss of muscle mass and increased body fat. Older adults should combine BMI with other health indicators.",
      },
    ],
  },
  bmr: {
    title: "BMR Calculator",
    subtitle: "Basal Metabolic Rate",
    description:
      "Your Basal Metabolic Rate is the number of calories your body needs to perform basic, life-sustaining functions. It represents the minimum energy required to keep your body functioning at rest.",
    icon: FiZap,
    accentColor: "amber",
    bannerGradient: "from-amber-950/40 via-base-100 to-orange-950/20",
    unitOptions: [
      { value: "metric", label: "Metric (kg/cm)" },
      { value: "imperial", label: "Imperial (lbs/in)" },
    ],
    fields: {
      metric: [
        { name: "gender", label: "Gender", type: "select", options: [
          { value: "male", label: "Male" },
          { value: "female", label: "Female" },
        ]},
        { name: "age", label: "Age", placeholder: "25", unit: "years", type: "number", min: 14, max: 100 },
        { name: "weight", label: "Weight", placeholder: "70", unit: "kg", type: "number", min: 20, max: 300 },
        { name: "height", label: "Height", placeholder: "170", unit: "cm", type: "number", min: 100, max: 250 },
      ],
      imperial: [
        { name: "gender", label: "Gender", type: "select", options: [
          { value: "male", label: "Male" },
          { value: "female", label: "Female" },
        ]},
        { name: "age", label: "Age", placeholder: "25", unit: "years", type: "number", min: 14, max: 100 },
        { name: "weight", label: "Weight", placeholder: "154", unit: "lbs", type: "number", min: 50, max: 600 },
        { name: "height", label: "Height", placeholder: "67", unit: "in", type: "number", min: 36, max: 96 },
      ],
    },
    tips: [
      "BMR decreases with age, so you may need fewer calories as you get older.",
      "Muscle tissue burns more calories than fat tissue, even at rest.",
      "Crash dieting can lower your BMR significantly. Eat at least your BMR for basic health.",
      "Factors like stress, illness, and temperature can temporarily affect your BMR.",
    ],
    faq: [
      {
        question: "What is the difference between BMR and RMR?",
        answer:
          "BMR (Basal Metabolic Rate) is measured under strict conditions — after fasting and resting. RMR (Resting Metabolic Rate) is slightly less strict and is more practical. The values are very similar.",
      },
      {
        question: "Should I eat below my BMR?",
        answer:
          "No. Eating below your BMR can cause your body to enter starvation mode, slowing metabolism and causing muscle loss. Always eat at least your BMR.",
      },
      {
        question: "How can I increase my BMR?",
        answer:
          "Build muscle through strength training, eat enough protein, stay active, get adequate sleep, and avoid extreme calorie restriction.",
      },
      {
        question: "Does BMR change with weight loss?",
        answer:
          "Yes. As you lose weight, your BMR decreases because there is less body mass to maintain. This is why weight loss often slows down over time.",
      },
    ],
  },
  calories: {
    title: "Daily Calorie Calculator",
    subtitle: "Daily Energy Needs",
    description:
      "Understanding your daily calorie needs is essential for managing your weight. This calculator determines how many calories you should consume based on your activity level, goals, and metabolic rate.",
    icon: FiActivity,
    accentColor: "emerald",
    bannerGradient: "from-emerald-950/40 via-base-100 to-green-950/20",
    unitOptions: [
      { value: "metric", label: "Metric (kg/cm)" },
      { value: "imperial", label: "Imperial (lbs/in)" },
    ],
    fields: {
      metric: [
        { name: "gender", label: "Gender", type: "select", options: [
          { value: "male", label: "Male" },
          { value: "female", label: "Female" },
        ]},
        { name: "age", label: "Age", placeholder: "25", unit: "years", type: "number", min: 14, max: 100 },
        { name: "weight", label: "Weight", placeholder: "70", unit: "kg", type: "number", min: 20, max: 300 },
        { name: "height", label: "Height", placeholder: "170", unit: "cm", type: "number", min: 100, max: 250 },
        { name: "activityLevel", label: "Activity Level", type: "activity" },
      ],
      imperial: [
        { name: "gender", label: "Gender", type: "select", options: [
          { value: "male", label: "Male" },
          { value: "female", label: "Female" },
        ]},
        { name: "age", label: "Age", placeholder: "25", unit: "years", type: "number", min: 14, max: 100 },
        { name: "weight", label: "Weight", placeholder: "154", unit: "lbs", type: "number", min: 50, max: 600 },
        { name: "height", label: "Height", placeholder: "67", unit: "in", type: "number", min: 36, max: 96 },
        { name: "activityLevel", label: "Activity Level", type: "activity" },
      ],
    },
    tips: [
      "Calorie needs vary significantly based on age, gender, weight, and activity level.",
      "A deficit of 500 calories per day leads to approximately 1 pound of weight loss per week.",
      "Never go below 1200 calories (women) or 1500 calories (men) without medical supervision.",
      "Focus on nutrient-dense foods to get the most value from your calorie allowance.",
    ],
    faq: [
      {
        question: "How many calories should I eat to lose weight?",
        answer:
          "A safe and sustainable calorie deficit is 300-500 calories below your maintenance level. This typically results in 0.5-1 pound of weight loss per week.",
      },
      {
        question: "Can I eat more on active days?",
        answer:
          "Yes. Your activity level is already factored into this calculation. On more active days, your body needs more fuel.",
      },
      {
        question: "What if I want to build muscle?",
        answer:
          "To build muscle, eat 200-300 calories above your maintenance level while consuming adequate protein (1.6-2.2g per kg of body weight).",
      },
      {
        question: "Do these calories include exercise?",
        answer:
          "The activity multiplier accounts for your general daily activity and planned exercise. For very intense exercise, you may need additional calories.",
      },
    ],
  },
  "ideal-weight": {
    title: "Ideal Weight Calculator",
    subtitle: "Healthy Weight Range",
    description:
      "Your ideal weight is a range that is generally considered healthy for your height, gender, and body frame. This calculator uses multiple formulas to give you a comprehensive estimate.",
    icon: FiTarget,
    accentColor: "purple",
    bannerGradient: "from-purple-950/40 via-base-100 to-violet-950/20",
    unitOptions: [
      { value: "metric", label: "Metric (cm)" },
      { value: "imperial", label: "Imperial (in)" },
    ],
    fields: {
      metric: [
        { name: "gender", label: "Gender", type: "select", options: [
          { value: "male", label: "Male" },
          { value: "female", label: "Female" },
        ]},
        { name: "height", label: "Height", placeholder: "170", unit: "cm", type: "number", min: 100, max: 250 },
      ],
      imperial: [
        { name: "gender", label: "Gender", type: "select", options: [
          { value: "male", label: "Male" },
          { value: "female", label: "Female" },
        ]},
        { name: "height", label: "Height", placeholder: "67", unit: "in", type: "number", min: 36, max: 96 },
      ],
    },
    tips: [
      "Ideal weight is a range, not a single number. Focus on how you feel and perform.",
      "Body composition (muscle vs fat ratio) matters more than the number on the scale.",
      "Frame size affects ideal weight. Larger-framed individuals may weigh more healthily.",
      "Use waist-to-hip ratio alongside weight for a better health indicator.",
    ],
    faq: [
      {
        question: "Is there one perfect weight for my height?",
        answer:
          "No. Ideal weight is a range. Factors like muscle mass, bone density, age, and body composition all affect what weight is healthy for you.",
      },
      {
        question: "Why do different calculators give different results?",
        answer:
          "Different formulas (Hamwi, Devine, Robinson, Miller) use different coefficients. We show a range that accounts for these variations.",
      },
      {
        question: "Should I aim for the lowest weight in the range?",
        answer:
          "Not necessarily. The middle of the range is often the most sustainable and healthy target. Focus on body composition, not just weight.",
      },
      {
        question: "Does ideal weight change with age?",
        answer:
          "Muscle mass naturally decreases with age, which can lower ideal weight slightly. However, maintaining strength and fitness is more important than hitting a specific number.",
      },
    ],
  },
  water: {
    title: "Water Intake Calculator",
    subtitle: "Daily Hydration Goal",
    description:
      "Staying properly hydrated is crucial for overall health, exercise performance, and cognitive function. This calculator estimates your optimal daily water intake based on your body weight and activity level.",
    icon: FiDroplet,
    accentColor: "blue",
    bannerGradient: "from-blue-950/40 via-base-100 to-sky-950/20",
    unitOptions: [
      { value: "metric", label: "Metric (kg)" },
      { value: "imperial", label: "Imperial (lbs)" },
    ],
    fields: {
      metric: [
        { name: "weight", label: "Weight", placeholder: "70", unit: "kg", type: "number", min: 20, max: 300 },
        { name: "activityLevel", label: "Activity Level", type: "activity" },
      ],
      imperial: [
        { name: "weight", label: "Weight", placeholder: "154", unit: "lbs", type: "number", min: 50, max: 600 },
        { name: "activityLevel", label: "Activity Level", type: "activity" },
      ],
    },
    tips: [
      "Drink a glass of water first thing in the morning to kickstart hydration.",
      "Keep a water bottle with you throughout the day as a visual reminder.",
      "Drink water before, during, and after exercise to maintain performance.",
      "Thirst is a late indicator of dehydration. Don't wait until you're thirsty to drink.",
    ],
    faq: [
      {
        question: "Does coffee count towards water intake?",
        answer:
          "Coffee has a mild diuretic effect, but the water in it still contributes to hydration. Moderate coffee consumption (3-4 cups) can be counted.",
      },
      {
        question: "Do I need more water when I exercise?",
        answer:
          "Yes. During exercise, drink 200-300ml every 15-20 minutes. For intense workouts lasting over an hour, consider adding electrolytes.",
      },
      {
        question: "Can I drink too much water?",
        answer:
          "Yes. Overhydration (hyponatremia) is rare but dangerous. It dilutes blood sodium levels. Stick to recommended amounts and listen to your body.",
      },
      {
        question: "Does food contribute to water intake?",
        answer:
          "Yes. Fruits and vegetables contain significant water content (cucumbers, watermelon, oranges). About 20% of daily water intake typically comes from food.",
      },
    ],
  },
  protein: {
    title: "Protein Intake Calculator",
    subtitle: "Daily Protein Needs",
    description:
      "Protein is essential for muscle repair, growth, and overall body function. Your protein needs depend on your body weight, activity level, and fitness goals. This calculator provides a personalized recommendation.",
    icon: FiHeart,
    accentColor: "rose",
    bannerGradient: "from-rose-950/40 via-base-100 to-pink-950/20",
    unitOptions: [
      { value: "metric", label: "Metric (kg)" },
      { value: "imperial", label: "Imperial (lbs)" },
    ],
    fields: {
      metric: [
        { name: "weight", label: "Weight", placeholder: "70", unit: "kg", type: "number", min: 20, max: 300 },
        { name: "activityLevel", label: "Activity Level", type: "activity" },
        { name: "goal", label: "Fitness Goal", type: "goal" },
      ],
      imperial: [
        { name: "weight", label: "Weight", placeholder: "154", unit: "lbs", type: "number", min: 50, max: 600 },
        { name: "activityLevel", label: "Activity Level", type: "activity" },
        { name: "goal", label: "Fitness Goal", type: "goal" },
      ],
    },
    tips: [
      "Distribute protein intake evenly across meals (20-40g per meal) for optimal absorption.",
      "Combine protein with carbohydrates post-workout for better recovery.",
      "Complete proteins (containing all essential amino acids) are found in animal products and soy.",
      "Plant-based athletes can combine protein sources (rice + beans, hummus + pita) for complete amino acids.",
    ],
    faq: [
      {
        question: "How much protein do I need per day?",
        answer:
          "Most adults need 0.8g per kg of body weight. Active individuals need 1.2-2.0g per kg depending on intensity. Athletes building muscle may need up to 2.4g per kg.",
      },
      {
        question: "Is too much protein harmful?",
        answer:
          "Excessive protein intake (above 2.5g per kg) may strain kidneys in those with pre-existing conditions. Healthy individuals can safely consume up to 2.5g per kg.",
      },
      {
        question: "When is the best time to eat protein?",
        answer:
          "Spread protein throughout the day. Post-workout (within 2 hours) is optimal for muscle recovery. Also include protein in every meal for satiety.",
      },
      {
        question: "Can I get enough protein from plants?",
        answer:
          "Yes. Legumes, tofu, tempeh, quinoa, nuts, and seeds provide ample protein. Combine different plant proteins for a complete amino acid profile.",
      },
    ],
  },
  "body-fat": {
    title: "Body Fat Calculator",
    subtitle: "Body Composition Analysis",
    description:
      "This calculator uses the U.S. Navy method to estimate body fat percentage. It measures body fat relative to total body weight, giving a more accurate picture of fitness than weight alone.",
    icon: FiShield,
    accentColor: "orange",
    bannerGradient: "from-orange-950/40 via-base-100 to-red-950/20",
    unitOptions: [
      { value: "metric", label: "Metric (cm/kg)" },
      { value: "imperial", label: "Imperial (in/lbs)" },
    ],
    fields: {
      metric: [
        { name: "gender", label: "Gender", type: "select", options: [
          { value: "male", label: "Male" },
          { value: "female", label: "Female" },
        ]},
        { name: "age", label: "Age", placeholder: "25", unit: "years", type: "number", min: 14, max: 100 },
        { name: "height", label: "Height", placeholder: "170", unit: "cm", type: "number", min: 100, max: 250 },
        { name: "weight", label: "Weight", placeholder: "70", unit: "kg", type: "number", min: 20, max: 300 },
        { name: "neck", label: "Neck Circumference", placeholder: "38", unit: "cm", type: "number", min: 20, max: 80 },
        { name: "waist", label: "Waist Circumference", placeholder: "80", unit: "cm", type: "number", min: 40, max: 200 },
      ],
      imperial: [
        { name: "gender", label: "Gender", type: "select", options: [
          { value: "male", label: "Male" },
          { value: "female", label: "Female" },
        ]},
        { name: "age", label: "Age", placeholder: "25", unit: "years", type: "number", min: 14, max: 100 },
        { name: "height", label: "Height", placeholder: "67", unit: "in", type: "number", min: 36, max: 96 },
        { name: "weight", label: "Weight", placeholder: "154", unit: "lbs", type: "number", min: 50, max: 600 },
        { name: "neck", label: "Neck Circumference", placeholder: "15", unit: "in", type: "number", min: 8, max: 30 },
        { name: "waist", label: "Waist Circumference", placeholder: "32", unit: "in", type: "number", min: 16, max: 80 },
      ],
    },
    tips: [
      "Measure your waist at the narrowest point, usually just above the belly button.",
      "Measure your neck at the narrowest point, just below the Adam's apple.",
      "Take measurements in the morning before eating for the most consistent results.",
      "Use a flexible tape measure and keep it snug but not tight against the skin.",
    ],
    faq: [
      {
        question: "What is a healthy body fat percentage?",
        answer:
          "For men: 10-20% is healthy, 6-13% is athletic. For women: 18-28% is healthy, 14-20% is athletic. Essential fat is 3-5% for men and 10-13% for women.",
      },
      {
        question: "Is the Navy method accurate?",
        answer:
          "The Navy method is reasonably accurate (within 3-4%) for most people. For more precise measurements, consider DEXA scans or hydrostatic weighing.",
      },
      {
        question: "How often should I measure body fat?",
        answer:
          "Measure every 2-4 weeks under consistent conditions. Body fat changes slowly, so frequent measurements may be misleading.",
      },
      {
        question: "What is the difference between body fat and BMI?",
        answer:
          "BMI only uses height and weight, while body fat percentage directly measures fat vs lean mass. Body fat percentage is a more accurate indicator of fitness and health.",
      },
    ],
  },
};

export function getToolConfig(id) {
  return toolConfigs[id] || null;
}

export function getActivityLevels() {
  return [
    { value: "sedentary", label: "Sedentary", description: "Little or no exercise", icon: FiWatch },
    { value: "light", label: "Lightly Active", description: "Light exercise 1-3 days/week", icon: FiSun },
    { value: "moderate", label: "Moderately Active", description: "Moderate exercise 3-5 days/week", icon: FiActivity },
    { value: "active", label: "Very Active", description: "Hard exercise 6-7 days/week", icon: FiZap },
    { value: "extra", label: "Extra Active", description: "Very hard exercise, physical job", icon: FiTarget },
  ];
}

export function getProteinGoals() {
  return [
    { value: "maintain", label: "Maintain Weight", description: "Keep current weight and fitness" },
    { value: "lose", label: "Lose Fat", description: "Reduce body fat while preserving muscle" },
    { value: "gain", label: "Gain Weight", description: "Healthy weight gain with nutrition" },
    { value: "muscle", label: "Build Muscle", description: "Maximize muscle growth and strength" },
  ];
}

export function getRecommendations(toolId, result) {
  const recs = {
    bmi: {
      workout: {
        title: "Recommended Workout",
        items: result?.category === "Normal"
          ? ["Maintain with 3-5 sessions/week of mixed cardio and strength", "Include flexibility and mobility work", "Try HIIT sessions 2x per week"]
          : result?.category === "Underweight"
          ? ["Focus on strength training to build muscle mass", "Limit excessive cardio, prioritize resistance work", "Train 3-4 days/week with compound movements"]
          : ["Start with low-impact activities: walking, swimming, cycling", "Gradually increase intensity with 150+ min/week moderate exercise", "Add strength training 2-3 days/week to build metabolism-boosting muscle"],
      },
      nutrition: {
        title: "Nutrition Guidance",
        items: result?.category === "Normal"
          ? ["Maintain balanced macronutrient intake", "Eat whole foods, lean proteins, and healthy fats", "Stay hydrated with 2-3 liters of water daily"]
          : result?.category === "Underweight"
          ? ["Increase calorie intake by 300-500 calories daily", "Eat calorie-dense, nutritious foods: nuts, avocados, whole grains", "Have 5-6 smaller meals throughout the day"]
          : ["Create a moderate 300-500 calorie daily deficit", "Prioritize protein (1.6-2.0g per kg) to preserve muscle", "Reduce processed foods and added sugars"],
      },
      dailyGoal: { title: "Daily Goal", text: result?.category === "Normal" ? "Maintain your healthy BMI through consistent habits" : "Work towards a BMI in the 18.5-24.9 range" },
      lifestyle: { title: "Lifestyle Tips", items: ["Get 7-9 hours of quality sleep", "Manage stress through meditation or yoga", "Track progress monthly, not daily", "Consult a healthcare professional for personalized advice"] },
    },
    bmr: {
      workout: { title: "Boost Your Metabolism", items: ["Strength train 3-4 times per week to build calorie-burning muscle", "Include compound exercises: squats, deadlifts, bench press", "Add 2 HIIT sessions per week for metabolic boost"] },
      nutrition: { title: "Nutrition Strategy", items: [`Never eat below ${result?.bmr || 'your BMR'} calories`, "Eat protein with every meal to preserve muscle mass", "Don't skip meals — regular eating maintains metabolism"] },
      dailyGoal: { title: "Daily Goal", text: `Your body burns approximately ${result?.bmr || '---'} calories at rest. Fuel it properly.` },
      lifestyle: { title: "Lifestyle Tips", items: ["Stay active throughout the day, not just during workouts", "Take the stairs, walk more, stand when possible", "Cold exposure can slightly increase BMR", "Build muscle for a permanently higher BMR"] },
    },
    calories: {
      workout: { title: "Exercise Plan", items: ["Aim for 150-300 minutes of moderate exercise per week", "Include both cardio and strength training", "Match exercise intensity to your calorie goal"] },
      nutrition: { title: "Eating Plan", items: [`For maintenance: ${result?.maintenance || '---'} calories/day`, `For weight loss: ${result?.lose || '---'} calories/day`, `For weight gain: ${result?.gain || '---'} calories/day`] },
      dailyGoal: { title: "Daily Goal", text: `Eat ${result?.maintenance || '---'} calories to maintain your current weight.` },
      lifestyle: { title: "Lifestyle Tips", items: ["Plan meals in advance for better adherence", "Use smaller plates to control portions naturally", "Track your food intake for awareness", "Allow flexibility — one bad day won't ruin progress"] },
    },
    "ideal-weight": {
      workout: { title: "Fitness Focus", items: ["Strength training helps build a healthy body composition", "Aim for a mix of resistance and cardiovascular exercise", "Focus on performance, not just the number on the scale"] },
      nutrition: { title: "Nutrition Advice", items: ["Eat a balanced diet rich in whole foods", "Don't crash diet to reach a target weight", "Focus on nutrient density over calorie restriction"] },
      dailyGoal: { title: "Daily Goal", text: `Your ideal weight range is ${result?.range || '---'}. Work towards it sustainably.` },
      lifestyle: { title: "Lifestyle Tips", items: ["Measure progress through body composition, not just weight", "Take progress photos monthly", "Celebrate non-scale victories", "Consult a nutritionist for personalized guidance"] },
    },
    water: {
      workout: { title: "Hydration During Exercise", items: ["Drink 200-300ml every 15-20 minutes during exercise", "Weigh yourself before and after exercise to estimate fluid loss", "For workouts over 60 min, add electrolytes to your water"] },
      nutrition: { title: "Hydration Habits", items: [`Aim for ${result?.glasses || '---'} glasses (${result?.liters || '---'}L) daily`, "Eat water-rich foods: watermelon, cucumber, oranges", "Drink a glass of water with every meal"] },
      dailyGoal: { title: "Daily Goal", text: `Drink ${result?.liters || '---'} liters (${result?.ounces || '---'} oz) of water today.` },
      lifestyle: { title: "Lifestyle Tips", items: ["Carry a reusable water bottle everywhere", "Set hourly reminders to drink water", "Monitor urine color — pale yellow indicates good hydration", "Increase intake during hot weather and illness"] },
    },
    protein: {
      workout: { title: "Protein & Training", items: ["Consume 20-40g protein within 2 hours post-workout", "Eat protein at every meal for muscle protein synthesis", "Combine protein with carbs for optimal recovery"] },
      nutrition: { title: "Protein Sources", items: [`Target ${result?.ideal || '---'}g of protein daily`, "Lean meats: chicken breast, turkey, lean beef", "Plant sources: tofu, lentils, chickpeas, quinoa"] },
      dailyGoal: { title: "Daily Goal", text: `Consume ${result?.ideal || '---'}g of protein daily (${result?.perKg || '---'}g per kg of body weight).` },
      lifestyle: { title: "Lifestyle Tips", items: ["Spread protein intake across 4-5 meals", "Use protein shakes as supplements, not replacements", "Combine different protein sources for complete amino acids", "Track protein intake initially to build awareness"] },
    },
    "body-fat": {
      workout: { title: "Body Recomposition", items: ["Combine strength training with moderate cardio", "Focus on progressive overload in weight training", "Include 2-3 HIIT sessions per week for fat burning"] },
      nutrition: { title: "Nutrition Strategy", items: ["Eat in a slight caloric deficit for fat loss", "Prioritize protein to preserve muscle while losing fat", "Minimize processed foods and added sugars"] },
      dailyGoal: { title: "Daily Goal", text: `Your current body fat is ${result?.bodyFat || '---'}% (${result?.category || '---'}). Work towards a healthier range.` },
      lifestyle: { title: "Lifestyle Tips", items: ["Get enough sleep — poor sleep increases fat storage", "Manage cortisol through stress reduction", "Measure body fat every 2-4 weeks for consistent tracking", "Focus on sustainable changes, not quick fixes"] },
    },
  };
  return recs[toolId] || recs.bmi;
}
