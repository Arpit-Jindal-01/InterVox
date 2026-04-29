import { useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export interface BoardroomQAPair {
  question: string;
  answer: string;
  ideal_answer?: string;
  evaluation?: any;
}

export interface PlacementTwinRequest {
  role: string;
  difficulty: string;
  interview_context?: Record<string, any>;
  communication_metrics?: Record<string, any>;
  qa_pairs: BoardroomQAPair[];
}

export interface BoardroomVerdict {
  recommendation: 'HIRE' | 'HOLD' | 'NO_HIRE' | string;
  confidence: number;
  rationale: string[];
  top_rejection_risks: string[];
}

export interface PanelFeedback {
  panelist: string;
  focus: string;
  score: number;
  vote: 'HIRE' | 'HOLD' | 'NO_HIRE' | string;
  strengths: string[];
  concerns: string[];
  follow_up_questions: string[];
}

export interface StressDynamicSignal {
  signal: string;
  severity: 'low' | 'medium' | 'high' | string;
  evidence: string;
  impact: string;
}

export interface PlacementGapItem {
  area: string;
  severity: 'low' | 'medium' | 'high' | string;
  current_score: number;
  target_score: number;
  impact: string;
  actions: string[];
}

export interface ImprovementPlans {
  day_7: string[];
  day_14: string[];
  day_30: string[];
}

export interface InterviewerAssist {
  probing_questions: string[];
  bias_checks: string[];
  rubric_summary: string;
}

export interface PlacementTwinResult {
  boardroom_verdict: BoardroomVerdict;
  panel_feedback: PanelFeedback[];
  stress_dynamics: StressDynamicSignal[];
  placement_gap_map: PlacementGapItem[];
  improvement_plans: ImprovementPlans;
  interviewer_assist: InterviewerAssist;
}

export const usePlacementTwin = () => {
  const [isRunningTwin, setIsRunningTwin] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runBoardroom = async (
    request: PlacementTwinRequest
  ): Promise<PlacementTwinResult | null> => {
    setIsRunningTwin(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/interview/placement-twin-boardroom`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error('Placement Twin boardroom request failed');
      }

      const result = await response.json();
      setIsRunningTwin(false);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Placement Twin request failed');
      setIsRunningTwin(false);
      return null;
    }
  };

  return {
    runBoardroom,
    isRunningTwin,
    error,
  };
};
