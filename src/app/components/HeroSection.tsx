import { Sparkles, Play, Mic, Video, MessageSquare, Star, ChevronRight } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Link } from "react-router";
import { motion } from "motion/react";
import { NeuralNetwork } from "./NeuralNetwork";
import { MagneticButton } from "./MagneticButton";
import { WordReveal } from "./WordReveal";

const interviewImage = "https://images.unsplash.com/photo-1622131072758-dc5b5c4cca6e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvbmxpbmUlMjBpbnRlcnZpZXclMjBjb2FjaGluZyUyMGFwcCUyMGludGVyZmFjZXxlbnwxfHx8fDE3NzI0NDY1NjZ8MA&ixlib=rb-4.1.0&q=80&w=1080";

export function HeroSection() {
  return (
    <section className="bg-white pt-16 pb-12 lg:pt-24 lg:pb-20 overflow-hidden relative">
      {/* Neural Network Background */}
      <div className="absolute inset-0 pointer-events-none">
        <NeuralNetwork />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left Content */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col gap-8"
          >
            {/* Pill Tag */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center gap-2 w-fit"
            >
              <span className="flex items-center gap-2 bg-[#EFF6FF] text-[#2563EB] text-xs px-4 py-1.5 rounded-full border border-[#BFDBFE]"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, letterSpacing: "0.02em" }}>
                <Sparkles size={12} strokeWidth={2.5} />
                AI Powered Interview
              </span>
            </motion.div>

            {/* H1 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col gap-4"
            >
              <h1
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 800,
                  fontSize: "clamp(2rem, 4vw, 3.25rem)",
                  lineHeight: 1.15,
                  letterSpacing: "-0.03em",
                  color: "#1E293B",
                }}
              >
                What if you could{" "}
                <span className="text-[#2563EB]">train with an AI Interviewer</span>{" "}
                today?
              </h1>

              {/* Subtext */}
              <p
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400, fontSize: "1.0625rem", lineHeight: 1.7 }}
                className="text-[#64748B] max-w-md"
              >
                Get instant feedback, refine your answers, and boost confidence. Say hello to smarter preparation.
              </p>
            </motion.div>

            {/* Social Proof */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex items-center gap-3"
            >
              <div className="flex -space-x-2">
                {["#2563EB", "#7C3AED", "#059669", "#DC2626"].map((color, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.6 + i * 0.1 }}
                    className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white text-xs"
                    style={{ backgroundColor: color, fontWeight: 700 }}
                  >
                    {["J", "A", "M", "S"][i]}
                  </motion.div>
                ))}
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={11} className="fill-[#F59E0B] text-[#F59E0B]" />
                  ))}
                </div>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", color: "#64748B" }}>
                  Loved by <strong style={{ color: "#1E293B" }}>2,400+</strong> job seekers
                </span>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="flex flex-wrap items-center gap-4"
            >
              <Link
                to="/ai-practice"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}
                className="flex items-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-6 py-3 rounded-xl transition-all duration-150 shadow-lg shadow-blue-200 hover:shadow-blue-300 hover:-translate-y-0.5 text-sm"
              >
                <Play size={14} strokeWidth={2.5} className="fill-white" />
                Try AI Mock Interview!
              </Link>
              <Link
                to="/communication-practice"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}
                className="flex items-center gap-2 border-2 border-[#2563EB] text-[#2563EB] hover:bg-[#EFF6FF] px-6 py-3 rounded-xl transition-all duration-150 text-sm"
              >
                <Mic size={14} strokeWidth={2.5} />
                Communication Practice
                <ChevronRight size={14} strokeWidth={2.5} />
              </Link>
            </motion.div>

            {/* Feature tags */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="flex flex-wrap gap-2"
            >
              {["No credit card required", "Free 5 mock sessions", "Instant AI feedback"].map((tag, i) => (
                <motion.span
                  key={tag}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 1 + i * 0.1 }}
                  style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: "0.75rem" }}
                  className="flex items-center gap-1.5 text-[#475569] bg-[#F8FAFC] border border-[#E2E8F0] px-3 py-1 rounded-full"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                  {tag}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Side — UI Mockup */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="relative flex items-center justify-center lg:justify-end"
          >
            {/* Decorative background blob */}
            <motion.div 
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.6, 0.4, 0.6]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <div className="w-[420px] h-[420px] rounded-full bg-[#EFF6FF] blur-3xl opacity-60" />
            </motion.div>

            {/* Main mockup card */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative w-full max-w-[520px] rounded-2xl overflow-hidden shadow-2xl border border-[#E2E8F0]"
            >
              {/* Window bar */}
              <div className="bg-[#1E293B] px-4 py-3 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#EF4444]" />
                <span className="w-3 h-3 rounded-full bg-[#F59E0B]" />
                <span className="w-3 h-3 rounded-full bg-[#22C55E]" />
                <div className="flex-1 mx-4 bg-[#334155] rounded-md px-3 py-1 flex items-center">
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.65rem", color: "#94A3B8" }}>
                    app.intervox.ai/interview
                  </span>
                </div>
              </div>

              {/* Mock interview interface */}
              <div className="bg-[#0F172A] p-4 relative">
                <ImageWithFallback
                  src={interviewImage}
                  alt="AI Mock Interview UI"
                  className="w-full h-56 object-cover rounded-xl opacity-80"
                />

                {/* Overlay UI elements */}
                <div className="absolute top-8 left-8 right-8 flex items-start justify-between">
                  {/* AI Coach tag */}
                  <div className="flex items-center gap-2 bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full border border-white/20"
                    style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>
                    <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
                    AI Coach • Live
                  </div>
                  {/* Timer */}
                  <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full border border-white/20"
                    style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>
                    <Video size={11} />
                    02:34
                  </div>
                </div>
              </div>

              {/* Bottom panel */}
              <div className="bg-[#0F172A] border-t border-[#1E293B] px-4 pb-4">
                {/* Question bubble */}
                <div className="bg-[#1E293B] rounded-xl p-4 mb-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#2563EB] flex items-center justify-center flex-shrink-0">
                      <Sparkles size={14} className="text-white" />
                    </div>
                    <div>
                      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", fontWeight: 600, color: "#94A3B8", marginBottom: "4px" }}>
                        AI Interviewer
                      </p>
                      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", color: "#E2E8F0", lineHeight: 1.5 }}>
                        "Tell me about a time you handled a challenging project under a tight deadline."
                      </p>
                    </div>
                  </div>
                </div>

                {/* Feedback bar */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex-1 bg-[#1E293B] rounded-lg p-2.5 flex items-center gap-2">
                    <MessageSquare size={12} className="text-[#2563EB]" />
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", color: "#64748B" }}>
                      Your answer is being analyzed...
                    </span>
                    <div className="ml-auto flex gap-0.5">
                      {[40, 70, 55, 85, 65, 90, 75].map((h, i) => (
                        <motion.div 
                          key={i} 
                          animate={{ height: [`${h * 0.2}px`, `${h * 0.15}px`, `${h * 0.2}px`] }}
                          transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
                          className="w-1 rounded-full bg-[#2563EB] opacity-70" 
                          style={{ height: `${h * 0.2}px` }} 
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Score chips */}
                <div className="flex items-center gap-2">
                  {[
                    { label: "Clarity", score: "8.5", color: "#22C55E" },
                    { label: "Confidence", score: "7.2", color: "#F59E0B" },
                    { label: "Structure", score: "9.0", color: "#2563EB" },
                  ].map((item) => (
                    <div key={item.label} className="flex-1 bg-[#1E293B] rounded-lg p-2 text-center">
                      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.65rem", color: "#64748B" }}>{item.label}</div>
                      <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.875rem", fontWeight: 700, color: item.color }}>
                        {item.score}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Floating badges */}
            <motion.div 
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              whileHover={{ scale: 1.05 }}
              className="absolute -left-4 top-1/4 bg-white rounded-xl shadow-xl border border-[#E2E8F0] px-4 py-3 hidden xl:flex items-center gap-3"
            >
              <div className="w-9 h-9 rounded-lg bg-[#EFF6FF] flex items-center justify-center">
                <Sparkles size={16} className="text-[#2563EB]" />
              </div>
              <div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", fontWeight: 700, color: "#1E293B" }}>Instant Feedback</div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.65rem", color: "#64748B" }}>Real-time AI analysis</div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
              whileHover={{ scale: 1.05 }}
              className="absolute -right-2 bottom-1/4 bg-white rounded-xl shadow-xl border border-[#E2E8F0] px-4 py-3 hidden xl:flex items-center gap-3"
            >
              <div className="w-9 h-9 rounded-lg bg-[#F0FDF4] flex items-center justify-center">
                <Star size={16} className="text-[#22C55E] fill-[#22C55E]" />
              </div>
              <div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", fontWeight: 700, color: "#1E293B" }}>Score: 87%</div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.65rem", color: "#64748B" }}>Great performance!</div>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}