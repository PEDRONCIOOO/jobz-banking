import { motion } from 'framer-motion'

export function CreditCardDisplay() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
    >
      {/* Savings banner */}
      <div className="mb-4 flex justify-center">
        <div className="rounded-full bg-success/10 px-4 py-1.5 text-xs font-medium text-success">
          Você economizou R$ 850 nos últimos 30 dias
        </div>
      </div>

      {/* Credit card */}
      <div className="rounded-[20px] bg-gradient-to-br from-[#1a1a2e] to-[#2d2d3a] p-5 text-white shadow-[0_8px_32px_rgba(0,0,0,0.12)]">
        <div className="mb-6 flex items-center justify-between">
          <span className="text-lg font-bold tracking-wider">VISA</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="9" cy="12" r="7" fill="rgba(255,255,255,0.3)" />
            <circle cx="15" cy="12" r="7" fill="rgba(255,255,255,0.2)" />
          </svg>
        </div>
        <p className="mb-1 text-[10px] uppercase tracking-widest text-white/50">Card Number</p>
        <p className="text-lg font-medium tracking-[0.15em]">4532 •••• •••• 7891</p>
      </div>
    </motion.div>
  )
}
