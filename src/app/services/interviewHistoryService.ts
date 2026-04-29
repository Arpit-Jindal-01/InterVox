import { InterviewSession, getInterviewHistory, setInterviewHistory } from "../../utils/interviewStorage";

const viteEnv = (import.meta as ImportMeta & { env?: Record<string, string> }).env || {};
const BACKEND_URL = viteEnv.VITE_BACKEND_URL || "http://localhost:8000";
const API_BASE_URL = viteEnv.VITE_API_BASE_URL || `${BACKEND_URL}/api`;

interface BackendInterviewSession {
  id: string;
  date: string;
  dateShort: string;
  timestamp: number;
  role: string;
  level: string;
  difficulty: "easy" | "medium" | "hard";
  score: number;
  duration: string;
  questions: number;
  questionsAnswered: number;
  fullData?: InterviewSession["fullData"];
}

function getAuthToken(): string | null {
  return localStorage.getItem("authToken");
}

function isDbSessionId(id: string): boolean {
  return typeof id === "string" && id.startsWith("db_");
}

export async function listUserInterviews(userId?: string | number): Promise<InterviewSession[]> {
  const token = getAuthToken();
  if (!token) {
    return getInterviewHistory(userId);
  }

  try {
    const response = await fetch(`${API_BASE_URL}/interviews`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch interviews");
    }

    const sessions = (await response.json()) as BackendInterviewSession[];
    setInterviewHistory(sessions, userId);
    return sessions;
  } catch (error) {
    console.error("Error fetching interviews from backend, using local cache:", error);
    return getInterviewHistory(userId);
  }
}

export async function saveUserInterview(
  session: Omit<InterviewSession, "id" | "timestamp">,
  userId?: string | number
): Promise<InterviewSession> {
  const token = getAuthToken();
  if (!token) {
    throw new Error("User is not authenticated");
  }

  const response = await fetch(`${API_BASE_URL}/interviews`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(session),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || "Failed to save interview");
  }

  const saved = (await response.json()) as InterviewSession;
  const history = getInterviewHistory(userId);
  const merged = [saved, ...history.filter((s) => s.id !== saved.id)].slice(0, 50);
  setInterviewHistory(merged, userId);
  return saved;
}

export async function deleteUserInterview(id: string, userId?: string | number): Promise<boolean> {
  if (!isDbSessionId(id)) {
    const history = getInterviewHistory(userId).filter((s) => s.id !== id);
    setInterviewHistory(history, userId);
    return true;
  }

  const token = getAuthToken();
  if (!token) {
    return false;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/interviews/${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return false;
    }

    const history = getInterviewHistory(userId).filter((s) => s.id !== id);
    setInterviewHistory(history, userId);
    return true;
  } catch (error) {
    console.error("Error deleting interview:", error);
    return false;
  }
}
