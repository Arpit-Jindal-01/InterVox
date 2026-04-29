import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

export default function LogoutPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const performLogout = async () => {
      try {
        await logout();
      } finally {
        navigate("/");
      }
    };

    performLogout();
    // Effect runs once on component mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="inline-block w-8 h-8 border-4 border-[#E2E8F0] border-t-[#2563EB] rounded-full animate-spin mb-4" />
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.875rem",
            color: "#64748B",
          }}
        >
          Logging out...
        </p>
      </div>
    </div>
  );
}
