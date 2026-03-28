import axios from 'axios'
import { API_BASE_URL } from './constants'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const stored = localStorage.getItem('jobz-auth')
  if (stored) {
    try {
      const { state } = JSON.parse(stored)
      if (state?.token) { config.headers.Authorization = `Bearer ${state.token}` }
    } catch {}
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('jobz-auth')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
