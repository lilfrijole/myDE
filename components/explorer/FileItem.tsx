"use client";

import { useProjectStore } from "@/stores/projectStore";
import { useWindowStore } from "@/stores/windowStore";
import { useState } from "react";

const FILE_ICONS: Record<string, { icon: string; color: string }> = {
  tsx: { icon: "📘", color: "#3b82f6" },
  ts: { icon: "📘", color: "#3b82f6" },
  jsx: { icon: "📙", color: "#f59e0b" },
  js: { icon: "📙", color: "#f59e0b" },
  css: { icon: "🎨", color: "#a855f7" },
  json: { icon: "📋", color: "#eab308" },
  leo: { icon: "🔒", color: "#22c55e" },
  md: { icon: "📝", color: "#6b7280" },
  html: { icon: "🌐", color: "#ef4444" },
  default: { icon: "📄", color: "#9ca3af" },
};

function getFileIcon(name: string) {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  return FILE_ICONS[ext] ?? FILE_ICONS.default;
}

interface FileItemProps {
  name: string;
  locked?: boolean;
}

export default function FileItem({ name, locked }: FileItemProps) {
  const setActiveFile = useProjectStore((s) => s.setActiveFile);
  const openFile = useProjectStore((s) => s.openFile);
  const toggleFileLock = useProjectStore((s) => s.toggleFileLock);
  const openWindow = useWindowStore((s) => s.openWindow);
  const focusWindow = useWindowStore((s) => s.focusWindow);
  const [showContext, setShowContext] = useState(false);
  const [contextPos, setContextPos] = useState({ x: 0, y: 0 });

  const icon = getFileIcon(name);
  const fileName = name.split("/").pop() ?? name;

  const handleClick = () => {
    setActiveFile(name);
    openFile(name);
    openWindow("code-editor");
    focusWindow("code-editor");
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextPos({ x: e.clientX, y: e.clientY });
    setShowContext(true);
  };

  return (
    <>
      <div
        onClick={handleClick}
        onContextMenu={handleContextMenu}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          padding: "2px 4px 2px 20px",
          cursor: "pointer",
          fontSize: 11,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = "var(--aim-accent)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.background = "transparent")
        }
      >
        <span style={{ fontSize: 12 }}>{icon.icon}</span>
        <span
          style={{ color: "inherit" }}
          onMouseEnter={(e) =>
            ((e.currentTarget.parentElement as HTMLElement).style.color = "#fff")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget.parentElement as HTMLElement).style.color =
              "var(--aim-text)")
          }
        >
          {fileName}
        </span>
        {locked && (
          <span style={{ fontSize: 9, color: "#808080" }}>🔒</span>
        )}
      </div>

      {showContext && (
        <>
          <div
            style={{ position: "fixed", inset: 0, zIndex: 99998 }}
            onClick={() => setShowContext(false)}
          />
          <div
            className="win98-context-menu"
            style={{ left: contextPos.x, top: contextPos.y }}
          >
            <div className="win98-dropdown-item" onClick={() => { handleClick(); setShowContext(false); }}>
              View
            </div>
            <div className="win98-dropdown-separator" />
            <div
              className="win98-dropdown-item"
              onClick={() => { toggleFileLock(name); setShowContext(false); }}
            >
              {locked ? "Unlock for AI" : "Lock from AI"}
            </div>
          </div>
        </>
      )}
    </>
  );
}
