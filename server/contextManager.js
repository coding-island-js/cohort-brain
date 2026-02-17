// contextManager.js — Core context loading logic
// This is the architecture that prevents context collapse.

const fs = require("fs");
const path = require("path");
const config = require("./config");

// Load a single file from the brain directory
function loadFile(filename, subdir = "") {
  const filePath = subdir
    ? path.join(config.brainPath, subdir, filename)
    : path.join(config.brainPath, filename);

  if (!fs.existsSync(filePath)) {
    console.warn(`[contextManager] File not found: ${filePath}`);
    return "";
  }

  return fs.readFileSync(filePath, "utf8");
}

// Detect which domain files are relevant to the message
function detectDomains(message) {
  const lower = message.toLowerCase();
  const matched = [];

  for (const [filename, keywords] of Object.entries(config.domains)) {
    const hit = keywords.some((kw) => lower.includes(kw));
    if (hit) matched.push(filename);
  }

  return matched;
}

// Build context for SMART mode — tier 1 always, tier 2 on demand
function buildSmartContext(message) {
  const blocks = [];
  const filesLoaded = [];

  // Tier 1 — always
  for (const filename of config.tier1) {
    const content = loadFile(filename);
    if (content) {
      blocks.push(`### ${filename}\n${content}`);
      filesLoaded.push(filename);
    }
  }

  // Tier 2 — on demand
  const domainFiles = detectDomains(message);
  for (const filename of domainFiles) {
    const content = loadFile(filename, "domains");
    if (content) {
      blocks.push(`### ${filename}\n${content}`);
      filesLoaded.push(filename);
    }
  }

  const context = blocks.join("\n\n---\n\n");

  return {
    context,
    filesLoaded,
    tokenEstimate: estimateTokens(context),
    mode: "smart"
  };
}

// Build context for NAIVE mode — dumps everything upfront
function buildNaiveContext() {
  const blocks = [];
  const filesLoaded = [];

  // Tier 1
  for (const filename of config.tier1) {
    const content = loadFile(filename);
    if (content) {
      blocks.push(`### ${filename}\n${content}`);
      filesLoaded.push(filename);
    }
  }

  // All domain files regardless of relevance
  for (const filename of Object.keys(config.domains)) {
    const content = loadFile(filename, "domains");
    if (content) {
      blocks.push(`### ${filename}\n${content}`);
      filesLoaded.push(filename);
    }
  }

  const context = blocks.join("\n\n---\n\n");

  return {
    context,
    filesLoaded,
    tokenEstimate: estimateTokens(context),
    mode: "naive"
  };
}

// Rough token estimator — ~4 chars per token
function estimateTokens(text) {
  return Math.ceil(text.length / 4);
}

module.exports = { buildSmartContext, buildNaiveContext, estimateTokens };
