import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outline'
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-xl transition-colors',
          {
            'bg-card': variant === 'default',
            'bg-transparent border border-border': variant === 'outline',
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
