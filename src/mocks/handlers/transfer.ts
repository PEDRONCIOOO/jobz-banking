import { http, HttpResponse, delay } from 'msw'
import { mockState, deductBalance, addTransaction } from '../data/state'
import { MOCK_DELAY } from '@/lib/constants'

export const transferHandlers = [
  http.post('/api/transfer', async ({ request }) => {
    await delay(MOCK_DELAY)
    const body = (await request.json()) as { amount: number; recipient: string; description?: string }
    if (body.amount <= 0) return HttpResponse.json({ message: 'Valor deve ser maior que zero' }, { status: 400 })
    if (body.amount > mockState.balance) return HttpResponse.json({ message: 'Saldo insuficiente' }, { status: 400 })
    deductBalance(body.amount)
    addTransaction({
      id: `txn-${Date.now()}`,
      description: body.description || 'Transferência Enviada',
      amount: body.amount,
      type: 'expense',
      category: 'transfer',
      date: new Date().toISOString(),
      currency: 'BRL',
      recipient: body.recipient,
    })
    return HttpResponse.json({ success: true, newBalance: mockState.balance, transactionId: `txn-${Date.now()}` })
  }),
]
