"use client";

import { useState } from "react";
import Window from "@/components/windows/Window";
import ThemePicker from "./ThemePicker";
import FontPicker from "./FontPicker";
import SoundSettings from "./SoundSettings";
import AleoToggle from "./AleoToggle";
import { useWindowStore } from "@/stores/windowStore";

type SettingsTab = "themes" | "fonts" | "sounds" | "aleo";

export default function SettingsWindow() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("themes");
  const closeWindow = useWindowStore((s) => s.closeWindow);

  const tabs: { id: SettingsTab; label: string }[] = [
    { id: "themes", label: "Themes" },
    { id: "fonts", label: "Fonts" },
    { id: "sounds", label: "Sounds" },
    { id: "aleo", label: "Aleo" },
  ];

  return (
    <Window id="settings" title="Settings" icon={<span>⚙️</span>} resizable={false}>
      <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "var(--aim-button-face)", padding: 8 }}>
        {/* Tab bar */}
        <div className="win98-tab-bar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={activeTab === tab.id ? "win98-tab-active" : "win98-tab"}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="win98-tab-content" style={{ flex: 1, overflow: "auto" }}>
          {activeTab === "themes" && <ThemePicker />}
          {activeTab === "fonts" && <FontPicker />}
          {activeTab === "sounds" && <SoundSettings />}
          {activeTab === "aleo" && <AleoToggle />}
        </div>

        {/* OK / Cancel */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 6, marginTop: 8 }}>
          <button
            className="win98-button"
            style={{ minWidth: 75 }}
            onClick={() => closeWindow("settings")}
          >
            OK
          </button>
          <button
            className="win98-button"
            style={{ minWidth: 75 }}
            onClick={() => closeWindow("settings")}
          >
            Cancel
          </button>
        </div>
      </div>
    </Window>
  );
}
