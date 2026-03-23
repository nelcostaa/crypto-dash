import ky from 'ky'

import { parseCoinAssetListResponse } from '@/lib/coincap'

export const coinCapApi = ky.create({
    timeout: 10_000,
    retry: {
        limit: 2,
        methods: ['get'],
        statusCodes: [408, 413, 429, 500, 502, 503, 504],
    },
})

export async function fetchAssets() {
    const response = await coinCapApi
        .get('/api/assets', {
            searchParams: {
                limit: '100',
                offset: '0',
            },
        })
        .json<unknown>()

    return parseCoinAssetListResponse(response).data
}
