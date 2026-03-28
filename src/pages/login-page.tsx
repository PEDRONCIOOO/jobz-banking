import { AnimatePresence, motion } from 'framer-motion'
import { HeroSection } from '@/features/auth/components/hero-section'
import { LoginForm } from '@/features/auth/components/login-form'

export default function LoginPage() {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="mx-auto min-h-screen max-w-[430px] bg-background"
      >
        <HeroSection />
        <LoginForm />
      </motion.div>
    </AnimatePresence>
  )
}
