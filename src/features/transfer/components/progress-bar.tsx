import { motion } from 'framer-motion'

export function ProgressBar({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
  return (
    <div className="flex gap-2">
      {Array.from({ length: totalSteps }).map((_, i) => (
        <div key={i} className="relative h-[3px] flex-1 overflow-hidden rounded-full bg-surface-hover">
          {i < currentStep && (
            <motion.div
              layoutId={`progress-${i}`}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="absolute inset-0 rounded-full bg-accent"
              style={{ transformOrigin: 'left' }}
            />
          )}
        </div>
      ))}
    </div>
  )
}
