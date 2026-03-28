import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import { useAuthStore } from '../store'
import { useNavigate } from 'react-router-dom'

interface LoginPayload { email: string; password: string }
interface LoginResponse { token: string; user: { id: string; name: string; email: string } }

export function useLogin() {
  const login = useAuthStore((s) => s.login)
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const { data } = await api.post<LoginResponse>('/auth/login', payload)
      return data
    },
    onSuccess: (data) => {
      login(data.user, data.token)
      navigate('/dashboard')
    },
  })
}

export function useLogout() {
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async () => { await api.post('/auth/logout') },
    onSuccess: () => { logout(); navigate('/login') },
  })
}
