export interface ThemeDefinition {
  id: string;
  name: string;
  titlebarStart: string;
  titlebarEnd: string;
  titlebarInactiveStart: string;
  titlebarInactiveEnd: string;
  background: string;
  foreground: string;
  accent: string;
  chatBg: string;
  chatText: string;
  buttonFace: string;
  buttonHighlight: string;
  buttonShadow: string;
  buttonDarkShadow: string;
}

export const themes: ThemeDefinition[] = [
  {
    id: "classic-aim",
    name: "Classic AIM",
    titlebarStart: "#000080",
    titlebarEnd: "#1084d0",
    titlebarInactiveStart: "#808080",
    titlebarInactiveEnd: "#b0b0b0",
    background: "#c0c0c0",
    foreground: "#000000",
    accent: "#000080",
    chatBg: "#000000",
    chatText: "#00ff00",
    buttonFace: "#c0c0c0",
    buttonHighlight: "#ffffff",
    buttonShadow: "#808080",
    buttonDarkShadow: "#404040",
  },
  {
    id: "aim-triton",
    name: "AIM Triton",
    titlebarStart: "#2563eb",
    titlebarEnd: "#60a5fa",
    titlebarInactiveStart: "#94a3b8",
    titlebarInactiveEnd: "#cbd5e1",
    background: "#e8f0fe",
    foreground: "#1a1a1a",
    accent: "#0066cc",
    chatBg: "#0f172a",
    chatText: "#e2e8f0",
    buttonFace: "#e2e8f0",
    buttonHighlight: "#ffffff",
    buttonShadow: "#94a3b8",
    buttonDarkShadow: "#64748b",
  },
  {
    id: "matrix",
    name: "Matrix",
    titlebarStart: "#003300",
    titlebarEnd: "#006600",
    titlebarInactiveStart: "#1a1a1a",
    titlebarInactiveEnd: "#333333",
    background: "#0d0d0d",
    foreground: "#00ff00",
    accent: "#003300",
    chatBg: "#000000",
    chatText: "#00ff00",
    buttonFace: "#1a1a1a",
    buttonHighlight: "#00ff00",
    buttonShadow: "#003300",
    buttonDarkShadow: "#001100",
  },
  {
    id: "midnight",
    name: "Midnight",
    titlebarStart: "#1e1b4b",
    titlebarEnd: "#4338ca",
    titlebarInactiveStart: "#312e81",
    titlebarInactiveEnd: "#3730a3",
    background: "#0a0a2a",
    foreground: "#c0c0ff",
    accent: "#4040ff",
    chatBg: "#050520",
    chatText: "#a5b4fc",
    buttonFace: "#1e1b4b",
    buttonHighlight: "#6366f1",
    buttonShadow: "#312e81",
    buttonDarkShadow: "#0a0a2a",
  },
  {
    id: "sunset",
    name: "Sunset",
    titlebarStart: "#9a3412",
    titlebarEnd: "#ea580c",
    titlebarInactiveStart: "#78350f",
    titlebarInactiveEnd: "#92400e",
    background: "#2d1b14",
    foreground: "#ffccaa",
    accent: "#ff6600",
    chatBg: "#1a0f0a",
    chatText: "#fed7aa",
    buttonFace: "#431407",
    buttonHighlight: "#ff6600",
    buttonShadow: "#78350f",
    buttonDarkShadow: "#1c0a00",
  },
  {
    id: "custom",
    name: "Custom",
    titlebarStart: "#000080",
    titlebarEnd: "#1084d0",
    titlebarInactiveStart: "#808080",
    titlebarInactiveEnd: "#b0b0b0",
    background: "#c0c0c0",
    foreground: "#000000",
    accent: "#000080",
    chatBg: "#000000",
    chatText: "#00ff00",
    buttonFace: "#c0c0c0",
    buttonHighlight: "#ffffff",
    buttonShadow: "#808080",
    buttonDarkShadow: "#404040",
  },
];

export function getThemeById(id: string): ThemeDefinition {
  return themes.find((t) => t.id === id) ?? themes[0];
}

export function applyThemeToDOM(theme: ThemeDefinition) {
  const root = document.documentElement;
  root.style.setProperty("--aim-bg", theme.background);
  root.style.setProperty("--aim-text", theme.foreground);
  root.style.setProperty("--aim-accent", theme.accent);
  root.style.setProperty("--aim-titlebar-start", theme.titlebarStart);
  root.style.setProperty("--aim-titlebar-end", theme.titlebarEnd);
  root.style.setProperty("--aim-titlebar-inactive-start", theme.titlebarInactiveStart);
  root.style.setProperty("--aim-titlebar-inactive-end", theme.titlebarInactiveEnd);
  root.style.setProperty("--aim-chat-bg", theme.chatBg);
  root.style.setProperty("--aim-chat-text", theme.chatText);
  root.style.setProperty("--aim-button-face", theme.buttonFace);
  root.style.setProperty("--aim-button-highlight", theme.buttonHighlight);
  root.style.setProperty("--aim-button-shadow", theme.buttonShadow);
  root.style.setProperty("--aim-button-dark-shadow", theme.buttonDarkShadow);
  root.style.setProperty("--aim-window-border", theme.buttonHighlight);
}
