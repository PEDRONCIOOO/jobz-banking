import { useState } from 'react'
import { Monitor, Smartphone, ChevronLeft, ChevronRight } from 'lucide-react'
import { useViewModeStore } from '@/lib/view-mode-store'
import { motion, AnimatePresence } from 'framer-motion'

export function ViewModeToggle() {
  const { mode, setMode } = useViewModeStore()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <motion.div
      className="fixed top-4 left-4 z-[100] flex items-center"
      layout
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
    >
      <AnimatePresence mode="wait">
        {collapsed ? (
          <motion.button
            key="expand"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => setCollapsed(false)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background/90 text-text-muted backdrop-blur-sm transition-colors hover:text-text-primary"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </motion.button>
        ) : (
          <motion.div
            key="expanded"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center gap-1 rounded-full border border-border bg-background/90 p-1 backdrop-blur-sm"
          >
            <button
              onClick={() => setMode('mobile')}
              className={`rounded-full p-2 transition-all ${
                mode === 'mobile'
                  ? 'bg-gradient-to-br from-accent to-accent-light text-white shadow-sm'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              <Smartphone className="h-4 w-4" />
            </button>
            <button
              onClick={() => setMode('desktop')}
              className={`rounded-full p-2 transition-all ${
                mode === 'desktop'
                  ? 'bg-gradient-to-br from-accent to-accent-light text-white shadow-sm'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              <Monitor className="h-4 w-4" />
            </button>
            <button
              onClick={() => setCollapsed(true)}
              className="rounded-full p-2 text-text-muted transition-colors hover:text-text-primary"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
