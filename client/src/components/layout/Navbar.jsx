import { useState, useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { FiMenu, FiX, FiChevronDown, FiGrid, FiActivity, FiHeart, FiDroplet, FiTrendingUp, FiZap, FiTarget, FiAlertTriangle, FiClock, FiPieChart, FiUsers, FiAward, FiNavigation, FiMap, FiSun, FiCrosshair, FiArrowUp, FiCoffee, FiBookOpen, FiCompass } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { Container, Button, Logo } from "../ui";

const sectionLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/gallery", label: "Gallery" },
];

const fitnessToolsLinks = [
  { to: "/fitness-tools", label: "All Tools", icon: FiGrid, isHub: true },
  { to: "/fitness-tools/bmi", label: "BMI Calculator", icon: FiPieChart },
  { to: "/fitness-tools/bmr", label: "BMR Calculator", icon: FiZap },
  { to: "/fitness-tools/tdee", label: "TDEE Calculator", icon: FiActivity },
  { to: "/fitness-tools/calories", label: "Daily Calories", icon: FiActivity },
  { to: "/fitness-tools/body-fat", label: "Body Fat %", icon: FiTarget },
  { to: "/fitness-tools/lean-body-mass", label: "Lean Body Mass", icon: FiUsers },
  { to: "/fitness-tools/ffmi", label: "FFMI Calculator", icon: FiAward },
  { to: "/fitness-tools/ideal-weight", label: "Ideal Weight", icon: FiHeart },
  { to: "/fitness-tools/heart-rate", label: "Heart Rate Zones", icon: FiHeart },
  { to: "/fitness-tools/target-heart-rate", label: "Target Heart Rate", icon: FiCrosshair },
  { to: "/fitness-tools/water", label: "Water Intake", icon: FiDroplet },
  { to: "/fitness-tools/protein", label: "Protein Intake", icon: FiTrendingUp },
  { to: "/fitness-tools/macro", label: "Macro Calculator", icon: FiGrid },
  { to: "/fitness-tools/one-rep-max", label: "One Rep Max", icon: FiAlertTriangle },
  { to: "/fitness-tools/pace", label: "Pace Calculator", icon: FiClock },
  { to: "/fitness-tools/running-pace", label: "Running Pace", icon: FiNavigation },
  { to: "/fitness-tools/cycling", label: "Cycling Calculator", icon: FiCompass },
  { to: "/fitness-tools/walking-calories", label: "Walking Calories", icon: FiMap },
  { to: "/fitness-tools/calories-burn", label: "Calories Burn", icon: FiSun },
  { to: "/fitness-tools/steps", label: "Steps Calculator", icon: FiArrowUp },
  { to: "/fitness-tools/nutrition", label: "Nutrition Calculator", icon: FiCoffee },
  { to: "/fitness-tools/meal-planner", label: "Meal Planner", icon: FiBookOpen },
];

const routeLinks = [
  { to: "/login", label: "Login" },
  { to: "/dashboard", label: "Dashboard" },
];

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [fitnessOpen, setFitnessOpen] = useState(false);
  const fitnessRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (fitnessRef.current && !fitnessRef.current.contains(e.target)) {
        setFitnessOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-base-100/95 backdrop-blur-md shadow-lg shadow-black/10 border-b border-base-300/50"
          : "bg-transparent"
      }`}
    >
      <Container>
        <nav className="flex items-center justify-between h-16 sm:h-18" aria-label="Main navigation">
          <Logo size="md" showText className="lg:hidden xl:flex" />

          <ul className="hidden lg:flex items-center justify-center gap-1 flex-1">
            {sectionLinks.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === "/"}
                  className={({ isActive }) =>
                    `relative px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? "text-blue-400"
                        : "text-base-content/60 hover:text-base-content hover:bg-base-300/40"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {link.label}
                      {isActive && (
                        <motion.span
                          layoutId="nav-indicator"
                          className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-5 bg-blue-400 rounded-full"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
            <li className="relative" ref={fitnessRef}>
              <button
                onClick={() => setFitnessOpen(!fitnessOpen)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  location.pathname.startsWith("/fitness-tools")
                    ? "text-cyan-400"
                    : "text-base-content/60 hover:text-base-content hover:bg-base-300/40"
                }`}
              >
                Fitness Tools
                <FiChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${fitnessOpen ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {fitnessOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-2 w-64 py-2 rounded-xl bg-base-200/98 backdrop-blur-xl border border-base-300/50 shadow-2xl shadow-black/20"
                  >
                    {fitnessToolsLinks.map((tool) => (
                      <NavLink
                        key={tool.to}
                        to={tool.to}
                        onClick={() => setFitnessOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-4 py-2.5 text-sm transition-all duration-200 ${
                            tool.isHub
                              ? "border-b border-base-300/50 mb-1 pb-3"
                              : ""
                          } ${
                            isActive
                              ? "bg-cyan-500/10 text-cyan-400"
                              : "text-base-content/60 hover:bg-base-300/50 hover:text-base-content"
                          }`
                        }
                      >
                        <tool.icon className="w-4 h-4" />
                        {tool.label}
                      </NavLink>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          </ul>

          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <NavLink to="/login">
              {({ isActive }) => (
                <Button size="sm" variant={isActive ? "blue" : "ghost"}>
                  Login
                </Button>
              )}
            </NavLink>
            <NavLink to="/dashboard">
              <Button size="sm" variant="royal">Dashboard</Button>
            </NavLink>
          </div>

          <div className="lg:hidden flex items-center gap-2">
            <Logo size="sm" showText={false} />
            <button
              className="p-2 rounded-lg hover:bg-base-300/50 transition-colors text-base-content/70"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </nav>
      </Container>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="lg:hidden overflow-hidden bg-base-200/98 backdrop-blur-xl border-t border-base-300/50"
          >
            <Container className="py-4">
              <ul className="flex flex-col gap-1" role="list">
                {sectionLinks.map((link, i) => (
                  <motion.li
                    key={link.to}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <NavLink
                      to={link.to}
                      end={link.to === "/"}
                      onClick={() => setMobileOpen(false)}
                      className={({ isActive }) =>
                        `block px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                          isActive
                            ? "bg-blue-500/10 text-blue-400"
                            : "text-base-content/60 hover:bg-base-300/50 hover:text-base-content"
                        }`
                      }
                    >
                      {link.label}
                    </NavLink>
                  </motion.li>
                ))}
                <motion.li
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: sectionLinks.length * 0.05 }}
                >
                  <NavLink
                    to="/fitness-tools"
                    onClick={() => setMobileOpen(false)}
                    className={
                      `block px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                        location.pathname.startsWith("/fitness-tools")
                          ? "bg-cyan-500/10 text-cyan-400"
                          : "text-base-content/60 hover:bg-base-300/50 hover:text-base-content"
                      }`
                    }
                  >
                    Fitness Tools
                  </NavLink>
                </motion.li>
                {routeLinks.map((link, i) => (
                  <motion.li
                    key={link.to}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (sectionLinks.length + 1 + i) * 0.05 }}
                  >
                    <NavLink
                      to={link.to}
                      onClick={() => setMobileOpen(false)}
                      className={({ isActive }) =>
                        `block px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                          isActive
                            ? "bg-blue-500/10 text-blue-400"
                            : "text-base-content/60 hover:bg-base-300/50 hover:text-base-content"
                        }`
                      }
                    >
                      {link.label}
                    </NavLink>
                  </motion.li>
                ))}
              </ul>
              <div className="mt-4 px-4">
                <NavLink to="/login" onClick={() => setMobileOpen(false)} className="block">
                  <Button variant="blue" className="w-full" size="md">
                    Login
                  </Button>
                </NavLink>
              </div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Navbar;
