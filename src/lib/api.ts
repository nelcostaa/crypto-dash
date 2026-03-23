import ky from 'ky'

import type { CoinAsset, CoinCapListResponse } from '@/lib/coincap'

const baseUrl =
  import.meta.env.VITE_COINCAP_API_BASE_URL?.trim() || 'https://pro.coincap.io'
const apiKey = import.meta.env.VITE_COINCAP_API_KEY?.trim()

export const coinCapApi = ky.create({
  prefixUrl: baseUrl.replace(/\/+$/, ''),
  timeout: 10_000,
  headers: apiKey
    ? {
        Authorization: `Bearer ${apiKey}`,
      }
    : {},
})

export async function fetchAssets() {
  const response = await coinCapApi
    .get('v2/assets')
    .json<CoinCapListResponse<CoinAsset>>()

  return response.data
}
