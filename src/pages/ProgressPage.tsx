import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAllWorkouts } from '@/hooks/useProgram'
import { useWorkoutLogs } from '@/hooks/useWorkoutLog'
import { useProfile } from '@/hooks/useProfile'
import { allWorkouts } from '@/data/program'
import {
  Loader2,
  TrendingUp,
  TrendingDown,
  Minus,
  Timer,
  Flame,
  Calendar,
  ChevronRight,
  Crosshair,
  Activity,
  ArrowUpRight,
  Target,
} from 'lucide-react'
import {
  format,
  formatDistanceToNow,
  startOfWeek,
  subWeeks,
  addDays,
  differenceInCalendarWeeks,
} from 'date-fns'

interface ExerciseLog {
  id: string
  workout_log_id: string
  workout_exercise_id: string
  set_number: number
  weight_kg: number | null
  reps_completed: number | null
  time_seconds: number | null
  completed: boolean
  notes: string | null
}

interface WorkoutLogEntry {
  id: string
  workout_id: string
  completed_at: string
  knee_pain_level: number | null
  overall_rpe: number | null
  duration_minutes: number | null
  notes: string | null
}

function buildExerciseNameMap(): Map<string, string> {
  const map = new Map<string, string>()
  for (const workout of allWorkouts) {
    for (const we of workout.workout_exercises) {
      map.set(we.id, we.exercise.name)
    }
  }
  return map
}

function buildLogDateMap(workoutLogs: WorkoutLogEntry[]): Map<string, string> {
  const map = new Map<string, string>()
  for (const log of workoutLogs) {
    map.set(log.id, log.completed_at)
  }
  return map
}

export default function ProgressPage() {
  const navigate = useNavigate()
  const { logs, loading: logsLoading } = useWorkoutLogs()
  const { workouts, loading: workoutsLoading } = useAllWorkouts()
  const { profile } = useProfile()

  const loading = logsLoading || workoutsLoading

  const workoutNames = useMemo(() => {
    const map = new Map<string, { name: string; focus: string | null }>()
    for (const w of workouts) map.set(w.id, { name: w.name, focus: w.focus })
    return map
  }, [workouts])

  const exerciseNameMap = useMemo(() => buildExerciseNameMap(), [])

  const exerciseLogs: ExerciseLog[] = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('hyrox_exercise_logs') || '[]') }
    catch { return [] }
  }, [])

  const logDateMap = useMemo(() => buildLogDateMap(logs as WorkoutLogEntry[]), [logs])

  const totalWorkouts = logs.length
  const totalMinutes = logs.reduce((sum, l) => sum + (l.duration_minutes || 0), 0)
  const totalHours = (totalMinutes / 60).toFixed(1)

  const avgRpe = useMemo(() => {
    const withRpe = logs.filter(l => l.overall_rpe != null)
    if (withRpe.length === 0) return null
    return (withRpe.reduce((s, l) => s + (l.overall_rpe || 0), 0) / withRpe.length).toFixed(1)
  }, [logs])

  let currentWeek = 1
  if (profile?.program_start_date) {
    const start = new Date(profile.program_start_date)
    const diffDays = Math.floor((Date.now() - start.getTime()) / (1000 * 60 * 60 * 24))
    currentWeek = Math.min(Math.max(Math.floor(diffDays / 7) + 1, 1), 42)
  }

  const weekStreak = useMemo(() => {
    if (!profile?.program_start_date) return 0
    const start = new Date(profile.program_start_date)
    let streak = 0
    for (let w = currentWeek; w >= 1; w--) {
      const weekStart = new Date(start)
      weekStart.setDate(weekStart.getDate() + (w - 1) * 7)
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekEnd.getDate() + 7)
      if (logs.some(l => { const d = new Date(l.completed_at); return d >= weekStart && d < weekEnd })) streak++
      else break
    }
    return streak
  }, [logs, profile, currentWeek])

  const heatmapData = useMemo(() => {
    const today = new Date()
    const mondayThisWeek = startOfWeek(today, { weekStartsOn: 1 })
    const startDate = subWeeks(mondayThisWeek, 11)

    const completedDates = new Map<string, number>()
    for (const log of logs) {
      const d = new Date(log.completed_at)
      const key = format(d, 'yyyy-MM-dd')
      completedDates.set(key, Math.max(completedDates.get(key) || 0, log.overall_rpe || 5))
    }

    const weeks: { weekLabel: string; days: { date: Date; dateKey: string; hasWorkout: boolean; rpe: number; isFuture: boolean }[] }[] = []
    for (let w = 0; w < 12; w++) {
      const weekStart = addDays(startDate, w * 7)
      const weekNum = differenceInCalendarWeeks(weekStart, startDate, { weekStartsOn: 1 }) + 1
      const days = []
      for (let d = 0; d < 7; d++) {
        const date = addDays(weekStart, d)
        const dateKey = format(date, 'yyyy-MM-dd')
        days.push({
          date, dateKey,
          hasWorkout: completedDates.has(dateKey),
          rpe: completedDates.get(dateKey) || 0,
          isFuture: date > today,
        })
      }
      weeks.push({ weekLabel: `W${weekNum}`, days })
    }
    return weeks
  }, [logs])

  const weightProgressions = useMemo(() => {
    const byExercise = new Map<string, { weight: number; date: string }[]>()
    for (const el of exerciseLogs) {
      if (el.weight_kg == null || el.weight_kg <= 0) continue
      const name = exerciseNameMap.get(el.workout_exercise_id)
      if (!name) continue
      const dateStr = logDateMap.get(el.workout_log_id) || ''
      if (!byExercise.has(name)) byExercise.set(name, [])
      byExercise.get(name)!.push({ weight: el.weight_kg, date: dateStr })
    }

    const progressions: { name: string; firstWeight: number; latestWeight: number; change: number; entries: number }[] = []
    for (const [name, entries] of byExercise) {
      if (entries.length < 2) continue
      entries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      const firstDate = entries[0].date
      const lastDate = entries[entries.length - 1].date
      if (firstDate === lastDate) continue
      const firstMax = Math.max(...entries.filter(e => e.date === firstDate).map(e => e.weight))
      const lastMax = Math.max(...entries.filter(e => e.date === lastDate).map(e => e.weight))
      progressions.push({ name, firstWeight: firstMax, latestWeight: lastMax, change: lastMax - firstMax, entries: entries.length })
    }
    progressions.sort((a, b) => Math.abs(b.change) - Math.abs(a.change))
    return progressions
  }, [exerciseLogs, exerciseNameMap, logDateMap])

  const sortedLogs = useMemo(
    () => [...logs].sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime()),
    [logs]
  )

  function getCellColor(hasWorkout: boolean, rpe: number, isFuture: boolean): string {
    if (isFuture) return 'bg-transparent'
    if (!hasWorkout) return 'bg-secondary/40'
    if (rpe <= 4) return 'bg-primary/20'
    if (rpe <= 6) return 'bg-primary/40'
    if (rpe <= 8) return 'bg-primary/60'
    return 'bg-primary/90'
  }

  const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

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
        <h1 className="text-2xl font-heading font-bold uppercase tracking-wider text-foreground">Data</h1>
        <p className="text-[10px] font-mono text-muted-foreground mt-1 tracking-wider">
          W{currentWeek} OF 42 // TELEMETRY
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard icon={<Crosshair className="w-4 h-4" />} label="Sessions" value={String(totalWorkouts)} />
        <StatCard icon={<Timer className="w-4 h-4" />} label="Time" value={`${totalHours}h`} />
        <StatCard icon={<Flame className="w-4 h-4" />} label="Streak" value={String(weekStreak)} suffix={weekStreak === 1 ? 'week' : 'weeks'} />
        <StatCard icon={<Activity className="w-4 h-4" />} label="Avg RPE" value={avgRpe || '--'} suffix={avgRpe ? '/ 10' : ''} />
      </div>

      {/* Heatmap */}
      <div className="bg-card rounded-lg p-4 border border-border">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-3.5 h-3.5 text-primary" />
          <h3 className="text-xs font-heading font-bold uppercase tracking-wider">Activity // 12 Weeks</h3>
        </div>
        <div className="overflow-x-auto">
          <div className="inline-flex gap-0.5">
            <div className="flex flex-col gap-0.5 mr-1 pt-5">
              {DAY_LABELS.map((label, i) => (
                <div key={i} className="h-3 w-4 flex items-center justify-end">
                  {i % 2 === 0 ? <span className="text-[8px] font-mono text-muted-foreground">{label}</span> : null}
                </div>
              ))}
            </div>
            {heatmapData.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-0.5">
                <div className="h-4 flex items-center justify-center">
                  {wi % 3 === 0 ? <span className="text-[8px] font-mono text-muted-foreground">{format(week.days[0].date, 'M/d')}</span> : null}
                </div>
                {week.days.map(day => (
                  <div
                    key={day.dateKey}
                    className={`w-3 h-3 rounded-[2px] ${getCellColor(day.hasWorkout, day.rpe, day.isFuture)} ${
                      !day.isFuture && !day.hasWorkout ? 'border border-border/30' : ''
                    }`}
                    title={`${format(day.date, 'EEE, MMM d')}${day.hasWorkout ? ` — RPE ${day.rpe}` : ''}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 mt-3 justify-end">
          <span className="text-[8px] font-mono text-muted-foreground">Less</span>
          <div className="w-3 h-3 rounded-[2px] bg-secondary/40 border border-border/30" />
          <div className="w-3 h-3 rounded-[2px] bg-primary/20" />
          <div className="w-3 h-3 rounded-[2px] bg-primary/40" />
          <div className="w-3 h-3 rounded-[2px] bg-primary/60" />
          <div className="w-3 h-3 rounded-[2px] bg-primary/90" />
          <span className="text-[8px] font-mono text-muted-foreground">More</span>
        </div>
      </div>

      {/* Weight Progression */}
      {weightProgressions.length > 0 && (
        <div className="bg-card rounded-lg p-4 border border-border">
          <div className="flex items-center gap-2 mb-3">
            <ArrowUpRight className="w-3.5 h-3.5 text-primary" />
            <h3 className="text-xs font-heading font-bold uppercase tracking-wider">Weight Progression</h3>
          </div>
          <div className="space-y-2">
            {weightProgressions.map(prog => (
              <div key={prog.name} className="flex items-center justify-between py-2 border-b border-border last:border-b-0">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-heading font-bold uppercase tracking-wider truncate">{prog.name}</p>
                  <p className="text-[9px] font-mono text-muted-foreground">{prog.entries} sets</p>
                </div>
                <div className="flex items-center gap-3 ml-3">
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-muted-foreground">{prog.firstWeight}</span>
                    <span className="text-[10px] font-mono text-muted-foreground mx-1">{'\u2192'}</span>
                    <span className="text-sm font-mono font-bold text-foreground">{prog.latestWeight}kg</span>
                  </div>
                  <div className={`flex items-center gap-0.5 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                    prog.change > 0 ? 'text-primary bg-primary/10' :
                    prog.change < 0 ? 'text-destructive bg-destructive/10' :
                    'text-muted-foreground bg-border/50'
                  }`}>
                    {prog.change > 0 ? <TrendingUp className="w-3 h-3" /> :
                     prog.change < 0 ? <TrendingDown className="w-3 h-3" /> :
                     <Minus className="w-3 h-3" />}
                    <span>{prog.change > 0 ? '+' : ''}{prog.change}kg</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Workout History */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-3.5 h-3.5 text-primary" />
          <h3 className="text-xs font-heading font-bold uppercase tracking-wider">Session Log</h3>
        </div>
        {sortedLogs.length === 0 ? (
          <div className="bg-card rounded-lg p-8 border border-border text-center space-y-3">
            <Crosshair className="w-8 h-8 text-muted-foreground mx-auto" />
            <p className="text-muted-foreground text-xs font-mono">
              // No sessions logged. Complete a protocol to begin tracking.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {(sortedLogs as WorkoutLogEntry[]).map(log => {
              const wo = workoutNames.get(log.workout_id)
              return (
                <button
                  key={log.id}
                  onClick={() => navigate(`/workout/${log.workout_id}`)}
                  className="w-full bg-card rounded-lg border border-border p-3 text-left hover:border-primary/30 transition-colors active:scale-[0.98]"
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5 flex-1 min-w-0">
                      <p className="text-sm font-heading font-bold uppercase tracking-wider truncate">{wo?.name || 'Session'}</p>
                      <div className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground">
                        <span>{format(new Date(log.completed_at), 'EEE, MMM d')}</span>
                        <span className="text-border">{'\u00B7'}</span>
                        <span>{formatDistanceToNow(new Date(log.completed_at), { addSuffix: true })}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-2 shrink-0">
                      {log.duration_minutes != null && (
                        <span className="text-[10px] font-mono text-muted-foreground tabular-nums">{log.duration_minutes}m</span>
                      )}
                      {log.knee_pain_level != null && (
                        <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                          log.knee_pain_level >= 7 ? 'text-destructive bg-destructive/10' :
                          log.knee_pain_level >= 4 ? 'text-amber-400 bg-amber-400/10' :
                          'text-success bg-success/10'
                        }`}>K:{log.knee_pain_level}</span>
                      )}
                      {log.overall_rpe != null && (
                        <span className="text-[9px] font-mono font-bold text-foreground/80 bg-secondary px-1.5 py-0.5 rounded">
                          RPE {log.overall_rpe}
                        </span>
                      )}
                      <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* 1RM */}
      <div className="bg-card rounded-lg p-4 border border-border">
        <div className="flex items-center gap-2 mb-3">
          <Target className="w-3.5 h-3.5 text-primary" />
          <h3 className="text-xs font-heading font-bold uppercase tracking-wider">1RM Values</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Squat', value: profile?.squat_1rm },
            { label: 'Deadlift', value: profile?.deadlift_1rm },
            { label: 'Bench', value: profile?.bench_1rm },
            { label: 'OHP', value: profile?.ohp_1rm },
          ].map(item => (
            <div key={item.label} className="bg-secondary/30 rounded-lg p-3 border border-border/50">
              <p className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground mb-1">{item.label}</p>
              <p className="text-lg font-mono font-bold text-foreground">
                {item.value ?? '\u2014'}{' '}
                <span className="text-xs font-normal text-muted-foreground">kg</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon, label, value, suffix }: { icon: React.ReactNode; label: string; value: string; suffix?: string }) {
  return (
    <div className="bg-card rounded-lg p-4 border border-border">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-primary">{icon}</span>
        <span className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground">{label}</span>
      </div>
      <div className="flex items-baseline gap-1.5">
        <p className="text-2xl font-mono font-bold text-foreground">{value}</p>
        {suffix && <span className="text-[10px] font-mono text-muted-foreground">{suffix}</span>}
      </div>
    </div>
  )
}
