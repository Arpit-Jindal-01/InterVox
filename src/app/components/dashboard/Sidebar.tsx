import { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { motion } from "motion/react";
import {
  LayoutDashboard,
  Mic2,
  ClockArrowUp,
  UserCircle,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  LogOut,
} from "lucide-react";
import { Logo } from "../Logo";

const navItems = [
  { icon: LayoutDashboard, label: "Home", to: "/dashboard" },
  { icon: Mic2, label: "Practice", to: "/dashboard/practice" },
  { icon: ClockArrowUp, label: "History", to: "/dashboard/history" },
  { icon: UserCircle, label: "Profile", to: "/dashboard/profile" },
  { icon: Settings, label: "Settings", to: "/dashboard/settings" },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/logout");
  };

  return (
    <motion.aside
      initial={{ x: -240, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-col bg-[#1E293B] transition-all duration-300 ease-in-out relative flex-shrink-0"
      style={{ width: collapsed ? "72px" : "240px", minHeight: "100vh" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-[#334155] overflow-hidden justify-center">
        {!collapsed && (
          <Logo className="h-10" />
        )}
        {collapsed && (
          <div className="w-9 h-9 rounded-xl bg-[#2563EB] flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-900/40">
            <Sparkles size={17} className="text-white" strokeWidth={2.5} />
          </div>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 py-4 flex flex-col gap-1 px-2">
        {navItems.map(({ icon: Icon, label, to }) => (
          <NavLink
            key={label}
            to={to}
            end={to === "/dashboard"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group relative ${
                isActive
                  ? "bg-[#2563EB] text-white shadow-lg shadow-blue-900/30"
                  : "text-[#94A3B8] hover:text-white hover:bg-[#334155]"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  size={18}
                  strokeWidth={isActive ? 2.5 : 2}
                  className="flex-shrink-0"
                />
                {!collapsed && (
                  <span
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: isActive ? 600 : 500,
                      fontSize: "0.875rem",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {label}
                  </span>
                )}
                {/* Tooltip when collapsed */}
                {collapsed && (
                  <div className="absolute left-full ml-3 px-2.5 py-1 bg-[#0F172A] text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 border border-[#334155]"
                    style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
                  >
                    {label}
                  </div>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom: User + Logout */}
      <div className="border-t border-[#334155] p-3 flex flex-col gap-2">
        <button
          onClick={() => navigate("/dashboard/profile")}
          className={`flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-[#334155] transition-colors ${collapsed ? "justify-center" : ""}`}
        >
          <img
            src="https://images.unsplash.com/photo-1740174459726-8c57d8366061?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=80"
            alt="User avatar"
            className="w-8 h-8 rounded-full object-cover border-2 border-[#334155] flex-shrink-0"
          />
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: "0.8rem", color: "#F1F5F9" }}>
                Alex Johnson
              </span>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", color: "#64748B" }}>
                Free Plan
              </span>
            </div>
          )}
        </button>
        <button
          className="flex items-center gap-3 px-3 py-2 rounded-xl text-[#94A3B8] hover:text-[#EF4444] hover:bg-[#334155] transition-all duration-150 group"
          title="Log out"
          onClick={handleLogout}
        >
          <LogOut size={17} strokeWidth={2} className="flex-shrink-0" />
          {!collapsed && (
            <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: "0.875rem" }}>
              Log Out
            </span>
          )}
        </button>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3.5 top-20 w-7 h-7 bg-[#1E293B] border border-[#334155] rounded-full flex items-center justify-center text-[#64748B] hover:text-white hover:bg-[#2563EB] hover:border-[#2563EB] transition-all duration-150 shadow-md z-10"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? <ChevronRight size={13} strokeWidth={2.5} /> : <ChevronLeft size={13} strokeWidth={2.5} />}
      </button>
    </motion.aside>
  );
}