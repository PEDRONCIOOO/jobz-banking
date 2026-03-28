import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const inputVariants = cva(
  'flex h-11 w-full rounded-[var(--radius-input)] px-4 py-2 text-sm text-text-primary placeholder:text-text-muted transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-surface border border-border focus:border-border-focus focus:ring-2 focus:ring-accent/20',
        error: 'bg-surface border border-error/50 focus:border-error focus:ring-2 focus:ring-error/20',
        success: 'bg-surface border border-success/50 focus:border-success focus:ring-2 focus:ring-success/20',
      },
    },
    defaultVariants: { variant: 'default' },
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
