"use client";

import { useState, useRef, useEffect } from "react";
import { useWindowStore } from "@/stores/windowStore";
import { useProjectStore } from "@/stores/projectStore";
import { soundManager } from "@/lib/sounds";

interface MenuItem {
  label: string;
  action?: () => void;
  separator?: boolean;
}

interface MenuDef {
  label: string;
  items: MenuItem[];
}

export default function MenuBar() {
  const openWindow = useWindowStore((s) => s.openWindow);
  const closeWindow = useWindowStore((s) => s.closeWindow);
  const windows = useWindowStore((s) => s.windows);
  const clearProject = useProjectStore((s) => s.clearProject);

  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const menus: MenuDef[] = [
    {
      label: "myDE",
      items: [
        { label: "About myDE", action: () => alert("myDE - AIM-Themed IDE\nPowered by V0 SDK") },
        { label: "", separator: true },
        { label: "Settings", action: () => { openWindow("settings"); setOpenMenu(null); } },
      ],
    },
    {
      label: "File",
      items: [
        { label: "New Project", action: () => { setOpenMenu(null); } },
        { label: "Close Project", action: () => { clearProject(); soundManager.play("door-close"); setOpenMenu(null); } },
      ],
    },
    {
      label: "View",
      items: [
        ...["file-explorer", "code-editor", "ai-chat", "live-preview", "build-output"].map((id) => ({
          label: `${windows[id]?.isOpen ? "✓ " : "  "}${id.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase())}`,
          action: () => {
            if (windows[id]?.isOpen) closeWindow(id);
            else openWindow(id);
            setOpenMenu(null);
          },
        })),
      ],
    },
    {
      label: "Help",
      items: [
        { label: "V0 Documentation", action: () => window.open("https://v0.app/docs/api/platform/overview", "_blank") },
        { label: "Aleo Documentation", action: () => window.open("https://developer.aleo.org/", "_blank") },
        { label: "", separator: true },
        { label: "About", action: () => alert("myDE v0.1.0\nAIM-Themed IDE") },
      ],
    },
  ];

  return (
    <div className="win98-menubar" ref={menuRef} style={{ position: "relative", zIndex: 99990 }}>
      {menus.map((menu) => (
        <div key={menu.label} style={{ position: "relative" }}>
          <div
            className="win98-menubar-item"
            onClick={() => setOpenMenu(openMenu === menu.label ? null : menu.label)}
            onMouseEnter={() => openMenu && setOpenMenu(menu.label)}
          >
            {menu.label}
          </div>
          {openMenu === menu.label && (
            <div className="win98-dropdown" style={{ top: "100%", left: 0 }}>
              {menu.items.map((item, i) =>
                item.separator ? (
                  <div key={i} className="win98-dropdown-separator" />
                ) : (
                  <div
                    key={i}
                    className="win98-dropdown-item"
                    onClick={item.action}
                  >
                    {item.label}
                  </div>
                )
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
