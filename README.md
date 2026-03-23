# Crypto Dash - Project Specification & AI Context

## 🎯 Project Overview
This is a modern React application that acts as a real-time cryptocurrency dashboard. It fetches data from the CoinCap API, displays it in a highly styled data table, and is configured for edge deployment on Cloudflare Pages.

## 🛠️ Tech Stack & Environment
- **Framework:** React 18+ via Vite (TypeScript template)
- **Styling:** Tailwind CSS v4
- **UI Components:** shadcn/ui (using the **Base UI** library and **Vega** preset)
- **Data Fetching:** `@tanstack/react-query`
- **HTTP Client:** `ky`
- **Deployment:** Cloudflare Pages via `wrangler`

> **⚠️ CRITICAL CONTEXT FOR AI ASSISTANT ⚠️**
> - **Tailwind v4 Setup:** This project uses Tailwind v4. There is no `tailwind.config.js` or PostCSS. Global CSS is handled in `src/index.css` via `@import "tailwindcss";`. 
> - **Shadcn Workaround:** `src/index.css` contains a dummy `/* @tailwind base */` comment to bypass a known shadcn CLI validation bug. Do not remove it.
> - **Path Aliasing:** The `@/` alias is configured in `vite.config.ts` and the root `tsconfig.json`.

---

## 📋 Feature Requirements

### 1. Data Layer (CoinCap API)
- **Endpoint:** `https://api.coincap.io/v2/assets` (Public/Free tier is sufficient for now).
- **Client:** Use `ky` to create a reusable API client instance.
- **State Management:** Use `useQuery` from React Query to fetch the list of assets.
- **Polling:** The query MUST refetch automatically every 60 seconds.

### 2. UI Layer (The Coin Table)
- **Component:** Use the `shadcn/ui` Table component to display the data.
- **Required Columns:**
  1. Name
  2. Symbol
  3. Price (USD)
  4. 24h Change (%)
  5. Market Cap (USD)
  6. Volume 24h (USD)
  7. Supply / Max Supply
- **Styling Rules:** - The `changePercent24Hr` column MUST be color-coded: Green for positive values, Red for negative values.
  - Apply formatting to large numbers (e.g., standardizing USD currency formats and condensing large market cap/volume numbers if necessary).

### 3. Deployment (Cloudflare)
- **Tooling:** Use `wrangler`.
- **NPM Script:** Create a specific npm script in `package.json` for deployment:
  ```json
  "deploy:cf": "npm run build && wrangler pages deploy dist --project-name crypto-dash"
# React + TypeScript + Vite
