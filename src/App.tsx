import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { CoinAsset } from '@/lib/coincap'
import { cn } from '@/lib/utils'
import { useAssetsQuery } from '@/lib/use-assets-query'

const usdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
})

const usdCompactFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 2,
})

const numberCompactFormatter = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 2,
})

function toNumber(value: string | null | undefined) {
  if (!value) {
    return null
  }

  const parsed = Number(value)

  return Number.isFinite(parsed) ? parsed : null
}

function formatUsd(value: string, compact = false) {
  const numeric = toNumber(value)

  if (numeric === null) {
    return '—'
  }

  return compact
    ? usdCompactFormatter.format(numeric)
    : usdFormatter.format(numeric)
}

function formatChangePercent(value: string) {
  const numeric = toNumber(value)

  if (numeric === null) {
    return '—'
  }

  const withSign = numeric > 0 ? `+${numeric.toFixed(2)}` : numeric.toFixed(2)
  return `${withSign}%`
}

function formatSupply(asset: CoinAsset) {
  const currentSupply = toNumber(asset.supply)
  const maxSupply = toNumber(asset.maxSupply)

  const currentLabel =
    currentSupply === null ? '—' : numberCompactFormatter.format(currentSupply)

  const maxLabel = maxSupply === null ? '∞' : numberCompactFormatter.format(maxSupply)

  return `${currentLabel} / ${maxLabel}`
}

function changeColor(value: string) {
  const numeric = toNumber(value)

  if (numeric === null || numeric === 0) {
    return 'text-muted-foreground'
  }

  return numeric > 0 ? 'text-emerald-600' : 'text-rose-600'
}

function App() {
  const { data, isLoading, isError, error, refetch, dataUpdatedAt, isFetching } =
    useAssetsQuery()

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-4 px-4 py-8 sm:px-6 lg:px-8">
      <header className="space-y-1">
        <h1 className="m-0 text-3xl font-semibold tracking-tight">Crypto Dash</h1>
        <p className="text-sm text-muted-foreground">
          Live CoinCap assets. Data refreshes every 60 seconds.
          {dataUpdatedAt > 0 && (
            <span>
              {' '}
              Last update: {new Date(dataUpdatedAt).toLocaleTimeString('en-US')}
              {isFetching ? ' (refreshing...)' : ''}
            </span>
          )}
        </p>
      </header>

      {isLoading && (
        <div className="rounded-md border bg-card p-6 text-sm text-muted-foreground">
          Loading assets...
        </div>
      )}

      {isError && (
        <div className="flex flex-wrap items-center gap-3 rounded-md border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          <span>
            Failed to fetch assets
            {error instanceof Error ? `: ${error.message}` : '.'}
          </span>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      )}

      {data && (
        <section className="rounded-lg border bg-card p-3 sm:p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Symbol</TableHead>
                <TableHead className="text-right">Price (USD)</TableHead>
                <TableHead className="text-right">24h Change (%)</TableHead>
                <TableHead className="text-right">Market Cap (USD)</TableHead>
                <TableHead className="text-right">Volume 24h (USD)</TableHead>
                <TableHead className="text-right">Supply / Max Supply</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((asset) => (
                <TableRow key={asset.id}>
                  <TableCell className="font-medium">{asset.name}</TableCell>
                  <TableCell className="text-muted-foreground">{asset.symbol}</TableCell>
                  <TableCell
                    className={cn('text-right', changeColor(asset.changePercent24Hr))}
                  >
                    {formatUsd(asset.priceUsd)}
                  </TableCell>
                  <TableCell
                    className={cn(
                      'text-right font-medium',
                      changeColor(asset.changePercent24Hr)
                    )}
                  >
                    {formatChangePercent(asset.changePercent24Hr)}
                  </TableCell>
                  <TableCell
                    className={cn('text-right', changeColor(asset.changePercent24Hr))}
                  >
                    {formatUsd(asset.marketCapUsd, true)}
                  </TableCell>
                  <TableCell
                    className={cn('text-right', changeColor(asset.changePercent24Hr))}
                  >
                    {formatUsd(asset.volumeUsd24Hr, true)}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {formatSupply(asset)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>
      )}
    </main>
  )
}

export default App
