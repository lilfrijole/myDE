"use client";

import { useEffect, useRef, useCallback } from "react";
import ThemeProvider from "@/components/ThemeProvider";
import MenuBar from "@/components/toolbar/MenuBar";
import Toolbar from "@/components/toolbar/Toolbar";
import WindowManager from "@/components/windows/WindowManager";
import StatusBar from "@/components/statusbar/StatusBar";
import FileExplorer from "@/components/explorer/FileExplorer";
import CodeEditor from "@/components/editor/CodeEditor";
import AIChatWindow from "@/components/chat/AIChatWindow";
import LivePreview from "@/components/preview/LivePreview";
import BuildOutput from "@/components/terminal/BuildOutput";
import SettingsWindow from "@/components/settings/SettingsWindow";
import { soundManager } from "@/lib/sounds";
import { useWindowStore } from "@/stores/windowStore";
import { useProjectStore } from "@/stores/projectStore";

export default function Home() {
  const soundInitRef = useRef(false);

  const handleFirstInteraction = useCallback(() => {
    if (soundInitRef.current) return;
    soundInitRef.current = true;
    soundManager.init();
    const project = useProjectStore.getState().currentProjectId;
    if (project) {
      soundManager.play("door-open");
    }
  }, []);

  useEffect(() => {
    const handler = () => handleFirstInteraction();
    document.addEventListener("click", handler, { once: true });
    return () => document.removeEventListener("click", handler);
  }, [handleFirstInteraction]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;

      if (mod && e.shiftKey && e.key === "C") {
        e.preventDefault();
        const ws = useWindowStore.getState();
        if (ws.windows["ai-chat"]?.isOpen) ws.closeWindow("ai-chat");
        else ws.openWindow("ai-chat");
      }

      if (mod && e.key === "s") {
        e.preventDefault();
        const ps = useProjectStore.getState();
        if (ps.activeFileName) ps.markFileSaved(ps.activeFileName);
      }

      if (mod && e.shiftKey && e.key === "D") {
        e.preventDefault();
        useWindowStore.getState().openWindow("build-output");
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <ThemeProvider>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          width: "100vw",
          overflow: "hidden",
          background: "var(--aim-bg)",
          color: "var(--aim-text)",
          fontFamily: "var(--aim-font)",
          fontSize: "var(--aim-font-size)",
        }}
      >
        <MenuBar />
        <Toolbar />
        <WindowManager>
          <FileExplorer />
          <CodeEditor />
          <AIChatWindow />
          <LivePreview />
          <BuildOutput />
          <SettingsWindow />
        </WindowManager>
        <StatusBar />
      </div>
    </ThemeProvider>
  );
}
