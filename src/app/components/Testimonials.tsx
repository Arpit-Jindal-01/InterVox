import { Star, Quote } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const avatars = {
  priya: "https://images.unsplash.com/photo-1762522921456-cdfe882d36c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMHNtaWxpbmclMjBoZWFkc2hvdCUyMHBvcnRyYWl0fGVufDF8fHx8MTc3MjM4OTYzOHww&ixlib=rb-4.1.0&q=80&w=400",
  james: "https://images.unsplash.com/photo-1769636930047-4478f12cf430?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtYW4lMjBjb25maWRlbnQlMjBoZWFkc2hvdHxlbnwxfHx8fDE3NzI0NDY3NTR8MA&ixlib=rb-4.1.0&q=80&w=400",
  sofia: "https://images.unsplash.com/photo-1630939687530-241d630735df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHdvbWFuJTIwb2ZmaWNlJTIwd29ya2VyJTIwc21pbGluZ3xlbnwxfHx8fDE3NzI0NDY3NTR8MA&ixlib=rb-4.1.0&q=80&w=400",
  marcus: "https://images.unsplash.com/photo-1752859951149-7d3fc700a7ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjBzb2Z0d2FyZSUyMGRldmVsb3BlciUyMHBvcnRyYWl0fGVufDF8fHx8MTc3MjM3MjkxNnww&ixlib=rb-4.1.0&q=80&w=400",
};

const reviews = [
  {
    name: "Priya Sharma",
    handle: "@priya_careerwin",
    avatar: avatars.priya,
    role: "Software Engineer @ Google",
    rating: 5,
    text: "The AI HR Manager on InterVox is absolutely next level. It didn't just ask questions — it called me out when I was being vague and guided me to structure my answers better. After 8 sessions, I walked into my Google interview and felt completely calm. Got the offer!",
    accent: "#7C3AED",
    bg: "#FAFAFE",
    highlight: true,
  },
  {
    name: "James O'Brien",
    handle: "@james_dev",
    avatar: avatars.james,
    role: "Product Manager @ Stripe",
    rating: 5,
    text: "I was skeptical that an AI could actually simulate a real interview. InterVox proved me wrong. The feedback on my communication and confidence levels was stunningly accurate. It's like having a personal interview coach available 24/7.",
    accent: "#2563EB",
    bg: "#FAFCFF",
  },
  {
    name: "Sofia Alvarez",
    handle: "@sofiaalvarez_hr",
    avatar: avatars.sofia,
    role: "HR Specialist @ Deloitte",
    rating: 5,
    text: "As someone who works in HR, I was impressed by how realistic the AI interviewer was. The questions were spot on for behavioral rounds. Even I learned something about structuring answers using the STAR method feedback. Highly recommend for freshers!",
    accent: "#0891B2",
    bg: "#FAFEFE",
    highlight: false,
  },
  {
    name: "Marcus Lee",
    handle: "@marcuslee_tech",
    avatar: avatars.marcus,
    role: "Senior Dev @ Microsoft",
    rating: 5,
    text: "InterVox is the real deal for experienced professionals. The senior-level scenarios and leadership questions are challenging and extremely relevant. The instant scoring breakdown — confidence, clarity, structure — helped me identify blind spots I never knew I had. Worth every minute.",
    accent: "#059669",
    bg: "#FAFFF9",
  },
];

function StarRow() {
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star key={i} size={13} className="fill-[#F59E0B] text-[#F59E0B]" />
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: (typeof reviews)[0] }) {
  return (
    <div
      className="rounded-2xl border border-[#E2E8F0] p-6 flex flex-col gap-4 transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5 group flex-shrink-0"
      style={{
        backgroundColor: review.bg,
        boxShadow: "0 2px 16px rgba(0,0,0,0.05)",
        width: "380px",
      }}
    >
      {/* Quote icon */}
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center"
        style={{ backgroundColor: review.accent + "18" }}
      >
        <Quote size={16} strokeWidth={2} style={{ color: review.accent }} />
      </div>

      {/* Review text */}
      <p
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "0.875rem",
          lineHeight: 1.75,
          color: "#374151",
        }}
      >
        "{review.text}"
      </p>

      {/* Stars */}
      <StarRow />

      {/* Divider */}
      <div className="border-t border-[#F1F5F9]" />

      {/* User info */}
      <div className="flex items-center gap-3">
        <ImageWithFallback
          src={review.avatar}
          alt={review.name}
          className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
        />
        <div className="flex flex-col">
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 700,
              fontSize: "0.85rem",
              color: "#1E293B",
            }}
          >
            {review.name}
          </span>
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.75rem",
              color: review.accent,
              fontWeight: 500,
            }}
          >
            {review.handle}
          </span>
        </div>
        <div className="ml-auto">
          <span
            className="text-xs px-2.5 py-1 rounded-full"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 500,
              backgroundColor: review.accent + "12",
              color: review.accent,
            }}
          >
            {review.role.split("@")[1]?.trim()}
          </span>
        </div>
      </div>
    </div>
  );
}

export function Testimonials() {
  // Duplicate reviews for infinite scroll
  const duplicatedReviews = [...reviews, ...reviews, ...reviews];

  return (
    <section className="bg-white py-20 lg:py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 flex flex-col items-center gap-4">
          <span
            className="inline-flex items-center gap-2 text-[#2563EB] bg-[#EFF6FF] border border-[#BFDBFE] px-4 py-1.5 rounded-full text-xs"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase" }}
          >
            <Star size={12} strokeWidth={2.5} className="fill-[#2563EB]" />
            Real Stories, Real Results
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
            Loved by{" "}
            <span className="text-[#2563EB]">2,400+ Job Seekers</span>
          </h2>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "1.0625rem",
              color: "#64748B",
              lineHeight: 1.7,
              maxWidth: "500px",
            }}
          >
            Don't just take our word for it — here's what our users say about training with the InterVox AI HR Manager.
          </p>

          {/* Aggregate rating */}
          <div className="flex items-center gap-3 mt-2">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={18} className="fill-[#F59E0B] text-[#F59E0B]" />
              ))}
            </div>
            <span style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: "1.125rem", color: "#1E293B" }}>
              4.9
            </span>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.875rem", color: "#94A3B8" }}>
              from 2,400+ reviews
            </span>
          </div>
        </div>

        {/* Auto-scrolling carousel */}
        <div className="relative">
          <div className="flex gap-6 animate-scroll">
            {duplicatedReviews.map((review, index) => (
              <ReviewCard key={`${review.handle}-${index}`} review={review} />
            ))}
          </div>
        </div>
      </div>

      {/* Add CSS animation */}
      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-404px * ${reviews.length}));
          }
        }

        .animate-scroll {
          animation: scroll 40s linear infinite;
        }

        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
