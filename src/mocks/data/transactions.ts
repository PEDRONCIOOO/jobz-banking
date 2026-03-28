export type TransactionType = 'income' | 'expense'
export type TransactionCategory = 'pix' | 'transfer' | 'payment' | 'salary' | 'crypto' | 'international'

export interface Transaction {
  id: string
  description: string
  amount: number
  type: TransactionType
  category: TransactionCategory
  date: string
  currency: string
  recipient?: string
}

function daysAgo(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString()
}

export const mockTransactions: Transaction[] = [
  { id: '1', description: 'Pix Recebido', amount: 3200, type: 'income', category: 'pix', date: daysAgo(0), currency: 'BRL', recipient: 'Axia Digital' },
  { id: '2', description: 'Netflix', amount: 55.9, type: 'expense', category: 'payment', date: daysAgo(0), currency: 'BRL' },
  { id: '3', description: 'Wire Transfer USD', amount: 1250, type: 'income', category: 'international', date: daysAgo(1), currency: 'USD', recipient: 'Onda Finance Inc.' },
  { id: '4', description: 'iFood', amount: 42.5, type: 'expense', category: 'payment', date: daysAgo(1), currency: 'BRL' },
  { id: '5', description: 'USDT Received', amount: 500, type: 'income', category: 'crypto', date: daysAgo(2), currency: 'USDT', recipient: '0x7a3b...f2d1' },
  { id: '6', description: 'Uber', amount: 28.9, type: 'expense', category: 'payment', date: daysAgo(2), currency: 'BRL' },
  { id: '7', description: 'Salário', amount: 12000, type: 'income', category: 'salary', date: daysAgo(3), currency: 'BRL', recipient: 'Axia Digital LTDA' },
  { id: '8', description: 'Remessa Internacional', amount: 2800, type: 'expense', category: 'international', date: daysAgo(3), currency: 'BRL', recipient: 'Maria Garcia (EUR)' },
  { id: '9', description: 'Spotify', amount: 21.9, type: 'expense', category: 'payment', date: daysAgo(4), currency: 'BRL' },
  { id: '10', description: 'Pix Enviado', amount: 150, type: 'expense', category: 'pix', date: daysAgo(4), currency: 'BRL', recipient: 'João Silva' },
  { id: '11', description: 'USDT Sent', amount: 200, type: 'expense', category: 'crypto', date: daysAgo(5), currency: 'USDT', recipient: '0x4c9e...a8b3' },
  { id: '12', description: 'Amazon', amount: 189.9, type: 'expense', category: 'payment', date: daysAgo(5), currency: 'BRL' },
  { id: '13', description: 'Freelance USD', amount: 850, type: 'income', category: 'international', date: daysAgo(6), currency: 'USD', recipient: 'Client Corp.' },
  { id: '14', description: 'Aluguel', amount: 2500, type: 'expense', category: 'transfer', date: daysAgo(7), currency: 'BRL', recipient: 'Imobiliária Central' },
  { id: '15', description: 'Pix Recebido', amount: 450, type: 'income', category: 'pix', date: daysAgo(8), currency: 'BRL', recipient: 'Ana Costa' },
  { id: '16', description: 'GitHub Pro', amount: 20, type: 'expense', category: 'payment', date: daysAgo(9), currency: 'USD' },
  { id: '17', description: 'Transferência Recebida', amount: 1800, type: 'income', category: 'transfer', date: daysAgo(10), currency: 'BRL', recipient: 'Carlos Mendes' },
  { id: '18', description: 'Mercado Livre', amount: 320, type: 'expense', category: 'payment', date: daysAgo(11), currency: 'BRL' },
  { id: '19', description: 'BTC Received', amount: 0.015, type: 'income', category: 'crypto', date: daysAgo(12), currency: 'BTC', recipient: 'Binance' },
  { id: '20', description: 'Conta de Luz', amount: 185.4, type: 'expense', category: 'payment', date: daysAgo(13), currency: 'BRL' },
]
