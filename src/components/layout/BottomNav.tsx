import { NavLink } from 'react-router-dom'
import { Dumbbell, Calendar, BarChart2, User } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { to: '/', icon: Dumbbell, label: 'Library' },
  { to: '/program', icon: Calendar, label: 'Schedule' },
  { to: '/progress', icon: BarChart2, label: 'Progress' },
  { to: '/profile', icon: User, label: 'Profile' },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#1a1914]/95 backdrop-blur-xl border-t border-[#3f3b2f]">
      <div className="max-w-lg mx-auto flex items-center justify-around h-[80px] px-2 pb-1">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center gap-1 min-w-[64px] transition-all duration-300',
                isActive
                  ? 'text-primary scale-105'
                  : 'text-muted-foreground hover:text-foreground'
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={cn('w-6 h-6 transition-all duration-300', isActive && 'drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]')} />
                <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
      {/* Safe area spacer for iOS */}
      <div className="h-[env(safe-area-inset-bottom)] bg-[#1a1914]" />
    </nav>
  )
}
