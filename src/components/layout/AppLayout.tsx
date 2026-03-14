import { Outlet } from 'react-router-dom'
import BottomNav from './BottomNav'

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-lg mx-auto px-5 pb-28 pt-8">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
