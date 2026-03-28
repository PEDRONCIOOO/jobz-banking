import { http, HttpResponse, delay } from 'msw'
import { mockUsers } from '../data/users'
import { MOCK_DELAY } from '@/lib/constants'

export const authHandlers = [
  http.post('/api/auth/login', async ({ request }) => {
    await delay(MOCK_DELAY)
    const body = (await request.json()) as { email: string; password: string }
    const user = mockUsers.find((u) => u.email === body.email && u.password === body.password)
    if (!user) return HttpResponse.json({ message: 'Email ou senha inválidos' }, { status: 401 })
    return HttpResponse.json({
      token: `mock-jwt-${user.id}-${Date.now()}`,
      user: { id: user.id, name: user.name, email: user.email },
    })
  }),
  http.post('/api/auth/logout', async () => {
    await delay(MOCK_DELAY)
    return HttpResponse.json({ success: true })
  }),
]
