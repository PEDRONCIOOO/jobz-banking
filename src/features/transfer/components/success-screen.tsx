import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useTransferStore } from '../store'
import { formatCurrency } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const checkVariants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: { pathLength: 1, opacity: 1, transition: { duration: 0.6, ease: 'easeOut' as const, delay: 0.2 } },
}

const particles = Array.from({ length: 12 }).map((_, i) => ({
  id: i,
  angle: (i * 30 * Math.PI) / 180,
}))

export function SuccessScreen() {
  const navigate = useNavigate()
  const { amount, recipient, reset } = useTransferStore()

  function handleDone() { reset(); navigate('/dashboard') }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center px-6 pt-16">
      <div className="relative mb-8">
        {particles.map((p) => (
          <motion.div key={p.id}
            initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 0], x: Math.cos(p.angle) * 60, y: Math.sin(p.angle) * 60, scale: [0, 1, 0] }}
            transition={{ duration: 0.8, delay: 0.3 + p.id * 0.03 }}
            className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-light"
          />
        ))}
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 15, stiffness: 200 }} className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-accent to-accent-light">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <motion.path d="M12 24L20 32L36 16" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" variants={checkVariants} initial="hidden" animate="visible" />
          </svg>
        </motion.div>
      </div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="text-center">
        <h2 className="mb-2 text-2xl font-bold text-text-primary">Transferência enviada!</h2>
        <p className="text-sm text-text-muted">{formatCurrency(amount)} enviado para {recipient}</p>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="mt-8 w-full">
        <Button variant="primary" size="lg" className="w-full" onClick={handleDone}>Voltar ao início</Button>
      </motion.div>
    </motion.div>
  )
}
