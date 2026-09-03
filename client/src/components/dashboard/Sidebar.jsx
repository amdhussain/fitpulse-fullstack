import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiGrid, FiImage, FiInfo, FiPackage, FiMapPin, FiUser, FiLogOut,
  FiX, FiAward, FiCreditCard, FiMessageSquare, FiCamera, FiMail,
  FiSettings, FiChevronDown, FiBell, FiActivity, FiCalendar,
  FiUserCheck, FiDollarSign, FiSearch, FiUsers, FiFileText, FiPhone,
} from "react-icons/fi";
import { useState } from "react";
import Logo from "../ui/Logo";
import { useAuth } from "../../context/AuthContext";

const memberMenuGroups = [
  {
    label: "Overview",
    items: [{ to: "/dashboard", icon: FiGrid, label: "Dashboard", end: true }],
  },
  {
    label: "Bookings",
    items: [
      { to: "/dashboard/my-bookings", icon: FiCalendar, label: "My Bookings" },
      { to: "/dashboard/my-payments", icon: FiDollarSign, label: "My Payments" },
    ],
  },
  {
    label: "Tools",
    items: [{ to: "/dashboard/fitness-tools", icon: FiActivity, label: "Fitness Tools" }],
  },
  {
    label: "Community",
    items: [
      { to: "/dashboard/gallery", icon: FiCamera, label: "Gallery" },
      { to: "/dashboard/connect-info", icon: FiPhone, label: "Connect" },
    ],
  },
];

const adminMenuGroups = [
  {
    label: "Overview",
    items: [{ to: "/dashboard", icon: FiGrid, label: "Dashboard", end: true }],
  },
  {
    label: "User Management",
    items: [{ to: "/dashboard/users", icon: FiUsers, label: "Users Management" }],
  },
  {
    label: "Trainer Management",
    items: [
      { to: "/dashboard/trainers", icon: FiAward, label: "Trainers Management" },
      { to: "/dashboard/trainer-approval", icon: FiUserCheck, label: "Trainer Approval" },
    ],
  },
  {
    label: "Booking Management",
    items: [
      { to: "/dashboard/classes", icon: FiActivity, label: "Class Management" },
      { to: "/dashboard/bookings", icon: FiCalendar, label: "Booking Management" },
    ],
  },
  {
    label: "Payment Management",
    items: [
      { to: "/dashboard/payments", icon: FiDollarSign, label: "Payment Management" },
      { to: "/dashboard/payment-methods", icon: FiCreditCard, label: "Payment Methods" },
    ],
  },
  {
    label: "Content Management",
    items: [
      { to: "/dashboard/hero", icon: FiImage, label: "Hero Management" },
      { to: "/dashboard/about", icon: FiInfo, label: "About Management" },
      { to: "/dashboard/services", icon: FiPackage, label: "Services Management" },
      { to: "/dashboard/trainers", icon: FiAward, label: "Trainers Management" },
      { to: "/dashboard/membership", icon: FiCreditCard, label: "Membership Management" },
      { to: "/dashboard/gallery", icon: FiCamera, label: "Gallery Management" },
      { to: "/dashboard/testimonials", icon: FiMessageSquare, label: "Testimonials Management" },
    ],
  },
  {
    label: "Communication",
    items: [
      { to: "/dashboard/connect-info", icon: FiPhone, label: "Connect Info" },
      { to: "/dashboard/contact", icon: FiMail, label: "Contact Messages" },
      { to: "/dashboard/newsletter", icon: FiFileText, label: "Newsletter Management" },
    ],
  },
  {
    label: "CMS Settings",
    items: [
      { to: "/dashboard/settings", icon: FiSettings, label: "Website Settings" },
      { to: "/dashboard/seo", icon: FiSearch, label: "SEO Settings" },
      { to: "/dashboard/footer", icon: FiMapPin, label: "Footer Management" },
      { to: "/dashboard/notifications", icon: FiBell, label: "Notifications" },
    ],
  },
];

const memberBottomItems = [
  { to: "/dashboard/profile", icon: FiUser, label: "Profile" },
  { to: "/", icon: FiLogOut, label: "Logout" },
];

const adminBottomItems = [
  { to: "/dashboard/admin-profile", icon: FiUser, label: "Admin Profile" },
  { to: "/dashboard/admin-settings", icon: FiSettings, label: "Admin Settings" },
  { to: "/", icon: FiLogOut, label: "Logout" },
];

function SidebarLink({ item, onClose }) {
  const location = useLocation();
  const isActive = item.end
    ? location.pathname === item.to
    : location.pathname.startsWith(item.to) && location.pathname !== "/dashboard";

  return (
    <NavLink
      to={item.to}
      end={item.end}
      onClick={onClose}
      className="relative flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 group"
    >
      {isActive && (
        <motion.div
          layoutId="sidebar-active"
          className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50/50 dark:from-blue-500/10 dark:to-indigo-500/5 border border-blue-200/60 dark:border-blue-500/20"
          transition={{ type: "spring", stiffness: 350, damping: 30 }}
        />
      )}
      <div className={`relative z-10 p-1.5 rounded-lg transition-all duration-200 ${
        isActive ? "bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400" : "text-gray-400 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200 group-hover:bg-gray-100 dark:group-hover:bg-white/5"
      }`}>
        <item.icon className="w-[18px] h-[18px]" />
      </div>
      <span className={`relative z-10 transition-colors duration-200 ${
        isActive ? "text-blue-700 dark:text-blue-300 font-semibold" : "text-gray-500 dark:text-gray-300 group-hover:text-gray-700 dark:group-hover:text-gray-100"
      }`}>
        {item.label}
      </span>
      {isActive && (
        <motion.div
          layoutId="sidebar-dot"
          className="absolute right-3 w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-blue-400 shadow-sm shadow-blue-500/50"
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
        className="w-full flex items-center justify-between px-4 py-2.5 text-[10px] font-semibold tracking-widest uppercase text-gray-400 dark:text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors duration-200"
      >
        <span>{group.label}</span>
        <FiChevronDown className={`w-3 h-3 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
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
  const { user, isAdmin } = useAuth();
  const menuGroups = isAdmin ? adminMenuGroups : memberMenuGroups;
  const bottomItems = isAdmin ? adminBottomItems : memberBottomItems;

  const [openGroups, setOpenGroups] = useState(() => {
    const initial = {};
    menuGroups.forEach((group, i) => {
      if (isAdmin) {
        initial[i] = true;
      } else {
        initial[i] = group.items.some((item) =>
          item.end ? location.pathname === item.to : location.pathname.startsWith(item.to)
        );
      }
    });
    if (!Object.values(initial).some(Boolean)) initial[0] = true;
    return initial;
  });

  const toggleGroup = (i) => setOpenGroups((prev) => ({ ...prev, [i]: !prev[i] }));

  const userInitial = user?.firstName?.charAt(0)?.toUpperCase() || "U";
  const userName = user ? `${user.firstName} ${user.lastName}` : "User";
  const userEmail = user?.email || "";

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white dark:bg-[#131924]">
      <div className="px-5 py-5 border-b border-gray-100 dark:border-white/5">
        <Logo size="md" color="royal" />
        <p className="text-[10px] text-gray-400 dark:text-gray-400 mt-1 ml-11 tracking-wide">
          {isAdmin ? "Admin Panel" : "Dashboard"}
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

      <div className="px-3 py-4 border-t border-gray-100 dark:border-white/5 space-y-0.5">
        {bottomItems.map((item) => (
          <SidebarLink key={item.label} item={item} onClose={onClose} />
        ))}
      </div>

      <div className="px-5 py-4 border-t border-gray-100 dark:border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-blue-500/25">
            {userInitial}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">{userName}</p>
            <p className="text-[11px] text-gray-400 dark:text-gray-400 truncate">{userEmail}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden xl:flex flex-col w-64 shrink-0 bg-white dark:bg-[#131924] border-r border-gray-200/80 dark:border-white/[0.06] h-screen sticky top-0 overflow-hidden">
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
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 xl:hidden"
              onClick={onClose}
              aria-hidden="true"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-y-0 left-0 w-72 bg-white dark:bg-[#131924] border-r border-gray-200/80 dark:border-white/[0.06] z-50 xl:hidden flex flex-col"
              role="dialog"
              aria-label="Sidebar navigation"
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-400 dark:text-gray-400 z-10"
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
