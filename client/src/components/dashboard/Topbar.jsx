import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMenu,
  FiBell,
  FiSearch,
  FiSun,
  FiMoon,
  FiX,
} from "react-icons/fi";
import { getNotifications } from "../../lib/dashboardData";

const routeTitles = {
  "/dashboard": "Dashboard Overview",
  "/dashboard/profile": "Profile",
  "/dashboard/hero": "Hero Management",
  "/dashboard/about": "About Management",
  "/dashboard/services": "Services Management",
  "/dashboard/trainers": "Trainers Management",
  "/dashboard/membership": "Membership Plans",
  "/dashboard/testimonials": "Testimonials",
  "/dashboard/gallery": "Gallery",
  "/dashboard/contact": "Contact Messages",
  "/dashboard/footer": "Footer Management",
  "/dashboard/settings": "Website Settings",
};

const notifColors = {
  blue: "bg-blue-500/15 text-blue-400",
  emerald: "bg-emerald-500/15 text-emerald-400",
  amber: "bg-amber-500/15 text-amber-400",
  purple: "bg-purple-500/15 text-purple-400",
  rose: "bg-rose-500/15 text-rose-400",
};

function NotificationPanel({ isOpen, onClose }) {
  const notifications = getNotifications();
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-2xl bg-[#12121a] border border-white/10 shadow-2xl shadow-black/40 z-50 overflow-hidden"
          >
            <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-white">Notifications</h3>
                {unread > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-bold">
                    {unread} new
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-white/5 text-white/30 hover:text-white/60 transition-colors"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.map((notif) => {
                const Icon = notif.icon;
                return (
                  <div
                    key={notif.id}
                    className={`px-5 py-3.5 flex items-start gap-3 border-b border-white/5 transition-colors hover:bg-white/[0.02] ${
                      !notif.read ? "bg-blue-500/[0.03]" : ""
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                        notifColors[notif.color] || notifColors.blue
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-white/80 truncate">
                          {notif.title}
                        </p>
                        {!notif.read && (
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-white/30 mt-0.5 line-clamp-1">
                        {notif.message}
                      </p>
                      <p className="text-[10px] text-white/20 mt-1">{notif.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="px-5 py-3 border-t border-white/5">
              <button className="w-full text-center text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors">
                View all notifications
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function Topbar({ onMenuClick }) {
  const { pathname } = useLocation();
  const title = routeTitles[pathname] || "Dashboard";
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [darkMode, setDarkMode] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = getNotifications().filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 sm:px-6 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-white/5 transition-colors text-white/50"
          aria-label="Open menu"
        >
          <FiMenu className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-semibold text-white">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        <div
          className={`hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl border transition-all duration-300 ${
            searchFocused
              ? "bg-white/5 border-blue-500/30 w-64"
              : "bg-white/[0.03] border-white/5 w-48"
          }`}
        >
          <FiSearch className="w-4 h-4 text-white/25 shrink-0" />
          <input
            type="text"
            placeholder="Search..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="bg-transparent text-sm text-white/70 placeholder:text-white/20 outline-none w-full"
          />
          {searchValue && (
            <button
              onClick={() => setSearchValue("")}
              className="text-white/25 hover:text-white/50 transition-colors"
            >
              <FiX className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <button
          className="sm:hidden p-2 rounded-lg hover:bg-white/5 transition-colors text-white/40"
          aria-label="Search"
        >
          <FiSearch className="w-5 h-5" />
        </button>

        <button
          onClick={() => setDarkMode((v) => !v)}
          className="p-2 rounded-lg hover:bg-white/5 transition-colors text-white/40 hover:text-white/60"
          aria-label="Toggle theme"
        >
          {darkMode ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
        </button>

        <div className="relative">
          <button
            onClick={() => setShowNotifications((v) => !v)}
            className="relative p-2 rounded-lg hover:bg-white/5 transition-colors text-white/40 hover:text-white/60"
            aria-label="Notifications"
          >
            <FiBell className="w-5 h-5" />
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-1 right-1 w-4 h-4 rounded-full bg-blue-500 text-[9px] font-bold text-white flex items-center justify-center shadow-lg shadow-blue-500/30"
              >
                {unreadCount}
              </motion.span>
            )}
          </button>
          <NotificationPanel
            isOpen={showNotifications}
            onClose={() => setShowNotifications(false)}
          />
        </div>

        <div className="w-px h-6 bg-white/5 mx-1 hidden sm:block" />

        <Link
          to="/dashboard/profile"
          className="flex items-center gap-2.5 p-1.5 pr-3 rounded-xl hover:bg-white/5 transition-colors"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-blue-500/20">
            A
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-sm font-medium text-white/80 leading-tight">Admin</p>
            <p className="text-[10px] text-white/25 leading-tight">admin@fitbookpro.com</p>
          </div>
        </Link>
      </div>
    </header>
  );
}

export default Topbar;
