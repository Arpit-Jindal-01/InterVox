/**
 * Voice Recognition Test Component
 * Simple component to test speech-to-text functionality
 */

import { useVoiceRecognition } from '../../hooks/useVoiceRecognition';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Mic, MicOff, Trash2 } from 'lucide-react';

export const VoiceRecognitionTest = () => {
  const {
    transcript,
    isListening,
    isSupported,
    error,
    startListening,
    stopListening,
    resetTranscript,
  } = useVoiceRecognition();

  if (!isSupported) {
    return (
      <Card className="p-6 max-w-2xl mx-auto mt-10">
        <div className="text-center text-red-600">
          <h2 className="text-xl font-bold mb-2">Speech Recognition Not Supported</h2>
          <p>Please use Chrome, Edge, or Safari browser.</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 max-w-2xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center">
        🎤 Voice Recognition Test
      </h2>

      {/* Status Indicator */}
      <div className="mb-4 text-center">
        {isListening ? (
          <div className="flex items-center justify-center gap-2 text-green-600">
            <Mic className="w-6 h-6 animate-pulse" />
            <span className="font-semibold">Listening...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2 text-gray-500">
            <MicOff className="w-6 h-6" />
            <span>Not listening</span>
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Controls */}
      <div className="flex gap-3 justify-center mb-6">
        <Button
          onClick={startListening}
          disabled={isListening}
          className="flex items-center gap-2"
        >
          <Mic className="w-4 h-4" />
          Start Recording
        </Button>
        
        <Button
          onClick={stopListening}
          disabled={!isListening}
          variant="destructive"
          className="flex items-center gap-2"
        >
          <MicOff className="w-4 h-4" />
          Stop Recording
        </Button>
        
        <Button
          onClick={resetTranscript}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Clear
        </Button>
      </div>

      {/* Transcript Display */}
      <div className="min-h-[200px] p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="text-sm font-semibold mb-2 text-gray-700">Transcript:</h3>
        {transcript ? (
          <p className="text-gray-900 whitespace-pre-wrap">{transcript}</p>
        ) : (
          <p className="text-gray-400 italic">
            Click "Start Recording" and speak...
          </p>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-4 text-sm text-gray-600">
        <p><strong>Instructions:</strong></p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>Click "Start Recording" to begin</li>
          <li>Speak clearly into your microphone</li>
          <li>Your speech will be converted to text in real-time</li>
          <li>Click "Stop Recording" when done</li>
          <li>Use "Clear" to reset the transcript</li>
        </ul>
      </div>
    </Card>
  );
};
