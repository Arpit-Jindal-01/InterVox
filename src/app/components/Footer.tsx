import { Mail, Phone, MapPin, Twitter, Linkedin, Facebook, Instagram, ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="bg-[#1E293B] text-white">
      {/* Pre-footer CTA strip */}
      <div className="border-b border-[#334155]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex flex-col gap-2 text-center lg:text-left">
            <h3
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 800,
                fontSize: "1.5rem",
                color: "#F8FAFC",
                marginBottom: "8px",
              }}
            >
              Ready to ace your next interview?
            </h3>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", color: "#94A3B8" }}>
              Join 2,400+ professionals who train smarter with InterVox.
            </p>
          </div>
          <a
            href="#"
            className="flex-shrink-0 flex items-center gap-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-7 py-3.5 rounded-xl transition-all duration-150 shadow-lg shadow-blue-900/30 hover:-translate-y-0.5 group"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: "0.875rem" }}
          >
            <ArrowRight size={15} strokeWidth={2.5} className="transition-transform duration-150 group-hover:translate-x-1" />
            Start for Free
          </a>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Column 1: Brand */}
          <div className="flex flex-col gap-5 lg:col-span-1">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 w-fit">
              <Logo className="h-10" />
            </Link>

            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.875rem",
                lineHeight: 1.75,
                color: "#94A3B8",
              }}
            >
              InterVox is an AI-powered mock interview platform helping job seekers at every career stage practice smarter, build confidence, and land their dream roles.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 mt-1">
              {[
                { icon: Twitter, label: "Twitter", href: "#", color: "#1D9BF0" },
                { icon: Linkedin, label: "LinkedIn", href: "#", color: "#0A66C2" },
                { icon: Facebook, label: "Facebook", href: "#", color: "#3B5998" },
                { icon: Instagram, label: "Instagram", href: "#", color: "#E1306C" },
              ].map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="w-9 h-9 rounded-lg bg-[#334155] hover:bg-[#2563EB] flex items-center justify-center transition-all duration-150 hover:-translate-y-0.5"
                  >
                    <Icon size={15} strokeWidth={1.75} className="text-[#94A3B8] hover:text-white transition-colors" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col gap-5">
            <h4
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 700,
                fontSize: "0.875rem",
                color: "#FFFFFF",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Quick Links
            </h4>
            <ul className="flex flex-col gap-3">
              {[
                { label: "Home", to: "/" },
                { label: "AI Interview Practice", to: "/ai-practice" },
                { label: "Communication Practice", to: "/communication-practice" },
                { label: "Blog", to: "/blog" },
                { label: "Pricing", to: "#" },
                { label: "About Us", to: "#" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="flex items-center gap-2 group"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "0.875rem",
                      color: "#94A3B8",
                      transition: "color 0.15s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#FFFFFF")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#94A3B8")}
                  >
                    <span className="w-1 h-1 rounded-full bg-[#334155] group-hover:bg-[#2563EB] transition-colors flex-shrink-0" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div className="flex flex-col gap-5">
            <h4
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 700,
                fontSize: "0.875rem",
                color: "#FFFFFF",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Resources
            </h4>
            <ul className="flex flex-col gap-3">
              {[
                { label: "Interview Tips", href: "#" },
                { label: "Resume Guide", href: "#" },
                { label: "Career Roadmaps", href: "#" },
                { label: "Practice Questions", href: "#" },
                { label: "Community Forum", href: "#" },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="flex items-center gap-2 group"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "0.875rem",
                      color: "#94A3B8",
                      transition: "color 0.15s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#FFFFFF")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#94A3B8")}
                  >
                    <span className="w-1 h-1 rounded-full bg-[#334155] group-hover:bg-[#2563EB] transition-colors flex-shrink-0" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Us */}
          <div className="flex flex-col gap-5">
            <h4
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 700,
                fontSize: "0.875rem",
                color: "#FFFFFF",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Contact Us
            </h4>
            <ul className="flex flex-col gap-4">
              {[
                { icon: Mail, label: "jindalarpit0288@gmail.com", href: "mailto:jindalarpit0288@gmail.com" },
                { icon: Phone, label: "+91 72402-14909", href: "tel:+917240214909" },
                { icon: MapPin, label: "Raipur, Chhattisgarh, India", href: "#" },
              ].map((contact) => {
                const Icon = contact.icon;
                return (
                  <li key={contact.label}>
                    <a
                      href={contact.href}
                      className="flex items-start gap-3"
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "0.875rem",
                        color: "#94A3B8",
                        transition: "color 0.15s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#FFFFFF")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "#94A3B8")}
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#334155] flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Icon size={14} strokeWidth={1.75} className="text-[#60A5FA]" />
                      </div>
                      {contact.label}
                    </a>
                  </li>
                );
              })}
            </ul>

            {/* Newsletter micro-form */}
            <div className="mt-2">
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", color: "#64748B", marginBottom: "10px" }}>
                Get interview tips in your inbox
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 min-w-0 bg-[#334155] border border-[#475569] text-white placeholder-[#64748B] text-sm px-3 py-2 rounded-lg outline-none focus:border-[#2563EB] transition-colors"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                />
                <button
                  className="flex-shrink-0 bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-3 py-2 rounded-lg transition-colors"
                  aria-label="Subscribe"
                >
                  <ArrowRight size={15} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#334155]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.8rem",
              color: "#64748B",
            }}
          >
            © 2026 InterVox. All rights reserved. Built with ❤️ for job seekers worldwide.
          </p>
          <div className="flex items-center gap-6">
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item) => (
              <a
                key={item}
                href="#"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.8rem",
                  color: "#64748B",
                  transition: "color 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#94A3B8")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#64748B")}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}