import { useState } from 'react';

export interface QuestionRequest {
  role: 'ml_engineer' | 'software_engineer' | 'data_scientist' | 'backend_engineer' | 'frontend_engineer';
  difficulty: 'easy' | 'medium' | 'hard';
  previous_qa?: Array<{ question: string; answer: string }>;
  use_ai?: boolean;
}

export interface QuestionData {
  question: string;
  ideal_answer: string;
  keywords: string[];
  role: string;
  difficulty: string;
}

export const useQuestionGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateQuestion = async (request: QuestionRequest): Promise<QuestionData | null> => {
    setIsGenerating(true);
    setError(null);

    try {
      console.log('📡 Calling question generation API:', request);
      
      const response = await fetch('http://localhost:8000/api/interview/generate-question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      console.log('📡 Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error:', errorText);
        throw new Error(`Failed to generate question: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Question received:', result.question?.substring(0, 50));
      setIsGenerating(false);
      return result;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Question generation failed';
      console.error('❌ Generation error:', errorMsg, err);
      setError(errorMsg);
      setIsGenerating(false);
      return null;
    }
  };

  return {
    generateQuestion,
    isGenerating,
    error,
  };
};
