/**
 * Custom hook for audio recording and transcription using Groq Whisper API
 * More reliable than Web Speech API
 */
import { useState, useRef, useCallback } from 'react';

interface UseWhisperRecognitionReturn {
  transcript: string;
  isRecording: boolean;
  error: string | null;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<void>;
  resetTranscript: () => void;
}

const API_BASE_URL = 'http://localhost:8000';

export function useWhisperRecognition(): UseWhisperRecognitionReturn {
  const [transcript, setTranscript] = useState<string>('');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const startRecording = useCallback(async () => {
    try {
      console.log('🎤 Starting Whisper recording...');
      setError(null);
      
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        } 
      });
      
      streamRef.current = stream;
      audioChunksRef.current = [];
      
      // Create MediaRecorder with webm format (widely supported)
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : 'audio/webm';
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType,
        audioBitsPerSecond: 128000, // Good quality for speech
      });
      
      mediaRecorderRef.current = mediaRecorder;
      
      // Collect audio data
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
          console.log('📦 Audio chunk received:', event.data.size, 'bytes');
        }
      };
      
      // Handle recording stop
      mediaRecorder.onstop = async () => {
        console.log('⏹️ Recording stopped, processing...');
        await processAudio();
      };
      
      mediaRecorder.onerror = (event: any) => {
        console.error('❌ MediaRecorder error:', event.error);
        setError(`Recording error: ${event.error?.message || 'Unknown error'}`);
      };
      
      // Start recording
      mediaRecorder.start(1000); // Collect data every 1 second
      setIsRecording(true);
      console.log('✅ Recording started');
      
    } catch (err: any) {
      console.error('❌ Failed to start recording:', err);
      setError(`Failed to start recording: ${err.message}`);
      setIsRecording(false);
    }
  }, []);

  const stopRecording = useCallback(async () => {
    console.log('🛑 Stopping recording...');
    
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
    
    // Stop all tracks
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
        console.log('🔇 Audio track stopped');
      });
      streamRef.current = null;
    }
  }, []);

  const processAudio = async () => {
    try {
      if (audioChunksRef.current.length === 0) {
        console.warn('⚠️ No audio data to process');
        setError('No audio recorded');
        return;
      }

      console.log('🔄 Processing audio chunks:', audioChunksRef.current.length);
      
      // Create audio blob
      const mimeType = mediaRecorderRef.current?.mimeType || 'audio/webm';
      const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
      
      console.log('📤 Sending audio to server:', audioBlob.size, 'bytes');
      
      // Send to backend for transcription
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');
      
      const response = await fetch(`${API_BASE_URL}/api/interview/transcribe`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Transcription failed');
      }
      
      const data = await response.json();
      console.log('✅ Transcription received:', data.transcript);
      
      setTranscript(data.transcript);
      setError(null);
      
    } catch (err: any) {
      console.error('❌ Error processing audio:', err);
      setError(`Transcription error: ${err.message}`);
    } finally {
      // Clean up
      audioChunksRef.current = [];
      mediaRecorderRef.current = null;
    }
  };

  const resetTranscript = useCallback(() => {
    console.log('🔄 Transcript reset');
    setTranscript('');
    setError(null);
  }, []);

  return {
    transcript,
    isRecording,
    error,
    startRecording,
    stopRecording,
    resetTranscript,
  };
}
