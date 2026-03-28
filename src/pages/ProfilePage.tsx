import { useState } from 'react'
import { useAuth } from '@/lib/auth'
import { useProfile } from '@/hooks/useProfile'
import { useWorkoutLogs } from '@/hooks/useWorkoutLog'
import {
  Calendar,
  Loader2,
  Download,
  Crosshair,
  Check,
  Target,
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

  const [squat1rm, setSquat1rm] = useState<string>('')
  const [dl1rm, setDl1rm] = useState<string>('')
  const [bench1rm, setBench1rm] = useState<string>('')
  const [ohp1rm, setOhp1rm] = useState<string>('')
  const [rmInitialized, setRmInitialized] = useState(false)

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
    const data = { profile, workout_logs: logs, exported_at: new Date().toISOString() }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `gridrunner-data-${format(new Date(), 'yyyy-MM-dd')}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-24">
      <div>
        <h1 className="text-2xl font-heading font-bold uppercase tracking-wider">Config</h1>
        <p className="text-[10px] font-mono text-muted-foreground mt-1 tracking-wider">{user.email}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-card rounded-lg p-3 border border-border text-center">
          <p className="text-xl font-mono font-bold text-primary">{logs.length}</p>
          <p className="text-[9px] font-mono text-muted-foreground uppercase mt-1">Sessions</p>
        </div>
        <div className="bg-card rounded-lg p-3 border border-border text-center">
          <p className="text-xl font-mono font-bold text-primary">
            {logs.reduce((sum, l) => sum + (l.duration_minutes || 0), 0)}
          </p>
          <p className="text-[9px] font-mono text-muted-foreground uppercase mt-1">Minutes</p>
        </div>
        <div className="bg-card rounded-lg p-3 border border-border text-center">
          <p className="text-xl font-mono font-bold text-primary">
            {logs.length > 0
              ? (logs.reduce((sum, l) => sum + (l.knee_pain_level || 0), 0) / logs.length).toFixed(1)
              : '\u2014'}
          </p>
          <p className="text-[9px] font-mono text-muted-foreground uppercase mt-1">Avg Knee</p>
        </div>
      </div>

      {/* 1RM Values */}
      <div className="bg-card rounded-lg p-4 border border-border space-y-4">
        <div className="flex items-center gap-2">
          <Target className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-heading font-bold uppercase tracking-wider">1RM Values</span>
        </div>
        <p className="text-[10px] font-mono text-muted-foreground">
          // Used to calculate working weights across all protocols
        </p>

        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Squat', value: squat1rm, onChange: setSquat1rm, placeholder: '105' },
            { label: 'Deadlift', value: dl1rm, onChange: setDl1rm, placeholder: '135' },
            { label: 'Bench', value: bench1rm, onChange: setBench1rm, placeholder: '\u2014' },
            { label: 'OHP', value: ohp1rm, onChange: setOhp1rm, placeholder: '\u2014' },
          ].map(item => (
            <div key={item.label}>
              <label className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground mb-1 block">
                {item.label}
              </label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  inputMode="decimal"
                  value={item.value}
                  onChange={e => item.onChange(e.target.value)}
                  placeholder={item.placeholder}
                  className="flex-1 h-11 px-3 bg-background border border-border rounded text-sm font-mono text-center focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                />
                <span className="text-[10px] font-mono text-muted-foreground">kg</span>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleSave1RM}
          disabled={rmSaving}
          className="w-full h-11 bg-primary text-primary-foreground rounded-lg text-xs font-heading font-bold uppercase tracking-wider flex items-center justify-center gap-1 disabled:opacity-50 shadow-[0_0_12px_rgba(0,229,255,0.2)]"
        >
          {rmSaving ? <Loader2 className="w-4 h-4 animate-spin" /> :
           rmSaved ? <><Check className="w-4 h-4" /> Saved</> :
           'Save 1RM Values'}
        </button>
      </div>

      {/* Start Date */}
      <div className="bg-card rounded-lg p-4 border border-border space-y-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-heading font-bold uppercase tracking-wider">Program Start</span>
        </div>
        {profile?.program_start_date && (
          <p className="text-[10px] font-mono text-muted-foreground">
            Current: {format(new Date(profile.program_start_date), 'MMMM d, yyyy')}
          </p>
        )}
        <div className="flex gap-2">
          <input
            type="date"
            value={startDate || profile?.program_start_date || ''}
            onChange={e => setStartDate(e.target.value)}
            className="flex-1 h-11 px-3 bg-background border border-border rounded text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <button
            onClick={handleSetStartDate}
            disabled={saving}
            className="px-4 h-11 bg-primary text-primary-foreground rounded-lg text-xs font-heading font-bold uppercase tracking-wider flex items-center gap-1 disabled:opacity-50 shadow-[0_0_12px_rgba(0,229,255,0.2)]"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> :
             saved ? <Check className="w-4 h-4" /> :
             'Save'}
          </button>
        </div>
      </div>

      {/* Export */}
      <button
        onClick={handleExportData}
        className="w-full flex items-center gap-4 p-4 bg-card rounded-lg border border-border hover:border-primary/20 transition-colors"
      >
        <Download className="w-5 h-5 text-muted-foreground" />
        <div className="text-left">
          <p className="text-xs font-heading font-bold uppercase tracking-wider">Export Data</p>
          <p className="text-[10px] font-mono text-muted-foreground">Download training telemetry as JSON</p>
        </div>
      </button>

      {/* App Info */}
      <div className="text-center space-y-1 pt-6">
        <div className="flex items-center justify-center gap-2">
          <Crosshair className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-mono font-bold text-primary glow-text tracking-[0.3em]">GRIDRUNNER</span>
        </div>
        <p className="text-[9px] font-mono text-muted-foreground/50">v3.0.0 // Hyrox Amsterdam 2027</p>
      </div>
    </div>
  )
}
