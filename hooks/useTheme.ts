"use client";

import { useEffect } from "react";
import { useThemeStore } from "@/stores/themeStore";
import { getThemeById, applyThemeToDOM, type ThemeDefinition } from "@/lib/themes";

export function useTheme(): ThemeDefinition {
  const activeThemeId = useThemeStore((s) => s.activeThemeId);
  const customColors = useThemeStore((s) => s.customColors);
  const fontFamily = useThemeStore((s) => s.fontFamily);
  const fontSize = useThemeStore((s) => s.fontSize);
  const editorFontFamily = useThemeStore((s) => s.editorFontFamily);
  const editorFontSize = useThemeStore((s) => s.editorFontSize);

  const baseTheme = getThemeById(activeThemeId);

  const theme: ThemeDefinition =
    activeThemeId === "custom"
      ? {
          ...baseTheme,
          titlebarStart: customColors.titlebarStart,
          titlebarEnd: customColors.titlebarEnd,
          background: customColors.background,
          foreground: customColors.foreground,
          accent: customColors.accent,
          chatBg: customColors.chatBg,
          chatText: customColors.chatText,
          buttonFace: customColors.buttonFace,
        }
      : baseTheme;

  useEffect(() => {
    applyThemeToDOM(theme);
    document.documentElement.style.setProperty("--aim-font", fontFamily);
    document.documentElement.style.setProperty("--aim-font-size", `${fontSize}px`);
    document.documentElement.style.setProperty("--aim-editor-font", editorFontFamily);
    document.documentElement.style.setProperty("--aim-editor-font-size", `${editorFontSize}px`);
  }, [theme, fontFamily, fontSize, editorFontFamily, editorFontSize]);

  return theme;
}
