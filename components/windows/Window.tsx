"use client";

import { useCallback, useRef } from "react";
import TitleBar from "./TitleBar";
import { useWindowStore, type WindowState } from "@/stores/windowStore";

const SNAP_THRESHOLD = 20;
const MIN_WIDTH = 200;
const MIN_HEIGHT = 120;

interface WindowProps {
  id: string;
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  resizable?: boolean;
  onClose?: () => void;
}

type ResizeDir = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";

export default function Window({
  id,
  title,
  children,
  icon,
  resizable = true,
  onClose,
}: WindowProps) {
  const win = useWindowStore((s) => s.windows[id]);
  const focusedWindowId = useWindowStore((s) => s.focusedWindowId);
  const moveWindow = useWindowStore((s) => s.moveWindow);
  const resizeWindow = useWindowStore((s) => s.resizeWindow);
  const focusWindow = useWindowStore((s) => s.focusWindow);
  const toggleMinimize = useWindowStore((s) => s.toggleMinimize);
  const toggleMaximize = useWindowStore((s) => s.toggleMaximize);
  const closeWindow = useWindowStore((s) => s.closeWindow);
  const setWindowPosition = useWindowStore((s) => s.setWindowPosition);

  const isFocused = focusedWindowId === id;

  const dragRef = useRef<{ startX: number; startY: number; winX: number; winY: number } | null>(null);
  const resizeRef = useRef<{
    dir: ResizeDir;
    startX: number;
    startY: number;
    origX: number;
    origY: number;
    origW: number;
    origH: number;
  } | null>(null);

  if (!win || !win.isOpen) return null;
  if (win.isMinimized) return null;

  const snap = (val: number, edge: number) =>
    Math.abs(val - edge) < SNAP_THRESHOLD ? edge : val;

  const handleDragStart = (e: React.PointerEvent) => {
    if (win.isMaximized) return;
    e.preventDefault();
    focusWindow(id);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      winX: win.x,
      winY: win.y,
    };
    const onMove = (ev: PointerEvent) => {
      if (!dragRef.current) return;
      let nx = dragRef.current.winX + (ev.clientX - dragRef.current.startX);
      let ny = dragRef.current.winY + (ev.clientY - dragRef.current.startY);
      nx = snap(nx, 0);
      ny = snap(ny, 0);
      nx = snap(nx, window.innerWidth - win.width);
      ny = snap(ny, window.innerHeight - win.height);
      if (ny < 0) ny = 0;
      moveWindow(id, nx, ny);
    };
    const onUp = () => {
      dragRef.current = null;
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  const handleResizeStart = (dir: ResizeDir) => (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    focusWindow(id);
    resizeRef.current = {
      dir,
      startX: e.clientX,
      startY: e.clientY,
      origX: win.x,
      origY: win.y,
      origW: win.width,
      origH: win.height,
    };
    const onMove = (ev: PointerEvent) => {
      if (!resizeRef.current) return;
      const r = resizeRef.current;
      const dx = ev.clientX - r.startX;
      const dy = ev.clientY - r.startY;
      let nx = r.origX,
        ny = r.origY,
        nw = r.origW,
        nh = r.origH;
      if (dir.includes("e")) nw = Math.max(MIN_WIDTH, r.origW + dx);
      if (dir.includes("w")) {
        nw = Math.max(MIN_WIDTH, r.origW - dx);
        nx = r.origX + r.origW - nw;
      }
      if (dir.includes("s")) nh = Math.max(MIN_HEIGHT, r.origH + dy);
      if (dir.includes("n")) {
        nh = Math.max(MIN_HEIGHT, r.origH - dy);
        ny = r.origY + r.origH - nh;
      }
      setWindowPosition(id, nx, ny, nw, nh);
    };
    const onUp = () => {
      resizeRef.current = null;
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  const style: React.CSSProperties = win.isMaximized
    ? { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: win.zIndex }
    : {
        position: "absolute",
        top: win.y,
        left: win.x,
        width: win.width,
        height: win.height,
        zIndex: win.zIndex,
      };

  const handleClose = () => {
    if (onClose) onClose();
    else closeWindow(id);
  };

  return (
    <div
      className="win98-window"
      style={style}
      onPointerDown={() => focusWindow(id)}
    >
      <TitleBar
        title={title}
        isActive={isFocused}
        icon={icon}
        onClose={handleClose}
        onMinimize={() => toggleMinimize(id)}
        onMaximize={() => toggleMaximize(id)}
        onPointerDown={handleDragStart}
      />
      <div
        className="win98-sunken"
        style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column", position: "relative" }}
      >
        {children}
        {!isFocused && (
          <div
            onPointerDown={(e) => {
              e.stopPropagation();
              focusWindow(id);
            }}
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 999,
              cursor: "default",
            }}
          />
        )}
      </div>
      {resizable && !win.isMaximized && (
        <>
          {(["n", "s", "e", "w", "ne", "nw", "se", "sw"] as ResizeDir[]).map(
            (dir) => (
              <div
                key={dir}
                className={`resize-handle resize-handle-${dir}`}
                onPointerDown={handleResizeStart(dir)}
                style={{ touchAction: "none" }}
              />
            )
          )}
        </>
      )}
    </div>
  );
}
