# Crypto Dash

Crypto dashboard built with React + Vite + TypeScript.

## Requested checklist

- [x] Create repo with React app based on Vite with React Query, `ky`, and shadcn UI
- [x] Connect CoinCap API (`https://pro.coincap.io/api-docs`) via reusable API client
- [x] Create page showing coin list with shadcn table and 60s auto-refetch
- [x] Display required columns: `name`, `symbol`, `priceUsd`, `changePercent24Hr`, `marketCapUsd`, `volumeUsd24Hr`, `supply/maxSupply`
- [x] Add red/green styles for `changePercent24Hr` and related value emphasis (`priceUsd`)
- [x] Add npm deploy script for Cloudflare using wrangler
- [ ] Create fake account using fakemail.net (manual step outside repo automation)

## Stack

- React + Vite + TypeScript
- shadcn UI components
- `@tanstack/react-query`
- `ky`
- Cloudflare Pages deploy with `wrangler`

## Environment variables

This app now fetches CoinCap through a Cloudflare Pages Function (`/api/assets`).
The CoinCap API key is server-side only.

Client-side `.env` is optional and should not contain CoinCap secrets.

Set Cloudflare Pages secret:

```bash
npx wrangler pages secret put COINCAP_API_KEY
```

Notes:
- Secret is read by [functions/api/assets.ts](functions/api/assets.ts).
- Optional server env `COINCAP_API_BASE_URL` defaults to `https://pro.coincap.io`.

## Scripts

- `npm run dev` - start development server
- `npm run build` - production build
- `npm run lint` - lint project
- `npm run preview` - preview production build
- `npm run deploy:cf` - build and deploy to Cloudflare Pages

## Cloudflare deployment

The deployment command is:

```bash
npm run build && wrangler pages deploy dist --project-name crypto-dash
```

Before first deploy, authenticate wrangler and create the Pages project if needed.
