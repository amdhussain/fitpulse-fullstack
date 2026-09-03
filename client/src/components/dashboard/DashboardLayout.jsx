import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { useTheme } from "../../context/ThemeContext";

function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className={`flex min-h-screen bg-gradient-to-br from-slate-50 via-gray-50/80 to-blue-50/30 dark:from-[#0f1219] dark:via-[#121826] dark:to-[#0f1219]`}>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar
          onMenuClick={() => setSidebarOpen((prev) => !prev)}
          isDark={isDark}
          onToggleDark={toggleTheme}
        />
        <main id="dashboard-content" className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
