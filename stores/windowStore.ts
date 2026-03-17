import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface WindowState {
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
}

interface WindowStoreState {
  windows: Record<string, WindowState>;
  nextZIndex: number;
  focusedWindowId: string | null;

  registerWindow: (id: string, initial: WindowState) => void;
  moveWindow: (id: string, x: number, y: number) => void;
  resizeWindow: (id: string, width: number, height: number) => void;
  focusWindow: (id: string) => void;
  toggleMinimize: (id: string) => void;
  toggleMaximize: (id: string) => void;
  openWindow: (id: string) => void;
  closeWindow: (id: string) => void;
  setWindowPosition: (
    id: string,
    x: number,
    y: number,
    width: number,
    height: number
  ) => void;
}

const DEFAULT_WINDOWS: Record<string, WindowState> = {
  "file-explorer": {
    x: 8,
    y: 52,
    width: 220,
    height: 500,
    zIndex: 1,
    isOpen: true,
    isMinimized: false,
    isMaximized: false,
  },
  "code-editor": {
    x: 236,
    y: 52,
    width: 560,
    height: 500,
    zIndex: 2,
    isOpen: true,
    isMinimized: false,
    isMaximized: false,
  },
  "ai-chat": {
    x: 804,
    y: 52,
    width: 350,
    height: 500,
    zIndex: 3,
    isOpen: true,
    isMinimized: false,
    isMaximized: false,
  },
  "live-preview": {
    x: 236,
    y: 560,
    width: 560,
    height: 300,
    zIndex: 4,
    isOpen: true,
    isMinimized: false,
    isMaximized: false,
  },
  "build-output": {
    x: 300,
    y: 200,
    width: 500,
    height: 300,
    zIndex: 5,
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
  },
  settings: {
    x: 300,
    y: 100,
    width: 420,
    height: 480,
    zIndex: 6,
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
  },
};

export const useWindowStore = create<WindowStoreState>()(
  persist(
    (set, get) => ({
      windows: { ...DEFAULT_WINDOWS },
      nextZIndex: 10,
      focusedWindowId: null,

      registerWindow: (id, initial) =>
        set((s) => {
          if (s.windows[id]) return s;
          return { windows: { ...s.windows, [id]: initial } };
        }),

      moveWindow: (id, x, y) =>
        set((s) => ({
          windows: {
            ...s.windows,
            [id]: { ...s.windows[id], x, y },
          },
        })),

      resizeWindow: (id, width, height) =>
        set((s) => ({
          windows: {
            ...s.windows,
            [id]: { ...s.windows[id], width, height },
          },
        })),

      focusWindow: (id) =>
        set((s) => ({
          nextZIndex: s.nextZIndex + 1,
          focusedWindowId: id,
          windows: {
            ...s.windows,
            [id]: {
              ...s.windows[id],
              zIndex: s.nextZIndex + 1,
              isMinimized: false,
            },
          },
        })),

      toggleMinimize: (id) =>
        set((s) => ({
          windows: {
            ...s.windows,
            [id]: {
              ...s.windows[id],
              isMinimized: !s.windows[id]?.isMinimized,
            },
          },
        })),

      toggleMaximize: (id) =>
        set((s) => ({
          windows: {
            ...s.windows,
            [id]: {
              ...s.windows[id],
              isMaximized: !s.windows[id]?.isMaximized,
            },
          },
        })),

      openWindow: (id) => {
        const s = get();
        set({
          nextZIndex: s.nextZIndex + 1,
          focusedWindowId: id,
          windows: {
            ...s.windows,
            [id]: {
              ...s.windows[id],
              isOpen: true,
              isMinimized: false,
              zIndex: s.nextZIndex + 1,
            },
          },
        });
      },

      closeWindow: (id) =>
        set((s) => ({
          windows: {
            ...s.windows,
            [id]: { ...s.windows[id], isOpen: false },
          },
        })),

      setWindowPosition: (id, x, y, width, height) =>
        set((s) => ({
          windows: {
            ...s.windows,
            [id]: { ...s.windows[id], x, y, width, height },
          },
        })),
    }),
    { name: "myde-windows" }
  )
);
