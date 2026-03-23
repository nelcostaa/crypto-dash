# Crypto Dash

Real-time cryptocurrency dashboard built with React, Vite, React Query, `ky`, and shadcn UI.

## Architecture

- Frontend requests `GET /api/assets`.
- Cloudflare Pages Function in [functions/api/assets.ts](functions/api/assets.ts) calls CoinCap server-side.
- CoinCap API key is never exposed in client bundles.

## Prerequisites

- Node.js 20+
- npm
- Cloudflare account with verified email
- CoinCap API key

## Setup

1. Install dependencies:
	 - `npm install`
2. Prepare local Cloudflare runtime secrets:
	 - `cp .dev.vars.example .dev.vars`
	 - set `COINCAP_API_KEY` in `.dev.vars`
3. Lint and build:
	 - `npm run lint`
	 - `npm run build`

## Local development

- Primary (production-parity runtime):
	- `npm run dev`
	- Runs Cloudflare Pages local runtime against `dist` and serves `/api/assets` through Functions.
- Optional frontend-only mode:
	- `npm run dev:vite`

## Cloudflare secrets

Set production secret for Pages project:

- `npx wrangler pages secret put COINCAP_API_KEY`

Optional:
- `COINCAP_API_BASE_URL` (defaults to `https://rest.coincap.io`)

## Deploy

- `npm run deploy:cf`

This deploys to the fixed Pages project name `crypto-dash`.

## Scripts

- `npm run dev` — local Cloudflare Pages runtime (parity)
- `npm run dev:vite` — Vite frontend-only dev server
- `npm run build` — production build
- `npm run lint` — lint checks
- `npm run preview` — Vite preview
- `npm run deploy:cf` — build and deploy to Cloudflare Pages (`crypto-dash`)

## Troubleshooting

- If the UI shows a network error, verify:
	- `COINCAP_API_KEY` is set in `.dev.vars` (local) or Pages secret (production).
	- `/api/assets` returns JSON at your local/deployed URL.
