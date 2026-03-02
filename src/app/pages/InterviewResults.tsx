import { useState } from "react";
import { useNavigate } from "react-router";
import {
  ChevronLeft,
  Share2,
  RotateCcw,
  Trophy,
  MessageSquare,
  Brain,
  Target,
  Video,
  ChevronDown,
  Lightbulb,
  CheckCircle2,
  Download,
  Calendar,
  Clock,
  Check,
  AlertTriangle,
  Home,
  Sparkles,
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

// Mock data for the interview results
const mockResultData = {
  overallScore: 88,
  date: "March 2, 2026",
  duration: "24 min 32 sec",
  role: "Software Engineer",
  level: "Mid Level",
  summary: "You delivered a strong interview performance with excellent technical knowledge and clear communication. Your responses demonstrated solid problem-solving skills and relevant experience. Focus on providing more specific examples and maintaining better eye contact to enhance your presentation. Overall, you're well-prepared for mid-level software engineering roles.",
  strengths: [
    "Strong technical knowledge with specific examples and metrics",
    "Clear and structured responses using logical flow",
    "Good use of industry terminology and best practices",
  ],
  weaknesses: [
    "Could provide more context about team collaboration and leadership",
    "Body language and eye contact need improvement",
    "Responses could be more concise and focused on key points",
  ],
  metrics: [
    {
      label: "Technical Accuracy",
      score: 92,
      icon: Brain,
      color: "#10B981",
      feedback: "Excellent technical knowledge demonstrated",
    },
    {
      label: "Communication Clarity",
      score: 85,
      icon: MessageSquare,
      color: "#3B82F6",
      feedback: "Clear and well-structured responses",
    },
    {
      label: "Keyword Coverage",
      score: 88,
      icon: Target,
      color: "#8B5CF6",
      feedback: "Good use of industry terminology",
    },
    {
      label: "Body Language",
      score: 82,
      icon: Video,
      color: "#F59E0B",
      feedback: "Maintain more eye contact",
    },
  ],
  questions: [
    {
      id: 1,
      question: "Tell me about yourself and your background.",
      yourAnswer:
        "I'm a software engineer with 4 years of experience, primarily working with React and Node.js. I've led several projects involving microservices architecture and have a strong passion for creating scalable web applications. In my current role at TechCorp, I've worked on improving our application's performance by 40% through code optimization and better caching strategies.",
      idealAnswer:
        "A strong answer should include: (1) A brief professional summary highlighting your current role and years of experience, (2) Key technical skills and areas of expertise, (3) Notable achievements or projects that demonstrate your capabilities, (4) What motivates you professionally and how it aligns with the role you're applying for.",
      score: 90,
      improvements: [
        "Consider adding more specific quantifiable achievements",
        "Connect your experience more directly to the target role",
        "Include what you're currently learning or improving",
      ],
    },
    {
      id: 2,
      question: "What are your greatest strengths and how have you applied them in your previous role?",
      yourAnswer:
        "My greatest strength is problem-solving. I approach challenges systematically by breaking them down into smaller components. For example, when our API response times were slow, I analyzed the bottlenecks, implemented caching, and optimized database queries, which reduced response time by 60%.",
      idealAnswer:
        "An effective response should: (1) Identify 2-3 key strengths relevant to the role, (2) Provide specific examples using the STAR method, (3) Show measurable impact of these strengths, (4) Demonstrate self-awareness and continuous improvement.",
      score: 88,
      improvements: [
        "Mention 2-3 strengths instead of just one",
        "Use the STAR method more explicitly (Situation, Task, Action, Result)",
        "Explain how these strengths differentiate you from others",
      ],
    },
    {
      id: 3,
      question: "Describe a challenging project you worked on and how you overcame obstacles.",
      yourAnswer:
        "I worked on migrating our monolithic application to microservices. The main challenge was maintaining zero downtime. We used a strangler fig pattern, gradually replacing components while keeping the old system running. This took 6 months but resulted in better scalability and easier maintenance.",
      idealAnswer:
        "A comprehensive answer includes: (1) Context about the project and why it was challenging, (2) Specific obstacles you faced, (3) Your approach and decision-making process, (4) How you collaborated with others, (5) Tangible outcomes and lessons learned.",
      score: 85,
      improvements: [
        "Discuss the team dynamics and your leadership role",
        "Elaborate on specific technical challenges you personally solved",
        "Mention what you learned and how it changed your approach",
      ],
    },
  ],
};

function MetricCard({
  label,
  score,
  icon: Icon,
  color,
  feedback,
}: {
  label: string;
  score: number;
  icon: any;
  color: string;
  feedback: string;
}) {
  const getScoreColor = (s: number) => {
    if (s >= 85) return "#10B981";
    if (s >= 70) return "#F59E0B";
    return "#EF4444";
  };

  return (
    <div
      className="bg-white rounded-2xl border border-[#E2E8F0] p-5 flex flex-col gap-4 hover:shadow-lg transition-shadow"
      style={{ boxShadow: "0 1px 12px rgba(0,0,0,0.05)" }}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: color + "15" }}
          >
            <Icon size={18} strokeWidth={2} style={{ color }} />
          </div>
          <div>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                fontSize: "0.875rem",
                color: "#475569",
                marginBottom: "2px",
              }}
            >
              {label}
            </p>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.75rem",
                color: "#94A3B8",
              }}
            >
              {feedback}
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-end justify-between">
        <div className="flex-1">
          <div className="w-full h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${score}%`,
                backgroundColor: getScoreColor(score),
              }}
            />
          </div>
        </div>
        <span
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 800,
            fontSize: "1.5rem",
            color: getScoreColor(score),
            marginLeft: "12px",
          }}
        >
          {score}
        </span>
      </div>
    </div>
  );
}

function QuestionAccordion({
  question,
  index,
}: {
  question: (typeof mockResultData.questions)[0];
  index: number;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const getScoreColor = (s: number) => {
    if (s >= 85) return "#10B981";
    if (s >= 70) return "#F59E0B";
    return "#EF4444";
  };

  const getScoreBg = (s: number) => {
    if (s >= 85) return "#F0FDF4";
    if (s >= 70) return "#FFFBEB";
    return "#FEF2F2";
  };

  return (
    <div
      className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden transition-all"
      style={{ boxShadow: "0 1px 12px rgba(0,0,0,0.05)" }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 hover:bg-[#F8FAFC] transition-colors text-left"
      >
        <div className="flex items-start gap-4 flex-1">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: "#EFF6FF" }}
          >
            <span
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 700,
                fontSize: "0.875rem",
                color: "#2563EB",
              }}
            >
              {index + 1}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                fontSize: "0.9rem",
                color: "#1E293B",
                lineHeight: 1.5,
              }}
            >
              {question.question}
            </p>
          </div>
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full flex-shrink-0"
            style={{
              backgroundColor: getScoreBg(question.score),
            }}
          >
            <CheckCircle2 size={12} strokeWidth={2.5} style={{ color: getScoreColor(question.score) }} />
            <span
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 700,
                fontSize: "0.8rem",
                color: getScoreColor(question.score),
              }}
            >
              {question.score}%
            </span>
          </div>
        </div>
        <ChevronDown
          size={18}
          strokeWidth={2}
          className={`text-[#94A3B8] ml-3 flex-shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="px-5 pb-5 pt-0 flex flex-col gap-5 border-t border-[#F1F5F9]">
          {/* Your Answer */}
          <div className="mt-5">
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare size={14} className="text-[#2563EB]" strokeWidth={2} />
              <h4
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 700,
                  fontSize: "0.875rem",
                  color: "#1E293B",
                }}
              >
                Your Answer
              </h4>
            </div>
            <div
              className="p-4 rounded-xl border border-[#E2E8F0]"
              style={{ backgroundColor: "#F8FAFC" }}
            >
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.875rem",
                  color: "#475569",
                  lineHeight: 1.7,
                }}
              >
                {question.yourAnswer}
              </p>
            </div>
          </div>

          {/* Ideal Answer */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Target size={14} className="text-[#10B981]" strokeWidth={2} />
              <h4
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 700,
                  fontSize: "0.875rem",
                  color: "#1E293B",
                }}
              >
                Ideal Answer Framework
              </h4>
            </div>
            <div
              className="p-4 rounded-xl border border-[#D1FAE5]"
              style={{ backgroundColor: "#F0FDF4" }}
            >
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.875rem",
                  color: "#047857",
                  lineHeight: 1.7,
                }}
              >
                {question.idealAnswer}
              </p>
            </div>
          </div>

          {/* Improvement Suggestions */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb size={14} className="text-[#F59E0B]" strokeWidth={2} />
              <h4
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 700,
                  fontSize: "0.875rem",
                  color: "#1E293B",
                }}
              >
                Improvement Suggestions
              </h4>
            </div>
            <ul className="flex flex-col gap-2">
              {question.improvements.map((improvement, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 p-3 rounded-lg"
                  style={{ backgroundColor: "#FFFBEB" }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
                    style={{ backgroundColor: "#F59E0B" }}
                  />
                  <p
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "0.875rem",
                      color: "#92400E",
                      lineHeight: 1.6,
                    }}
                  >
                    {improvement}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

function CircularProgress({ score }: { score: number }) {
  const data = [
    { name: "Score", value: score },
    { name: "Remaining", value: 100 - score },
  ];

  const getColor = (s: number) => {
    if (s >= 85) return "#10B981";
    if (s >= 70) return "#F59E0B";
    return "#EF4444";
  };

  const getLabel = (s: number) => {
    if (s >= 85) return "Excellent";
    if (s >= 70) return "Good";
    return "Needs Work";
  };

  const color = getColor(score);

  return (
    <div className="relative w-48 h-48">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            startAngle={90}
            endAngle={-270}
            innerRadius={65}
            outerRadius={85}
            dataKey="value"
            stroke="none"
          >
            <Cell fill={color} />
            <Cell fill="#F1F5F9" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 800,
            fontSize: "2.5rem",
            color: color,
            lineHeight: 1,
          }}
        >
          {score}
        </span>
        <span
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 600,
            fontSize: "0.875rem",
            color: "#64748B",
            marginTop: "4px",
          }}
        >
          {getLabel(score)}
        </span>
      </div>
    </div>
  );
}

export default function InterviewResults() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Top Bar */}
      <header className="bg-white border-b border-[#E2E8F0] sticky top-0 z-30 px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-[#64748B] hover:text-[#2563EB] transition-colors"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 500,
              fontSize: "0.875rem",
            }}
          >
            <ChevronLeft size={16} strokeWidth={2} />
            Back to Dashboard
          </button>

          <div className="flex items-center gap-2">
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] transition-colors"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 500,
                fontSize: "0.875rem",
                color: "#475569",
              }}
            >
              <Download size={14} strokeWidth={2} />
              Export PDF
            </button>
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white transition-colors"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                fontSize: "0.875rem",
                boxShadow: "0 4px 12px rgba(37,99,235,0.25)",
              }}
            >
              <Share2 size={14} strokeWidth={2} />
              Share Results
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="px-6 lg:px-8 py-8 max-w-7xl mx-auto">
        {/* Hero Section */}
        <div
          className="bg-gradient-to-br from-white to-[#F8FAFC] rounded-3xl border border-[#E2E8F0] p-8 lg:p-10 mb-8"
          style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}
        >
          <div className="flex flex-col lg:flex-row items-center gap-8">
            {/* Score Ring */}
            <div className="flex-shrink-0">
              <CircularProgress score={mockResultData.overallScore} />
            </div>

            {/* Info and Actions */}
            <div className="flex-1 text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-2 mb-3">
                <Trophy size={20} className="text-[#F59E0B]" strokeWidth={2} />
                <h1
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontWeight: 800,
                    fontSize: "clamp(1.5rem, 4vw, 2rem)",
                    color: "#1E293B",
                    letterSpacing: "-0.02em",
                  }}
                >
                  Interview Complete!
                </h1>
              </div>
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "1rem",
                  color: "#64748B",
                  marginBottom: "8px",
                }}
              >
                {mockResultData.role} • {mockResultData.level}
              </p>
              <div className="flex items-center justify-center lg:justify-start gap-4 text-sm text-[#94A3B8] mb-6">
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} strokeWidth={2} />
                  {mockResultData.date}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Clock size={14} strokeWidth={2} />
                  {mockResultData.duration}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                <button
                  onClick={() => navigate("/dashboard")}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white transition-colors"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    boxShadow: "0 4px 16px rgba(37,99,235,0.3)",
                  }}
                >
                  <RotateCcw size={14} strokeWidth={2} />
                  Retake Interview
                </button>
                <button
                  onClick={() => navigate("/dashboard/history")}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] text-[#475569] transition-colors"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 500,
                    fontSize: "0.875rem",
                  }}
                >
                  View History
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="mb-8">
          <h2
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 700,
              fontSize: "1.25rem",
              color: "#1E293B",
              marginBottom: "20px",
            }}
          >
            Performance Breakdown
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {mockResultData.metrics.map((metric) => (
              <MetricCard key={metric.label} {...metric} />
            ))}
          </div>
        </div>

        {/* AI Summary Section */}
        <div className="mb-8">
          <div
            className="bg-gradient-to-br from-[#EFF6FF] to-white rounded-2xl border border-[#DBEAFE] p-6 lg:p-8"
            style={{ boxShadow: "0 2px 16px rgba(37,99,235,0.08)" }}
          >
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] flex items-center justify-center flex-shrink-0">
                <Sparkles size={18} className="text-white" strokeWidth={2} />
              </div>
              <div>
                <h2
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontWeight: 800,
                    fontSize: "1.25rem",
                    color: "#1E293B",
                    marginBottom: "4px",
                  }}
                >
                  AI Interview Summary
                </h2>
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.8rem",
                    color: "#64748B",
                  }}
                >
                  Generated analysis based on your responses
                </p>
              </div>
            </div>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.95rem",
                color: "#475569",
                lineHeight: 1.8,
              }}
            >
              {mockResultData.summary}
            </p>
          </div>
        </div>

        {/* Strengths & Weaknesses */}
        <div className="mb-8">
          <h2
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 700,
              fontSize: "1.25rem",
              color: "#1E293B",
              marginBottom: "20px",
            }}
          >
            Key Insights
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Strengths */}
            <div
              className="bg-white rounded-2xl border border-[#E2E8F0] p-6"
              style={{ boxShadow: "0 1px 12px rgba(0,0,0,0.05)" }}
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-[#F0FDF4] flex items-center justify-center">
                  <Check size={18} className="text-[#10B981]" strokeWidth={2.5} />
                </div>
                <h3
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontWeight: 700,
                    fontSize: "1.1rem",
                    color: "#1E293B",
                  }}
                >
                  Strengths
                </h3>
              </div>
              <ul className="flex flex-col gap-3">
                {mockResultData.strengths.map((strength, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 p-3 rounded-xl border border-[#D1FAE5]"
                    style={{ backgroundColor: "#F0FDF4" }}
                  >
                    <CheckCircle2 size={18} className="text-[#10B981] flex-shrink-0 mt-0.5" strokeWidth={2} />
                    <p
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "0.875rem",
                        color: "#047857",
                        lineHeight: 1.6,
                      }}
                    >
                      {strength}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Areas for Improvement */}
            <div
              className="bg-white rounded-2xl border border-[#E2E8F0] p-6"
              style={{ boxShadow: "0 1px 12px rgba(0,0,0,0.05)" }}
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-[#FFFBEB] flex items-center justify-center">
                  <AlertTriangle size={18} className="text-[#F59E0B]" strokeWidth={2.5} />
                </div>
                <h3
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontWeight: 700,
                    fontSize: "1.1rem",
                    color: "#1E293B",
                  }}
                >
                  Areas for Improvement
                </h3>
              </div>
              <ul className="flex flex-col gap-3">
                {mockResultData.weaknesses.map((weakness, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 p-3 rounded-xl border border-[#FED7AA]"
                    style={{ backgroundColor: "#FFFBEB" }}
                  >
                    <AlertTriangle size={18} className="text-[#F59E0B] flex-shrink-0 mt-0.5" strokeWidth={2} />
                    <p
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "0.875rem",
                        color: "#92400E",
                        lineHeight: 1.6,
                      }}
                    >
                      {weakness}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Detailed Question Review */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 700,
                fontSize: "1.25rem",
                color: "#1E293B",
              }}
            >
              Detailed Question Review
            </h2>
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.875rem",
                color: "#94A3B8",
              }}
            >
              {mockResultData.questions.length} questions answered
            </span>
          </div>
          <div className="flex flex-col gap-4">
            {mockResultData.questions.map((question, index) => (
              <QuestionAccordion key={question.id} question={question} index={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}