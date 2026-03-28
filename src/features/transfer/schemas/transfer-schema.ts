import { z } from 'zod'

export const amountSchema = z.object({
  amount: z.number({ error: 'Informe um valor' }).positive('Valor deve ser maior que zero').max(999999.99, 'Valor máximo excedido'),
})

export const recipientSchema = z.object({
  recipient: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  description: z.string().optional(),
  currency: z.enum(['BRL', 'USD', 'USDT']),
})

export type AmountFormData = z.infer<typeof amountSchema>
export type RecipientFormData = z.infer<typeof recipientSchema>
