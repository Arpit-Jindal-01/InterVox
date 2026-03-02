import { useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { HeroSection } from "../components/HeroSection";
import { Banner } from "../components/Banner";
import { FeaturesGrid } from "../components/FeaturesGrid";
import { Testimonials } from "../components/Testimonials";
import { Footer } from "../components/Footer";
import { CursorGlow } from "../components/CursorGlow";
import { GlobalBackground } from "../components/GlobalBackground";

export default function LandingPage() {
  // Enable smooth scrolling
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, []);

  return (
    <div className="min-h-screen bg-white relative w-full" style={{ fontFamily: "'Inter', sans-serif" }}>
      <GlobalBackground />
      <CursorGlow />
      <Navbar />
      <main className="w-full">
        <HeroSection />
        <Banner />
        <FeaturesGrid />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
}