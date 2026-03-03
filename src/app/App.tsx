import { BrowserRouter, Routes, Route } from "react-router";
import LandingPage from "./pages/LandingPage";
import DashboardLayout from "./pages/DashboardLayout";
import DashboardHome from "./pages/DashboardHome";
import Practice from "./pages/Practice";
import History from "./pages/History";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import LiveInterview from "./pages/LiveInterview";
import InterviewResults from "./pages/InterviewResults";
import AIPracticePage from "./pages/AIPracticePage";
import CommunicationPracticePage from "./pages/CommunicationPracticePage";
import BlogPage from "./pages/BlogPage";
import SignInPage from "./pages/SignInPage";
import LogoutPage from "./pages/LogoutPage";
import { VoiceRecognitionTest } from "./components/VoiceRecognitionTest";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/ai-practice" element={<AIPracticePage />} />
        <Route path="/communication-practice" element={<CommunicationPracticePage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/logout" element={<LogoutPage />} />
        <Route path="/voice-test" element={<VoiceRecognitionTest />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="practice" element={<Practice />} />
          <Route path="history" element={<History />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="/interview-live" element={<LiveInterview />} />
        <Route path="/interview-results" element={<InterviewResults />} />
      </Routes>
    </BrowserRouter>
  );
}