import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 text-[8px] tracking-[0.25em] uppercase font-normal transition-colors',
  {
    variants: {
      variant: {
        default: 'text-ku-gold',
        outline: 'border border-white/10 px-2.5 py-1 text-ku-cream/60',
        live:    'bg-red-600/70 text-white px-2.5 py-1',
        surface: 'bg-white/[0.06] text-ku-cream/50 px-2.5 py-1',
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
