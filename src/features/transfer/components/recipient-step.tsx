import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { recipientSchema, type RecipientFormData } from '../schemas/transfer-schema'
import { useTransferStore } from '../store'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

const currencies = ['BRL', 'USD', 'USDT'] as const
const recentContacts = [
  { name: 'João Silva', key: 'joao@pix.com' },
  { name: 'Maria Garcia', key: 'maria.g@email.com' },
  { name: 'Ana Costa', key: '+55 11 99999-0000' },
]

export function RecipientStep() {
  const { setRecipient, nextStep, prevStep } = useTransferStore()
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<RecipientFormData>({
    resolver: zodResolver(recipientSchema),
    defaultValues: { currency: 'BRL' },
  })
  const selectedCurrency = watch('currency')

  const onSubmit = (data: RecipientFormData) => {
    setRecipient(data.recipient, data.description || '', data.currency)
    nextStep()
  }

  return (
    <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.25 }} className="px-6 pt-6">
      <button onClick={prevStep} className="mb-4 flex items-center gap-1 text-text-muted">
        <ArrowLeft className="h-4 w-4" /><span className="text-sm">Voltar</span>
      </button>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <Label className="text-xs uppercase tracking-widest text-text-label">Moeda</Label>
          <div className="mt-2 flex gap-2">
            {currencies.map((cur) => (
              <button key={cur} type="button" onClick={() => setValue('currency', cur)}
                className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${selectedCurrency === cur ? 'bg-gradient-to-r from-accent to-accent-light text-white' : 'border border-border bg-surface text-text-muted hover:bg-surface-hover'}`}
              >{cur}</button>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-widest text-text-label">Destinatário</Label>
          <Input placeholder="Nome ou chave Pix" variant={errors.recipient ? 'error' : 'default'} {...register('recipient')} />
          {errors.recipient && <p className="text-xs text-error">{errors.recipient.message}</p>}
        </div>
        <div>
          <p className="mb-2 text-xs uppercase tracking-widest text-text-label">Contatos recentes</p>
          <div className="space-y-2">
            {recentContacts.map((contact) => (
              <button key={contact.key} type="button" onClick={() => setValue('recipient', contact.name, { shouldValidate: true })}
                className="flex w-full items-center gap-3 rounded-[var(--radius-input)] border border-border bg-surface p-3 text-left transition-colors hover:bg-surface-hover">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/20 text-xs font-semibold text-accent-light">{contact.name[0]}</div>
                <div>
                  <p className="text-sm text-text-primary">{contact.name}</p>
                  <p className="text-xs text-text-muted">{contact.key}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-widest text-text-label">Descrição (opcional)</Label>
          <Input placeholder="Ex: Aluguel março" {...register('description')} />
        </div>
        <Button type="submit" variant="primary" size="lg" className="w-full">Continuar</Button>
      </form>
    </motion.div>
  )
}
