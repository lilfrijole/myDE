"use client";

import { useWindowStore } from "@/stores/windowStore";

interface WindowManagerProps {
  children: React.ReactNode;
}

export default function WindowManager({ children }: WindowManagerProps) {
  const windows = useWindowStore((s) => s.windows);
  const focusWindow = useWindowStore((s) => s.focusWindow);

  const minimizedWindows = Object.entries(windows).filter(
    ([, w]) => w.isOpen && w.isMinimized
  );

  return (
    <div style={{ position: "relative", flex: 1, overflow: "hidden" }}>
      {children}

      {/* Minimized window taskbar items */}
      {minimizedWindows.length > 0 && (
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            display: "flex",
            gap: 2,
            padding: "2px 4px",
            zIndex: 99998,
          }}
        >
          {minimizedWindows.map(([id]) => (
            <button
              key={id}
              className="win98-button"
              style={{ minWidth: 120, textAlign: "left", fontSize: 11 }}
              onClick={() => focusWindow(id)}
            >
              {id}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
