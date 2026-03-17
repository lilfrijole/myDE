import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CustomColors {
  titlebarStart: string;
  titlebarEnd: string;
  background: string;
  foreground: string;
  accent: string;
  chatBg: string;
  chatText: string;
  buttonFace: string;
}

interface ThemeState {
  activeThemeId: string;
  customColors: CustomColors;
  fontFamily: string;
  fontSize: number;
  editorFontFamily: string;
  editorFontSize: number;

  setTheme: (id: string) => void;
  setCustomColor: (key: keyof CustomColors, value: string) => void;
  setFont: (family: string, size: number) => void;
  setEditorFont: (family: string, size: number) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      activeThemeId: "classic-aim",
      customColors: {
        titlebarStart: "#000080",
        titlebarEnd: "#1084d0",
        background: "#c0c0c0",
        foreground: "#000000",
        accent: "#000080",
        chatBg: "#000000",
        chatText: "#00ff00",
        buttonFace: "#c0c0c0",
      },
      fontFamily: 'Tahoma, "MS Sans Serif", system-ui, sans-serif',
      fontSize: 11,
      editorFontFamily: 'Consolas, "Courier New", monospace',
      editorFontSize: 13,

      setTheme: (id) => set({ activeThemeId: id }),
      setCustomColor: (key, value) =>
        set((s) => ({
          customColors: { ...s.customColors, [key]: value },
        })),
      setFont: (family, size) => set({ fontFamily: family, fontSize: size }),
      setEditorFont: (family, size) =>
        set({ editorFontFamily: family, editorFontSize: size }),
    }),
    { name: "myde-theme" }
  )
);
