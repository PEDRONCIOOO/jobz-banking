import { motion } from 'framer-motion'
import { Home, Receipt, CreditCard, User, ArrowLeftRight, LogOut } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/features/auth/store'
import { getInitials } from '@/lib/utils'

const navItems = [
  { path: '/dashboard', icon: Home, label: 'Home' },
  { path: '/extrato', icon: Receipt, label: 'Extrato' },
  { path: '/cartoes', icon: CreditCard, label: 'Cartões' },
  { path: '/perfil', icon: User, label: 'Perfil' },
]

export function DesktopSidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)

  return (
    <aside className="sticky top-0 flex h-screen w-[260px] shrink-0 flex-col border-r border-border bg-background p-6">
      {/* Logo */}
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold tracking-tight">
          job
          <span className="bg-gradient-to-br from-accent to-accent-light bg-clip-text text-transparent">
            Z
          </span>
        </h1>
        <p className="text-[10px] uppercase tracking-[0.25em] text-text-muted">banking</p>
      </div>

      {/* User */}
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-accent to-accent-light text-sm font-semibold text-white">
          {getInitials(user?.name ?? 'U')}
        </div>
        <div>
          <p className="text-sm font-semibold text-text-primary">{user?.name ?? 'Usuário'}</p>
          <p className="text-xs text-text-muted">{user?.email}</p>
        </div>
      </div>

      {/* Transfer button */}
      <button
        onClick={() => navigate('/transfer')}
        className="mb-6 flex w-full items-center justify-center gap-2 rounded-[var(--radius-input)] bg-gradient-to-br from-accent to-accent-light px-4 py-3 text-sm font-medium text-white shadow-[0_4px_20px_rgba(108,92,231,0.4)] transition-all hover:shadow-[0_6px_24px_rgba(108,92,231,0.5)] hover:scale-[1.02] active:scale-[0.98]"
      >
        <ArrowLeftRight className="h-4 w-4" />
        Nova Transferência
      </button>

      {/* Nav items */}
      <nav className="flex flex-1 flex-col gap-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`relative flex items-center gap-3 rounded-[var(--radius-input)] px-4 py-3 text-sm font-medium transition-all ${
                isActive
                  ? 'bg-surface text-accent-light'
                  : 'text-text-muted hover:bg-surface hover:text-text-primary'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-indicator"
                  className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-full bg-gradient-to-b from-accent to-accent-light"
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                />
              )}
              <item.icon className="h-5 w-5" />
              {item.label}
            </button>
          )
        })}
      </nav>

      {/* Logout */}
      <button
        onClick={() => { logout(); navigate('/login') }}
        className="flex items-center gap-3 rounded-[var(--radius-input)] px-4 py-3 text-sm font-medium text-text-muted transition-colors hover:bg-surface hover:text-error"
      >
        <LogOut className="h-5 w-5" />
        Sair
      </button>
    </aside>
  )
}
