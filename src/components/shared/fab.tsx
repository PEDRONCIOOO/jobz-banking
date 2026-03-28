import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function FAB() {
  const navigate = useNavigate()

  return (
    <motion.button
      onClick={() => navigate('/transfer')}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="absolute -top-6 left-1/2 z-10 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full bg-gradient-to-br from-accent to-accent-light shadow-[0_4px_20px_rgba(108,92,231,0.4)]"
      layoutId="fab"
    >
      <Plus className="h-6 w-6 text-white" />
    </motion.button>
  )
}
