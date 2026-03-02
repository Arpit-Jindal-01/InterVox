import { useLocation } from "react-router";
import { Construction } from "lucide-react";

const pageNames: Record<string, string> = {
  "/dashboard/practice": "Practice",
  "/dashboard/history": "History",
  "/dashboard/profile": "Profile",
  "/dashboard/settings": "Settings",
};

export default function DashboardPlaceholder() {
  const { pathname } = useLocation();
  const name = pageNames[pathname] ?? "Page";

  return (
    <div className="flex-1 flex items-center justify-center bg-[#F9FAFB]">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#EFF6FF] flex items-center justify-center">
          <Construction size={28} className="text-[#2563EB]" strokeWidth={1.75} />
        </div>
        <div>
          <h2
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 800,
              fontSize: "1.25rem",
              color: "#1E293B",
              letterSpacing: "-0.02em",
            }}
          >
            {name}
          </h2>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.875rem", color: "#94A3B8", marginTop: "6px" }}>
            This section is coming soon.
          </p>
        </div>
      </div>
    </div>
  );
}
