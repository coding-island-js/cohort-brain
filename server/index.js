// index.js — Express server

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { sendSmart, sendNaive } = require("./claudeClient");

const app = express();
const PORT = process.env.PORT || 3001;

// CORS — hardcoded allowed origins
// Add your Netlify URL here before deploying
const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "http://localhost:5500",  // VS Code Live Server default
  "http://127.0.0.1:5500",
  "http://localhost:8080",
  process.env.FRONTEND_URL, // set this in Railway env vars
].filter(Boolean); // remove undefined if FRONTEND_URL not set yet

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (curl, Postman, mobile)
    if (!origin) return callback(null, true);
    if (ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
    console.warn(`[CORS] Blocked origin: ${origin}`);
    return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "DELETE"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

// In-memory conversation histories keyed by sessionId
const histories = {
  smart: {},
  naive: {}
};

// POST /chat/smart
app.post("/chat/smart", async (req, res) => {
  const { message, sessionId = "default" } = req.body;
  if (!message) return res.status(400).json({ error: "message required" });
  if (!histories.smart[sessionId]) histories.smart[sessionId] = [];

  try {
    const result = await sendSmart(message, histories.smart[sessionId]);
    histories.smart[sessionId].push({ role: "user", content: message });
    histories.smart[sessionId].push({ role: "assistant", content: result.reply });
    return res.json({
      ...result,
      exchangeCount: Math.floor(histories.smart[sessionId].length / 2)
    });
  } catch (err) {
    console.error("[smart]", err.message);
    return res.status(500).json({ error: err.message });
  }
});

// POST /chat/naive
app.post("/chat/naive", async (req, res) => {
  const { message, sessionId = "default" } = req.body;
  if (!message) return res.status(400).json({ error: "message required" });
  if (!histories.naive[sessionId]) histories.naive[sessionId] = [];

  try {
    const result = await sendNaive(message, histories.naive[sessionId]);
    histories.naive[sessionId].push({ role: "user", content: message });
    histories.naive[sessionId].push({ role: "assistant", content: result.reply });
    return res.json({
      ...result,
      exchangeCount: Math.floor(histories.naive[sessionId].length / 2)
    });
  } catch (err) {
    console.error("[naive]", err.message);
    return res.status(500).json({ error: err.message });
  }
});

// DELETE /session/:sessionId — reset both histories
app.delete("/session/:sessionId", (req, res) => {
  const { sessionId } = req.params;
  histories.smart[sessionId] = [];
  histories.naive[sessionId] = [];
  res.json({ reset: true, sessionId });
});

// Health check — also shows active brain
app.get("/health", (req, res) => {
  const config = require("./config");
  res.json({
    status: "ok",
    activeBrain: config.activeBrain,
    brainPath: config.brainPath,
    allowedOrigins: ALLOWED_ORIGINS
  });
});

app.listen(PORT, () => {
  const config = require("./config");
  console.log(`✓ Brain server running on port ${PORT}`);
  console.log(`✓ Active brain: ${config.activeBrain}`);
  console.log(`✓ Brain path: ${config.brainPath}`);
  console.log(`✓ Allowed origins: ${ALLOWED_ORIGINS.join(", ")}`);
  console.log(`✓ Mode: ${process.env.NODE_ENV || "development"}`);
});
