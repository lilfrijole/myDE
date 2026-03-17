"use client";

import { useSettingsStore } from "@/stores/settingsStore";
import { soundManager } from "@/lib/sounds";

export default function SoundSettings() {
  const soundsEnabled = useSettingsStore((s) => s.soundsEnabled);
  const soundVolume = useSettingsStore((s) => s.soundVolume);
  const toggleSounds = useSettingsStore((s) => s.toggleSounds);
  const setVolume = useSettingsStore((s) => s.setVolume);

  const testSound = (name: "door-open" | "door-close" | "message-chime") => {
    const prev = useSettingsStore.getState().soundsEnabled;
    if (!prev) useSettingsStore.setState({ soundsEnabled: true });
    soundManager.play(name);
    if (!prev) setTimeout(() => useSettingsStore.setState({ soundsEnabled: prev }), 500);
  };

  return (
    <div style={{ fontSize: 11 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <input
          type="checkbox"
          className="win98-checkbox"
          checked={soundsEnabled}
          onChange={toggleSounds}
          id="sounds-toggle"
        />
        <label htmlFor="sounds-toggle" style={{ cursor: "pointer" }}>
          Enable sounds
        </label>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        <span>Volume:</span>
        <input
          type="range"
          className="win98-range"
          min={0}
          max={100}
          value={soundVolume}
          onChange={(e) => setVolume(Number(e.target.value))}
          style={{ flex: 1 }}
        />
        <span style={{ minWidth: 30 }}>{soundVolume}%</span>
      </div>

      <div style={{ fontWeight: "bold", marginBottom: 6 }}>Test Sounds</div>
      <div style={{ display: "flex", gap: 6 }}>
        <button className="win98-button" onClick={() => testSound("door-open")}>
          🚪 Door Open
        </button>
        <button className="win98-button" onClick={() => testSound("door-close")}>
          🚪 Door Close
        </button>
        <button className="win98-button" onClick={() => testSound("message-chime")}>
          🔔 Chime
        </button>
      </div>
    </div>
  );
}
