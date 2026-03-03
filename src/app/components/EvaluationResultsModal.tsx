import { CheckCircle2, XCircle, TrendingUp, AlertCircle, ArrowRight } from 'lucide-react';
import { EvaluationResult } from '../../hooks/useEvaluation';

interface EvaluationResultsModalProps {
  result: EvaluationResult | null;
  isOpen: boolean;
  onContinue: () => void;
  questionNumber: number;
  totalQuestions: number;
}

export default function EvaluationResultsModal({
  result,
  isOpen,
  onContinue,
  questionNumber,
  totalQuestions,
}: EvaluationResultsModalProps) {
  if (!isOpen || !result) return null;

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A':
        return 'text-[#10B981]';
      case 'B+':
      case 'B':
        return 'text-[#3B82F6]';
      case 'C+':
      case 'C':
        return 'text-[#F59E0B]';
      default:
        return 'text-[#EF4444]';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-[#10B981]';
    if (score >= 70) return 'text-[#3B82F6]';
    if (score >= 50) return 'text-[#F59E0B]';
    return 'text-[#EF4444]';
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#1E293B] rounded-2xl border border-[#334155] max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#2563EB] to-[#3B82F6] p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 700,
                  fontSize: '1.5rem',
                  color: '#FFFFFF',
                }}
              >
                Answer Evaluation
              </h2>
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.875rem',
                  color: '#E0E7FF',
                  marginTop: '4px',
                }}
              >
                Question {questionNumber + 1} of {totalQuestions}
              </p>
            </div>
            <div className="text-center">
              <div
                className={`text-5xl font-bold ${getGradeColor(result.grade)}`}
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {result.grade}
              </div>
              <div
                className={`text-2xl font-semibold ${getScoreColor(result.final_score)}`}
                style={{ fontFamily: "'Inter', sans-serif", marginTop: '4px' }}
              >
                {result.final_score.toFixed(1)}%
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Score Breakdown */}
          <div className="bg-[#0F172A] rounded-xl p-5 border border-[#334155]">
            <h3
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                fontSize: '1rem',
                color: '#F8FAFC',
                marginBottom: '16px',
              }}
            >
              📊 Score Breakdown
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <ScoreItem
                label="Technical Accuracy"
                value={result.score_breakdown.technical_accuracy}
                max={10}
              />
              <ScoreItem
                label="Clarity"
                value={result.score_breakdown.clarity_score}
                max={10}
              />
              <ScoreItem
                label="Depth"
                value={result.score_breakdown.depth_score}
                max={10}
              />
              <ScoreItem
                label="Keyword Match"
                value={result.score_breakdown.keyword_score * 100}
                max={100}
                isPercentage
              />
            </div>
          </div>

          {/* Strengths */}
          {result.strengths.length > 0 && (
            <div className="bg-[#0F172A] rounded-xl p-5 border border-[#10B981]/30">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 size={18} className="text-[#10B981]" strokeWidth={2} />
                <h3
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 600,
                    fontSize: '1rem',
                    color: '#10B981',
                  }}
                >
                  Strengths
                </h3>
              </div>
              <ul className="space-y-2">
                {result.strengths.map((strength, index) => (
                  <li
                    key={index}
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '0.875rem',
                      color: '#94A3B8',
                      lineHeight: 1.6,
                    }}
                  >
                    ✓ {strength}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Missing Concepts */}
          {result.missing_concepts.length > 0 && (
            <div className="bg-[#0F172A] rounded-xl p-5 border border-[#F59E0B]/30">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle size={18} className="text-[#F59E0B]" strokeWidth={2} />
                <h3
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 600,
                    fontSize: '1rem',
                    color: '#F59E0B',
                  }}
                >
                  Missing Concepts
                </h3>
              </div>
              <ul className="space-y-2">
                {result.missing_concepts.map((concept, index) => (
                  <li
                    key={index}
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '0.875rem',
                      color: '#94A3B8',
                      lineHeight: 1.6,
                    }}
                  >
                    • {concept}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Improvements */}
          {result.improvements.length > 0 && (
            <div className="bg-[#0F172A] rounded-xl p-5 border border-[#3B82F6]/30">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp size={18} className="text-[#3B82F6]" strokeWidth={2} />
                <h3
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 600,
                    fontSize: '1rem',
                    color: '#3B82F6',
                  }}
                >
                  Suggestions for Improvement
                </h3>
              </div>
              <ul className="space-y-2">
                {result.improvements.map((improvement, index) => (
                  <li
                    key={index}
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '0.875rem',
                      color: '#94A3B8',
                      lineHeight: 1.6,
                    }}
                  >
                    → {improvement}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Continue Button */}
          <button
            onClick={onContinue}
            className="w-full bg-gradient-to-r from-[#2563EB] to-[#3B82F6] text-white rounded-xl py-4 font-semibold text-base flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Continue to Next Question
            <ArrowRight size={18} strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
}

interface ScoreItemProps {
  label: string;
  value: number;
  max: number;
  isPercentage?: boolean;
}

function ScoreItem({ label, value, max, isPercentage = false }: ScoreItemProps) {
  const percentage = (value / max) * 100;
  const getColor = () => {
    if (percentage >= 80) return 'bg-[#10B981]';
    if (percentage >= 60) return 'bg-[#3B82F6]';
    if (percentage >= 40) return 'bg-[#F59E0B]';
    return 'bg-[#EF4444]';
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '0.875rem',
            color: '#94A3B8',
            fontWeight: 500,
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '0.875rem',
            color: '#E2E8F0',
            fontWeight: 600,
          }}
        >
          {isPercentage ? `${value.toFixed(0)}%` : `${value.toFixed(1)}/${max}`}
        </span>
      </div>
      <div className="w-full h-2 bg-[#334155] rounded-full overflow-hidden">
        <div
          className={`h-full ${getColor()} transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
