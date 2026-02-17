# Cohort Business Brain — Context Architecture Demo

Proves that structured lazy-loading prevents AI session collapse.
Naive mode degrades. Smart mode survives 30+ exchanges.

---

## Tomorrow's Build Order

### 1. Local setup (15 min)
```bash
npm install
cp .env.example .env
# Add your ANTHROPIC_API_KEY to .env
npm run dev
# Open public/index.html in browser (or serve with live-server)
```

### 2. Test locally first
Send this sequence in order:
1. "Who's in the current cohort?"
2. "Who hasn't paid yet?"
3. "What's our close rate this month?"
4. "What video goes up next week?"
5. "Status on the PokerJuice sponsorship?"
6. "Who referred Monica Shaw?"
7. "What's our YouTube subscriber count?"
8. "Who's at highest churn risk?"
9. "Who hasn't paid yet?" ← naive should struggle here

Watch naive token bar fill. Smart stays lean.

### 3. Deploy backend to Railway (20 min)
- Push to GitHub
- Connect repo to Railway
- Set env var: ANTHROPIC_API_KEY
- Note your Railway URL

### 4. Update frontend API_BASE (2 min)
Open ONLY this file: `public/config.js`
Change ONE line:
```js
window.API_BASE = "https://YOUR-APP.up.railway.app";
```
That's it. No other file changes between dev and prod.

### 5. Deploy frontend to Netlify (10 min)
- Drag /public folder into Netlify drop zone
- Or connect GitHub repo, set publish directory to /public

---

## Architecture

```
/brain
  CLAUDE.md       ← Operating rules (Tier 1, always)
  DASHBOARD.md    ← Current state snapshot (Tier 1, always)
  MEMORY.md       ← Learned patterns (Tier 1, always)
  /domains
    COHORTS.md    ← Member data (Tier 2, on demand)
    SALES.md      ← Pipeline (Tier 2, on demand)
    CONTENT.md    ← YouTube (Tier 2, on demand)
    SPONSORS.md   ← Deals (Tier 2, on demand)

/server
  index.js           ← Express routes
  contextManager.js  ← Core IP: detects topics, loads files
  claudeClient.js    ← Claude API wrapper
  config.js          ← Domain keyword mapping (edit per client)

/public
  index.html
  style.css
  app.js
```

---

## The Consulting Offer

Setup: $2,000
- Configure CLAUDE.md, DASHBOARD.md, MEMORY.md for their business
- Build domain files from their existing data
- Deploy to Railway + Netlify
- Train them on the update protocol

Monthly retainer: $500
- Evolve domain files as business changes
- Add new domains as needed
- Keep context tight and accurate

Target clients: Any cohort-based education business.
Bootcamps, masterminds, group coaching, accelerators.
They all have the same problem.
