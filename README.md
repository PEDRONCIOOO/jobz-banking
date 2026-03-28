# jobZ Banking

Aplicação web mobile-first simulando um app bancário digital, construída como desafio técnico para a **Onda Finance** — fintech focada em pagamentos globais com cripto e moedas fiduciárias de forma rápida, segura e sem complicações.

## Demo

🔗 [Acesse a aplicação](https://jobz-banking.vercel.app)

**Credenciais de teste:**
- Email: `pedro@jobz.com`
- Senha: `123456`

## Como Rodar

```bash
# Instalar dependências
pnpm install

# Rodar em modo de desenvolvimento
pnpm dev

# Rodar testes
pnpm test

# Build de produção
pnpm build
```

## Stack

| Tecnologia | Uso |
|------------|-----|
| React + TypeScript | UI library + type safety |
| Vite | Build tool + dev server |
| Tailwind CSS + CVA | Styling + component variants |
| shadcn/ui + Radix | Component primitives acessíveis |
| React Router | Navegação SPA |
| React Query | Server state + cache |
| Zustand | Client state (auth + wizard) |
| React Hook Form + Zod | Formulários + validação |
| Axios | HTTP client |
| Framer Motion | Micro-animações |
| MSW | Mock API layer |
| Vitest | Testes unitários/integração |

## Decisões Técnicas

### Arquitetura Feature-Based
Organização por domínio (`auth/`, `dashboard/`, `transfer/`) em vez de por tipo técnico (`components/`, `hooks/`). Cada feature encapsula seus próprios componentes, hooks, schemas e stores. Pages são composições finas.

### MSW como Mock Layer
Em vez de funções que retornam Promises fake, optei por **Mock Service Worker** interceptando chamadas Axios reais. Isso significa que React Query, Axios e os interceptors funcionam de verdade — idêntico a um ambiente com backend real. A migração para um backend real requer apenas remover o MSW.

### CVA para Component Variants
Class Variance Authority permite definir variantes tipadas para componentes (Button: primary/secondary/ghost/danger, Input: default/error/success, Card: glass/solid/elevated, Badge: income/expense/crypto). Composição com Tailwind via `cn()`.

### Zustand com Persist
Auth store usa `persist` middleware para manter sessão no `localStorage`. Transfer store é efêmero — reseta ao sair do wizard. Separação clara entre estado que persiste e estado temporário.

### Mobile-First com Container Fixo
Toda a aplicação vive dentro de `max-w-[430px]` centralizado, simulando viewport mobile. Em desktop, o background escuro enquadra o "device". Todas as decisões de layout são mobile-first.

### Dark Premium Design System
Tema escuro com glassmorphism, gradientes roxo/violeta e micro-animações. Tokens de design definidos como CSS custom properties integradas ao Tailwind. Inspiração: Nubank dark mode, Revolut.

## Segurança

> Seção teórica — não implementada neste desafio.

### Proteção contra Engenharia Reversa

- **Code Obfuscation:** Terser com mangling agressivo no build de produção, removendo nomes de variáveis legíveis e estruturas reconhecíveis
- **Source Maps:** Desabilitados em produção (`build.sourcemap: false` no Vite config), impedindo reconstrução do código original
- **Environment Variables:** Secrets armazenados server-side only via variáveis de ambiente do runtime (nunca compilados no bundle client-side)
- **Certificate Pinning:** Em variantes mobile nativas (React Native), implementar pinning de certificados SSL para prevenir MITM
- **WASM para Lógica Sensível:** Lógica de criptografia e validação de tokens compilada para WebAssembly, dificultando engenharia reversa comparado a JavaScript puro
- **Integrity Checks:** Subresource Integrity (SRI) nos assets para detectar tampering

### Proteção contra Vazamento de Dados

- **HTTPS Everywhere:** Forçar HTTPS com HSTS headers (`Strict-Transport-Security: max-age=31536000; includeSubDomains`)
- **Token Storage:** Em produção, tokens JWT armazenados em cookies `httpOnly` + `Secure` + `SameSite=Strict` (nunca em localStorage acessível via JavaScript)
- **XSS Prevention:** Sanitização de inputs com DOMPurify, Content Security Policy headers restritivos (`script-src 'self'`), uso de React que escapa conteúdo por padrão
- **Criptografia:** TLS 1.3 para dados em trânsito, AES-256-GCM para dados em repouso no servidor
- **Token Lifecycle:** Access tokens com expiração curta (15min) + refresh token rotation. Revogação server-side via blacklist em Redis
- **Logging Seguro:** Zero PII nos logs de aplicação. Dados sensíveis mascarados (ex: `****5678` para números de conta). Audit trail separado com acesso restrito

## Melhorias Futuras

- Autenticação biométrica (fingerprint/face)
- Notificações push para transações
- Toggle dark/light mode
- Internacionalização (i18n) — PT-BR, EN, ES
- Integração real com cripto via Web3 wallets (MetaMask, WalletConnect)
- Contas multi-moeda com engine de câmbio em tempo real
- Dashboard de analytics com gráficos de gastos
- Auditoria de acessibilidade (WCAG 2.1 AA)

## Autor

**Pedro Trotta** — [trotta.dev](https://trotta.dev)
