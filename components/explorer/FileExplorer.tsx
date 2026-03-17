"use client";

import { useState, useMemo } from "react";
import Window from "@/components/windows/Window";
import FileItem from "./FileItem";
import { useProjectStore } from "@/stores/projectStore";

interface FolderNode {
  name: string;
  files: string[];
  children: Record<string, FolderNode>;
}

function buildTree(files: { name: string }[]): FolderNode {
  const root: FolderNode = { name: "", files: [], children: {} };
  for (const file of files) {
    const parts = file.name.split("/");
    let node = root;
    for (let i = 0; i < parts.length - 1; i++) {
      const dir = parts[i];
      if (!node.children[dir]) {
        node.children[dir] = { name: dir, files: [], children: {} };
      }
      node = node.children[dir];
    }
    node.files.push(file.name);
  }
  return root;
}

function FolderGroup({ node, allFiles }: { node: FolderNode; allFiles: { name: string; locked: boolean }[] }) {
  const [expanded, setExpanded] = useState(true);
  const totalFiles =
    node.files.length +
    Object.values(node.children).reduce(
      (sum, c) => sum + c.files.length,
      0
    );

  return (
    <div>
      <div
        onClick={() => setExpanded(!expanded)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          padding: "2px 4px",
          cursor: "pointer",
          fontWeight: "bold",
          fontSize: 11,
        }}
      >
        <span style={{ fontSize: 8, width: 10 }}>{expanded ? "▼" : "▶"}</span>
        <span>📁</span>
        <span>{node.name}</span>
        <span style={{ color: "#808080", fontWeight: "normal", fontSize: 10 }}>
          ({totalFiles})
        </span>
      </div>
      {expanded && (
        <div>
          {Object.values(node.children).map((child) => (
            <div key={child.name} style={{ paddingLeft: 12 }}>
              <FolderGroup node={child} allFiles={allFiles} />
            </div>
          ))}
          {node.files.map((fName) => {
            const file = allFiles.find((f) => f.name === fName);
            return <FileItem key={fName} name={fName} locked={file?.locked} />;
          })}
        </div>
      )}
    </div>
  );
}

export default function FileExplorer() {
  const files = useProjectStore((s) => s.files);
  const openFileNames = useProjectStore((s) => s.openFileNames);
  const projectName = useProjectStore((s) => s.currentProjectName);
  const [tab, setTab] = useState<"all" | "open">("all");
  const [search, setSearch] = useState("");

  const tree = useMemo(() => buildTree(files), [files]);

  const displayFiles =
    tab === "open"
      ? files.filter((f) => openFileNames.includes(f.name))
      : files;

  const filteredFiles = search
    ? displayFiles.filter((f) =>
        f.name.toLowerCase().includes(search.toLowerCase())
      )
    : displayFiles;

  const explorerTitle = projectName ? `${projectName}` : "Project Files";

  return (
    <Window id="file-explorer" title={explorerTitle} icon={<span>🏃</span>}>
      <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "var(--aim-button-face)" }}>
        {/* myDE Logo area */}
        <div
          style={{
            textAlign: "center",
            padding: "8px 4px",
            borderBottom: "1px solid var(--aim-button-shadow)",
          }}
        >
          <span style={{ fontSize: 28 }}>🏃</span>
          <div style={{ fontSize: 10, fontWeight: "bold", marginTop: 2 }}>myDE</div>
        </div>

        {/* Tabs */}
        <div className="win98-tab-bar">
          <button
            className={tab === "all" ? "win98-tab-active" : "win98-tab"}
            onClick={() => setTab("all")}
          >
            All Files
          </button>
          <button
            className={tab === "open" ? "win98-tab-active" : "win98-tab"}
            onClick={() => setTab("open")}
          >
            Open
          </button>
        </div>

        {/* File tree */}
        <div
          style={{
            flex: 1,
            overflow: "auto",
            background: "#ffffff",
            border: "2px solid",
            borderColor: "var(--aim-button-shadow) var(--aim-button-highlight) var(--aim-button-highlight) var(--aim-button-shadow)",
          }}
        >
          {files.length === 0 ? (
            <div style={{ color: "#808080", textAlign: "center", padding: 16, fontSize: 11 }}>
              No files yet. Start a chat to generate code.
            </div>
          ) : search ? (
            filteredFiles.map((f) => (
              <FileItem key={f.name} name={f.name} locked={f.locked} />
            ))
          ) : (
            Object.values(tree.children).map((node) => (
              <FolderGroup key={node.name} node={node} allFiles={files} />
            ))
          )}
          {/* Root-level files */}
          {!search &&
            tree.files.map((fName) => {
              const file = files.find((f) => f.name === fName);
              return <FileItem key={fName} name={fName} locked={file?.locked} />;
            })}
        </div>

        {/* Search */}
        <div style={{ display: "flex", gap: 2, padding: 4 }}>
          <input
            className="win98-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search files"
            style={{ flex: 1 }}
          />
          <button className="win98-button" style={{ padding: "2px 8px" }}>
            Go
          </button>
        </div>
      </div>
    </Window>
  );
}
