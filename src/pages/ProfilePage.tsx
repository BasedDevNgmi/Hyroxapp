import { useState } from 'react'
import { useAuth } from '@/lib/auth'
import { useProfile } from '@/hooks/useProfile'
import { useWorkoutLogs } from '@/hooks/useWorkoutLog'
import {
  Calendar,
  Loader2,
  Download,
  Upload,
  Check,
  Target,
  RotateCcw,
  Sparkles,
  Heart,
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
  const [aiEnabled, setAiEnabled] = useState(() => localStorage.getItem('hyrox_ai_enabled') === 'true')
  const [healthData, setHealthData] = useState<{ sleep_hours: string; hrv_sdnn: string; resting_hr: string }>({ sleep_hours: '', hrv_sdnn: '', resting_hr: '' })
  const [healthSaved, setHealthSaved] = useState(false)

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

  const handleStartToday = async () => {
    const today = format(new Date(), 'yyyy-MM-dd')
    setSaving(true)
    await updateProfile({ program_start_date: today })
    setStartDate(today)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleExportData = () => {
    const allData = {
      profile,
      workout_logs: logs,
      exercise_logs: JSON.parse(localStorage.getItem('hyrox_exercise_logs') || '[]'),
      health_data: JSON.parse(localStorage.getItem('hyrox_health_data') || '[]'),
      ai_enabled: localStorage.getItem('hyrox_ai_enabled') === 'true',
      exported_at: new Date().toISOString(),
    }
    const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `training-data-${format(new Date(), 'yyyy-MM-dd')}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImportData = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return
      try {
        const text = await file.text()
        const data = JSON.parse(text)
        if (data.profile) {
          localStorage.setItem('hyrox_profile', JSON.stringify(data.profile))
        }
        if (data.workout_logs) {
          localStorage.setItem('hyrox_workout_logs', JSON.stringify(data.workout_logs))
        }
        if (data.exercise_logs) {
          localStorage.setItem('hyrox_exercise_logs', JSON.stringify(data.exercise_logs))
        }
        if (data.health_data) {
          localStorage.setItem('hyrox_health_data', JSON.stringify(data.health_data))
        }
        if (data.ai_enabled !== undefined) {
          localStorage.setItem('hyrox_ai_enabled', String(data.ai_enabled))
        }
        window.location.reload()
      } catch {
        alert('Invalid backup file')
      }
    }
    input.click()
  }

  if (loading) {
    return <div className="flex items-center justify-center h-[60vh]"><Loader2 className="w-5 h-5 text-primary animate-spin" /></div>
  }

  return (
    <div className="space-y-6 pb-24 pt-2">
      <div>
        <h1 className="text-[22px] font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">{user.email}</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-2.5">
        {[
          { label: 'Workouts', value: logs.length },
          { label: 'Minutes', value: logs.reduce((s, l) => s + (l.duration_minutes || 0), 0) },
          { label: 'Avg Knee', value: logs.length > 0 ? (logs.reduce((s, l) => s + (l.knee_pain_level || 0), 0) / logs.length).toFixed(1) : '\u2014' },
        ].map(s => (
          <div key={s.label} className="bg-card rounded-xl p-3.5 text-center">
            <p className="text-lg font-semibold text-primary tabular-nums">{s.value}</p>
            <p className="text-[9px] text-muted-foreground uppercase tracking-wider mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* 1RM */}
      <div className="bg-card rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold">1RM Values</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Used to calculate working weights throughout the program.
        </p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Squat', value: squat1rm, onChange: setSquat1rm, ph: '105' },
            { label: 'Deadlift', value: dl1rm, onChange: setDl1rm, ph: '135' },
            { label: 'Bench Press', value: bench1rm, onChange: setBench1rm, ph: '\u2014' },
            { label: 'OHP', value: ohp1rm, onChange: setOhp1rm, ph: '\u2014' },
          ].map(item => (
            <div key={item.label}>
              <label className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 block">{item.label}</label>
              <div className="flex items-center gap-1">
                <input
                  type="number" inputMode="decimal" value={item.value}
                  onChange={e => item.onChange(e.target.value)} placeholder={item.ph}
                  className="flex-1 h-11 px-3 bg-background border border-border rounded-lg text-sm text-center focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <span className="text-[10px] text-muted-foreground">kg</span>
              </div>
            </div>
          ))}
        </div>
        <button onClick={handleSave1RM} disabled={rmSaving}
          className="w-full h-11 bg-primary text-primary-foreground rounded-xl text-sm font-semibold flex items-center justify-center gap-1 disabled:opacity-50">
          {rmSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : rmSaved ? <><Check className="w-4 h-4" /> Saved</> : 'Save'}
        </button>
      </div>

      {/* Start Date */}
      <div className="bg-card rounded-xl p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold">Program Start Date</span>
        </div>
        {profile?.program_start_date && (
          <p className="text-xs text-muted-foreground">
            Current: {format(new Date(profile.program_start_date), 'MMMM d, yyyy')}
          </p>
        )}
        <div className="flex gap-2">
          <input type="date" value={startDate || profile?.program_start_date || ''}
            onChange={e => setStartDate(e.target.value)}
            className="flex-1 h-11 px-3 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
          <button onClick={handleSetStartDate} disabled={saving}
            className="px-5 h-11 bg-primary text-primary-foreground rounded-xl text-sm font-semibold flex items-center gap-1 disabled:opacity-50">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : 'Save'}
          </button>
        </div>
        <button onClick={handleStartToday}
          className="w-full flex items-center justify-center gap-2 h-10 bg-secondary rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
          <RotateCcw className="w-3.5 h-3.5" /> Reset to Today (Week 1)
        </button>
      </div>

      {/* AI Workouts */}
      <div className="bg-card rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-violet-400" />
          <span className="text-sm font-semibold">AI Workouts</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Uses Claude AI to personalize your daily workout based on recovery, performance, and training phase.
        </p>
        <button
          onClick={() => {
            const next = !aiEnabled
            localStorage.setItem('hyrox_ai_enabled', String(next))
            setAiEnabled(next)
          }}
          className={`w-full h-11 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
            aiEnabled
              ? 'bg-violet-500/15 text-violet-400 border border-violet-500/20'
              : 'bg-secondary text-muted-foreground'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          {aiEnabled ? 'AI Enabled' : 'Enable AI Workouts'}
        </button>
        {aiEnabled && (
          <p className="text-[10px] text-muted-foreground">
            A "Personalize with AI" button will appear on the dashboard for each workout.
            Requires ANTHROPIC_API_KEY configured on Vercel.
          </p>
        )}
      </div>

      {/* Apple Health */}
      <div className="bg-card rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Heart className="w-4 h-4 text-red-400" />
          <span className="text-sm font-semibold">Recovery Data</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Manually enter today's recovery metrics. AI workouts will use this to adjust intensity.
        </p>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Sleep (hrs)', value: healthData.sleep_hours, key: 'sleep_hours' as const, ph: '7.5' },
            { label: 'HRV (ms)', value: healthData.hrv_sdnn, key: 'hrv_sdnn' as const, ph: '45' },
            { label: 'RHR (bpm)', value: healthData.resting_hr, key: 'resting_hr' as const, ph: '52' },
          ].map(item => (
            <div key={item.label}>
              <label className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 block">{item.label}</label>
              <input
                type="number" inputMode="decimal" value={item.value}
                onChange={e => setHealthData(prev => ({ ...prev, [item.key]: e.target.value }))}
                placeholder={item.ph}
                className="w-full h-11 px-3 bg-background border border-border rounded-lg text-sm text-center focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          ))}
        </div>
        <button
          onClick={() => {
            const today = new Date().toISOString().slice(0, 10)
            const entry = {
              date: today,
              sleep_hours: healthData.sleep_hours ? Number(healthData.sleep_hours) : null,
              hrv_sdnn: healthData.hrv_sdnn ? Number(healthData.hrv_sdnn) : null,
              resting_hr: healthData.resting_hr ? Number(healthData.resting_hr) : null,
              active_calories: null,
            }
            const existing = JSON.parse(localStorage.getItem('hyrox_health_data') || '[]')
            // Replace today's entry or add new
            const filtered = existing.filter((e: { date: string }) => e.date !== today)
            filtered.unshift(entry)
            localStorage.setItem('hyrox_health_data', JSON.stringify(filtered.slice(0, 30)))
            setHealthSaved(true)
            setTimeout(() => setHealthSaved(false), 2000)
          }}
          className="w-full h-11 bg-primary text-primary-foreground rounded-xl text-sm font-semibold flex items-center justify-center gap-1 disabled:opacity-50"
        >
          {healthSaved ? <><Check className="w-4 h-4" /> Saved</> : 'Save Recovery Data'}
        </button>
        <p className="text-[10px] text-muted-foreground">
          For auto-sync, use the "Health Auto Export" iOS app pointed at your Vercel endpoint.
        </p>
      </div>

      {/* Data Management */}
      <div className="space-y-2">
        <button onClick={handleExportData}
          className="w-full flex items-center gap-4 p-4 bg-card rounded-xl hover:bg-card/80 transition-colors">
          <Download className="w-5 h-5 text-muted-foreground" />
          <div className="text-left">
            <p className="text-sm font-medium">Export Backup</p>
            <p className="text-[10px] text-muted-foreground">Download all data as JSON</p>
          </div>
        </button>
        <button onClick={handleImportData}
          className="w-full flex items-center gap-4 p-4 bg-card rounded-xl hover:bg-card/80 transition-colors">
          <Upload className="w-5 h-5 text-muted-foreground" />
          <div className="text-left">
            <p className="text-sm font-medium">Import Backup</p>
            <p className="text-[10px] text-muted-foreground">Restore from a previous export</p>
          </div>
        </button>
      </div>

      {/* Footer */}
      <div className="text-center pt-4">
        <p className="text-xs text-primary font-semibold tracking-wider">HYBRID ATHLETE</p>
        <p className="text-[9px] text-muted-foreground/50 mt-0.5">v3.0 &middot; Amsterdam 2027</p>
      </div>
    </div>
  )
}
