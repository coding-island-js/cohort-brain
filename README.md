# Cohort Brain — Context Architecture Demo

Proves that structured lazy-loading prevents AI session collapse.
Naive mode degrades. Smart mode survives 30+ exchanges.

## Quick Start

npm install
cp .env.example .env
Add your ANTHROPIC_API_KEY to .env
npm run dev

Open public/index.html in your browser.

## Architecture

/brains
/supplement ← Supplement brand dataset
/poker ← Poker coaching dataset
/health ← Concierge health dataset

/server
index.js ← Express routes
contextManager.js ← Detects topics, loads files
claudeClient.js ← Claude API wrapper
config.js ← Domain keyword mapping

/public
index.html / style.css / app.js

## Switch Dataset

Set ACTIVE_BRAIN in your .env
Options: supplement, poker, health

## Deploy

Backend: Railway — set ANTHROPIC_API_KEY and ACTIVE_BRAIN
Frontend: Netlify — drag /public folder, update public/config.js with Railway URL
