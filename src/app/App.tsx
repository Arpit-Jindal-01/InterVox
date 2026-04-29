import { BrowserRouter, Routes, Route } from "react-router";
import { AuthProvider } from "./context/AuthContext";
import LandingPage from "./pages/LandingPage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import LogoutPage from "./pages/LogoutPage";
import DashboardLayout from "./pages/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";

// Direct imports for dashboard
import DashboardHome from "./pages/DashboardHome";
import Practice from "./pages/Practice";
import History from "./pages/History";
import Analytics from "./pages/Analytics";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import LiveInterview from "./pages/LiveInterview";
import InterviewResults from "./pages/InterviewResults";
import AIPracticePage from "./pages/AIPracticePage";
import CommunicationPracticePage from "./pages/CommunicationPracticePage";
import BlogPage from "./pages/BlogPage";
import { VoiceRecognitionTest } from "./components/VoiceRecognitionTest";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/ai-practice" element={<AIPracticePage />} />
          <Route path="/communication-practice" element={<CommunicationPracticePage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/logout" element={<LogoutPage />} />
          <Route path="/voice-test" element={<VoiceRecognitionTest />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardHome />} />
            <Route path="practice" element={<Practice />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="history" element={<History />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          <Route
            path="/interview-live"
            element={
              <ProtectedRoute>
                <LiveInterview />
              </ProtectedRoute>
            }
          />
          <Route
            path="/interview-results"
            element={
              <ProtectedRoute>
                <InterviewResults />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}