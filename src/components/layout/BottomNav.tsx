import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Calendar, TrendingUp, User } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Today' },
  { to: '/program', icon: Calendar, label: 'Program' },
  { to: '/progress', icon: TrendingUp, label: 'Progress' },
  { to: '/profile', icon: User, label: 'Profile' },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-t border-border">
      <div className="max-w-lg mx-auto flex items-center justify-around h-16 px-2">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={cn('w-5 h-5', isActive && 'stroke-[2.5px]')} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
      {/* Safe area spacer for iOS */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  )
}
