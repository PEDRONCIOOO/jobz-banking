import { useState } from 'react'
import { motion } from 'framer-motion'
import { Delete } from 'lucide-react'
import { useTransferStore } from '../store'
import { useBalance } from '@/features/dashboard/hooks/use-balance'
import { formatCurrency } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'del']

export function AmountStep() {
  const { setAmount, nextStep } = useTransferStore()
  const { data } = useBalance()
  const balance = data?.balance ?? 0
  const [value, setValue] = useState('')

  const numericValue = parseFloat(value || '0')
  const isValid = numericValue > 0 && numericValue <= balance
  const exceedsBalance = numericValue > balance

  function handleKey(key: string) {
    if (key === 'del') { setValue((v) => v.slice(0, -1)); return }
    if (key === '.' && value.includes('.')) return
    if (value.includes('.') && value.split('.')[1]?.length >= 2) return
    setValue((v) => v + key)
  }

  function handleContinue() {
    if (!isValid) return
    setAmount(numericValue)
    nextStep()
  }

  return (
    <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.25 }} className="flex flex-col items-center px-6 pt-8">
      <p className="mb-2 text-xs uppercase tracking-widest text-text-muted">Quanto você quer enviar?</p>
      <div className="mb-2 text-center">
        <span className="text-4xl font-bold text-text-primary tabular-nums">
          R$ {value ? parseFloat(value).toLocaleString('pt-BR', { minimumFractionDigits: 0 }) : '0'}
          <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.8, repeat: Infinity }} className="text-accent">|</motion.span>
        </span>
      </div>
      <p className={`mb-6 text-xs ${exceedsBalance ? 'text-error' : 'text-text-muted'}`}>Disponível: {formatCurrency(balance)}</p>
      <div className="mb-6 grid w-full max-w-[280px] grid-cols-3 gap-3">
        {keys.map((key) => (
          <motion.button key={key} whileTap={{ scale: 0.9 }} onClick={() => handleKey(key)} className="flex h-14 items-center justify-center rounded-[var(--radius-input)] bg-surface text-lg font-medium text-text-primary transition-colors hover:bg-surface-hover active:bg-surface-hover">
            {key === 'del' ? <Delete className="h-5 w-5 text-text-secondary" /> : key}
          </motion.button>
        ))}
      </div>
      <Button variant="primary" size="lg" className="w-full max-w-[280px]" onClick={handleContinue} disabled={!isValid}>Continuar</Button>
    </motion.div>
  )
}
