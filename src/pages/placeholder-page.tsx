import { motion } from 'framer-motion'

export default function PlaceholderPage({ title }: { title: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
      <p className="text-2xl font-bold text-text-primary">{title}</p>
      <p className="text-sm text-text-muted">Em breve</p>
    </motion.div>
  )
}
