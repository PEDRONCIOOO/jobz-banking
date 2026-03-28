import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { useTransferStore } from '../store'
import { useTransfer } from '../hooks/use-transfer'
import { formatCurrency } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface ConfirmStepProps { onSuccess: () => void }

export function ConfirmStep({ onSuccess }: ConfirmStepProps) {
  const { amount, recipient, description, currency, prevStep } = useTransferStore()
  const { mutate, isPending } = useTransfer()

  function handleConfirm() {
    mutate({ amount, recipient, description }, { onSuccess })
  }

  return (
    <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.25 }} className="px-6 pt-6">
      <button onClick={prevStep} className="mb-4 flex items-center gap-1 text-text-muted">
        <ArrowLeft className="h-4 w-4" /><span className="text-sm">Voltar</span>
      </button>
      <p className="mb-4 text-center text-xs uppercase tracking-widest text-text-label">Confirme os dados</p>
      <Card variant="glass" className="mb-6 rounded-[var(--radius-glass)] p-5">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-text-muted">Valor</p>
            <p className="text-lg font-bold text-text-primary">{formatCurrency(amount)}</p>
          </div>
          <div className="h-px bg-border" />
          <div className="flex items-center justify-between">
            <p className="text-sm text-text-muted">Destinatário</p>
            <p className="text-sm font-medium text-text-primary">{recipient}</p>
          </div>
          {description && (<><div className="h-px bg-border" /><div className="flex items-center justify-between"><p className="text-sm text-text-muted">Descrição</p><p className="text-sm text-text-secondary">{description}</p></div></>)}
          <div className="h-px bg-border" />
          <div className="flex items-center justify-between">
            <p className="text-sm text-text-muted">Moeda</p>
            <Badge variant={currency === 'BRL' ? 'default' : 'crypto'}>{currency}</Badge>
          </div>
        </div>
      </Card>
      <Button variant="primary" size="lg" className="w-full" onClick={handleConfirm} disabled={isPending}>
        {isPending ? (
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white" />
        ) : 'Confirmar Transferência'}
      </Button>
    </motion.div>
  )
}
