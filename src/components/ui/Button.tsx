import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'glow'
  size?: 'sm' | 'md' | 'lg' | 'icon'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-heading font-semibold uppercase tracking-wider transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:scale-95',
          {
            'bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_16px_rgba(0,229,255,0.3)]':
              variant === 'primary',
            'bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border':
              variant === 'secondary',
            'hover:bg-primary/10 hover:text-primary':
              variant === 'ghost',
            'border border-primary/30 bg-transparent text-primary hover:bg-primary/10':
              variant === 'outline',
            'bg-primary/5 border border-primary/30 text-primary shadow-[0_0_20px_rgba(0,229,255,0.1)] hover:shadow-[0_0_30px_rgba(0,229,255,0.25)] hover:bg-primary/10 backdrop-blur-md':
              variant === 'glow',

            'h-9 px-4 py-2 text-xs': size === 'sm',
            'h-11 px-6 py-2': size === 'md',
            'h-14 px-8 py-3 text-base': size === 'lg',
            'size-11': size === 'icon',
          },
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button }
