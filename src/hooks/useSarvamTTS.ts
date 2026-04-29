/**
 * Sarvam AI Text-to-Speech Hook
 * Uses Indian voice synthesis via backend API
 */
import { useState, useCallback, useRef } from 'react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

interface SarvamTTSOptions {
  provider?: 'sarvam' | 'system';
  language?: string;
  speaker?: string;
  pace?: number;
  playbackRate?: number;
  voiceHint?: string;
}

export function useSarvamTTS() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaSourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const loadSystemVoices = useCallback(async (): Promise<SpeechSynthesisVoice[]> => {
    if (!('speechSynthesis' in window)) {
      return [];
    }

    const synth = window.speechSynthesis;
    const initial = synth.getVoices();
    if (initial.length > 0) {
      return initial;
    }

    return new Promise((resolve) => {
      let settled = false;
      const finish = (voices: SpeechSynthesisVoice[]) => {
        if (!settled) {
          settled = true;
          resolve(voices);
        }
      };

      const timeout = window.setTimeout(() => {
        finish(synth.getVoices());
      }, 700);

      synth.onvoiceschanged = () => {
        window.clearTimeout(timeout);
        finish(synth.getVoices());
      };
    });
  }, []);

  const pickSystemVoice = useCallback((voices: SpeechSynthesisVoice[], hint?: string) => {
    if (!voices.length) {
      return null;
    }

    const englishVoices = voices.filter(v => /en-(IN|GB|US|AU|CA)/i.test(v.lang));
    const pool = englishVoices.length ? englishVoices : voices;

    const maleHints = hint === 'male_deep'
      ? ['daniel', 'alex', 'fred', 'aaron', 'rishi']
      : ['david', 'tom', 'nathan', 'james', 'ravi'];

    const byHint = pool.find(v => maleHints.some(m => v.name.toLowerCase().includes(m)));
    if (byHint) {
      return byHint;
    }

    const likelyMale = pool.find(v => {
      const n = v.name.toLowerCase();
      return !['female', 'zira', 'samantha', 'victoria', 'karen', 'moira'].some(f => n.includes(f));
    });
    return likelyMale || pool[0];
  }, []);

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

      if (utteranceRef.current) {
        window.speechSynthesis.cancel();
        utteranceRef.current = null;
      }
      
      // Stop any currently playing audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;
      }

      if (mediaSourceRef.current) {
        mediaSourceRef.current.disconnect();
        mediaSourceRef.current = null;
      }

      if (gainNodeRef.current) {
        gainNodeRef.current.disconnect();
        gainNodeRef.current = null;
      }

      // Initialize audio context if needed (for Chrome)
      initAudioContext();
      
      // Resume audio context (Chrome autoplay policy)
      if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
        console.log('▶️ Audio Context resumed');
      }

      setIsSpeaking(true);

      // Free, smooth system neural voices for additional panel variation.
      if (options.provider === 'system' && 'speechSynthesis' in window) {
        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(text);
        const voices = await loadSystemVoices();
        const selectedVoice = pickSystemVoice(voices, options.voiceHint);

        if (selectedVoice) {
          utterance.voice = selectedVoice;
          utterance.lang = selectedVoice.lang || 'en-IN';
        } else {
          utterance.lang = options.language || 'en-IN';
        }

        utterance.rate = Math.max(0.85, Math.min(1.05, options.playbackRate ?? 0.97));
        utterance.pitch = options.voiceHint === 'male_deep' ? 0.82 : 0.92;
        utterance.volume = 1;

        utterance.onstart = () => {
          console.log('🔊 System voice started');
          setIsSpeaking(true);
        };

        utterance.onend = () => {
          console.log('🔇 System voice ended');
          setIsSpeaking(false);
          utteranceRef.current = null;
        };

        utterance.onerror = () => {
          setError('System voice playback failed');
          setIsSpeaking(false);
          utteranceRef.current = null;
        };

        utteranceRef.current = utterance;
        synth.speak(utterance);
        return;
      }

      // Call backend TTS API
      const params = new URLSearchParams({
        text: text,
        language: options.language || 'en-IN',
        speaker: options.speaker || 'neha',
        pace: String(options.pace ?? 0.95),
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
      audio.preload = 'auto';
      audio.playbackRate = Math.max(0.9, Math.min(1.05, options.playbackRate ?? 0.98));
      (audio as any).preservesPitch = true;
      audioRef.current = audio;

      // Smoothen harsh peaks and improve voice warmth.
      if (audioContextRef.current) {
        const sourceNode = audioContextRef.current.createMediaElementSource(audio);
        const compressor = audioContextRef.current.createDynamicsCompressor();
        compressor.threshold.value = -24;
        compressor.knee.value = 30;
        compressor.ratio.value = 5;
        compressor.attack.value = 0.01;
        compressor.release.value = 0.16;

        const lowpass = audioContextRef.current.createBiquadFilter();
        lowpass.type = 'lowpass';
        lowpass.frequency.value = 7400;
        lowpass.Q.value = 0.6;

        const gainNode = audioContextRef.current.createGain();
        gainNode.gain.value = 0.0;

        sourceNode.connect(compressor);
        compressor.connect(lowpass);
        lowpass.connect(gainNode);
        gainNode.connect(audioContextRef.current.destination);

        mediaSourceRef.current = sourceNode;
        gainNodeRef.current = gainNode;
      }

      audio.onplay = () => {
        console.log('🔊 Sarvam TTS started playing!');
        setIsSpeaking(true);
        if (gainNodeRef.current && audioContextRef.current) {
          const now = audioContextRef.current.currentTime;
          gainNodeRef.current.gain.cancelScheduledValues(now);
          gainNodeRef.current.gain.setValueAtTime(0.0, now);
          gainNodeRef.current.gain.linearRampToValueAtTime(1.0, now + 0.08);
        }
      };

      audio.onended = () => {
        console.log('🔇 Sarvam TTS ended');
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
        audioRef.current = null;
        if (mediaSourceRef.current) {
          mediaSourceRef.current.disconnect();
          mediaSourceRef.current = null;
        }
        if (gainNodeRef.current) {
          gainNodeRef.current.disconnect();
          gainNodeRef.current = null;
        }
      };

      audio.onerror = (e) => {
        console.error('❌ Audio playback error:', e);
        setError('Audio playback failed');
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
        audioRef.current = null;
        if (mediaSourceRef.current) {
          mediaSourceRef.current.disconnect();
          mediaSourceRef.current = null;
        }
        if (gainNodeRef.current) {
          gainNodeRef.current.disconnect();
          gainNodeRef.current = null;
        }
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
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    utteranceRef.current = null;

    if (gainNodeRef.current && audioContextRef.current) {
      const now = audioContextRef.current.currentTime;
      const currentGain = gainNodeRef.current.gain.value;
      gainNodeRef.current.gain.cancelScheduledValues(now);
      gainNodeRef.current.gain.setValueAtTime(currentGain, now);
      gainNodeRef.current.gain.linearRampToValueAtTime(0.0, now + 0.06);
    }

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }

    if (mediaSourceRef.current) {
      mediaSourceRef.current.disconnect();
      mediaSourceRef.current = null;
    }

    if (gainNodeRef.current) {
      gainNodeRef.current.disconnect();
      gainNodeRef.current = null;
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
