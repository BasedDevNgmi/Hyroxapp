import { NavLink } from 'react-router-dom'
import { CalendarCheck, Layers, BarChart3, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { to: '/', icon: CalendarCheck, label: 'Today' },
  { to: '/program', icon: Layers, label: 'Program' },
  { to: '/progress', icon: BarChart3, label: 'Stats' },
  { to: '/profile', icon: Settings, label: 'Settings' },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-2xl border-t border-border/50">
      <div className="max-w-lg mx-auto flex items-center justify-around h-16 px-2">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center gap-0.5 min-w-[60px] py-1.5 transition-colors duration-150',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground'
              )
            }
          >
            <item.icon className="w-[22px] h-[22px]" strokeWidth={1.8} />
            <span className="text-[10px] font-medium tracking-wide">{item.label}</span>
          </NavLink>
        ))}
      </div>
      <div className="h-[env(safe-area-inset-bottom)] bg-background" />
    </nav>
  )
}
