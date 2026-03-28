import { createBrowserRouter, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/features/auth/store'
import { type ReactNode } from 'react'
import LoginPage from '@/pages/login-page'
import DashboardPage from '@/pages/dashboard-page'
import TransferPage from '@/pages/transfer-page'
import PlaceholderPage from '@/pages/placeholder-page'
import { AppLayout } from '@/components/shared/app-layout'

function PrivateRoute({ children }: { children: ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <>{children}</>
}

function PublicRoute({ children }: { children: ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  if (isAuthenticated) return <Navigate to="/dashboard" replace />
  return <>{children}</>
}

export const router = createBrowserRouter([
  { path: '/login', element: <PublicRoute><LoginPage /></PublicRoute> },
  {
    path: '/',
    element: <PrivateRoute><AppLayout /></PrivateRoute>,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'transfer', element: <TransferPage /> },
      { path: 'extrato', element: <DashboardPage /> },
      { path: 'cartoes', element: <PlaceholderPage title="Cartões" /> },
      { path: 'perfil', element: <PlaceholderPage title="Perfil" /> },
    ],
  },
  { path: '*', element: <Navigate to="/login" replace /> },
])
