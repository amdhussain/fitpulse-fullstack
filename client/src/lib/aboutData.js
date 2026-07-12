export const getAboutSections = () => [
  {
    id: 1,
    title: "Our Story",
    subtitle: "Who We Are",
    description:
      "FitBookPro was founded with a vision to make fitness accessible, enjoyable, and effective for everyone. We believe that fitness is not just about physical transformation but about building confidence and community.",
    mission:
      "To empower individuals to achieve their fitness goals through innovative technology, expert guidance, and a supportive community.",
    vision:
      "To become the world's leading fitness platform that connects people with the best trainers, classes, and wellness resources.",
    achievements: "Founded in 2020, 10K+ Members, 50+ Trainers",
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800",
    status: "active",
    updatedAt: "2 hours ago",
  },
  {
    id: 2,
    title: "Our Mission",
    subtitle: "What Drives Us",
    description:
      "We are on a mission to revolutionize the fitness industry by creating a seamless digital experience that bridges the gap between fitness enthusiasts and professional trainers.",
    mission:
      "Make fitness accessible to everyone regardless of their schedule, location, or fitness level.",
    vision:
      "A world where everyone has access to personalized fitness guidance and support.",
    achievements: "4.9 Rating, 5000+ Bookings, 98% Satisfaction",
    image: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800",
    status: "active",
    updatedAt: "1 day ago",
  },
  {
    id: 3,
    title: "Our Values",
    subtitle: "Core Principles",
    description:
      "Excellence, integrity, and community form the foundation of everything we do. We are committed to providing the highest quality fitness experience.",
    mission:
      "Deliver excellence in every interaction, class, and training session.",
    vision:
      "Build a community where everyone feels welcome and supported in their fitness journey.",
    achievements: "ISO Certified, Award Winning, Industry Leader",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800",
    status: "active",
    updatedAt: "5 days ago",
  },
  {
    id: 4,
    title: "Community Impact",
    subtitle: "Giving Back",
    description:
      "Through our community programs, we have helped thousands of people start their fitness journey and live healthier lives.",
    mission:
      "Use fitness as a tool for positive change in communities around the world.",
    vision:
      "A global network of fitness communities that uplift and inspire each other.",
    achievements: "200+ Community Events, 5000+ Lives Changed",
    image: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=800",
    status: "draft",
    updatedAt: "2 weeks ago",
  },
];

export const getAboutStats = (sections) => ({
  total: sections.length,
  images: sections.filter((s) => s.image).length,
  achievements: sections.reduce(
    (sum, s) => sum + (s.achievements ? s.achievements.split(",").length : 0),
    0
  ),
});
