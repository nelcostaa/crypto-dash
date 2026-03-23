export interface CoinCapListResponse<T> {
  data: T[]
  timestamp: number
}

export interface CoinAsset {
  id: string
  rank: string
  symbol: string
  name: string
  supply: string
  maxSupply: string | null
  marketCapUsd: string
  volumeUsd24Hr: string
  priceUsd: string
  changePercent24Hr: string
  vwap24Hr: string | null
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function asString(value: unknown): string | null {
  return typeof value === 'string' ? value : null
}

function asNullableString(value: unknown): string | null {
  if (value === null) {
    return null
  }

  return asString(value)
}

export function parseCoinAsset(value: unknown): CoinAsset | null {
  if (!isRecord(value)) {
    return null
  }

  const asset: CoinAsset = {
    id: asString(value.id) ?? '',
    rank: asString(value.rank) ?? '',
    symbol: asString(value.symbol) ?? '',
    name: asString(value.name) ?? '',
    supply: asString(value.supply) ?? '',
    maxSupply: asNullableString(value.maxSupply),
    marketCapUsd: asString(value.marketCapUsd) ?? '',
    volumeUsd24Hr: asString(value.volumeUsd24Hr) ?? '',
    priceUsd: asString(value.priceUsd) ?? '',
    changePercent24Hr: asString(value.changePercent24Hr) ?? '',
    vwap24Hr: asNullableString(value.vwap24Hr),
  }

  if (!asset.id || !asset.symbol || !asset.name) {
    return null
  }

  return asset
}

export function parseCoinAssetListResponse(value: unknown): CoinCapListResponse<CoinAsset> {
  if (!isRecord(value) || !Array.isArray(value.data)) {
    throw new Error('Unexpected CoinCap response shape.')
  }

  const data = value.data
    .map((item) => parseCoinAsset(item))
    .filter((item): item is CoinAsset => item !== null)

  return {
    data,
    timestamp: typeof value.timestamp === 'number' ? value.timestamp : Date.now(),
  }
}
