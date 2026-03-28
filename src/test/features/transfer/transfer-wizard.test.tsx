import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { TransferWizard } from '@/features/transfer/components/transfer-wizard'
import { useTransferStore } from '@/features/transfer/store'
import { useAuthStore } from '@/features/auth/store'
import { resetState } from '@/mocks/data/state'

// Strip framer-motion-specific props before forwarding to DOM elements
const FRAMER_PROPS = new Set([
  'initial', 'animate', 'exit', 'whileHover', 'whileTap', 'whileFocus', 'whileDrag',
  'whileInView', 'variants', 'transition', 'layoutId', 'layout', 'drag', 'dragConstraints',
  'dragElastic', 'onDragStart', 'onDragEnd', 'onAnimationStart', 'onAnimationComplete',
  'viewport', 'custom', 'inherit', 'transformTemplate', 'transformValues', 'style',
])

function filterProps(props: any) {
  const filtered: any = {}
  for (const key of Object.keys(props)) {
    if (!FRAMER_PROPS.has(key)) filtered[key] = props[key]
  }
  return filtered
}

vi.mock('framer-motion', async () => {
  return {
    AnimatePresence: ({ children }: any) => <>{children}</>,
    motion: {
      div: ({ children, ...props }: any) => <div {...filterProps(props)}>{children}</div>,
      button: ({ children, ...props }: any) => <button {...filterProps(props)}>{children}</button>,
      span: ({ children, ...props }: any) => <span {...filterProps(props)}>{children}</span>,
      path: ({ children, ...props }: any) => <path {...filterProps(props)}>{children}</path>,
      form: ({ children, ...props }: any) => <form {...filterProps(props)}>{children}</form>,
      p: ({ children, ...props }: any) => <p {...filterProps(props)}>{children}</p>,
    },
    useAnimation: () => ({ start: vi.fn(), stop: vi.fn(), set: vi.fn() }),
    useMotionValue: (initial: any) => ({ get: () => initial, set: vi.fn(), onChange: vi.fn() }),
    useTransform: () => ({ get: vi.fn(), set: vi.fn() }),
    useSpring: (initial: any) => ({ get: () => initial, set: vi.fn() }),
    useScroll: () => ({ scrollY: { get: vi.fn() }, scrollX: { get: vi.fn() } }),
    useInView: () => false,
  }
})

function renderWizard() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  })
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

    // Wait for the amount step to be visible with balance loaded
    await waitFor(() => {
      expect(screen.getByText(/quanto você quer enviar/i)).toBeInTheDocument()
    }, { timeout: 3000 })

    // Wait for balance to load (the available balance text shows when balance > 0)
    await waitFor(() => {
      expect(screen.getByText(/R\$ 12\.450,00/)).toBeInTheDocument()
    }, { timeout: 3000 })

    await user.click(screen.getByText('1'))
    await user.click(screen.getByText('0'))
    await user.click(screen.getByText('0'))

    // Wait for the continue button to be enabled
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /continuar/i })).not.toBeDisabled()
    }, { timeout: 3000 })

    await user.click(screen.getByRole('button', { name: /continuar/i }))

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/nome ou chave pix/i)).toBeInTheDocument()
    }, { timeout: 3000 })
    await user.type(screen.getByPlaceholderText(/nome ou chave pix/i), 'João Silva')
    await user.click(screen.getByRole('button', { name: /continuar/i }))

    await waitFor(() => {
      expect(screen.getByText(/confirme os dados/i)).toBeInTheDocument()
    }, { timeout: 3000 })
    expect(screen.getByText('João Silva')).toBeInTheDocument()
    expect(screen.getByText(/R\$ 100,00/)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /confirmar transferência/i }))

    await waitFor(() => {
      expect(screen.getByText(/transferência enviada/i)).toBeInTheDocument()
    }, { timeout: 3000 })
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
    // Wait for balance to load
    await waitFor(() => {
      expect(screen.getByText(/disponível/i)).toBeInTheDocument()
    }, { timeout: 3000 })
    await waitFor(() => {
      expect(screen.getByText(/R\$ 12\.450,00/)).toBeInTheDocument()
    }, { timeout: 3000 })
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

    // Wait for balance to load before typing amount
    await waitFor(() => {
      expect(screen.getByText(/R\$ 12\.450,00/)).toBeInTheDocument()
    }, { timeout: 3000 })

    await user.click(screen.getByText('5'))
    await user.click(screen.getByText('0'))

    // Wait for the continue button to be enabled
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /continuar/i })).not.toBeDisabled()
    }, { timeout: 3000 })

    await user.click(screen.getByRole('button', { name: /continuar/i }))
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/nome ou chave pix/i)).toBeInTheDocument()
    }, { timeout: 3000 })
    await user.type(screen.getByPlaceholderText(/nome ou chave pix/i), 'AB')
    await user.click(screen.getByRole('button', { name: /continuar/i }))
    await waitFor(() => {
      expect(screen.getByText(/pelo menos 3 caracteres/i)).toBeInTheDocument()
    }, { timeout: 3000 })
  })
})
