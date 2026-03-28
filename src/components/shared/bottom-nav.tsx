import { motion } from 'framer-motion'
import { Home, Receipt, CreditCard, User } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { FAB } from './fab'

const tabs = [
  { path: '/dashboard', icon: Home, label: 'Home' },
  { path: '/extrato', icon: Receipt, label: 'Extrato' },
  { path: '__fab__', icon: null, label: '' },
  { path: '/cartoes', icon: CreditCard, label: 'Cartões' },
  { path: '/perfil', icon: User, label: 'Perfil' },
]

export function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <div className="fixed bottom-0 left-1/2 z-50 w-full max-w-[430px] -translate-x-1/2">
      <nav className="relative border-t border-border bg-background/80 backdrop-blur-xl">
        <FAB />
        <div className="flex items-center justify-around px-2 py-2">
          {tabs.map((tab) => {
            if (tab.path === '__fab__') {
              return <div key="fab-spacer" className="w-14" />
            }
            const isActive = location.pathname === tab.path
            const Icon = tab.icon!
            return (
              <button
                key={tab.path}
                onClick={() => navigate(tab.path)}
                className="relative flex flex-col items-center gap-1 px-3 py-1"
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute -top-1 h-[3px] w-8 rounded-full bg-gradient-to-r from-accent to-accent-light"
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  />
                )}
                <Icon className={`h-5 w-5 transition-colors duration-200 ${isActive ? 'text-accent-light' : 'text-text-muted'}`} />
                <span className={`text-[10px] transition-colors duration-200 ${isActive ? 'text-accent-light' : 'text-text-muted'}`}>{tab.label}</span>
              </button>
            )
          })}
        </div>
        <div className="h-[env(safe-area-inset-bottom)]" />
      </nav>
    </div>
  )
}
