import { lazy } from "react";
import { useRoutes } from "react-router-dom";
import { MainLayout } from "../components/layout";
import { DashboardLayout } from "../components/dashboard";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import { RouteSuspense, DashboardSuspense } from "./RouteSuspense";

const Home = lazy(() => import("../pages/Home"));
const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));
const NotFound = lazy(() => import("../pages/NotFound"));

const AboutPage = lazy(() => import("../pages/public/AboutPage"));
const ServicesPage = lazy(() => import("../pages/public/ServicesPage"));
const ServiceDetail = lazy(() => import("../pages/public/ServiceDetail"));
const TrainersPage = lazy(() => import("../pages/public/TrainersPage"));
const TrainerDetail = lazy(() => import("../pages/public/TrainerDetail"));
const MembershipPage = lazy(() => import("../pages/public/MembershipPage"));
const MembershipDetail = lazy(() => import("../pages/public/MembershipDetail"));
const GalleryPage = lazy(() => import("../pages/public/GalleryPage"));
const GalleryDetail = lazy(() => import("../pages/public/GalleryDetail"));
const BookingPage = lazy(() => import("../pages/public/BookingPage"));
const ContactPage = lazy(() => import("../pages/public/ContactPage"));

const FitnessToolsHub = lazy(() => import("../pages/public/FitnessToolsHub"));
const BMIPage = lazy(() => import("../pages/public/BMIPage"));
const BMRPage = lazy(() => import("../pages/public/BMRPage"));
const TDEEPage = lazy(() => import("../pages/public/TDEEPage"));
const CaloriePage = lazy(() => import("../pages/public/CaloriePage"));
const BodyFatPage = lazy(() => import("../pages/public/BodyFatPage"));
const LeanBodyMassPage = lazy(() => import("../pages/public/LeanBodyMassPage"));
const FFMICalculatorPage = lazy(() => import("../pages/public/FFMICalculatorPage"));
const IdealWeightPage = lazy(() => import("../pages/public/IdealWeightPage"));
const HeartRatePage = lazy(() => import("../pages/public/HeartRatePage"));
const TargetHeartRatePage = lazy(() => import("../pages/public/TargetHeartRatePage"));
const WaterPage = lazy(() => import("../pages/public/WaterPage"));
const ProteinPage = lazy(() => import("../pages/public/ProteinPage"));
const MacroPage = lazy(() => import("../pages/public/MacroPage"));
const OneRepMaxPage = lazy(() => import("../pages/public/OneRepMaxPage"));
const PacePage = lazy(() => import("../pages/public/PacePage"));
const RunningPacePage = lazy(() => import("../pages/public/RunningPacePage"));
const CyclingPage = lazy(() => import("../pages/public/CyclingPage"));
const WalkingCaloriesPage = lazy(() => import("../pages/public/WalkingCaloriesPage"));
const CaloriesBurnPage = lazy(() => import("../pages/public/CaloriesBurnPage"));
const StepsPage = lazy(() => import("../pages/public/StepsPage"));
const NutritionPage = lazy(() => import("../pages/public/NutritionPage"));
const MealPlannerPage = lazy(() => import("../pages/public/MealPlannerPage"));

const Overview = lazy(() => import("../pages/dashboard/Overview"));
const HeroManagement = lazy(() => import("../pages/dashboard/HeroManagement"));
const AboutManagement = lazy(() => import("../pages/dashboard/AboutManagement"));
const ServicesManagement = lazy(() => import("../pages/dashboard/ServicesManagement"));
const FooterManagement = lazy(() => import("../pages/dashboard/FooterManagement"));
const ProfileManagement = lazy(() => import("../pages/dashboard/ProfileManagement"));
const TrainersManagement = lazy(() => import("../pages/dashboard/TrainersManagement"));
const MembershipManagement = lazy(() => import("../pages/dashboard/MembershipManagement"));
const TestimonialsManagement = lazy(() => import("../pages/dashboard/TestimonialsManagement"));
const GalleryManagement = lazy(() => import("../pages/dashboard/GalleryManagement"));
const ContactManagement = lazy(() => import("../pages/dashboard/ContactManagement"));
const WebsiteSettings = lazy(() => import("../pages/dashboard/WebsiteSettings"));
const NotificationCenter = lazy(() => import("../pages/dashboard/NotificationCenter"));
const FitnessToolsManagement = lazy(() => import("../pages/dashboard/FitnessToolsManagement"));
const AdminSettings = lazy(() => import("../pages/dashboard/AdminSettings"));
const AdminProfile = lazy(() => import("../pages/dashboard/AdminProfile"));

const routes = [
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <RouteSuspense><Home /></RouteSuspense> },
      { path: "login", element: <RouteSuspense><Login /></RouteSuspense> },
      { path: "register", element: <RouteSuspense><Register /></RouteSuspense> },
      { path: "about", element: <RouteSuspense><AboutPage /></RouteSuspense> },
      { path: "services", element: <RouteSuspense><ServicesPage /></RouteSuspense> },
      { path: "services/:id", element: <RouteSuspense><ServiceDetail /></RouteSuspense> },
      { path: "trainers", element: <RouteSuspense><TrainersPage /></RouteSuspense> },
      { path: "trainers/:id", element: <RouteSuspense><TrainerDetail /></RouteSuspense> },
      { path: "membership", element: <RouteSuspense><MembershipPage /></RouteSuspense> },
      { path: "membership/:id", element: <RouteSuspense><MembershipDetail /></RouteSuspense> },
      { path: "gallery", element: <RouteSuspense><GalleryPage /></RouteSuspense> },
      { path: "gallery/:id", element: <RouteSuspense><GalleryDetail /></RouteSuspense> },
      { path: "booking", element: <RouteSuspense><BookingPage /></RouteSuspense> },
      { path: "contact", element: <RouteSuspense><ContactPage /></RouteSuspense> },
      { path: "fitness-tools", element: <RouteSuspense><FitnessToolsHub /></RouteSuspense> },
      { path: "fitness-tools/bmi", element: <RouteSuspense><BMIPage /></RouteSuspense> },
      { path: "fitness-tools/bmr", element: <RouteSuspense><BMRPage /></RouteSuspense> },
      { path: "fitness-tools/tdee", element: <RouteSuspense><TDEEPage /></RouteSuspense> },
      { path: "fitness-tools/calories", element: <RouteSuspense><CaloriePage /></RouteSuspense> },
      { path: "fitness-tools/body-fat", element: <RouteSuspense><BodyFatPage /></RouteSuspense> },
      { path: "fitness-tools/lean-body-mass", element: <RouteSuspense><LeanBodyMassPage /></RouteSuspense> },
      { path: "fitness-tools/ffmi", element: <RouteSuspense><FFMICalculatorPage /></RouteSuspense> },
      { path: "fitness-tools/ideal-weight", element: <RouteSuspense><IdealWeightPage /></RouteSuspense> },
      { path: "fitness-tools/heart-rate", element: <RouteSuspense><HeartRatePage /></RouteSuspense> },
      { path: "fitness-tools/target-heart-rate", element: <RouteSuspense><TargetHeartRatePage /></RouteSuspense> },
      { path: "fitness-tools/water", element: <RouteSuspense><WaterPage /></RouteSuspense> },
      { path: "fitness-tools/protein", element: <RouteSuspense><ProteinPage /></RouteSuspense> },
      { path: "fitness-tools/macro", element: <RouteSuspense><MacroPage /></RouteSuspense> },
      { path: "fitness-tools/one-rep-max", element: <RouteSuspense><OneRepMaxPage /></RouteSuspense> },
      { path: "fitness-tools/pace", element: <RouteSuspense><PacePage /></RouteSuspense> },
      { path: "fitness-tools/running-pace", element: <RouteSuspense><RunningPacePage /></RouteSuspense> },
      { path: "fitness-tools/cycling", element: <RouteSuspense><CyclingPage /></RouteSuspense> },
      { path: "fitness-tools/walking-calories", element: <RouteSuspense><WalkingCaloriesPage /></RouteSuspense> },
      { path: "fitness-tools/calories-burn", element: <RouteSuspense><CaloriesBurnPage /></RouteSuspense> },
      { path: "fitness-tools/steps", element: <RouteSuspense><StepsPage /></RouteSuspense> },
      { path: "fitness-tools/nutrition", element: <RouteSuspense><NutritionPage /></RouteSuspense> },
      { path: "fitness-tools/meal-planner", element: <RouteSuspense><MealPlannerPage /></RouteSuspense> },
      { path: "*", element: <RouteSuspense><NotFound /></RouteSuspense> },
    ],
  },
  {
    path: "/dashboard",
    element: <ProtectedRoute><DashboardLayout /></ProtectedRoute>,
    children: [
      { index: true, element: <DashboardSuspense><Overview /></DashboardSuspense> },
      { path: "profile", element: <DashboardSuspense><ProfileManagement /></DashboardSuspense> },
      { path: "hero", element: <DashboardSuspense><HeroManagement /></DashboardSuspense> },
      { path: "about", element: <DashboardSuspense><AboutManagement /></DashboardSuspense> },
      { path: "services", element: <DashboardSuspense><ServicesManagement /></DashboardSuspense> },
      { path: "trainers", element: <DashboardSuspense><TrainersManagement /></DashboardSuspense> },
      { path: "membership", element: <DashboardSuspense><MembershipManagement /></DashboardSuspense> },
      { path: "testimonials", element: <DashboardSuspense><TestimonialsManagement /></DashboardSuspense> },
      { path: "gallery", element: <DashboardSuspense><GalleryManagement /></DashboardSuspense> },
      { path: "contact", element: <DashboardSuspense><ContactManagement /></DashboardSuspense> },
      { path: "footer", element: <DashboardSuspense><FooterManagement /></DashboardSuspense> },
      { path: "settings", element: <DashboardSuspense><WebsiteSettings /></DashboardSuspense> },
      { path: "notifications", element: <DashboardSuspense><NotificationCenter /></DashboardSuspense> },
      { path: "fitness-tools", element: <DashboardSuspense><FitnessToolsManagement /></DashboardSuspense> },
      { path: "admin-profile", element: <ProtectedRoute roles={["ADMIN"]}><DashboardSuspense><AdminProfile /></DashboardSuspense></ProtectedRoute> },
      { path: "admin-settings", element: <ProtectedRoute roles={["ADMIN"]}><DashboardSuspense><AdminSettings /></DashboardSuspense></ProtectedRoute> },
    ],
  },
];

export default function AppRoutes() {
  return useRoutes(routes);
}
