import { useEffect, useRef, useState } from "react";
import { getLogs, getLogsDownloadUrl } from "../api";

export default function LogPanel() {
  const [lines, setLines] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const boxRef = useRef<HTMLDivElement | null>(null);

  async function refresh() {
    try {
      setError(null);
      const l = await getLogs(200);
      setLines(l);
    } catch (e: any) {
      setError(e?.message || "Failed to load logs");
    }
  }

  useEffect(() => {
    refresh();
    const t = setInterval(refresh, 1200);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    // autoscroll in fondo
    const el = boxRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  return (
    <div style={{ border: "1px solid #eee", borderRadius: 12, padding: 16 }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
    <h2 style={{ marginTop: 0, marginBottom: 10 }}>Logs</h2>

  <div style={{ display: "flex", gap: 10 }}>
    <a
      href={getLogsDownloadUrl()}
      style={{
        padding: "8px 12px",
        borderRadius: 10,
        border: "1px solid #ddd",
        textDecoration: "none",
        color: "inherit",
        fontWeight: 600
      }}
    >
      Download
    </a>

    <button
      onClick={refresh}
      style={{
        padding: "8px 12px",
        borderRadius: 10,
        border: "1px solid #ddd",
        cursor: "pointer"
      }}
    >
      Refresh
    </button>
    </div>
</div>

      {error ? <div style={{ color: "crimson", fontWeight: 600 }}>{error}</div> : null}

      <div
        ref={boxRef}
        style={{
          height: 260,
          overflow: "auto",
          background: "#111",
          borderRadius: 10,
          padding: 12,
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          fontSize: 12,
          lineHeight: 1.5,
          border: "1px solid #333"
        }}
      >
        {lines.length === 0 ? (
          <div style={{ opacity: 0.7 }}>No logs yet.</div>
        ) : (
          lines.map((l, idx) => (
            <div key={idx} style={{ whiteSpace: "pre-wrap" }}>
              {l}
            </div>
          ))
        )}
      </div>
    </div>
  );
}