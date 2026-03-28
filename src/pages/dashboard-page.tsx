import { motion } from 'framer-motion'
import { useAuthStore } from '@/features/auth/store'
import { BalanceCard } from '@/features/dashboard/components/balance-card'
import { QuickActions } from '@/features/dashboard/components/quick-actions'
import { TransactionList } from '@/features/dashboard/components/transaction-list'
import { getInitials } from '@/lib/utils'

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user)
  const firstName = user?.name.split(' ')[0] ?? 'Usuário'

  return (
    <div className="px-5 pt-12">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm text-text-muted">Olá,</p>
          <p className="text-xl font-bold text-text-primary">{firstName}</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-accent to-accent-light text-sm font-semibold text-white">
          {getInitials(user?.name ?? 'U')}
        </div>
      </motion.div>
      <div className="mb-5"><BalanceCard /></div>
      <div className="mb-6"><QuickActions /></div>
      <TransactionList />
    </div>
  )
}
