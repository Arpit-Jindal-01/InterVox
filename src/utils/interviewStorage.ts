/**
 * Interview History Storage Utilities
 * Manages saving and retrieving interview sessions from localStorage
 */

export interface InterviewSession {
  id: string;
  date: string;
  dateShort: string;
  timestamp: number;
  role: string;
  level: string;
  difficulty: 'easy' | 'medium' | 'hard';
  score: number;
  duration: string;
  questions: number;
  questionsAnswered: number;
  // Detailed data
  fullData?: {
    questions: any[];
    answers: string[];
    evaluations: any[];
    communicationAnalytics?: any[];
    interviewConfig: any;
  };
}

const STORAGE_KEY_PREFIX = 'intervox_interview_history_v2';

function getStorageKey(userId?: string | number): string {
  return `${STORAGE_KEY_PREFIX}_${userId ?? 'guest'}`;
}

export function setInterviewHistory(history: InterviewSession[], userId?: string | number) {
  localStorage.setItem(getStorageKey(userId), JSON.stringify(history || []));
}

export function calculateHistoryStats(history: InterviewSession[]) {
  if (!history || history.length === 0) {
    return {
      totalSessions: 0,
      averageScore: 0,
      bestScore: 0,
      recentTrend: 0,
    };
  }

  const totalSessions = history.length;
  const averageScore = Math.round(
    history.reduce((sum, s) => sum + s.score, 0) / totalSessions
  );
  const bestScore = Math.max(...history.map(s => s.score));

  const recent = history.slice(0, 3);
  const previous = history.slice(3, 6);
  const recentAvg = recent.length > 0
    ? recent.reduce((sum, s) => sum + s.score, 0) / recent.length
    : 0;
  const previousAvg = previous.length > 0
    ? previous.reduce((sum, s) => sum + s.score, 0) / previous.length
    : 0;
  const recentTrend = recentAvg - previousAvg;

  return {
    totalSessions,
    averageScore,
    bestScore,
    recentTrend,
  };
}

/**
 * Get all interview sessions from localStorage
 */
export const getInterviewHistory = (userId?: string | number): InterviewSession[] => {
  try {
    const stored = localStorage.getItem(getStorageKey(userId));
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (error) {
    console.error('Error loading interview history:', error);
    return [];
  }
};

/**
 * Save a new interview session
 */
export const saveInterviewSession = (
  session: Omit<InterviewSession, 'id' | 'timestamp'>,
  userId?: string | number
): InterviewSession => {
  try {
    const history = getInterviewHistory(userId);
    
    const newSession: InterviewSession = {
      ...session,
      id: `interview_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    };
    
    // Add to beginning of array (most recent first)
    history.unshift(newSession);
    
    // Keep only last 50 sessions to avoid localStorage limits
    const trimmedHistory = history.slice(0, 50);
    
    localStorage.setItem(getStorageKey(userId), JSON.stringify(trimmedHistory));
    
    console.log('✅ Interview session saved to history:', newSession.id);
    return newSession;
  } catch (error) {
    console.error('Error saving interview session:', error);
    throw error;
  }
};

/**
 * Delete an interview session
 */
export const deleteInterviewSession = (id: string, userId?: string | number): boolean => {
  try {
    const history = getInterviewHistory(userId);
    const filtered = history.filter(s => s.id !== id);
    localStorage.setItem(getStorageKey(userId), JSON.stringify(filtered));
    console.log('🗑️ Interview session deleted:', id);
    return true;
  } catch (error) {
    console.error('Error deleting interview session:', error);
    return false;
  }
};

/**
 * Get a specific interview session by ID
 */
export const getInterviewSession = (id: string, userId?: string | number): InterviewSession | null => {
  const history = getInterviewHistory(userId);
  return history.find(s => s.id === id) || null;
};

/**
 * Get statistics from interview history
 */
export const getHistoryStats = (userId?: string | number) => {
  const history = getInterviewHistory(userId);
  return calculateHistoryStats(history);
};
