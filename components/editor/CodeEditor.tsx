"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Window from "@/components/windows/Window";
import EditorTabs from "./EditorTabs";
import { useProjectStore } from "@/stores/projectStore";
import { useThemeStore } from "@/stores/themeStore";
import { getThemeById } from "@/lib/themes";
import { buildMonacoTheme } from "@/lib/monacoThemes";
import { useSettingsStore } from "@/stores/settingsStore";
import { LEO_LANGUAGE_ID, LEO_MONARCH_TOKENS } from "@/lib/aleo";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
      <div className="win98-spinner" />
    </div>
  ),
});

const LANG_MAP: Record<string, string> = {
  ts: "typescript",
  tsx: "typescriptreact",
  js: "javascript",
  jsx: "javascriptreact",
  css: "css",
  json: "json",
  html: "html",
  md: "markdown",
  leo: LEO_LANGUAGE_ID,
};

function getLang(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase() ?? "";
  return LANG_MAP[ext] ?? "plaintext";
}

export default function CodeEditor() {
  const activeFileName = useProjectStore((s) => s.activeFileName);
  const files = useProjectStore((s) => s.files);
  const updateFileContent = useProjectStore((s) => s.updateFileContent);
  const markFileSaved = useProjectStore((s) => s.markFileSaved);
  const themeId = useThemeStore((s) => s.activeThemeId);
  const editorFontFamily = useThemeStore((s) => s.editorFontFamily);
  const editorFontSize = useThemeStore((s) => s.editorFontSize);
  const aleoMode = useSettingsStore((s) => s.aleoMode);
  const registeredRef = useRef(false);

  const activeFile = files.find((f) => f.name === activeFileName);
  const lang = activeFileName ? getLang(activeFileName) : "plaintext";
  const title = activeFileName ? activeFileName.split("/").pop() ?? "Editor" : "Editor";

  const langBadge = lang === LEO_LANGUAGE_ID ? "Leo" : lang;

  const handleEditorMount = (editor: unknown, monaco: { editor: { defineTheme: (name: string, data: ReturnType<typeof buildMonacoTheme>) => void; setTheme: (name: string) => void }; languages: { register: (def: { id: string }) => void; setMonarchTokensProvider: (id: string, tokens: unknown) => void } }) => {
    const theme = getThemeById(themeId);
    const monacoTheme = buildMonacoTheme(theme);
    monaco.editor.defineTheme("aim-theme", monacoTheme);
    monaco.editor.setTheme("aim-theme");

    if (!registeredRef.current && aleoMode) {
      monaco.languages.register({ id: LEO_LANGUAGE_ID });
      monaco.languages.setMonarchTokensProvider(LEO_LANGUAGE_ID, LEO_MONARCH_TOKENS as never);
      registeredRef.current = true;
    }
  };

  return (
    <Window id="code-editor" title={title} icon={<span>📝</span>}>
      <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "var(--aim-button-face)" }}>
        <EditorTabs />

        {/* Editor toolbar */}
        <div className="win98-toolbar" style={{ minHeight: 24 }}>
          <button
            className="win98-toolbar-btn"
            title="Save"
            onClick={() => activeFileName && markFileSaved(activeFileName)}
          >
            💾
          </button>
          <span className="win98-toolbar-separator" />
          <button className="win98-toolbar-btn" title="Undo">↩</button>
          <button className="win98-toolbar-btn" title="Redo">↪</button>
          <span className="win98-toolbar-separator" />
          <div style={{ flex: 1 }} />
          <span
            style={{
              fontSize: 9,
              padding: "2px 6px",
              background: "var(--aim-accent)",
              color: "#ffffff",
              borderRadius: 2,
            }}
          >
            {langBadge}
          </span>
        </div>

        {/* Monaco Editor */}
        <div style={{ flex: 1, overflow: "hidden" }}>
          {activeFile ? (
            <MonacoEditor
              height="100%"
              language={lang}
              value={activeFile.content}
              onChange={(value) =>
                activeFileName && updateFileContent(activeFileName, value ?? "")
              }
              onMount={handleEditorMount}
              options={{
                fontFamily: editorFontFamily,
                fontSize: editorFontSize,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                wordWrap: "on",
                lineNumbers: "on",
                renderLineHighlight: "line",
                tabSize: 2,
                automaticLayout: true,
                readOnly: activeFile.locked,
              }}
            />
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                color: "#808080",
                fontSize: 11,
              }}
            >
              Select a file from Project Files to edit
            </div>
          )}
        </div>
      </div>
    </Window>
  );
}
