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

Create a local `.env` file:

```bash
VITE_COINCAP_API_BASE_URL=https://pro.coincap.io
VITE_COINCAP_API_KEY=your_coincap_api_key
```

Notes:
- `VITE_COINCAP_API_KEY` is used as `Authorization: Bearer <key>`.
- Base URL defaults to `https://pro.coincap.io` if not provided.

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
