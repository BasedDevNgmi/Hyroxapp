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
          'inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:scale-95',
          {
            // Variants
            'bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_4px_14px_0_rgba(250,204,21,0.39)]':
              variant === 'primary',
            'bg-secondary text-secondary-foreground hover:bg-secondary/80':
              variant === 'secondary',
            'hover:bg-accent hover:text-accent-foreground':
              variant === 'ghost',
            'border border-input bg-background hover:bg-accent hover:text-accent-foreground':
              variant === 'outline',
            'bg-black/40 border border-primary/50 text-primary shadow-[0_0_15px_rgba(250,204,21,0.15)] hover:shadow-[0_0_25px_rgba(250,204,21,0.3)] hover:bg-primary/10 backdrop-blur-md':
              variant === 'glow',
              
            // Sizes
            'h-9 px-4 py-2': size === 'sm',
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
