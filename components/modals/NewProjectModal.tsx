"use client";

import { useState, useRef, useEffect } from "react";

interface NewProjectModalProps {
  isOpen: boolean;
  onConfirm: (name: string) => void;
  onCancel: () => void;
}

export default function NewProjectModal({ isOpen, onConfirm, onCancel }: NewProjectModalProps) {
  const [name, setName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setName("");
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    const trimmed = name.trim();
    if (trimmed) onConfirm(trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSubmit();
    if (e.key === "Escape") onCancel();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.4)",
      }}
      onClick={onCancel}
    >
      <div
        className="win98-window"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 360,
          boxShadow: "4px 4px 0 rgba(0,0,0,0.3)",
        }}
      >
        {/* Title bar */}
        <div
          className="win98-titlebar"
          style={{ padding: "3px 6px", display: "flex", alignItems: "center", gap: 6 }}
        >
          <span style={{ fontSize: 12 }}>📁</span>
          <span style={{ fontWeight: "bold", fontSize: 11, color: "#fff", flex: 1 }}>
            New Project
          </span>
          <button
            onClick={onCancel}
            style={{
              width: 16,
              height: 14,
              background: "var(--aim-button-face)",
              border: "1px outset",
              cursor: "pointer",
              fontSize: 9,
              lineHeight: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: 16, background: "var(--aim-button-face)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <span style={{ fontSize: 32 }}>🏃</span>
            <div>
              <div style={{ fontWeight: "bold", fontSize: 12, marginBottom: 4 }}>
                What should we call this project?
              </div>
              <div style={{ fontSize: 10, color: "#666" }}>
                Give it a name you&apos;ll remember. You can always rename it later.
              </div>
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 11, marginBottom: 4, fontWeight: "bold" }}>
              Project Name:
            </label>
            <input
              ref={inputRef}
              className="win98-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="e.g. Cheese Store, Portfolio, My Cool App..."
              maxLength={60}
              style={{
                width: "100%",
                fontSize: 12,
                padding: "4px 6px",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 6 }}>
            <button
              className="win98-button"
              onClick={onCancel}
              style={{ minWidth: 72, padding: "4px 12px" }}
            >
              Cancel
            </button>
            <button
              className="win98-button"
              onClick={handleSubmit}
              disabled={!name.trim()}
              style={{
                minWidth: 72,
                padding: "4px 12px",
                fontWeight: "bold",
              }}
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
