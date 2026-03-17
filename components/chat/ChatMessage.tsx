"use client";

import type { ChatMessage as ChatMessageType } from "@/stores/chatStore";

interface ChatMessageProps {
  message: ChatMessageType;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";
  const isSystem = message.role === "system";
  const time = new Date(message.timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (isSystem) {
    return (
      <div style={{ marginBottom: 8, padding: "4px 8px", textAlign: "center" }}>
        <span style={{ color: "#aaa", fontSize: 10, fontStyle: "italic" }}>
          {message.content}
        </span>
      </div>
    );
  }

  return (
    <div style={{ marginBottom: 8, padding: "2px 0", userSelect: "text", cursor: "text" }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 2 }}>
        <span
          style={{
            fontWeight: "bold",
            color: isUser ? "#ffff00" : "#00ffff",
            fontSize: 11,
          }}
        >
          {isUser ? "You" : "myDE AI"}
        </span>
        <span style={{ color: "#808080", fontSize: 9 }}>{time}</span>
      </div>
      <div
        style={{
          color: isUser ? "#ffffff" : "var(--aim-chat-text)",
          fontSize: 12,
          lineHeight: 1.4,
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          userSelect: "text",
          cursor: "text",
        }}
      >
        {message.content}
      </div>
    </div>
  );
}
