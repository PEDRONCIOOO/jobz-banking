# JobZ Banking Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a mobile-first dark premium banking app for the Onda Finance front-end challenge, with login, dashboard, and multi-step transfer wizard using mock data via MSW.

**Architecture:** Feature-based structure with thin page compositions. MSW intercepts real Axios calls for mock API. Zustand for auth persistence and wizard state. React Query for server state. Framer Motion for micro-animations throughout.

**Tech Stack:** React, TypeScript, Vite, Tailwind CSS + CVA, shadcn/ui + Radix, React Router, React Query, Zustand, React Hook Form + Zod, Axios, Framer Motion, MSW, Vitest

---

## File Map

```
src/
├── main.tsx                                    # Entry point, MSW init
├── app/
│   ├── App.tsx                                 # Root component with providers + router
│   ├── providers.tsx                           # QueryClientProvider wrapper
│   └── router.tsx                              # React Router route definitions
├── components/
│   ├── ui/                                     # shadcn/ui components (generated + customized)
│   │   ├── button.tsx                          # CVA variants: primary, secondary, ghost, danger
│   │   ├── input.tsx                           # CVA variants: default, error, success
│   │   ├── card.tsx                            # CVA variants: glass, solid, elevated
│   │   └── badge.tsx                           # CVA variants: income, expense, crypto, pending
│   └── shared/
│       ├── bottom-nav.tsx                      # Bottom tab bar with animated pill
│       ├── fab.tsx                             # Floating action button (center)
│       ├── page-transition.tsx                 # AnimatePresence wrapper for routes
│       └── app-layout.tsx                      # Mobile shell: max-w-[430px] + bottom nav
├── features/
│   ├── auth/
│   │   ├── components/
│   │   │   ├── hero-section.tsx                # "Seu dinheiro, sem fronteiras" headline
│   │   │   └── login-form.tsx                  # Email + password form in glass card
│   │   ├── hooks/
│   │   │   └── use-auth.ts                     # Login/logout mutation hooks
│   │   ├── schemas/
│   │   │   └── login-schema.ts                 # Zod schema for login form
│   │   └── store.ts                            # Zustand auth store with persist
│   ├── dashboard/
│   │   ├── components/
│   │   │   ├── balance-card.tsx                # Glass card with BRL + USD/USDT + eye toggle
│   │   │   ├── transaction-list.tsx            # Infinite scroll transaction list
│   │   │   ├── transaction-item.tsx            # Single transaction row
│   │   │   └── quick-actions.tsx               # 3 action buttons row
│   │   └── hooks/
│   │       ├── use-balance.ts                  # React Query hook for account data
│   │       └── use-transactions.ts             # useInfiniteQuery for transactions
│   └── transfer/
│       ├── components/
│       │   ├── transfer-wizard.tsx             # Wizard container with AnimatePresence
│       │   ├── amount-step.tsx                 # Step 1: value input + numeric keypad
│       │   ├── recipient-step.tsx              # Step 2: recipient + currency chips
│       │   ├── confirm-step.tsx                # Step 3: summary + confirm button
│       │   ├── success-screen.tsx              # Animated check + done
│       │   └── progress-bar.tsx                # 3-segment animated progress
│       ├── hooks/
│       │   └── use-transfer.ts                 # React Query mutation for transfer
│       ├── schemas/
│       │   └── transfer-schema.ts              # Zod schemas for each step
│       └── store.ts                            # Zustand wizard state (step, form data)
├── lib/
│   ├── axios.ts                                # Axios instance + interceptors
│   ├── utils.ts                                # cn(), formatCurrency(), getInitials()
│   └── constants.ts                            # API_BASE_URL, MOCK_DELAY
├── mocks/
│   ├── browser.ts                              # MSW setupWorker
│   ├── server.ts                               # MSW setupServer (tests)
│   ├── handlers/
│   │   ├── index.ts                            # Combines all handlers
│   │   ├── auth.ts                             # POST /api/auth/login, /logout
│   │   ├── account.ts                          # GET /api/account
│   │   ├── transactions.ts                     # GET /api/transactions
│   │   └── transfer.ts                         # POST /api/transfer
│   └── data/
│       ├── users.ts                            # Mock user credentials + profile
│       ├── transactions.ts                     # ~20 mock transactions
│       └── state.ts                            # In-memory mutable state (balance, txns)
├── pages/
│   ├── login-page.tsx                          # Login page composition
│   ├── dashboard-page.tsx                      # Dashboard page composition
│   ├── transfer-page.tsx                       # Transfer wizard page
│   └── placeholder-page.tsx                    # "Em breve" for Cartoes/Perfil
├── styles/
│   └── globals.css                             # Tailwind imports + dark theme tokens
└── test/
    ├── setup.ts                                # Vitest + MSW server config
    └── features/
        └── transfer/
            └── transfer-wizard.test.tsx        # Full transfer flow test
```

---

### Task 1: Project Scaffold & Dependencies

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `index.html`, `src/main.tsx`, `src/styles/globals.css`

- [ ] **Step 1: Create Vite project**

```bash
cd C:/Users/pedro
pnpm create vite jobZ-banking --template react-ts
cd jobZ-banking
```

- [ ] **Step 2: Install core dependencies**

```bash
pnpm add react-router-dom @tanstack/react-query zustand react-hook-form @hookform/resolvers zod axios framer-motion class-variance-authority clsx tailwind-merge lucide-react
```

- [ ] **Step 3: Install dev dependencies**

```bash
pnpm add -D msw vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom @types/node
```

- [ ] **Step 4: Initialize Tailwind CSS**

```bash
pnpm add -D tailwindcss @tailwindcss/vite
```

Update `vite.config.ts`:

```ts
/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
  },
})
```

- [ ] **Step 5: Configure global CSS with dark theme tokens**

Write `src/styles/globals.css`:

```css
@import "tailwindcss";

@custom-variant dark (&:is(.dark *));

@theme {
  --font-sans: 'Inter', ui-sans-serif, system-ui, sans-serif;

  --color-background: #0a0a0f;
  --color-surface: oklch(from white l c h / 0.04);
  --color-surface-hover: oklch(from white l c h / 0.08);
  --color-border: oklch(from white l c h / 0.08);
  --color-border-focus: oklch(from #6c5ce7 l c h / 0.5);

  --color-text-primary: #ffffff;
  --color-text-secondary: oklch(from white l c h / 0.6);
  --color-text-muted: oklch(from white l c h / 0.3);
  --color-text-label: oklch(from white l c h / 0.4);

  --color-accent: #6c5ce7;
  --color-accent-light: #a855f7;
  --color-success: #10b981;
  --color-error: #ef4444;
  --color-warning: #f59e0b;

  --radius-input: 12px;
  --radius-card: 16px;
  --radius-glass: 24px;
}

@layer base {
  * {
    border-color: var(--color-border);
  }

  body {
    background-color: var(--color-background);
    color: var(--color-text-primary);
    font-family: var(--font-sans);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
}
```

- [ ] **Step 6: Initialize shadcn/ui**

```bash
pnpm dlx shadcn@latest init
```

When prompted: Style: Default, Base color: Neutral, CSS variables: Yes.

Then add components:

```bash
pnpm dlx shadcn@latest add button input label card avatar badge separator
```

- [ ] **Step 7: Add Inter font to `index.html`**

Add to `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
<title>jobZ Banking</title>
```

- [ ] **Step 8: Add path alias to `tsconfig.json` / `tsconfig.app.json`**

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    },
    "types": ["vitest/globals"]
  }
}
```

- [ ] **Step 9: Clean up Vite boilerplate**

Delete `src/App.css`, `src/index.css`, `src/assets/react.svg`. Update `src/main.tsx` to import `./styles/globals.css`. Replace `src/App.tsx` with:

```tsx
export default function App() {
  return <div className="min-h-screen bg-background text-text-primary">jobZ Banking</div>
}
```

- [ ] **Step 10: Verify dev server runs**

```bash
pnpm dev
```

Expected: Browser shows "jobZ Banking" on dark background.

---

### Task 2: Core Infrastructure

**Files:**
- Create: `src/lib/utils.ts`, `src/lib/constants.ts`, `src/lib/axios.ts`
- Create: `src/app/providers.tsx`, `src/app/router.tsx`, `src/app/App.tsx`
- Create: `src/features/auth/store.ts`
- Create: `src/components/shared/app-layout.tsx`
- Create: `src/pages/login-page.tsx`, `src/pages/dashboard-page.tsx`, `src/pages/transfer-page.tsx`, `src/pages/placeholder-page.tsx`
- Modify: `src/main.tsx`

- [ ] **Step 1: Create `src/lib/utils.ts`**

```ts
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number, currency = 'BRL'): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency,
  }).format(value)
}

export function formatCurrencyCompact(value: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(value)
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function formatDate(date: Date | string): string {
  const d = new Date(date)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Hoje'
  if (diffDays === 1) return 'Ontem'
  if (diffDays < 7) return `${diffDays} dias atrás`

  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
}
```

- [ ] **Step 2: Create `src/lib/constants.ts`**

```ts
export const API_BASE_URL = '/api'
export const MOCK_DELAY = 500

export const MOCK_EXCHANGE_RATES = {
  USD: 0.19,
  USDT: 0.19,
} as const

export const CURRENCY_SYMBOLS = {
  BRL: 'R$',
  USD: '$',
  USDT: '₮',
} as const
```

- [ ] **Step 3: Create `src/lib/axios.ts`**

```ts
import axios from 'axios'
import { API_BASE_URL } from './constants'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const stored = localStorage.getItem('jobz-auth')
  if (stored) {
    try {
      const { state } = JSON.parse(stored)
      if (state?.token) {
        config.headers.Authorization = `Bearer ${state.token}`
      }
    } catch {}
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('jobz-auth')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
```

- [ ] **Step 4: Create `src/app/providers.tsx`**

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { type ReactNode } from 'react'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
})

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
```

- [ ] **Step 5: Create `src/features/auth/store.ts`**

```ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  name: string
  email: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (user: User, token: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user, token) => set({ user, token, isAuthenticated: true }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    {
      name: 'jobz-auth',
    }
  )
)
```

- [ ] **Step 6: Create placeholder pages**

`src/pages/login-page.tsx`:
```tsx
export default function LoginPage() {
  return <div className="p-4">Login Page</div>
}
```

`src/pages/dashboard-page.tsx`:
```tsx
export default function DashboardPage() {
  return <div className="p-4">Dashboard</div>
}
```

`src/pages/transfer-page.tsx`:
```tsx
export default function TransferPage() {
  return <div className="p-4">Transfer</div>
}
```

`src/pages/placeholder-page.tsx`:
```tsx
import { motion } from 'framer-motion'

export default function PlaceholderPage({ title }: { title: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-[60vh] gap-3"
    >
      <p className="text-2xl font-bold text-text-primary">{title}</p>
      <p className="text-sm text-text-muted">Em breve</p>
    </motion.div>
  )
}
```

- [ ] **Step 7: Create `src/components/shared/app-layout.tsx` (placeholder)**

```tsx
import { Outlet } from 'react-router-dom'

export function AppLayout() {
  return (
    <div className="mx-auto min-h-screen max-w-[430px] bg-background">
      <div className="pb-20">
        <Outlet />
      </div>
    </div>
  )
}
```

- [ ] **Step 8: Create `src/app/router.tsx`**

```tsx
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/features/auth/store'
import { type ReactNode } from 'react'

import LoginPage from '@/pages/login-page'
import DashboardPage from '@/pages/dashboard-page'
import TransferPage from '@/pages/transfer-page'
import PlaceholderPage from '@/pages/placeholder-page'
import { AppLayout } from '@/components/shared/app-layout'

function PrivateRoute({ children }: { children: ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <>{children}</>
}

function PublicRoute({ children }: { children: ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  if (isAuthenticated) return <Navigate to="/dashboard" replace />
  return <>{children}</>
}

export const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    ),
  },
  {
    path: '/',
    element: (
      <PrivateRoute>
        <AppLayout />
      </PrivateRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'transfer', element: <TransferPage /> },
      { path: 'extrato', element: <DashboardPage /> },
      { path: 'cartoes', element: <PlaceholderPage title="Cartões" /> },
      { path: 'perfil', element: <PlaceholderPage title="Perfil" /> },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/login" replace />,
  },
])
```

- [ ] **Step 9: Create `src/app/App.tsx`**

```tsx
import { RouterProvider } from 'react-router-dom'
import { Providers } from './providers'
import { router } from './router'

export default function App() {
  return (
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  )
}
```

- [ ] **Step 10: Update `src/main.tsx`**

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './app/App'
import './styles/globals.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
```

- [ ] **Step 11: Verify routing works**

```bash
pnpm dev
```

Expected: Browser redirects to `/login`, shows "Login Page" on dark background.

---

### Task 3: MSW + Mock Data

**Files:**
- Create: `src/mocks/data/users.ts`, `src/mocks/data/transactions.ts`, `src/mocks/data/state.ts`
- Create: `src/mocks/handlers/auth.ts`, `src/mocks/handlers/account.ts`, `src/mocks/handlers/transactions.ts`, `src/mocks/handlers/transfer.ts`, `src/mocks/handlers/index.ts`
- Create: `src/mocks/browser.ts`, `src/mocks/server.ts`
- Modify: `src/main.tsx`

- [ ] **Step 1: Initialize MSW service worker**

```bash
pnpm dlx msw init public/ --save
```

- [ ] **Step 2: Create `src/mocks/data/users.ts`**

```ts
export interface MockUser {
  id: string
  name: string
  email: string
  password: string
}

export const mockUsers: MockUser[] = [
  {
    id: '1',
    name: 'Pedro Trotta',
    email: 'pedro@jobz.com',
    password: '123456',
  },
]
```

- [ ] **Step 3: Create `src/mocks/data/transactions.ts`**

```ts
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
```

- [ ] **Step 4: Create `src/mocks/data/state.ts`**

```ts
import { mockTransactions, type Transaction } from './transactions'

interface MockState {
  balance: number
  transactions: Transaction[]
}

export const mockState: MockState = {
  balance: 12450.0,
  transactions: [...mockTransactions],
}

export function deductBalance(amount: number) {
  mockState.balance -= amount
}

export function addTransaction(transaction: Transaction) {
  mockState.transactions.unshift(transaction)
}

export function resetState() {
  mockState.balance = 12450.0
  mockState.transactions = [...mockTransactions]
}
```

- [ ] **Step 5: Create `src/mocks/handlers/auth.ts`**

```ts
import { http, HttpResponse, delay } from 'msw'
import { mockUsers } from '../data/users'
import { MOCK_DELAY } from '@/lib/constants'

export const authHandlers = [
  http.post('/api/auth/login', async ({ request }) => {
    await delay(MOCK_DELAY)
    const body = (await request.json()) as { email: string; password: string }
    const user = mockUsers.find(
      (u) => u.email === body.email && u.password === body.password
    )

    if (!user) {
      return HttpResponse.json(
        { message: 'Email ou senha inválidos' },
        { status: 401 }
      )
    }

    return HttpResponse.json({
      token: `mock-jwt-${user.id}-${Date.now()}`,
      user: { id: user.id, name: user.name, email: user.email },
    })
  }),

  http.post('/api/auth/logout', async () => {
    await delay(MOCK_DELAY)
    return HttpResponse.json({ success: true })
  }),
]
```

- [ ] **Step 6: Create `src/mocks/handlers/account.ts`**

```ts
import { http, HttpResponse, delay } from 'msw'
import { mockState } from '../data/state'
import { MOCK_DELAY } from '@/lib/constants'

export const accountHandlers = [
  http.get('/api/account', async () => {
    await delay(MOCK_DELAY)
    return HttpResponse.json({
      balance: mockState.balance,
      accountNumber: '0001-12345-6',
      user: {
        id: '1',
        name: 'Pedro Trotta',
        email: 'pedro@jobz.com',
      },
    })
  }),
]
```

- [ ] **Step 7: Create `src/mocks/handlers/transactions.ts`**

```ts
import { http, HttpResponse, delay } from 'msw'
import { mockState } from '../data/state'
import { MOCK_DELAY } from '@/lib/constants'

const PAGE_SIZE = 8

export const transactionHandlers = [
  http.get('/api/transactions', async ({ request }) => {
    await delay(MOCK_DELAY)
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') || '1')
    const start = (page - 1) * PAGE_SIZE
    const end = start + PAGE_SIZE
    const items = mockState.transactions.slice(start, end)
    const hasMore = end < mockState.transactions.length

    return HttpResponse.json({
      data: items,
      page,
      hasMore,
      total: mockState.transactions.length,
    })
  }),
]
```

- [ ] **Step 8: Create `src/mocks/handlers/transfer.ts`**

```ts
import { http, HttpResponse, delay } from 'msw'
import { mockState, deductBalance, addTransaction } from '../data/state'
import { MOCK_DELAY } from '@/lib/constants'

export const transferHandlers = [
  http.post('/api/transfer', async ({ request }) => {
    await delay(MOCK_DELAY)
    const body = (await request.json()) as {
      amount: number
      recipient: string
      description?: string
    }

    if (body.amount <= 0) {
      return HttpResponse.json(
        { message: 'Valor deve ser maior que zero' },
        { status: 400 }
      )
    }

    if (body.amount > mockState.balance) {
      return HttpResponse.json(
        { message: 'Saldo insuficiente' },
        { status: 400 }
      )
    }

    deductBalance(body.amount)
    addTransaction({
      id: `txn-${Date.now()}`,
      description: body.description || 'Transferência Enviada',
      amount: body.amount,
      type: 'expense',
      category: 'transfer',
      date: new Date().toISOString(),
      currency: 'BRL',
      recipient: body.recipient,
    })

    return HttpResponse.json({
      success: true,
      newBalance: mockState.balance,
      transactionId: `txn-${Date.now()}`,
    })
  }),
]
```

- [ ] **Step 9: Create `src/mocks/handlers/index.ts`**

```ts
import { authHandlers } from './auth'
import { accountHandlers } from './account'
import { transactionHandlers } from './transactions'
import { transferHandlers } from './transfer'

export const handlers = [
  ...authHandlers,
  ...accountHandlers,
  ...transactionHandlers,
  ...transferHandlers,
]
```

- [ ] **Step 10: Create `src/mocks/browser.ts` and `src/mocks/server.ts`**

`src/mocks/browser.ts`:
```ts
import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

export const worker = setupWorker(...handlers)
```

`src/mocks/server.ts`:
```ts
import { setupServer } from 'msw/node'
import { handlers } from './handlers'

export const server = setupServer(...handlers)
```

- [ ] **Step 11: Update `src/main.tsx` to start MSW**

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './app/App'
import './styles/globals.css'

async function enableMocking() {
  const { worker } = await import('./mocks/browser')
  return worker.start({
    onUnhandledRequest: 'bypass',
  })
}

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>
  )
})
```

- [ ] **Step 12: Create test setup `src/test/setup.ts`**

```ts
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterAll, afterEach, beforeAll } from 'vitest'
import { server } from '@/mocks/server'

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => {
  cleanup()
  server.resetHandlers()
})
afterAll(() => server.close())
```

- [ ] **Step 13: Verify MSW starts**

```bash
pnpm dev
```

Expected: Browser console shows `[MSW] Mocking enabled.`

---

### Task 4: CVA Components

**Files:**
- Modify: `src/components/ui/button.tsx`, `src/components/ui/input.tsx`, `src/components/ui/card.tsx`, `src/components/ui/badge.tsx`

> Read each shadcn-generated file first, then replace the `cva()` variants with our dark premium theme.

- [ ] **Step 1: Customize `src/components/ui/button.tsx`**

Replace the `buttonVariants` cva call:

```ts
import { cva, type VariantProps } from 'class-variance-authority'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-[var(--radius-input)] text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'bg-gradient-to-br from-accent to-accent-light text-white shadow-[0_4px_20px_rgba(108,92,231,0.4)] hover:shadow-[0_6px_24px_rgba(108,92,231,0.5)] hover:scale-[1.02] active:scale-[0.98]',
        secondary:
          'bg-surface border border-border text-text-primary hover:bg-surface-hover',
        ghost:
          'text-text-secondary hover:bg-surface hover:text-text-primary',
        danger:
          'bg-error/10 text-error border border-error/20 hover:bg-error/20',
      },
      size: {
        sm: 'h-9 px-3 text-xs',
        md: 'h-11 px-6 text-sm',
        lg: 'h-12 px-8 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)
```

Export `buttonVariants` and `Button` with `VariantProps<typeof buttonVariants>`.

- [ ] **Step 2: Customize `src/components/ui/input.tsx`**

```tsx
import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const inputVariants = cva(
  'flex h-11 w-full rounded-[var(--radius-input)] px-4 py-2 text-sm text-text-primary placeholder:text-text-muted transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-surface border border-border focus:border-border-focus focus:ring-2 focus:ring-accent/20',
        error:
          'bg-surface border border-error/50 focus:border-error focus:ring-2 focus:ring-error/20',
        success:
          'bg-surface border border-success/50 focus:border-success focus:ring-2 focus:ring-success/20',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ variant }), className)}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export { Input, inputVariants }
```

- [ ] **Step 3: Customize `src/components/ui/card.tsx`**

```tsx
import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const cardVariants = cva('rounded-[var(--radius-card)] transition-all duration-200', {
  variants: {
    variant: {
      glass: 'bg-surface border border-border backdrop-blur-xl',
      solid: 'bg-surface-hover border border-border',
      elevated: 'bg-surface border border-border shadow-lg shadow-black/20',
    },
  },
  defaultVariants: {
    variant: 'glass',
  },
})

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, ...props }, ref) => (
    <div ref={ref} className={cn(cardVariants({ variant }), className)} {...props} />
  )
)
Card.displayName = 'Card'

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col space-y-1.5 p-5', className)} {...props} />
  )
)
CardHeader.displayName = 'CardHeader'

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn('text-lg font-semibold text-text-primary', className)} {...props} />
  )
)
CardTitle.displayName = 'CardTitle'

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-5 pt-0', className)} {...props} />
  )
)
CardContent.displayName = 'CardContent'

export { Card, CardHeader, CardTitle, CardContent, cardVariants }
```

- [ ] **Step 4: Customize `src/components/ui/badge.tsx`**

```tsx
import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        income: 'bg-success/10 text-success border border-success/20',
        expense: 'bg-error/10 text-error border border-error/20',
        crypto: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20',
        pending: 'bg-warning/10 text-warning border border-warning/20',
        default: 'bg-surface text-text-secondary border border-border',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
```

- [ ] **Step 5: Verify components render**

Open browser, temporarily render variants to visually verify. Then remove test.

---

### Task 5: Auth Feature — Login Page

**Files:**
- Create: `src/features/auth/schemas/login-schema.ts`, `src/features/auth/hooks/use-auth.ts`
- Create: `src/features/auth/components/hero-section.tsx`, `src/features/auth/components/login-form.tsx`
- Modify: `src/pages/login-page.tsx`

- [ ] **Step 1: Create `src/features/auth/schemas/login-schema.ts`**

```ts
import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().min(1, 'Email é obrigatório').email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória').min(6, 'Senha deve ter no mínimo 6 caracteres'),
})

export type LoginFormData = z.infer<typeof loginSchema>
```

- [ ] **Step 2: Create `src/features/auth/hooks/use-auth.ts`**

```ts
import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import { useAuthStore } from '../store'
import { useNavigate } from 'react-router-dom'

interface LoginPayload {
  email: string
  password: string
}

interface LoginResponse {
  token: string
  user: { id: string; name: string; email: string }
}

export function useLogin() {
  const login = useAuthStore((s) => s.login)
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const { data } = await api.post<LoginResponse>('/auth/login', payload)
      return data
    },
    onSuccess: (data) => {
      login(data.user, data.token)
      navigate('/dashboard')
    },
  })
}

export function useLogout() {
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async () => {
      await api.post('/auth/logout')
    },
    onSuccess: () => {
      logout()
      navigate('/login')
    },
  })
}
```

- [ ] **Step 3: Create `src/features/auth/components/hero-section.tsx`**

```tsx
import { motion } from 'framer-motion'

export function HeroSection() {
  return (
    <div className="px-6 pt-16 pb-8">
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <h1 className="text-4xl font-extrabold tracking-tight leading-tight">
          <span className="text-text-primary">
            job
            <span className="bg-gradient-to-br from-accent to-accent-light bg-clip-text text-transparent">
              Z
            </span>
          </span>
        </h1>
        <p className="mt-1 text-xs uppercase tracking-[0.25em] text-text-muted">banking</p>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
        className="mt-6 text-xl font-light text-text-secondary leading-relaxed"
      >
        Seu dinheiro,
        <br />
        <span className="font-semibold text-text-primary">sem fronteiras.</span>
      </motion.p>
    </div>
  )
}
```

- [ ] **Step 4: Create `src/features/auth/components/login-form.tsx`**

```tsx
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, type LoginFormData } from '../schemas/login-schema'
import { useLogin } from '../hooks/use-auth'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

export function LoginForm() {
  const { mutate, isPending, error } = useLogin()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = (data: LoginFormData) => mutate(data)
  const apiError = error?.response?.data?.message as string | undefined

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', damping: 20, stiffness: 100, delay: 0.2 }}
      className="px-6"
    >
      <motion.form
        onSubmit={handleSubmit(onSubmit)}
        animate={apiError ? { x: [0, -10, 10, -10, 10, 0] } : {}}
        transition={{ duration: 0.4 }}
        className="rounded-[var(--radius-glass)] border border-border bg-surface p-6 backdrop-blur-xl"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-xs uppercase tracking-widest text-text-label">Email</Label>
            <Input id="email" type="email" placeholder="seu@email.com" variant={errors.email ? 'error' : 'default'} {...register('email')} />
            {errors.email && <p className="text-xs text-error">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-xs uppercase tracking-widest text-text-label">Senha</Label>
            <Input id="password" type="password" placeholder="••••••" variant={errors.password ? 'error' : 'default'} {...register('password')} />
            {errors.password && <p className="text-xs text-error">{errors.password.message}</p>}
          </div>

          {apiError && (
            <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center text-sm text-error">
              {apiError}
            </motion.p>
          )}

          <Button type="submit" variant="primary" size="lg" className="w-full" disabled={isPending}>
            {isPending ? (
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              'Entrar'
            )}
          </Button>
        </div>
        <p className="mt-4 text-center text-xs text-text-muted">Esqueceu a senha?</p>
      </motion.form>

      <div className="mt-6 flex items-center justify-center gap-4">
        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.5, duration: 0.4 }} className="h-[3px] w-10 rounded-full bg-gradient-to-r from-accent to-transparent" />
        <div className="h-[3px] w-10 rounded-full bg-surface" />
        <div className="h-[3px] w-10 rounded-full bg-surface" />
      </div>
    </motion.div>
  )
}
```

- [ ] **Step 5: Update `src/pages/login-page.tsx`**

```tsx
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
```

- [ ] **Step 6: Verify login flow**

```bash
pnpm dev
```

Expected: Dark login with hero + glass card. `pedro@jobz.com` / `123456` → redirects to dashboard. Wrong credentials → shake + error.

---

### Task 6: Bottom Navigation + FAB + Layout Shell

**Files:**
- Create: `src/components/shared/fab.tsx`, `src/components/shared/bottom-nav.tsx`
- Modify: `src/components/shared/app-layout.tsx`

- [ ] **Step 1: Create `src/components/shared/fab.tsx`**

```tsx
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
```

- [ ] **Step 2: Create `src/components/shared/bottom-nav.tsx`**

```tsx
import { motion } from 'framer-motion'
import { Home, Receipt, CreditCard, User } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { FAB } from './fab'

const tabs = [
  { path: '/dashboard', icon: Home, label: 'Home' },
  { path: '/extrato', icon: Receipt, label: 'Extrato' },
  { path: '__fab__', icon: null, label: '' },
  { path: '/cartoes', icon: CreditCard, label: 'Cartões' },
  { path: '/perfil', icon: User, label: 'Perfil' },
]

export function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <div className="fixed bottom-0 left-1/2 z-50 w-full max-w-[430px] -translate-x-1/2">
      <nav className="relative border-t border-border bg-background/80 backdrop-blur-xl">
        <FAB />
        <div className="flex items-center justify-around px-2 py-2">
          {tabs.map((tab) => {
            if (tab.path === '__fab__') {
              return <div key="fab-spacer" className="w-14" />
            }
            const isActive = location.pathname === tab.path
            const Icon = tab.icon!
            return (
              <button
                key={tab.path}
                onClick={() => navigate(tab.path)}
                className="relative flex flex-col items-center gap-1 px-3 py-1"
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute -top-1 h-[3px] w-8 rounded-full bg-gradient-to-r from-accent to-accent-light"
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  />
                )}
                <Icon className={`h-5 w-5 transition-colors duration-200 ${isActive ? 'text-accent-light' : 'text-text-muted'}`} />
                <span className={`text-[10px] transition-colors duration-200 ${isActive ? 'text-accent-light' : 'text-text-muted'}`}>{tab.label}</span>
              </button>
            )
          })}
        </div>
        <div className="h-[env(safe-area-inset-bottom)]" />
      </nav>
    </div>
  )
}
```

- [ ] **Step 3: Update `src/components/shared/app-layout.tsx`**

```tsx
import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { BottomNav } from './bottom-nav'

export function AppLayout() {
  const location = useLocation()

  return (
    <div className="mx-auto min-h-screen max-w-[430px] bg-background">
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
```

- [ ] **Step 4: Verify navigation**

Expected: After login, bottom nav with FAB, pill slides between tabs, FAB navigates to transfer.

---

### Task 7: Dashboard Feature

**Files:**
- Create: `src/features/dashboard/hooks/use-balance.ts`, `src/features/dashboard/hooks/use-transactions.ts`
- Create: `src/features/dashboard/components/balance-card.tsx`, `src/features/dashboard/components/transaction-item.tsx`, `src/features/dashboard/components/transaction-list.tsx`, `src/features/dashboard/components/quick-actions.tsx`
- Modify: `src/pages/dashboard-page.tsx`

- [ ] **Step 1: Create `src/features/dashboard/hooks/use-balance.ts`**

```ts
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'

interface AccountData {
  balance: number
  accountNumber: string
  user: { id: string; name: string; email: string }
}

export function useBalance() {
  return useQuery({
    queryKey: ['account'],
    queryFn: async () => {
      const { data } = await api.get<AccountData>('/account')
      return data
    },
  })
}
```

- [ ] **Step 2: Create `src/features/dashboard/hooks/use-transactions.ts`**

```ts
import { useInfiniteQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import type { Transaction } from '@/mocks/data/transactions'

interface TransactionsResponse {
  data: Transaction[]
  page: number
  hasMore: boolean
  total: number
}

export function useTransactions() {
  return useInfiniteQuery({
    queryKey: ['transactions'],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await api.get<TransactionsResponse>('/transactions', {
        params: { page: pageParam },
      })
      return data
    },
    getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.page + 1 : undefined,
    initialPageParam: 1,
  })
}
```

- [ ] **Step 3: Create `src/features/dashboard/components/balance-card.tsx`**

```tsx
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { useBalance } from '../hooks/use-balance'
import { formatCurrency, formatCurrencyCompact } from '@/lib/utils'
import { MOCK_EXCHANGE_RATES } from '@/lib/constants'

export function BalanceCard() {
  const { data, isLoading } = useBalance()
  const [visible, setVisible] = useState(true)

  const balance = data?.balance ?? 0
  const usdEquiv = balance * MOCK_EXCHANGE_RATES.USD
  const usdtEquiv = balance * MOCK_EXCHANGE_RATES.USDT

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, ease: 'easeOut' }}>
      <Card variant="glass" className="rounded-[var(--radius-glass)] p-5">
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase tracking-widest text-text-label">Saldo disponível</p>
          <button onClick={() => setVisible(!visible)} className="rounded-full p-1 text-text-muted transition-colors hover:text-text-primary">
            {visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </button>
        </div>

        <AnimatePresence mode="wait">
          {visible ? (
            <motion.div key="visible" initial={{ opacity: 0, filter: 'blur(10px)' }} animate={{ opacity: 1, filter: 'blur(0px)' }} exit={{ opacity: 0, filter: 'blur(10px)' }} transition={{ duration: 0.2 }}>
              {isLoading ? (
                <div className="mt-2 h-9 w-40 animate-pulse rounded-lg bg-surface-hover" />
              ) : (
                <>
                  <p className="mt-1 text-3xl font-bold tracking-tight text-text-primary">{formatCurrency(balance)}</p>
                  <p className="mt-1 text-xs text-text-muted">≈ {formatCurrencyCompact(usdEquiv, 'USD')} · {formatCurrencyCompact(usdtEquiv, 'USD')} USDT</p>
                </>
              )}
            </motion.div>
          ) : (
            <motion.div key="hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-2">
              <p className="text-3xl font-bold tracking-tight text-text-primary">••••••</p>
              <p className="mt-1 text-xs text-text-muted">Toque para exibir</p>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  )
}
```

- [ ] **Step 4: Create `src/features/dashboard/components/quick-actions.tsx`**

```tsx
import { motion } from 'framer-motion'
import { ArrowUpRight, Globe, Receipt } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const actions = [
  { icon: ArrowUpRight, label: 'Transferir', path: '/transfer', accent: true },
  { icon: Globe, label: 'Global', path: null, accent: false },
  { icon: Receipt, label: 'Extrato', path: '/extrato', accent: false },
]

export function QuickActions() {
  const navigate = useNavigate()

  return (
    <div className="flex gap-3">
      {actions.map((action, i) => (
        <motion.button
          key={action.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 + i * 0.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => action.path && navigate(action.path)}
          className={`flex flex-1 flex-col items-center gap-2 rounded-[var(--radius-input)] p-3 transition-colors ${
            action.accent
              ? 'bg-gradient-to-br from-accent to-accent-light text-white'
              : 'border border-border bg-surface text-text-muted hover:bg-surface-hover'
          }`}
        >
          <action.icon className="h-5 w-5" />
          <span className="text-[11px] font-medium">{action.label}</span>
        </motion.button>
      ))}
    </div>
  )
}
```

- [ ] **Step 5: Create `src/features/dashboard/components/transaction-item.tsx`**

```tsx
import { motion } from 'framer-motion'
import type { Transaction } from '@/mocks/data/transactions'
import { formatCurrency, formatDate, getInitials } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

const categoryColors: Record<string, string> = {
  pix: 'bg-accent/20 text-accent-light',
  transfer: 'bg-blue-500/20 text-blue-400',
  payment: 'bg-orange-500/20 text-orange-400',
  salary: 'bg-success/20 text-success',
  crypto: 'bg-cyan-500/20 text-cyan-400',
  international: 'bg-purple-500/20 text-purple-400',
}

interface TransactionItemProps {
  transaction: Transaction
  index: number
}

export function TransactionItem({ transaction, index }: TransactionItemProps) {
  const isIncome = transaction.type === 'income'
  const initial = getInitials(transaction.description)
  const colorClass = categoryColors[transaction.category] || categoryColors.payment

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05, duration: 0.3 }} className="flex items-center gap-3 py-3">
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${colorClass}`}>{initial}</div>
      <div className="flex-1 min-w-0">
        <p className="truncate text-sm font-medium text-text-primary">{transaction.description}</p>
        <div className="flex items-center gap-2">
          <p className="text-xs text-text-muted">{formatDate(transaction.date)}</p>
          {transaction.currency !== 'BRL' && (
            <Badge variant={transaction.category === 'crypto' ? 'crypto' : 'default'}>{transaction.currency}</Badge>
          )}
        </div>
      </div>
      <p className={`text-sm font-semibold tabular-nums ${isIncome ? 'text-success' : 'text-error'}`}>
        {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
      </p>
    </motion.div>
  )
}
```

- [ ] **Step 6: Create `src/features/dashboard/components/transaction-list.tsx`**

```tsx
import { useTransactions } from '../hooks/use-transactions'
import { TransactionItem } from './transaction-item'
import { Button } from '@/components/ui/button'

export function TransactionList() {
  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useTransactions()
  const transactions = data?.pages.flatMap((page) => page.data) ?? []

  return (
    <div>
      <h3 className="mb-3 text-xs uppercase tracking-widest text-text-label">Transações recentes</h3>
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 py-3">
              <div className="h-10 w-10 animate-pulse rounded-full bg-surface-hover" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-32 animate-pulse rounded bg-surface-hover" />
                <div className="h-3 w-20 animate-pulse rounded bg-surface-hover" />
              </div>
              <div className="h-4 w-20 animate-pulse rounded bg-surface-hover" />
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="divide-y divide-border">
            {transactions.map((txn, i) => (
              <TransactionItem key={txn.id} transaction={txn} index={i} />
            ))}
          </div>
          {hasNextPage && (
            <div className="mt-4 flex justify-center">
              <Button variant="ghost" size="sm" onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
                {isFetchingNextPage ? 'Carregando...' : 'Ver mais'}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
```

- [ ] **Step 7: Update `src/pages/dashboard-page.tsx`**

```tsx
import { motion } from 'framer-motion'
import { useAuthStore } from '@/features/auth/store'
import { BalanceCard } from '@/features/dashboard/components/balance-card'
import { QuickActions } from '@/features/dashboard/components/quick-actions'
import { TransactionList } from '@/features/dashboard/components/transaction-list'
import { getInitials } from '@/lib/utils'

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user)
  const firstName = user?.name.split(' ')[0] ?? 'Usuário'

  return (
    <div className="px-5 pt-12">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm text-text-muted">Olá,</p>
          <p className="text-xl font-bold text-text-primary">{firstName}</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-accent to-accent-light text-sm font-semibold text-white">
          {getInitials(user?.name ?? 'U')}
        </div>
      </motion.div>
      <div className="mb-5"><BalanceCard /></div>
      <div className="mb-6"><QuickActions /></div>
      <TransactionList />
    </div>
  )
}
```

- [ ] **Step 8: Verify dashboard**

Expected: Greeting, balance with BRL/USD/USDT, eye toggle, quick actions, paginated transactions with stagger animations.

---

### Task 8: Transfer Feature — Multi-Step Wizard

**Files:**
- Create: `src/features/transfer/schemas/transfer-schema.ts`, `src/features/transfer/store.ts`, `src/features/transfer/hooks/use-transfer.ts`
- Create: `src/features/transfer/components/progress-bar.tsx`, `src/features/transfer/components/amount-step.tsx`, `src/features/transfer/components/recipient-step.tsx`, `src/features/transfer/components/confirm-step.tsx`, `src/features/transfer/components/success-screen.tsx`, `src/features/transfer/components/transfer-wizard.tsx`
- Modify: `src/pages/transfer-page.tsx`

- [ ] **Step 1: Create `src/features/transfer/schemas/transfer-schema.ts`**

```ts
import { z } from 'zod'

export const amountSchema = z.object({
  amount: z.number({ invalid_type_error: 'Informe um valor' }).positive('Valor deve ser maior que zero').max(999999.99, 'Valor máximo excedido'),
})

export const recipientSchema = z.object({
  recipient: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  description: z.string().optional(),
  currency: z.enum(['BRL', 'USD', 'USDT']).default('BRL'),
})

export type AmountFormData = z.infer<typeof amountSchema>
export type RecipientFormData = z.infer<typeof recipientSchema>
```

- [ ] **Step 2: Create `src/features/transfer/store.ts`**

```ts
import { create } from 'zustand'

interface TransferState {
  currentStep: number
  amount: number
  recipient: string
  description: string
  currency: string
  nextStep: () => void
  prevStep: () => void
  setAmount: (amount: number) => void
  setRecipient: (recipient: string, description: string, currency: string) => void
  reset: () => void
}

export const useTransferStore = create<TransferState>((set) => ({
  currentStep: 1,
  amount: 0,
  recipient: '',
  description: '',
  currency: 'BRL',
  nextStep: () => set((s) => ({ currentStep: Math.min(s.currentStep + 1, 3) })),
  prevStep: () => set((s) => ({ currentStep: Math.max(s.currentStep - 1, 1) })),
  setAmount: (amount) => set({ amount }),
  setRecipient: (recipient, description, currency) => set({ recipient, description, currency }),
  reset: () => set({ currentStep: 1, amount: 0, recipient: '', description: '', currency: 'BRL' }),
}))
```

- [ ] **Step 3: Create `src/features/transfer/hooks/use-transfer.ts`**

```ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/axios'

interface TransferPayload { amount: number; recipient: string; description?: string }
interface TransferResponse { success: boolean; newBalance: number; transactionId: string }

export function useTransfer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: TransferPayload) => {
      const { data } = await api.post<TransferResponse>('/transfer', payload)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['account'] })
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
    },
  })
}
```

- [ ] **Step 4: Create `src/features/transfer/components/progress-bar.tsx`**

```tsx
import { motion } from 'framer-motion'

export function ProgressBar({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
  return (
    <div className="flex gap-2">
      {Array.from({ length: totalSteps }).map((_, i) => (
        <div key={i} className="relative h-[3px] flex-1 overflow-hidden rounded-full bg-surface-hover">
          {i < currentStep && (
            <motion.div
              layoutId={`progress-${i}`}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="absolute inset-0 rounded-full bg-gradient-to-r from-accent to-accent-light"
              style={{ transformOrigin: 'left' }}
            />
          )}
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 5: Create `src/features/transfer/components/amount-step.tsx`**

```tsx
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTransferStore } from '../store'
import { useBalance } from '@/features/dashboard/hooks/use-balance'
import { formatCurrency } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', '⌫']

export function AmountStep() {
  const { setAmount, nextStep } = useTransferStore()
  const { data } = useBalance()
  const balance = data?.balance ?? 0
  const [value, setValue] = useState('')

  const numericValue = parseFloat(value || '0')
  const isValid = numericValue > 0 && numericValue <= balance
  const exceedsBalance = numericValue > balance

  function handleKey(key: string) {
    if (key === '⌫') { setValue((v) => v.slice(0, -1)); return }
    if (key === '.' && value.includes('.')) return
    if (value.includes('.') && value.split('.')[1]?.length >= 2) return
    setValue((v) => v + key)
  }

  function handleContinue() {
    if (!isValid) return
    setAmount(numericValue)
    nextStep()
  }

  return (
    <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.25 }} className="flex flex-col items-center px-6 pt-8">
      <p className="mb-2 text-xs uppercase tracking-widest text-text-muted">Quanto você quer enviar?</p>
      <div className="mb-2 text-center">
        <span className="text-4xl font-bold text-text-primary tabular-nums">
          R$ {value ? parseFloat(value).toLocaleString('pt-BR', { minimumFractionDigits: 0 }) : '0'}
          <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.8, repeat: Infinity }} className="text-accent">|</motion.span>
        </span>
      </div>
      <p className={`mb-6 text-xs ${exceedsBalance ? 'text-error' : 'text-text-muted'}`}>Disponível: {formatCurrency(balance)}</p>
      <div className="mb-6 grid w-full max-w-[280px] grid-cols-3 gap-3">
        {keys.map((key) => (
          <motion.button key={key} whileTap={{ scale: 0.9 }} onClick={() => handleKey(key)} className="flex h-14 items-center justify-center rounded-[var(--radius-input)] bg-surface text-lg font-medium text-text-primary transition-colors hover:bg-surface-hover active:bg-surface-hover">{key}</motion.button>
        ))}
      </div>
      <Button variant="primary" size="lg" className="w-full max-w-[280px]" onClick={handleContinue} disabled={!isValid}>Continuar</Button>
    </motion.div>
  )
}
```

- [ ] **Step 6: Create `src/features/transfer/components/recipient-step.tsx`**

```tsx
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
```

- [ ] **Step 7: Create `src/features/transfer/components/confirm-step.tsx`**

```tsx
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { useTransferStore } from '../store'
import { useTransfer } from '../hooks/use-transfer'
import { formatCurrency } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface ConfirmStepProps { onSuccess: () => void }

export function ConfirmStep({ onSuccess }: ConfirmStepProps) {
  const { amount, recipient, description, currency, prevStep } = useTransferStore()
  const { mutate, isPending } = useTransfer()

  function handleConfirm() {
    mutate({ amount, recipient, description }, { onSuccess })
  }

  return (
    <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.25 }} className="px-6 pt-6">
      <button onClick={prevStep} className="mb-4 flex items-center gap-1 text-text-muted">
        <ArrowLeft className="h-4 w-4" /><span className="text-sm">Voltar</span>
      </button>
      <p className="mb-4 text-center text-xs uppercase tracking-widest text-text-label">Confirme os dados</p>
      <Card variant="glass" className="mb-6 rounded-[var(--radius-glass)] p-5">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-text-muted">Valor</p>
            <p className="text-lg font-bold text-text-primary">{formatCurrency(amount)}</p>
          </div>
          <div className="h-px bg-border" />
          <div className="flex items-center justify-between">
            <p className="text-sm text-text-muted">Destinatário</p>
            <p className="text-sm font-medium text-text-primary">{recipient}</p>
          </div>
          {description && (<><div className="h-px bg-border" /><div className="flex items-center justify-between"><p className="text-sm text-text-muted">Descrição</p><p className="text-sm text-text-secondary">{description}</p></div></>)}
          <div className="h-px bg-border" />
          <div className="flex items-center justify-between">
            <p className="text-sm text-text-muted">Moeda</p>
            <Badge variant={currency === 'BRL' ? 'default' : 'crypto'}>{currency}</Badge>
          </div>
        </div>
      </Card>
      <Button variant="primary" size="lg" className="w-full" onClick={handleConfirm} disabled={isPending}>
        {isPending ? (
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white" />
        ) : 'Confirmar Transferência'}
      </Button>
    </motion.div>
  )
}
```

- [ ] **Step 8: Create `src/features/transfer/components/success-screen.tsx`**

```tsx
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useTransferStore } from '../store'
import { formatCurrency } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const checkVariants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: { pathLength: 1, opacity: 1, transition: { duration: 0.6, ease: 'easeOut', delay: 0.2 } },
}

const particles = Array.from({ length: 12 }).map((_, i) => ({
  id: i,
  angle: (i * 30 * Math.PI) / 180,
}))

export function SuccessScreen() {
  const navigate = useNavigate()
  const { amount, recipient, reset } = useTransferStore()

  function handleDone() { reset(); navigate('/dashboard') }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center px-6 pt-16">
      <div className="relative mb-8">
        {particles.map((p) => (
          <motion.div key={p.id}
            initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 0], x: Math.cos(p.angle) * 60, y: Math.sin(p.angle) * 60, scale: [0, 1, 0] }}
            transition={{ duration: 0.8, delay: 0.3 + p.id * 0.03 }}
            className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-light"
          />
        ))}
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 15, stiffness: 200 }} className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-accent to-accent-light">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <motion.path d="M12 24L20 32L36 16" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" variants={checkVariants} initial="hidden" animate="visible" />
          </svg>
        </motion.div>
      </div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="text-center">
        <h2 className="mb-2 text-2xl font-bold text-text-primary">Transferência enviada!</h2>
        <p className="text-sm text-text-muted">{formatCurrency(amount)} enviado para {recipient}</p>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="mt-8 w-full">
        <Button variant="primary" size="lg" className="w-full" onClick={handleDone}>Voltar ao início</Button>
      </motion.div>
    </motion.div>
  )
}
```

- [ ] **Step 9: Create `src/features/transfer/components/transfer-wizard.tsx`**

```tsx
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
```

- [ ] **Step 10: Update `src/pages/transfer-page.tsx`**

```tsx
import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { TransferWizard } from '@/features/transfer/components/transfer-wizard'
import { useTransferStore } from '@/features/transfer/store'

export default function TransferPage() {
  const navigate = useNavigate()
  const reset = useTransferStore((s) => s.reset)

  useEffect(() => { return () => reset() }, [reset])

  return (
    <motion.div initial={{ opacity: 0, y: '100%' }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="min-h-screen bg-background">
      <div className="flex justify-end px-5 pt-4">
        <button onClick={() => { reset(); navigate('/dashboard') }} className="rounded-full p-2 text-text-muted transition-colors hover:bg-surface hover:text-text-primary">
          <X className="h-5 w-5" />
        </button>
      </div>
      <p className="mb-2 text-center text-base font-semibold text-text-primary">Nova Transferência</p>
      <TransferWizard />
    </motion.div>
  )
}
```

- [ ] **Step 11: Verify transfer wizard end-to-end**

Expected: FAB → slide up → Step 1 keypad → Step 2 recipient + currency chips → Step 3 confirm → Success with animated check + particles → Dashboard with updated balance.

---

### Task 9: Tests — Transfer Wizard Flow

**Files:**
- Create: `src/test/features/transfer/transfer-wizard.test.tsx`

- [ ] **Step 1: Create test file**

```tsx
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, beforeEach } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { TransferWizard } from '@/features/transfer/components/transfer-wizard'
import { useTransferStore } from '@/features/transfer/store'
import { useAuthStore } from '@/features/auth/store'
import { resetState } from '@/mocks/data/state'

function renderWizard() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  useAuthStore.setState({
    user: { id: '1', name: 'Pedro Trotta', email: 'pedro@jobz.com' },
    token: 'mock-token',
    isAuthenticated: true,
  })
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <TransferWizard />
      </MemoryRouter>
    </QueryClientProvider>
  )
}

describe('Transfer Wizard', () => {
  beforeEach(() => {
    useTransferStore.getState().reset()
    resetState()
  })

  it('completes full transfer flow: amount → recipient → confirm → success', async () => {
    const user = userEvent.setup()
    renderWizard()

    expect(screen.getByText(/quanto você quer enviar/i)).toBeInTheDocument()
    await user.click(screen.getByText('1'))
    await user.click(screen.getByText('0'))
    await user.click(screen.getByText('0'))
    await user.click(screen.getByRole('button', { name: /continuar/i }))

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/nome ou chave pix/i)).toBeInTheDocument()
    })
    await user.type(screen.getByPlaceholderText(/nome ou chave pix/i), 'João Silva')
    await user.click(screen.getByRole('button', { name: /continuar/i }))

    await waitFor(() => {
      expect(screen.getByText(/confirme os dados/i)).toBeInTheDocument()
    })
    expect(screen.getByText('João Silva')).toBeInTheDocument()
    expect(screen.getByText(/R\$ 100,00/)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /confirmar transferência/i }))

    await waitFor(() => {
      expect(screen.getByText(/transferência enviada/i)).toBeInTheDocument()
    })
    expect(screen.getByText(/R\$ 100,00 enviado para João Silva/)).toBeInTheDocument()
  })

  it('prevents transfer with zero amount', async () => {
    const user = userEvent.setup()
    renderWizard()
    const continueBtn = screen.getByRole('button', { name: /continuar/i })
    expect(continueBtn).toBeDisabled()
    await user.click(screen.getByText('0'))
    expect(continueBtn).toBeDisabled()
  })

  it('prevents transfer exceeding balance', async () => {
    const user = userEvent.setup()
    renderWizard()
    await waitFor(() => { expect(screen.getByText(/disponível/i)).toBeInTheDocument() })
    await user.click(screen.getByText('9'))
    await user.click(screen.getByText('9'))
    await user.click(screen.getByText('9'))
    await user.click(screen.getByText('9'))
    await user.click(screen.getByText('9'))
    const continueBtn = screen.getByRole('button', { name: /continuar/i })
    expect(continueBtn).toBeDisabled()
  })

  it('validates recipient requires minimum 3 characters', async () => {
    const user = userEvent.setup()
    renderWizard()
    await user.click(screen.getByText('5'))
    await user.click(screen.getByText('0'))
    await user.click(screen.getByRole('button', { name: /continuar/i }))
    await waitFor(() => { expect(screen.getByPlaceholderText(/nome ou chave pix/i)).toBeInTheDocument() })
    await user.type(screen.getByPlaceholderText(/nome ou chave pix/i), 'AB')
    await user.click(screen.getByRole('button', { name: /continuar/i }))
    await waitFor(() => { expect(screen.getByText(/pelo menos 3 caracteres/i)).toBeInTheDocument() })
  })
})
```

- [ ] **Step 2: Add test scripts to `package.json`**

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

- [ ] **Step 3: Run tests**

```bash
pnpm test
```

Expected: All 4 tests pass.

---

### Task 10: README & Deploy

**Files:**
- Create: `README.md`
- Modify: `.gitignore`

- [ ] **Step 1: Ensure `.gitignore` includes**

```
node_modules
dist
.superpowers
*.local
.env
.env.*
```

- [ ] **Step 2: Create `README.md`**

See spec section "Delivery" for full content. Must include:

- Title: **jobZ Banking**
- Context about Onda Finance (global payments, crypto + fiat)
- Demo link placeholder
- Credentials: `pedro@jobz.com` / `123456`
- How to run: `pnpm install && pnpm dev` / `pnpm test` / `pnpm build`
- Stack table with all 12 technologies and their usage
- Technical decisions section covering: Feature-based architecture, MSW as mock layer, CVA for component variants, Zustand with persist, Mobile-first container, Dark premium design system
- Security section (theoretical): Reverse engineering (Terser, source maps disabled, env vars server-side, cert pinning, WASM, SRI) + Data leak prevention (HTTPS/HSTS, httpOnly cookies, XSS prevention, CSP, TLS 1.3/AES-256, token rotation, PII-free logging)
- Future improvements: biometrics, push notifications, dark/light toggle, i18n, Web3 wallets, multi-currency, analytics, WCAG audit
- Author: Pedro Trotta — trotta.dev

- [ ] **Step 3: Build and deploy**

```bash
pnpm build
pnpm dlx vercel --prod
```

Update README demo link with actual Vercel URL.
