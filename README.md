# Clarity Maybe? — Project Definition & Delivery Playbook

Clarity Maybe? is a React + Vite single‑page app that helps teams break down projects, define scope, and keep delivery on track. It combines structured workshops, scorecards, and timelines so you can move from fuzzy ideas to an actionable plan fast.

## Why Teams Use It
- **Get alignment fast:** Guided workshops to capture goals, risks, and research tracks in one place.
- **Score what matters:** Rate effort, integration risk, knowledge gaps, and cost to focus on the right work.
- **Plan the path:** Timeline, Gantt, and resource views to see load, dependencies, and critical paths.
- **No backend required:** Ships with in‑memory data; plug in SurrealDB when you’re ready for persistence.

## Feature Highlights
- Workshop mode for rapid item capture and editing
- Matrix, timeline, and Gantt visualizations
- Resource and cost snapshots
- SPA routing with nginx proxy support for SurrealDB at `/rpc`

## Quickstart (Local)
1. Install Node.js 20+  
2. Install deps: `npm install`  
3. Run dev server: `npm run dev` (defaults to `http://localhost:3000`)  

## Production Build
```
npm install
npm run build
# serve dist/ with your static host (nginx example in DEPLOY_INSTRUCTIONS.md)
```

## Deploying with SurrealDB (Optional)
- SurrealDB service: bind `127.0.0.1:8000`, data at `/var/lib/surrealdb/data.db`, credentials `root/root`.
- nginx: serve `/var/www/clarity-app/dist` and proxy `/rpc` → `http://127.0.0.1:8000` with websocket upgrade.
- Full steps: see `DEPLOY_INSTRUCTIONS.md`.

## Tech Stack
- React 19, TypeScript, Vite
- Tailwind (CDN) for styling
- Recharts for visuals
- SurrealDB (optional) for persistence
