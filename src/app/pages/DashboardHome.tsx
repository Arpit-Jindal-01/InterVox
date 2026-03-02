import { useState } from "react";
import { motion } from "motion/react";
import {
  Play,
  Sparkles,
  Bell,
  Search,
  Mic2,
  Clock,
  ArrowRight,
  Star,
  ChevronRight,
} from "lucide-react";
import { InterviewSetupModal } from "../components/dashboard/InterviewSetupModal";
import { NotificationDropdown } from "../components/dashboard/NotificationDropdown";
import { useNavigate } from "react-router";

const recentSessions = [
  {
    role: "Software Engineer",
    level: "Mid",
    score: 88,
    date: "Today, 10:24 AM",
    tags: ["Technical", "Behavioral"],
    color: "#2563EB",
  },
  {
    role: "Product Manager",
    level: "Senior",
    score: 82,
    date: "Yesterday, 3:10 PM",
    tags: ["Leadership", "STAR Method"],
    color: "#7C3AED",
  },
  {
    role: "Frontend Developer",
    level: "Fresher",
    score: 91,
    date: "Feb 28, 11:00 AM",
    tags: ["Technical", "Communication"],
    color: "#0891B2",
  },
];

const quickRoles = [
  { label: "Software Engineer", icon: "💻", color: "#EFF6FF", text: "#2563EB" },
  { label: "Product Manager", icon: "📋", color: "#F5F3FF", text: "#7C3AED" },
  { label: "Data Analyst", icon: "📊", color: "#ECFEFF", text: "#0891B2" },
  { label: "UX Designer", icon: "🎨", color: "#FFF7ED", text: "#EA580C" },
];

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 85 ? "#16A34A" : score >= 70 ? "#D97706" : "#DC2626";
  const bg = score >= 85 ? "#F0FDF4" : score >= 70 ? "#FFFBEB" : "#FEF2F2";
  return (
    <span
      className="px-2.5 py-1 rounded-lg text-sm flex items-center gap-1"
      style={{
        fontFamily: "'Montserrat', sans-serif",
        fontWeight: 700,
        fontSize: "0.8rem",
        backgroundColor: bg,
        color,
      }}
    >
      <Star size={11} strokeWidth={2.5} className={score >= 85 ? "fill-current" : ""} />
      {score}/100
    </span>
  );
}

export default function DashboardHome() {
  const [showModal, setShowModal] = useState(false);
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  const navigate = useNavigate();

  return (
    <>
      <div className="flex-1 overflow-y-auto bg-[#F9FAFB]">
        {/* Top Bar */}
        <header className="bg-white border-b border-[#E2E8F0] sticky top-0 z-30 px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", color: "#94A3B8" }}>
              {today}
            </span>
            <h1
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 800,
                fontSize: "1.2rem",
                color: "#1E293B",
                letterSpacing: "-0.02em",
                lineHeight: 1.3,
              }}
            >
              Welcome back, Alex 👋
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="hidden md:flex items-center gap-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3 py-2 w-56">
              <Search size={14} strokeWidth={2} className="text-[#94A3B8] flex-shrink-0" />
              <input
                type="text"
                placeholder="Search sessions…"
                className="bg-transparent outline-none flex-1 text-sm text-[#1E293B] placeholder-[#94A3B8]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              />
            </div>

            {/* Notifications */}
            <NotificationDropdown />

            {/* Avatar */}
            <img
              src="https://images.unsplash.com/photo-1740174459726-8c57d8366061?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=80"
              alt="User"
              className="w-9 h-9 rounded-xl object-cover border-2 border-[#E2E8F0] cursor-pointer"
              onClick={() => navigate("/profile")}
            />
          </div>
        </header>

        {/* Page Content */}
        <div className="px-6 lg:px-8 py-8 flex flex-col gap-8 max-w-6xl mx-auto">

          {/* Hero Start CTA + Streak */}
          <div className="grid grid-cols-1 gap-4">
            {/* Main CTA card */}
            <div className="relative bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] rounded-2xl p-7 overflow-hidden flex flex-col justify-between gap-6"
              style={{ boxShadow: "0 8px 32px rgba(37,99,235,0.3)" }}>
              {/* Decorative circles */}
              <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/5" />
              <div className="absolute -bottom-6 -right-4 w-24 h-24 rounded-full bg-white/5" />
              <div className="absolute top-4 right-20 w-12 h-12 rounded-full bg-white/5" />

              <div className="relative">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center">
                    <Sparkles size={14} className="text-white" strokeWidth={2.5} />
                  </div>
                  <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: "0.75rem", color: "rgba(255,255,255,0.7)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                    AI Mock Interview
                  </span>
                </div>
                <h2
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontWeight: 800,
                    fontSize: "clamp(1.2rem, 2.5vw, 1.6rem)",
                    color: "#FFFFFF",
                    lineHeight: 1.25,
                    letterSpacing: "-0.025em",
                    marginBottom: "8px",
                  }}
                >
                  Ready to practice today?
                </h2>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.875rem", color: "rgba(255,255,255,0.7)", lineHeight: 1.6 }}>
                  Your AI coach is waiting. Start a session and get instant feedback.
                </p>
              </div>

              <button
                onClick={() => setShowModal(true)}
                className="relative flex items-center gap-2.5 bg-white hover:bg-blue-50 text-[#2563EB] w-fit px-6 py-3 rounded-xl transition-all duration-150 hover:-translate-y-0.5"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 700,
                  fontSize: "0.875rem",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
                }}
              >
                <Play size={14} strokeWidth={2.5} className="fill-[#2563EB]" />
                Start New Interview
                <ArrowRight size={14} strokeWidth={2.5} />
              </button>
            </div>
          </div>

          {/* Quick Start by Role */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: "1rem", color: "#1E293B" }}>
                Quick Start by Role
              </h3>
              <button
                className="flex items-center gap-1 text-[#2563EB] hover:underline"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: "0.8rem" }}
              >
                See all roles <ChevronRight size={14} />
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {quickRoles.map((r) => (
                <button
                  key={r.label}
                  onClick={() => setShowModal(true)}
                  className="flex flex-col items-center gap-2.5 py-5 px-3 rounded-2xl border border-[#E2E8F0] bg-white hover:border-current hover:shadow-md transition-all duration-150 group"
                  style={{ borderColor: "#E2E8F0" }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = r.text)}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#E2E8F0")}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                    style={{ backgroundColor: r.color }}
                  >
                    {r.icon}
                  </div>
                  <span
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 600,
                      fontSize: "0.78rem",
                      color: "#475569",
                      textAlign: "center",
                      lineHeight: 1.4,
                    }}
                  >
                    {r.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Sessions */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: "1rem", color: "#1E293B" }}>
                Recent Sessions
              </h3>
              <button
                className="flex items-center gap-1 text-[#2563EB] hover:underline"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: "0.8rem" }}
              >
                View history <ChevronRight size={14} />
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden"
              style={{ boxShadow: "0 1px 12px rgba(0,0,0,0.05)" }}>
              {recentSessions.map((session, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 px-5 py-4 hover:bg-[#F9FAFB] transition-colors cursor-pointer group border-b border-[#F1F5F9] last:border-b-0"
                >
                  {/* Color dot */}
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: session.color + "15" }}
                  >
                    <Mic2 size={17} strokeWidth={2} style={{ color: session.color }} />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: "0.875rem", color: "#1E293B" }}>
                        {session.role}
                      </span>
                      <span
                        className="px-2 py-0.5 rounded-full text-xs"
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontWeight: 600,
                          fontSize: "0.7rem",
                          backgroundColor: session.color + "12",
                          color: session.color,
                        }}
                      >
                        {session.level}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", color: "#94A3B8" }}>
                        <Clock size={11} strokeWidth={2} className="inline mr-1" />
                        {session.date}
                      </span>
                      {session.tags.map((tag) => (
                        <span key={tag} className="px-1.5 py-0.5 rounded bg-[#F1F5F9] text-[#64748B]"
                          style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.68rem", fontWeight: 500 }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Score */}
                  <ScoreBadge score={session.score} />

                  <ChevronRight size={16} strokeWidth={2} className="text-[#CBD5E1] group-hover:text-[#2563EB] transition-colors" />
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Interview Setup Modal */}
      {showModal && <InterviewSetupModal onClose={() => setShowModal(false)} />}
    </>
  );
}