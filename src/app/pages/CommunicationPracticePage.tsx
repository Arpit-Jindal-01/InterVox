import { Link } from "react-router";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { MessageSquare, Mic, Video, Users, ArrowRight, CheckCircle } from "lucide-react";

export default function CommunicationPracticePage() {
  const features = [
    {
      icon: Mic,
      title: "Voice Analysis",
      description: "Get feedback on your tone, pace, clarity, and filler words",
    },
    {
      icon: Video,
      title: "Body Language",
      description: "Improve your non-verbal communication and presentation skills",
    },
    {
      icon: MessageSquare,
      title: "Answer Structure",
      description: "Learn to organize your thoughts and deliver clear, concise answers",
    },
    {
      icon: Users,
      title: "Soft Skills",
      description: "Build confidence, active listening, and professional communication",
    },
  ];

  const skills = [
    "Professional speech patterns",
    "Confident body language",
    "Active listening techniques",
    "Clear articulation",
    "Eliminating filler words",
    "Effective storytelling",
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#F0F9FF] to-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white border border-[#BAE6FD] rounded-full px-4 py-2 mb-6">
              <MessageSquare size={16} className="text-[#0EA5E9]" />
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  color: "#0EA5E9",
                }}
              >
                Communication Practice
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
              Perfect Your Communication Skills
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
              Master the art of professional communication with real-time feedback on your
              voice, body language, and delivery. Build confidence that sets you apart.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/dashboard"
                className="flex items-center gap-2 bg-[#0EA5E9] hover:bg-[#0284C7] text-white px-7 py-3.5 rounded-xl transition-all shadow-lg shadow-cyan-500/25 hover:-translate-y-0.5"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                }}
              >
                <Mic size={18} strokeWidth={2} />
                Start Practicing
              </Link>
              <a
                href="#features"
                className="flex items-center gap-2 bg-white border-2 border-[#E2E8F0] hover:border-[#0EA5E9] text-[#1E293B] px-7 py-3.5 rounded-xl transition-all"
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
              Comprehensive Communication Training
            </h2>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "1rem",
                color: "#64748B",
                lineHeight: 1.7,
              }}
            >
              Develop the communication skills that employers value most
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="bg-white border border-[#E2E8F0] rounded-2xl p-6 hover:shadow-lg hover:border-[#BAE6FD] transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#F0F9FF] flex items-center justify-center mb-4">
                    <Icon size={20} className="text-[#0EA5E9]" strokeWidth={2} />
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

      {/* Skills Section */}
      <section className="py-16 lg:py-24 bg-[#F9FAFB]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1556761175-b413da4baf72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800"
                alt="Professional communication training"
                className="rounded-2xl shadow-2xl"
              />
            </div>

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
                Skills You'll Master
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
                Build the communication skills that will help you stand out in interviews
                and advance your career.
              </p>

              <div className="space-y-4">
                {skills.map((skill) => (
                  <div key={skill} className="flex items-start gap-3">
                    <CheckCircle size={20} className="text-[#0EA5E9] flex-shrink-0 mt-0.5" strokeWidth={2} />
                    <p
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "0.9rem",
                        color: "#475569",
                        lineHeight: 1.7,
                      }}
                    >
                      {skill}
                    </p>
                  </div>
                ))}
              </div>

              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 bg-[#0EA5E9] hover:bg-[#0284C7] text-white px-7 py-3.5 rounded-xl transition-all shadow-lg shadow-cyan-500/25 hover:-translate-y-0.5 mt-8"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                }}
              >
                Start Training Now
                <ArrowRight size={18} strokeWidth={2} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
