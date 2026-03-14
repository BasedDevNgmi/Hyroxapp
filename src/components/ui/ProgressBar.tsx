import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> {
  progress: number // 0 to 100
  height?: 'sm' | 'md' | 'lg'
  indicatorColor?: string
  activeColor?: string
  trackColor?: string
}

const ProgressBar = forwardRef<HTMLDivElement, ProgressBarProps>(
  ({ className, progress, height = 'md', indicatorColor = 'bg-primary', activeColor, trackColor = 'bg-secondary', ...props }, ref) => {
    
    // Use activeColor if provided, otherwise fallback to indicatorColor
    const resolvedIndicatorColor = activeColor || indicatorColor;
    const heightClass = {
      sm: 'h-1.5',
      md: 'h-2.5',
      lg: 'h-4',
    }[height]

    return (
      <div
        ref={ref}
        className={cn(
          'w-full overflow-hidden rounded-full',
          trackColor,
          heightClass,
          className
        )}
        {...props}
      >
        <div
          className={cn(
            'h-full w-full flex-1 transition-all duration-500 ease-out',
            resolvedIndicatorColor
          )}
          style={{ transform: `translateX(-${100 - progress}%)` }}
        />
      </div>
    )
  }
)
ProgressBar.displayName = 'ProgressBar'

export { ProgressBar }
