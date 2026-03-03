/**
 * Custom hook for Text-to-Speech using Web Speech Synthesis API
 * Makes the AI read questions aloud
 */
import { useState, useEffect, useCallback, useRef } from 'react';

interface UseSpeechSynthesisReturn {
  speak: (text: string) => void;
  stop: () => void;
  isSpeaking: boolean;
  isSupported: boolean;
  voices: SpeechSynthesisVoice[];
  selectedVoice: SpeechSynthesisVoice | null;
  setSelectedVoice: (voice: SpeechSynthesisVoice | null) => void;
}

export function useSpeechSynthesis(): UseSpeechSynthesisReturn {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Check if Speech Synthesis is supported
  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  // Log support status on mount
  useEffect(() => {
    console.log('🎙️ Speech Synthesis supported:', isSupported);
    if (isSupported) {
      console.log('📋 SpeechSynthesis API available');
    }
  }, [isSupported]);

  // Load available voices
  useEffect(() => {
    if (!isSupported) return;

    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      console.log('🔊 Available voices:', availableVoices.map(v => `${v.name} (${v.lang})`));
      setVoices(availableVoices);

      // Auto-select Indian voice (prefer English-India, then Hindi, then any English)
      if (!selectedVoice && availableVoices.length > 0) {
        const preferredVoice = 
          // First try: English (India) voices
          availableVoices.find((voice) => 
            voice.lang.includes('en-IN') || voice.lang.includes('en_IN')
          ) ||
          // Second try: Hindi voices
          availableVoices.find((voice) => 
            voice.lang.includes('hi') || voice.lang.includes('Hindi')
          ) ||
          // Third try: Any Indian-sounding name
          availableVoices.find((voice) => 
            voice.name.includes('Rishi') || 
            voice.name.includes('Veena') ||
            voice.name.includes('India')
          ) ||
          // Fourth try: Any English voice with Female/Good quality
          availableVoices.find((voice) =>
            voice.lang.startsWith('en') &&
            (voice.name.includes('Google') || voice.name.includes('Female'))
          ) ||
          // Last resort: First English voice
          availableVoices.find((voice) => voice.lang.startsWith('en')) ||
          availableVoices[0];

        console.log('🎙️ Selected voice:', preferredVoice?.name, preferredVoice?.lang);
        setSelectedVoice(preferredVoice);
      }
    };

    loadVoices();

    // Voices might load asynchronously
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices);

    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
    };
  }, [isSupported, selectedVoice]);

  const speak = useCallback(
    (text: string) => {
      if (!isSupported) {
        console.error('❌ Speech Synthesis not supported');
        return;
      }
      
      if (!text) {
        console.warn('⚠️ No text to speak');
        return;
      }

      console.log('🎤 Speaking:', text.substring(0, 50) + '...');

      // Only cancel if currently speaking
      if (window.speechSynthesis.speaking) {
        console.log('⏹️ Canceling current speech');
        window.speechSynthesis.cancel();
      }

      // Get voices to ensure they're loaded
      const currentVoices = window.speechSynthesis.getVoices();
      let voiceToUse = selectedVoice;
      
      // If no voice selected or voice not in current list, find one
      if (!voiceToUse || !currentVoices.includes(voiceToUse)) {
        console.log('🔍 Selecting voice from available:', currentVoices.length);
        voiceToUse = currentVoices.find((voice) => 
          voice.lang.includes('en-IN') || voice.lang.includes('en_IN')
        ) || currentVoices.find((voice) => voice.lang.startsWith('en')) || currentVoices[0];
        
        if (voiceToUse) {
          setSelectedVoice(voiceToUse);
        }
      }

      // Create utterance
      const utterance = new SpeechSynthesisUtterance(text);
      utteranceRef.current = utterance;

      // Configure utterance
      if (voiceToUse) {
        utterance.voice = voiceToUse;
        console.log('🎙️ Using voice:', voiceToUse.name, voiceToUse.lang);
      } else {
        console.warn('⚠️ No voice available, using default');
      }
      
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      utterance.lang = 'en-IN';

      // Event handlers
      utterance.onstart = () => {
        console.log('🔊 TTS started successfully!');
        setIsSpeaking(true);
      };

      utterance.onend = () => {
        console.log('🔇 TTS ended');
        setIsSpeaking(false);
        utteranceRef.current = null;
      };

      utterance.onerror = (event) => {
        if (event.error === 'canceled') {
          console.log('ℹ️ TTS canceled');
        } else {
          console.error('❌ TTS error:', event.error);
        }
        setIsSpeaking(false);
        utteranceRef.current = null;
      };

      // Chrome-specific fix: Resume speech synthesis first
      if (window.speechSynthesis.paused) {
        console.log('▶️ Resuming paused speech synthesis (Chrome fix)');
        window.speechSynthesis.resume();
      }

      // Speak immediately
      console.log('📢 Calling speechSynthesis.speak() NOW');
      window.speechSynthesis.speak(utterance);
      
      // Chrome fix: Force resume after speak to ensure it starts
      setTimeout(() => {
        if (window.speechSynthesis.paused) {
          console.log('▶️ Force resume for Chrome compatibility');
          window.speechSynthesis.resume();
        }
      }, 100);
      
      console.log('✅ Speech queued. Speaking:', window.speechSynthesis.speaking, 'Pending:', window.speechSynthesis.pending);
    },
    [isSupported, selectedVoice]
  );

  const stop = useCallback(() => {
    if (!isSupported) return;

    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    utteranceRef.current = null;
    console.log('⏹️ TTS stopped');
  }, [isSupported]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isSupported) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isSupported]);

  return {
    speak,
    stop,
    isSpeaking,
    isSupported,
    voices,
    selectedVoice,
    setSelectedVoice,
  };
}
