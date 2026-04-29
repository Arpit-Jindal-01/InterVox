import { useState, useEffect, useRef, useCallback } from "react";
import {
  Camera,
  Mic,
  MicOff,
  MessageSquare,
  Volume2,
  VolumeX,
  AlertCircle,
  ChevronLeft,
  SkipForward,
  CameraOff,
  Activity,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router";
import { useWhisperRecognition } from "../../hooks/useWhisperRecognition";
import { useSarvamTTS } from "../../hooks/useSarvamTTS";
import { useEvaluation, EvaluationResult } from "../../hooks/useEvaluation";
import { useQuestionGenerator, QuestionData } from "../../hooks/useQuestionGenerator";
import { useCommunicationAnalytics, AnswerAnalytics } from "../../hooks/useCommunicationAnalytics";

interface InterviewConfig {
  role: string;
  difficulty: 'easy' | 'medium' | 'hard';
  questionCount: number;
  targetCompany?: string;
  boardroomMode?: boolean;
}

interface PreviousQA {
  question: string;
  answer: string;
}

type InputMode = "voice" | "text";

interface VoiceProfile {
  provider: 'sarvam' | 'system';
  speaker: string;
  pace: number;
  playbackRate: number;
  voiceHint?: string;
}

const panelInterviewers = [
  {
    id: "hr",
    name: "HR Manager",
    focus: "behavioral_culture",
    voice: { provider: 'sarvam', speaker: "neha", pace: 0.92, playbackRate: 0.98 } as VoiceProfile,
  },
  {
    id: "tech",
    name: "Technical Interviewer",
    focus: "technical_depth",
    voice: { provider: 'sarvam', speaker: "male_1", pace: 0.9, playbackRate: 0.96 } as VoiceProfile,
  },
  {
    id: "problem",
    name: "Problem Solving Interviewer",
    focus: "problem_solving",
    voice: { provider: 'system', speaker: "male_2", pace: 0.95, playbackRate: 0.97, voiceHint: 'male_deep' } as VoiceProfile,
  },
  {
    id: "comm",
    name: "Communication Evaluator",
    focus: "clarity_pressure_handling",
    voice: { provider: 'system', speaker: "male_3", pace: 0.92, playbackRate: 1.0, voiceHint: 'male_clear' } as VoiceProfile,
  },
] as const;

type PanelInterviewer = (typeof panelInterviewers)[number];

function ZoomTile({
  title,
  subtitle,
  isActive,
  color,
  initials,
}: {
  title: string;
  subtitle: string;
  isActive: boolean;
  color: string;
  initials: string;
}) {
  return (
    <div
      className="rounded-xl border p-3 transition-all duration-200"
      style={{
        backgroundColor: isActive ? `${color}22` : "#0B1220",
        borderColor: isActive ? color : "#334155",
        boxShadow: isActive ? `0 0 0 2px ${color}55` : "none",
      }}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ backgroundColor: color, color: "white" }}
          >
            {initials}
          </div>
          <p
            className="truncate"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 700,
              fontSize: "0.75rem",
              color: "#E2E8F0",
            }}
          >
            {title}
          </p>
        </div>
        {isActive && (
          <div className="flex items-end gap-0.5 h-4">
            <span className="w-1 rounded-full bg-[#22C55E] animate-pulse" style={{ height: "8px" }} />
            <span className="w-1 rounded-full bg-[#22C55E] animate-pulse" style={{ height: "13px", animationDelay: "0.1s" }} />
            <span className="w-1 rounded-full bg-[#22C55E] animate-pulse" style={{ height: "6px", animationDelay: "0.2s" }} />
          </div>
        )}
      </div>
      <p
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "0.7rem",
          color: isActive ? "#BFDBFE" : "#94A3B8",
          lineHeight: 1.4,
        }}
      >
        {subtitle}
      </p>
    </div>
  );
}

const companyPersonas: Record<string, { tone: string; challengePrompts: { low: string[]; medium: string[]; high: string[] } }> = {
  google: {
    tone: "Structured, systems-thinking, data-backed clarity",
    challengePrompts: {
      low: [
        "Can you summarize that in one crisp sentence?",
        "Give one metric that proves impact.",
      ],
      medium: [
        "Clarify your trade-off in 20 seconds.",
        "Scale this approach to 10x users.",
      ],
      high: [
        "You are over-explaining. Distill this to core signal now.",
        "Assume production incident is active. What is your first action?",
      ],
    },
  },
  amazon: {
    tone: "Ownership-first, customer obsession, concrete outcomes",
    challengePrompts: {
      low: [
        "What customer pain does this solve?",
        "Who owned the final decision?",
      ],
      medium: [
        "How did this improve customer experience?",
        "What would you do if launch is blocked today?",
      ],
      high: [
        "You need to show ownership. What did YOU drive end-to-end?",
        "Assume constraints doubled. Re-plan in 30 seconds.",
      ],
    },
  },
  microsoft: {
    tone: "Collaboration, reliability, practical engineering",
    challengePrompts: {
      low: [
        "How would you align with cross-functional teams?",
        "Explain this to a non-technical stakeholder.",
      ],
      medium: [
        "What reliability risk did you account for?",
        "What fallback plan exists if this fails?",
      ],
      high: [
        "Your answer is unclear. Restate with reliability-first framing.",
        "You have 25 seconds: risk, mitigation, owner.",
      ],
    },
  },
  meta: {
    tone: "Speed, product impact, iteration under ambiguity",
    challengePrompts: {
      low: [
        "What experiment would you run first?",
        "What metric moves if this works?",
      ],
      medium: [
        "How quickly can you validate this decision?",
        "What if user behavior changes suddenly?",
      ],
      high: [
        "Shorten this. Prioritize speed and decision quality.",
        "Assume ambiguity increased. What's your next 2-step plan?",
      ],
    },
  },
  general: {
    tone: "Balanced interview style",
    challengePrompts: {
      low: [
        "Give one real example from your work.",
        "What is the main risk in your approach?",
      ],
      medium: [
        "Can you make that answer more concise?",
        "What trade-off did you choose and why?",
      ],
      high: [
        "You're not answering directly. Answer the core question first.",
        "You have 20 seconds: problem, action, impact.",
      ],
    },
  },
};

export default function LiveInterview() {
  const navigate = useNavigate();
  const location = useLocation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const animationFrameRef = useRef<number>();
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previousQuestionRef = useRef<number>(-1); // Track previous question
  const interruptionTimerRef = useRef<number | null>(null);

  // Get interview configuration from navigation state
  const interviewConfig = (location.state as InterviewConfig) || {
    role: 'software_engineer',
    difficulty: 'medium' as const,
    questionCount: 10,
    targetCompany: 'General',
    boardroomMode: false,
  };

  const companyKey = String(interviewConfig.targetCompany || 'General').toLowerCase();
  const companyPersona = companyPersonas[companyKey] || companyPersonas.general;

  // Whisper Voice Recognition Hook (More Reliable)
  const {
    transcript,
    isRecording: isWhisperRecording,
    error: voiceError,
    startRecording: startWhisperRecording,
    stopRecording: stopWhisperRecording,
    resetTranscript,
  } = useWhisperRecognition();

  // Sarvam AI Text-to-Speech Hook (Indian voices)
  const {
    speak,
    stop: stopSpeaking,
    isSpeaking,
  } = useSarvamTTS();

  // Evaluation Hook
  const {
    evaluateAnswer,
    evaluateAnswerQuick,
    isEvaluating,
    error: evaluationError,
  } = useEvaluation();

  // Question Generator Hook
  const {
    generateQuestion,
    isGenerating,
    error: questionError,
  } = useQuestionGenerator();

  // State
  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const answersRef = useRef<string[]>([]); // Sync ref to prevent state timing issues
  const [previousQA, setPreviousQA] = useState<PreviousQA[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isEvaluatingAll, setIsEvaluatingAll] = useState(false);
  
  // Communication analytics
  const { startTracking, recordPause, analyzeAnswer, getAverageMetrics, allAnalytics } = useCommunicationAnalytics();
  const [inputMode, setInputMode] = useState<InputMode>("voice");
  const [isRecording, setIsRecording] = useState(false);
  const [textAnswer, setTextAnswer] = useState("");
  const [timeRemaining, setTimeRemaining] = useState(120);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [hasUserInteracted, setHasUserInteracted] = useState(false); // Track user interaction for autoplay
  const [cameraPermission, setCameraPermission] = useState<"granted" | "denied" | "prompt">("prompt");
  const [audioLevel, setAudioLevel] = useState(0);
  const [activePanel, setActivePanel] = useState<PanelInterviewer>(panelInterviewers[0]);
  const [interruptionPrompt, setInterruptionPrompt] = useState<string | null>(null);
  const [pressureLevel, setPressureLevel] = useState<'low' | 'medium' | 'high'>('medium');
  const [activeSpeakerId, setActiveSpeakerId] = useState<string | null>(null);

  const totalQuestions = interviewConfig.questionCount;
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  const speakAs = useCallback(
    async (panelist: PanelInterviewer, text: string) => {
      if (!isSoundOn || !hasUserInteracted) {
        return;
      }
      setActiveSpeakerId(panelist.id);
      await speak(text, {
        provider: panelist.voice.provider,
        language: 'en-IN',
        speaker: panelist.voice.speaker,
        pace: panelist.voice.pace,
        playbackRate: panelist.voice.playbackRate,
        voiceHint: panelist.voice.voiceHint,
      });
    },
    [isSoundOn, hasUserInteracted, speak]
  );

  useEffect(() => {
    if (!isSpeaking) {
      setActiveSpeakerId(null);
    }
  }, [isSpeaking]);

  // Generate first question on mount (start with behavioral/introduction)
  useEffect(() => {
    const loadFirstQuestion = async () => {
      console.log('🎯 Starting with standard interview opener...');
      console.log('   Config:', interviewConfig);
      
      try {
        // First question is ALWAYS "Tell me about yourself" - standard interview opener
        const firstPanel = interviewConfig.boardroomMode ? panelInterviewers[0] : null;
        const firstQuestionText = "Tell me about yourself and your background.";
        const firstQuestion = {
          question: firstPanel ? `[${firstPanel.name}] ${firstQuestionText}` : firstQuestionText,
          ideal_answer: "A strong answer should include: your current role and experience, relevant technical skills, notable achievements or projects, and what motivates you professionally.",
          keywords: ["experience", "background", "skills", "expertise", "achievements", "passion", "goals"],
          role: interviewConfig.role,
          difficulty: 'easy'
        };

        if (firstPanel) {
          setActivePanel(firstPanel);
        }
        
        setQuestions([firstQuestion]);
        setAnswers([]); // Initialize answers array
        answersRef.current = []; // Initialize ref
        console.log('✅ First question loaded: Tell me about yourself');
      } catch (error) {
        console.error('❌ Error loading question:', error);
        alert('Error: ' + (error instanceof Error ? error.message : 'Unknown error'));
      }
    };
    
    const timer = setTimeout(() => {
      loadFirstQuestion();
    }, 100);
    
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Real-time boardroom interruptions while answering.
  useEffect(() => {
    if (!interviewConfig.boardroomMode || !questions[currentQuestion]) {
      return;
    }

    setInterruptionPrompt(null);
    if (interruptionTimerRef.current) {
      window.clearTimeout(interruptionTimerRef.current);
    }

    const delayByPressure = {
      low: 23000,
      medium: 16000,
      high: 10000,
    };
    const delayMs = delayByPressure[pressureLevel] + (currentQuestion % 2) * 2000;
    interruptionTimerRef.current = window.setTimeout(() => {
      const prompts = companyPersona.challengePrompts[pressureLevel];
      const prompt = prompts[currentQuestion % prompts.length];
      const text = `${activePanel.name}: ${prompt}`;
      setInterruptionPrompt(text);
      speakAs(activePanel, text);
    }, delayMs);

    return () => {
      if (interruptionTimerRef.current) {
        window.clearTimeout(interruptionTimerRef.current);
        interruptionTimerRef.current = null;
      }
    };
  }, [currentQuestion, questions, interviewConfig.boardroomMode, activePanel, companyPersona, pressureLevel, speakAs]);

  // Auto-read question aloud when question changes (only after user interaction)
  useEffect(() => {
    console.log('🎯 useEffect triggered - Current:', currentQuestion, 'Previous:', previousQuestionRef.current, 'Sound:', isSoundOn, 'User interacted:', hasUserInteracted);
    
    // Only auto-speak if:
    // 1. Question number actually changed (not first button click)
    // 2. Sound is on and user has interacted
    const questionChanged = previousQuestionRef.current !== currentQuestion && previousQuestionRef.current !== -1;
    
    if (questionChanged && isSoundOn && hasUserInteracted && questions[currentQuestion]) {
      console.log('🔊 Question CHANGED - Auto-speaking with Sarvam AI:', questions[currentQuestion].question.substring(0, 50));
      
      // Stop any current speech before starting new one
      stopSpeaking();
      
      // Small delay to ensure previous speech is fully stopped
      setTimeout(() => {
        speakAs(activePanel, questions[currentQuestion].question);
      }, 150);
    }
    
    // Update previous question tracker
    previousQuestionRef.current = currentQuestion;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestion, isSoundOn, hasUserInteracted, questions, activePanel, speakAs, stopSpeaking]);

  // Initialize camera and microphone
  useEffect(() => {
    const initMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 1280, height: 720, facingMode: "user" },
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            sampleRate: 44100,
          },
        });

        streamRef.current = stream;
        setCameraPermission("granted");

        // Set up video element
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        // Set up audio context for visualization
        const audioContext = new AudioContext();
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);

        audioContextRef.current = audioContext;
        analyserRef.current = analyser;
      } catch (error) {
        console.error("Error accessing media devices:", error);
        setCameraPermission("denied");
      }
    };

    initMedia();

    return () => {
      // Cleanup
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleNext();
          return 120;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestion]);

  // Audio visualization
  useEffect(() => {
    if (isRecording && analyserRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const analyser = analyserRef.current;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const draw = () => {
        animationFrameRef.current = requestAnimationFrame(draw);

        analyser.getByteFrequencyData(dataArray);

        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          const barWidth = (canvas.width / bufferLength) * 2.5;
          let x = 0;

          for (let i = 0; i < bufferLength; i++) {
            const barHeight = (dataArray[i] / 255) * canvas.height;
            const gradient = ctx.createLinearGradient(0, canvas.height, 0, canvas.height - barHeight);
            gradient.addColorStop(0, "#2563EB");
            gradient.addColorStop(1, "#60A5FA");
            ctx.fillStyle = gradient;
            ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
            x += barWidth + 1;
          }

          // Calculate average volume for the pulsing effect
          const average = dataArray.reduce((a, b) => a + b) / bufferLength;
          setAudioLevel(average);
        }
      };

      draw();
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      setAudioLevel(0);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isRecording]);

  const startRecording = async () => {
    try {
      console.log('🎤 Starting recording with Whisper...');
      
      // Start communication analytics tracking
      startTracking();
      
      // Start Whisper recording (handles audio capture + transcription)
      await startWhisperRecording();
      
      setIsRecording(true);
      console.log('✅ Recording started successfully');
    } catch (error) {
      console.error("Error starting recording:", error);
      setIsRecording(false);
    }
  };

  const stopRecording = async () => {
    console.log('🛑 Stopping recording...');
    
    try {
      // Stop Whisper recording (will auto-transcribe)
      await stopWhisperRecording();
      
      setIsRecording(false);
      console.log('✅ Recording stopped successfully');
    } catch (error) {
      console.error("Error stopping recording:", error);
    }
  };

  const toggleRecording = () => {
    setHasUserInteracted(true); // Enable auto-play for next questions
    
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleSubmit = async () => {
    console.log('📤 Submitting answer...');
    
    if (isRecording) {
      stopRecording();
    }
    
    // Get user's answer (from voice transcript or text input)
    const userAnswer = inputMode === 'voice' ? transcript : textAnswer;
    
    if (!userAnswer || userAnswer.trim() === '' || !questions[currentQuestion]) {
      console.log('⚠️ No answer provided or question not loaded');
      // Still allow them to continue
      setTimeout(() => {
        resetTranscript();
        handleNext();
      }, 100);
      return;
    }

    console.log('💾 Storing answer...');
    console.log(`   Current question index: ${currentQuestion}`);
    console.log(`   Answer length: ${userAnswer.length} chars`);
    console.log(`   Answer preview: "${userAnswer.substring(0, 100)}..."`);
    
    // Analyze communication metrics for this answer
    const communicationMetrics = analyzeAnswer(userAnswer, currentQuestion);
    console.log('📊 Communication Analytics:');
    console.log(`   WPM: ${communicationMetrics.wordsPerMinute}`);
    console.log(`   Filler words: ${communicationMetrics.fillerWords.count}`);
    console.log(`   Fluency score: ${communicationMetrics.fluencyScore}%`);

    // Adaptive boardroom pressure: weaker/less clear answers increase interruption intensity.
    const tokenCount = userAnswer.trim().split(/\s+/).filter(Boolean).length;
    const structureBonus = /because|therefore|for example|result|impact|trade-?off|however/i.test(userAnswer) ? 8 : 0;
    const fillerPenalty = Math.min(25, (communicationMetrics.fillerWords?.count || 0) * 2);
    const brevityPenalty = tokenCount < 18 ? 20 : tokenCount < 35 ? 10 : 0;
    const adaptiveScore = Math.max(
      0,
      Math.min(100, (communicationMetrics.fluencyScore || 55) * 0.6 + tokenCount * 0.6 + structureBonus - fillerPenalty - brevityPenalty)
    );
    const nextPressure: 'low' | 'medium' | 'high' = adaptiveScore >= 72 ? 'low' : adaptiveScore >= 48 ? 'medium' : 'high';
    setPressureLevel(nextPressure);
    console.log(`   🎯 Adaptive pressure level -> ${nextPressure} (score=${adaptiveScore.toFixed(1)})`);
    
    // Store the answer in BOTH state and ref (ref is synchronous)
    const newAnswers = [...answersRef.current];
    newAnswers[currentQuestion] = userAnswer;
    answersRef.current = newAnswers;
    
    setAnswers(newAnswers);
    
    // Store this Q&A for context in next question generation
    setPreviousQA(prev => [
      ...prev,
      {
        question: questions[currentQuestion].question,
        answer: userAnswer,
      }
    ]);
    
    console.log('✅ Answer stored successfully!');
    console.log(`   Total answers stored: ${answersRef.current.length}`);
    console.log(`   Answers array: [${answersRef.current.map((a, i) => `Q${i+1}: ${a ? a.substring(0,20)+'...' : 'empty'}`).join(', ')}]`);
    
    // Small delay to ensure state is updated before proceeding
    setTimeout(() => {
      resetTranscript();
      handleNext();
    }, 150); // Slightly longer delay to ensure answer is captured
  };

  const handleNext = async () => {
    console.log('⏭️ Moving to next question...');
    
    // Stop recording if active
    if (isRecording) {
      stopRecording();
    }

    // Ensure mediaRecorder is cleared
    if (mediaRecorderRef.current) {
      try {
        if (mediaRecorderRef.current.state !== 'inactive') {
          mediaRecorderRef.current.stop();
        }
      } catch (err) {
        console.error('Cleanup error:', err);
      }
      mediaRecorderRef.current = null;
    }

    // Reset transcript for next question
    resetTranscript();
    
    // Clear audio chunks
    audioChunksRef.current = [];

    if (currentQuestion < totalQuestions - 1) {
      const nextQuestionIndex = currentQuestion + 1;
      
      // Generate next question if not already generated
      if (!questions[nextQuestionIndex]) {
        console.log(`🎯 Generating question ${nextQuestionIndex + 1}/${totalQuestions}...`);
        console.log(`   Previous Q&A context: ${previousQA.length} items`);
        if (previousQA.length > 0) {
          console.log(`   Last answer: "${previousQA[previousQA.length - 1].answer.substring(0, 60)}..."`);
        }
        
        // Determine difficulty based on question progression
        // First 30% - easy behavioral
        // Next 40% - medium technical
        // Last 30% - hard technical
        let difficulty: 'easy' | 'medium' | 'hard';
        const progressPercent = (nextQuestionIndex / totalQuestions) * 100;
        
        if (progressPercent < 30) {
          difficulty = 'easy'; // Behavioral/introduction questions
        } else if (progressPercent < 70) {
          difficulty = 'medium'; // Technical questions
        } else {
          difficulty = 'hard'; // Advanced technical questions
        }
        
        console.log(`   Difficulty: ${difficulty} (${progressPercent.toFixed(0)}% through interview)`);
        
        const panelForNext = interviewConfig.boardroomMode
          ? panelInterviewers[nextQuestionIndex % panelInterviewers.length]
          : null;

        if (panelForNext) {
          setActivePanel(panelForNext);
        }

        const newQuestion = await generateQuestion({
          role: interviewConfig.role as any,
          difficulty: difficulty,
          previous_qa: [
            ...previousQA,
            ...(panelForNext
              ? [{
                  question: `Panel context: ${panelForNext.name}`,
                  answer: `Company tone: ${companyPersona.tone}`,
                }]
              : []),
          ],
          use_ai: true,
        });
        
        if (newQuestion) {
          const decoratedQuestion = panelForNext
            ? {
                ...newQuestion,
                question: `[${panelForNext.name}] ${newQuestion.question}`,
              }
            : newQuestion;
          setQuestions(prev => [...prev, decoratedQuestion]);
          console.log('✅ Question generated:', newQuestion.question);
        } else {
          console.error('❌ Failed to generate next question');
          // If question generation fails, evaluate and go to results
          await evaluateAllAnswersAndNavigate();
          return;
        }
      }
      
      setCurrentQuestion(nextQuestionIndex);
      setTextAnswer("");
      setInterruptionPrompt(null);
      setTimeRemaining(120);
      console.log('✅ Ready for next question');
    } else {
      // All questions completed - evaluate all answers and navigate to results
      console.log('🎯 Interview complete! Waiting for final answer to save...');
      
      // Small delay to ensure last answer is fully captured in ref
      setTimeout(async () => {
        console.log('🎯 Starting evaluation...');
        await evaluateAllAnswersAndNavigate();
      }, 200);
    }
  };

  const evaluateAllAnswersAndNavigate = async () => {
    setIsEvaluatingAll(true);
    
    try {
      // Use ref to get latest answers (avoids state timing issues)
      const finalAnswers = answersRef.current;
      
      console.log('🔍 Evaluating all answers...');
      console.log(`   Total questions: ${questions.length}`);
      console.log(`   Total answers captured: ${finalAnswers.length}`);
      console.log(`   Answers preview: [${finalAnswers.map((a, i) => `Q${i+1}:${a?'✓':'✗'}`).join(', ')}]`);
      
      // Evaluate each Q&A pair in sequence with retry to avoid dropped scores from rate limits.
      const evaluationResults: Array<EvaluationResult | null> = [];

      for (let index = 0; index < questions.length; index++) {
        const question = questions[index];
        const userAnswer = finalAnswers[index] || '';

        console.log(`\n📝 Question ${index + 1}/${questions.length}:`);
        console.log(`   Q: ${question.question.substring(0, 60)}...`);
        console.log(`   A: ${userAnswer ? userAnswer.substring(0, 60) + '...' : '❌ NO ANSWER'}`);

        if (!userAnswer.trim()) {
          console.log('   ⚠️ Skipped - no answer provided');
          evaluationResults.push(null);
          continue;
        }

        let result: EvaluationResult | null = null;
        for (let attempt = 1; attempt <= 2; attempt++) {
          result = await evaluateAnswer({
            question: question.question,
            user_answer: userAnswer,
            ideal_answer: question.ideal_answer,
            keywords: question.keywords,
            role: interviewConfig.role,
          });

          if (result) {
            break;
          }

          console.warn(`   ⚠️ Comprehensive evaluation attempt ${attempt} failed, retrying...`);
          await new Promise(resolve => setTimeout(resolve, 600 * attempt));
        }

        if (!result) {
          const quickResult = await evaluateAnswerQuick({
            user_answer: userAnswer,
            ideal_answer: question.ideal_answer,
            keywords: question.keywords,
          });

          if (quickResult) {
            const quickTenScale = quickResult.score_percentage / 10;
            result = {
              final_score: Number(quickResult.score_percentage.toFixed(1)),
              score_breakdown: {
                embedding_score: quickResult.semantic_score,
                keyword_score: quickResult.keyword_score,
                technical_accuracy: Number(quickTenScale.toFixed(1)),
                clarity_score: Number(quickTenScale.toFixed(1)),
                depth_score: Number((quickTenScale * 0.9).toFixed(1)),
              },
              missing_concepts: [],
              strengths: ['Core meaning matched using semantic evaluation'],
              improvements: ['Detailed LLM feedback was unavailable for this question.'],
              grade: quickResult.score_percentage >= 70 ? 'B' : quickResult.score_percentage >= 50 ? 'C' : 'D',
            };
            console.log(`   ♻️ Quick fallback score: ${result.final_score}%`);
          }
        }

        if (result) {
          console.log(`   ✅ Score: ${result.final_score}% - Grade: ${result.grade}`);
          console.log(`   📊 Breakdown: Tech=${result.score_breakdown.technical_accuracy}/10, Clarity=${result.score_breakdown.clarity_score}/10`);
          console.log(`   💪 Strengths: ${result.strengths?.length || 0}, Improvements: ${result.improvements?.length || 0}`);
        } else {
          console.log('   ❌ Evaluation failed after retries and fallback');
        }

        evaluationResults.push(result);
      }
      
      // Filter out null results and calculate overall stats
      const validResults = evaluationResults.filter(r => r !== null) as EvaluationResult[];
      
      console.log(`\n✅ Evaluation Complete!`);
      console.log(`   Valid results: ${validResults.length}/${questions.length}`);
      
      // Calculate strict average score across ALL questions.
      // Unanswered/failed evaluations count as 0 to avoid inflated scores.
      const avgScore = questions.length > 0
        ? evaluationResults.reduce((sum, r) => sum + (r?.final_score || 0), 0) / questions.length
        : 0;
      
      if (validResults.length > 0) {
        console.log(`   📈 Strict average score (all questions): ${avgScore.toFixed(1)}%`);
        console.log(`   📊 Score range: ${Math.min(...validResults.map(r => r.final_score))}% - ${Math.max(...validResults.map(r => r.final_score))}%`);
      } else {
        console.log(`   ⚠️ All questions skipped - Score: 0%`);
      }
      
      // Get communication analytics summary
      const avgMetrics = getAverageMetrics();
      if (avgMetrics) {
        console.log(`\n📊 Communication Analytics Summary:`);
        console.log(`   Average WPM: ${avgMetrics.wordsPerMinute}`);
        console.log(`   Total filler words: ${avgMetrics.fillerWords.count}`);
        console.log(`   Average fluency: ${avgMetrics.fluencyScore}%`);
      }
      
      // Navigate to results page with evaluation data - use finalAnswers from ref
      // Works even if all questions skipped (score will be 0)
      navigate('/interview-results', {
        state: {
          questions: questions,
          answers: finalAnswers, // Use ref value, not state
          evaluations: evaluationResults,
          overallScore: Math.round(avgScore), // 0 if all skipped
          interviewConfig: interviewConfig,
          panelSummary: {
            boardroomMode: !!interviewConfig.boardroomMode,
            targetCompany: interviewConfig.targetCompany || 'General',
            companyTone: companyPersona.tone,
          },
          communicationAnalytics: allAnalytics, // Add analytics data
        }
      });
    } catch (error) {
      console.error('❌ Evaluation error:', error);
      navigate('/interview-results');
    } finally {
      setIsEvaluatingAll(false);
    }
  };

  const toggleCamera = () => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isCameraOn;
        setIsCameraOn(!isCameraOn);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const isLowTime = timeRemaining <= 30;

  return (
    <div className="h-screen w-full bg-[#0F172A] flex flex-col">
      {/* Top Bar */}
      <header className="bg-[#1E293B] border-b border-[#334155] px-6 py-3 flex items-center justify-between gap-4 flex-shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              if (streamRef.current) {
                streamRef.current.getTracks().forEach((track) => track.stop());
              }
              navigate("/dashboard");
            }}
            className="flex items-center gap-2 text-[#94A3B8] hover:text-white transition-colors"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: "0.875rem" }}
          >
            <ChevronLeft size={16} strokeWidth={2} />
            Exit
          </button>

          <div className="h-6 w-px bg-[#334155]" />

          <div className="flex items-center gap-2">
            <span
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 700,
                fontSize: "0.875rem",
                color: "#FFFFFF",
              }}
            >
              Question {currentQuestion + 1} of {totalQuestions}
            </span>
            {interviewConfig.boardroomMode && (
              <span
                className="px-2 py-0.5 rounded-md"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  backgroundColor: "#0B1220",
                  color: "#93C5FD",
                  border: "1px solid #334155",
                }}
              >
                Boardroom · {interviewConfig.targetCompany || 'General'}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Timer */}
          <div className="flex items-center gap-2">
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
              style={{
                backgroundColor: isLowTime ? "#7F1D1D" : "#1E293B",
                border: `1px solid ${isLowTime ? "#DC2626" : "#334155"}`,
              }}
            >
              <AlertCircle size={14} className={isLowTime ? "text-[#EF4444]" : "text-[#94A3B8]"} strokeWidth={2} />
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  color: isLowTime ? "#FCA5A5" : "#E2E8F0",
                }}
              >
                {formatTime(timeRemaining)}
              </span>
            </div>
          </div>

          {/* Audio toggle */}
          <button
            onClick={() => {
              const newSoundState = !isSoundOn;
              setIsSoundOn(newSoundState);
              if (!newSoundState) {
                stopSpeaking(); // Stop TTS when sound is muted
              }
            }}
            className="w-9 h-9 rounded-lg bg-[#334155] hover:bg-[#475569] flex items-center justify-center transition-colors"
            title={isSoundOn ? "Mute AI voice" : "Unmute AI voice"}
          >
            {isSoundOn ? (
              <Volume2 size={16} className="text-[#E2E8F0]" strokeWidth={2} />
            ) : (
              <VolumeX size={16} className="text-[#94A3B8]" strokeWidth={2} />
            )}
          </button>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-[#1E293B] px-6 pb-3">
        <div className="w-full h-1.5 bg-[#334155] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#2563EB] to-[#3B82F6] transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Main Stage */}
      <div className="flex-1 flex flex-col lg:flex-row gap-6 p-6 overflow-hidden">
        {/* Question Panel */}
        <div className="flex-1 flex flex-col bg-[#1E293B] rounded-2xl border border-[#334155] p-8 overflow-y-auto">
          <div className="flex items-start gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#2563EB]/10 flex items-center justify-center flex-shrink-0">
              <MessageSquare size={18} className="text-[#2563EB]" strokeWidth={2} />
            </div>
            <div className="flex-1">
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  color: "#94A3B8",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
              >
                Interview Question
              </span>
                {interviewConfig.boardroomMode && (
                  <p
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "0.75rem",
                      color: "#93C5FD",
                      marginTop: "4px",
                    }}
                  >
                    Active Panelist: {activePanel.name} · {companyPersona.tone}
                  </p>
                )}
              {isSpeaking && (
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex gap-1">
                    <div className="w-1 h-3 bg-[#10B981] rounded-full animate-pulse" style={{ animationDelay: '0s' }} />
                    <div className="w-1 h-3 bg-[#10B981] rounded-full animate-pulse" style={{ animationDelay: '0.1s' }} />
                    <div className="w-1 h-3 bg-[#10B981] rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                  </div>
                  <span
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "0.7rem",
                      color: "#10B981",
                      fontWeight: 500,
                    }}
                  >
                    AI is speaking...
                  </span>
                </div>
              )}
            </div>
          </div>

          {interviewConfig.boardroomMode && interruptionPrompt && (
            <div className="mb-4 p-3 rounded-xl border border-[#7C2D12] bg-[#431407]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      color: "#FDBA74",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      marginBottom: "4px",
                    }}
                  >
                    Live Interruption
                  </p>
                  <p
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "0.85rem",
                      color: "#FFEDD5",
                    }}
                  >
                    {interruptionPrompt}
                  </p>
                </div>
                <button
                  onClick={() => setInterruptionPrompt(null)}
                  className="px-3 py-1 rounded-lg border border-[#9A3412] bg-[#7C2D12] hover:bg-[#9A3412]"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.75rem",
                    color: "#FFEDD5",
                    fontWeight: 600,
                  }}
                >
                  Responded
                </button>
              </div>
            </div>
          )}

          <div className="flex-1 flex flex-col items-center justify-center gap-4">
            {isGenerating || !questions[currentQuestion] ? (
              questionError ? (
                <div className="flex flex-col items-center gap-3">
                  <AlertCircle size={48} className="text-[#EF4444]" strokeWidth={2} />
                  <p
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '1.125rem',
                      color: '#EF4444',
                      fontWeight: 600,
                    }}
                  >
                    Failed to generate question
                  </p>
                  <p
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '0.875rem',
                      color: '#94A3B8',
                      textAlign: 'center',
                      maxWidth: '400px',
                    }}
                  >
                    {questionError}
                  </p>
                  <button
                    onClick={() => window.location.reload()}
                    className="mt-4 px-6 py-2.5 rounded-xl bg-[#2563EB] text-white hover:bg-[#1D4ED8] transition-colors"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '0.875rem',
                      fontWeight: 600,
                    }}
                  >
                    Reload Page
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin"></div>
                  <p
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '1rem',
                      color: '#94A3B8',
                      fontWeight: 500,
                    }}
                  >
                    🧠 AI is generating your next question...
                  </p>
                  <p
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '0.75rem',
                      color: '#64748B',
                    }}
                  >
                    This may take a few seconds...
                  </p>
                </div>
              )
            ) : (
              <>
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 500,
                    fontSize: "clamp(1.25rem, 3vw, 1.75rem)",
                    color: "#F8FAFC",
                    lineHeight: 1.5,
                    textAlign: "center",
                  }}
                >
                  {questions[currentQuestion].question}
                </p>
                
                {/* Replay Question Button */}
                {isSoundOn && (
                  <button
                    onClick={() => {
                      console.log('🎵 Play button clicked - Using active interviewer voice');
                      setHasUserInteracted(true);
                      // Replay with active panel interviewer voice.
                      speakAs(activePanel, questions[currentQuestion].question);
                    }}
                    disabled={isSpeaking}
                    className="px-5 py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 hover:scale-105 active:scale-95"
                    style={{
                      backgroundColor: !hasUserInteracted ? '#10B981' : '#334155',
                      boxShadow: !hasUserInteracted ? '0 4px 20px rgba(16, 185, 129, 0.3)' : 'none',
                    }}
                    title={!hasUserInteracted ? "Click to hear question" : "Replay question"}
                  >
                    <Volume2 size={16} className={!hasUserInteracted ? "text-white" : "text-[#94A3B8]"} strokeWidth={2} />
                <span
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.8rem",
                    color: !hasUserInteracted ? "#FFFFFF" : "#94A3B8",
                    fontWeight: !hasUserInteracted ? 600 : 500,
                  }}
                >
                  {isSpeaking ? "🎵 Playing..." : !hasUserInteracted ? "🔊 Click to Hear Question" : "🔁 Replay Question"}
                </span>
              </button>
            )}
              </>
            )}
          </div>

          {/* Tips */}
          <div className="mt-6 p-4 rounded-xl bg-[#0F172A] border border-[#334155]">
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.8rem",
                color: "#94A3B8",
                lineHeight: 1.6,
              }}
            >
              <span className="text-[#60A5FA] font-semibold">💡 Tip:</span> Use the STAR method (Situation, Task,
              Action, Result) to structure your answer effectively.
            </p>
          </div>

          {interviewConfig.boardroomMode && (
            <div className="mt-5 p-4 rounded-xl bg-[#0B1220] border border-[#334155]">
              <div className="flex items-center justify-between mb-3">
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 700,
                    fontSize: "0.78rem",
                    color: "#BFDBFE",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  Boardroom Panel (Zoom Style)
                </p>
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.75rem",
                    color: "#94A3B8",
                  }}
                >
                  Active Speaker: {activePanel.name}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <ZoomTile
                  title={panelInterviewers[0].name}
                  subtitle="Behavioral & culture fit"
                  isActive={activeSpeakerId === panelInterviewers[0].id || activePanel.id === panelInterviewers[0].id}
                  color="#A855F7"
                  initials="HR"
                />
                <ZoomTile
                  title={panelInterviewers[1].name}
                  subtitle="Technical depth & architecture"
                  isActive={activeSpeakerId === panelInterviewers[1].id || activePanel.id === panelInterviewers[1].id}
                  color="#2563EB"
                  initials="TE"
                />
                <ZoomTile
                  title={panelInterviewers[2].name}
                  subtitle="Case logic & trade-offs"
                  isActive={activeSpeakerId === panelInterviewers[2].id || activePanel.id === panelInterviewers[2].id}
                  color="#F59E0B"
                  initials="PS"
                />
                <ZoomTile
                  title={panelInterviewers[3].name}
                  subtitle="Clarity under pressure"
                  isActive={activeSpeakerId === panelInterviewers[3].id || activePanel.id === panelInterviewers[3].id}
                  color="#10B981"
                  initials="CE"
                />
              </div>

              <div className="mt-3">
                <ZoomTile
                  title="You (Interviewee)"
                  subtitle="Respond clearly, concisely, and with measurable impact"
                  isActive={isRecording || isWhisperRecording}
                  color="#0EA5E9"
                  initials="YOU"
                />
              </div>
            </div>
          )}
        </div>

        {/* Camera Panel */}
        <div className="w-full lg:w-80 flex flex-col gap-4">
          <div className="relative bg-[#1E293B] rounded-2xl border border-[#334155] overflow-hidden aspect-[3/4] lg:aspect-auto lg:h-80">
            {cameraPermission === "denied" ? (
              <div className="absolute inset-0 bg-[#0F172A] flex items-center justify-center p-6">
                <div className="text-center">
                  <AlertCircle size={40} className="text-[#EF4444] mx-auto mb-3" strokeWidth={1.5} />
                  <p
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "0.875rem",
                      color: "#E2E8F0",
                      marginBottom: "8px",
                    }}
                  >
                    Camera Access Denied
                  </p>
                  <p
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "0.75rem",
                      color: "#64748B",
                      lineHeight: 1.5,
                    }}
                  >
                    Please allow camera access in your browser settings
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* Video Feed */}
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ transform: "scaleX(-1)", display: isCameraOn ? "block" : "none" }}
                />

                {/* Camera Off Overlay */}
                {!isCameraOn && (
                  <div className="absolute inset-0 bg-[#0F172A] flex items-center justify-center">
                    <div className="text-center">
                      <CameraOff size={40} className="text-[#475569] mx-auto mb-2" strokeWidth={1.5} />
                      <p
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: "0.875rem",
                          color: "#64748B",
                        }}
                      >
                        Camera Off
                      </p>
                    </div>
                  </div>
                )}

                {/* Recording indicator */}
                {isRecording && (
                  <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#7F1D1D] border border-[#DC2626]">
                    <div
                      className="w-2 h-2 rounded-full bg-[#EF4444]"
                      style={{
                        animation: "pulse 1.5s ease-in-out infinite",
                      }}
                    />
                    <span
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 600,
                        fontSize: "0.75rem",
                        color: "#FCA5A5",
                      }}
                    >
                      Recording
                    </span>
                  </div>
                )}

                {/* Camera toggle */}
                <button
                  onClick={toggleCamera}
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-[#334155] hover:bg-[#475569] flex items-center justify-center transition-colors"
                >
                  {isCameraOn ? (
                    <Camera size={16} className="text-[#E2E8F0]" strokeWidth={2} />
                  ) : (
                    <CameraOff size={16} className="text-[#94A3B8]" strokeWidth={2} />
                  )}
                </button>
              </>
            )}
          </div>

          {/* Audio Waveform Visualization */}
          {inputMode === "voice" && (
            <div className="bg-[#1E293B] rounded-xl border border-[#334155] p-4">
              <div className="flex items-center gap-2 mb-2">
                <Activity size={14} className="text-[#60A5FA]" strokeWidth={2} />
                <span
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.75rem",
                    color: "#94A3B8",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Audio Level
                </span>
              </div>
              <canvas ref={canvasRef} width={280} height={60} className="w-full h-15 rounded" />
            </div>
          )}

          {/* Quick skip */}
          <button
            onClick={handleNext}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#334155] hover:bg-[#475569] border border-[#475569] transition-colors"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 500,
              fontSize: "0.875rem",
              color: "#94A3B8",
            }}
          >
            <SkipForward size={14} strokeWidth={2} />
            Skip Question
          </button>
        </div>
      </div>

      {/* Input Controls */}
      <div className="bg-[#1E293B] border-t border-[#334155] px-6 py-5 flex-shrink-0">
        <div className="max-w-4xl mx-auto flex flex-col gap-4">
          {/* Mode Toggle */}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => {
                if (isRecording) stopRecording();
                resetTranscript();
                setInputMode("voice");
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-150"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                fontSize: "0.875rem",
                backgroundColor: inputMode === "voice" ? "#2563EB" : "#334155",
                color: inputMode === "voice" ? "#FFFFFF" : "#94A3B8",
              }}
            >
              <Mic size={14} strokeWidth={2} />
              Voice Answer
            </button>
            <button
              onClick={() => {
                if (isRecording) stopRecording();
                resetTranscript();
                setInputMode("text");
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-150"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                fontSize: "0.875rem",
                backgroundColor: inputMode === "text" ? "#2563EB" : "#334155",
                color: inputMode === "text" ? "#FFFFFF" : "#94A3B8",
              }}
            >
              <MessageSquare size={14} strokeWidth={2} />
              Type Answer
            </button>
          </div>

          {/* Input Area */}
          {inputMode === "voice" ? (
            <div className="flex flex-col gap-4">
              {/* Voice Error Display */}
              {voiceError && (
                <div className="px-4 py-3 bg-[#7F1D1D] border border-[#DC2626] rounded-xl">
                  <p
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "0.875rem",
                      color: "#FCA5A5",
                    }}
                  >
                    ⚠️ {voiceError}
                  </p>
                </div>
              )}

              {/* Status Messages */}
              {isWhisperRecording && !transcript && (
                <div className="px-4 py-3 bg-[#1E3A8A] border border-[#3B82F6] rounded-xl">
                  <p
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "0.875rem",
                      color: "#93C5FD",
                      textAlign: "center",
                    }}
                  >
                    🎤 Recording... Speak clearly at normal volume
                  </p>
                </div>
              )}

              {/* Transcript Display */}
              {transcript && (
                <div className="px-4 py-3 bg-[#0F172A] border border-[#10B981] rounded-xl min-h-[100px] max-h-[200px] overflow-y-auto">
                  <div className="flex items-start gap-2 mb-2">
                    <Activity size={14} className="text-[#10B981] mt-0.5 flex-shrink-0" strokeWidth={2} />
                    <span
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        color: "#10B981",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      Your Answer:
                    </span>
                  </div>
                  <p
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "0.875rem",
                      color: "#E2E8F0",
                      lineHeight: 1.6,
                    }}
                  >
                    {transcript}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={toggleRecording}
                  className="w-16 h-16 rounded-full flex items-center justify-center transition-all duration-150 relative"
                  style={{
                    backgroundColor: isRecording ? "#DC2626" : "#2563EB",
                    boxShadow: isRecording
                      ? `0 0 0 ${4 + audioLevel / 10}px rgba(220, 38, 38, 0.2), 0 8px 32px rgba(220, 38, 38, 0.4)`
                      : "0 0 0 4px rgba(37, 99, 235, 0.2), 0 8px 32px rgba(37, 99, 235, 0.4)",
                    transform: isRecording ? `scale(${1 + audioLevel / 1000})` : "scale(1)",
                  }}
                  title={isRecording ? "Click to stop recording" : "Click to start speaking"}
                >
                  {isRecording ? (
                    <MicOff size={24} className="text-white" strokeWidth={2} />
                  ) : (
                    <Mic size={24} className="text-white" strokeWidth={2} />
                  )}
                  
                  {/* Pulsing ring when recording */}
                  {isRecording && (
                    <div 
                      className="absolute inset-0 rounded-full border-2 border-white animate-ping"
                      style={{ opacity: 0.3 }}
                    />
                  )}
                </button>
                
                <div className="flex-1 max-w-md">
                  <p
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "0.875rem",
                      fontWeight: isRecording ? 600 : 500,
                      color: isRecording ? "#FCA5A5" : "#94A3B8",
                      textAlign: "center",
                    }}
                  >
                    {isRecording 
                      ? "🎤 Recording... Speak clearly at normal volume" 
                      : "Click the microphone and speak your answer"}
                  </p>
                  {isRecording && (
                    <p
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "0.75rem",
                        color: "#64748B",
                        textAlign: "center",
                        marginTop: "4px",
                      }}
                    >
                      💡 Tip: Speak continuously, the system will pick up your words
                    </p>
                  )}
                </div>
                
                <button
                  onClick={handleSubmit}
                  disabled={!transcript.trim() || isEvaluating}
                  className="px-6 py-3 rounded-xl transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 700,
                    fontSize: "0.875rem",
                    backgroundColor: "#10B981",
                    color: "#FFFFFF",
                    boxShadow: transcript.trim() && !isEvaluating ? "0 4px 20px rgba(16, 185, 129, 0.3)" : "none",
                  }}
                >
                  {isEvaluating ? "Evaluating..." : "Submit & Next"}
                </button>
              </div>

              {/* Help text */}
              {!transcript && !isRecording && (
                <div className="text-center">
                  <p
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "0.75rem",
                      color: "#64748B",
                      lineHeight: 1.5,
                    }}
                  >
                    ℹ️ Make sure your browser has microphone permission enabled.
                    <br />
                    Speak at normal volume - no need to shout or get too close to the mic.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <textarea
                  value={textAnswer}
                  onChange={(e) => setTextAnswer(e.target.value)}
                  placeholder="Type your answer here..."
                  rows={4}
                  className="w-full px-4 py-3 bg-[#0F172A] border border-[#334155] rounded-xl text-[#E2E8F0] placeholder-[#64748B] outline-none focus:border-[#2563EB] transition-colors resize-none"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.875rem",
                    lineHeight: 1.6,
                  }}
                />
              </div>
              <button
                onClick={handleSubmit}
                disabled={!textAnswer.trim() || isEvaluating}
                className="px-6 py-3 rounded-xl transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed self-end"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 700,
                  fontSize: "0.875rem",
                  backgroundColor: "#10B981",
                  color: "#FFFFFF",
                  boxShadow: textAnswer.trim() && !isEvaluating ? "0 4px 20px rgba(16, 185, 129, 0.3)" : "none",
                }}
              >
                {isEvaluating ? "Evaluating..." : "Submit & Next"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Loading Overlay for Final Evaluation */}
      {isEvaluatingAll && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#1E293B] rounded-2xl border border-[#334155] p-8 text-center max-w-md">
            <div className="w-16 h-16 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '1.25rem',
                color: '#F8FAFC',
                fontWeight: 600,
              }}
            >
              Evaluating Your Interview
            </p>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.875rem',
                color: '#94A3B8',
                marginTop: '8px',
              }}
            >
              AI is analyzing all your responses and generating comprehensive feedback...
            </p>
            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-[#64748B]">
              <div className="w-2 h-2 bg-[#2563EB] rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-[#2563EB] rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
              <div className="w-2 h-2 bg-[#2563EB] rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
