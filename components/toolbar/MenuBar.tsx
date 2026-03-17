"use client";

import { useState, useRef, useEffect } from "react";
import { useWindowStore } from "@/stores/windowStore";
import { useProjectStore } from "@/stores/projectStore";
import { useChatStore } from "@/stores/chatStore";
import { soundManager } from "@/lib/sounds";
import NewProjectModal from "@/components/modals/NewProjectModal";

export default function MenuBar() {
  const openWindow = useWindowStore((s) => s.openWindow);
  const closeWindow = useWindowStore((s) => s.closeWindow);
  const windows = useWindowStore((s) => s.windows);
  const clearProject = useProjectStore((s) => s.clearProject);
  const saveCurrentProject = useProjectStore((s) => s.saveCurrentProject);
  const loadProject = useProjectStore((s) => s.loadProject);
  const deleteProject = useProjectStore((s) => s.deleteProject);
  const savedProjects = useProjectStore((s) => s.savedProjects);
  const currentProjectId = useProjectStore((s) => s.currentProjectId);
  const currentChatId = useProjectStore((s) => s.currentChatId);

  const chats = useChatStore((s) => s.chats);
  const activeChatId = useChatStore((s) => s.activeChatId);
  const setActiveChat = useChatStore((s) => s.setActiveChat);
  const createChat = useChatStore((s) => s.createChat);
  const deleteChat = useChatStore((s) => s.deleteChat);
  const setChatId = useProjectStore((s) => s.setChatId);

  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [hoveredSub, setHoveredSub] = useState<string | null>(null);
  const [showNewProject, setShowNewProject] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
        setHoveredSub(null);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleNewProject = () => {
    setOpenMenu(null);
    setHoveredSub(null);
    setShowNewProject(true);
  };

  const handleNewProjectConfirm = (name: string) => {
    setShowNewProject(false);
    if (currentProjectId || useProjectStore.getState().files.length) {
      saveCurrentProject();
    }
    clearProject();
    const newChatId = `chat-${Date.now()}`;
    createChat(newChatId, name);
    setChatId(newChatId);
    const projectId = `proj-${Date.now()}`;
    useProjectStore.getState().setProject(projectId, name, newChatId);
    soundManager.play("door-open");
  };

  const handleSaveProject = () => {
    saveCurrentProject();
    setOpenMenu(null);
    setHoveredSub(null);
  };

  const handleSwitchProject = (projectId: string) => {
    if (currentProjectId || useProjectStore.getState().files.length) {
      saveCurrentProject();
    }
    loadProject(projectId);
    const project = savedProjects.find((p) => p.id === projectId);
    if (project?.chatId) {
      setActiveChat(project.chatId);
    }
    soundManager.play("door-open");
    setOpenMenu(null);
    setHoveredSub(null);
  };

  const handleDeleteProject = (e: React.MouseEvent, projectId: string) => {
    e.stopPropagation();
    deleteProject(projectId);
  };

  const handleCloseProject = () => {
    if (currentProjectId || useProjectStore.getState().files.length) {
      saveCurrentProject();
    }
    clearProject();
    soundManager.play("door-close");
    setOpenMenu(null);
    setHoveredSub(null);
  };

  const chatList = Object.values(chats)
    .map((c) => ({ id: c.id, name: c.name, messageCount: c.messages.filter((m) => m.role !== "system").length }))
    .sort((a, b) => b.id.localeCompare(a.id));

  return (
    <div className="win98-menubar" ref={menuRef} style={{ position: "relative", zIndex: 99990 }}>
      {/* myDE menu */}
      <MenuButton
        label="myDE"
        isOpen={openMenu === "myDE"}
        onToggle={() => setOpenMenu(openMenu === "myDE" ? null : "myDE")}
        onHover={() => openMenu && setOpenMenu("myDE")}
      >
        <div className="win98-dropdown-item" onClick={() => { alert("myDE - AIM-Themed IDE\nPowered by V0 SDK"); setOpenMenu(null); }}>
          About myDE
        </div>
        <div className="win98-dropdown-separator" />
        <div className="win98-dropdown-item" onClick={() => { openWindow("settings"); setOpenMenu(null); }}>
          Settings
        </div>
      </MenuButton>

      {/* File menu */}
      <MenuButton
        label="File"
        isOpen={openMenu === "File"}
        onToggle={() => setOpenMenu(openMenu === "File" ? null : "File")}
        onHover={() => openMenu && setOpenMenu("File")}
      >
        <div className="win98-dropdown-item" onClick={handleNewProject}>
          New Project
        </div>
        <div className="win98-dropdown-item" onClick={handleSaveProject}>
          Save Project
        </div>
        <div className="win98-dropdown-separator" />

        {/* Projects submenu */}
        <div
          className="win98-dropdown-item"
          style={{ display: "flex", justifyContent: "space-between", position: "relative" }}
          onMouseEnter={() => setHoveredSub("projects")}
          onMouseLeave={() => setHoveredSub(null)}
        >
          <span>Projects</span>
          <span style={{ fontSize: 8, marginLeft: 12 }}>&#9654;</span>
          {hoveredSub === "projects" && (
            <div
              className="win98-dropdown"
              style={{ position: "absolute", left: "100%", top: -2, minWidth: 200 }}
            >
              {savedProjects.length === 0 ? (
                <div className="win98-dropdown-item" style={{ color: "#808080", fontStyle: "italic" }}>
                  No saved projects
                </div>
              ) : (
                savedProjects.map((p) => (
                  <div
                    key={p.id}
                    className="win98-dropdown-item"
                    onClick={() => handleSwitchProject(p.id)}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 8,
                      background: p.id === currentProjectId ? "var(--aim-accent)" : undefined,
                      color: p.id === currentProjectId ? "#fff" : undefined,
                    }}
                  >
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
                      {p.id === currentProjectId ? "● " : ""}{p.name}
                    </span>
                    <span style={{ fontSize: 8, color: p.id === currentProjectId ? "#ccc" : "#999", flexShrink: 0 }}>
                      {p.files.length} files
                    </span>
                    <button
                      onClick={(e) => handleDeleteProject(e, p.id)}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontSize: 10,
                        color: p.id === currentProjectId ? "#fcc" : "#c00",
                        padding: "0 2px",
                        flexShrink: 0,
                      }}
                      title="Delete project"
                    >
                      ✕
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Chats submenu */}
        <div
          className="win98-dropdown-item"
          style={{ display: "flex", justifyContent: "space-between", position: "relative" }}
          onMouseEnter={() => setHoveredSub("chats")}
          onMouseLeave={() => setHoveredSub(null)}
        >
          <span>Chats</span>
          <span style={{ fontSize: 8, marginLeft: 12 }}>&#9654;</span>
          {hoveredSub === "chats" && (
            <div
              className="win98-dropdown"
              style={{ position: "absolute", left: "100%", top: -2, minWidth: 200 }}
            >
              {chatList.length === 0 ? (
                <div className="win98-dropdown-item" style={{ color: "#808080", fontStyle: "italic" }}>
                  No chats yet
                </div>
              ) : (
                chatList.map((c) => (
                  <div
                    key={c.id}
                    className="win98-dropdown-item"
                    onClick={() => {
                      setActiveChat(c.id);
                      setChatId(c.id);
                      openWindow("ai-chat");
                      setOpenMenu(null);
                      setHoveredSub(null);
                    }}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 8,
                      background: c.id === activeChatId ? "var(--aim-accent)" : undefined,
                      color: c.id === activeChatId ? "#fff" : undefined,
                    }}
                  >
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
                      {c.id === activeChatId ? "● " : ""}{c.name}
                    </span>
                    <span style={{ fontSize: 8, color: c.id === activeChatId ? "#ccc" : "#999", flexShrink: 0 }}>
                      {c.messageCount} msgs
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <div className="win98-dropdown-separator" />
        <div className="win98-dropdown-item" onClick={handleCloseProject}>
          Close Project
        </div>
      </MenuButton>

      {/* View menu */}
      <MenuButton
        label="View"
        isOpen={openMenu === "View"}
        onToggle={() => setOpenMenu(openMenu === "View" ? null : "View")}
        onHover={() => openMenu && setOpenMenu("View")}
      >
        {["file-explorer", "code-editor", "ai-chat", "live-preview", "build-output"].map((id) => (
          <div
            key={id}
            className="win98-dropdown-item"
            onClick={() => {
              if (windows[id]?.isOpen) closeWindow(id);
              else openWindow(id);
              setOpenMenu(null);
            }}
          >
            {windows[id]?.isOpen ? "✓ " : "  "}
            {id.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
          </div>
        ))}
      </MenuButton>

      {/* Help menu */}
      <MenuButton
        label="Help"
        isOpen={openMenu === "Help"}
        onToggle={() => setOpenMenu(openMenu === "Help" ? null : "Help")}
        onHover={() => openMenu && setOpenMenu("Help")}
      >
        <div className="win98-dropdown-item" onClick={() => window.open("https://v0.app/docs/api/platform/overview", "_blank")}>
          V0 Documentation
        </div>
        <div className="win98-dropdown-item" onClick={() => window.open("https://developer.aleo.org/", "_blank")}>
          Aleo Documentation
        </div>
        <div className="win98-dropdown-separator" />
        <div className="win98-dropdown-item" onClick={() => alert("myDE v0.1.0\nAIM-Themed IDE")}>
          About
        </div>
      </MenuButton>

      <NewProjectModal
        isOpen={showNewProject}
        onConfirm={handleNewProjectConfirm}
        onCancel={() => setShowNewProject(false)}
      />
    </div>
  );
}

function MenuButton({
  label,
  isOpen,
  onToggle,
  onHover,
  children,
}: {
  label: string;
  isOpen: boolean;
  onToggle: () => void;
  onHover: () => void;
  children: React.ReactNode;
}) {
  return (
    <div style={{ position: "relative" }}>
      <div
        className="win98-menubar-item"
        onClick={onToggle}
        onMouseEnter={onHover}
      >
        {label}
      </div>
      {isOpen && (
        <div className="win98-dropdown" style={{ top: "100%", left: 0 }}>
          {children}
        </div>
      )}
    </div>
  );
}
