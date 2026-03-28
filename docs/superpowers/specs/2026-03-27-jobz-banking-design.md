# JobZ Banking — Design Spec

## Overview

Mobile-first banking app built for the Onda Finance front-end challenge via JobZ Talentos. The app simulates a digital bank with login, dashboard, and transfer features using mock data via MSW. Brand name: **jobZ Banking**.

**Context:** Onda Finance is a fintech focused on global payments — international transfers with crypto and fiat currencies, fast, secure, and frictionless. The app reflects this DNA: multi-currency awareness, global transfer feel, and a modern fintech aesthetic that goes beyond traditional banking.

**Stack:** React 19, TypeScript, Vite, Tailwind CSS v4 + CVA, shadcn/ui + Radix, React Router, React Query, Zustand, React Hook Form + Zod, Axios, Framer Motion, MSW, Vitest.

## Visual Identity

- **Theme:** Dark Premium — deep dark background, glassmorphism, purple/violet gradients
- **Palette:**
  - Background: `#0a0a0f`
  - Surface: `rgba(255,255,255,0.04)` with `border: 1px solid rgba(255,255,255,0.08)`
  - Accent gradient: `linear-gradient(135deg, #6c5ce7, #a855f7)`
  - Text primary: `#ffffff`, secondary: `rgba(255,255,255,0.6)`, muted: `rgba(255,255,255,0.3)`
  - Success: `#10b981`, Error: `#ef4444`, Warning: `#f59e0b`
- **Typography:** Inter (Google Fonts)
  - Balance: `text-3xl font-bold tracking-tight`
  - Labels: `text-xs uppercase tracking-widest`
  - Body: `text-sm`
- **Borders:** 12px inputs, 16px cards, 24px glass cards, full for avatars/FAB
- **Glass effect:** surface bg + border + `backdrop-filter: blur(20px)`
- **Shadows:** FAB only — `box-shadow: 0 4px 20px rgba(108,92,231,0.4)`
- **Mobile container:** `max-w-[430px] mx-auto` — simulates phone viewport. On desktop, dark bg with centered "device".

## Architecture

### Project Structure

```
src/
├── app/
│   ├── App.tsx              # Router + providers
│   ├── providers.tsx        # QueryClient, theme
│   └── router.tsx           # React Router config
├── components/
│   ├── ui/                  # shadcn/ui (auto-generated)
│   └── shared/              # BottomNav, FAB, PageTransition, BalanceCard
├── features/
│   ├── auth/
│   │   ├── components/      # LoginForm, HeroSection
│   │   ├── hooks/           # useAuth, useSession
│   │   ├── schemas/         # loginSchema (Zod)
│   │   └── store.ts         # Zustand auth store
│   ├── dashboard/
│   │   ├── components/      # BalanceCard, TransactionList, QuickActions
│   │   └── hooks/           # useBalance, useTransactions
│   └── transfer/
│       ├── components/      # AmountStep, RecipientStep, ConfirmStep, Wizard
│       ├── hooks/           # useTransfer
│       ├── schemas/         # transferSchema (Zod)
│       └── store.ts         # Zustand wizard state
├── lib/
│   ├── axios.ts             # Axios instance + interceptors
│   ├── utils.ts             # cn(), formatCurrency
│   └── constants.ts         # API URLs, config
├── mocks/
│   ├── browser.ts           # MSW browser worker setup
│   ├── handlers/            # auth.ts, transactions.ts, transfer.ts
│   └── data/                # users.ts, transactions.ts (datasets)
├── pages/
│   ├── LoginPage.tsx
│   ├── DashboardPage.tsx
│   └── TransferPage.tsx
├── styles/
│   └── globals.css          # Tailwind + custom dark theme tokens
└── test/
    └── setup.ts             # Vitest + MSW server setup
```

Feature-based organization. Pages are thin compositions. Each feature owns its hooks, schemas, and store.

### CVA (Class Variance Authority)

Used explicitly for custom component variants beyond shadcn/ui defaults:

- **Button variants:** `primary` (gradient), `secondary` (surface), `ghost` (transparent), `danger` (red) — with `size` variants (sm, md, lg)
- **Input variants:** `default`, `error` (red border + shake), `success` (green border)
- **Card variants:** `glass` (glassmorphism), `solid` (opaque surface), `elevated` (with shadow)
- **Badge variants:** `income` (green), `expense` (red), `crypto` (cyan), `pending` (yellow)
- **NavItem variants:** `active` (accent color + pill), `inactive` (muted)

All variant definitions live in their respective component files using `cva()` and are composed with Tailwind classes via `cn()`.

### Data Layer

**MSW Endpoints:**

| Method | Path | Description |
|--------|------|-------------|
| POST | /api/auth/login | Validate credentials, return `{ token, user }` |
| POST | /api/auth/logout | Clear session |
| GET | /api/account | Return `{ balance, accountNumber, user }` |
| GET | /api/transactions | Paginated list (page, limit) |
| POST | /api/transfer | Validate, deduct balance, create transaction |

All handlers include `delay(500)` for realistic loading states.

**Zustand Stores:**

- `authStore`: `user`, `token`, `isAuthenticated`, `login()`, `logout()`. Persist middleware with localStorage key `jobz-auth`.
- `transferStore`: `currentStep` (1-3), `amount`, `recipient`, `description`, `nextStep()`, `prevStep()`, `reset()`. No persist — resets on exit.

**React Query Hooks:**

- `useBalance()` → `GET /api/account`
- `useTransactions(page)` → `useInfiniteQuery` on `GET /api/transactions`
- `useTransfer()` → mutation `POST /api/transfer`, `onSuccess` invalidates balance + transactions

**Axios Instance:**

- `baseURL: '/api'`
- Request interceptor: inject token from authStore
- Response interceptor: 401 → `authStore.logout()` + redirect `/login`

### Mock Data

- **users.ts:** 1 user — `pedro@jobz.com` / `123456`
- **transactions.ts:** ~20 varied transactions mixing local and global payments (Pix, Netflix, Salario, iFood, Uber, Wire Transfer USD, USDT Received, Remessa Internacional, etc.) with recent dates, realistic BRL values, currency indicators, categories, types (income/expense)

## Screens & Flows

### Login (`/login`)

- **Layout:** Hero headline "Seu dinheiro, **sem fronteiras.**" top-aligned + form inside glass card below
- **Fields:** Email + Password (React Hook Form + Zod validation)
- **Auth:** MSW validates against mock users
- **Session:** Zustand persist to localStorage
- **Animations (framer-motion):**
  - Headline: `fadeIn` + `slideX` from left, stagger 0.1s per line
  - Glass card: `slideY` from bottom, spring (damping: 20, stiffness: 100)
  - Button: hover scale + gradient shimmer
  - Error: horizontal `shake` on form
- **Redirect:** After login → `/dashboard` with `AnimatePresence` exit/enter

### Dashboard (`/dashboard`)

- **Header:** "Ola, **Pedro**" + avatar (initials) top-right
- **Balance Card:** Glass card with primary balance (BRL) + secondary line showing equivalent in USD and USDT (mock rates), eye icon toggle for show/hide (animated blur + scale)
- **Quick Actions:** 3 buttons row (Transferir, Global, Extrato) — "Global" is visual-only placeholder hinting at international transfers, Extrato scrolls to list
- **Transaction List:** Mock transactions with:
  - Avatar (initial + category-based color)
  - Name, date, amount (green positive, red negative)
  - Simulated infinite scroll via `useInfiniteQuery`
- **Animations:**
  - Balance card: `fadeIn` + `scale` on mount
  - Transactions: staggered `slideY` (0.05s delay per item)
  - Balance hide/show: `blur` + `scale` transition

### Transfer (FAB → `/transfer`)

- **Entry:** FAB click → page opens with `layoutId` transition (circle expands to full screen)
- **Step 1 — Amount:** Large centered input, custom numeric keypad, available balance shown
- **Step 2 — Recipient:** Name/Pix key field + optional description, currency selector chip (BRL, USD, USDT — visual, transfers always in BRL for simplicity), recent contacts (mock)
- **Step 3 — Confirmation:** Summary of all data, "Confirmar" button
- **Progress bar:** 3 animated segments at top, gradient fill as user advances
- **Zod validation:** amount > 0 and <= balance, recipient required (min 3 chars)
- **Success screen:** Animated check icon (framer-motion draw), balance updates via `invalidateQueries`
- **Animations:**
  - Steps: horizontal `slideX` (next = left, back = right)
  - Numeric keypad: tap `scale` feedback
  - Success: check draw animation + particle burst

### Bottom Navigation

- **Tabs:** Home, Extrato, [FAB], Cartoes, Perfil
- **FAB:** Purple gradient, glow shadow, hover `scale(1.1)`, tap `scale(0.95)`
- **Active indicator:** Animated pill via `layoutId` sliding between tabs
- **Cartoes & Perfil:** Placeholder screens with "Em breve" message

## Route Protection

- `PrivateRoute` wrapper checks `authStore.isAuthenticated`
- Unauthenticated → redirect to `/login`
- Already authenticated on `/login` → redirect to `/dashboard`

## Tests (Vitest)

**Flow tested: Transfer Wizard (complete)**

1. Render step 1, fill amount, advance
2. Render step 2, fill recipient, advance
3. Render step 3, verify summary, confirm
4. Assert balance updates after transfer
5. Test Zod validations (amount 0, amount > balance, empty recipient)

Covers React Hook Form + Zod + Zustand + React Query mutation + MSW in a single flow.

Setup: MSW `setupServer` in `test/setup.ts` with same handlers as browser.

## Security (README section — not implemented)

### Reverse Engineering Protection

- Code obfuscation via Terser in production builds
- Source maps disabled in production
- Environment variables server-side only
- Certificate pinning for native mobile variants
- WASM for sensitive cryptographic logic

### Data Leak Prevention

- HTTPS everywhere + HSTS headers
- Tokens in httpOnly cookies (not localStorage in production)
- Input sanitization against XSS
- Restrictive CSP headers
- TLS 1.3 in transit, AES-256 at rest
- Short-lived tokens + refresh token rotation
- PII-free logging

## Delivery

- **Deploy:** Vercel (zero-config for Vite SPA)
- **Repository:** GitHub with README containing:
  - How to run (`pnpm install && pnpm dev`)
  - Technical decisions (why MSW, why feature-based, etc.)
  - Future improvements (biometrics, push notifications, dark/light toggle, i18n, real crypto integration via Web3 wallets, multi-currency accounts, exchange rate engine)
