import { http, HttpResponse, delay } from 'msw'
import { mockState } from '../data/state'
import { MOCK_DELAY } from '@/lib/constants'

export const accountHandlers = [
  http.get('/api/account', async () => {
    await delay(MOCK_DELAY)
    return HttpResponse.json({
      balance: mockState.balance,
      accountNumber: '0001-12345-6',
      user: { id: '1', name: 'Pedro Trotta', email: 'pedro@jobz.com' },
    })
  }),
]
