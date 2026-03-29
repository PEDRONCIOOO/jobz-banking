import { useRef } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, Globe, Receipt, Bitcoin, Barcode, QrCode, Wallet, PiggyBank, CreditCard } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useViewModeStore } from '@/lib/view-mode-store'

const actions = [
  { icon: ArrowUpRight, label: 'Transferir', path: '/transfer', accent: true },
  { icon: Globe, label: 'Global', path: null, accent: false },
  { icon: Receipt, label: 'Extrato', path: '/extrato', accent: false },
  { icon: Bitcoin, label: 'Crypto', path: null, accent: false },
  { icon: Barcode, label: 'Boleto', path: null, accent: false },
  { icon: QrCode, label: 'Pix', path: null, accent: false },
  { icon: Wallet, label: 'Carteira', path: null, accent: false },
  { icon: PiggyBank, label: 'Poupar', path: null, accent: false },
  { icon: CreditCard, label: 'Cartões', path: '/cartoes', accent: false },
]

export function QuickActions() {
  const navigate = useNavigate()
  const mode = useViewModeStore((s) => s.mode)
  const isDesktop = mode === 'desktop'
  const scrollRef = useRef<HTMLDivElement>(null)

  return (
    <div>
      <p className="mb-3 text-xs uppercase tracking-widest text-text-label">Ações rápidas</p>

      {isDesktop ? (
        <div className="flex flex-wrap gap-2">
          {actions.map((action, i) => (
            <motion.button
              key={action.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.03 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => action.path && navigate(action.path)}
              className={`flex items-center gap-2 rounded-[var(--radius-input)] px-4 py-2.5 transition-colors ${
                action.accent
                  ? 'bg-gradient-to-br from-accent to-accent-light text-white'
                  : 'border border-border bg-surface text-text-muted hover:bg-surface-hover'
              }`}
            >
              <action.icon className="h-4 w-4" />
              <span className="text-sm font-medium">{action.label}</span>
            </motion.button>
          ))}
        </div>
      ) : (
        <motion.div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {actions.map((action, i) => (
            <motion.button
              key={action.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.04 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => action.path && navigate(action.path)}
              className={`flex shrink-0 flex-col items-center gap-2 rounded-[var(--radius-input)] p-3 transition-colors ${
                action.accent
                  ? 'bg-gradient-to-br from-accent to-accent-light text-white'
                  : 'border border-border bg-surface text-text-muted hover:bg-surface-hover'
              }`}
              style={{ minWidth: '72px' }}
            >
              <action.icon className="h-5 w-5" />
              <span className="text-[11px] font-medium whitespace-nowrap">{action.label}</span>
            </motion.button>
          ))}
        </motion.div>
      )}
    </div>
  )
}
