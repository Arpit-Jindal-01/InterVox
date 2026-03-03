 import { useState, useRef } from 'react';

export interface CommunicationMetrics {
  wordsPerMinute: number;
  totalWords: number;
  speakingDuration: number; // in seconds
  fillerWords: {
    count: number;
    words: string[];
  };
  pauseCount: number;
  averagePauseLength: number; // in seconds
  fluencyScore: number; // 0-100
}

export interface AnswerAnalytics {
  questionIndex: number;
  metrics: CommunicationMetrics;
}

const FILLER_WORDS = [
  'um', 'uh', 'uhm', 'like', 'you know', 'actually', 'basically', 
  'literally', 'sort of', 'kind of', 'i mean', 'right', 'okay', 'so'
];

export const useCommunicationAnalytics = () => {
  const [allAnalytics, setAllAnalytics] = useState<AnswerAnalytics[]>([]);
  const startTimeRef = useRef<number | null>(null);
  const pauseTimesRef = useRef<number[]>([]);
  const lastWordTimeRef = useRef<number | null>(null);

  const startTracking = () => {
    startTimeRef.current = Date.now();
    lastWordTimeRef.current = Date.now();
    pauseTimesRef.current = [];
  };

  const recordPause = () => {
    if (lastWordTimeRef.current) {
      const pauseLength = (Date.now() - lastWordTimeRef.current) / 1000;
      if (pauseLength > 1.5) { // Only count pauses > 1.5 seconds
        pauseTimesRef.current.push(pauseLength);
      }
    }
    lastWordTimeRef.current = Date.now();
  };

  const analyzeAnswer = (
    transcript: string,
    questionIndex: number
  ): CommunicationMetrics => {
    const endTime = Date.now();
    const startTime = startTimeRef.current || endTime;
    const speakingDuration = Math.max((endTime - startTime) / 1000, 1); // in seconds

    // Word count
    const words = transcript.trim().split(/\s+/).filter(w => w.length > 0);
    const totalWords = words.length;

    // WPM calculation
    const minutes = speakingDuration / 60;
    const wordsPerMinute = Math.round(totalWords / minutes);

    // Filler words detection
    const transcriptLower = transcript.toLowerCase();
    const detectedFillers: string[] = [];
    let fillerCount = 0;

    FILLER_WORDS.forEach(filler => {
      const regex = new RegExp(`\\b${filler}\\b`, 'gi');
      const matches = transcriptLower.match(regex);
      if (matches) {
        fillerCount += matches.length;
        detectedFillers.push(`${filler} (${matches.length}x)`);
      }
    });

    // Pause analysis
    const pauseCount = pauseTimesRef.current.length;
    const averagePauseLength = pauseCount > 0
      ? pauseTimesRef.current.reduce((a, b) => a + b, 0) / pauseCount
      : 0;

    // Fluency score calculation (0-100)
    // Based on: WPM (40%), filler words (30%), pauses (30%)
    const wpmScore = Math.min(100, (wordsPerMinute / 150) * 100); // 150 WPM is ideal
    const fillerRatio = totalWords > 0 ? fillerCount / totalWords : 0;
    const fillerScore = Math.max(0, 100 - (fillerRatio * 500)); // Penalize heavily
    const pauseScore = pauseCount < 3 ? 100 : Math.max(0, 100 - (pauseCount * 10));

    const fluencyScore = Math.round(
      wpmScore * 0.4 + fillerScore * 0.3 + pauseScore * 0.3
    );

    const metrics: CommunicationMetrics = {
      wordsPerMinute,
      totalWords,
      speakingDuration: Math.round(speakingDuration),
      fillerWords: {
        count: fillerCount,
        words: detectedFillers,
      },
      pauseCount,
      averagePauseLength: Math.round(averagePauseLength * 10) / 10,
      fluencyScore,
    };

    // Store analytics for this question
    setAllAnalytics(prev => [
      ...prev,
      { questionIndex, metrics }
    ]);

    // Reset for next question
    startTimeRef.current = null;
    pauseTimesRef.current = [];
    lastWordTimeRef.current = null;

    return metrics;
  };

  const getAverageMetrics = (): CommunicationMetrics | null => {
    if (allAnalytics.length === 0) return null;

    const avgWPM = Math.round(
      allAnalytics.reduce((sum, a) => sum + a.metrics.wordsPerMinute, 0) / allAnalytics.length
    );

    const totalFillers = allAnalytics.reduce((sum, a) => sum + a.metrics.fillerWords.count, 0);
    const totalWords = allAnalytics.reduce((sum, a) => sum + a.metrics.totalWords, 0);

    const avgFluency = Math.round(
      allAnalytics.reduce((sum, a) => sum + a.metrics.fluencyScore, 0) / allAnalytics.length
    );

    return {
      wordsPerMinute: avgWPM,
      totalWords,
      speakingDuration: 0,
      fillerWords: {
        count: totalFillers,
        words: [],
      },
      pauseCount: 0,
      averagePauseLength: 0,
      fluencyScore: avgFluency,
    };
  };

  return {
    startTracking,
    recordPause,
    analyzeAnswer,
    getAverageMetrics,
    allAnalytics,
  };
};
