import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { BottomNav } from './bottom-nav'
import { DesktopSidebar } from './desktop-sidebar'
import { useViewModeStore } from '@/lib/view-mode-store'

export function AppLayout() {
  const location = useLocation()
  const mode = useViewModeStore((s) => s.mode)

  if (mode === 'desktop') {
    return (
      <div className="mx-auto flex min-h-screen max-w-[1200px]">
        <DesktopSidebar />
        <main className="flex-1 overflow-x-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="p-8"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    )
  }

  return (
    <div className="mx-auto min-h-screen max-w-[430px] overflow-x-hidden bg-background">
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="pb-24"
        >
          <Outlet />
        </motion.div>
      </AnimatePresence>
      <BottomNav />
    </div>
  )
}
