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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const apiError = (error as any)?.response?.data?.message as string | undefined

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
            ) : 'Entrar'}
          </Button>
        </div>
        <p className="mt-4 text-center text-xs text-text-muted">Esqueceu a senha?</p>
      </motion.form>

      <div className="mt-6 flex items-center justify-center gap-4">
        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.5, duration: 0.4 }} className="h-[3px] w-10 rounded-full bg-accent" />
        <div className="h-[3px] w-10 rounded-full bg-surface" />
        <div className="h-[3px] w-10 rounded-full bg-surface" />
      </div>
    </motion.div>
  )
}
