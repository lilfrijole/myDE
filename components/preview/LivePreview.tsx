"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Window from "@/components/windows/Window";
import { useChatStore } from "@/stores/chatStore";
import { useProjectStore } from "@/stores/projectStore";

type ViewportSize = "mobile" | "tablet" | "desktop";

const VIEWPORT_WIDTHS: Record<ViewportSize, string> = {
  mobile: "375px",
  tablet: "768px",
  desktop: "100%",
};

const SYNC_DEBOUNCE_MS = 2000;

export default function LivePreview() {
  const activeChatId = useChatStore((s) => s.activeChatId);
  const chats = useChatStore((s) => s.chats);
  const setDemoUrl = useChatStore((s) => s.setDemoUrl);
  const setVersionId = useChatStore((s) => s.setVersionId);
  const chat = activeChatId ? chats[activeChatId] : null;
  const demoUrl = chat?.demoUrl ?? null;
  const v0ChatId = chat?.v0ChatId ?? null;
  const versionId = chat?.versionId ?? null;

  const files = useProjectStore((s) => s.files);
  const modifiedFiles = useProjectStore((s) => s.modifiedFiles);
  const setFiles = useProjectStore((s) => s.setFiles);

  const hasModifiedFiles = modifiedFiles.size > 0;
  const canSync = hasModifiedFiles && !!v0ChatId && !!versionId;

  const [viewport, setViewport] = useState<ViewportSize>("desktop");
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [autoSync, setAutoSync] = useState(true);
  const [lastSyncStatus, setLastSyncStatus] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const prevUrlRef = useRef<string | null>(null);
  const syncTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingSyncRef = useRef(false);

  useEffect(() => {
    if (demoUrl && demoUrl !== prevUrlRef.current) {
      setLoading(true);
      prevUrlRef.current = demoUrl;
    }
  }, [demoUrl]);

  const pushFilesToV0 = useCallback(async () => {
    if (!v0ChatId || !versionId || !files.length || syncing) return;

    const modifiedFilesList = files.filter((f) => modifiedFiles.has(f.name));
    if (!modifiedFilesList.length) return;

    setSyncing(true);
    setLastSyncStatus(null);
    pendingSyncRef.current = false;

    try {
      const res = await fetch("/api/v0/update-version", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatId: v0ChatId,
          versionId,
          files: modifiedFilesList.map((f) => ({
            name: f.name,
            content: f.content,
          })),
        }),
      });

      const data = await res.json();

      if (data.error) {
        setLastSyncStatus(`Error: ${data.error}`);
        return;
      }

      if (data.versionId) {
        setVersionId(activeChatId!, data.versionId);
      }

      if (data.demoUrl && data.demoUrl !== demoUrl) {
        setDemoUrl(activeChatId!, data.demoUrl);
      }

      if (data.files?.length) {
        setFiles(
          data.files.map((f: { name: string; content: string }) => ({
            name: f.name,
            content: f.content,
            locked: false,
          }))
        );
      }

      const modifiedSet = useProjectStore.getState().modifiedFiles;
      const newModified = new Set(modifiedSet);
      modifiedFilesList.forEach((f) => newModified.delete(f.name));
      useProjectStore.setState({ modifiedFiles: newModified });

      if (iframeRef.current && demoUrl) {
        iframeRef.current.src = demoUrl;
        setLoading(true);
      }

      setLastSyncStatus(`Synced ${modifiedFilesList.length} file(s)`);
    } catch (err) {
      setLastSyncStatus(`Sync failed: ${err instanceof Error ? err.message : "Unknown"}`);
    } finally {
      setSyncing(false);
    }
  }, [v0ChatId, versionId, files, modifiedFiles, syncing, activeChatId, demoUrl, setDemoUrl, setVersionId, setFiles]);

  useEffect(() => {
    if (!autoSync || !canSync || syncing) return;

    if (syncTimerRef.current) {
      clearTimeout(syncTimerRef.current);
    }

    pendingSyncRef.current = true;
    syncTimerRef.current = setTimeout(() => {
      if (pendingSyncRef.current) {
        pushFilesToV0();
      }
    }, SYNC_DEBOUNCE_MS);

    return () => {
      if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
    };
  }, [autoSync, canSync, syncing, modifiedFiles, pushFilesToV0]);

  const handleRefresh = () => {
    if (iframeRef.current && demoUrl) {
      setLoading(true);
      iframeRef.current.src = demoUrl;
    }
  };

  const handleCopy = () => {
    if (demoUrl) navigator.clipboard.writeText(demoUrl);
  };

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
            onClick={pushFilesToV0}
            disabled={!canSync || syncing}
            title="Push edited files to V0 and refresh preview"
            style={{
              fontSize: 9,
              padding: "1px 8px",
              background: canSync ? "#006400" : undefined,
              color: canSync ? "#fff" : undefined,
            }}
          >
            {syncing ? "Syncing..." : `Sync${hasModifiedFiles ? ` (${modifiedFiles.size})` : ""}`}
          </button>
          <span className="win98-toolbar-separator" />
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 3,
              fontSize: 9,
              cursor: "pointer",
              userSelect: "none",
            }}
            title="Auto-sync files to preview after edits"
          >
            <input
              type="checkbox"
              checked={autoSync}
              onChange={(e) => setAutoSync(e.target.checked)}
              style={{ margin: 0, cursor: "pointer" }}
            />
            Auto
          </label>
        </div>

        {/* Status bar */}
        {(hasModifiedFiles || lastSyncStatus || syncing) && demoUrl && (
          <div
            style={{
              padding: "2px 8px",
              background: syncing ? "#e6f0ff" : lastSyncStatus?.startsWith("Error") ? "#ffe6e6" : hasModifiedFiles ? "#ffffcc" : "#e6ffe6",
              borderBottom: "1px solid #ccc",
              fontSize: 9,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            {syncing ? (
              <>
                <span className="win98-spinner" style={{ width: 10, height: 10, borderWidth: 2 }} />
                <span>Pushing changes to V0...</span>
              </>
            ) : lastSyncStatus ? (
              <span>{lastSyncStatus}</span>
            ) : hasModifiedFiles && !autoSync ? (
              <>
                <span>⚠️</span>
                <span>{modifiedFiles.size} file(s) modified. Click <strong>Sync</strong> or enable <strong>Auto</strong>.</span>
              </>
            ) : hasModifiedFiles && autoSync ? (
              <>
                <span>⏳</span>
                <span>{modifiedFiles.size} file(s) changed, auto-syncing in {SYNC_DEBOUNCE_MS / 1000}s...</span>
              </>
            ) : null}
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
              {loading && (
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
                  <span style={{ fontSize: 10, color: "#666" }}>
                    Loading preview...
                  </span>
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
