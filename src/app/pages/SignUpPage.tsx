import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Eye, EyeOff, Mail, Lock, User, Phone, AlertCircle, Check } from "lucide-react";
import { motion } from "motion/react";
import { Logo } from "../components/Logo";
import { GlobalBackground } from "../components/GlobalBackground";
import { CursorGlow } from "../components/CursorGlow";
import { useAuth } from "../context/AuthContext";

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [localError, setLocalError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate();
  const { register, loading, error: authError } = useAuth();

  const calculatePasswordStrength = (pwd: string) => {
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++;
    if (/\d/.test(pwd)) strength++;
    if (/[!@#$%^&*]/.test(pwd)) strength++;
    setPasswordStrength(strength);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === "password") {
      calculatePasswordStrength(value);
    }
  };

  const validateForm = (): boolean => {
    setLocalError("");

    if (!formData.fullName.trim()) {
      setLocalError("Full name is required");
      return false;
    }

    if (!formData.email.trim()) {
      setLocalError("Email is required");
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setLocalError("Please enter a valid email");
      return false;
    }

    if (!formData.password) {
      setLocalError("Password is required");
      return false;
    }

    if (formData.password.length < 8) {
      setLocalError("Password must be at least 8 characters");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setLocalError("Passwords do not match");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await register(
        formData.email,
        formData.password,
        formData.fullName,
        formData.phone || undefined
      );
      navigate("/dashboard");
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : "Registration failed");
    }
  };

  const displayError = localError || authError;
  const strengthLabels = ["Weak", "Fair", "Good", "Strong", "Very Strong"];
  const strengthColors = ["#EF4444", "#F97316", "#EAB308", "#22C55E", "#16A34A"];

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 relative">
      <GlobalBackground />
      <CursorGlow />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link to="/">
            <Logo className="h-12" />
          </Link>
        </div>

        {/* Sign Up Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-[#E2E8F0] p-8">
          <div className="text-center mb-8">
            <h1
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 800,
                fontSize: "2rem",
                color: "#1E293B",
                letterSpacing: "-0.02em",
                marginBottom: "12px",
              }}
            >
              Create Account
            </h1>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.9rem",
                color: "#64748B",
                lineHeight: 1.7,
              }}
            >
              Join InterVox and start practicing interviews today
            </p>
          </div>

          {/* Error Alert */}
          {displayError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
              <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={18} />
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.875rem",
                  color: "#DC2626",
                }}
              >
                {displayError}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name Field */}
            <div>
              <label
                htmlFor="fullName"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  color: "#1E293B",
                  display: "block",
                  marginBottom: "8px",
                }}
              >
                Full Name
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]">
                  <User size={18} strokeWidth={2} />
                </div>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  required
                  className="w-full pl-11 pr-4 py-3 border-2 border-[#E2E8F0] rounded-xl outline-none focus:border-[#2563EB] transition-colors"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.9rem",
                  }}
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  color: "#1E293B",
                  display: "block",
                  marginBottom: "8px",
                }}
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]">
                  <Mail size={18} strokeWidth={2} />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="you@example.com"
                  required
                  className="w-full pl-11 pr-4 py-3 border-2 border-[#E2E8F0] rounded-xl outline-none focus:border-[#2563EB] transition-colors"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.9rem",
                  }}
                />
              </div>
            </div>

            {/* Phone Field (Optional) */}
            <div>
              <label
                htmlFor="phone"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  color: "#1E293B",
                  display: "block",
                  marginBottom: "8px",
                }}
              >
                Phone (Optional)
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]">
                  <Phone size={18} strokeWidth={2} />
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+1 (555) 000-0000"
                  className="w-full pl-11 pr-4 py-3 border-2 border-[#E2E8F0] rounded-xl outline-none focus:border-[#2563EB] transition-colors"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.9rem",
                  }}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  color: "#1E293B",
                  display: "block",
                  marginBottom: "8px",
                }}
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]">
                  <Lock size={18} strokeWidth={2} />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  required
                  className="w-full pl-11 pr-12 py-3 border-2 border-[#E2E8F0] rounded-xl outline-none focus:border-[#2563EB] transition-colors"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.9rem",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#2563EB] transition-colors"
                >
                  {showPassword ? <EyeOff size={18} strokeWidth={2} /> : <Eye size={18} strokeWidth={2} />}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-2 space-y-2">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="flex-1 h-1 rounded-full bg-[#E2E8F0]"
                        style={{
                          backgroundColor: i < passwordStrength ? strengthColors[passwordStrength - 1] : "#E2E8F0",
                        }}
                      />
                    ))}
                  </div>
                  <p
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "0.75rem",
                      color: strengthColors[Math.max(0, passwordStrength - 1)],
                      fontWeight: 600,
                    }}
                  >
                    Password strength: {strengthLabels[Math.max(0, passwordStrength - 1)]}
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label
                htmlFor="confirmPassword"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  color: "#1E293B",
                  display: "block",
                  marginBottom: "8px",
                }}
              >
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]">
                  <Lock size={18} strokeWidth={2} />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  required
                  className="w-full pl-11 pr-12 py-3 border-2 border-[#E2E8F0] rounded-xl outline-none focus:border-[#2563EB] transition-colors"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.9rem",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#2563EB] transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={18} strokeWidth={2} /> : <Eye size={18} strokeWidth={2} />}
                </button>
              </div>

              {/* Password Match Indicator */}
              {formData.confirmPassword && (
                <div className="mt-2 flex items-center gap-2">
                  {formData.password === formData.confirmPassword ? (
                    <>
                      <Check size={16} className="text-green-500" />
                      <p
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: "0.75rem",
                          color: "#16A34A",
                        }}
                      >
                        Passwords match
                      </p>
                    </>
                  ) : (
                    <>
                      <AlertCircle size={16} className="text-red-500" />
                      <p
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: "0.75rem",
                          color: "#DC2626",
                        }}
                      >
                        Passwords do not match
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Terms Checkbox */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                required
                className="w-4 h-4 rounded border-2 border-[#E2E8F0] text-[#2563EB] focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-0 mt-1"
              />
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.875rem",
                  color: "#64748B",
                  lineHeight: 1.5,
                }}
              >
                I agree to the{" "}
                <a href="#" className="text-[#2563EB] font-semibold hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-[#2563EB] font-semibold hover:underline">
                  Privacy Policy
                </a>
              </span>
            </label>

            {/* Sign Up Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] disabled:bg-[#94A3B8] text-white py-3.5 rounded-xl transition-all shadow-lg shadow-blue-500/25 hover:-translate-y-0.5 disabled:hover:translate-y-0"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                fontSize: "0.95rem",
              }}
            >
              {loading ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  <Check size={18} strokeWidth={2} />
                  Create Account
                </>
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="text-center mt-6">
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.875rem",
                color: "#64748B",
              }}
            >
              Already have an account?{" "}
              <Link
                to="/signin"
                style={{
                  color: "#2563EB",
                  fontWeight: 600,
                }}
                className="hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link
            to="/"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.875rem",
              color: "#64748B",
              fontWeight: 500,
            }}
            className="hover:text-[#2563EB] transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
