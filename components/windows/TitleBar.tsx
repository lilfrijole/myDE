"use client";

interface TitleBarProps {
  title: string;
  isActive: boolean;
  onClose?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
  onPointerDown?: (e: React.PointerEvent) => void;
  icon?: React.ReactNode;
}

export default function TitleBar({
  title,
  isActive,
  onClose,
  onMinimize,
  onMaximize,
  onPointerDown,
  icon,
}: TitleBarProps) {
  return (
    <div
      className={isActive ? "win98-titlebar" : "win98-titlebar-inactive"}
      onPointerDown={onPointerDown}
      style={{ touchAction: "none" }}
    >
      {icon && <span style={{ marginRight: 2, display: "flex" }}>{icon}</span>}
      <span className="win98-titlebar-text">{title}</span>
      {onMinimize && (
        <button
          className="win98-titlebar-btn"
          onClick={(e) => {
            e.stopPropagation();
            onMinimize();
          }}
          aria-label="Minimize"
        >
          <svg width="8" height="7" viewBox="0 0 8 7">
            <rect x="0" y="5" width="7" height="2" fill="currentColor" />
          </svg>
        </button>
      )}
      {onMaximize && (
        <button
          className="win98-titlebar-btn"
          onClick={(e) => {
            e.stopPropagation();
            onMaximize();
          }}
          aria-label="Maximize"
        >
          <svg width="8" height="8" viewBox="0 0 8 8">
            <rect
              x="0"
              y="0"
              width="7"
              height="7"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>
        </button>
      )}
      {onClose && (
        <button
          className="win98-titlebar-btn"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          aria-label="Close"
        >
          <svg width="8" height="7" viewBox="0 0 8 7">
            <line x1="0" y1="0" x2="7" y2="7" stroke="currentColor" strokeWidth="1.5" />
            <line x1="7" y1="0" x2="0" y2="7" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </button>
      )}
    </div>
  );
}
