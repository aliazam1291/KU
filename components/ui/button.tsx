import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2.5 whitespace-nowrap text-[10px] font-medium tracking-[0.18em] uppercase transition-all duration-300 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:  'bg-ku-cream text-ku-bg hover:bg-ku-gold hover:text-white',
        outline:  'border border-white/10 text-ku-cream hover:border-ku-gold hover:text-ku-gold',
        gold:     'bg-ku-gold text-white hover:bg-ku-cream hover:text-ku-bg',
        ghost:    'text-ku-cream/60 hover:text-ku-cream',
        accent:   'bg-ku-accent text-white hover:opacity-90',
        light:    'bg-[#0a0a0a] text-ku-cream hover:bg-ku-gold hover:text-white',
      },
      size: {
        default: 'h-11 px-7 py-3',
        sm:      'h-9 px-5',
        lg:      'h-14 px-10 text-[11px]',
        icon:    'h-10 w-10',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
