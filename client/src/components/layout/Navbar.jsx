import { useState, useEffect, useRef, useCallback } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  FiMenu,
  FiX,
  FiUser,
  FiSettings,
  FiLogOut,
  FiLayout,
  FiHeart,
  FiTrendingUp,
  FiCalendar,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { Button, Logo } from "../ui";
import { useAuth } from "../../context/AuthContext";

const sectionLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/gallery", label: "Gallery" },
];

const menuItems = [
  { to: "/dashboard/profile", label: "My Profile", icon: FiUser },
  { to: "/dashboard", label: "Dashboard", icon: FiLayout },
  { to: "/dashboard", label: "My Bookings", icon: FiCalendar },
  { to: "/dashboard", label: "My Progress", icon: FiTrendingUp },
  { to: "/dashboard", label: "Favorites", icon: FiHeart },
  { to: "/dashboard/settings", label: "Settings", icon: FiSettings },
];

const avatarGradients = [
  "from-blue-500 to-cyan-500",
  "from-emerald-500 to-teal-500",
  "from-purple-500 to-pink-500",
  "from-orange-500 to-red-500",
  "from-indigo-500 to-blue-500",
];

function getAvatarGradient(name) {
  if (!name) return avatarGradients[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return avatarGradients[Math.abs(hash) % avatarGradients.length];
}

function UserAvatar({ user, size = "md" }) {
  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-9 h-9 text-sm",
    lg: "w-10 h-10 text-base",
  };

  const initials = user?.firstName
    ? user.firstName.charAt(0).toUpperCase()
    : user?.name
    ? user.name.charAt(0).toUpperCase()
    : "U";

  if (user?.profileImage) {
    return (
      <img
        src={user.profileImage}
        alt={user.firstName || "User"}
        className={`${sizeClasses[size]} rounded-full object-cover ring-2 ring-white/10`}
      />
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-gradient-to-br ${getAvatarGradient(
        user?.firstName || user?.name
      )} flex items-center justify-center text-white font-bold ring-2 ring-white/10`}
    >
      {initials}
    </div>
  );
}

function MenuDropdown({ user, onClose }) {
  const { logout } = useAuth();

  const handleLogout = useCallback(async () => {
    onClose();
    await logout();
  }, [logout, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.95 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="absolute top-full right-0 mt-3 w-64 py-2 rounded-2xl bg-base-200/90 backdrop-blur-2xl border border-base-300/30 shadow-2xl shadow-black/30 z-50"
    >
      <div className="px-4 py-3 border-b border-base-300/30">
        <div className="flex items-center gap-3">
          <UserAvatar user={user} size="md" />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-base-content truncate">
              {user?.firstName} {user?.lastName}
            </p>
            {user?.email && (
              <p className="text-xs text-base-content/40 truncate">
                {user.email}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="py-1.5">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.label}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 text-sm transition-all duration-150 ${
                  isActive
                    ? "bg-blue-500/10 text-blue-400"
                    : "text-base-content/60 hover:bg-base-300/50 hover:text-base-content"
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              {item.label}
            </NavLink>
          );
        })}
      </div>

      <div className="border-t border-base-300/30 pt-1.5">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2.5 text-sm w-full text-left text-red-400 hover:bg-red-500/10 transition-all duration-150"
        >
          <FiLogOut className="w-4 h-4 shrink-0" />
          Logout
        </button>
      </div>
    </motion.div>
  );
}

function MobileLogoutButton({ onClose }) {
  const { logout } = useAuth();

  const handleLogout = useCallback(async () => {
    onClose();
    await logout();
  }, [logout, onClose]);

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium w-full text-left text-red-400 hover:bg-red-500/10 transition-all duration-200"
    >
      <FiLogOut className="w-4 h-4" />
      Logout
    </button>
  );
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  const menuRef = useRef(null);

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
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const handleMouseDown = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen]);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-[background-color,box-shadow,border-color] duration-300 ${
        scrolled
          ? "bg-base-100/80 backdrop-blur-xl shadow-lg shadow-black/10 border-b border-base-300/30"
          : "bg-transparent"
      }`}
    >
      <nav className="relative h-16 sm:h-18 px-4 sm:px-6 lg:px-8" aria-label="Main navigation">

        <div className="hidden lg:flex items-center h-full">
          <div className="flex items-center shrink-0">
            <Logo size="md" showText />
          </div>

          <div className="flex-1 flex items-center justify-center">
            <ul className="flex items-center gap-1">
              {sectionLinks.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    end={link.to === "/"}
                    className={({ isActive }) =>
                      `relative px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 whitespace-nowrap ${
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
                            transition={{
                              type: "spring",
                              stiffness: 380,
                              damping: 30,
                            }}
                          />
                        )}
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center gap-2 ml-auto shrink-0">
            {isAuthenticated ? (
              <div ref={menuRef} className="relative">
                <button
                  onClick={() => setMenuOpen((prev) => !prev)}
                  className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-base-300/40 transition-colors duration-200"
                  aria-label="Toggle menu"
                  aria-expanded={menuOpen}
                >
                  <UserAvatar user={user} size="md" />
                  <motion.div
                    animate={{ rotate: menuOpen ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {menuOpen ? (
                      <FiX className="w-5 h-5 text-base-content/60" />
                    ) : (
                      <FiMenu className="w-5 h-5 text-base-content/60" />
                    )}
                  </motion.div>
                </button>
                <AnimatePresence>
                  {menuOpen && (
                    <MenuDropdown user={user} onClose={() => setMenuOpen(false)} />
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <NavLink to="/login">
                  {({ isActive }) => (
                    <Button size="sm" variant={isActive ? "blue" : "ghost"}>
                      Login
                    </Button>
                  )}
                </NavLink>
                <NavLink to="/register">
                  <Button size="sm" variant="royal">
                    Register
                  </Button>
                </NavLink>
              </>
            )}
          </div>
        </div>

        <div className="lg:hidden flex items-center justify-between h-full">
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

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="lg:hidden overflow-hidden bg-base-200/98 backdrop-blur-xl border-t border-base-300/50"
          >
            <div className="px-4 sm:px-6 lg:px-8 py-4">
              {isAuthenticated && user && (
                <div className="flex items-center gap-3 px-4 py-3 mb-3 rounded-xl bg-base-300/30">
                  <UserAvatar user={user} size="lg" />
                  <div>
                    <p className="text-sm font-semibold text-base-content">
                      {user.firstName} {user.lastName}
                    </p>
                    {user.email && (
                      <p className="text-xs text-base-content/40 truncate max-w-[200px]">
                        {user.email}
                      </p>
                    )}
                  </div>
                </div>
              )}

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
                    className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      location.pathname.startsWith("/fitness-tools")
                        ? "bg-cyan-500/10 text-cyan-400"
                        : "text-base-content/60 hover:bg-base-300/50 hover:text-base-content"
                    }`}
                  >
                    Fitness Tools
                  </NavLink>
                </motion.li>

                {isAuthenticated ? (
                  <>
                    {menuItems.map((item, i) => {
                      const Icon = item.icon;
                      return (
                        <motion.li
                          key={item.label}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            delay: (sectionLinks.length + 1 + i) * 0.05,
                          }}
                        >
                          <NavLink
                            to={item.to}
                            onClick={() => setMobileOpen(false)}
                            className={({ isActive }) =>
                              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                                isActive
                                  ? "bg-blue-500/10 text-blue-400"
                                  : "text-base-content/60 hover:bg-base-300/50 hover:text-base-content"
                              }`
                            }
                          >
                            <Icon className="w-4 h-4" />
                            {item.label}
                          </NavLink>
                        </motion.li>
                      );
                    })}
                    <motion.li
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay:
                          (sectionLinks.length + 1 + menuItems.length) * 0.05,
                      }}
                    >
                      <MobileLogoutButton onClose={() => setMobileOpen(false)} />
                    </motion.li>
                  </>
                ) : (
                  <>
                    <motion.li
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: (sectionLinks.length + 1) * 0.05,
                      }}
                    >
                      <NavLink
                        to="/login"
                        onClick={() => setMobileOpen(false)}
                        className={({ isActive }) =>
                          `block px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                            isActive
                              ? "bg-blue-500/10 text-blue-400"
                              : "text-base-content/60 hover:bg-base-300/50 hover:text-base-content"
                          }`
                        }
                      >
                        Login
                      </NavLink>
                    </motion.li>
                    <motion.li
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: (sectionLinks.length + 2) * 0.05,
                      }}
                    >
                      <NavLink
                        to="/register"
                        onClick={() => setMobileOpen(false)}
                        className="block px-4 py-3 rounded-xl text-sm font-medium text-base-content/60 hover:bg-base-300/50 hover:text-base-content transition-all duration-200"
                      >
                        Register
                      </NavLink>
                    </motion.li>
                  </>
                )}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Navbar;
