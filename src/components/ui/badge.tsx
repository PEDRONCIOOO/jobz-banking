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
    defaultVariants: { variant: 'default' },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
