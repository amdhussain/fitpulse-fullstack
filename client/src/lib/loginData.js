import {
  FiAward,
  FiStar,
  FiHeadphones,
  FiTrendingUp,
  FiFacebook,
  FiInstagram,
  FiYoutube,
  FiLinkedin,
} from "react-icons/fi";

export const loginMetadata = {
  title: "Sign In to FitBookPro",
  description:
    "Access your fitness dashboard, manage bookings, and track your progress.",
  gradient: {
    from: "from-blue-950/40",
    via: "via-base-100",
    to: "to-slate-950/60",
  },
};

export const loginBranding = {
  heading: "Start Your Fitness Journey",
  description:
    "Join thousands of fitness enthusiasts who trust FitBookPro for their workout and wellness goals. Your transformation begins here.",
};

export const getWelcomeFeatures = () => [
  {
    id: "trainers",
    icon: FiAward,
    title: "Certified Trainers",
    description: "Expert guidance from professionals",
    color: "blue",
  },
  {
    id: "equipment",
    icon: FiStar,
    title: "Premium Equipment",
    description: "State-of-the-art fitness machines",
    color: "cyan",
  },
  {
    id: "support",
    icon: FiHeadphones,
    title: "24/7 Support",
    description: "Always here when you need us",
    color: "emerald",
  },
  {
    id: "experience",
    icon: FiTrendingUp,
    title: "Modern Experience",
    description: "Cutting-edge fitness technology",
    color: "purple",
  },
];

export const getSocialLinks = () => [
  { id: "facebook", icon: FiFacebook, label: "Facebook", href: "#" },
  { id: "instagram", icon: FiInstagram, label: "Instagram", href: "#" },
  { id: "youtube", icon: FiYoutube, label: "YouTube", href: "#" },
  { id: "linkedin", icon: FiLinkedin, label: "LinkedIn", href: "#" },
];

export const getFormPlaceholders = () => ({
  email: "you@example.com",
  password: "Enter your password",
});

export const getValidationMessages = () => ({
  emailRequired: "Email is required",
  emailInvalid: "Please enter a valid email address",
  passwordRequired: "Password is required",
  passwordMinLength: "Password must be at least 8 characters",
});
