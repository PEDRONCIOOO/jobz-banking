import { motion } from 'framer-motion'
import type { Transaction } from '@/mocks/data/transactions'
import { formatCurrency, formatDate, getInitials } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

const categoryColors: Record<string, string> = {
  pix: 'bg-accent/20 text-accent-light',
  transfer: 'bg-blue-500/20 text-blue-400',
  payment: 'bg-orange-500/20 text-orange-400',
  salary: 'bg-success/20 text-success',
  crypto: 'bg-cyan-500/20 text-cyan-400',
  international: 'bg-purple-500/20 text-purple-400',
}

interface TransactionItemProps { transaction: Transaction; index: number }

export function TransactionItem({ transaction, index }: TransactionItemProps) {
  const isIncome = transaction.type === 'income'
  const initial = getInitials(transaction.description)
  const colorClass = categoryColors[transaction.category] || categoryColors.payment

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05, duration: 0.3 }} className="flex items-center gap-3 py-3">
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${colorClass}`}>{initial}</div>
      <div className="flex-1 min-w-0">
        <p className="truncate text-sm font-medium text-text-primary">{transaction.description}</p>
        <div className="flex items-center gap-2">
          <p className="text-xs text-text-muted">{formatDate(transaction.date)}</p>
          {transaction.currency !== 'BRL' && (
            <Badge variant={transaction.category === 'crypto' ? 'crypto' : 'default'}>{transaction.currency}</Badge>
          )}
        </div>
      </div>
      <p className={`text-sm font-semibold tabular-nums ${isIncome ? 'text-success' : 'text-error'}`}>
        {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
      </p>
    </motion.div>
  )
}
