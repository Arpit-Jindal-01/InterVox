import {
  LineChart,
  Line,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, Mic2, BarChart3, ArrowUpRight } from "lucide-react";

const trendData = [
  { s: 1, score: 52 },
  { s: 2, score: 58 },
  { s: 3, score: 55 },
  { s: 4, score: 67 },
  { s: 5, score: 71 },
  { s: 6, score: 75 },
  { s: 7, score: 80 },
  { s: 8, score: 79 },
  { s: 9, score: 85 },
  { s: 10, score: 88 },
];

const MiniTooltip = ({ active, payload }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-[#1E293B] text-white rounded-lg px-2.5 py-1.5 shadow-xl">
        <span style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: "0.75rem", color: "#60A5FA" }}>
          {payload[0].value}
        </span>
      </div>
    );
  }
  return null;
};

const widgets = [
  {
    icon: Mic2,
    iconBg: "#EFF6FF",
    iconColor: "#2563EB",
    label: "Total Interviews",
    value: "24",
    sub: "+3 this week",
    trend: "up",
    accent: "#2563EB",
    chart: false,
  },
  {
    icon: BarChart3,
    iconBg: "#F0FDF4",
    iconColor: "#16A34A",
    label: "Average Score",
    value: "85",
    valueSuffix: "/100",
    sub: "↑ 6pts from last month",
    trend: "up",
    accent: "#16A34A",
    chart: false,
  },
  {
    icon: TrendingUp,
    iconBg: "#F5F3FF",
    iconColor: "#7C3AED",
    label: "Score Trend",
    value: "+36",
    valueSuffix: "pts",
    sub: "Over last 10 sessions",
    trend: "up",
    accent: "#7C3AED",
    chart: true,
  },
];

export function StatsWidgets() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {widgets.map((w) => {
        const Icon = w.icon;
        return (
          <div
            key={w.label}
            className="bg-white rounded-2xl border border-[#E2E8F0] p-5 flex flex-col gap-4 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
            style={{ boxShadow: "0 1px 12px rgba(0,0,0,0.05)" }}
          >
            <div className="flex items-start justify-between">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: w.iconBg }}
              >
                <Icon size={18} strokeWidth={2} style={{ color: w.iconColor }} />
              </div>
              <span
                className="flex items-center gap-1 text-xs px-2 py-1 rounded-full"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  backgroundColor: w.accent + "12",
                  color: w.accent,
                }}
              >
                <ArrowUpRight size={11} strokeWidth={2.5} />
                {w.trend === "up" ? "Up" : "Down"}
              </span>
            </div>

            {w.chart ? (
              /* Mini sparkline */
              <div className="h-12">
                <ResponsiveContainer width="100%" height={48}>
                  <LineChart data={trendData} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
                    <Tooltip content={<MiniTooltip />} cursor={false} />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke={w.accent}
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 3, fill: w.accent, strokeWidth: 0 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex items-end gap-1">
                <span
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontWeight: 800,
                    fontSize: "2rem",
                    color: "#1E293B",
                    lineHeight: 1,
                  }}
                >
                  {w.value}
                </span>
                {w.valueSuffix && (
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.875rem", color: "#94A3B8", paddingBottom: "2px" }}>
                    {w.valueSuffix}
                  </span>
                )}
              </div>
            )}

            <div>
              <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: "0.875rem", color: "#1E293B" }}>
                {w.label}
              </p>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", color: "#94A3B8", marginTop: "2px" }}>
                {w.sub}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
