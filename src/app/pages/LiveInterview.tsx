import { useState, useEffect, useRef } from "react";
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
import { useNavigate } from "react-router";
import { useWhisperRecognition } from "../../hooks/useWhisperRecognition";
import { useSarvamTTS } from "../../hooks/useSarvamTTS";

const mockQuestions = [
  "Tell me about yourself and your background.",
  "What are your greatest strengths and how have you applied them in your previous role?",
  "Describe a challenging project you worked on and how you overcame obstacles.",
  "Where do you see yourself in 5 years?",
  "Why are you interested in this position?",
  "Tell me about a time when you disagreed with a team member. How did you handle it?",
  "What is your biggest professional achievement?",
  "How do you handle stress and pressure?",
  "What motivates you in your work?",
  "Do you have any questions for us?",
];

type InputMode = "voice" | "text";

export default function LiveInterview() {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const animationFrameRef = useRef<number>();
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previousQuestionRef = useRef<number>(-1); // Track previous question

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

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [inputMode, setInputMode] = useState<InputMode>("voice");
  const [isRecording, setIsRecording] = useState(false);
  const [textAnswer, setTextAnswer] = useState("");
  const [timeRemaining, setTimeRemaining] = useState(120);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [hasUserInteracted, setHasUserInteracted] = useState(false); // Track user interaction for autoplay
  const [cameraPermission, setCameraPermission] = useState<"granted" | "denied" | "prompt">("prompt");
  const [audioLevel, setAudioLevel] = useState(0);

  const totalQuestions = mockQuestions.length;
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  // Auto-read question aloud when question changes (only after user interaction)
  useEffect(() => {
    console.log('🎯 useEffect triggered - Current:', currentQuestion, 'Previous:', previousQuestionRef.current, 'Sound:', isSoundOn, 'User interacted:', hasUserInteracted);
    
    // Only auto-speak if:
    // 1. Question number actually changed (not first button click)
    // 2. Sound is on and user has interacted
    const questionChanged = previousQuestionRef.current !== currentQuestion && previousQuestionRef.current !== -1;
    
    if (questionChanged && isSoundOn && hasUserInteracted && mockQuestions[currentQuestion]) {
      console.log('🔊 Question CHANGED - Auto-speaking with Sarvam AI:', mockQuestions[currentQuestion].substring(0, 50));
      
      // Stop any current speech before starting new one
      stopSpeaking();
      
      // Small delay to ensure previous speech is fully stopped
      setTimeout(() => {
        speak(mockQuestions[currentQuestion], { language: 'en-IN', speaker: 'kavya' });
      }, 150);
    }
    
    // Update previous question tracker
    previousQuestionRef.current = currentQuestion;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestion, isSoundOn, hasUserInteracted]);

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

  const handleNext = () => {
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
      setCurrentQuestion((prev) => prev + 1);
      setTextAnswer("");
      setTimeRemaining(120);
      console.log('✅ Ready for next question');
    } else {
      navigate("/interview-results");
    }
  };

  const startRecording = async () => {
    try {
      console.log('🎤 Starting recording with Whisper...');
      
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

  const handleSubmit = () => {
    console.log('📤 Submitting answer...');
    
    if (isRecording) {
      stopRecording();
    }
    
    // Small delay to ensure recording stops completely before moving to next question
    setTimeout(() => {
      // Reset transcript for next question
      resetTranscript();
      handleNext();
    }, 100);
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

          <div className="flex-1 flex flex-col items-center justify-center gap-4">
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
              {mockQuestions[currentQuestion]}
            </p>
            
            {/* Replay Question Button */}
            {isSoundOn && (
              <button
                onClick={() => {
                  console.log('🎵 Play button clicked - Using Sarvam AI (Kavya voice)');
                  setHasUserInteracted(true);
                  // Sarvam AI TTS with Indian voice
                  speak(mockQuestions[currentQuestion], { language: 'en-IN', speaker: 'kavya' });
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
                  disabled={!transcript.trim()}
                  className="px-6 py-3 rounded-xl transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 700,
                    fontSize: "0.875rem",
                    backgroundColor: "#10B981",
                    color: "#FFFFFF",
                    boxShadow: transcript.trim() ? "0 4px 20px rgba(16, 185, 129, 0.3)" : "none",
                  }}
                >
                  Submit & Next
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
                disabled={!textAnswer.trim()}
                className="px-6 py-3 rounded-xl transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed self-end"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 700,
                  fontSize: "0.875rem",
                  backgroundColor: "#10B981",
                  color: "#FFFFFF",
                  boxShadow: textAnswer.trim() ? "0 4px 20px rgba(16, 185, 129, 0.3)" : "none",
                }}
              >
                Submit & Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
