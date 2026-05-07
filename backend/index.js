const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// --- Stato in memoria (MVP) ---
const state = {
    status: "IDLE", // IDLE | RUNNING | STOPPING | ERROR
    startedAt: null,
    lastError: null,
    logs: [],
    components: {
        camera1: "OFF",
        camera2: "OFF",
        conversion: "OFF",
        storage: "OFF"
    }
};

function pushLog(msg) {
    const line = `[${new Date().toISOString()}] ${msg}`;
    state.logs.push(line);
    // tieni max 300 righe
    if (state.logs.length > 300) state.logs.shift();
}

function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
}

// --- SIMULAZIONE pipeline ---
async function startPipelineSim(sessionName) {
  if (state.status === "RUNNING") return;

    state.status = "RUNNING";
    state.components.camera1 = "ON";
    state.components.camera2 = "ON";
    state.components.conversion = "ON";
    state.components.storage = "ON";
    state.startedAt = new Date().toISOString();
    state.lastError = null;

    pushLog(`START requested. sessionName=${sessionName || "N/A"}`);
    pushLog("Camera1: OK");
    pushLog("Camera2: OK");
    pushLog("Converting video -> raw: START");
    pushLog("Saving to storage: START");
}

async function stopPipelineSim() {
  if (state.status !== "RUNNING") return;

  state.status = "STOPPING";
  pushLog("STOP requested. Stopping pipeline...");

  await sleep(800);
  pushLog("Converting video -> raw: STOP");
  state.components.conversion = "OFF";

  await sleep(400);
  pushLog("Saving to storage: STOP");
  state.components.storage = "OFF";

  await sleep(400);
  pushLog("Cameras: STOP");
  state.components.camera1 = "OFF";
  state.components.camera2 = "OFF";

  state.status = "IDLE";
  state.startedAt = null;

  pushLog("Pipeline stopped. Status=IDLE");
}

// --- API ---
app.get("/api/health", (req, res) => {
    res.json({ ok: true });
});

app.get("/api/session/status", (req, res) => {
    res.json({
        status: state.status,
        startedAt: state.startedAt,
        lastError: state.lastError,
        components: state.components
    });
});

app.post("/api/session/start", async (req, res) => {
    try {
        const { sessionName } = req.body || {};
        if (state.status === "RUNNING") {
        return res.status(409).json({ error: "Session already running" });
        }
        await startPipelineSim(sessionName);
        res.json({ ok: true });
    } catch (e) {
        state.status = "ERROR";
        state.lastError = String(e?.message || e);
        pushLog(`ERROR: ${state.lastError}`);
        res.status(500).json({ error: "Failed to start session" });
    }
});

app.post("/api/session/stop", async (req, res) => {
    try {
        if (state.status !== "RUNNING") {
        return res.status(409).json({ error: "No running session" });
        }
        await stopPipelineSim();
        res.json({ ok: true });
    } catch (e) {
        state.status = "ERROR";
        state.lastError = String(e?.message || e);
        pushLog(`ERROR: ${state.lastError}`);
        res.status(500).json({ error: "Failed to stop session" });
    }
});

app.get("/api/logs", (req, res) => {
    // opzionale: ?tail=100
    const tail = Number(req.query.tail || 200);
    const slice = state.logs.slice(Math.max(0, state.logs.length - tail));
    res.json({ 
        lines: slice 
    });
});

app.get("/api/logs/download", (req, res) => {
  const content = state.logs.join("\n");
  const filename = `logs-${new Date().toISOString().replaceAll(":", "-")}.txt`;

  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  res.send(content);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Backend listening on http://127.0.0.1:3001/api/session/status`);
    pushLog("Backend started");
});