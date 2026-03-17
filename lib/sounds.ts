import { useSettingsStore } from "@/stores/settingsStore";

type SoundName = "door-open" | "door-close" | "message-chime";

const SOUND_PATHS: Record<SoundName, string> = {
  "door-open": "/sounds/door-open.wav",
  "door-close": "/sounds/door-close.wav",
  "message-chime": "/sounds/message-chime.wav",
};

class SoundManager {
  private sounds: Map<SoundName, HTMLAudioElement> = new Map();
  private initialized = false;

  init() {
    if (this.initialized || typeof window === "undefined") return;
    for (const [name, path] of Object.entries(SOUND_PATHS)) {
      const audio = new Audio(path);
      audio.preload = "auto";
      this.sounds.set(name as SoundName, audio);
    }
    this.initialized = true;
  }

  play(name: SoundName) {
    if (!this.initialized) this.init();
    const settings = useSettingsStore.getState();
    if (!settings.soundsEnabled) return;

    const audio = this.sounds.get(name);
    if (!audio) return;

    audio.volume = settings.soundVolume / 100;
    audio.currentTime = 0;
    audio.play().catch(() => {});
  }
}

export const soundManager = new SoundManager();
