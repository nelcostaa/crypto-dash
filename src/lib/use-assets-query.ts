import { useQuery } from '@tanstack/react-query'

import { fetchAssets } from '@/lib/api'

export function useAssetsQuery() {
  return useQuery({
    queryKey: ['assets'],
    queryFn: fetchAssets,
    refetchInterval: 60_000,
    staleTime: 30_000,
  })
}
