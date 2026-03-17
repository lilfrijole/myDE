"use client";

import { useState, useRef, useCallback } from "react";
import DictationButton from "./DictationButton";

const FONT_SIZES = [9, 11, 13, 16, 20, 24];
const EMOJI_GRID = [
  "😊", "😂", "🥲", "😍", "🤔", "😎", "🙄", "😤",
  "👍", "👎", "❤️", "🔥", "✨", "🎉", "💯", "🚀",
  "👀", "🤖", "💡", "⚡", "🐛", "✅", "❌", "⚠️",
  "📝", "📁", "💻", "🌐", "🔧", "🗑️", "📦", "🎯",
];

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [text, setText] = useState("");
  const [fontSize, setFontSize] = useState(11);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTranscript = (transcript: string) => {
    setText((prev) => prev + (prev ? " " : "") + transcript);
    textareaRef.current?.focus();
  };

  const wrapSelection = useCallback((before: string, after: string) => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = text.slice(start, end);

    if (selected) {
      const wrapped = before + selected + after;
      const newText = text.slice(0, start) + wrapped + text.slice(end);
      setText(newText);
      requestAnimationFrame(() => {
        ta.focus();
        ta.setSelectionRange(start + before.length, start + before.length + selected.length);
      });
    } else {
      const newText = text.slice(0, start) + before + after + text.slice(end);
      setText(newText);
      requestAnimationFrame(() => {
        ta.focus();
        ta.setSelectionRange(start + before.length, start + before.length);
      });
    }
  }, [text]);

  const handleBold = () => {
    setIsBold((b) => !b);
    wrapSelection("**", "**");
  };

  const handleItalic = () => {
    setIsItalic((b) => !b);
    wrapSelection("_", "_");
  };

  const handleUnderline = () => {
    setIsUnderline((b) => !b);
    wrapSelection("<u>", "</u>");
  };

  const handleLink = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = text.slice(start, end);
    const url = prompt("Enter URL:", "https://");
    if (!url) return;

    if (selected) {
      const link = `[${selected}](${url})`;
      setText(text.slice(0, start) + link + text.slice(end));
    } else {
      const label = prompt("Enter link text:", "link") ?? "link";
      const link = `[${label}](${url})`;
      setText(text.slice(0, start) + link + text.slice(end));
    }
    ta.focus();
  };

  const handleEmoji = (emoji: string) => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    setText(text.slice(0, start) + emoji + text.slice(start));
    setShowEmoji(false);
    requestAnimationFrame(() => {
      ta.focus();
      ta.setSelectionRange(start + emoji.length, start + emoji.length);
    });
  };

  const cycleFontSize = (direction: "up" | "down") => {
    const idx = FONT_SIZES.indexOf(fontSize);
    if (direction === "up" && idx < FONT_SIZES.length - 1) {
      setFontSize(FONT_SIZES[idx + 1]);
    } else if (direction === "down" && idx > 0) {
      setFontSize(FONT_SIZES[idx - 1]);
    }
    textareaRef.current?.focus();
  };

  const resetFontSize = () => {
    setFontSize(11);
    textareaRef.current?.focus();
  };

  return (
    <div style={{ borderTop: "1px solid var(--aim-button-shadow)", position: "relative" }}>
      {/* Formatting toolbar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          padding: "2px 4px",
          background: "var(--aim-button-face)",
          borderBottom: "1px solid var(--aim-button-shadow)",
        }}
      >
        <button
          className="win98-toolbar-btn"
          title="Increase font size"
          onClick={() => cycleFontSize("up")}
          style={{ fontWeight: "bold", fontSize: 14 }}
        >
          A
        </button>
        <button
          className="win98-toolbar-btn"
          title="Decrease font size"
          onClick={() => cycleFontSize("down")}
          style={{
            fontWeight: "bold",
            fontSize: 11,
            background: "var(--aim-button-face)",
            border: "1px solid var(--aim-button-shadow)",
          }}
        >
          A
        </button>
        <button
          className="win98-toolbar-btn"
          title="Small text"
          onClick={() => setFontSize(9)}
          style={{ fontSize: 9 }}
        >
          a
        </button>
        <button
          className="win98-toolbar-btn"
          title="Reset font size"
          onClick={resetFontSize}
          style={{ fontSize: 8 }}
        >
          A
        </button>
        <span className="win98-toolbar-separator" />
        <button
          className="win98-toolbar-btn"
          title="Bold (**text**)"
          onClick={handleBold}
          style={{
            background: isBold ? "var(--aim-accent)" : undefined,
            color: isBold ? "#fff" : undefined,
          }}
        >
          <b>B</b>
        </button>
        <button
          className="win98-toolbar-btn"
          title="Italic (_text_)"
          onClick={handleItalic}
          style={{
            background: isItalic ? "var(--aim-accent)" : undefined,
            color: isItalic ? "#fff" : undefined,
          }}
        >
          <i>I</i>
        </button>
        <button
          className="win98-toolbar-btn"
          title="Underline"
          onClick={handleUnderline}
          style={{
            background: isUnderline ? "var(--aim-accent)" : undefined,
            color: isUnderline ? "#fff" : undefined,
          }}
        >
          <u>U</u>
        </button>
        <span className="win98-toolbar-separator" />
        <button className="win98-toolbar-btn" title="Insert link" onClick={handleLink}>
          link
        </button>
        <button
          className="win98-toolbar-btn"
          title="Emoji"
          onClick={() => setShowEmoji((s) => !s)}
          style={{
            background: showEmoji ? "var(--aim-accent)" : undefined,
            color: showEmoji ? "#fff" : undefined,
          }}
        >
          😊
        </button>
        <div style={{ flex: 1 }} />
        <DictationButton onTranscript={handleTranscript} />
      </div>

      {/* Emoji picker popup */}
      {showEmoji && (
        <div
          style={{
            position: "absolute",
            bottom: "100%",
            left: 4,
            background: "var(--aim-button-face)",
            border: "2px solid",
            borderColor: "var(--aim-button-highlight) var(--aim-button-dark-shadow) var(--aim-button-dark-shadow) var(--aim-button-highlight)",
            padding: 6,
            display: "grid",
            gridTemplateColumns: "repeat(8, 1fr)",
            gap: 2,
            zIndex: 1000,
            boxShadow: "2px 2px 4px rgba(0,0,0,0.3)",
          }}
        >
          {EMOJI_GRID.map((emoji) => (
            <button
              key={emoji}
              onClick={() => handleEmoji(emoji)}
              style={{
                width: 28,
                height: 28,
                border: "1px solid transparent",
                background: "transparent",
                cursor: "pointer",
                fontSize: 16,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 2,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--aim-accent)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/* Text input area */}
      <div style={{ display: "flex", gap: 4, padding: 4, background: "var(--aim-button-face)" }}>
        <textarea
          ref={textareaRef}
          className="win98-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowEmoji(false)}
          placeholder="Type your message..."
          disabled={disabled}
          rows={3}
          style={{
            flex: 1,
            resize: "none",
            fontFamily: "var(--aim-font)",
            fontSize,
            fontWeight: isBold ? "bold" : "normal",
            fontStyle: isItalic ? "italic" : "normal",
            textDecoration: isUnderline ? "underline" : "none",
          }}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <button
            className="win98-button"
            onClick={handleSend}
            disabled={disabled || !text.trim()}
            style={{ minWidth: 60 }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
