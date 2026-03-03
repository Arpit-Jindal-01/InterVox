/**
 * Sarvam AI Text-to-Speech Hook
 * Uses Indian voice synthesis via backend API
 */
import { useState, useCallback, useRef } from 'react';

const BACKEND_URL = 'http://localhost:8000';

interface SarvamTTSOptions {
  language?: string;
  speaker?: string;
}

export function useSarvamTTS() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Initialize audio context on first user interaction
  const initAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      console.log('🎧 Audio Context initialized');
    }
  }, []);

  const speak = useCallback(async (
    text: string,
    options: SarvamTTSOptions = {}
  ) => {
    if (!text) {
      console.warn('⚠️ No text to speak');
      return;
    }

    try {
      console.log('🗣️ Sarvam TTS Request:', text.substring(0, 50) + '...');
      setError(null);
      
      // Stop any currently playing audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      // Initialize audio context if needed (for Chrome)
      initAudioContext();
      
      // Resume audio context (Chrome autoplay policy)
      if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
        console.log('▶️ Audio Context resumed');
      }

      setIsSpeaking(true);

      // Call backend TTS API
      const params = new URLSearchParams({
        text: text,
        language: options.language || 'en-IN',
        speaker: options.speaker || 'meera',
      });

      console.log('📡 Fetching audio from Sarvam AI...');
      const response = await fetch(
        `${BACKEND_URL}/api/interview/text-to-speech?${params}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`TTS API error: ${response.status}`);
      }

      // Get audio blob
      const audioBlob = await response.blob();
      console.log('✅ Audio received:', audioBlob.size, 'bytes');

      // Create audio URL and play
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onplay = () => {
        console.log('🔊 Sarvam TTS started playing!');
        setIsSpeaking(true);
      };

      audio.onended = () => {
        console.log('🔇 Sarvam TTS ended');
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
        audioRef.current = null;
      };

      audio.onerror = (e) => {
        console.error('❌ Audio playback error:', e);
        setError('Audio playback failed');
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
        audioRef.current = null;
      };

      // Play audio
      await audio.play();
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('❌ Sarvam TTS error:', errorMessage);
      setError(errorMessage);
      setIsSpeaking(false);
    }
  }, [initAudioContext]);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setIsSpeaking(false);
    console.log('⏹️ Sarvam TTS stopped');
  }, []);

  return {
    speak,
    stop,
    isSpeaking,
    error,
    // Available speakers (Sarvam AI v3)
    speakers: {
      kavya: { name: 'Kavya', gender: 'female', description: 'Professional Indian female voice' },
      amit: { name: 'Amit', gender: 'male', description: 'Warm Indian male voice' },
      priya: { name: 'Priya', gender: 'female', description: 'Friendly Indian female voice' },
      neha: { name: 'Neha', gender: 'female', description: 'Professional Indian female voice' },
    },
  };
}
