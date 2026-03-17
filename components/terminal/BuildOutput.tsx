"use client";

import { useState } from "react";
import Window from "@/components/windows/Window";

export default function BuildOutput() {
  const [logs] = useState<string[]>([
    "myDE Build Output",
    "─────────────────",
    "Ready. Waiting for deployment...",
  ]);

  return (
    <Window id="build-output" title="Build Output" icon={<span>📋</span>}>
      <div
        style={{
          flex: 1,
          overflow: "auto",
          background: "#000000",
          color: "#00ff00",
          fontFamily: 'Consolas, "Courier New", monospace',
          fontSize: 11,
          padding: 8,
          whiteSpace: "pre-wrap",
        }}
      >
        {logs.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </div>
    </Window>
  );
}
