import { motion } from 'framer-motion'

export function HeroSection() {
  return (
    <div className="px-6 pt-16 pb-8">
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <h1 className="text-4xl font-extrabold tracking-tight leading-tight">
          <span className="text-text-primary">
            job
            <span className="bg-gradient-to-br from-accent to-accent-light bg-clip-text text-transparent">
              Z
            </span>
          </span>
        </h1>
        <p className="mt-1 text-xs uppercase tracking-[0.25em] text-text-muted">banking</p>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
        className="mt-6 text-xl font-light text-text-secondary leading-relaxed"
      >
        Seu dinheiro,
        <br />
        <span className="font-semibold text-text-primary">sem fronteiras.</span>
      </motion.p>
    </div>
  )
}
