import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  TrendingUp,
  Brain,
  MessageSquare,
  Target,
  Award,
  Calendar,
  ArrowUp,
  ArrowDown,
  Minus,
  Lightbulb,
  Zap,
  Clock,
  BarChart3,
  PieChart as PieChartIcon,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { getInterviewHistory, getHistoryStats } from "../../utils/interviewStorage";

// Color palette
const COLORS = {
  primary: "#2563EB",
  success: "#10B981",
  warning: "#F59E0B",
  danger: "#EF4444",
  purple: "#7C3AED",
  cyan: "#0891B2",
  pink: "#EC4899",
};

export default function Analytics() {
  const navigate = useNavigate();
  const [history, setHistory] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({});
  const [insights, setInsights] = useState<any[]>([]);
  const [skillBreakdown, setSkillBreakdown] = useState<any[]>([]);
  const [rolePerformance, setRolePerformance] = useState<any[]>([]);
  const [timeSeriesData, setTimeSeriesData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasValidData, setHasValidData] = useState(false);

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  // Deep validation function to ensure chart data is safe
  const validateChartData = (data: any[], requiredKeys: string[]): boolean => {
    if (!Array.isArray(data) || data.length === 0) return false;
    return data.every(item => {
      return requiredKeys.every(key => {
        const value = item[key];
        return typeof value === 'number' && Number.isFinite(value) && !isNaN(value);
      });
    });
  };

  const loadAnalyticsData = () => {
    setIsLoading(true);
    try {
      const interviewHistory = getInterviewHistory();
      const historyStats = getHistoryStats();

      setHistory(interviewHistory);
      setStats(historyStats);

      if (interviewHistory.length > 0) {
        // Generate time series data with validation
        const timeData = interviewHistory
          .slice(0, 10)
          .reverse()
          .map((session: any, index: number) => {
            const score = Number.isFinite(session.score) ? session.score : 0;
            const technicalValue = session.fullData?.evaluations?.[0]?.score_breakdown?.technical_accuracy;
            const clarityValue = session.fullData?.evaluations?.[0]?.score_breakdown?.clarity_score;
            const technical = Number.isFinite(technicalValue) ? technicalValue * 10 : 0;
            const communication = Number.isFinite(clarityValue) ? clarityValue * 10 : 0;
            return {
              date: session.dateShort || `Day ${index + 1}`,
              score: Math.max(0, Math.min(100, score)),
              technical: Math.max(0, Math.min(100, technical)),
              communication: Math.max(0, Math.min(100, communication)),
            };
          });
        
        // Validate before setting
        if (validateChartData(timeData, ['score', 'technical', 'communication'])) {
          setTimeSeriesData(timeData);
        } else {
          console.warn('Invalid time series data, using fallback');
          setTimeSeriesData([{ date: 'No Data', score: 0, technical: 0, communication: 0 }]);
        }

        // Calculate skill breakdown
        const allEvaluations = interviewHistory
          .filter((s: any) => s.fullData?.evaluations)
          .flatMap((s: any) => s.fullData.evaluations);

        if (allEvaluations.length > 0) {
          const avgTechnical =
            allEvaluations.reduce((sum: number, e: any) => {
              const val = e.score_breakdown?.technical_accuracy;
              return sum + (Number.isFinite(val) ? val : 0);
            }, 0) / allEvaluations.length;
          const avgClarity =
            allEvaluations.reduce((sum: number, e: any) => {
              const val = e.score_breakdown?.clarity_score;
              return sum + (Number.isFinite(val) ? val : 0);
            }, 0) / allEvaluations.length;
          const avgDepth =
            allEvaluations.reduce((sum: number, e: any) => {
              const val = e.score_breakdown?.depth_score;
              return sum + (Number.isFinite(val) ? val : 0);
            }, 0) / allEvaluations.length;
          const avgKeyword =
            allEvaluations.reduce((sum: number, e: any) => {
              const val = e.score_breakdown?.keyword_score;
              return sum + (Number.isFinite(val) ? val : 0);
            }, 0) / allEvaluations.length;

          const skillData = [
            { skill: "Technical", score: Number.isFinite(avgTechnical) ? Math.round(Math.max(0, Math.min(100, avgTechnical * 10))) : 0, fullMark: 100 },
            { skill: "Clarity", score: Number.isFinite(avgClarity) ? Math.round(Math.max(0, Math.min(100, avgClarity * 10))) : 0, fullMark: 100 },
            { skill: "Depth", score: Number.isFinite(avgDepth) ? Math.round(Math.max(0, Math.min(100, avgDepth * 10))) : 0, fullMark: 100 },
            { skill: "Keywords", score: Number.isFinite(avgKeyword) ? Math.round(Math.max(0, Math.min(100, avgKeyword * 100))) : 0, fullMark: 100 },
          ];
          
          // Validate before setting
          if (validateChartData(skillData, ['score', 'fullMark'])) {
            setSkillBreakdown(skillData);
          } else {
            console.warn('Invalid skill breakdown data, using fallback');
            setSkillBreakdown([
              { skill: "Technical", score: 0, fullMark: 100 },
              { skill: "Clarity", score: 0, fullMark: 100 },
              { skill: "Depth", score: 0, fullMark: 100 },
              { skill: "Keywords", score: 0, fullMark: 100 },
            ]);
          }
        }

        // Calculate role performance
        const roleStats: { [key: string]: { total: number; count: number } } = {};
        interviewHistory.forEach((session: any) => {
          const score = Number.isFinite(session.score) ? Math.max(0, Math.min(100, session.score)) : 0;
          const role = session.role || 'Unknown';
          if (!roleStats[role]) {
            roleStats[role] = { total: 0, count: 0 };
          }
          roleStats[role].total += score;
          roleStats[role].count += 1;
        });

        const roleData = Object.entries(roleStats).map(([role, data]) => {
          const avgScore = data.count > 0 ? data.total / data.count : 0;
          return {
            role: role.length > 15 ? role.substring(0, 15) + "..." : role,
            score: Number.isFinite(avgScore) ? Math.round(Math.max(0, Math.min(100, avgScore))) : 0,
          };
        });
        
        // Validate before setting
        if (validateChartData(roleData, ['score'])) {
          setRolePerformance(roleData);
        } else {
          console.warn('Invalid role performance data, using fallback');
          setRolePerformance([{ role: 'No Data', score: 0 }]);
        }

        // Generate AI insights
        generateInsights(interviewHistory, historyStats, allEvaluations);
        
        setHasValidData(true);
      } else {
        setHasValidData(false);
      }
    } catch (error) {
      console.error('Error loading analytics data:', error);
      setHistory([]);
      setStats({ totalSessions: 0, averageScore: 0, bestScore: 0, recentTrend: 0 });
      setHasValidData(false);
    } finally {
      setIsLoading(false);
    }
  };

  const generateInsights = (history: any[], stats: any, evaluations: any[]) => {
    const generatedInsights = [];

    // Trend insight
    const recentTrend = Number.isFinite(stats.recentTrend) ? stats.recentTrend : 0;
    if (recentTrend > 5) {
      generatedInsights.push({
        icon: TrendingUp,
        color: COLORS.success,
        bg: "#F0FDF4",
        title: "Strong Upward Trend",
        description: `Your performance improved by ${Math.round(recentTrend)}% in recent interviews. Keep up the momentum!`,
      });
    } else if (recentTrend < -5) {
      generatedInsights.push({
        icon: ArrowDown,
        color: COLORS.danger,
        bg: "#FEF2F2",
        title: "Performance Dip Detected",
        description: `Your recent scores dropped by ${Math.abs(Math.round(recentTrend))}%. Consider reviewing weak areas and practicing more.`,
      });
    } else {
      generatedInsights.push({
        icon: Minus,
        color: COLORS.warning,
        bg: "#FFFBEB",
        title: "Consistent Performance",
        description: "Your performance is stable. Focus on specific skills to break through to the next level.",
      });
    }

    // Skill-specific insights
    if (evaluations.length > 0) {
      const avgTechnical =
        evaluations.reduce((sum: number, e: any) => sum + (e.score_breakdown?.technical_accuracy || 0), 0) /
        evaluations.length;
      const avgClarity =
        evaluations.reduce((sum: number, e: any) => sum + (e.score_breakdown?.clarity_score || 0), 0) /
        evaluations.length;

      if (avgTechnical < 6) {
        generatedInsights.push({
          icon: Brain,
          color: COLORS.purple,
          bg: "#F5F3FF",
          title: "Technical Skills Need Work",
          description: "Focus on technical accuracy. Review core concepts and practice with more technical questions.",
        });
      }

      if (avgClarity < 6) {
        generatedInsights.push({
          icon: MessageSquare,
          color: COLORS.cyan,
          bg: "#ECFEFF",
          title: "Communication Improvement Needed",
          description: "Work on structuring your answers clearly. Use the STAR method for behavioral questions.",
        });
      }
    }

    // Practice recommendation
    if (history.length < 5) {
      generatedInsights.push({
        icon: Zap,
        color: COLORS.warning,
        bg: "#FFFBEB",
        title: "More Practice Recommended",
        description: `You've completed ${history.length} interview${history.length === 1 ? "" : "s"}. Aim for at least 10-15 sessions for optimal preparation.`,
      });
    } else {
      generatedInsights.push({
        icon: Award,
        color: COLORS.success,
        bg: "#F0FDF4",
        title: "Great Practice Consistency",
        description: `You've completed ${history.length} interviews! You're building strong interview skills through practice.`,
      });
    }

    setInsights(generatedInsights);
  };

  const getTrendIcon = (trend: number) => {
    if (!Number.isFinite(trend)) return <Minus size={16} className="text-gray-500" />;
    if (trend > 0) return <ArrowUp size={16} className="text-green-500" />;
    if (trend < 0) return <ArrowDown size={16} className="text-red-500" />;
    return <Minus size={16} className="text-gray-500" />;
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#F9FAFB]">
      {/* Header */}
      <header className="bg-white border-b border-[#E2E8F0] px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] flex items-center justify-center">
              <BarChart3 size={18} className="text-[#2563EB]" strokeWidth={2} />
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
              Performance Analytics
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
            Track your progress and identify areas for improvement
          </p>
        </div>
      </header>

      <div className="px-6 lg:px-8 py-8 max-w-7xl mx-auto">
        {isLoading ? (
          /* Loading State */
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-12 text-center">
            <div className="w-20 h-20 rounded-2xl bg-[#EFF6FF] flex items-center justify-center mx-auto mb-6 animate-pulse">
              <BarChart3 size={32} className="text-[#2563EB]" strokeWidth={2} />
            </div>
            <h2
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 700,
                fontSize: "1.25rem",
                color: "#1E293B",
                marginBottom: "12px",
              }}
            >
              Loading Analytics...
            </h2>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.9rem",
                color: "#64748B",
              }}
            >
              Analyzing your interview performance data
            </p>
          </div>
        ) : history.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-12 text-center">
            <div className="w-20 h-20 rounded-2xl bg-[#EFF6FF] flex items-center justify-center mx-auto mb-6">
              <BarChart3 size={32} className="text-[#2563EB]" strokeWidth={2} />
            </div>
            <h2
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 700,
                fontSize: "1.25rem",
                color: "#1E293B",
                marginBottom: "12px",
              }}
            >
              No Analytics Data Yet
            </h2>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.9rem",
                color: "#64748B",
                marginBottom: "24px",
              }}
            >
              Complete some interviews to see your performance analytics and insights
            </p>
            <button
              onClick={() => navigate("/dashboard/practice")}
              className="px-6 py-3 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white transition-colors"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                fontSize: "0.875rem",
                boxShadow: "0 4px 12px rgba(37,99,235,0.25)",
              }}
            >
              Start Your First Interview
            </button>
          </div>
        ) : (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div
                className="bg-white rounded-2xl border border-[#E2E8F0] p-5"
                style={{ boxShadow: "0 1px 12px rgba(0,0,0,0.05)" }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] flex items-center justify-center">
                    <Award size={18} className="text-[#2563EB]" strokeWidth={2} />
                  </div>
                  {getTrendIcon(stats.recentTrend)}
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
                  {Number.isFinite(stats.averageScore) ? Math.round(stats.averageScore) : 0}%
                </p>
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.75rem",
                    color: "#94A3B8",
                    marginTop: "4px",
                  }}
                >
                  Average Score
                </p>
              </div>

              <div
                className="bg-white rounded-2xl border border-[#E2E8F0] p-5"
                style={{ boxShadow: "0 1px 12px rgba(0,0,0,0.05)" }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[#F0FDF4] flex items-center justify-center">
                    <TrendingUp size={18} className="text-[#10B981]" strokeWidth={2} />
                  </div>
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
                  {Number.isFinite(stats.bestScore) ? Math.round(stats.bestScore) : 0}%
                </p>
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.75rem",
                    color: "#94A3B8",
                    marginTop: "4px",
                  }}
                >
                  Best Performance
                </p>
              </div>

              <div
                className="bg-white rounded-2xl border border-[#E2E8F0] p-5"
                style={{ boxShadow: "0 1px 12px rgba(0,0,0,0.05)" }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[#F5F3FF] flex items-center justify-center">
                    <Calendar size={18} className="text-[#7C3AED]" strokeWidth={2} />
                  </div>
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
                  {Number.isFinite(stats.totalSessions) ? stats.totalSessions : 0}
                </p>
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.75rem",
                    color: "#94A3B8",
                    marginTop: "4px",
                  }}
                >
                  Total Interviews
                </p>
              </div>

              <div
                className="bg-white rounded-2xl border border-[#E2E8F0] p-5"
                style={{ boxShadow: "0 1px 12px rgba(0,0,0,0.05)" }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[#ECFEFF] flex items-center justify-center">
                    <Zap size={18} className="text-[#0891B2]" strokeWidth={2} />
                  </div>
                  {Number.isFinite(stats.recentTrend) && stats.recentTrend !== 0 && (
                    <span
                      className="text-xs font-bold"
                      style={{
                        color: stats.recentTrend > 0 ? COLORS.success : COLORS.danger,
                      }}
                    >
                      {stats.recentTrend > 0 ? "+" : ""}
                      {Math.round(stats.recentTrend)}%
                    </span>
                  )}
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
                  {Number.isFinite(stats.recentTrend) && stats.recentTrend > 0 ? "↑" : Number.isFinite(stats.recentTrend) && stats.recentTrend < 0 ? "↓" : "→"}
                </p>
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.75rem",
                    color: "#94A3B8",
                    marginTop: "4px",
                  }}
                >
                  Recent Trend
                </p>
              </div>
            </div>

            {/* AI Insights */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Lightbulb size={20} className="text-[#F59E0B]" strokeWidth={2} />
                <h2
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontWeight: 700,
                    fontSize: "1.1rem",
                    color: "#1E293B",
                  }}
                >
                  AI-Powered Insights
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {insights.map((insight, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl border border-[#E2E8F0] p-5"
                    style={{ boxShadow: "0 1px 12px rgba(0,0,0,0.05)" }}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: insight.bg }}
                      >
                        <insight.icon size={20} style={{ color: insight.color }} strokeWidth={2} />
                      </div>
                      <div className="flex-1">
                        <h3
                          style={{
                            fontFamily: "'Montserrat', sans-serif",
                            fontWeight: 700,
                            fontSize: "0.9rem",
                            color: "#1E293B",
                            marginBottom: "6px",
                          }}
                        >
                          {insight.title}
                        </h3>
                        <p
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontSize: "0.8rem",
                            color: "#64748B",
                            lineHeight: 1.5,
                          }}
                        >
                          {insight.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Performance Trend */}
              {hasValidData && timeSeriesData.length > 0 && validateChartData(timeSeriesData, ['score']) && (
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
                          fontSize: "1rem",
                          color: "#1E293B",
                        }}
                      >
                        Performance Trend
                      </h2>
                      <p
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: "0.75rem",
                          color: "#64748B",
                        }}
                      >
                        Your score progression over time
                      </p>
                    </div>
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={timeSeriesData}>
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
                          stroke={COLORS.primary}
                          strokeWidth={3}
                          dot={{ fill: COLORS.primary, r: 5 }}
                          activeDot={{ r: 7 }}
                          name="Overall Score"
                        />
                        <Line
                          type="monotone"
                          dataKey="technical"
                          stroke={COLORS.purple}
                          strokeWidth={2}
                          dot={{ fill: COLORS.purple, r: 4 }}
                          name="Technical"
                        />
                        <Line
                          type="monotone"
                          dataKey="communication"
                          stroke={COLORS.cyan}
                          strokeWidth={2}
                          dot={{ fill: COLORS.cyan, r: 4 }}
                          name="Communication"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Skills Radar */}
              {hasValidData && skillBreakdown.length > 0 && validateChartData(skillBreakdown, ['score']) && (
                <div
                  className="bg-white rounded-2xl border border-[#E2E8F0] p-6"
                  style={{ boxShadow: "0 1px 12px rgba(0,0,0,0.05)" }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-[#F5F3FF] flex items-center justify-center">
                      <Target size={18} className="text-[#7C3AED]" strokeWidth={2} />
                    </div>
                    <div>
                      <h2
                        style={{
                          fontFamily: "'Montserrat', sans-serif",
                          fontWeight: 700,
                          fontSize: "1rem",
                          color: "#1E293B",
                        }}
                      >
                        Skills Breakdown
                      </h2>
                      <p
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: "0.75rem",
                          color: "#64748B",
                        }}
                      >
                        Your performance across key areas
                      </p>
                    </div>
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={skillBreakdown}>
                        <PolarGrid stroke="#E2E8F0" />
                        <PolarAngleAxis
                          dataKey="skill"
                          style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.875rem", fill: "#64748B" }}
                        />
                        <PolarRadiusAxis
                          angle={90}
                          domain={[0, 100]}
                          style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", fill: "#94A3B8" }}
                        />
                        <Radar
                          name="Score"
                          dataKey="score"
                          stroke={COLORS.primary}
                          fill={COLORS.primary}
                          fillOpacity={0.3}
                          strokeWidth={2}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>

            {/* Role Performance */}
            {hasValidData && rolePerformance.length > 0 && validateChartData(rolePerformance, ['score']) && (
              <div
                className="bg-white rounded-2xl border border-[#E2E8F0] p-6"
                style={{ boxShadow: "0 1px 12px rgba(0,0,0,0.05)" }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-[#ECFEFF] flex items-center justify-center">
                    <BarChart3 size={18} className="text-[#0891B2]" strokeWidth={2} />
                  </div>
                  <div>
                    <h2
                      style={{
                        fontFamily: "'Montserrat', sans-serif",
                        fontWeight: 700,
                        fontSize: "1rem",
                        color: "#1E293B",
                      }}
                    >
                      Performance by Role
                    </h2>
                    <p
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "0.75rem",
                        color: "#64748B",
                      }}
                    >
                      Compare your performance across different job roles
                    </p>
                  </div>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={rolePerformance} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                      <XAxis
                        type="number"
                        domain={[0, 100]}
                        stroke="#94A3B8"
                        style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.75rem" }}
                        tickLine={false}
                      />
                      <YAxis
                        type="category"
                        dataKey="role"
                        stroke="#94A3B8"
                        style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.875rem" }}
                        tickLine={false}
                        width={150}
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
                        cursor={{ fill: "rgba(37, 99, 235, 0.1)" }}
                      />
                      <Bar dataKey="score" fill={COLORS.primary} radius={[0, 8, 8, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
