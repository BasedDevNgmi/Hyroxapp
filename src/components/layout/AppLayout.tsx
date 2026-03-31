import { Outlet } from 'react-router-dom'
import BottomNav from './BottomNav'

export default function AppLayout() {
  return (
    <div className="min-h-full bg-background">
      <main className="max-w-lg mx-auto px-5 pb-24 pt-6">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
