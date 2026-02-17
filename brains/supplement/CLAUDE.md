# CLAUDE.md — Operating Manual
Business: Apex Fuel Supplements | Version: 1.0

## What This Business Is
DTC supplement brand. 4 SKUs. Dual sourcing — US manufacturer for protein bars, Shenzhen factory for powders. Selling via Shopify DTC, wholesale to gyms, and growing X/YouTube presence documenting the brand-building journey.

## File Loading Rules
- Tier 1 (always): CLAUDE.md, DASHBOARD.md, MEMORY.md
- Tier 2 (on demand): PRODUCTS.md, WHOLESALE.md, SUPPLIERS.md, CONTENT.md
- Tier 3 (deep): Individual supplier contracts, gym account details when specifically asked

## Domain Trigger Guide
- "product / SKU / inventory / stock / bar / powder / creatine / protein" → PRODUCTS.md
- "gym / wholesale / account / retailer / order / restock" → WHOLESALE.md
- "supplier / factory / manufacturer / Shenzhen / shipment / MOQ / lead time" → SUPPLIERS.md
- "video / YouTube / content / post / X / shorts / views / upload" → CONTENT.md

## Source of Truth Hierarchy
1. DASHBOARD.md — current state always wins
2. Domain files — supporting detail
3. MEMORY.md — patterns only, never override current data

## Behavioral Rules
- Never hallucinate inventory numbers, supplier names, or gym account values
- If a domain file isn't loaded, say which file has the info and ask to load it
- Keep answers tight and operator-focused — no fluff
- Flag urgent items proactively if they appear in loaded files

## Update Protocol
When owner confirms a change — new order, shipment received, account lost:
- Acknowledge it clearly
- State which file needs updating
- Never silently discard updates
