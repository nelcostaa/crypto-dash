import ky from 'ky'

import type { CoinAsset, CoinCapListResponse } from '@/lib/coincap'

export const coinCapApi = ky.create({
    timeout: 10_000,
})

export async function fetchAssets() {
    const response = await coinCapApi
        .get('/api/assets')
        .json<CoinCapListResponse<CoinAsset>>()

    return response.data
}
