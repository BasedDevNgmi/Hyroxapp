import { useState } from 'react'
import { useAuth } from '@/lib/auth'
import { useProfile } from '@/hooks/useProfile'
import { useWorkoutLogs } from '@/hooks/useWorkoutLog'
import {
  Calendar,
  Loader2,
  Download,
  Dumbbell,
  Check,
  Weight,
} from 'lucide-react'
import { format } from 'date-fns'

export default function ProfilePage() {
  const { user } = useAuth()
  const { profile, loading, updateProfile } = useProfile()
  const { logs } = useWorkoutLogs()
  const [startDate, setStartDate] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [rmSaving, setRmSaving] = useState(false)
  const [rmSaved, setRmSaved] = useState(false)

  // Local 1RM state
  const [squat1rm, setSquat1rm] = useState<string>('')
  const [dl1rm, setDl1rm] = useState<string>('')
  const [bench1rm, setBench1rm] = useState<string>('')
  const [ohp1rm, setOhp1rm] = useState<string>('')
  const [rmInitialized, setRmInitialized] = useState(false)

  // Initialize 1RM values from profile once loaded
  if (profile && !rmInitialized) {
    setSquat1rm(profile.squat_1rm?.toString() ?? '')
    setDl1rm(profile.deadlift_1rm?.toString() ?? '')
    setBench1rm(profile.bench_1rm?.toString() ?? '')
    setOhp1rm(profile.ohp_1rm?.toString() ?? '')
    setRmInitialized(true)
  }

  const handleSetStartDate = async () => {
    if (!startDate) return
    setSaving(true)
    await updateProfile({ program_start_date: startDate })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleSave1RM = async () => {
    setRmSaving(true)
    await updateProfile({
      squat_1rm: squat1rm ? Number(squat1rm) : null,
      deadlift_1rm: dl1rm ? Number(dl1rm) : null,
      bench_1rm: bench1rm ? Number(bench1rm) : null,
      ohp_1rm: ohp1rm ? Number(ohp1rm) : null,
    })
    setRmSaving(false)
    setRmSaved(true)
    setTimeout(() => setRmSaved(false), 2000)
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
    <div className="space-y-8 pb-24">
      <div>
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-sm text-muted-foreground mt-1">{user.email}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-card rounded-xl p-4 border border-border text-center">
          <p className="text-2xl font-bold text-primary">{logs.length}</p>
          <p className="text-[10px] text-muted-foreground uppercase mt-1">Workouts</p>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border text-center">
          <p className="text-2xl font-bold text-primary">
            {logs.reduce((sum, l) => sum + (l.duration_minutes || 0), 0)}
          </p>
          <p className="text-[10px] text-muted-foreground uppercase mt-1">Minutes</p>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border text-center">
          <p className="text-2xl font-bold text-primary">
            {logs.length > 0
              ? (logs.reduce((sum, l) => sum + (l.knee_pain_level || 0), 0) / logs.length).toFixed(1)
              : '—'
            }
          </p>
          <p className="text-[10px] text-muted-foreground uppercase mt-1">Avg Knee</p>
        </div>
      </div>

      {/* 1RM Values */}
      <div className="bg-card rounded-2xl p-5 border border-border space-y-4">
        <div className="flex items-center gap-2">
          <Weight className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">1RM Values</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Used to calculate working weights throughout the program.
        </p>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 block">Squat</label>
            <div className="flex items-center gap-1">
              <input
                type="number"
                inputMode="decimal"
                value={squat1rm}
                onChange={e => setSquat1rm(e.target.value)}
                placeholder="105"
                className="flex-1 h-12 px-4 bg-background border border-border rounded-lg text-sm text-center focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <span className="text-xs text-muted-foreground">kg</span>
            </div>
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 block">Deadlift</label>
            <div className="flex items-center gap-1">
              <input
                type="number"
                inputMode="decimal"
                value={dl1rm}
                onChange={e => setDl1rm(e.target.value)}
                placeholder="135"
                className="flex-1 h-12 px-4 bg-background border border-border rounded-lg text-sm text-center focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <span className="text-xs text-muted-foreground">kg</span>
            </div>
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 block">Bench Press</label>
            <div className="flex items-center gap-1">
              <input
                type="number"
                inputMode="decimal"
                value={bench1rm}
                onChange={e => setBench1rm(e.target.value)}
                placeholder="—"
                className="flex-1 h-12 px-4 bg-background border border-border rounded-lg text-sm text-center focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <span className="text-xs text-muted-foreground">kg</span>
            </div>
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 block">OHP</label>
            <div className="flex items-center gap-1">
              <input
                type="number"
                inputMode="decimal"
                value={ohp1rm}
                onChange={e => setOhp1rm(e.target.value)}
                placeholder="—"
                className="flex-1 h-12 px-4 bg-background border border-border rounded-lg text-sm text-center focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <span className="text-xs text-muted-foreground">kg</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleSave1RM}
          disabled={rmSaving}
          className="w-full h-12 bg-primary text-primary-foreground rounded-lg text-sm font-medium flex items-center justify-center gap-1 disabled:opacity-50"
        >
          {rmSaving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : rmSaved ? (
            <><Check className="w-4 h-4" /> Saved</>
          ) : (
            'Save 1RM Values'
          )}
        </button>
      </div>

      {/* Program Start Date */}
      <div className="bg-card rounded-2xl p-5 border border-border space-y-3">
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
            className="flex-1 h-12 px-4 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <button
            onClick={handleSetStartDate}
            disabled={saving}
            className="px-5 h-12 bg-primary text-primary-foreground rounded-lg text-sm font-medium flex items-center gap-1 disabled:opacity-50"
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
          className="w-full flex items-center gap-4 p-5 bg-card rounded-xl border border-border hover:border-primary/20 transition-colors"
        >
          <Download className="w-5 h-5 text-muted-foreground" />
          <div className="text-left">
            <p className="text-sm font-medium">Export Data</p>
            <p className="text-xs text-muted-foreground">Download your training data as JSON</p>
          </div>
        </button>
      </div>

      {/* App Info */}
      <div className="text-center space-y-1 pt-6">
        <div className="flex items-center justify-center gap-1">
          <Dumbbell className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs text-primary font-medium">HYBRID ATHLETE</span>
        </div>
        <p className="text-[10px] text-muted-foreground/60">v2.0.0 · Hyrox Amsterdam 2027</p>
      </div>
    </div>
  )
}
