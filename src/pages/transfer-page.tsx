import { useEffect } from 'react'
import { X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { TransferWizard } from '@/features/transfer/components/transfer-wizard'
import { useTransferStore } from '@/features/transfer/store'

export default function TransferPage() {
  const navigate = useNavigate()
  const reset = useTransferStore((s) => s.reset)

  useEffect(() => { return () => reset() }, [reset])

  return (
    <div className="min-h-screen bg-background">
      <div className="flex justify-end px-5 pt-4">
        <button onClick={() => { reset(); navigate('/dashboard') }} className="rounded-full p-2 text-text-muted transition-colors hover:bg-surface hover:text-text-primary">
          <X className="h-5 w-5" />
        </button>
      </div>
      <p className="mb-2 text-center text-base font-semibold text-text-primary">Nova Transferência</p>
      <TransferWizard />
    </div>
  )
}
