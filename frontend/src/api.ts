import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

export const api = axios.create({ baseURL });

export type SessionStatus = {
  status: "IDLE" | "RUNNING" | "STOPPING" | "ERROR";
  startedAt: string | null;
  lastError: string | null;
  components: {
    camera1: "ON" | "OFF";
    camera2: "ON" | "OFF";
    conversion: "ON" | "OFF";
    storage: "ON" | "OFF";
  };
};

export async function getStatus() {
  const { data } = await api.get<SessionStatus>("/api/session/status");
  return data;
}

export async function startSession(sessionName: string) {
  await api.post("/api/session/start", { sessionName });
}

export async function stopSession() {
  await api.post("/api/session/stop");
}

export async function getLogs(tail = 200) {
  const { data } = await api.get<{ lines: string[] }>(`/api/logs?tail=${tail}`);
  return data.lines;
}

export function getLogsDownloadUrl() {
  const baseURL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:3001";
  return `${baseURL}/api/logs/download`;
}