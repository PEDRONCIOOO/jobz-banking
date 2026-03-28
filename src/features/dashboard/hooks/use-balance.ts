import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'

interface AccountData {
  balance: number
  accountNumber: string
  user: { id: string; name: string; email: string }
}

export function useBalance() {
  return useQuery({
    queryKey: ['account'],
    queryFn: async () => {
      const { data } = await api.get<AccountData>('/account')
      return data
    },
  })
}
