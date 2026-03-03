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

const STORAGE_KEY = 'intervox_interview_history';

/**
 * Get all interview sessions from localStorage
 */
export const getInterviewHistory = (): InterviewSession[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
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
export const saveInterviewSession = (session: Omit<InterviewSession, 'id' | 'timestamp'>): InterviewSession => {
  try {
    const history = getInterviewHistory();
    
    const newSession: InterviewSession = {
      ...session,
      id: `interview_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    };
    
    // Add to beginning of array (most recent first)
    history.unshift(newSession);
    
    // Keep only last 50 sessions to avoid localStorage limits
    const trimmedHistory = history.slice(0, 50);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedHistory));
    
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
export const deleteInterviewSession = (id: string): boolean => {
  try {
    const history = getInterviewHistory();
    const filtered = history.filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
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
export const getInterviewSession = (id: string): InterviewSession | null => {
  const history = getInterviewHistory();
  return history.find(s => s.id === id) || null;
};

/**
 * Get statistics from interview history
 */
export const getHistoryStats = () => {
  const history = getInterviewHistory();
  
  if (history.length === 0) {
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
  
  // Calculate trend (comparing last 3 to previous 3)
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
};
