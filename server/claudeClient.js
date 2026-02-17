// claudeClient.js — Claude API wrapper

const Anthropic = require("@anthropic-ai/sdk");
const { buildSmartContext, buildNaiveContext } = require("./contextManager");

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const MODEL = "claude-sonnet-4-5-20250929";
const MAX_TOKENS = 1024;

// Send a message in smart mode — selective context loading
async function sendSmart(message, conversationHistory = []) {
  const { context, filesLoaded, tokenEstimate } = buildSmartContext(message);

  const systemPrompt = `You are a business operations AI for a cohort education company.
  
The following files have been loaded for this session:
${filesLoaded.join(", ")}

Use ONLY the information in these files to answer. Do not hallucinate member names, deal values, or dates.
If asked about something not in the loaded files, say which file would contain that info.

---

${context}`;

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    system: systemPrompt,
    messages: [...conversationHistory, { role: "user", content: message }]
  });

  return {
    reply: response.content[0].text,
    filesLoaded,
    contextTokens: tokenEstimate,
    inputTokens: response.usage.input_tokens,
    outputTokens: response.usage.output_tokens,
    mode: "smart"
  };
}

// Send a message in naive mode — dumps all context every time
async function sendNaive(message, conversationHistory = []) {
  const { context, filesLoaded, tokenEstimate } = buildNaiveContext();

  const systemPrompt = `You are a business operations AI for a cohort education company.

All business files have been loaded:
${filesLoaded.join(", ")}

---

${context}`;

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    system: systemPrompt,
    messages: [...conversationHistory, { role: "user", content: message }]
  });

  return {
    reply: response.content[0].text,
    filesLoaded,
    contextTokens: tokenEstimate,
    inputTokens: response.usage.input_tokens,
    outputTokens: response.usage.output_tokens,
    mode: "naive"
  };
}

module.exports = { sendSmart, sendNaive };
