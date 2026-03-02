import { useEffect } from "react";
import { useNavigate } from "react-router";

export default function LogoutPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate logout action (clear tokens, etc.)
    // Then redirect to home
    navigate("/");
  }, [navigate]);

  return null;
}
