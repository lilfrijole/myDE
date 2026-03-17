import { type ThemeDefinition } from "./themes";

export interface MonacoThemeData {
  base: "vs" | "vs-dark" | "hc-black";
  inherit: boolean;
  rules: Array<{ token: string; foreground?: string; fontStyle?: string }>;
  colors: Record<string, string>;
}

function hexStrip(hex: string): string {
  return hex.replace("#", "");
}

function isLight(hex: string): boolean {
  const c = hex.replace("#", "");
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  return r * 0.299 + g * 0.587 + b * 0.114 > 140;
}

export function buildMonacoTheme(theme: ThemeDefinition): MonacoThemeData {
  const light = isLight(theme.chatBg);
  const base = light ? "vs" : "vs-dark";
  const fg = hexStrip(theme.chatText);
  const bg = hexStrip(theme.chatBg);
  const accent = hexStrip(theme.accent);
  const muted = light ? "808080" : "6a6a6a";

  return {
    base,
    inherit: true,
    rules: [
      { token: "", foreground: fg },
      { token: "comment", foreground: muted, fontStyle: "italic" },
      { token: "keyword", foreground: hexStrip(theme.accent === "#000080" ? "#5B9BD5" : theme.accent) },
      { token: "string", foreground: light ? "a31515" : "ce9178" },
      { token: "number", foreground: light ? "098658" : "b5cea8" },
      { token: "type", foreground: light ? "267f99" : "4ec9b0" },
      { token: "function", foreground: light ? "795e26" : "dcdcaa" },
      { token: "variable", foreground: fg },
    ],
    colors: {
      "editor.background": `#${bg}`,
      "editor.foreground": `#${fg}`,
      "editor.lineHighlightBackground": light
        ? `#${bg}10`
        : `#ffffff08`,
      "editor.selectionBackground": `#${accent}40`,
      "editorCursor.foreground": `#${fg}`,
      "editorLineNumber.foreground": `#${muted}`,
      "editor.inactiveSelectionBackground": `#${accent}20`,
    },
  };
}
