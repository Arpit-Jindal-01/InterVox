import { useState, useRef, useEffect } from "react";
import { Bell, Check, Clock, Sparkles, Trophy } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const notifications = [
  {
    id: 1,
    type: "achievement",
    icon: Trophy,
    iconBg: "#FFFBEB",
    iconColor: "#D97706",
    title: "Achievement Unlocked!",
    message: "You've completed 10 mock interviews",
    time: "5 min ago",
    unread: true,
  },
  {
    id: 2,
    type: "ai",
    icon: Sparkles,
    iconBg: "#EFF6FF",
    iconColor: "#2563EB",
    title: "New AI Feedback Available",
    message: "Your Software Engineer interview has been analyzed",
    time: "1 hour ago",
    unread: true,
  },
  {
    id: 3,
    type: "reminder",
    icon: Clock,
    iconBg: "#F0FDF4",
    iconColor: "#16A34A",
    title: "Practice Reminder",
    message: "Keep your streak alive! Start a session today",
    time: "3 hours ago",
    unread: false,
  },
];

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const unreadCount = notifications.filter((n) => n.unread).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-9 h-9 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl flex items-center justify-center text-[#64748B] hover:bg-[#EFF6FF] hover:text-[#2563EB] hover:border-[#2563EB] transition-colors"
      >
        <Bell size={16} strokeWidth={2} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#EF4444] rounded-full animate-pulse" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl border border-[#E2E8F0] shadow-2xl overflow-hidden z-50"
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-[#E2E8F0] flex items-center justify-between">
              <h3
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 700,
                  fontSize: "0.875rem",
                  color: "#1E293B",
                }}
              >
                Notifications
              </h3>
              {unreadCount > 0 && (
                <span
                  className="px-2 py-0.5 rounded-full bg-[#EFF6FF] text-[#2563EB]"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 600,
                    fontSize: "0.7rem",
                  }}
                >
                  {unreadCount} new
                </span>
              )}
            </div>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`px-4 py-3 border-b border-[#F1F5F9] hover:bg-[#F9FAFB] transition-colors cursor-pointer group ${
                    notification.unread ? "bg-[#F8FAFC]" : ""
                  }`}
                >
                  <div className="flex gap-3">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: notification.iconBg }}
                    >
                      <notification.icon size={16} style={{ color: notification.iconColor }} strokeWidth={2} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 600,
                            fontSize: "0.8rem",
                            color: "#1E293B",
                          }}
                        >
                          {notification.title}
                        </p>
                        {notification.unread && (
                          <div className="w-2 h-2 rounded-full bg-[#2563EB] flex-shrink-0 mt-1" />
                        )}
                      </div>
                      <p
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: "0.75rem",
                          color: "#64748B",
                          lineHeight: 1.5,
                          marginTop: "2px",
                        }}
                      >
                        {notification.message}
                      </p>
                      <p
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: "0.7rem",
                          color: "#94A3B8",
                          marginTop: "4px",
                        }}
                      >
                        {notification.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-4 py-2.5 border-t border-[#E2E8F0] bg-[#F9FAFB]">
              <button
                className="w-full flex items-center justify-center gap-1.5 text-[#2563EB] hover:text-[#1D4ED8] transition-colors"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  fontSize: "0.75rem",
                }}
              >
                <Check size={14} strokeWidth={2} />
                Mark all as read
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
