import { motion } from 'framer-motion'
import { ArrowUpRight, Globe, Receipt } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const actions = [
  { icon: ArrowUpRight, label: 'Transferir', path: '/transfer', accent: true },
  { icon: Globe, label: 'Global', path: null, accent: false },
  { icon: Receipt, label: 'Extrato', path: '/extrato', accent: false },
]

export function QuickActions() {
  const navigate = useNavigate()

  return (
    <div className="flex gap-3">
      {actions.map((action, i) => (
        <motion.button
          key={action.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 + i * 0.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => action.path && navigate(action.path)}
          className={`flex flex-1 flex-col items-center gap-2 rounded-[var(--radius-input)] p-3 transition-colors ${
            action.accent
              ? 'bg-gradient-to-br from-accent to-accent-light text-white'
              : 'border border-border bg-surface text-text-muted hover:bg-surface-hover'
          }`}
        >
          <action.icon className="h-5 w-5" />
          <span className="text-[11px] font-medium">{action.label}</span>
        </motion.button>
      ))}
    </div>
  )
}
