// app.js — Vanilla frontend logic

// API_BASE is injected by config.js (see index.html)
// Dev:  public/config.js sets window.API_BASE = "http://localhost:3001"
// Prod: public/config.js sets window.API_BASE = "https://your-app.up.railway.app"
// One line change in one file. No other code touches this.
const API_BASE = window.API_BASE || "http://localhost:3001";

const SESSION_ID = "demo-" + Math.random().toString(36).slice(2, 8);
const MAX_CONTEXT_TOKENS = 180000;

// DOM refs
const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const resetBtn = document.getElementById("resetBtn");
const suggestBtns = document.querySelectorAll(".suggest-btn");

// Suggested messages
suggestBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    messageInput.value = btn.textContent.trim();
    messageInput.focus();
  });
});

// Reset session
resetBtn.addEventListener("click", async () => {
  await fetch(`${API_BASE}/session/${SESSION_ID}`, { method: "DELETE" });
  document.getElementById("naive-chat").innerHTML =
    '<div class="chat-placeholder">Session reset. Send a message to begin.</div>';
  document.getElementById("smart-chat").innerHTML =
    '<div class="chat-placeholder">Session reset. Send a message to begin.</div>';
  updateStats("naive", { inputTokens: 0, exchangeCount: 0, filesLoaded: [] });
  updateStats("smart", { inputTokens: 0, exchangeCount: 0, filesLoaded: [] });
});

// Send message
sendBtn.addEventListener("click", sendMessage);
messageInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) sendMessage();
});

async function sendMessage() {
  const message = messageInput.value.trim();
  if (!message) return;

  messageInput.value = "";
  sendBtn.disabled = true;

  // Show user message in both panels
  appendMessage("naive", "user", message);
  appendMessage("smart", "user", message);

  // Loading state
  const naiveLoading = appendMessage("naive", "loading", "Thinking...");
  const smartLoading = appendMessage("smart", "loading", "Thinking...");

  try {
    const [naiveResult, smartResult] = await Promise.all([
      callAPI("naive", message),
      callAPI("smart", message),
    ]);

    naiveLoading.remove();
    smartLoading.remove();

    appendMessage("naive", "naive", naiveResult.reply);
    appendMessage("smart", "smart", smartResult.reply);

    updateStats("naive", naiveResult);
    updateStats("smart", smartResult);
  } catch (err) {
    naiveLoading.textContent = "Error: " + err.message;
    smartLoading.textContent = "Error: " + err.message;
  } finally {
    sendBtn.disabled = false;
  }
}

async function callAPI(mode, message) {
  const res = await fetch(`${API_BASE}/chat/${mode}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, sessionId: SESSION_ID }),
  });

  if (!res.ok) throw new Error(`${mode} API error: ${res.status}`);
  return res.json();
}

function appendMessage(panel, type, text) {
  const chat = document.getElementById(`${panel}-chat`);
  const placeholder = chat.querySelector(".chat-placeholder");
  if (placeholder) placeholder.remove();

  const div = document.createElement("div");
  div.className = `msg msg-${type}`;
  div.textContent = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
  return div;
}

function updateStats(mode, data) {
  const { inputTokens = 0, exchangeCount = 0, filesLoaded = [] } = data;

  // Token count
  document.getElementById(`${mode}-tokens`).textContent =
    inputTokens > 0 ? inputTokens.toLocaleString() : "—";

  // Exchange count
  document.getElementById(`${mode}-exchanges`).textContent = exchangeCount;

  // Token bar
  const pct = Math.min((inputTokens / MAX_CONTEXT_TOKENS) * 100, 100);
  const bar = document.getElementById(`${mode}-bar`);
  bar.style.width = pct + "%";

  // Color shifts as it fills — warning at 50%, danger at 80%
  if (mode === "naive") {
    if (pct > 80) bar.style.background = "#ff2222";
    else if (pct > 50) bar.style.background = "#ff8844";
  }

  document.getElementById(`${mode}-bar-pct`).textContent =
    `${pct.toFixed(1)}% of context used`;

  // Files loaded
  const filesEl = document.getElementById(`${mode}-files`);
  if (filesLoaded.length > 0) {
    filesEl.textContent = "Loaded: " + filesLoaded.join(", ");
  }
}

// Auto-run all 9 questions button
const autoRunBtn = document.createElement("button");
autoRunBtn.textContent = "RUN FULL DEMO (9 QUESTIONS)";
autoRunBtn.className = "send-btn";
autoRunBtn.style.background = "#059669";
autoRunBtn.style.marginBottom = "1rem";

autoRunBtn.addEventListener("click", async () => {
  const questions = [
    "What products are running low on stock?",
    "Which gym accounts have overdue invoices?",
    "What's our highest margin SKU?",
    "Status on the Shenzhen factory order?",
    "What video goes up this week?",
    "Which wholesale accounts are up for renewal?",
    "What did the Gymshark DM say?",
    "How much are we owed in unpaid invoices?",
    "What products are running low on stock?", // repeat to prove naive forgets
  ];

  sendBtn.disabled = true;
  autoRunBtn.disabled = true;

  for (let i = 0; i < questions.length; i++) {
    messageInput.value = questions[i];
    await sendMessage();
    await new Promise((resolve) => setTimeout(resolve, 3000)); // 3 sec delay between questions
  }

  sendBtn.disabled = false;
  autoRunBtn.disabled = false;
});

// Insert auto-run button before the send button
sendBtn.parentElement.insertBefore(autoRunBtn, sendBtn);
