import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Briefcase,
  Target,
  Building2,
  Play,
  Sparkles,
  ChevronDown,
  Check,
  Info,
} from "lucide-react";

const jobRoles = [
  "Software Engineer",
  "Product Manager",
  "Data Analyst",
  "UX Designer",
  "Marketing Manager",
  "Sales Executive",
  "Business Analyst",
  "DevOps Engineer",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Data Scientist",
  "Project Manager",
  "HR Manager",
  "Financial Analyst",
];

const companies = [
  "Google",
  "Microsoft",
  "Amazon",
  "Apple",
  "Meta",
  "Netflix",
  "Tesla",
  "Uber",
  "Airbnb",
  "Spotify",
  "Adobe",
  "Salesforce",
  "Oracle",
  "IBM",
  "Other",
];

type ExperienceLevel = "Fresher" | "Mid-Level" | "Senior";

export default function Practice() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState("");
  const [roleOpen, setRoleOpen] = useState(false);
  const [experience, setExperience] = useState<ExperienceLevel>("Mid-Level");
  const [targetCompany, setTargetCompany] = useState("");
  const [companyOpen, setCompanyOpen] = useState(false);

  const handleStartInterview = () => {
    if (!selectedRole) {
      alert("Please select a job role");
      return;
    }
    // Navigate to live interview
    navigate("/interview-live");
  };

  const experienceLevels: { value: ExperienceLevel; label: string; desc: string; color: string }[] = [
    { value: "Fresher", label: "Fresher", desc: "0–1 years", color: "#7C3AED" },
    { value: "Mid-Level", label: "Mid Level", desc: "2–5 years", color: "#2563EB" },
    { value: "Senior", label: "Senior", desc: "6+ years", color: "#0891B2" },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-[#F9FAFB]">
      {/* Header */}
      <header className="bg-white border-b border-[#E2E8F0] px-6 lg:px-8 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] flex items-center justify-center">
              <Target size={18} className="text-[#2563EB]" strokeWidth={2} />
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
              Practice Interview
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
            Configure your mock interview session and get personalized AI-powered feedback
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div className="px-6 lg:px-8 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Setup Card */}
          <div
            className="bg-white rounded-3xl border border-[#E2E8F0] p-8 lg:p-10"
            style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}
          >
            <div className="flex items-start gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] flex items-center justify-center flex-shrink-0">
                <Sparkles size={20} className="text-white" strokeWidth={2} />
              </div>
              <div>
                <h2
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontWeight: 800,
                    fontSize: "1.4rem",
                    color: "#1E293B",
                    letterSpacing: "-0.02em",
                    marginBottom: "6px",
                  }}
                >
                  Configure Your Mock Interview
                </h2>
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.875rem",
                    color: "#64748B",
                    lineHeight: 1.6,
                  }}
                >
                  Customize your AI interview experience for maximum relevance
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              {/* Job Role Dropdown */}
              <div className="flex flex-col gap-2">
                <label
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    color: "#1E293B",
                  }}
                >
                  <span className="flex items-center gap-2">
                    <Briefcase size={14} strokeWidth={2} className="text-[#64748B]" />
                    Job Role
                    <span className="text-[#EF4444]">*</span>
                  </span>
                </label>
                <div className="relative">
                  <button
                    onClick={() => setRoleOpen(!roleOpen)}
                    className="w-full flex items-center justify-between px-4 py-3.5 border-2 border-[#E2E8F0] rounded-xl bg-[#F8FAFC] hover:border-[#2563EB] transition-colors text-left"
                    style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem" }}
                  >
                    <span style={{ color: selectedRole ? "#1E293B" : "#94A3B8" }}>
                      {selectedRole || "Select your target role..."}
                    </span>
                    <ChevronDown
                      size={18}
                      strokeWidth={2}
                      className={`text-[#64748B] transition-transform duration-200 ${roleOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {roleOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-[#E2E8F0] rounded-xl shadow-2xl z-20 overflow-hidden max-h-64 overflow-y-auto">
                      {jobRoles.map((role) => (
                        <button
                          key={role}
                          onClick={() => {
                            setSelectedRole(role);
                            setRoleOpen(false);
                          }}
                          className="w-full flex items-center justify-between px-4 py-3 hover:bg-[#F8FAFC] text-left transition-colors"
                          style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.875rem", color: "#1E293B" }}
                        >
                          {role}
                          {selectedRole === role && <Check size={16} strokeWidth={2.5} className="text-[#2563EB]" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.75rem",
                    color: "#94A3B8",
                    marginTop: "4px",
                  }}
                >
                  Choose the position you're interviewing for
                </p>
              </div>

              {/* Experience Level */}
              <div className="flex flex-col gap-2">
                <label
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    color: "#1E293B",
                  }}
                >
                  Experience Level
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {experienceLevels.map(({ value, label, desc, color }) => {
                    const isSelected = experience === value;
                    return (
                      <button
                        key={value}
                        onClick={() => setExperience(value)}
                        className="flex flex-col items-center gap-2 py-4 px-3 rounded-xl border-2 transition-all duration-150 hover:shadow-md"
                        style={{
                          borderColor: isSelected ? color : "#E2E8F0",
                          backgroundColor: isSelected ? color + "0D" : "#F8FAFC",
                        }}
                      >
                        <div
                          className="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all"
                          style={{
                            borderColor: isSelected ? color : "#CBD5E1",
                            backgroundColor: isSelected ? color : "transparent",
                          }}
                        >
                          {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                        <span
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 700,
                            fontSize: "0.85rem",
                            color: isSelected ? color : "#475569",
                          }}
                        >
                          {label}
                        </span>
                        <span
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontSize: "0.7rem",
                            color: "#94A3B8",
                          }}
                        >
                          {desc}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Target Company (Optional) */}
              <div className="flex flex-col gap-2">
                <label
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    color: "#1E293B",
                  }}
                >
                  <span className="flex items-center gap-2">
                    <Building2 size={14} strokeWidth={2} className="text-[#64748B]" />
                    Target Company
                    <span
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 400,
                        fontSize: "0.75rem",
                        color: "#94A3B8",
                      }}
                    >
                      (Optional)
                    </span>
                  </span>
                </label>
                <div className="relative">
                  <button
                    onClick={() => setCompanyOpen(!companyOpen)}
                    className="w-full flex items-center justify-between px-4 py-3.5 border-2 border-[#E2E8F0] rounded-xl bg-[#F8FAFC] hover:border-[#2563EB] transition-colors text-left"
                    style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem" }}
                  >
                    <span style={{ color: targetCompany ? "#1E293B" : "#94A3B8" }}>
                      {targetCompany || "Select a company..."}
                    </span>
                    <ChevronDown
                      size={18}
                      strokeWidth={2}
                      className={`text-[#64748B] transition-transform duration-200 ${
                        companyOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {companyOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-[#E2E8F0] rounded-xl shadow-2xl z-20 overflow-hidden max-h-64 overflow-y-auto">
                      {companies.map((company) => (
                        <button
                          key={company}
                          onClick={() => {
                            setTargetCompany(company);
                            setCompanyOpen(false);
                          }}
                          className="w-full flex items-center justify-between px-4 py-3 hover:bg-[#F8FAFC] text-left transition-colors"
                          style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.875rem", color: "#1E293B" }}
                        >
                          {company}
                          {targetCompany === company && (
                            <Check size={16} strokeWidth={2.5} className="text-[#2563EB]" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.75rem",
                    color: "#94A3B8",
                    marginTop: "4px",
                  }}
                >
                  Help us tailor questions to your target company's culture
                </p>
              </div>

              {/* Info Box */}
              <div
                className="flex items-start gap-3 p-4 rounded-xl border border-[#DBEAFE]"
                style={{ backgroundColor: "#EFF6FF" }}
              >
                <Info size={16} className="text-[#2563EB] flex-shrink-0 mt-0.5" strokeWidth={2} />
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.8rem",
                    color: "#1E40AF",
                    lineHeight: 1.6,
                  }}
                >
                  Your interview will include 10 questions based on your selections. You'll have 2 minutes per question
                  to provide your answer.
                </p>
              </div>

              {/* Start Button */}
              <button
                onClick={handleStartInterview}
                disabled={!selectedRole}
                className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-xl text-white transition-all duration-150 mt-4 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 700,
                  fontSize: "1rem",
                  backgroundColor: selectedRole ? "#2563EB" : "#93C5FD",
                  boxShadow: selectedRole ? "0 8px 24px rgba(37,99,235,0.4)" : "none",
                }}
              >
                <Play size={18} strokeWidth={2.5} className="fill-white" />
                Start Interview
                <Sparkles size={16} strokeWidth={2.5} />
              </button>
            </div>
          </div>

          {/* Tips Section */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: "🎯", title: "Be Specific", desc: "Use concrete examples and quantifiable results" },
              { icon: "⏱️", title: "Manage Time", desc: "Use the full 2 minutes but stay on topic" },
              { icon: "💡", title: "Use STAR", desc: "Structure answers: Situation, Task, Action, Result" },
            ].map((tip, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl border border-[#E2E8F0] p-4 flex flex-col items-center text-center gap-2"
              >
                <span className="text-3xl">{tip.icon}</span>
                <h3
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 700,
                    fontSize: "0.875rem",
                    color: "#1E293B",
                  }}
                >
                  {tip.title}
                </h3>
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.75rem",
                    color: "#64748B",
                    lineHeight: 1.5,
                  }}
                >
                  {tip.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
