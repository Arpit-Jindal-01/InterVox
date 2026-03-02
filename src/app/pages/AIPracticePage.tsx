import { Link } from "react-router";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { Sparkles, Target, Brain, TrendingUp, ArrowRight, CheckCircle } from "lucide-react";

export default function AIPracticePage() {
  const features = [
    {
      icon: Sparkles,
      title: "AI-Powered Questions",
      description: "Get tailored interview questions based on your role and experience level",
    },
    {
      icon: Brain,
      title: "Real-time Feedback",
      description: "Receive instant AI analysis on your answers and communication style",
    },
    {
      icon: Target,
      title: "Industry-Specific",
      description: "Practice with questions from top companies in your target industry",
    },
    {
      icon: TrendingUp,
      title: "Track Progress",
      description: "Monitor your improvement over time with detailed analytics",
    },
  ];

  const benefits = [
    "Practice behavioral and technical questions",
    "Get personalized improvement suggestions",
    "Build confidence before the real interview",
    "Access 1000+ interview questions",
    "Simulate real interview conditions",
    "Improve answer structure and delivery",
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#EFF6FF] to-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white border border-[#BFDBFE] rounded-full px-4 py-2 mb-6">
              <Sparkles size={16} className="text-[#2563EB]" />
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  color: "#2563EB",
                }}
              >
                AI-Powered Interview Practice
              </span>
            </div>

            <h1
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 800,
                fontSize: "2.5rem",
                color: "#1E293B",
                letterSpacing: "-0.02em",
                marginBottom: "20px",
                lineHeight: 1.2,
              }}
            >
              Master Your Interviews with AI
            </h1>

            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "1.125rem",
                color: "#64748B",
                lineHeight: 1.7,
                marginBottom: "32px",
              }}
            >
              Practice with our advanced AI interviewer that adapts to your responses,
              provides real-time feedback, and helps you ace your next job interview.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/dashboard"
                className="flex items-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-7 py-3.5 rounded-xl transition-all shadow-lg shadow-blue-500/25 hover:-translate-y-0.5"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                }}
              >
                <Sparkles size={18} strokeWidth={2} />
                Start AI Practice
              </Link>
              <a
                href="#features"
                className="flex items-center gap-2 bg-white border-2 border-[#E2E8F0] hover:border-[#2563EB] text-[#1E293B] px-7 py-3.5 rounded-xl transition-all"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                }}
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 800,
                fontSize: "2rem",
                color: "#1E293B",
                letterSpacing: "-0.02em",
                marginBottom: "16px",
              }}
            >
              Why Choose AI Interview Practice?
            </h2>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "1rem",
                color: "#64748B",
                lineHeight: 1.7,
              }}
            >
              Experience the most advanced AI-powered interview preparation platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="bg-white border border-[#E2E8F0] rounded-2xl p-6 hover:shadow-lg hover:border-[#BFDBFE] transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#EFF6FF] flex items-center justify-center mb-4">
                    <Icon size={20} className="text-[#2563EB]" strokeWidth={2} />
                  </div>
                  <h3
                    style={{
                      fontFamily: "'Montserrat', sans-serif",
                      fontWeight: 700,
                      fontSize: "1.125rem",
                      color: "#1E293B",
                      marginBottom: "12px",
                    }}
                  >
                    {feature.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "0.875rem",
                      color: "#64748B",
                      lineHeight: 1.7,
                    }}
                  >
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 lg:py-24 bg-[#F9FAFB]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 800,
                  fontSize: "2rem",
                  color: "#1E293B",
                  letterSpacing: "-0.02em",
                  marginBottom: "20px",
                }}
              >
                Everything You Need to Succeed
              </h2>
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "1rem",
                  color: "#64748B",
                  lineHeight: 1.7,
                  marginBottom: "32px",
                }}
              >
                Our AI interview practice platform provides comprehensive preparation
                tools to help you land your dream job.
              </p>

              <div className="space-y-4">
                {benefits.map((benefit) => (
                  <div key={benefit} className="flex items-start gap-3">
                    <CheckCircle size={20} className="text-[#10B981] flex-shrink-0 mt-0.5" strokeWidth={2} />
                    <p
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "0.9rem",
                        color: "#475569",
                        lineHeight: 1.7,
                      }}
                    >
                      {benefit}
                    </p>
                  </div>
                ))}
              </div>

              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-7 py-3.5 rounded-xl transition-all shadow-lg shadow-blue-500/25 hover:-translate-y-0.5 mt-8"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                }}
              >
                Get Started Now
                <ArrowRight size={18} strokeWidth={2} />
              </Link>
            </div>

            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800"
                alt="Professional practicing interview"
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
