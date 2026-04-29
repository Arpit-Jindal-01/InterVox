import { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router";
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
  TrendingUp,
  Zap,
  Pause,
  Save,
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { jsPDF } from "jspdf";
import SaveInterviewModal from "../components/SaveInterviewModal";
import { getInterviewHistory } from "../../utils/interviewStorage";
import { useQuestionGenerator, QuestionData } from "../../hooks/useQuestionGenerator";
import { usePlacementTwin, PlacementTwinResult } from "../../hooks/usePlacementTwin";
import { useAuth } from "../context/AuthContext";
import { saveUserInterview, deleteUserInterview } from "../services/interviewHistoryService";

const SAVE_META_KEY_PREFIX = "intervox_interview_save_meta_v1";
const PLACEMENT_TWIN_META_KEY_PREFIX = "intervox_placement_twin_meta_v1";

type SaveMetaRecord = {
  promptShown: boolean;
  savedSessionId?: string;
};

function getUserScopedKey(prefix: string, userId?: string | number): string {
  return `${prefix}_${userId ?? "guest"}`;
}

function getSaveMetaMap(userId?: string | number): Record<string, SaveMetaRecord> {
  try {
    const raw = localStorage.getItem(getUserScopedKey(SAVE_META_KEY_PREFIX, userId));
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function setSaveMetaMap(map: Record<string, SaveMetaRecord>, userId?: string | number) {
  localStorage.setItem(getUserScopedKey(SAVE_META_KEY_PREFIX, userId), JSON.stringify(map));
}

function getPlacementTwinMap(userId?: string | number): Record<string, PlacementTwinResult> {
  try {
    const raw = localStorage.getItem(getUserScopedKey(PLACEMENT_TWIN_META_KEY_PREFIX, userId));
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function setPlacementTwinMap(map: Record<string, PlacementTwinResult>, userId?: string | number) {
  localStorage.setItem(getUserScopedKey(PLACEMENT_TWIN_META_KEY_PREFIX, userId), JSON.stringify(map));
}

function buildInterviewSignature(payload: any): string {
  const raw = JSON.stringify(payload || {});
  let hash = 0;
  for (let i = 0; i < raw.length; i++) {
    hash = (hash << 5) - hash + raw.charCodeAt(i);
    hash |= 0;
  }
  return `ivx_${Math.abs(hash)}`;
}

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

// Helper functions to transform evaluation data
function generateSummary(evaluations: any[], overallScore: number, totalQuestions: number): string {
  const validEvaluations = (evaluations || []).filter(
    (e) => e && typeof e.final_score === "number"
  );

  const attempted = validEvaluations.length;
  const attemptRatio = totalQuestions > 0 ? attempted / totalQuestions : 0;

  if (attempted === 0) {
    return "No valid answers were submitted. Overall result is 0% until questions are attempted.";
  }
  
  // Collect all overall_feedback from individual evaluations
  const allFeedback = validEvaluations
    .map(e => e?.overall_feedback)
    .filter(f => f && f.length > 0);
  
  if (allFeedback.length === 0) {
    // Fallback if no feedback available
    const avgScore = overallScore;
    if (attemptRatio < 0.6) {
      return `You attempted only ${attempted} of ${totalQuestions} questions. Results are penalized for unattempted questions to keep scoring fair. Complete more questions for a reliable performance signal.`;
    } else if (avgScore >= 85) {
      return "You delivered an excellent interview performance with strong technical knowledge and clear communication. Your responses demonstrated solid problem-solving skills and relevant experience. Continue this level of preparation for future interviews.";
    } else if (avgScore >= 70) {
      return "You delivered a good interview performance with decent technical knowledge. Your responses showed understanding of key concepts. Focus on providing more specific examples and improving clarity to enhance your presentation.";
    } else {
      return "Your interview showed potential but needs improvement. Focus on strengthening your technical fundamentals and practice providing clearer, more structured responses. Review the feedback below for specific areas to work on.";
    }
  }
  
  // Synthesize a comprehensive summary from all feedback
  const avgScore = overallScore;
  let summary = "";
  
  if (attemptRatio < 0.6) {
    summary = `⚠️ Limited Completion: You attempted ${attempted} of ${totalQuestions} questions. The score is strictly penalized for unanswered questions, so complete more questions for an accurate profile. `;
  } else if (avgScore >= 85) {
    summary = `🎯 Exceptional Performance: You demonstrated strong technical expertise throughout the interview. `;
  } else if (avgScore >= 70) {
    summary = `📈 Good Performance: You showed solid understanding of key concepts with room for growth. `;
  } else if (avgScore >= 50) {
    summary = `💡 Developing Performance: Your responses showed potential but need more depth and accuracy. `;
  } else {
    summary = `📚 Needs Improvement: Focus on strengthening fundamental concepts and providing clearer responses. `;
  }
  
  // Add specific insights from evaluations
  const highScoring = validEvaluations.filter(e => e.final_score >= 80).length;
  const needsWork = validEvaluations.filter(e => e.final_score < 60).length;
  
  if (highScoring > attempted * 0.6) {
    summary += `You performed well on ${highScoring} out of ${attempted} attempted questions. `;
  } else if (needsWork > attempted * 0.4) {
    summary += `Several responses need improvement - review the detailed feedback below to identify key areas. `;
  }
  
  // Add the most relevant feedback point
  if (allFeedback.length > 0) {
    // Take feedback from the question with median score
    const sortedEvals = [...validEvaluations].sort((a, b) => b.final_score - a.final_score);
    const medianFeedback = sortedEvals[Math.floor(sortedEvals.length / 2)]?.overall_feedback;
    if (medianFeedback) {
      summary += medianFeedback;
    }
  }
  
  return summary;
}

function extractStrengths(evaluations: any[]): string[] {
  const validEvaluations = (evaluations || []).filter(Boolean);
  if (validEvaluations.length === 0) return [];
  
  const strengths: string[] = [];
  validEvaluations.forEach(e => {
    if (e?.strengths && Array.isArray(e.strengths)) {
      // Each evaluation can contribute multiple strengths
      strengths.push(...e.strengths);
    }
  });
  
  // Remove duplicates and return top 5 most common strengths
  const uniqueStrengths = Array.from(new Set(strengths));
  return uniqueStrengths.slice(0, 5);
}

function extractWeaknesses(evaluations: any[]): string[] {
  const validEvaluations = (evaluations || []).filter(Boolean);
  if (validEvaluations.length === 0) return [];
  
  const weaknesses: string[] = [];
  validEvaluations.forEach(e => {
    // Collect missing concepts
    if (e?.missing_concepts && Array.isArray(e.missing_concepts)) {
      weaknesses.push(...e.missing_concepts.map((c: string) => `Missing: ${c}`));
    }
    // Collect improvements
    if (e?.improvements && Array.isArray(e.improvements)) {
      weaknesses.push(...e.improvements);
    }
  });
  
  // Remove duplicates and return top 5
  const uniqueWeaknesses = Array.from(new Set(weaknesses));
  return uniqueWeaknesses.slice(0, 5);
}

function calculateMetrics(evaluations: any[], totalQuestions: number): any[] {
  const validEvaluations = (evaluations || []).filter(
    (e) => e && e.score_breakdown
  );

  const denominator = Math.max(totalQuestions || 0, validEvaluations.length);

  if (denominator === 0) {
    return [
      {
        label: "Technical Accuracy",
        score: 0,
        icon: Brain,
        color: "#10B981",
        feedback: "No evaluated answers yet",
      },
      {
        label: "Communication Clarity",
        score: 0,
        icon: MessageSquare,
        color: "#3B82F6",
        feedback: "No evaluated answers yet",
      },
      {
        label: "Keyword Coverage",
        score: 0,
        icon: Target,
        color: "#8B5CF6",
        feedback: "No evaluated answers yet",
      },
      {
        label: "Content Depth",
        score: 0,
        icon: Video,
        color: "#F59E0B",
        feedback: "No evaluated answers yet",
      },
    ];
  }
  
  // Calculate average scores for each metric
  // Backend returns score_breakdown with values 0-10
  const sumTechnical = validEvaluations.reduce((sum, e) => sum + ((e?.score_breakdown?.technical_accuracy || 0) * 10), 0);
  const sumClarity = validEvaluations.reduce((sum, e) => sum + ((e?.score_breakdown?.clarity_score || 0) * 10), 0);
  const sumKeyword = validEvaluations.reduce((sum, e) => sum + ((e?.score_breakdown?.keyword_score || 0) * 100), 0);
  const sumDepth = validEvaluations.reduce((sum, e) => sum + ((e?.score_breakdown?.depth_score || 0) * 10), 0);

  const avgTechnical = sumTechnical / denominator;
  const avgClarity = sumClarity / denominator;
  const avgKeyword = sumKeyword / denominator;
  const avgDepth = sumDepth / denominator;
  
  return [
    {
      label: "Technical Accuracy",
      score: Math.round(avgTechnical),
      icon: Brain,
      color: "#10B981",
      feedback: avgTechnical >= 80 ? "Excellent technical knowledge" : "Work on technical fundamentals",
    },
    {
      label: "Communication Clarity",
      score: Math.round(avgClarity),
      icon: MessageSquare,
      color: "#3B82F6",
      feedback: avgClarity >= 80 ? "Clear and well-structured" : "Practice clearer communication",
    },
    {
      label: "Keyword Coverage",
      score: Math.round(avgKeyword),
      icon: Target,
      color: "#8B5CF6",
      feedback: avgKeyword >= 80 ? "Good use of terminology" : "Learn more industry terms",
    },
    {
      label: "Content Depth",
      score: Math.round(avgDepth),
      icon: Video,
      color: "#F59E0B",
      feedback: avgDepth >= 80 ? "Detailed responses" : "Provide more detailed answers",
    },
  ];
}

function getCommunicationAverages(communicationAnalytics: any[]) {
  if (!communicationAnalytics || communicationAnalytics.length === 0) {
    return {
      wpm: 130,
      fluency: 70,
      fillers: 0,
    };
  }

  return {
    wpm: Math.round(
      communicationAnalytics.reduce((sum: number, a: any) => sum + (a?.metrics?.wordsPerMinute || 0), 0) /
        communicationAnalytics.length
    ),
    fluency: Math.round(
      communicationAnalytics.reduce((sum: number, a: any) => sum + (a?.metrics?.fluencyScore || 0), 0) /
        communicationAnalytics.length
    ),
    fillers: Math.round(
      communicationAnalytics.reduce((sum: number, a: any) => sum + (a?.metrics?.fillerWords?.count || 0), 0)
    ),
  };
}

function buildReadinessInsights(resultData: any, communicationAnalytics: any[]) {
  const comm = getCommunicationAverages(communicationAnalytics);
  const technical = resultData.metrics.find((m: any) => m.label === "Technical Accuracy")?.score || 0;
  const clarity = resultData.metrics.find((m: any) => m.label === "Communication Clarity")?.score || comm.fluency;
  const depth = resultData.metrics.find((m: any) => m.label === "Content Depth")?.score || 0;

  const readinessIndex = Math.round(technical * 0.45 + clarity * 0.30 + depth * 0.15 + resultData.overallScore * 0.10);
  const interviewSuccessChance = Math.max(5, Math.min(98, Math.round(readinessIndex * 0.85 + 8)));

  let level = "Developing";
  let message = "Build stronger fundamentals and communication consistency before high-stakes interviews.";
  let targetDays = 21;

  if (readinessIndex >= 85) {
    level = "Interview-Ready";
    message = "You are close to a production-grade interview performance. Focus on consistency and polish.";
    targetDays = 7;
  } else if (readinessIndex >= 70) {
    level = "Competitive";
    message = "You are in a strong position. A short focused sprint can lift you to top-tier performance.";
    targetDays = 14;
  }

  return {
    readinessIndex,
    interviewSuccessChance,
    level,
    message,
    targetDays,
  };
}

function buildFourteenDayPlan(resultData: any, readiness: any) {
  const weakness = (resultData.weaknesses || []).slice(0, 4);
  const metrics = resultData.metrics || [];
  const lowMetric = [...metrics].sort((a: any, b: any) => a.score - b.score)[0];

  return [
    {
      dayRange: "Days 1-3",
      title: "Foundation Reset",
      focus: lowMetric ? `Improve ${lowMetric.label}` : "Improve core interview structure",
      tasks: [
        "Record 3 answers using STAR format and review clarity.",
        "Rewrite your weakest answer into a concise 90-second version.",
        weakness[0] || "Review one weak topic and create a cheat sheet.",
      ],
    },
    {
      dayRange: "Days 4-7",
      title: "Depth Upgrade",
      focus: "Stronger technical detail and examples",
      tasks: [
        "Prepare 5 project stories with metrics and measurable outcomes.",
        "Practice follow-up why/how questions for each story.",
        weakness[1] || "Add one architecture-level explanation to each answer.",
      ],
    },
    {
      dayRange: "Days 8-11",
      title: "Communication Polish",
      focus: "Confidence, pace, and reduced filler words",
      tasks: [
        "Run 2 mock rounds and keep pace between 120-150 WPM.",
        "Reduce filler words by pausing 1 second before key points.",
        weakness[2] || "Practice concise opening and closing statements.",
      ],
    },
    {
      dayRange: "Days 12-14",
      title: "Final Sprint",
      focus: `Reach ${readiness.level} level consistency`,
      tasks: [
        "Simulate a full interview under time pressure.",
        "Review all weak answers and produce final polished versions.",
        weakness[3] || "Run one confidence-focused verbal rehearsal.",
      ],
    },
  ];
}

function buildDailyMicroDrills(resultData: any) {
  const lowQuestion = [...(resultData.questions || [])].sort((a: any, b: any) => a.score - b.score)[0];
  return [
    {
      title: "90-Second Precision Drill",
      duration: "10 min",
      action: "Answer one question in 90 seconds with clear structure: context, action, result.",
    },
    {
      title: "Weakest Answer Rewrite",
      duration: "12 min",
      action: lowQuestion
        ? `Rewrite Q${lowQuestion.id} into a stronger version with one measurable outcome.`
        : "Rewrite one weak answer with stronger examples.",
    },
    {
      title: "Voice & Pace Control",
      duration: "8 min",
      action: "Speak at 120-150 WPM and consciously replace filler words with pauses.",
    },
  ];
}

function toGoogleDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}${month}${day}`;
}

function normalizeRoleForQuestionAPI(role: string): "ml_engineer" | "software_engineer" | "data_scientist" | "backend_engineer" | "frontend_engineer" {
  const value = String(role || "").toLowerCase();
  if (value.includes("front")) return "frontend_engineer";
  if (value.includes("back")) return "backend_engineer";
  if (value.includes("data")) return "data_scientist";
  if (value.includes("ml") || value.includes("machine")) return "ml_engineer";
  return "software_engineer";
}

function buildWeeklyProgressData(currentScore: number, userId?: string | number) {
  const history = getInterviewHistory(userId);
  const sessions = [
    { score: currentScore, timestamp: Date.now() },
    ...history.map((s) => ({ score: s.score, timestamp: s.timestamp })),
  ];

  const now = new Date();
  const day = now.getDay();
  const mondayOffset = day === 0 ? 6 : day - 1;
  const currentWeekStart = new Date(now);
  currentWeekStart.setHours(0, 0, 0, 0);
  currentWeekStart.setDate(now.getDate() - mondayOffset);

  const previousWeekStart = new Date(currentWeekStart);
  previousWeekStart.setDate(currentWeekStart.getDate() - 7);

  const currentWeek = sessions.filter((s) => {
    const d = new Date(s.timestamp);
    return d >= currentWeekStart;
  });

  const previousWeek = sessions.filter((s) => {
    const d = new Date(s.timestamp);
    return d >= previousWeekStart && d < currentWeekStart;
  });

  const avg = (arr: Array<{ score: number }>) =>
    arr.length ? Math.round(arr.reduce((sum, s) => sum + s.score, 0) / arr.length) : 0;

  const currentWeekAvg = avg(currentWeek);
  const previousWeekAvg = avg(previousWeek);
  const delta = currentWeekAvg - previousWeekAvg;

  return {
    currentWeekAvg,
    previousWeekAvg,
    delta,
    currentWeekSessions: currentWeek.length,
    previousWeekSessions: previousWeek.length,
  };
}

function exportProfessionalReportPDF(
  resultData: any,
  evaluations: any[],
  userAnswers: string[],
  communicationAnalytics: any[],
  placementTwinResult?: PlacementTwinResult | null
) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginX = 52;
  const marginTop = 56;
  const contentWidth = pageWidth - marginX * 2;
  const lineHeight = 16;
  let y = marginTop;

  const drawWatermark = () => {
    doc.setTextColor(238, 242, 247);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(56);
    doc.text("INTERVOX", pageWidth / 2, pageHeight / 2, {
      align: "center",
      angle: 330,
    });
  };

  const drawFooter = (pageNo: number) => {
    doc.setDrawColor(230, 236, 243);
    doc.line(marginX, pageHeight - 48, pageWidth - marginX, pageHeight - 48);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text("Issued by InterVox", marginX, pageHeight - 32);
    doc.text(
      `Confidential Interview Evaluation Report | Page ${pageNo}`,
      pageWidth - marginX,
      pageHeight - 32,
      { align: "right" }
    );
  };

  const drawPageHeader = () => {
    drawWatermark();

    doc.setFillColor(37, 99, 235);
    doc.roundedRect(marginX, 28, 158, 26, 6, 6, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(255, 255, 255);
    doc.text("INTERVOX REPORT", marginX + 79, 45, { align: "center" });

    doc.setDrawColor(226, 232, 240);
    doc.line(marginX, 62, pageWidth - marginX, 62);
    y = 82;
  };

  const ensureSpace = (heightNeeded = 24) => {
    if (y + heightNeeded <= pageHeight - 68) {
      return;
    }

    const currentPage = doc.getNumberOfPages();
    drawFooter(currentPage);
    doc.addPage();
    drawPageHeader();
  };

  const sectionTitle = (title: string) => {
    ensureSpace(30);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.text(title, marginX, y);
    y += 12;
    doc.setDrawColor(203, 213, 225);
    doc.line(marginX, y, pageWidth - marginX, y);
    y += 16;
  };

  const writeLabelValue = (label: string, value: string) => {
    ensureSpace(18);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(51, 65, 85);
    doc.text(label, marginX, y);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(15, 23, 42);
    doc.text(value, marginX + 124, y);
    y += 16;
  };

  const writeParagraph = (text: string, indent = 0, color: [number, number, number] = [51, 65, 85]) => {
    if (!text) return;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(color[0], color[1], color[2]);
    const lines = doc.splitTextToSize(text, contentWidth - indent);
    lines.forEach((line: string) => {
      ensureSpace(lineHeight);
      doc.text(line, marginX + indent, y);
      y += lineHeight;
    });
  };

  const writeBullets = (items: string[]) => {
    if (!items || items.length === 0) {
      writeParagraph("No data available.");
      return;
    }
    items.forEach((item) => {
      ensureSpace(lineHeight);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(37, 99, 235);
      doc.text("•", marginX + 2, y);
      writeParagraph(item, 14);
    });
  };

  drawPageHeader();

  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.setTextColor(15, 23, 42);
  doc.text("Interview Performance Report", marginX, y);
  y += 30;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(71, 85, 105);
  doc.text(`Candidate Role: ${resultData.role}`, marginX, y);
  y += 18;
  doc.text(`Report Date: ${resultData.date}`, marginX, y);
  y += 28;

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(marginX, y, contentWidth, 88, 8, 8, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(34);
  doc.setTextColor(37, 99, 235);
  doc.text(`${resultData.overallScore}%`, marginX + 20, y + 56);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(30, 41, 59);
  doc.text(`Grade: ${resultData.overallScore >= 85 ? "A" : resultData.overallScore >= 70 ? "B" : resultData.overallScore >= 50 ? "C" : "D"}`, marginX + 128, y + 34);
  doc.text(`Interview Level: ${resultData.level}`, marginX + 128, y + 52);
  doc.text(`Duration: ${resultData.duration}`, marginX + 128, y + 70);
  y += 106;

  sectionTitle("Executive Summary");
  writeParagraph(resultData.summary || "No summary available.");

  y += 8;
  sectionTitle("Interview Metadata");
  writeLabelValue("Role", String(resultData.role || "N/A"));
  writeLabelValue("Level", String(resultData.level || "N/A"));
  writeLabelValue("Overall Score", `${resultData.overallScore}%`);
  writeLabelValue("Questions", String(resultData.questions?.length || 0));
  writeLabelValue(
    "Answered",
    String((userAnswers || []).filter((a: string) => a && a.trim()).length)
  );

  y += 6;
  sectionTitle("Performance Breakdown");
  (resultData.metrics || []).forEach((metric: any) => {
    ensureSpace(36);
    doc.setFillColor(250, 252, 255);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(marginX, y - 10, contentWidth, 28, 6, 6, "FD");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);
    doc.text(metric.label, marginX + 10, y + 6);
    doc.text(`${metric.score}%`, pageWidth - marginX - 10, y + 6, { align: "right" });
    y += 34;
  });

  y += 6;
  sectionTitle("Key Strengths");
  writeBullets(resultData.strengths || []);

  y += 8;
  sectionTitle("Priority Improvements");
  writeBullets(resultData.weaknesses || []);

  const readiness = buildReadinessInsights(resultData, communicationAnalytics || []);
  const fourteenDayPlan = buildFourteenDayPlan(resultData, readiness);
  const microDrills = buildDailyMicroDrills(resultData);

  y += 8;
  sectionTitle("Interview Readiness Insights");
  writeLabelValue("Readiness Index", `${readiness.readinessIndex}/100`);
  writeLabelValue("Estimated Success Chance", `${readiness.interviewSuccessChance}%`);
  writeLabelValue("Current Level", readiness.level);
  writeLabelValue("Target Improvement Window", `${readiness.targetDays} days`);
  writeParagraph(readiness.message);

  y += 8;
  sectionTitle("14-Day Personalized Improvement Plan");
  fourteenDayPlan.forEach((phase: any) => {
    ensureSpace(24);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);
    doc.text(`${phase.dayRange} | ${phase.title}`, marginX, y);
    y += 14;
    writeParagraph(`Focus: ${phase.focus}`);
    writeBullets(phase.tasks);
    y += 4;
  });

  y += 8;
  sectionTitle("Daily Micro-Drills");
  microDrills.forEach((drill: any) => {
    writeParagraph(`${drill.title} (${drill.duration})`);
    writeParagraph(drill.action, 14);
    y += 4;
  });

  if (placementTwinResult) {
    y += 8;
    sectionTitle("Placement Twin: AI Boardroom Verdict");
    writeLabelValue("Recommendation", placementTwinResult.boardroom_verdict.recommendation);
    writeLabelValue("Confidence", `${placementTwinResult.boardroom_verdict.confidence}%`);
    writeParagraph("Board rationale:");
    writeBullets(placementTwinResult.boardroom_verdict.rationale || []);

    y += 4;
    writeParagraph("Top rejection risks:");
    writeBullets(placementTwinResult.boardroom_verdict.top_rejection_risks || []);

    y += 6;
    writeParagraph("Panel votes:");
    (placementTwinResult.panel_feedback || []).forEach((p) => {
      writeParagraph(`${p.panelist}: ${p.vote} (${p.score}%)`, 14);
    });
  }

  y += 8;
  sectionTitle("Question-by-Question Analysis");

  (resultData.questions || []).forEach((q: any, index: number) => {
    ensureSpace(64);
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(marginX, y - 8, contentWidth, 30, 6, 6, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text(`Q${index + 1} | Score: ${q.score}%`, marginX + 10, y + 10);
    y += 34;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);
    doc.text("Question", marginX, y);
    y += 14;
    writeParagraph(q.question || "N/A", 0, [51, 65, 85]);

    y += 6;
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 41, 59);
    doc.text("Your Answer", marginX, y);
    y += 14;
    writeParagraph(q.yourAnswer || "No answer provided", 0, [51, 65, 85]);

    y += 6;
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 41, 59);
    doc.text("Ideal Answer Framework", marginX, y);
    y += 14;
    writeParagraph(q.idealAnswer || "N/A", 0, [71, 85, 105]);

    y += 6;
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 41, 59);
    doc.text("Improvement Suggestions", marginX, y);
    y += 14;
    writeBullets(q.improvements || []);

    y += 12;
  });

  const totalPages = doc.getNumberOfPages();
  for (let page = 1; page <= totalPages; page++) {
    doc.setPage(page);
    drawFooter(page);
  }

  const fileName = `InterVox_Interview_Report_${String(resultData.role || "role").replace(/\s+/g, "_")}_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(fileName);
}

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
  question: (typeof resultData.questions)[0];
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
  const location = useLocation();
  const { user } = useAuth();
  const { generateQuestion, isGenerating: isGeneratingFollowUps } = useQuestionGenerator();
  const { runBoardroom, isRunningTwin, error: placementTwinError } = usePlacementTwin();
  
  // Save modal state
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [savedSessionId, setSavedSessionId] = useState<string | null>(null);
  const [followUpQuestions, setFollowUpQuestions] = useState<Array<{ sourceQuestion: string; generated: QuestionData }>>([]);
  const [followUpError, setFollowUpError] = useState<string | null>(null);
  const [placementTwinResult, setPlacementTwinResult] = useState<PlacementTwinResult | null>(null);
  
  // Get real evaluation data from navigation state
  const {
    questions: realQuestions = [],
    answers: userAnswers = [],
    evaluations = [],
    overallScore: passedOverallScore,
    interviewConfig,
    panelSummary,
    communicationAnalytics = [],
  } = location.state || {};

  const interviewSignature = useMemo(
    () =>
      buildInterviewSignature({
        role: interviewConfig?.role,
        userId: user?.id,
        difficulty: interviewConfig?.difficulty,
        overallScore: passedOverallScore,
        questions: realQuestions.map((q: any) => q?.question || ""),
        answers: userAnswers,
        evaluationScores: evaluations.map((e: any) => e?.final_score ?? null),
      }),
    [interviewConfig, user?.id, passedOverallScore, realQuestions, userAnswers, evaluations]
  );

  const isSaved = !!savedSessionId;
  
  // Show save modal only once per interview signature.
  useEffect(() => {
    if (passedOverallScore === undefined) {
      return;
    }

    const metaMap = getSaveMetaMap(user?.id);
    const meta = metaMap[interviewSignature];

    if (meta?.savedSessionId) {
      setSavedSessionId(meta.savedSessionId);
    }

    if (!meta?.promptShown) {
      metaMap[interviewSignature] = {
        ...(meta || {}),
        promptShown: true,
      };
      setSaveMetaMap(metaMap, user?.id);

      const timer = setTimeout(() => {
        setShowSaveModal(true);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [passedOverallScore, interviewSignature, user?.id]);

  useEffect(() => {
    const twinMap = getPlacementTwinMap(user?.id);
    if (twinMap[interviewSignature]) {
      setPlacementTwinResult(twinMap[interviewSignature]);
    }
  }, [interviewSignature, user?.id]);
  
  // Transform real evaluation data to match expected format
  const resultData = passedOverallScore !== undefined ? {
    overallScore: passedOverallScore,
    date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    duration: `${Math.floor(realQuestions.length * 2)} min`,
    role: interviewConfig?.role || 'Software Engineer',
    level: interviewConfig?.difficulty === 'easy' ? 'Entry Level' : interviewConfig?.difficulty === 'hard' ? 'Senior Level' : 'Mid Level',
    summary: generateSummary(evaluations, passedOverallScore, realQuestions.length),
    strengths: extractStrengths(evaluations),
    weaknesses: extractWeaknesses(evaluations),
    metrics: calculateMetrics(evaluations, realQuestions.length),
    questions: realQuestions.map((q: any, idx: number) => ({
      id: idx + 1,
      question: q.question,
      yourAnswer: userAnswers[idx] || 'No answer provided',
      idealAnswer: q.ideal_answer,
      score: evaluations[idx]?.final_score || 0,
      improvements: evaluations[idx]?.improvements || (
        (userAnswers[idx] && userAnswers[idx].trim())
          ? ['Detailed suggestions were unavailable for this answer.']
          : ['No answer provided for this question.']
      ),
    })),
  } : mockResultData;

  const readinessInsights = buildReadinessInsights(resultData, communicationAnalytics);
  const fourteenDayPlan = buildFourteenDayPlan(resultData, readinessInsights);
  const dailyMicroDrills = buildDailyMicroDrills(resultData);
  const weeklyProgress = buildWeeklyProgressData(resultData.overallScore, user?.id);

  const handleAddPlanToGoogleCalendar = () => {
    const start = new Date();
    const end = new Date();
    end.setDate(start.getDate() + 14);

    const details = [
      "14-Day Interview Improvement Plan generated by InterVox",
      "",
      ...fourteenDayPlan.map((phase: any) => {
        const topTasks = (phase.tasks || []).slice(0, 3).map((t: string) => `- ${t}`).join("\n");
        return `${phase.dayRange}: ${phase.title}\nFocus: ${phase.focus}\n${topTasks}`;
      }),
      "",
      "Daily Micro-Drills:",
      ...dailyMicroDrills.map((d: any) => `- ${d.title} (${d.duration}): ${d.action}`),
      "",
      "Issued by InterVox",
    ].join("\n");

    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent("InterVox 14-Day Interview Improvement Plan")}&dates=${toGoogleDate(start)}/${toGoogleDate(end)}&details=${encodeURIComponent(details)}&location=${encodeURIComponent("InterVox")}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleGenerateFollowUps = async () => {
    setFollowUpError(null);
    setFollowUpQuestions([]);

    const weakQuestions = [...(resultData.questions || [])]
      .filter((q: any) => q.yourAnswer && q.yourAnswer.trim())
      .sort((a: any, b: any) => a.score - b.score)
      .slice(0, 3);

    if (weakQuestions.length === 0) {
      setFollowUpError("No answered weak questions found to generate follow-ups.");
      return;
    }

    const roleForApi = normalizeRoleForQuestionAPI(resultData.role);
    const generatedList: Array<{ sourceQuestion: string; generated: QuestionData }> = [];

    for (const weak of weakQuestions) {
      const next = await generateQuestion({
        role: roleForApi,
        difficulty: "medium",
        previous_qa: [
          {
            question: weak.question,
            answer: weak.yourAnswer,
          },
        ],
        use_ai: true,
      });

      if (next) {
        generatedList.push({
          sourceQuestion: weak.question,
          generated: next,
        });
      }
    }

    if (generatedList.length === 0) {
      setFollowUpError("Could not generate follow-up questions right now. Please try again.");
      return;
    }

    setFollowUpQuestions(generatedList);
  };

  const handleRunPlacementTwin = async () => {
    const qaPairs = resultData.questions.map((q: any, idx: number) => ({
      question: q.question,
      answer: q.yourAnswer,
      ideal_answer: q.idealAnswer,
      evaluation: evaluations[idx] || null,
    }));

    const commMetrics = communicationAnalytics && communicationAnalytics.length > 0
      ? {
          wordsPerMinute: Math.round(
            communicationAnalytics.reduce((sum: number, a: any) => sum + (a?.metrics?.wordsPerMinute || 0), 0) /
              communicationAnalytics.length
          ),
          fluencyScore: Math.round(
            communicationAnalytics.reduce((sum: number, a: any) => sum + (a?.metrics?.fluencyScore || 0), 0) /
              communicationAnalytics.length
          ),
          fillerWords: Math.round(
            communicationAnalytics.reduce((sum: number, a: any) => sum + (a?.metrics?.fillerWords?.count || 0), 0)
          ),
        }
      : {};

    const result = await runBoardroom({
      role: String(interviewConfig?.role || resultData.role || "software_engineer").toLowerCase(),
      difficulty: String(interviewConfig?.difficulty || "medium").toLowerCase(),
      interview_context: {
        role: resultData.role,
        level: resultData.level,
        total_questions: resultData.questions.length,
        overall_score: resultData.overallScore,
        target_company: panelSummary?.targetCompany || interviewConfig?.targetCompany || 'General',
        boardroom_mode: panelSummary?.boardroomMode ?? interviewConfig?.boardroomMode ?? false,
        company_tone: panelSummary?.companyTone || 'Balanced interview style',
      },
      communication_metrics: commMetrics,
      qa_pairs: qaPairs,
    });

    if (!result) {
      return;
    }

    setPlacementTwinResult(result);
    const twinMap = getPlacementTwinMap(user?.id);
    twinMap[interviewSignature] = result;
    setPlacementTwinMap(twinMap, user?.id);
  };

  // Export PDF functionality
  const handleExportPDF = () => {
    try {
      exportProfessionalReportPDF(
        resultData,
        evaluations,
        userAnswers,
        communicationAnalytics,
        placementTwinResult
      );
    } catch (error) {
      console.error('PDF export error:', error);
      alert('Failed to export PDF. Please try again.');
    }
  };

  // Share Results functionality
  const handleShareResults = async () => {
    try {
      const shareData = {
        title: `InterVox Interview Results - ${resultData.overallScore}%`,
        text: `I scored ${resultData.overallScore}% on my ${resultData.role} interview practice! 🎯\n\nPerformance Breakdown:\n${resultData.metrics.map(m => `${m.label}: ${m.score}%`).join('\n')}\n\nPowered by InterVox AI`,
        url: window.location.href,
      };

      // Check if Web Share API is supported
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: Copy to clipboard
        const shareText = `InterVox Interview Results\n\nScore: ${resultData.overallScore}%\nRole: ${resultData.role}\nDate: ${resultData.date}\n\n${shareData.text}`;
        await navigator.clipboard.writeText(shareText);
        alert('Results copied to clipboard! You can now paste and share.');
      }
    } catch (error) {
      console.error('Share error:', error);
      // Fallback to clipboard if share fails
      try {
        const shareText = `InterVox Interview Results\nScore: ${resultData.overallScore}%\nRole: ${resultData.role}`;
        await navigator.clipboard.writeText(shareText);
        alert('Results copied to clipboard!');
      } catch {
        alert('Sharing not supported. Please take a screenshot to share your results.');
      }
    }
  };

  // Save interview to history
  const handleSaveInterview = async () => {
    try {
      if (savedSessionId) {
        setShowSaveModal(false);
        return;
      }

      const questionsAnswered = userAnswers.filter((a: string) => a && a.trim()).length;
      
      // Calculate duration based on analytics or fallback
      const durationMinutes = Math.floor(realQuestions.length * 2);
      const duration = `${durationMinutes} min`;
      
      const saved = await saveUserInterview({
        date: resultData.date,
        dateShort: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        role: resultData.role,
        level: resultData.level,
        difficulty: interviewConfig?.difficulty || 'medium',
        score: resultData.overallScore,
        duration: duration,
        questions: realQuestions.length,
        questionsAnswered: questionsAnswered,
        fullData: {
          questions: realQuestions,
          answers: userAnswers,
          evaluations: evaluations,
          communicationAnalytics: communicationAnalytics,
          interviewConfig: interviewConfig,
        },
      }, user?.id);
      
      setSavedSessionId(saved.id);

      const metaMap = getSaveMetaMap(user?.id);
      metaMap[interviewSignature] = {
        promptShown: true,
        savedSessionId: saved.id,
      };
      setSaveMetaMap(metaMap, user?.id);

      setShowSaveModal(false);
      
      console.log('✅ Interview saved to history!');
    } catch (error) {
      console.error('❌ Error saving interview:', error);
      alert('Failed to save interview. Please try again.');
    }
  };

  // Skip saving
  const handleSkipSave = () => {
    const metaMap = getSaveMetaMap(user?.id);
    metaMap[interviewSignature] = {
      ...(metaMap[interviewSignature] || {}),
      promptShown: true,
      savedSessionId: savedSessionId || undefined,
    };
    setSaveMetaMap(metaMap, user?.id);

    setShowSaveModal(false);
    console.log('⏭️ Interview not saved');
  };

  const handleToggleSave = async () => {
    if (!savedSessionId) {
      handleSaveInterview();
      return;
    }

    const deleted = await deleteUserInterview(savedSessionId, user?.id);
    if (!deleted) {
      alert('Failed to unsave interview. Please try again.');
      return;
    }

    const metaMap = getSaveMetaMap(user?.id);
    metaMap[interviewSignature] = {
      ...(metaMap[interviewSignature] || {}),
      promptShown: true,
      savedSessionId: undefined,
    };
    setSaveMetaMap(metaMap, user?.id);
    setSavedSessionId(null);
    console.log('🗑️ Interview unsaved from history');
  };

  return (
    <>
      {/* Save Interview Modal */}
      <SaveInterviewModal
        open={showSaveModal}
        onSave={handleSaveInterview}
        onSkip={handleSkipSave}
        score={resultData.overallScore}
        role={resultData.role}
      />
      
      {/* Print Styles */}
      <style>{`
        @media print {
          @page {
            margin: 1cm;
            size: A4;
          }
          
          /* Hide navigation and action buttons */
          header button,
          .no-print {
            display: none !important;
          }
          
          /* Ensure proper page breaks */
          .page-break-avoid {
            page-break-inside: avoid;
          }
          
          /* Optimize colors for print */
          body {
            background: white !important;
          }
          
          /* Make sure content is visible */
          * {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      `}</style>
      
      <div className="min-h-screen bg-[#F9FAFB]" id="results-content">{/* Print-friendly ID */}
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
              onClick={handleToggleSave}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-colors ${
                isSaved
                  ? "border-[#BBF7D0] bg-[#F0FDF4] hover:bg-[#DCFCE7]"
                  : "border-[#E2E8F0] bg-white hover:bg-[#F8FAFC]"
              }`}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                fontSize: "0.875rem",
                color: isSaved ? "#15803D" : "#475569",
              }}
            >
              <Save size={14} strokeWidth={2} />
              {isSaved ? "Unsave" : "Save"}
            </button>
            <button
              onClick={handleExportPDF}
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
              onClick={handleShareResults}
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
              <CircularProgress score={resultData.overallScore} />
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
                {resultData.role} • {resultData.level}
              </p>
              <div className="flex items-center justify-center lg:justify-start gap-4 text-sm text-[#94A3B8] mb-6">
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} strokeWidth={2} />
                  {resultData.date}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Clock size={14} strokeWidth={2} />
                  {resultData.duration}
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
            {resultData.metrics.map((metric) => (
              <MetricCard key={metric.label} {...metric} />
            ))}
          </div>
        </div>

        {/* Communication Analytics Section */}
        {communicationAnalytics && communicationAnalytics.length > 0 && (
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
              Communication Analytics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Words Per Minute */}
              <div
                className="bg-white rounded-2xl border border-[#E2E8F0] p-5"
                style={{ boxShadow: "0 1px 12px rgba(0,0,0,0.05)" }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: "#10B98115" }}
                  >
                    <TrendingUp size={18} strokeWidth={2} style={{ color: "#10B981" }} />
                  </div>
                  <h3
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      color: "#64748B",
                    }}
                  >
                    Speaking Pace
                  </h3>
                </div>
                <div className="flex items-baseline gap-2">
                  <span
                    style={{
                      fontFamily: "'Montserrat', sans-serif",
                      fontWeight: 800,
                      fontSize: "2rem",
                      color: "#1E293B",
                    }}
                  >
                    {Math.round(communicationAnalytics.reduce((sum: number, a: any) => sum + a.metrics.wordsPerMinute, 0) / communicationAnalytics.length)}
                  </span>
                  <span
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "0.875rem",
                      color: "#94A3B8",
                    }}
                  >
                    WPM
                  </span>
                </div>
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.75rem",
                    color: "#94A3B8",
                    marginTop: "8px",
                  }}
                >
                  Ideal range: 120-150 WPM
                </p>
              </div>

              {/* Fluency Score */}
              <div
                className="bg-white rounded-2xl border border-[#E2E8F0] p-5"
                style={{ boxShadow: "0 1px 12px rgba(0,0,0,0.05)" }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: "#2563EB15" }}
                  >
                    <Zap size={18} strokeWidth={2} style={{ color: "#2563EB" }} />
                  </div>
                  <h3
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      color: "#64748B",
                    }}
                  >
                    Fluency Score
                  </h3>
                </div>
                <div className="flex items-baseline gap-2">
                  <span
                    style={{
                      fontFamily: "'Montserrat', sans-serif",
                      fontWeight: 800,
                      fontSize: "2rem",
                      color: "#1E293B",
                    }}
                  >
                    {Math.round(communicationAnalytics.reduce((sum: number, a: any) => sum + a.metrics.fluencyScore, 0) / communicationAnalytics.length)}
                  </span>
                  <span
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "0.875rem",
                      color: "#94A3B8",
                    }}
                  >
                    %
                  </span>
                </div>
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.75rem",
                    color: "#94A3B8",
                    marginTop: "8px",
                  }}
                >
                  Based on pace, fillers & pauses
                </p>
              </div>

              {/* Filler Words */}
              <div
                className="bg-white rounded-2xl border border-[#E2E8F0] p-5"
                style={{ boxShadow: "0 1px 12px rgba(0,0,0,0.05)" }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: "#F59E0B15" }}
                  >
                    <Pause size={18} strokeWidth={2} style={{ color: "#F59E0B" }} />
                  </div>
                  <h3
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      color: "#64748B",
                    }}
                  >
                    Filler Words
                  </h3>
                </div>
                <div className="flex items-baseline gap-2">
                  <span
                    style={{
                      fontFamily: "'Montserrat', sans-serif",
                      fontWeight: 800,
                      fontSize: "2rem",
                      color: "#1E293B",
                    }}
                  >
                    {communicationAnalytics.reduce((sum: number, a: any) => sum + a.metrics.fillerWords.count, 0)}
                  </span>
                  <span
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "0.875rem",
                      color: "#94A3B8",
                    }}
                  >
                    total
                  </span>
                </div>
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.75rem",
                    color: "#94A3B8",
                    marginTop: "8px",
                  }}
                >
                  Um, uh, like, you know
                </p>
              </div>
            </div>
          </div>
        )}

        {/* AI Summary Section - ENHANCED */}
        <div className="mb-8">
          <div
            className="bg-gradient-to-br from-[#EEF2FF] to-[#E0E7FF] rounded-2xl border-2 border-[#818CF8] p-6 lg:p-8"
            style={{ boxShadow: "0 8px 32px rgba(99, 102, 241, 0.15)" }}
          >
            <div className="flex items-start gap-4 mb-5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#818CF8] to-[#6366F1] flex items-center justify-center flex-shrink-0 shadow-lg">
                <Sparkles size={24} className="text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h2
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontWeight: 800,
                    fontSize: "1.5rem",
                    color: "#1E293B",
                    marginBottom: "6px",
                    letterSpacing: "-0.02em",
                  }}
                >
                  🤖 AI Interview Summary
                </h2>
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.875rem",
                    color: "#4338CA",
                    fontWeight: 600,
                  }}
                >
                  Comprehensive analysis based on your interview performance
                </p>
              </div>
            </div>
            <div
              className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-[#C7D2FE] shadow-sm"
            >
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "1rem",
                  color: "#334155",
                  lineHeight: 1.9,
                  fontWeight: 400,
                }}
              >
                {resultData.summary}
              </p>
            </div>
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
                {resultData.strengths.map((strength, idx) => (
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
                {resultData.weaknesses.map((weakness, idx) => (
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

        {/* Unique Value Features */}
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
            Career Acceleration Features
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5" style={{ boxShadow: "0 1px 12px rgba(0,0,0,0.05)" }}>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", color: "#64748B", marginBottom: "8px" }}>
                Interview Readiness Index
              </p>
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: "2rem", color: "#2563EB" }}>
                {readinessInsights.readinessIndex}
              </p>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.875rem", color: "#475569", marginTop: "8px" }}>
                Level: {readinessInsights.level}
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5" style={{ boxShadow: "0 1px 12px rgba(0,0,0,0.05)" }}>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", color: "#64748B", marginBottom: "8px" }}>
                Estimated Interview Success Chance
              </p>
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: "2rem", color: "#10B981" }}>
                {readinessInsights.interviewSuccessChance}%
              </p>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.875rem", color: "#475569", marginTop: "8px" }}>
                With focused practice in next {readinessInsights.targetDays} days
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5" style={{ boxShadow: "0 1px 12px rgba(0,0,0,0.05)" }}>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", color: "#64748B", marginBottom: "8px" }}>
                Next Milestone
              </p>
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: "1.125rem", color: "#1E293B", lineHeight: 1.4 }}>
                {readinessInsights.level === "Interview-Ready" ? "Polish and consistency" : "Structured improvement sprint"}
              </p>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.875rem", color: "#475569", marginTop: "8px" }}>
                {readinessInsights.message}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6" style={{ boxShadow: "0 1px 12px rgba(0,0,0,0.05)" }}>
              <h3 style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: "1.1rem", color: "#1E293B", marginBottom: "14px" }}>
                14-Day Personalized Plan
              </h3>
              <div className="flex flex-col gap-3">
                {fourteenDayPlan.map((phase, idx) => (
                  <div key={idx} className="p-3 rounded-xl border border-[#DBEAFE]" style={{ backgroundColor: "#EFF6FF" }}>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: "0.875rem", color: "#1E3A8A", marginBottom: "4px" }}>
                      {phase.dayRange} · {phase.title}
                    </p>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", color: "#334155", marginBottom: "6px" }}>
                      Focus: {phase.focus}
                    </p>
                    {phase.tasks.slice(0, 2).map((task: string, taskIdx: number) => (
                      <p key={taskIdx} style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", color: "#334155", lineHeight: 1.5 }}>
                        • {task}
                      </p>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6" style={{ boxShadow: "0 1px 12px rgba(0,0,0,0.05)" }}>
              <h3 style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: "1.1rem", color: "#1E293B", marginBottom: "14px" }}>
                Daily 10-Minute Micro-Drills
              </h3>
              <div className="flex flex-col gap-3">
                {dailyMicroDrills.map((drill, idx) => (
                  <div key={idx} className="p-3 rounded-xl border border-[#D1FAE5]" style={{ backgroundColor: "#F0FDF4" }}>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: "0.875rem", color: "#065F46", marginBottom: "4px" }}>
                      {drill.title}
                    </p>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", color: "#047857", marginBottom: "6px" }}>
                      Duration: {drill.duration}
                    </p>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", color: "#334155", lineHeight: 1.5 }}>
                      {drill.action}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              onClick={handleAddPlanToGoogleCalendar}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white transition-colors"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                fontSize: "0.875rem",
                boxShadow: "0 4px 16px rgba(37,99,235,0.28)",
              }}
            >
              <Calendar size={14} strokeWidth={2} />
              Add 14-Day Plan to Google Calendar
            </button>
          </div>
        </div>

        {/* Weekly Progress Tracker */}
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
            Weekly Progress Tracker
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5" style={{ boxShadow: "0 1px 12px rgba(0,0,0,0.05)" }}>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", color: "#64748B" }}>This Week Average</p>
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: "2rem", color: "#1E293B" }}>{weeklyProgress.currentWeekAvg}%</p>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", color: "#94A3B8", marginTop: "6px" }}>{weeklyProgress.currentWeekSessions} sessions</p>
            </div>
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5" style={{ boxShadow: "0 1px 12px rgba(0,0,0,0.05)" }}>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", color: "#64748B" }}>Last Week Average</p>
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: "2rem", color: "#475569" }}>{weeklyProgress.previousWeekAvg}%</p>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", color: "#94A3B8", marginTop: "6px" }}>{weeklyProgress.previousWeekSessions} sessions</p>
            </div>
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5" style={{ boxShadow: "0 1px 12px rgba(0,0,0,0.05)" }}>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", color: "#64748B" }}>Week-over-Week Trend</p>
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: "2rem", color: weeklyProgress.delta >= 0 ? "#10B981" : "#EF4444" }}>
                {weeklyProgress.delta >= 0 ? "+" : ""}{weeklyProgress.delta}%
              </p>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", color: "#94A3B8", marginTop: "6px" }}>
                {weeklyProgress.delta >= 0 ? "You are improving. Keep the streak." : "Focus on drills to regain momentum."}
              </p>
            </div>
          </div>
        </div>

        {/* Mock Interviewer Mode */}
        <div className="mb-8">
          <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
            <h2
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 700,
                fontSize: "1.25rem",
                color: "#1E293B",
              }}
            >
              Mock Interviewer Follow-Ups
            </h2>
            <button
              onClick={handleGenerateFollowUps}
              disabled={isGeneratingFollowUps}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] disabled:bg-[#94A3B8] text-white transition-colors"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                fontSize: "0.875rem",
              }}
            >
              <Brain size={14} strokeWidth={2} />
              {isGeneratingFollowUps ? "Generating..." : "Generate Follow-Up Questions"}
            </button>
          </div>

          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.875rem", color: "#64748B", marginBottom: "12px" }}>
            AI generates targeted follow-up questions from your weakest answers so you can practice what interviewers are most likely to ask next.
          </p>

          {followUpError && (
            <div className="p-3 rounded-xl border border-[#FECACA] bg-[#FEF2F2] mb-3">
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.875rem", color: "#B91C1C" }}>{followUpError}</p>
            </div>
          )}

          {followUpQuestions.length > 0 && (
            <div className="flex flex-col gap-3">
              {followUpQuestions.map((item, idx) => (
                <div key={idx} className="bg-white rounded-2xl border border-[#E2E8F0] p-5" style={{ boxShadow: "0 1px 12px rgba(0,0,0,0.05)" }}>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", color: "#64748B", marginBottom: "8px" }}>
                    Based on: {item.sourceQuestion}
                  </p>
                  <p style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: "1rem", color: "#1E293B", marginBottom: "8px" }}>
                    {item.generated.question}
                  </p>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", color: "#475569" }}>
                    Ideal direction: {item.generated.ideal_answer}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Placement Twin USP Feature */}
        <div className="mb-8">
          <div
            className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] rounded-2xl border border-[#334155] p-6 lg:p-8"
            style={{ boxShadow: "0 10px 30px rgba(15,23,42,0.35)" }}
          >
            <div className="flex items-start justify-between gap-4 flex-wrap mb-5">
              <div>
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.75rem",
                    color: "#93C5FD",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    fontWeight: 700,
                    marginBottom: "8px",
                  }}
                >
                  USP Feature
                </p>
                <h2
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontWeight: 800,
                    fontSize: "1.4rem",
                    color: "#F8FAFC",
                    letterSpacing: "-0.02em",
                    marginBottom: "6px",
                  }}
                >
                  Placement Twin: AI Interview Boardroom
                </h2>
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.875rem",
                    color: "#CBD5E1",
                    lineHeight: 1.6,
                    maxWidth: "760px",
                  }}
                >
                  Simulates a real hiring panel with Technical Interviewer, Hiring Manager, and Communication Evaluator,
                  then produces a strict Hire/Hold/No-Hire verdict, confidence, stress dynamics, rejection risks, and
                  interviewer-grade probing questions.
                </p>
              </div>

              <button
                onClick={handleRunPlacementTwin}
                disabled={isRunningTwin}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] disabled:bg-[#64748B] text-white transition-colors"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 700,
                  fontSize: "0.875rem",
                  boxShadow: "0 6px 18px rgba(37,99,235,0.32)",
                }}
              >
                <Sparkles size={14} strokeWidth={2.2} />
                {isRunningTwin ? "Running Boardroom..." : "Run Placement Twin"}
              </button>
            </div>

            {placementTwinError && (
              <div className="mb-4 p-3 rounded-xl border border-[#7F1D1D] bg-[#450A0A]">
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.875rem", color: "#FECACA" }}>
                  {placementTwinError}
                </p>
              </div>
            )}

            {placementTwinResult && (
              <div className="flex flex-col gap-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="rounded-xl border border-[#334155] bg-[#0B1220] p-4">
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", color: "#94A3B8" }}>Board Verdict</p>
                    <p style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: "1.5rem", color: "#F8FAFC", marginTop: "4px" }}>
                      {placementTwinResult.boardroom_verdict.recommendation}
                    </p>
                  </div>
                  <div className="rounded-xl border border-[#334155] bg-[#0B1220] p-4">
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", color: "#94A3B8" }}>Confidence</p>
                    <p style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: "1.5rem", color: "#60A5FA", marginTop: "4px" }}>
                      {placementTwinResult.boardroom_verdict.confidence}%
                    </p>
                  </div>
                  <div className="rounded-xl border border-[#334155] bg-[#0B1220] p-4">
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", color: "#94A3B8" }}>Top Risk Count</p>
                    <p style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: "1.5rem", color: "#FCA5A5", marginTop: "4px" }}>
                      {placementTwinResult.boardroom_verdict.top_rejection_risks.length}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="rounded-xl border border-[#334155] bg-[#0B1220] p-4">
                    <h3 style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: "1rem", color: "#E2E8F0", marginBottom: "10px" }}>
                      Panel Feedback & Votes
                    </h3>
                    <div className="flex flex-col gap-3">
                      {placementTwinResult.panel_feedback.map((panel, idx) => (
                        <div key={idx} className="rounded-lg border border-[#334155] p-3" style={{ backgroundColor: "#111827" }}>
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: "0.9rem", color: "#F8FAFC" }}>
                              {panel.panelist}
                            </p>
                            <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: "0.8rem", color: "#93C5FD" }}>
                              {panel.vote} · {panel.score}%
                            </p>
                          </div>
                          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", color: "#94A3B8", marginBottom: "6px" }}>
                            Focus: {panel.focus}
                          </p>
                          {panel.concerns.slice(0, 2).map((c, i) => (
                            <p key={i} style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", color: "#CBD5E1", lineHeight: 1.5 }}>
                              • {c}
                            </p>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl border border-[#334155] bg-[#0B1220] p-4">
                    <h3 style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: "1rem", color: "#E2E8F0", marginBottom: "10px" }}>
                      Stress Dynamics
                    </h3>
                    <div className="flex flex-col gap-3">
                      {placementTwinResult.stress_dynamics.map((s, idx) => (
                        <div key={idx} className="rounded-lg border border-[#334155] p-3" style={{ backgroundColor: "#111827" }}>
                          <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: "0.85rem", color: "#F8FAFC", marginBottom: "4px" }}>
                            {s.signal} · {s.severity.toUpperCase()}
                          </p>
                          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", color: "#CBD5E1", marginBottom: "4px", lineHeight: 1.5 }}>
                            Evidence: {s.evidence}
                          </p>
                          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", color: "#94A3B8", lineHeight: 1.5 }}>
                            Impact: {s.impact}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-[#334155] bg-[#0B1220] p-4">
                  <h3 style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: "1rem", color: "#E2E8F0", marginBottom: "10px" }}>
                    Placement Gap Map
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {placementTwinResult.placement_gap_map.map((gap, idx) => (
                      <div key={idx} className="rounded-lg border border-[#334155] p-3" style={{ backgroundColor: "#111827" }}>
                        <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: "0.85rem", color: "#F8FAFC" }}>
                          {gap.area} · {gap.severity.toUpperCase()}
                        </p>
                        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", color: "#94A3B8", marginTop: "4px" }}>
                          {gap.current_score}% → {gap.target_score}%
                        </p>
                        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", color: "#CBD5E1", marginTop: "6px", lineHeight: 1.5 }}>
                          {gap.impact}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    { label: "Day 7 Plan", items: placementTwinResult.improvement_plans.day_7 },
                    { label: "Day 14 Plan", items: placementTwinResult.improvement_plans.day_14 },
                    { label: "Day 30 Plan", items: placementTwinResult.improvement_plans.day_30 },
                  ].map((plan, idx) => (
                    <div key={idx} className="rounded-xl border border-[#334155] bg-[#0B1220] p-4">
                      <h4 style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: "0.95rem", color: "#E2E8F0", marginBottom: "8px" }}>
                        {plan.label}
                      </h4>
                      {plan.items.map((item, i) => (
                        <p key={i} style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", color: "#CBD5E1", lineHeight: 1.5, marginBottom: "6px" }}>
                          • {item}
                        </p>
                      ))}
                    </div>
                  ))}
                </div>

                <div className="rounded-xl border border-[#334155] bg-[#0B1220] p-4">
                  <h3 style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: "1rem", color: "#E2E8F0", marginBottom: "10px" }}>
                    Interviewer Assist
                  </h3>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.82rem", color: "#94A3B8", marginBottom: "8px" }}>
                    Rubric Summary: {placementTwinResult.interviewer_assist.rubric_summary}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: "0.85rem", color: "#E2E8F0", marginBottom: "6px" }}>Probing Questions</p>
                      {placementTwinResult.interviewer_assist.probing_questions.map((q, i) => (
                        <p key={i} style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", color: "#CBD5E1", lineHeight: 1.5, marginBottom: "6px" }}>
                          • {q}
                        </p>
                      ))}
                    </div>
                    <div>
                      <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: "0.85rem", color: "#E2E8F0", marginBottom: "6px" }}>Bias Checks</p>
                      {placementTwinResult.interviewer_assist.bias_checks.map((b, i) => (
                        <p key={i} style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", color: "#CBD5E1", lineHeight: 1.5, marginBottom: "6px" }}>
                          • {b}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
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
              {resultData.questions.length} questions answered
            </span>
          </div>
          <div className="flex flex-col gap-4">
            {resultData.questions.map((question, index) => (
              <QuestionAccordion key={question.id} question={question} index={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}