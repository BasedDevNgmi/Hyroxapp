import { useState } from 'react'
import { useAuth } from '@/lib/auth'
import { useProfile } from '@/hooks/useProfile'
import { useWorkoutLogs } from '@/hooks/useWorkoutLog'
import {
  LogOut,
  Calendar,
  Loader2,
  Download,
  Dumbbell,
  Check,
} from 'lucide-react'
import { format } from 'date-fns'

export default function ProfilePage() {
  const { user, signOut } = useAuth()
  const { profile, loading, updateProfile } = useProfile()
  const { logs } = useWorkoutLogs()
  const [startDate, setStartDate] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSetStartDate = async () => {
    if (!startDate) return
    setSaving(true)
    await updateProfile({ program_start_date: startDate })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleExportData = () => {
    const data = {
      profile,
      workout_logs: logs,
      exported_at: new Date().toISOString(),
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `hyrox-data-${format(new Date(), 'yyyy-MM-dd')}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-sm text-muted-foreground mt-1">{user?.email}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-card rounded-xl p-3 border border-border text-center">
          <p className="text-2xl font-bold text-primary">{logs.length}</p>
          <p className="text-[10px] text-muted-foreground uppercase mt-1">Workouts</p>
        </div>
        <div className="bg-card rounded-xl p-3 border border-border text-center">
          <p className="text-2xl font-bold">
            {logs.reduce((sum, l) => sum + (l.duration_minutes || 0), 0)}
          </p>
          <p className="text-[10px] text-muted-foreground uppercase mt-1">Minutes</p>
        </div>
        <div className="bg-card rounded-xl p-3 border border-border text-center">
          <p className="text-2xl font-bold">
            {logs.length > 0
              ? (logs.reduce((sum, l) => sum + (l.knee_pain_level || 0), 0) / logs.length).toFixed(1)
              : '—'
            }
          </p>
          <p className="text-[10px] text-muted-foreground uppercase mt-1">Avg Knee</p>
        </div>
      </div>

      {/* Program Start Date */}
      <div className="bg-card rounded-2xl p-4 border border-border space-y-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">Program Start Date</span>
        </div>

        {profile?.program_start_date && (
          <p className="text-sm text-muted-foreground">
            Current: {format(new Date(profile.program_start_date), 'MMMM d, yyyy')}
          </p>
        )}

        <div className="flex gap-2">
          <input
            type="date"
            value={startDate || profile?.program_start_date || ''}
            onChange={e => setStartDate(e.target.value)}
            className="flex-1 h-10 px-3 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <button
            onClick={handleSetStartDate}
            disabled={saving}
            className="px-4 h-10 bg-primary text-primary-foreground rounded-lg text-sm font-medium flex items-center gap-1 disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : saved ? (
              <Check className="w-4 h-4" />
            ) : (
              'Save'
            )}
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-2">
        <button
          onClick={handleExportData}
          className="w-full flex items-center gap-3 p-4 bg-card rounded-xl border border-border hover:border-primary/20 transition-colors"
        >
          <Download className="w-5 h-5 text-muted-foreground" />
          <div className="text-left">
            <p className="text-sm font-medium">Export Data</p>
            <p className="text-xs text-muted-foreground">Download your training data as JSON</p>
          </div>
        </button>

        <button
          onClick={signOut}
          className="w-full flex items-center gap-3 p-4 bg-card rounded-xl border border-border hover:border-destructive/30 transition-colors"
        >
          <LogOut className="w-5 h-5 text-destructive" />
          <p className="text-sm font-medium text-destructive">Sign Out</p>
        </button>
      </div>

      {/* App Info */}
      <div className="text-center space-y-1 pt-4">
        <div className="flex items-center justify-center gap-1">
          <Dumbbell className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground font-medium">HYROX TRACKER</span>
        </div>
        <p className="text-[10px] text-muted-foreground/60">v1.0.0 · Built for one</p>
      </div>
    </div>
  )
}
