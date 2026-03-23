import { useQuery } from '@tanstack/react-query'

import { fetchAssets } from '@/lib/api'

export function useAssetsQuery() {
  return useQuery({
    queryKey: ['assets'],
    queryFn: fetchAssets,
    refetchInterval: 60_000,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => {
      if (error instanceof Error && /401|403/.test(error.message)) {
        return false
      }

      return failureCount < 2
    },
  })
}
