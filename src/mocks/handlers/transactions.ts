import { http, HttpResponse, delay } from 'msw'
import { mockState } from '../data/state'
import { MOCK_DELAY } from '@/lib/constants'

const PAGE_SIZE = 8

export const transactionHandlers = [
  http.get('/api/transactions', async ({ request }) => {
    await delay(MOCK_DELAY)
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') || '1')
    const start = (page - 1) * PAGE_SIZE
    const end = start + PAGE_SIZE
    const items = mockState.transactions.slice(start, end)
    const hasMore = end < mockState.transactions.length
    return HttpResponse.json({ data: items, page, hasMore, total: mockState.transactions.length })
  }),
]
