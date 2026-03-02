import { useState } from "react";
import { Settings as SettingsIcon, Moon, Sun, Contrast, Mic, Mail, TrendingUp, Megaphone, AlertTriangle, Trash2 } from "lucide-react";

function ToggleSwitch({ enabled, onChange }: { enabled: boolean; onChange: (value: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        enabled ? "bg-[#2563EB]" : "bg-[#CBD5E1]"
      }`}
      role="switch"
      aria-checked={enabled}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

export default function Settings() {
  const [preferences, setPreferences] = useState({
    darkMode: false,
    highContrast: false,
    voiceInput: true,
  });

  const [notifications, setNotifications] = useState({
    emailSummaries: true,
    weeklyReports: true,
    productUpdates: false,
  });

  const handlePreferenceChange = (key: string, value: boolean) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications((prev) => ({ ...prev, [key]: value }));
  };

  const handleDeleteAccount = () => {
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      alert("Account deletion initiated. You will receive a confirmation email.");
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#F9FAFB]">
      {/* Header */}
      <header className="bg-white border-b border-[#E2E8F0] px-6 lg:px-8 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] flex items-center justify-center">
              <SettingsIcon size={18} className="text-[#2563EB]" strokeWidth={2} />
            </div>
            <h1
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 800,
                fontSize: "1.5rem",
                color: "#1E293B",
                letterSpacing: "-0.02em",
              }}
            >
              Account Settings
            </h1>
          </div>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.9rem",
              color: "#64748B",
              lineHeight: 1.6,
            }}
          >
            Manage your app preferences and account settings
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div className="px-6 lg:px-8 py-8 max-w-4xl mx-auto flex flex-col gap-6">
        {/* Preferences Section */}
        <div
          className="bg-white rounded-2xl border border-[#E2E8F0] p-6"
          style={{ boxShadow: "0 1px 12px rgba(0,0,0,0.05)" }}
        >
          <h2
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 700,
              fontSize: "1.1rem",
              color: "#1E293B",
              marginBottom: "20px",
            }}
          >
            App Preferences
          </h2>

          <div className="flex flex-col gap-5">
            {/* Dark Mode */}
            <div className="flex items-center justify-between py-3 border-b border-[#F1F5F9] last:border-b-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#F1F5F9] flex items-center justify-center">
                  {preferences.darkMode ? (
                    <Moon size={16} className="text-[#475569]" strokeWidth={2} />
                  ) : (
                    <Sun size={16} className="text-[#475569]" strokeWidth={2} />
                  )}
                </div>
                <div>
                  <p
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      color: "#1E293B",
                    }}
                  >
                    Dark Mode
                  </p>
                  <p
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "0.75rem",
                      color: "#64748B",
                    }}
                  >
                    Switch to dark theme for better visibility at night
                  </p>
                </div>
              </div>
              <ToggleSwitch
                enabled={preferences.darkMode}
                onChange={(value) => handlePreferenceChange("darkMode", value)}
              />
            </div>

            {/* High Contrast Mode */}
            <div className="flex items-center justify-between py-3 border-b border-[#F1F5F9] last:border-b-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#F1F5F9] flex items-center justify-center">
                  <Contrast size={16} className="text-[#475569]" strokeWidth={2} />
                </div>
                <div>
                  <p
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      color: "#1E293B",
                    }}
                  >
                    High Contrast Mode
                  </p>
                  <p
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "0.75rem",
                      color: "#64748B",
                    }}
                  >
                    Increase text contrast for better readability
                  </p>
                </div>
              </div>
              <ToggleSwitch
                enabled={preferences.highContrast}
                onChange={(value) => handlePreferenceChange("highContrast", value)}
              />
            </div>

            {/* Enable Voice Input by Default */}
            <div className="flex items-center justify-between py-3 border-b border-[#F1F5F9] last:border-b-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#F1F5F9] flex items-center justify-center">
                  <Mic size={16} className="text-[#475569]" strokeWidth={2} />
                </div>
                <div>
                  <p
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      color: "#1E293B",
                    }}
                  >
                    Enable Voice Input by Default
                  </p>
                  <p
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "0.75rem",
                      color: "#64748B",
                    }}
                  >
                    Automatically activate microphone during interviews
                  </p>
                </div>
              </div>
              <ToggleSwitch
                enabled={preferences.voiceInput}
                onChange={(value) => handlePreferenceChange("voiceInput", value)}
              />
            </div>
          </div>
        </div>

        {/* Notifications Section */}
        <div
          className="bg-white rounded-2xl border border-[#E2E8F0] p-6"
          style={{ boxShadow: "0 1px 12px rgba(0,0,0,0.05)" }}
        >
          <h2
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 700,
              fontSize: "1.1rem",
              color: "#1E293B",
              marginBottom: "20px",
            }}
          >
            Notifications
          </h2>

          <div className="flex flex-col gap-5">
            {/* Email me Interview Summaries */}
            <div className="flex items-center justify-between py-3 border-b border-[#F1F5F9] last:border-b-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#F1F5F9] flex items-center justify-center">
                  <Mail size={16} className="text-[#475569]" strokeWidth={2} />
                </div>
                <div>
                  <p
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      color: "#1E293B",
                    }}
                  >
                    Email me Interview Summaries
                  </p>
                  <p
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "0.75rem",
                      color: "#64748B",
                    }}
                  >
                    Receive detailed summaries after each interview session
                  </p>
                </div>
              </div>
              <ToggleSwitch
                enabled={notifications.emailSummaries}
                onChange={(value) => handleNotificationChange("emailSummaries", value)}
              />
            </div>

            {/* Weekly Progress Reports */}
            <div className="flex items-center justify-between py-3 border-b border-[#F1F5F9] last:border-b-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#F1F5F9] flex items-center justify-center">
                  <TrendingUp size={16} className="text-[#475569]" strokeWidth={2} />
                </div>
                <div>
                  <p
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      color: "#1E293B",
                    }}
                  >
                    Weekly Progress Reports
                  </p>
                  <p
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "0.75rem",
                      color: "#64748B",
                    }}
                  >
                    Get weekly insights on your interview performance
                  </p>
                </div>
              </div>
              <ToggleSwitch
                enabled={notifications.weeklyReports}
                onChange={(value) => handleNotificationChange("weeklyReports", value)}
              />
            </div>

            {/* Product Updates */}
            <div className="flex items-center justify-between py-3 border-b border-[#F1F5F9] last:border-b-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#F1F5F9] flex items-center justify-center">
                  <Megaphone size={16} className="text-[#475569]" strokeWidth={2} />
                </div>
                <div>
                  <p
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      color: "#1E293B",
                    }}
                  >
                    Product Updates
                  </p>
                  <p
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "0.75rem",
                      color: "#64748B",
                    }}
                  >
                    Stay informed about new features and improvements
                  </p>
                </div>
              </div>
              <ToggleSwitch
                enabled={notifications.productUpdates}
                onChange={(value) => handleNotificationChange("productUpdates", value)}
              />
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div
          className="bg-[#FEF2F2] rounded-2xl border-2 border-[#FEE2E2] p-6"
          style={{ boxShadow: "0 1px 12px rgba(239,68,68,0.08)" }}
        >
          <div className="flex items-start gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-[#FEE2E2] flex items-center justify-center">
              <AlertTriangle size={18} className="text-[#DC2626]" strokeWidth={2} />
            </div>
            <div>
              <h2
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 700,
                  fontSize: "1.1rem",
                  color: "#DC2626",
                  marginBottom: "4px",
                }}
              >
                Danger Zone
              </h2>
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.875rem",
                  color: "#991B1B",
                  lineHeight: 1.6,
                }}
              >
                Once you delete your account, there is no going back. Please be certain.
              </p>
            </div>
          </div>

          <button
            onClick={handleDeleteAccount}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-[#DC2626] text-[#DC2626] hover:bg-[#DC2626] hover:text-white transition-all"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
              fontSize: "0.875rem",
            }}
          >
            <Trash2 size={16} strokeWidth={2} />
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
