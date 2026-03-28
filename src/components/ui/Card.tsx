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
          'rounded-lg border transition-all duration-300',
          {
            'bg-card border-border': variant === 'default',
            'bg-card border-primary/30 neon-border': variant === 'glow',
            'bg-[#060a10]/60 backdrop-blur-md border-primary/10': variant === 'glass',
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
