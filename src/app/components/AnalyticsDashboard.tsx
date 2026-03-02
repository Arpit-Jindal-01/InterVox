import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, Mic, Eye, Brain, MessageSquare, Target, Sparkles } from "lucide-react";

const progressData = [
  { session: "S1", score: 38 },
  { session: "S2", score: 45 },
  { session: "S3", score: 52 },
  { session: "S4", score: 58 },
  { session: "S5", score: 63 },
  { session: "S6", score: 71 },
  { session: "S7", score: 75 },
  { session: "S8", score: 82 },
  { session: "S9", score: 87 },
  { session: "S10", score: 92 },
];

const metrics = [
  { label: "Verbal Clarity", score: 91, icon: Mic, color: "#2563EB", bg: "#EFF6FF" },
  { label: "Eye Contact", score: 84, icon: Eye, color: "#7C3AED", bg: "#F5F3FF" },
  { label: "Critical Thinking", score: 88, icon: Brain, color: "#0891B2", bg: "#ECFEFF" },
  { label: "Answer Structure", score: 94, icon: MessageSquare, color: "#059669", bg: "#F0FDF4" },
  { label: "Confidence Level", score: 79, icon: Target, color: "#D97706", bg: "#FFFBEB" },
  { label: "AI Insight Score", score: 96, icon: Sparkles, color: "#DB2777", bg: "#FDF2F8" },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1E293B] text-white rounded-xl px-4 py-3 shadow-xl border border-[#334155]">
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", color: "#94A3B8", marginBottom: "2px" }}>
          {label}
        </p>
        <p style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: "1rem", color: "#60A5FA" }}>
          {payload[0].value}
          <span style={{ fontSize: "0.7rem", color: "#94A3B8", marginLeft: "2px" }}>/100</span>
        </p>
      </div>
    );
  }
  return null;
};

function ScoreRing({ score, color }: { score: number; color: string }) {
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  return (
    <svg width="56" height="56" viewBox="0 0 56 56">
      <circle cx="28" cy="28" r={radius} fill="none" stroke="#E2E8F0" strokeWidth="4" />
      <circle
        cx="28"
        cy="28"
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform="rotate(-90 28 28)"
        style={{ transition: "stroke-dashoffset 1s ease" }}
      />
      <text
        x="28"
        y="32"
        textAnchor="middle"
        style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: "11px", fill: "#1E293B" }}
      >
        {score}
      </text>
    </svg>
  );
}

export function AnalyticsDashboard() {
  return (
    <section className="bg-[#F8FAFC] py-20 lg:py-28 relative overflow-hidden">
      {/* Decorative grid */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, #2563EB 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center mb-16 flex flex-col items-center gap-4">
          <span
            className="inline-flex items-center gap-2 text-[#2563EB] bg-[#EFF6FF] border border-[#BFDBFE] px-4 py-1.5 rounded-full text-xs"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase" }}
          >
            <TrendingUp size={12} strokeWidth={2.5} />
            Performance Analytics
          </span>
          <h2
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 800,
              fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)",
              lineHeight: 1.2,
              letterSpacing: "-0.025em",
              color: "#1E293B",
            }}
          >
            Watch Your Skills{" "}
            <span className="text-[#2563EB]">Grow in Real Time</span>
          </h2>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "1.0625rem",
              color: "#64748B",
              lineHeight: 1.7,
              maxWidth: "520px",
            }}
          >
            Our AI tracks every session and surfaces detailed insights so you always know what to improve next.
          </p>
        </div>

        {/* Dashboard Card */}
        <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-2xl shadow-slate-100 overflow-hidden">
          {/* Top bar */}
          <div className="bg-[#1E293B] px-6 py-4 flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-[#EF4444]" />
            <span className="w-3 h-3 rounded-full bg-[#F59E0B]" />
            <span className="w-3 h-3 rounded-full bg-[#22C55E]" />
            <div className="flex-1 mx-4 bg-[#334155] rounded-md px-3 py-1 flex items-center">
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.65rem", color: "#94A3B8" }}>
                app.intervox.ai/dashboard/analytics
              </span>
            </div>
            <div className="flex items-center gap-2 bg-[#0F4C75]/50 rounded-lg px-3 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.65rem", color: "#94A3B8", fontWeight: 600 }}>
                Live Session
              </span>
            </div>
          </div>

          {/* Dashboard Body */}
          <div className="p-6 lg:p-10 grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Left: Chart */}
            <div className="lg:col-span-3 flex flex-col gap-6">
              {/* Improvement callout */}
              <div className="flex items-center justify-between">
                <div>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", color: "#94A3B8", marginBottom: "4px" }}>
                    Overall Improvement
                  </p>
                  <div className="flex items-end gap-2">
                    <span
                      style={{
                        fontFamily: "'Montserrat', sans-serif",
                        fontWeight: 800,
                        fontSize: "2.75rem",
                        color: "#1E293B",
                        lineHeight: 1,
                      }}
                    >
                      70%
                    </span>
                    <div className="flex items-center gap-1 mb-1 bg-[#F0FDF4] border border-[#BBF7D0] rounded-lg px-2 py-1">
                      <TrendingUp size={12} className="text-[#22C55E]" strokeWidth={2.5} />
                      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.72rem", fontWeight: 700, color: "#16A34A" }}>
                        +54 pts
                      </span>
                    </div>
                  </div>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.78rem", color: "#94A3B8" }}>
                    Score: 38 → 92 across 10 sessions
                  </p>
                </div>
                <div className="hidden sm:flex flex-col items-end gap-1">
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", color: "#94A3B8" }}>Current Score</span>
                  <div className="flex items-baseline gap-1">
                    <span style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: "1.75rem", color: "#2563EB" }}>
                      92
                    </span>
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", color: "#94A3B8" }}>/100</span>
                  </div>
                </div>
              </div>

              {/* Area Chart */}
              <div className="h-56">
                <ResponsiveContainer width="100%" height={224}>
                  <AreaChart data={progressData} margin={{ top: 5, right: 4, left: -24, bottom: 0 }}>
                    <defs>
                      <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2563EB" stopOpacity={0.2} />
                        <stop offset="100%" stopColor="#2563EB" stopOpacity={0.01} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                    <XAxis
                      dataKey="session"
                      tick={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fill: "#94A3B8" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      domain={[0, 100]}
                      tick={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fill: "#94A3B8" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#E2E8F0", strokeWidth: 1 }} />
                    <Area
                      type="monotone"
                      dataKey="score"
                      stroke="#2563EB"
                      strokeWidth={2.5}
                      fill="url(#scoreGradient)"
                      dot={false}
                      activeDot={{ r: 5, fill: "#2563EB", strokeWidth: 2, stroke: "#fff" }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Session tags */}
              <div className="flex flex-wrap gap-2">
                {["Communication", "Confidence", "Structure", "Technical"].map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded-full text-[#475569] text-xs"
                    style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Right: Performance Metrics */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              <h3
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 700,
                  fontSize: "1rem",
                  color: "#1E293B",
                }}
              >
                Performance Insights
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {metrics.map((metric) => {
                  const Icon = metric.icon;
                  return (
                    <div
                      key={metric.label}
                      className="flex items-center gap-4 p-3 rounded-xl border border-[#F1F5F9] hover:border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors"
                    >
                      {/* Icon */}
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: metric.bg }}
                      >
                        <Icon size={15} strokeWidth={2} style={{ color: metric.color }} />
                      </div>

                      {/* Label + Bar */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1.5">
                          <span
                            style={{
                              fontFamily: "'Inter', sans-serif",
                              fontSize: "0.775rem",
                              fontWeight: 500,
                              color: "#1E293B",
                            }}
                          >
                            {metric.label}
                          </span>
                          <span
                            style={{
                              fontFamily: "'Montserrat', sans-serif",
                              fontWeight: 700,
                              fontSize: "0.775rem",
                              color: metric.color,
                            }}
                          >
                            {metric.score}
                          </span>
                        </div>
                        <div className="h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{ width: `${metric.score}%`, backgroundColor: metric.color }}
                          />
                        </div>
                      </div>

                      {/* Mini ring */}
                      <ScoreRing score={metric.score} color={metric.color} />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}