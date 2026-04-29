import Navbar from "./Navbar";
import { HeroSection } from "./HeroSection";
import { Banner } from "./Banner";
import { FeaturesGrid } from "./FeaturesGrid";
import { Testimonials } from "./Testimonials";
import { Footer } from "./Footer";
import { CursorGlow } from "./CursorGlow";
import { GlobalBackground } from "./GlobalBackground";

export default function LandingPageTest() {
  return (
    <div className="min-h-screen bg-white relative w-full" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div style={{ padding: "20px", textAlign: "center", background: "#f0f0f0", borderBottom: "1px solid #ccc" }}>
        <h1>InterVox - Landing Page Test</h1>
        <p>If you see this, React is working!</p>
      </div>
    </div>
  );
}
