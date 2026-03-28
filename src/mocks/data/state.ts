import { mockTransactions, type Transaction } from './transactions'

interface MockState { balance: number; transactions: Transaction[] }

export const mockState: MockState = {
  balance: 12450.0,
  transactions: [...mockTransactions],
}

export function deductBalance(amount: number) { mockState.balance -= amount }
export function addTransaction(transaction: Transaction) { mockState.transactions.unshift(transaction) }
export function resetState() {
  mockState.balance = 12450.0
  mockState.transactions = [...mockTransactions]
}
