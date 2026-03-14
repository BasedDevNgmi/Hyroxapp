import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glow' | 'glass' | 'outline'
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-2xl border transition-all duration-300',
          {
            'bg-card border-border shadow-md': variant === 'default',
            'bg-card border-primary/30 shadow-[0_0_15px_rgba(250,204,21,0.1)]': variant === 'glow',
            'bg-black/40 backdrop-blur-md border-white/5': variant === 'glass',
            'bg-transparent border-border': variant === 'outline',
          },
          className
        )}
        {...props}
      />
    )
  }
)
Card.displayName = 'Card'

export { Card }
