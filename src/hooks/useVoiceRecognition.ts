/**
 * useVoiceRecognition Hook
 * 
 * Uses Web Speech API (FREE, browser-based) for speech-to-text
 * No API keys needed - completely client-side
 * Optimized for better sensitivity and reliability
 */

import { useState, useEffect, useRef } from 'react';

interface VoiceRecognitionHook {
  transcript: string;
  isListening: boolean;
  isSupported: boolean;
  error: string | null;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
}

export const useVoiceRecognition = (): VoiceRecognitionHook => {
  const [transcript, setTranscript] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const recognitionRef = useRef<any>(null);
  const isStoppedManually = useRef<boolean>(false);
  const restartTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    // Check if browser supports Web Speech API
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setIsSupported(true);
      
      // Initialize Speech Recognition
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      // ✅ OPTIMIZED SETTINGS for better performance
      recognitionRef.current.continuous = true; // Keep listening continuously
      recognitionRef.current.interimResults = true; // Show results as user speaks
      recognitionRef.current.lang = 'en-US'; // Language
      recognitionRef.current.maxAlternatives = 3; // Get multiple alternatives for accuracy
      
      // Event: On start
      recognitionRef.current.onstart = () => {
        console.log('🎤 Voice recognition started');
        setIsListening(true);
        setError(null);
      };
      
      // Event: On result (transcript received)
      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';
        
        // Process all results
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          
          if (event.results[i].isFinal) {
            // Final result - append with space
            finalTranscript += transcript + ' ';
          } else {
            // Interim result - show temporarily
            interimTranscript += transcript;
          }
        }
        
        // Update transcript with final results
        if (finalTranscript) {
          setTranscript((prev) => prev + finalTranscript);
        }
        
        // Also show interim results in console for debugging
        if (interimTranscript) {
          console.log('🗣️ Interim:', interimTranscript);
        }
      };
      
      // Event: On error
      recognitionRef.current.onerror = (event: any) => {
        console.error('❌ Speech recognition error:', event.error);
        
        // Handle different error types
        if (event.error === 'no-speech') {
          console.log('⚠️ No speech detected, continuing to listen...');
          // Don't show error for no-speech, just continue
          setError(null);
        } else if (event.error === 'audio-capture') {
          setError('Microphone not found or permission denied. Please check your settings.');
          setIsListening(false);
        } else if (event.error === 'not-allowed') {
          setError('Microphone access denied. Please allow microphone permission.');
          setIsListening(false);
        } else if (event.error === 'network') {
          setError('Network error. Please check your internet connection.');
          // Try to restart
          if (!isStoppedManually.current && isListening) {
            console.log('🔄 Attempting to restart after network error...');
            restartRecognition();
          }
        } else {
          setError(`Error: ${event.error}`);
        }
      };
      
      // Event: On end (recognition stopped)
      recognitionRef.current.onend = () => {
        console.log('🛑 Voice recognition ended');
        
        // Auto-restart if not manually stopped
        if (!isStoppedManually.current && isListening) {
          console.log('🔄 Auto-restarting recognition...');
          restartRecognition();
        } else {
          setIsListening(false);
        }
      };
      
      // Event: On audio start
      recognitionRef.current.onaudiostart = () => {
        console.log('🔊 Audio capturing started');
      };
      
      // Event: On audio end
      recognitionRef.current.onaudioend = () => {
        console.log('🔇 Audio capturing ended');
      };
      
      // Event: On sound start (speech detected)
      recognitionRef.current.onsoundstart = () => {
        console.log('🎵 Sound detected');
      };
      
      // Event: On speech start
      recognitionRef.current.onspeechstart = () => {
        console.log('🗣️ Speech detected');
        setError(null); // Clear any previous errors
      };
      
    } else {
      setIsSupported(false);
      setError('Speech recognition not supported in this browser. Please use Chrome, Edge, or Safari.');
    }
    
    // Cleanup
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // Ignore errors on cleanup
        }
      }
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current);
      }
    };
  }, []);

  const restartRecognition = () => {
    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
    }
    
    // Wait a bit before restarting to avoid rapid restarts
    restartTimeoutRef.current = window.setTimeout(() => {
      if (!isStoppedManually.current && recognitionRef.current) {
        try {
          recognitionRef.current.start();
          console.log('✅ Recognition restarted successfully');
        } catch (err) {
          console.error('Failed to restart recognition:', err);
        }
      }
    }, 500);
  };

  const startListening = () => {
    if (!isSupported) {
      setError('Speech recognition not supported');
      return;
    }
    
    try {
      isStoppedManually.current = false;
      setError(null);
      recognitionRef.current.start();
      console.log('▶️ Starting voice recognition');
    } catch (err: any) {
      // If already started, just log
      if (err.message && err.message.includes('already started')) {
        console.log('ℹ️ Recognition already running');
        setIsListening(true);
      } else {
        console.error('Error starting recognition:', err);
        setError(err.message || 'Failed to start recording');
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      isStoppedManually.current = true;
      
      // Clear any pending restart
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current);
        restartTimeoutRef.current = null;
      }
      
      try {
        recognitionRef.current.stop();
        console.log('⏸️ Stopping voice recognition');
      } catch (err) {
        console.error('Error stopping recognition:', err);
      }
      
      setIsListening(false);
    }
  };

  const resetTranscript = () => {
    setTranscript('');
    setError(null);
    console.log('🔄 Transcript reset');
  };

  return {
    transcript,
    isListening,
    isSupported,
    error,
    startListening,
    stopListening,
    resetTranscript,
  };
};
