import { NavLink } from 'react-router-dom'
import { Crosshair, Calendar, BarChart2, User } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { to: '/', icon: Crosshair, label: 'HQ' },
  { to: '/program', icon: Calendar, label: 'Protocol' },
  { to: '/progress', icon: BarChart2, label: 'Data' },
  { to: '/profile', icon: User, label: 'Config' },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-primary/20 bg-[#060a10]/95 backdrop-blur-xl">
      <div className="max-w-lg mx-auto flex items-center justify-around h-[72px] px-2">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center gap-1 min-w-[64px] py-2 transition-all duration-200',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )
            }
          >
            {({ isActive }) => (
              <>
                <div className={cn(
                  'relative p-1.5 rounded transition-all duration-200',
                  isActive && 'bg-primary/10'
                )}>
                  <item.icon className={cn(
                    'w-5 h-5 transition-all duration-200',
                    isActive && 'drop-shadow-[0_0_6px_rgba(0,229,255,0.6)]'
                  )} />
                  {isActive && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary shadow-[0_0_4px_rgba(0,229,255,0.8)]" />
                  )}
                </div>
                <span className="text-[9px] font-mono font-bold uppercase tracking-[0.15em]">
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
      <div className="h-[env(safe-area-inset-bottom)] bg-[#060a10]" />
    </nav>
  )
}
