import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiGrid,
  FiImage,
  FiInfo,
  FiPackage,
  FiMapPin,
  FiUser,
  FiLogOut,
  FiX,
  FiAward,
  FiCreditCard,
  FiMessageSquare,
  FiCamera,
  FiMail,
  FiSettings,
  FiChevronDown,
  FiBell,
  FiActivity,
} from "react-icons/fi";
import { useState } from "react";
import Logo from "../ui/Logo";

const menuGroups = [
  {
    label: "Overview",
    items: [{ to: "/dashboard", icon: FiGrid, label: "Dashboard", end: true }],
  },
  {
    label: "Content",
    items: [
      { to: "/dashboard/hero", icon: FiImage, label: "Hero Section" },
      { to: "/dashboard/about", icon: FiInfo, label: "About" },
      { to: "/dashboard/services", icon: FiPackage, label: "Services" },
      { to: "/dashboard/trainers", icon: FiAward, label: "Trainers" },
      { to: "/dashboard/membership", icon: FiCreditCard, label: "Membership" },
    ],
  },
  {
    label: "Tools",
    items: [
      { to: "/dashboard/fitness-tools", icon: FiActivity, label: "Fitness Tools" },
    ],
  },
  {
    label: "Community",
    items: [
      { to: "/dashboard/testimonials", icon: FiMessageSquare, label: "Testimonials" },
      { to: "/dashboard/gallery", icon: FiCamera, label: "Gallery" },
      { to: "/dashboard/contact", icon: FiMail, label: "Contact" },
    ],
  },
  {
    label: "Settings",
    items: [
      { to: "/dashboard/footer", icon: FiMapPin, label: "Footer" },
      { to: "/dashboard/settings", icon: FiSettings, label: "Website Settings" },
      { to: "/dashboard/notifications", icon: FiBell, label: "Notifications" },
    ],
  },
];

const bottomItems = [
  { to: "/dashboard/profile", icon: FiUser, label: "Profile" },
  { to: "/", icon: FiLogOut, label: "Logout" },
];

function SidebarLink({ item, onClose }) {
  const location = useLocation();
  const isActive =
    item.end
      ? location.pathname === item.to
      : location.pathname.startsWith(item.to) && location.pathname !== "/dashboard";

  return (
    <NavLink
      to={item.to}
      end={item.end}
      onClick={onClose}
      className="relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group"
    >
      {isActive && (
        <motion.div
          layoutId="sidebar-active"
          className="absolute inset-0 rounded-xl bg-blue-600/10 border border-blue-500/20"
          transition={{ type: "spring", stiffness: 350, damping: 30 }}
        />
      )}
      <div
        className={`relative z-10 p-1.5 rounded-lg transition-all duration-200 ${
          isActive
            ? "bg-blue-500/15 text-blue-400"
            : "text-white/30 group-hover:text-white/60 group-hover:bg-white/5"
        }`}
      >
        <item.icon className="w-4.5 h-4.5" />
      </div>
      <span
        className={`relative z-10 hidden xl:block transition-colors duration-200 ${
          isActive ? "text-blue-400" : "text-white/50 group-hover:text-white/80"
        }`}
      >
        {item.label}
      </span>
      {isActive && (
        <motion.div
          layoutId="sidebar-dot"
          className="absolute right-3 w-1.5 h-1.5 rounded-full bg-blue-400 hidden xl:block"
          transition={{ type: "spring", stiffness: 350, damping: 30 }}
        />
      )}
    </NavLink>
  );
}

function SidebarGroup({ group, isOpen, onToggle, onClose }) {
  return (
    <div className="mb-1">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-2 text-[10px] font-semibold tracking-widest uppercase text-white/20 hover:text-white/35 transition-colors duration-200"
      >
        <span>{group.label}</span>
        <FiChevronDown
          className={`w-3 h-3 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="space-y-0.5 px-1">
              {group.items.map((item) => (
                <SidebarLink key={item.to} item={item} onClose={onClose} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Sidebar({ open, onClose }) {
  const location = useLocation();
  const [openGroups, setOpenGroups] = useState(() => {
    const initial = {};
    menuGroups.forEach((group, i) => {
      initial[i] = group.items.some(
        (item) =>
          item.end
            ? location.pathname === item.to
            : location.pathname.startsWith(item.to)
      );
    });
    if (!Object.values(initial).some(Boolean)) initial[0] = true;
    return initial;
  });

  const toggleGroup = (i) => {
    setOpenGroups((prev) => ({ ...prev, [i]: !prev[i] }));
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#0a0a0f]">
      <div className="px-5 py-5 border-b border-white/5">
        <Logo size="md" color="royal" className="xl:flex" />
        <p className="hidden xl:block text-[10px] text-white/20 mt-1 ml-11 tracking-wide">
          Admin Panel
        </p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin" aria-label="Dashboard navigation">
        {menuGroups.map((group, i) => (
          <SidebarGroup
            key={group.label}
            group={group}
            isOpen={!!openGroups[i]}
            onToggle={() => toggleGroup(i)}
            onClose={onClose}
          />
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-white/5 space-y-0.5">
        {bottomItems.map((item) => (
          <SidebarLink key={item.label} item={item} onClose={onClose} />
        ))}
      </div>

      <div className="px-5 py-4 border-t border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-blue-500/20">
            A
          </div>
          <div className="hidden xl:block min-w-0">
            <p className="text-sm font-medium text-white/80 truncate">Admin</p>
            <p className="text-[11px] text-white/25 truncate">admin@fitbookpro.com</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:flex flex-col w-[72px] xl:w-64 shrink-0 bg-[#0a0a0f] border-r border-white/5 h-screen sticky top-0 overflow-hidden">
        {sidebarContent}
      </aside>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              onClick={onClose}
              aria-hidden="true"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-y-0 left-0 w-72 bg-[#0a0a0f] border-r border-white/5 z-50 lg:hidden flex flex-col"
              role="dialog"
              aria-label="Sidebar navigation"
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-white/5 transition-colors text-white/40 z-10"
                aria-label="Close menu"
              >
                <FiX className="w-5 h-5" />
              </button>
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default Sidebar;
