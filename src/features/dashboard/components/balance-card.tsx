import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { useBalance } from '../hooks/use-balance'
import { formatCurrency, formatCurrencyCompact } from '@/lib/utils'
import { MOCK_EXCHANGE_RATES } from '@/lib/constants'

export function BalanceCard() {
  const { data, isLoading } = useBalance()
  const [visible, setVisible] = useState(true)

  const balance = data?.balance ?? 0
  const usdEquiv = balance * MOCK_EXCHANGE_RATES.USD
  const usdtEquiv = balance * MOCK_EXCHANGE_RATES.USDT

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, ease: 'easeOut' }}>
      <Card variant="glass" className="rounded-[var(--radius-glass)] p-5">
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase tracking-widest text-text-label">Saldo disponível</p>
          <button onClick={() => setVisible(!visible)} className="rounded-full p-1 text-text-muted transition-colors hover:text-text-primary">
            {visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </button>
        </div>
        <AnimatePresence mode="wait">
          {visible ? (
            <motion.div key="visible" initial={{ opacity: 0, filter: 'blur(10px)' }} animate={{ opacity: 1, filter: 'blur(0px)' }} exit={{ opacity: 0, filter: 'blur(10px)' }} transition={{ duration: 0.2 }}>
              {isLoading ? (
                <div className="mt-2 h-9 w-40 animate-pulse rounded-lg bg-surface-hover" />
              ) : (
                <>
                  <p className="mt-1 text-3xl font-bold tracking-tight text-text-primary">{formatCurrency(balance)}</p>
                  <p className="mt-1 text-xs text-text-muted">≈ {formatCurrencyCompact(usdEquiv, 'USD')} · {formatCurrencyCompact(usdtEquiv, 'USD')} USDT</p>
                </>
              )}
            </motion.div>
          ) : (
            <motion.div key="hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-2">
              <p className="text-3xl font-bold tracking-tight text-text-primary">••••••</p>
              <p className="mt-1 text-xs text-text-muted">Toque para exibir</p>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  )
}
