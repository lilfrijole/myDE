"use client";

import { useSettingsStore } from "@/stores/settingsStore";

export default function AleoToggle() {
  const aleoMode = useSettingsStore((s) => s.aleoMode);
  const privacyMode = useSettingsStore((s) => s.privacyMode);
  const toggleAleo = useSettingsStore((s) => s.toggleAleo);
  const setPrivacyMode = useSettingsStore((s) => s.setPrivacyMode);

  return (
    <div style={{ fontSize: 11 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <input
          type="checkbox"
          className="win98-checkbox"
          checked={aleoMode}
          onChange={toggleAleo}
          id="aleo-toggle"
        />
        <label htmlFor="aleo-toggle" style={{ cursor: "pointer", fontWeight: "bold" }}>
          Enable Aleo Mode
        </label>
      </div>

      <div style={{ color: "#808080", marginBottom: 12, fontSize: 10, paddingLeft: 21 }}>
        When enabled, the AI chat will include Aleo/Leo programming context.
        Code generation will target the Leo language for Aleo blockchain development.
      </div>

      {aleoMode && (
        <div
          style={{
            border: "1px solid var(--aim-button-shadow)",
            padding: 8,
            marginBottom: 8,
          }}
        >
          <div style={{ fontWeight: "bold", marginBottom: 6 }}>Privacy Mode</div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ display: "flex", alignItems: "flex-start", gap: 6, cursor: "pointer" }}>
              <input
                type="radio"
                name="privacy"
                checked={privacyMode === "private"}
                onChange={() => setPrivacyMode("private")}
                style={{ marginTop: 2 }}
              />
              <div>
                <div style={{ fontWeight: "bold" }}>🔒 Private by Default</div>
                <div style={{ color: "#808080", fontSize: 10 }}>
                  Uses zero-knowledge proofs for private state. Data is hidden
                  from the blockchain using record types and private transitions.
                </div>
              </div>
            </label>

            <label style={{ display: "flex", alignItems: "flex-start", gap: 6, cursor: "pointer" }}>
              <input
                type="radio"
                name="privacy"
                checked={privacyMode === "public"}
                onChange={() => setPrivacyMode("public")}
                style={{ marginTop: 2 }}
              />
              <div>
                <div style={{ fontWeight: "bold" }}>🌐 Public</div>
                <div style={{ color: "#808080", fontSize: 10 }}>
                  Uses on-chain public mappings and finalize blocks.
                  All transaction data is visible on the blockchain.
                </div>
              </div>
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
