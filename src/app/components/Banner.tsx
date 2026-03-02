import { Zap, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { AnimatedCounter } from "./AnimatedCounter";

export function Banner() {
  const stats = [
    { value: "500+", label: "Interview questions" },
    { value: "95%", label: "User satisfaction" },
    { value: "3×", label: "Faster preparation" },
  ];

  return (
    <section className="bg-gradient-to-r from-[#EFF6FF] via-[#DBEAFE] to-[#EFF6FF] border-y border-[#BFDBFE] py-16 lg:py-20 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full bg-[#2563EB]/5 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-[#2563EB]/8 blur-3xl" />
        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(circle, #2563EB 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      <div className="max-w-4xl mx-auto px-6 lg:px-8 relative text-center flex flex-col items-center gap-6">
        {/* Icon badge */}
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, type: "spring" }}
          className="w-12 h-12 rounded-xl bg-[#2563EB] flex items-center justify-center shadow-lg shadow-blue-200"
        >
          <Zap size={22} className="text-white fill-white" />
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-3"
        >
          <h2
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 800,
              fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
              lineHeight: 1.2,
              letterSpacing: "-0.025em",
              color: "#1E293B",
            }}
          >
            Interview Coming Up?{" "}
            <span className="text-[#2563EB]">Feeling Unprepared?</span>
          </h2>

          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 400,
              fontSize: "1.0625rem",
              lineHeight: 1.7,
              color: "#475569",
            }}
            className="max-w-xl mx-auto"
          >
            Our AI platform helps you master interviews — from behavioral questions to technical deep-dives. Practice anytime, anywhere, with real feedback.
          </p>
        </motion.div>

        {/* Stats row */}
        <div className="flex flex-wrap items-center justify-center gap-8 py-2">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex flex-col items-center gap-1"
            >
              <span
                style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: "1.5rem", color: "#2563EB" }}
              >
                <AnimatedCounter value={stat.value} />
              </span>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", color: "#64748B" }}>
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>

        {/* CTA Button */}
        <motion.a
          href="#"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.05, y: -2 }}
          transition={{ duration: 0.3 }}
          style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}
          className="flex items-center gap-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-8 py-3.5 rounded-xl shadow-lg shadow-blue-200 hover:shadow-blue-300 text-sm group"
        >
          Try AI Mock Interview!
          <motion.div
            className="transition-transform duration-150 group-hover:translate-x-1"
            style={{ width: 16, height: 16 }}
          >
            <ArrowRight size={16} strokeWidth={2.5} />
          </motion.div>
        </motion.a>

        {/* Fine print */}
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", color: "#94A3B8" }}>
          No credit card required · Free to start · Cancel anytime
        </p>
      </div>
    </section>
  );
}