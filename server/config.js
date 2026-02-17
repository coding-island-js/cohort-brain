// config.js — Domain keyword mapping
// Edit this file per client deployment. No code changes needed.
// To swap brain dataset: set ACTIVE_BRAIN env var
// Available brains: supplement | poker | health

const ACTIVE_BRAIN = process.env.ACTIVE_BRAIN || "supplement";

const domainConfig = {

  activeBrain: ACTIVE_BRAIN,

  // Brain file base path — absolute, works in dev and prod
  brainPath: require("path").join(__dirname, "../brains", ACTIVE_BRAIN),

  // Tier 1 — always loaded, in this order
  tier1: ["CLAUDE.md", "DASHBOARD.md", "MEMORY.md"],

  // Domain keyword mapping — controls lazy loading
  domains: {
    // Supplement brain
    "PRODUCTS.md":  ["product", "sku", "inventory", "stock", "bar", "powder", "creatine", "protein", "pre-workout"],
    "WHOLESALE.md": ["gym", "wholesale", "account", "retailer", "order", "restock", "invoice"],
    "SUPPLIERS.md": ["supplier", "factory", "manufacturer", "shenzhen", "shipment", "moq", "lead time"],
    // Poker brain
    "COHORTS.md":   ["cohort", "member", "enrolled", "bootcamp", "student", "paid", "unpaid", "pending", "basecamp"],
    "SALES.md":     ["lead", "sales", "pipeline", "close", "prospect", "call", "booked", "deal", "waitlist"],
    "CHALLENGE.md": ["challenge", "session", "hours", "win rate", "profit", "$100", "hourly", "hustler", "experiment"],
    // Health brain
    "MEMBERS.md":   ["member", "patient", "renewal", "labs", "protocol", "bloodwork", "dexa"],
    "PIPELINE.md":  ["consult", "prospect", "waitlist", "pipeline"],
    "CARE_TEAM.md": ["doctor", "physician", "dietitian", "coach", "team", "capacity", "hire"],
    // Shared
    "CONTENT.md":   ["video", "youtube", "content", "post", "views", "upload", "shorts", "channel", "subscribers"],
  },

  // Token targets
  tier1TokenTarget: 800,
  maxContextTokens: 180000
};

module.exports = domainConfig;
