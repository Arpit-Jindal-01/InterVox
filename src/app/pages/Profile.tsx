import { useState } from "react";
import { UserCircle, Upload, Save, Mail, Phone, User, Briefcase, Award } from "lucide-react";

export default function Profile() {
  const [formData, setFormData] = useState({
    fullName: "Alex Johnson",
    email: "alex.johnson@email.com",
    phone: "+1 (555) 123-4567",
    targetRole: "Software Engineer",
    experienceLevel: "Mid Level",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // Save logic here
    alert("Profile updated successfully!");
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#F9FAFB]">
      {/* Header */}
      <header className="bg-white border-b border-[#E2E8F0] px-6 lg:px-8 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] flex items-center justify-center">
              <UserCircle size={18} className="text-[#2563EB]" strokeWidth={2} />
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
              My Profile
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
            Manage your personal information and career goals
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div className="px-6 lg:px-8 py-8 max-w-4xl mx-auto">
        {/* Avatar Section */}
        <div
          className="bg-white rounded-2xl border border-[#E2E8F0] p-6 mb-6"
          style={{ boxShadow: "0 1px 12px rgba(0,0,0,0.05)" }}
        >
          <h2
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 700,
              fontSize: "1.1rem",
              color: "#1E293B",
              marginBottom: "20px",
            }}
          >
            Profile Picture
          </h2>

          <div className="flex items-center gap-6">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1740174459726-8c57d8366061?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200"
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-4 border-[#E2E8F0]"
              />
              <div className="absolute bottom-0 right-0 w-8 h-8 bg-[#2563EB] rounded-full flex items-center justify-center border-4 border-white">
                <UserCircle size={14} className="text-white" strokeWidth={2.5} />
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.875rem",
                  color: "#64748B",
                  lineHeight: 1.6,
                }}
              >
                Upload a new profile photo. Recommended size: 400x400px
              </p>
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-[#2563EB] text-[#2563EB] hover:bg-[#EFF6FF] transition-colors w-fit"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                }}
              >
                <Upload size={16} strokeWidth={2} />
                Upload new photo
              </button>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div
          className="bg-white rounded-2xl border border-[#E2E8F0] p-6 mb-6"
          style={{ boxShadow: "0 1px 12px rgba(0,0,0,0.05)" }}
        >
          <h2
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 700,
              fontSize: "1.1rem",
              color: "#1E293B",
              marginBottom: "20px",
            }}
          >
            Personal Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Full Name */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="fullName"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  color: "#475569",
                }}
              >
                <User size={14} className="inline mr-2" strokeWidth={2} />
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                value={formData.fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-[#1E293B] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#BFDBFE] transition-all"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.875rem",
                }}
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="email"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  color: "#475569",
                }}
              >
                <Mail size={14} className="inline mr-2" strokeWidth={2} />
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-[#1E293B] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#BFDBFE] transition-all"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.875rem",
                }}
              />
            </div>

            {/* Phone Number */}
            <div className="flex flex-col gap-2 md:col-span-2">
              <label
                htmlFor="phone"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  color: "#475569",
                }}
              >
                <Phone size={14} className="inline mr-2" strokeWidth={2} />
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-[#1E293B] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#BFDBFE] transition-all"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.875rem",
                }}
              />
            </div>
          </div>
        </div>

        {/* Career Goals */}
        <div
          className="bg-white rounded-2xl border border-[#E2E8F0] p-6 mb-6"
          style={{ boxShadow: "0 1px 12px rgba(0,0,0,0.05)" }}
        >
          <h2
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 700,
              fontSize: "1.1rem",
              color: "#1E293B",
              marginBottom: "20px",
            }}
          >
            Career Goals
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Target Job Role */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="targetRole"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  color: "#475569",
                }}
              >
                <Briefcase size={14} className="inline mr-2" strokeWidth={2} />
                Target Job Role
              </label>
              <select
                id="targetRole"
                value={formData.targetRole}
                onChange={(e) => handleChange("targetRole", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-[#1E293B] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#BFDBFE] transition-all cursor-pointer"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.875rem",
                }}
              >
                <option value="Software Engineer">Software Engineer</option>
                <option value="Product Manager">Product Manager</option>
                <option value="Data Analyst">Data Analyst</option>
                <option value="UX Designer">UX Designer</option>
                <option value="Frontend Developer">Frontend Developer</option>
                <option value="Backend Developer">Backend Developer</option>
                <option value="Full Stack Developer">Full Stack Developer</option>
                <option value="DevOps Engineer">DevOps Engineer</option>
              </select>
            </div>

            {/* Experience Level */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="experienceLevel"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  color: "#475569",
                }}
              >
                <Award size={14} className="inline mr-2" strokeWidth={2} />
                Experience Level
              </label>
              <select
                id="experienceLevel"
                value={formData.experienceLevel}
                onChange={(e) => handleChange("experienceLevel", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-[#1E293B] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#BFDBFE] transition-all cursor-pointer"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.875rem",
                }}
              >
                <option value="Fresher">Fresher (0-1 years)</option>
                <option value="Mid Level">Mid Level (2-5 years)</option>
                <option value="Senior">Senior (5+ years)</option>
                <option value="Lead">Lead/Principal</option>
              </select>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white transition-all hover:-translate-y-0.5"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
              fontSize: "0.875rem",
              boxShadow: "0 4px 12px rgba(37,99,235,0.25)",
            }}
          >
            <Save size={16} strokeWidth={2} />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
