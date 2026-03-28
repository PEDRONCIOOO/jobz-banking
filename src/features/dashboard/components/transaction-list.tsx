import { useTransactions } from '../hooks/use-transactions'
import { TransactionItem } from './transaction-item'
import { Button } from '@/components/ui/button'

export function TransactionList() {
  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useTransactions()
  const transactions = data?.pages.flatMap((page) => page.data) ?? []

  return (
    <div>
      <h3 className="mb-3 text-xs uppercase tracking-widest text-text-label">Transações recentes</h3>
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 py-3">
              <div className="h-10 w-10 animate-pulse rounded-full bg-surface-hover" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-32 animate-pulse rounded bg-surface-hover" />
                <div className="h-3 w-20 animate-pulse rounded bg-surface-hover" />
              </div>
              <div className="h-4 w-20 animate-pulse rounded bg-surface-hover" />
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="divide-y divide-border">
            {transactions.map((txn, i) => (
              <TransactionItem key={txn.id} transaction={txn} index={i} />
            ))}
          </div>
          {hasNextPage && (
            <div className="mt-4 flex justify-center">
              <Button variant="ghost" size="sm" onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
                {isFetchingNextPage ? 'Carregando...' : 'Ver mais'}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
