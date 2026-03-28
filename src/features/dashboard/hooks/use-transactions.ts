import { useInfiniteQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import type { Transaction } from '@/mocks/data/transactions'

interface TransactionsResponse {
  data: Transaction[]
  page: number
  hasMore: boolean
  total: number
}

export function useTransactions() {
  return useInfiniteQuery({
    queryKey: ['transactions'],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await api.get<TransactionsResponse>('/transactions', {
        params: { page: pageParam },
      })
      return data
    },
    getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.page + 1 : undefined,
    initialPageParam: 1,
  })
}
