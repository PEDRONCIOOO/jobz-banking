import { create } from 'zustand'

interface TransferState {
  currentStep: number
  amount: number
  recipient: string
  description: string
  currency: string
  nextStep: () => void
  prevStep: () => void
  setAmount: (amount: number) => void
  setRecipient: (recipient: string, description: string, currency: string) => void
  reset: () => void
}

export const useTransferStore = create<TransferState>((set) => ({
  currentStep: 1,
  amount: 0,
  recipient: '',
  description: '',
  currency: 'BRL',
  nextStep: () => set((s) => ({ currentStep: Math.min(s.currentStep + 1, 3) })),
  prevStep: () => set((s) => ({ currentStep: Math.max(s.currentStep - 1, 1) })),
  setAmount: (amount) => set({ amount }),
  setRecipient: (recipient, description, currency) => set({ recipient, description, currency }),
  reset: () => set({ currentStep: 1, amount: 0, recipient: '', description: '', currency: 'BRL' }),
}))
