"use client";

import { useProjectStore } from "@/stores/projectStore";
import { useChatStore } from "@/stores/chatStore";
import { useSettingsStore } from "@/stores/settingsStore";

export default function StatusBar() {
  const projectName = useProjectStore((s) => s.currentProjectName);
  const activeFileName = useProjectStore((s) => s.activeFileName);
  const activeChatId = useChatStore((s) => s.activeChatId);
  const chats = useChatStore((s) => s.chats);
  const aleoMode = useSettingsStore((s) => s.aleoMode);
  const privacyMode = useSettingsStore((s) => s.privacyMode);

  const chat = activeChatId ? chats[activeChatId] : null;
  const demoUrl = chat?.demoUrl;
  const isStreaming = chat?.isStreaming;

  return (
    <div className="win98-statusbar">
      {/* Connection */}
      <div className="win98-statusbar-section" style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "#00cc00",
            display: "inline-block",
          }}
        />
        <span>Connected</span>
      </div>

      {/* Project info */}
      <div className="win98-statusbar-section" style={{ flex: 1 }}>
        {projectName ?? "No Project"}{activeFileName ? ` - ${activeFileName.split("/").pop()}` : ""}
      </div>

      {/* Ticker area */}
      {isStreaming && (
        <div className="win98-statusbar-section aim-ticker" style={{ width: 200, overflow: "hidden" }}>
          <span className="aim-ticker-text" style={{ fontSize: 10 }}>
            Preheating the oven... this can take up to 2 minutes.
          </span>
        </div>
      )}

      {/* Aleo indicator */}
      {aleoMode && (
        <div
          className="win98-statusbar-section"
          style={{
            background: "#22c55e",
            color: "#ffffff",
            fontWeight: "bold",
            fontSize: 10,
          }}
        >
          🔒 Aleo ({privacyMode})
        </div>
      )}

      {/* Deploy status */}
      <div className="win98-statusbar-section">
        {demoUrl ? (
          <a
            href={demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--aim-accent)", fontSize: 10 }}
          >
            🟢 Live
          </a>
        ) : (
          <span style={{ color: "#808080", fontSize: 10 }}>Not deployed</span>
        )}
      </div>
    </div>
  );
}
