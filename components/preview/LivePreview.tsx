"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Window from "@/components/windows/Window";
import { useChatStore } from "@/stores/chatStore";
import { useProjectStore } from "@/stores/projectStore";
import { useSettingsStore } from "@/stores/settingsStore";

type ViewportSize = "mobile" | "tablet" | "desktop";

const VIEWPORT_WIDTHS: Record<ViewportSize, string> = {
  mobile: "375px",
  tablet: "768px",
  desktop: "100%",
};

export default function LivePreview() {
  const activeChatId = useChatStore((s) => s.activeChatId);
  const chats = useChatStore((s) => s.chats);
  const addMessage = useChatStore((s) => s.addMessage);
  const setStreaming = useChatStore((s) => s.setStreaming);
  const setDemoUrl = useChatStore((s) => s.setDemoUrl);
  const chat = activeChatId ? chats[activeChatId] : null;
  const demoUrl = chat?.demoUrl ?? null;

  const files = useProjectStore((s) => s.files);
  const modifiedFiles = useProjectStore((s) => s.modifiedFiles);
  const setFiles = useProjectStore((s) => s.setFiles);
  const aleoMode = useSettingsStore((s) => s.aleoMode);
  const privacyMode = useSettingsStore((s) => s.privacyMode);

  const hasModifiedFiles = modifiedFiles.size > 0;

  const [viewport, setViewport] = useState<ViewportSize>("desktop");
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const prevUrlRef = useRef<string | null>(null);

  useEffect(() => {
    if (demoUrl && demoUrl !== prevUrlRef.current) {
      setLoading(true);
      prevUrlRef.current = demoUrl;
    }
  }, [demoUrl]);

  const handleRefresh = () => {
    if (iframeRef.current && demoUrl) {
      setLoading(true);
      iframeRef.current.src = demoUrl;
    }
  };

  const handleCopy = () => {
    if (demoUrl) navigator.clipboard.writeText(demoUrl);
  };

  const handleSyncToPreview = useCallback(async () => {
    if (!activeChatId || !files.length || syncing) return;
    setSyncing(true);

    const modifiedFilesList = files.filter((f) => modifiedFiles.has(f.name));
    if (!modifiedFilesList.length) {
      setSyncing(false);
      return;
    }

    const updatePrompt = modifiedFilesList
      .map((f) => `Update file "${f.name}" with this content:\n\`\`\`\n${f.content}\n\`\`\``)
      .join("\n\n");

    addMessage(activeChatId, {
      id: `msg-sync-${Date.now()}`,
      role: "system",
      content: `🔄 Syncing ${modifiedFilesList.length} modified file(s) to preview...`,
      timestamp: new Date().toISOString(),
    });

    if (chat) setStreaming(activeChatId, true);

    try {
      const res = await fetch("/api/v0/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `Please update the following files with these changes and regenerate the preview:\n\n${updatePrompt}`,
          chatId: activeChatId,
          aleoMode,
          privacyMode,
        }),
      });

      const data = await res.json();

      if (data.error) {
        addMessage(activeChatId, {
          id: `msg-sync-err-${Date.now()}`,
          role: "assistant",
          content: `Sync error: ${data.error}`,
          timestamp: new Date().toISOString(),
        });
      } else {
        addMessage(activeChatId, {
          id: `msg-sync-ok-${Date.now()}`,
          role: "assistant",
          content: "Preview updated with your changes.",
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
          setDemoUrl(activeChatId, data.demo);
        }
      }
    } catch (err) {
      addMessage(activeChatId, {
        id: `msg-sync-err-${Date.now()}`,
        role: "assistant",
        content: `Sync failed: ${err instanceof Error ? err.message : "Unknown error"}`,
        timestamp: new Date().toISOString(),
      });
    } finally {
      if (chat) setStreaming(activeChatId, false);
      setSyncing(false);
    }
  }, [activeChatId, chat, files, modifiedFiles, syncing, addMessage, setStreaming, setDemoUrl, setFiles, aleoMode, privacyMode]);

  return (
    <Window id="live-preview" title="Live Preview" icon={<span>🌐</span>}>
      <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "var(--aim-button-face)" }}>
        {/* Toolbar */}
        <div className="win98-toolbar" style={{ minHeight: 24, flexWrap: "wrap" }}>
          <button className="win98-toolbar-btn" onClick={handleRefresh} title="Refresh">
            🔄
          </button>
          <button
            className="win98-toolbar-btn"
            onClick={() => demoUrl && window.open(demoUrl, "_blank")}
            title="Open in new tab"
          >
            ↗
          </button>
          <span className="win98-toolbar-separator" />
          {(["mobile", "tablet", "desktop"] as ViewportSize[]).map((size) => (
            <button
              key={size}
              className="win98-toolbar-btn"
              onClick={() => setViewport(size)}
              title={size}
              style={{
                fontSize: 9,
                width: "auto",
                padding: "0 4px",
                background:
                  viewport === size ? "var(--aim-accent)" : "transparent",
                color: viewport === size ? "#fff" : "inherit",
              }}
            >
              {size === "mobile" ? "📱" : size === "tablet" ? "📱" : "🖥"}
            </button>
          ))}
          <span className="win98-toolbar-separator" />
          <button
            className="win98-button"
            onClick={handleSyncToPreview}
            disabled={!hasModifiedFiles || syncing || !activeChatId}
            title="Push edited files to V0 and regenerate preview"
            style={{
              fontSize: 9,
              padding: "1px 8px",
              background: hasModifiedFiles ? "#006400" : undefined,
              color: hasModifiedFiles ? "#fff" : undefined,
            }}
          >
            {syncing ? "Syncing..." : `Sync${hasModifiedFiles ? ` (${modifiedFiles.size})` : ""}`}
          </button>
        </div>

        {/* Modified files banner */}
        {hasModifiedFiles && demoUrl && (
          <div
            style={{
              padding: "3px 8px",
              background: "#ffffcc",
              borderBottom: "1px solid #ccc",
              fontSize: 10,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span>⚠️</span>
            <span>{modifiedFiles.size} file(s) modified locally. Click <strong>Sync</strong> to update preview.</span>
          </div>
        )}

        {/* URL bar */}
        {demoUrl && (
          <div style={{ display: "flex", gap: 2, padding: "2px 4px", background: "var(--aim-button-face)" }}>
            <input
              className="win98-input"
              value={demoUrl}
              readOnly
              style={{ flex: 1, fontSize: 10 }}
            />
            <button
              className="win98-button"
              onClick={handleCopy}
              style={{ padding: "2px 6px", fontSize: 10 }}
            >
              Copy
            </button>
          </div>
        )}

        {/* Iframe */}
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "stretch",
            overflow: "hidden",
            background: "#ffffff",
            position: "relative",
          }}
        >
          {demoUrl ? (
            <>
              {(loading || syncing) && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(255,255,255,0.8)",
                    zIndex: 5,
                    gap: 8,
                  }}
                >
                  <div className="win98-spinner" />
                  {syncing && (
                    <span style={{ fontSize: 10, color: "#666" }}>
                      Syncing changes to V0...
                    </span>
                  )}
                </div>
              )}
              <iframe
                ref={iframeRef}
                src={demoUrl}
                onLoad={() => setLoading(false)}
                style={{
                  width: VIEWPORT_WIDTHS[viewport],
                  maxWidth: "100%",
                  height: "100%",
                  border: "none",
                }}
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
              />
            </>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                color: "#808080",
                fontSize: 11,
                textAlign: "center",
                padding: 24,
                width: "100%",
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 8 }}>🌐</div>
              <div style={{ fontWeight: "bold", marginBottom: 4 }}>No Preview Available</div>
              <div>Start a conversation in AI Chat to see your app preview here.</div>
            </div>
          )}
        </div>
      </div>
    </Window>
  );
}
