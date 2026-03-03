import { useState } from "react";
import { X, Play, Briefcase, ChevronDown, Check, Sparkles, Zap, Clock } from "lucide-react";
import { useNavigate } from "react-router";

interface RoleOption {
  value: string; // Backend enum value
  display: string; // User-friendly display name
}

const roles: RoleOption[] = [
  { value: "ml_engineer", display: "ML Engineer" },
  { value: "software_engineer", display: "Software Engineer" },
  { value: "data_scientist", display: "Data Scientist" },
  { value: "backend_engineer", display: "Backend Engineer" },
  { value: "frontend_engineer", display: "Frontend Engineer" },
];

type DifficultyLevel = "easy" | "medium" | "hard";
type QuestionCount = 5 | 10 | 15;

interface InterviewSetupModalProps {
  onClose: () => void;
}

export function InterviewSetupModal({ onClose }: InterviewSetupModalProps) {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [roleOpen, setRoleOpen] = useState(false);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>("medium");
  const [questionCount, setQuestionCount] = useState<QuestionCount>(10);

  const handleStart = () => {
    if (!selectedRole) return;
    
    onClose();
    
    // Pass interview configuration to LiveInterview via navigation state
    navigate("/interview-live", {
      state: {
        role: selectedRole,
        difficulty: difficulty,
        questionCount: questionCount,
      }
    });
  };

  const difficultyLevels: { value: DifficultyLevel; label: string; desc: string; color: string }[] = [
    { value: "easy", label: "Easy", desc: "Beginner", color: "#10B981" },
    { value: "medium", label: "Medium", desc: "Intermediate", color: "#F59E0B" },
    { value: "hard", label: "Hard", desc: "Advanced", color: "#EF4444" },
  ];

  const questionCounts: { value: QuestionCount; label: string; desc: string }[] = [
    { value: 5, label: "5", desc: "~10 min" },
    { value: 10, label: "10", desc: "~20 min" },
    { value: 15, label: "15", desc: "~30 min" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#0F172A]/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-[#E2E8F0] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] px-7 py-6 flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Briefcase size={18} className="text-white" strokeWidth={2} />
            </div>
            <div>
              <h2
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 800,
                  fontSize: "1.2rem",
                  color: "#FFFFFF",
                  lineHeight: 1.3,
                  letterSpacing: "-0.02em",
                }}
              >
                Set Up Your Interview
              </h2>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", color: "rgba(255,255,255,0.65)", marginTop: "2px" }}>
                Customize your AI mock session
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <X size={16} className="text-white" strokeWidth={2.5} />
          </button>
        </div>

        {/* Body */}
        <div className="px-7 py-6 flex flex-col gap-6">

          {/* Role Dropdown */}
          <div className="flex flex-col gap-2">
            <label
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: "0.875rem", color: "#1E293B" }}
            >
              Select Role
              <span className="text-[#EF4444] ml-1">*</span>
            </label>
            <div className="relative">
              <button
                onClick={() => setRoleOpen(!roleOpen)}
                className="w-full flex items-center justify-between px-4 py-3 border border-[#E2E8F0] rounded-xl bg-[#F8FAFC] hover:border-[#2563EB] transition-colors text-left"
                style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.875rem" }}
              >
                <span style={{ color: selectedRole ? "#1E293B" : "#94A3B8" }}>
                  {selectedRole ? roles.find(r => r.value === selectedRole)?.display : "Select your role..."}
                </span>
                <ChevronDown
                  size={16}
                  strokeWidth={2}
                  className={`text-[#64748B] transition-transform duration-150 ${roleOpen ? "rotate-180" : ""}`}
                />
              </button>

              {roleOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#E2E8F0] rounded-xl shadow-xl z-20 overflow-hidden max-h-52 overflow-y-auto">
                  {roles.map((role) => (
                    <button
                      key={role.value}
                      onClick={() => { setSelectedRole(role.value); setRoleOpen(false); }}
                      className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-[#F8FAFC] text-left transition-colors"
                      style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.875rem", color: "#1E293B" }}
                    >
                      {role.display}
                      {selectedRole === role.value && (
                        <Check size={14} strokeWidth={2.5} className="text-[#2563EB]" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Difficulty Level */}
          <div className="flex flex-col gap-2">
            <label
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: "0.875rem", color: "#1E293B" }}
            >
              <div className="flex items-center gap-2">
                <Zap size={14} strokeWidth={2.5} className="text-[#F59E0B]" />
                Difficulty Level
              </div>
            </label>
            <div className="grid grid-cols-3 gap-3">
              {difficultyLevels.map(({ value, label, desc, color }) => {
                const isSelected = difficulty === value;
                return (
                  <button
                    key={value}
                    onClick={() => setDifficulty(value)}
                    className="flex flex-col items-center gap-1 py-3 px-2 rounded-xl border-2 transition-all duration-150"
                    style={{
                      borderColor: isSelected ? color : "#E2E8F0",
                      backgroundColor: isSelected ? color + "0D" : "#F8FAFC",
                    }}
                  >
                    <div
                      className="w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all"
                      style={{
                        borderColor: isSelected ? color : "#CBD5E1",
                        backgroundColor: isSelected ? color : "transparent",
                      }}
                    >
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                    <span
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 700,
                        fontSize: "0.8rem",
                        color: isSelected ? color : "#475569",
                      }}
                    >
                      {label}
                    </span>
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.68rem", color: "#94A3B8" }}>
                      {desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Question Count */}
          <div className="flex flex-col gap-2">
            <label
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: "0.875rem", color: "#1E293B" }}
            >
              <div className="flex items-center gap-2">
                <Clock size={14} strokeWidth={2.5} className="text-[#2563EB]" />
                Number of Questions
              </div>
            </label>
            <div className="grid grid-cols-3 gap-3">
              {questionCounts.map(({ value, label, desc }) => {
                const isSelected = questionCount === value;
                return (
                  <button
                    key={value}
                    onClick={() => setQuestionCount(value)}
                    className="flex flex-col items-center gap-1 py-3 px-2 rounded-xl border-2 transition-all duration-150"
                    style={{
                      borderColor: isSelected ? "#2563EB" : "#E2E8F0",
                      backgroundColor: isSelected ? "#EFF6FF" : "#F8FAFC",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 800,
                        fontSize: "1.25rem",
                        color: isSelected ? "#2563EB" : "#475569",
                      }}
                    >
                      {label}
                    </span>
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.68rem", color: "#94A3B8" }}>
                      {desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-7 pb-7 flex items-center justify-between gap-4">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC] transition-colors"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: "0.875rem" }}
          >
            Cancel
          </button>
          <button
            onClick={handleStart}
            disabled={!selectedRole}
            className="flex items-center gap-2.5 px-6 py-2.5 rounded-xl text-white transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
              fontSize: "0.875rem",
              backgroundColor: selectedRole ? "#2563EB" : "#93C5FD",
              boxShadow: selectedRole ? "0 4px 20px rgba(37,99,235,0.35)" : "none",
            }}
          >
            <Play size={14} strokeWidth={2.5} className="fill-white" />
            Start Interview
            <Sparkles size={13} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}