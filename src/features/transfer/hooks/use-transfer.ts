import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/axios'

interface TransferPayload { amount: number; recipient: string; description?: string }
interface TransferResponse { success: boolean; newBalance: number; transactionId: string }

export function useTransfer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: TransferPayload) => {
      const { data } = await api.post<TransferResponse>('/transfer', payload)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['account'] })
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
    },
  })
}
