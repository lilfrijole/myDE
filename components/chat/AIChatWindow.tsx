"use client";

import { useRef, useEffect, useCallback } from "react";
import Window from "@/components/windows/Window";
import ChatInput from "./ChatInput";
import ChatMessage from "./ChatMessage";
import { useChatStore } from "@/stores/chatStore";
import { useProjectStore } from "@/stores/projectStore";
import { useSettingsStore } from "@/stores/settingsStore";
import { soundManager } from "@/lib/sounds";

export default function AIChatWindow() {
  const activeChatId = useChatStore((s) => s.activeChatId);
  const chats = useChatStore((s) => s.chats);
  const addMessage = useChatStore((s) => s.addMessage);
  const createChat = useChatStore((s) => s.createChat);
  const setStreaming = useChatStore((s) => s.setStreaming);
  const setV0ChatId = useChatStore((s) => s.setV0ChatId);
  const setDemoUrl = useChatStore((s) => s.setDemoUrl);
  const setVersionId = useChatStore((s) => s.setVersionId);
  const setFiles = useProjectStore((s) => s.setFiles);
  const setChatId = useProjectStore((s) => s.setChatId);
  const setProject = useProjectStore((s) => s.setProject);
  const saveCurrentProject = useProjectStore((s) => s.saveCurrentProject);
  const renameChat = useChatStore((s) => s.renameChat);
  const aleoMode = useSettingsStore((s) => s.aleoMode);
  const privacyMode = useSettingsStore((s) => s.privacyMode);

  const chat = activeChatId ? chats[activeChatId] : null;
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat?.messages.length]);

  const projectName = useProjectStore((s) => s.currentProjectName);
  const chatName = chat?.name;
  const displayName = projectName ?? chatName;
  const title = displayName
    ? `${displayName}${aleoMode ? " (Aleo)" : ""}`
    : aleoMode ? "myDE Chat (Aleo Mode)" : "myDE Chat";

  const handleSend = useCallback(
    async (message: string) => {
      let chatId = activeChatId;

      if (!chatId) {
        chatId = `chat-${Date.now()}`;
        const projectName = message.length > 40 ? message.slice(0, 40) + "..." : message;
        createChat(chatId, projectName);
        setChatId(chatId);
        setProject(chatId, projectName, chatId);
      }

      addMessage(chatId, {
        id: `msg-${Date.now()}`,
        role: "user",
        content: message,
        timestamp: new Date().toISOString(),
      });

      setStreaming(chatId, true);

      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 300000);

        addMessage(chatId, {
          id: `msg-status-${Date.now()}`,
          role: "system",
          content: "Preheating the oven... this can take up to 2 minutes.",
          timestamp: new Date().toISOString(),
        });

        const existingV0Id = chat?.v0ChatId ?? null;

        const res = await fetch("/api/v0/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message,
            chatId: existingV0Id,
            aleoMode,
            privacyMode,
          }),
          signal: controller.signal,
        });

        clearTimeout(timeout);

        const data = await res.json();

        if (data.error) {
          addMessage(chatId, {
            id: `msg-err-${Date.now()}`,
            role: "assistant",
            content: `Error: ${data.error}`,
            timestamp: new Date().toISOString(),
          });
        } else {
          if (data.id && !existingV0Id) {
            setV0ChatId(chatId, data.id);
          }

          if (data.versionId) {
            setVersionId(chatId, data.versionId);
          }

          addMessage(chatId, {
            id: `msg-ai-${Date.now()}`,
            role: "assistant",
            content:
              data.files
                ?.map(
                  (f: { name: string; content: string }) =>
                    `📄 ${f.name}\n\`\`\`\n${f.content}\n\`\`\``
                )
                .join("\n\n") ?? "Response received.",
            timestamp: new Date().toISOString(),
          });

          if (data.files) {
            setFiles(
              data.files.map((f: { name: string; content: string }) => ({
                name: f.name,
                content: f.content,
                locked: false,
              }))
            );
          }

          if (data.demo) {
            setDemoUrl(chatId, data.demo);
          }

          saveCurrentProject();
          soundManager.play("message-chime");
        }
      } catch (err) {
        addMessage(chatId, {
          id: `msg-err-${Date.now()}`,
          role: "assistant",
          content: `Failed to send message: ${err instanceof Error ? err.message : "Unknown error"}`,
          timestamp: new Date().toISOString(),
        });
      } finally {
        setStreaming(chatId, false);
      }
    },
    [activeChatId, chat, createChat, renameChat, addMessage, setStreaming, setV0ChatId, setVersionId, setDemoUrl, setFiles, setChatId, setProject, saveCurrentProject, aleoMode, privacyMode]
  );

  return (
    <Window id="ai-chat" title={title} icon={<span>💬</span>}>
      {/* Messages area */}
      <div
        className="aim-chat-area"
        style={{ flex: 1, overflow: "auto", userSelect: "text" }}
      >
        {!chat?.messages.length && (
          <div style={{ color: "#808080", textAlign: "center", padding: 20 }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>🏃</div>
            <div>Welcome to myDE Chat!</div>
            <div style={{ fontSize: 10, marginTop: 4 }}>
              Describe what you want to build and AI will generate the code.
            </div>
          </div>
        )}
        {chat?.messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        {chat?.isStreaming && (
          <div style={{ padding: "4px 0" }}>
            <span className="aim-typing-dot" />
            <span className="aim-typing-dot" />
            <span className="aim-typing-dot" />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <ChatInput onSend={handleSend} disabled={chat?.isStreaming} />
    </Window>
  );
}
