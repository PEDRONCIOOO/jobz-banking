import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useTransferStore } from '../store'
import { ProgressBar } from './progress-bar'
import { AmountStep } from './amount-step'
import { RecipientStep } from './recipient-step'
import { ConfirmStep } from './confirm-step'
import { SuccessScreen } from './success-screen'

export function TransferWizard() {
  const currentStep = useTransferStore((s) => s.currentStep)
  const [showSuccess, setShowSuccess] = useState(false)

  if (showSuccess) return <SuccessScreen />

  return (
    <div>
      <div className="px-6 pt-6"><ProgressBar currentStep={currentStep} totalSteps={3} /></div>
      <AnimatePresence mode="wait">
        {currentStep === 1 && <AmountStep key="amount" />}
        {currentStep === 2 && <RecipientStep key="recipient" />}
        {currentStep === 3 && <ConfirmStep key="confirm" onSuccess={() => setShowSuccess(true)} />}
      </AnimatePresence>
    </div>
  )
}
