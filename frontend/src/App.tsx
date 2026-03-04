import { useEffect, useMemo, useState } from "react";
import { getStatus, startSession, stopSession, type SessionStatus } from "./api";
import LogPanel from "./components/LogPanel";
import StatusCards from "./components/StatusCards";

function StatusBadge({ status }: { status: SessionStatus["status"] }) {
  const label = useMemo(() => {
    switch (status) {
      case "IDLE":
        return "IDLE";
      case "RUNNING":
        return "RUNNING";
      case "STOPPING":
        return "STOPPING";
      case "ERROR":
        return "ERROR";
    }
  }, [status]);

  return (
    <span
      style={{
        padding: "6px 10px",
        borderRadius: 999,
        border: "1px solid #ddd",
        fontWeight: 700
      }}
    >
      {label}
    </span>
  );
}

export default function App() {
  const [sessionName, setSessionName] = useState("session-001");
  const [status, setStatus] = useState<SessionStatus | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    try {
      setError(null);
      const s = await getStatus();
      setStatus(s);
    } catch (e: any) {
      setError(e?.message || "Failed to load status");
    }
  }

  useEffect(() => {
    refresh();
    const t = setInterval(refresh, 1200);
    return () => clearInterval(t);
  }, []);

  async function onStart() {
    setBusy(true);
    setError(null);
    try {
      await startSession(sessionName);
      await refresh();
    } catch (e: any) {
      setError(e?.response?.data?.error || e?.message || "Start failed");
    } finally {
      setBusy(false);
    }
  }

  async function onStop() {
    setBusy(true);
    setError(null);
    try {
      await stopSession();
      await refresh();
    } catch (e: any) {
      setError(e?.response?.data?.error || e?.message || "Stop failed");
    } finally {
      setBusy(false);
    }
  }

  const st = status?.status ?? "IDLE";
  const comps = status?.components;

  return (
  <div style={{ maxWidth: 980, margin: "40px auto", padding: 16, fontFamily: "system-ui" }}>
    <h1 style={{ marginBottom: 8 }}>IoT4care — Jetson Video Pipeline Dashboard</h1>

    <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16 }}>
      <div>Session status:</div>
      <StatusBadge status={st} />
      {status?.startedAt ? (
        <div style={{ marginLeft: 8, opacity: 0.8 }}>Started: {status.startedAt}</div>
      ) : null}
    </div>

    <div style={{ marginBottom: 16 }}>
      <StatusCards components={comps} />
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      <div style={{ border: "1px solid #eee", borderRadius: 12, padding: 16 }}>
        <h2 style={{ marginTop: 0 }}>Controls</h2>

        <label style={{ display: "block", fontWeight: 600, marginBottom: 6 }}>Session name</label>
        <input
          value={sessionName}
          onChange={(e) => setSessionName(e.target.value)}
          style={{ width: "100%", padding: 10, borderRadius: 10, border: "1px solid #ddd" }}
        />

        <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
          <button
            onClick={onStart}
            disabled={busy || st === "RUNNING" || st === "STOPPING"}
            style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid #ddd", cursor: "pointer" }}
          >
            Start
          </button>
          <button
            onClick={onStop}
            disabled={busy || st !== "RUNNING"}
            style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid #ddd", cursor: "pointer" }}
          >
            Stop
          </button>
          <button
            onClick={refresh}
            disabled={busy}
            style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid #ddd", cursor: "pointer" }}
          >
            Refresh
          </button>
        </div>

        {error ? (
          <div style={{ marginTop: 12, color: "crimson", fontWeight: 600 }}>
            {error}
          </div>
        ) : null}

        {status?.lastError ? (
          <div style={{ marginTop: 12, color: "crimson" }}>
            Last error: {status.lastError}
          </div>
        ) : null}
      </div>

      <div style={{ border: "1px solid #eee", borderRadius: 12, padding: 16 }}>
        <h2 style={{ marginTop: 0 }}>Notes</h2>
        <ul style={{ marginTop: 0, lineHeight: 1.6 }}>
          <li>Backend in modalità simulazione (sviluppo rapido).</li>
          <li>Prossimo step: pannello log realtime + indicatori Camera/Storage.</li>
        </ul>
      </div>
    </div>

    {/* 👇 QUI AGGIUNTO */}
    <div style={{ marginTop: 16 }}>
      <LogPanel />
    </div>

  </div>
);

}