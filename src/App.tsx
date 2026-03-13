import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/lib/auth'
import AppLayout from '@/components/layout/AppLayout'
import LoginPage from '@/pages/LoginPage'
import DashboardPage from '@/pages/DashboardPage'
import ProgramPage from '@/pages/ProgramPage'
import ProgressPage from '@/pages/ProgressPage'
import ProfilePage from '@/pages/ProfilePage'
import WorkoutPage from '@/pages/WorkoutPage'
import { Loader2 } from 'lucide-react'

function ProtectedRoutes() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    )
  }

  if (!user) {
    return <LoginPage />
  }

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/program" element={<ProgramPage />} />
        <Route path="/progress" element={<ProgressPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>
      <Route path="/workout/:workoutId" element={<WorkoutPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ProtectedRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
