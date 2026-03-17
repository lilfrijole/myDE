import { create } from "zustand";
import { persist } from "zustand/middleware";

export type PrivacyMode = "private" | "public";

interface SettingsState {
  soundsEnabled: boolean;
  soundVolume: number;
  aleoMode: boolean;
  privacyMode: PrivacyMode;

  toggleSounds: () => void;
  setVolume: (volume: number) => void;
  toggleAleo: () => void;
  setPrivacyMode: (mode: PrivacyMode) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      soundsEnabled: true,
      soundVolume: 70,
      aleoMode: false,
      privacyMode: "private" as PrivacyMode,

      toggleSounds: () => set((s) => ({ soundsEnabled: !s.soundsEnabled })),
      setVolume: (volume) => set({ soundVolume: volume }),
      toggleAleo: () => set((s) => ({ aleoMode: !s.aleoMode })),
      setPrivacyMode: (mode) => set({ privacyMode: mode }),
    }),
    { name: "myde-settings" }
  )
);
