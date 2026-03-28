import { Outlet } from 'react-router-dom'
import BottomNav from './BottomNav'

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-background grid-bg relative scanlines">
      <main className="max-w-lg mx-auto px-4 pb-24 pt-6 relative z-10">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
