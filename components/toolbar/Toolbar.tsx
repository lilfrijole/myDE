"use client";

import { useState } from "react";
import { useWindowStore } from "@/stores/windowStore";
import { useChatStore } from "@/stores/chatStore";
import { useProjectStore } from "@/stores/projectStore";
import { soundManager } from "@/lib/sounds";
import NewProjectModal from "@/components/modals/NewProjectModal";

export default function Toolbar() {
  const openWindow = useWindowStore((s) => s.openWindow);
  const focusWindow = useWindowStore((s) => s.focusWindow);
  const createChat = useChatStore((s) => s.createChat);
  const setChatId = useProjectStore((s) => s.setChatId);
  const saveCurrentProject = useProjectStore((s) => s.saveCurrentProject);
  const clearProject = useProjectStore((s) => s.clearProject);

  const [showNewProject, setShowNewProject] = useState(false);

  const handleNewChat = () => {
    setShowNewProject(true);
  };

  const handleNewProjectConfirm = (name: string) => {
    setShowNewProject(false);
    const ps = useProjectStore.getState();
    if (ps.currentProjectId || ps.files.length) {
      saveCurrentProject();
    }
    clearProject();
    const chatId = `chat-${Date.now()}`;
    createChat(chatId, name);
    setChatId(chatId);
    const projectId = `proj-${Date.now()}`;
    useProjectStore.getState().setProject(projectId, name, chatId);
    openWindow("ai-chat");
    focusWindow("ai-chat");
    soundManager.play("door-open");
  };

  const buttons = [
    { icon: "💬", label: "New Chat", action: handleNewChat },
    { icon: "📁", label: "Projects", action: () => { openWindow("file-explorer"); focusWindow("file-explorer"); } },
    { icon: "🎤", label: "Talk", action: () => { openWindow("ai-chat"); focusWindow("ai-chat"); } },
    { icon: "🚀", label: "Deploy", action: () => { openWindow("build-output"); focusWindow("build-output"); } },
    { icon: "⚙️", label: "Settings", action: () => { openWindow("settings"); focusWindow("settings"); } },
  ];

  return (
    <>
      <div className="win98-toolbar">
        {buttons.map((btn) => (
          <button
            key={btn.label}
            className="win98-toolbar-btn"
            onClick={btn.action}
            title={btn.label}
            style={{ width: "auto", padding: "0 6px", gap: 3, display: "flex", alignItems: "center" }}
          >
            <span style={{ fontSize: 14 }}>{btn.icon}</span>
            <span style={{ fontSize: 10 }}>{btn.label}</span>
          </button>
        ))}
      </div>
      <NewProjectModal
        isOpen={showNewProject}
        onConfirm={handleNewProjectConfirm}
        onCancel={() => setShowNewProject(false)}
      />
    </>
  );
}
