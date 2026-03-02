import { GraduationCap, Briefcase, Award, ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";
import Tilt from "react-parallax-tilt";

const features = [
  {
    icon: GraduationCap,
    tag: "For Beginners",
    title: "Internship Preparation",
    description:
      "Kickstart your career journey with curated entry-level interview simulations. Build confidence with HR rounds, aptitude prep, and campus placement practice.",
    color: "#7C3AED",
    bgColor: "#F5F3FF",
    borderColor: "#EDE9FE",
    points: [
      "Campus & HR round simulations",
      "Soft skills & communication drills",
      "Resume walkthrough practice",
      "Group discussion coaching",
    ],
    badge: "Most Popular for Students",
  },
  {
    icon: Briefcase,
    tag: "For New Joinees",
    title: "Fresher Job Preparation",
    description:
      "Land your first full-time role with targeted practice for technical screenings, behavioral rounds, and role-specific mock sessions designed for freshers.",
    color: "#2563EB",
    bgColor: "#EFF6FF",
    borderColor: "#BFDBFE",
    points: [
      "Technical & coding interview prep",
      "Behavioral (STAR method) coaching",
      "Industry-specific question banks",
      "Instant AI feedback on answers",
    ],
    badge: "Trending This Week",
    highlighted: true,
  },
  {
    icon: Award,
    tag: "For Experienced",
    title: "Experienced Job Prep",
    description:
      "Level up to senior roles with advanced case study simulations, leadership scenario practice, and negotiation coaching tailored for seasoned professionals.",
    color: "#0891B2",
    bgColor: "#ECFEFF",
    borderColor: "#A5F3FC",
    points: [
      "Senior & leadership round prep",
      "Case study & scenario questions",
      "Salary negotiation coaching",
      "Executive presence training",
    ],
    badge: "For Senior Roles",
  },
];

export function FeaturesGrid() {
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 flex flex-col items-center gap-4">
          <span
            className="inline-flex items-center gap-2 text-[#2563EB] bg-[#EFF6FF] border border-[#BFDBFE] px-4 py-1.5 rounded-full text-xs"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase" }}
          >
            Career-Level Tracks
          </span>
          <h2
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 800,
              fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)",
              lineHeight: 1.2,
              letterSpacing: "-0.025em",
              color: "#1E293B",
            }}
          >
            Mock Interviews for{" "}
            <span className="text-[#2563EB]">All Career Levels</span>
          </h2>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.9375rem",
              lineHeight: 1.7,
              color: "#64748B",
            }}
          >
            Whether you're just starting out or chasing that next big role, InterVox has a tailored path for you.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-start">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Tilt
                key={feature.title}
                tiltMaxAngleX={10}
                tiltMaxAngleY={10}
                perspective={1000}
                scale={1.05}
                className="relative flex flex-col rounded-2xl border p-8 transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl group"
                style={{
                  backgroundColor: feature.highlighted ? feature.color : "#FFFFFF",
                  borderColor: feature.highlighted ? feature.color : "#E2E8F0",
                  boxShadow: feature.highlighted
                    ? "0 20px 60px rgba(37,99,235,0.25)"
                    : "0 4px 24px rgba(0,0,0,0.06)",
                }}
              >
                {/* Badge */}
                <div className="absolute -top-3 left-6">
                  <span
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 700,
                      backgroundColor: feature.highlighted ? "#1D4ED8" : feature.bgColor,
                      color: feature.highlighted ? "#BFDBFE" : feature.color,
                      border: `1px solid ${feature.highlighted ? "#1E40AF" : feature.borderColor}`,
                    }}
                  >
                    {feature.badge}
                  </span>
                </div>

                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                  style={{
                    backgroundColor: feature.highlighted ? "rgba(255,255,255,0.15)" : feature.bgColor,
                  }}
                >
                  <Icon
                    size={22}
                    strokeWidth={2}
                    style={{ color: feature.highlighted ? "#FFFFFF" : feature.color }}
                  />
                </div>

                {/* Tag */}
                <span
                  className="text-xs mb-2 block"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 600,
                    color: feature.highlighted ? "rgba(255,255,255,0.65)" : feature.color,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  {feature.tag}
                </span>

                {/* Title */}
                <h3
                  className="mb-3"
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontWeight: 700,
                    fontSize: "1.25rem",
                    lineHeight: 1.3,
                    color: feature.highlighted ? "#FFFFFF" : "#1E293B",
                  }}
                >
                  {feature.title}
                </h3>

                {/* Description */}
                <p
                  className="mb-6"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.875rem",
                    lineHeight: 1.7,
                    color: feature.highlighted ? "rgba(255,255,255,0.75)" : "#64748B",
                  }}
                >
                  {feature.description}
                </p>

                {/* Bullet Points */}
                <ul className="flex flex-col gap-2.5 mb-8">
                  {feature.points.map((point) => (
                    <li key={point} className="flex items-start gap-2.5">
                      <CheckCircle2
                        size={15}
                        strokeWidth={2.5}
                        className="flex-shrink-0 mt-0.5"
                        style={{ color: feature.highlighted ? "#93C5FD" : feature.color }}
                      />
                      <span
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: "0.8125rem",
                          color: feature.highlighted ? "rgba(255,255,255,0.8)" : "#475569",
                        }}
                      >
                        {point}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <div className="mt-auto">
                  <a
                    href="#"
                    className="flex items-center gap-2 text-sm group/link"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 600,
                      color: feature.highlighted ? "#FFFFFF" : feature.color,
                    }}
                  >
                    Start Practicing
                    <ArrowRight
                      size={15}
                      strokeWidth={2.5}
                      className="transition-transform duration-150 group-hover/link:translate-x-1"
                    />
                  </a>
                </div>
              </Tilt>
            );
          })}
        </div>
      </div>
    </section>
  );
}