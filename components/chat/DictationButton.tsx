"use client";

import { useState, useRef, useCallback } from "react";

interface DictationButtonProps {
  onTranscript: (text: string) => void;
}

export default function DictationButton({ onTranscript }: DictationButtonProps) {
  const [isRecording, setIsRecording] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  const toggle = useCallback(() => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognitionCtor =
      (window as any).SpeechRecognition ?? (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionCtor) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognitionCtor();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      const last = event.results[event.results.length - 1];
      if (last.isFinal) {
        onTranscript(last[0].transcript);
      }
    };

    recognition.onend = () => setIsRecording(false);
    recognition.onerror = () => setIsRecording(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
  }, [isRecording, onTranscript]);

  return (
    <button
      className="win98-toolbar-btn"
      onClick={toggle}
      title={isRecording ? "Stop dictation" : "Start dictation"}
      style={{ position: "relative" }}
    >
      🎤
      {isRecording && (
        <span
          className="dictation-pulse"
          style={{
            position: "absolute",
            top: 1,
            right: 1,
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "#ff0000",
          }}
        />
      )}
    </button>
  );
}
