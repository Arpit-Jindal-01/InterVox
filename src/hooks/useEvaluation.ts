import { useState } from 'react';

export interface EvaluationRequest {
  question: string;
  user_answer: string;
  ideal_answer: string;
  keywords: string[];
  role: string;
}

export interface ScoreBreakdown {
  embedding_score: number;
  keyword_score: number;
  technical_accuracy: number;
  clarity_score: number;
  depth_score: number;
}

export interface EvaluationResult {
  final_score: number;
  score_breakdown: ScoreBreakdown;
  missing_concepts: string[];
  strengths: string[];
  improvements: string[];
  grade: string;
}

export const useEvaluation = () => {
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const evaluateAnswer = async (request: EvaluationRequest): Promise<EvaluationResult | null> => {
    setIsEvaluating(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8000/api/interview/evaluate-answer-comprehensive', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error('Evaluation failed');
      }

      const result = await response.json();
      setIsEvaluating(false);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Evaluation failed');
      setIsEvaluating(false);
      return null;
    }
  };

  return {
    evaluateAnswer,
    isEvaluating,
    error,
  };
};
