import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Calendar,
  Clock,
  Eye,
  TrendingUp,
  Filter,
  Search,
  ChevronDown,
  FileText,
  Trophy,
  Briefcase,
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

// Mock data for past interview sessions
const mockSessions = [
  {
    id: 1,
    date: "March 2, 2026",
    dateShort: "Mar 2",
    role: "Software Engineer",
    level: "Mid Level",
    score: 88,
    duration: "24 min",
    questions: 10,
  },
  {
    id: 2,
    date: "February 28, 2026",
    dateShort: "Feb 28",
    role: "Frontend Developer",
    level: "Fresher",
    score: 91,
    duration: "22 min",
    questions: 10,
  },
  {
    id: 3,
    date: "February 25, 2026",
    dateShort: "Feb 25",
    role: "Product Manager",
    level: "Senior",
    score: 82,
    duration: "26 min",
    questions: 10,
  },
  {
    id: 4,
    date: "February 22, 2026",
    dateShort: "Feb 22",
    role: "Software Engineer",
    level: "Mid Level",
    score: 85,
    duration: "23 min",
    questions: 10,
  },
  {
    id: 5,
    date: "February 18, 2026",
    dateShort: "Feb 18",
    role: "Data Analyst",
    level: "Mid Level",
    score: 78,
    duration: "25 min",
    questions: 10,
  },
  {
    id: 6,
    date: "February 15, 2026",
    dateShort: "Feb 15",
    role: "UX Designer",
    level: "Mid Level",
    score: 80,
    duration: "21 min",
    questions: 10,
  },
];

// Prepare chart data (reverse to show chronological order)
const chartData = [...mockSessions]
  .reverse()
  .map((session) => ({
    date: session.dateShort,
    score: session.score,
  }));

function getScoreColor(score: number) {
  if (score >= 85) return "#10B981";
  if (score >= 70) return "#F59E0B";
  return "#EF4444";
}

function getScoreBg(score: number) {
  if (score >= 85) return "#F0FDF4";
  if (score >= 70) return "#FFFBEB";
  return "#FEF2F2";
}

function getScoreLabel(score: number) {
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Good";
  return "Needs Work";
}

export default function History() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);

  const averageScore = Math.round(mockSessions.reduce((sum, s) => sum + s.score, 0) / mockSessions.length);
  const totalSessions = mockSessions.length;
  const bestScore = Math.max(...mockSessions.map((s) => s.score));

  const filteredSessions = mockSessions.filter((session) =>
    session.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 overflow-y-auto bg-[#F9FAFB]">
      {/* Header */}
      <header className="bg-white border-b border-[#E2E8F0] px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] flex items-center justify-center">
              <Clock size={18} className="text-[#2563EB]" strokeWidth={2} />
            </div>
            <h1
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 800,
                fontSize: "1.5rem",
                color: "#1E293B",
                letterSpacing: "-0.02em",
              }}
            >
              Interview History
            </h1>
          </div>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.9rem",
              color: "#64748B",
              lineHeight: 1.6,
            }}
          >
            Track your progress and review past interview sessions
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div className="px-6 lg:px-8 py-8 max-w-7xl mx-auto">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div
            className="bg-white rounded-2xl border border-[#E2E8F0] p-5"
            style={{ boxShadow: "0 1px 12px rgba(0,0,0,0.05)" }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] flex items-center justify-center">
                <FileText size={18} className="text-[#2563EB]" strokeWidth={2} />
              </div>
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  fontSize: "0.8rem",
                  color: "#64748B",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Total Interviews
              </p>
            </div>
            <p
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 800,
                fontSize: "2rem",
                color: "#1E293B",
                lineHeight: 1,
              }}
            >
              {totalSessions}
            </p>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.75rem",
                color: "#94A3B8",
                marginTop: "4px",
              }}
            >
              Completed sessions
            </p>
          </div>

          <div
            className="bg-white rounded-2xl border border-[#E2E8F0] p-5"
            style={{ boxShadow: "0 1px 12px rgba(0,0,0,0.05)" }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-[#F0FDF4] flex items-center justify-center">
                <TrendingUp size={18} className="text-[#10B981]" strokeWidth={2} />
              </div>
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  fontSize: "0.8rem",
                  color: "#64748B",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Average Score
              </p>
            </div>
            <p
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 800,
                fontSize: "2rem",
                color: getScoreColor(averageScore),
                lineHeight: 1,
              }}
            >
              {averageScore}%
            </p>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.75rem",
                color: "#94A3B8",
                marginTop: "4px",
              }}
            >
              {getScoreLabel(averageScore)} performance
            </p>
          </div>

          <div
            className="bg-white rounded-2xl border border-[#E2E8F0] p-5"
            style={{ boxShadow: "0 1px 12px rgba(0,0,0,0.05)" }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-[#FFFBEB] flex items-center justify-center">
                <Trophy size={18} className="text-[#F59E0B]" strokeWidth={2} />
              </div>
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  fontSize: "0.8rem",
                  color: "#64748B",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Best Score
              </p>
            </div>
            <p
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 800,
                fontSize: "2rem",
                color: getScoreColor(bestScore),
                lineHeight: 1,
              }}
            >
              {bestScore}%
            </p>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.75rem",
                color: "#94A3B8",
                marginTop: "4px",
              }}
            >
              Personal best
            </p>
          </div>
        </div>

        {/* Score Trend Chart */}
        <div className="mb-8">
          <div
            className="bg-white rounded-2xl border border-[#E2E8F0] p-6"
            style={{ boxShadow: "0 1px 12px rgba(0,0,0,0.05)" }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] flex items-center justify-center">
                <TrendingUp size={18} className="text-[#2563EB]" strokeWidth={2} />
              </div>
              <div>
                <h2
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontWeight: 700,
                    fontSize: "1.1rem",
                    color: "#1E293B",
                  }}
                >
                  Score Trend Over Time
                </h2>
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.75rem",
                    color: "#64748B",
                  }}
                >
                  Your performance across recent interviews
                </p>
              </div>
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                  <XAxis
                    dataKey="date"
                    stroke="#94A3B8"
                    style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.75rem" }}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#94A3B8"
                    style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.75rem" }}
                    tickLine={false}
                    domain={[0, 100]}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1E293B",
                      border: "1px solid #334155",
                      borderRadius: "12px",
                      padding: "8px 12px",
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "0.875rem",
                      color: "#E2E8F0",
                    }}
                    labelStyle={{ color: "#94A3B8", fontSize: "0.75rem" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#2563EB"
                    strokeWidth={3}
                    dot={{ fill: "#2563EB", r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Sessions Table */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 700,
                fontSize: "1.1rem",
                color: "#1E293B",
              }}
            >
              All Sessions
            </h2>

            {/* Search and Filter */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 bg-white border border-[#E2E8F0] rounded-xl px-3 py-2">
                <Search size={14} strokeWidth={2} className="text-[#94A3B8]" />
                <input
                  type="text"
                  placeholder="Search by role..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-transparent outline-none text-sm text-[#1E293B] placeholder-[#94A3B8] w-40"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                />
              </div>

              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] transition-colors"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: "0.875rem", color: "#475569" }}
              >
                <Filter size={14} strokeWidth={2} />
                Filter
              </button>
            </div>
          </div>

          {filteredSessions.length === 0 ? (
            // Empty State
            <div
              className="bg-white rounded-2xl border border-[#E2E8F0] p-12 text-center"
              style={{ boxShadow: "0 1px 12px rgba(0,0,0,0.05)" }}
            >
              <div className="w-16 h-16 rounded-full bg-[#F1F5F9] flex items-center justify-center mx-auto mb-4">
                <FileText size={32} className="text-[#94A3B8]" strokeWidth={1.5} />
              </div>
              <h3
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 700,
                  fontSize: "1.1rem",
                  color: "#1E293B",
                  marginBottom: "8px",
                }}
              >
                No interviews found
              </h3>
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.875rem",
                  color: "#64748B",
                  marginBottom: "20px",
                }}
              >
                {searchTerm
                  ? `No results for "${searchTerm}". Try a different search.`
                  : "You haven't taken any interviews yet."}
              </p>
              {!searchTerm && (
                <button
                  onClick={() => navigate("/dashboard/practice")}
                  className="px-6 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white transition-colors"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    boxShadow: "0 4px 12px rgba(37,99,235,0.25)",
                  }}
                >
                  Start Your First Interview
                </button>
              )}
            </div>
          ) : (
            // Table
            <div
              className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden"
              style={{ boxShadow: "0 1px 12px rgba(0,0,0,0.05)" }}
            >
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-[#F8FAFC] border-b border-[#E2E8F0]">
                <div className="col-span-3">
                  <p
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 600,
                      fontSize: "0.75rem",
                      color: "#64748B",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Date
                  </p>
                </div>
                <div className="col-span-3">
                  <p
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 600,
                      fontSize: "0.75rem",
                      color: "#64748B",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Job Role
                  </p>
                </div>
                <div className="col-span-2">
                  <p
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 600,
                      fontSize: "0.75rem",
                      color: "#64748B",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Level
                  </p>
                </div>
                <div className="col-span-2">
                  <p
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 600,
                      fontSize: "0.75rem",
                      color: "#64748B",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Score
                  </p>
                </div>
                <div className="col-span-2">
                  <p
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 600,
                      fontSize: "0.75rem",
                      color: "#64748B",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Actions
                  </p>
                </div>
              </div>

              {/* Table Rows */}
              {filteredSessions.map((session) => (
                <div
                  key={session.id}
                  className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-[#F1F5F9] last:border-b-0 hover:bg-[#F8FAFC] transition-colors"
                >
                  <div className="col-span-3 flex items-center gap-2">
                    <Calendar size={14} className="text-[#94A3B8]" strokeWidth={2} />
                    <div>
                      <p
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontWeight: 500,
                          fontSize: "0.875rem",
                          color: "#1E293B",
                        }}
                      >
                        {session.date}
                      </p>
                      <p
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: "0.75rem",
                          color: "#94A3B8",
                        }}
                      >
                        {session.duration}
                      </p>
                    </div>
                  </div>

                  <div className="col-span-3 flex items-center gap-2">
                    <Briefcase size={14} className="text-[#94A3B8]" strokeWidth={2} />
                    <p
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 500,
                        fontSize: "0.875rem",
                        color: "#1E293B",
                      }}
                    >
                      {session.role}
                    </p>
                  </div>

                  <div className="col-span-2 flex items-center">
                    <span
                      className="px-2.5 py-1 rounded-full text-xs"
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 600,
                        fontSize: "0.75rem",
                        backgroundColor: "#EFF6FF",
                        color: "#2563EB",
                      }}
                    >
                      {session.level}
                    </span>
                  </div>

                  <div className="col-span-2 flex items-center">
                    <div
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                      style={{ backgroundColor: getScoreBg(session.score) }}
                    >
                      <Trophy size={12} strokeWidth={2.5} style={{ color: getScoreColor(session.score) }} />
                      <span
                        style={{
                          fontFamily: "'Montserrat', sans-serif",
                          fontWeight: 700,
                          fontSize: "0.8rem",
                          color: getScoreColor(session.score),
                        }}
                      >
                        {session.score}%
                      </span>
                    </div>
                  </div>

                  <div className="col-span-2 flex items-center">
                    <button
                      onClick={() => navigate("/interview-results")}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#2563EB] transition-colors"
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 600,
                        fontSize: "0.8rem",
                      }}
                    >
                      <Eye size={14} strokeWidth={2} />
                      View Report
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
