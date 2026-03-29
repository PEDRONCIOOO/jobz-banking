import { motion } from 'framer-motion'
import { useAuthStore } from '@/features/auth/store'
import { BalanceCard } from '@/features/dashboard/components/balance-card'
import { QuickActions } from '@/features/dashboard/components/quick-actions'
import { TransactionList } from '@/features/dashboard/components/transaction-list'
import { getInitials } from '@/lib/utils'
import { useViewModeStore } from '@/lib/view-mode-store'

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user)
  const firstName = user?.name.split(' ')[0] ?? 'Usuário'
  const mode = useViewModeStore((s) => s.mode)
  const isDesktop = mode === 'desktop'

  return (
    <div className={isDesktop ? '' : 'px-5 pt-12'}>
      {/* Header - only show in mobile (desktop has sidebar) */}
      {!isDesktop && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-text-muted">Olá,</p>
            <p className="text-xl font-bold text-text-primary">{firstName}</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-accent to-accent-light text-sm font-semibold text-white">
            {getInitials(user?.name ?? 'U')}
          </div>
        </motion.div>
      )}

      {isDesktop ? (
        <>
          {/* Desktop greeting */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <p className="text-2xl font-bold text-text-primary">Bem-vindo, {firstName}</p>
            <p className="text-sm text-text-muted">Aqui está o resumo da sua conta</p>
          </motion.div>

          {/* Desktop grid layout */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div>
              <BalanceCard />
            </div>
            <div>
              <QuickActions />
            </div>
          </div>

          <TransactionList />
        </>
      ) : (
        <>
          <div className="mb-5"><BalanceCard /></div>
          <div className="mb-6"><QuickActions /></div>
          <TransactionList />
        </>
      )}
    </div>
  )
}
