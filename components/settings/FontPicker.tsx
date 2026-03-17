"use client";

import { useThemeStore } from "@/stores/themeStore";

const FONT_OPTIONS = [
  { label: "Tahoma", value: 'Tahoma, "MS Sans Serif", system-ui, sans-serif' },
  { label: "Consolas", value: 'Consolas, "Courier New", monospace' },
  { label: "Courier New", value: '"Courier New", Courier, monospace' },
  { label: "JetBrains Mono", value: '"JetBrains Mono", monospace' },
  { label: "System Default", value: "system-ui, sans-serif" },
];

const EDITOR_FONT_OPTIONS = [
  { label: "Consolas", value: 'Consolas, "Courier New", monospace' },
  { label: "Courier New", value: '"Courier New", Courier, monospace' },
  { label: "JetBrains Mono", value: '"JetBrains Mono", monospace' },
  { label: "Fira Code", value: '"Fira Code", monospace' },
];

export default function FontPicker() {
  const fontFamily = useThemeStore((s) => s.fontFamily);
  const fontSize = useThemeStore((s) => s.fontSize);
  const editorFontFamily = useThemeStore((s) => s.editorFontFamily);
  const editorFontSize = useThemeStore((s) => s.editorFontSize);
  const setFont = useThemeStore((s) => s.setFont);
  const setEditorFont = useThemeStore((s) => s.setEditorFont);

  return (
    <div style={{ fontSize: 11 }}>
      {/* UI Font */}
      <div style={{ fontWeight: "bold", marginBottom: 6 }}>Interface Font</div>
      <div style={{ display: "flex", gap: 8, marginBottom: 12, alignItems: "center" }}>
        <select
          className="win98-select"
          value={fontFamily}
          onChange={(e) => setFont(e.target.value, fontSize)}
          style={{ flex: 1 }}
        >
          {FONT_OPTIONS.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>
        <span>Size:</span>
        <input
          type="range"
          className="win98-range"
          min={9}
          max={18}
          value={fontSize}
          onChange={(e) => setFont(fontFamily, Number(e.target.value))}
          style={{ width: 80 }}
        />
        <span>{fontSize}px</span>
      </div>

      {/* Editor Font */}
      <div style={{ fontWeight: "bold", marginBottom: 6 }}>Editor Font</div>
      <div style={{ display: "flex", gap: 8, marginBottom: 12, alignItems: "center" }}>
        <select
          className="win98-select"
          value={editorFontFamily}
          onChange={(e) => setEditorFont(e.target.value, editorFontSize)}
          style={{ flex: 1 }}
        >
          {EDITOR_FONT_OPTIONS.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>
        <span>Size:</span>
        <input
          type="range"
          className="win98-range"
          min={10}
          max={24}
          value={editorFontSize}
          onChange={(e) => setEditorFont(editorFontFamily, Number(e.target.value))}
          style={{ width: 80 }}
        />
        <span>{editorFontSize}px</span>
      </div>

      {/* Preview */}
      <div style={{ fontWeight: "bold", marginBottom: 6 }}>Preview</div>
      <div
        className="win98-sunken"
        style={{
          padding: 8,
          fontFamily: editorFontFamily,
          fontSize: editorFontSize,
          background: "#1e1e1e",
          color: "#d4d4d4",
          minHeight: 60,
        }}
      >
        <div><span style={{ color: "#569cd6" }}>const</span> <span style={{ color: "#dcdcaa" }}>greeting</span> = <span style={{ color: "#ce9178" }}>&quot;Hello, myDE!&quot;</span>;</div>
        <div><span style={{ color: "#c586c0" }}>export</span> <span style={{ color: "#569cd6" }}>function</span> <span style={{ color: "#dcdcaa" }}>App</span>() {"{"}</div>
        <div>&nbsp;&nbsp;<span style={{ color: "#c586c0" }}>return</span> &lt;div&gt;{"{"}greeting{"}"}&lt;/div&gt;;</div>
        <div>{"}"}</div>
      </div>
    </div>
  );
}
