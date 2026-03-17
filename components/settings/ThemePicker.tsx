"use client";

import { themes } from "@/lib/themes";
import { useThemeStore, type CustomColors } from "@/stores/themeStore";

const COLOR_FIELDS: { key: keyof CustomColors; label: string }[] = [
  { key: "titlebarStart", label: "Title Bar Start" },
  { key: "titlebarEnd", label: "Title Bar End" },
  { key: "background", label: "Background" },
  { key: "foreground", label: "Text" },
  { key: "accent", label: "Accent" },
  { key: "chatBg", label: "Chat Background" },
  { key: "chatText", label: "Chat Text" },
  { key: "buttonFace", label: "Button Face" },
];

export default function ThemePicker() {
  const activeThemeId = useThemeStore((s) => s.activeThemeId);
  const setTheme = useThemeStore((s) => s.setTheme);
  const customColors = useThemeStore((s) => s.customColors);
  const setCustomColor = useThemeStore((s) => s.setCustomColor);

  return (
    <div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 8,
          marginBottom: 12,
        }}
      >
        {themes.map((theme) => (
          <div
            key={theme.id}
            onClick={() => setTheme(theme.id)}
            style={{
              cursor: "pointer",
              border:
                activeThemeId === theme.id
                  ? "2px solid var(--aim-accent)"
                  : "2px solid transparent",
              padding: 4,
            }}
          >
            {/* Mini window preview */}
            <div
              style={{
                border: "1px solid #808080",
                background: theme.background,
                height: 60,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  background: `linear-gradient(90deg, ${theme.titlebarStart}, ${theme.titlebarEnd})`,
                  height: 12,
                  display: "flex",
                  alignItems: "center",
                  padding: "0 4px",
                }}
              >
                <span style={{ color: "#fff", fontSize: 7, fontWeight: "bold" }}>
                  {theme.name}
                </span>
              </div>
              <div
                style={{
                  flex: 1,
                  background: theme.chatBg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{ color: theme.chatText, fontSize: 8 }}>Abc</span>
              </div>
            </div>
            <div
              style={{
                textAlign: "center",
                fontSize: 10,
                marginTop: 2,
                fontWeight: activeThemeId === theme.id ? "bold" : "normal",
              }}
            >
              {theme.name}
            </div>
          </div>
        ))}
      </div>

      {activeThemeId === "custom" && (
        <div>
          <div style={{ fontWeight: "bold", marginBottom: 6, fontSize: 11 }}>
            Custom Colors
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
            {COLOR_FIELDS.map(({ key, label }) => (
              <div key={key} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10 }}>
                <input
                  type="color"
                  value={customColors[key]}
                  onChange={(e) => setCustomColor(key, e.target.value)}
                  style={{ width: 24, height: 18, border: "none", padding: 0, cursor: "pointer" }}
                />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
