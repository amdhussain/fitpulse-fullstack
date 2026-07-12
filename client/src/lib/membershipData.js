export const getMembershipPlans = () => [
  {
    id: 1,
    name: "Basic Fit",
    monthlyPrice: "$29",
    yearlyPrice: "$299",
    duration: "Monthly",
    description:
      "Perfect for beginners looking to start their fitness journey with essential gym access.",
    features: "Gym Access, Locker Room, Basic Classes, WiFi Access",
    popular: false,
    color: "#06b6d4",
    status: "active",
    updatedAt: "2 hours ago",
  },
  {
    id: 2,
    name: "Premium Active",
    monthlyPrice: "$59",
    yearlyPrice: "$599",
    duration: "Monthly",
    description:
      "Everything in Basic plus personal training sessions and premium amenities for serious fitness enthusiasts.",
    features:
      "All Basic + Personal Training, Sauna, Priority Booking, Guest Passes, Nutrition Consult",
    popular: true,
    color: "#eab308",
    status: "active",
    updatedAt: "1 day ago",
  },
  {
    id: 3,
    name: "Elite Pro",
    monthlyPrice: "$99",
    yearlyPrice: "$999",
    duration: "Monthly",
    description:
      "The ultimate fitness experience with exclusive VIP access and dedicated personal coaching.",
    features:
      "All Premium + Private Sessions, Nutrition Plan, VIP Lounge, Spa Access, 24/7 Access, Merchandise",
    popular: false,
    color: "#f97316",
    status: "active",
    updatedAt: "3 days ago",
  },
  {
    id: 4,
    name: "Student Saver",
    monthlyPrice: "$19",
    yearlyPrice: "$199",
    duration: "Monthly",
    description:
      "Affordable fitness plan designed for students with valid student ID verification.",
    features:
      "Gym Access, Group Classes, Locker Room, Study Lounge, Weekend Workshops",
    popular: false,
    color: "#10b981",
    status: "active",
    updatedAt: "1 week ago",
  },
  {
    id: 5,
    name: "Couple Combo",
    monthlyPrice: "$89",
    yearlyPrice: "$899",
    duration: "Monthly",
    description:
      "Train together and save! Includes dual membership with shared personal training sessions.",
    features:
      "Dual Gym Access, 4 Personal Sessions, Couples Yoga, Shared Locker, Priority Booking, Guest Pass",
    popular: false,
    color: "#ec4899",
    status: "active",
    updatedAt: "2 weeks ago",
  },
  {
    id: 6,
    name: "Annual Premium",
    monthlyPrice: "$79",
    yearlyPrice: "$799",
    duration: "Yearly",
    description:
      "Best value annual plan with locked-in pricing and exclusive annual member benefits.",
    features:
      "All Premium Benefits, Free Supplements, Monthly Body Analysis, Exclusive Events, Birthday Perks",
    popular: true,
    color: "#8b5cf6",
    status: "draft",
    updatedAt: "1 month ago",
  },
];

export const getMembershipStats = (plans) => ({
  total: plans.length,
  popular: plans.filter((p) => p.popular).length,
  monthly: plans.filter((p) => p.duration === "Monthly").length,
  yearly: plans.filter((p) => p.duration === "Yearly").length,
});

export const getComparisonFeatures = () => [
  { name: "Gym Floor Access", plans: [true, true, true, true, true, true] },
  { name: "Locker Room", plans: [true, true, true, true, true, true] },
  { name: "Group Classes", plans: [true, true, true, true, true, true] },
  { name: "WiFi Access", plans: [true, true, true, true, true, true] },
  { name: "Personal Training", plans: [false, true, true, false, true, true] },
  { name: "Sauna & Steam Room", plans: [false, true, true, false, false, true] },
  { name: "Priority Booking", plans: [false, true, true, false, true, true] },
  { name: "Guest Passes", plans: [false, true, true, false, true, true] },
  { name: "Nutrition Consult", plans: [false, true, true, false, false, true] },
  { name: "Private Sessions", plans: [false, false, true, false, false, true] },
  { name: "VIP Lounge", plans: [false, false, true, false, false, true] },
  { name: "Spa Access", plans: [false, false, true, false, false, true] },
  { name: "24/7 Access", plans: [false, false, true, false, false, true] },
  { name: "Study Lounge", plans: [false, false, false, true, false, false] },
  { name: "Weekend Workshops", plans: [false, false, false, true, false, false] },
  { name: "Couples Yoga", plans: [false, false, false, false, true, false] },
  { name: "Free Supplements", plans: [false, false, false, false, false, true] },
  { name: "Monthly Body Analysis", plans: [false, false, false, false, false, true] },
  { name: "Exclusive Events", plans: [false, false, false, false, false, true] },
  { name: "Birthday Perks", plans: [false, false, false, false, false, true] },
];

export const getWhyChooseData = () => [
  {
    icon: "flexible",
    title: "Flexible Scheduling",
    description: "Choose from hundreds of classes and time slots that fit your busy lifestyle. Book and manage everything from your phone.",
  },
  {
    icon: "price",
    title: "Competitive Pricing",
    description: "Premium fitness experiences at every price point. No hidden fees, no long-term contracts, just pure value.",
  },
  {
    icon: "trainers",
    title: "Expert Trainers",
    description: "Work with certified professionals who hold advanced qualifications and have years of real-world coaching experience.",
  },
  {
    icon: "equipment",
    title: "Premium Equipment",
    description: "Train with the latest Technogym and Hammer Strength equipment, maintained to the highest standards.",
  },
  {
    icon: "support",
    title: "24/7 Support",
    description: "Our dedicated support team is always available to help with anything you need on your fitness journey.",
  },
];

export const getCtaData = () => ({
  heading: "Ready to Start Your Fitness Journey?",
  description: "Join thousands of members who have already transformed their lives. Choose the perfect plan and get started today.",
  primaryButton: {
    label: "Get Started Now",
  },
  secondaryButton: {
    label: "Compare Plans",
  },
});
