"use client";

import { useProjectStore } from "@/stores/projectStore";

export default function EditorTabs() {
  const openFileNames = useProjectStore((s) => s.openFileNames);
  const activeFileName = useProjectStore((s) => s.activeFileName);
  const setActiveFile = useProjectStore((s) => s.setActiveFile);
  const closeFile = useProjectStore((s) => s.closeFile);
  const modifiedFiles = useProjectStore((s) => s.modifiedFiles);

  if (openFileNames.length === 0) return null;

  return (
    <div className="win98-tab-bar" style={{ paddingTop: 2 }}>
      {openFileNames.map((name) => {
        const isActive = name === activeFileName;
        const isModified = modifiedFiles.has(name);
        const shortName = name.split("/").pop() ?? name;

        return (
          <div
            key={name}
            className={isActive ? "win98-tab-active" : "win98-tab"}
            onClick={() => setActiveFile(name)}
            style={{ display: "flex", alignItems: "center", gap: 4, paddingRight: 4 }}
          >
            {isModified && (
              <span style={{ color: "#ff6600", fontSize: 14, lineHeight: 1 }}>
                &bull;
              </span>
            )}
            <span>{shortName}</span>
            <span
              onClick={(e) => {
                e.stopPropagation();
                closeFile(name);
              }}
              style={{
                cursor: "pointer",
                fontSize: 9,
                padding: "0 2px",
                marginLeft: 2,
              }}
            >
              ✕
            </span>
          </div>
        );
      })}
    </div>
  );
}
