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
  ChevronRight,
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
  for (const log of workoutLogs) map.set(log.id, log.completed_at)
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
    const weeks: { days: { date: Date; dateKey: string; hasWorkout: boolean; rpe: number; isFuture: boolean }[] }[] = []
    for (let w = 0; w < 12; w++) {
      const weekStart = addDays(startDate, w * 7)
      const days = []
      for (let d = 0; d < 7; d++) {
        const date = addDays(weekStart, d)
        const dateKey = format(date, 'yyyy-MM-dd')
        days.push({ date, dateKey, hasWorkout: completedDates.has(dateKey), rpe: completedDates.get(dateKey) || 0, isFuture: date > today })
      }
      weeks.push({ days })
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
      const firstDate = entries[0].date, lastDate = entries[entries.length - 1].date
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
    if (!hasWorkout) return 'bg-secondary/50'
    if (rpe <= 4) return 'bg-primary/20'
    if (rpe <= 6) return 'bg-primary/40'
    if (rpe <= 8) return 'bg-primary/60'
    return 'bg-primary'
  }

  if (loading) {
    return <div className="flex items-center justify-center h-[60vh]"><Loader2 className="w-5 h-5 text-primary animate-spin" /></div>
  }

  return (
    <div className="space-y-6 pb-24 pt-2">
      <div>
        <h1 className="text-[22px] font-semibold tracking-tight">Stats</h1>
        <p className="text-sm text-muted-foreground">Week {currentWeek} of 42</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard icon={<Activity className="w-4 h-4" />} label="Workouts" value={String(totalWorkouts)} />
        <StatCard icon={<Timer className="w-4 h-4" />} label="Time" value={`${totalHours}h`} />
        <StatCard icon={<Flame className="w-4 h-4" />} label="Streak" value={String(weekStreak)} suffix={weekStreak === 1 ? 'week' : 'weeks'} />
        <StatCard icon={<Activity className="w-4 h-4" />} label="Avg RPE" value={avgRpe || '--'} suffix={avgRpe ? '/ 10' : ''} />
      </div>

      {/* Heatmap */}
      <div className="bg-card rounded-xl p-4">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Activity</h3>
        <div className="overflow-x-auto">
          <div className="inline-flex gap-[3px]">
            <div className="flex flex-col gap-[3px] mr-1 pt-0">
              {['M', '', 'W', '', 'F', '', 'S'].map((label, i) => (
                <div key={i} className="h-[11px] w-3 flex items-center justify-end">
                  {label && <span className="text-[8px] text-muted-foreground/60">{label}</span>}
                </div>
              ))}
            </div>
            {heatmapData.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-[3px]">
                {week.days.map(day => (
                  <div
                    key={day.dateKey}
                    className={`w-[11px] h-[11px] rounded-[2px] ${getCellColor(day.hasWorkout, day.rpe, day.isFuture)} ${
                      !day.isFuture && !day.hasWorkout ? 'border border-border/30' : ''
                    }`}
                    title={`${format(day.date, 'EEE, MMM d')}${day.hasWorkout ? ` — RPE ${day.rpe}` : ''}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-1.5 mt-3 justify-end">
          <span className="text-[8px] text-muted-foreground/60">Less</span>
          <div className="w-[11px] h-[11px] rounded-[2px] bg-secondary/50 border border-border/30" />
          <div className="w-[11px] h-[11px] rounded-[2px] bg-primary/20" />
          <div className="w-[11px] h-[11px] rounded-[2px] bg-primary/40" />
          <div className="w-[11px] h-[11px] rounded-[2px] bg-primary/60" />
          <div className="w-[11px] h-[11px] rounded-[2px] bg-primary" />
          <span className="text-[8px] text-muted-foreground/60">More</span>
        </div>
      </div>

      {/* Weight Progression */}
      {weightProgressions.length > 0 && (
        <div className="bg-card rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <ArrowUpRight className="w-3.5 h-3.5 text-primary" />
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Progression</h3>
          </div>
          <div className="space-y-2">
            {weightProgressions.map(prog => (
              <div key={prog.name} className="flex items-center justify-between py-2 border-b border-border/50 last:border-b-0">
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium truncate">{prog.name}</p>
                  <p className="text-[10px] text-muted-foreground">{prog.entries} sets</p>
                </div>
                <div className="flex items-center gap-2.5 ml-3">
                  <span className="text-[11px] text-muted-foreground tabular-nums">{prog.firstWeight} &rarr; {prog.latestWeight}kg</span>
                  <span className={`flex items-center gap-0.5 text-[10px] font-medium px-1.5 py-0.5 rounded ${
                    prog.change > 0 ? 'text-primary bg-primary/10' :
                    prog.change < 0 ? 'text-destructive bg-destructive/10' :
                    'text-muted-foreground bg-secondary'
                  }`}>
                    {prog.change > 0 ? <TrendingUp className="w-3 h-3" /> : prog.change < 0 ? <TrendingDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                    {prog.change > 0 ? '+' : ''}{prog.change}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* History */}
      <div>
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Recent</h3>
        {sortedLogs.length === 0 ? (
          <div className="bg-card rounded-xl p-8 text-center">
            <p className="text-sm text-muted-foreground">No workouts logged yet.</p>
          </div>
        ) : (
          <div className="space-y-1.5">
            {(sortedLogs as WorkoutLogEntry[]).slice(0, 20).map(log => {
              const wo = workoutNames.get(log.workout_id)
              return (
                <button key={log.id} onClick={() => navigate(`/workout/${log.workout_id}`)}
                  className="w-full bg-card rounded-xl p-3.5 text-left hover:bg-card/80 transition-colors active:scale-[0.98]">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium truncate">{wo?.name || 'Workout'}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {format(new Date(log.completed_at), 'EEE, MMM d')} &middot; {formatDistanceToNow(new Date(log.completed_at), { addSuffix: true })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-2 shrink-0">
                      {log.duration_minutes != null && <span className="text-[10px] text-muted-foreground tabular-nums">{log.duration_minutes}m</span>}
                      {log.overall_rpe != null && <span className="text-[10px] font-medium text-foreground/60 bg-secondary px-1.5 py-0.5 rounded">RPE {log.overall_rpe}</span>}
                      <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/40" />
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* 1RM */}
      <div className="bg-card rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Target className="w-3.5 h-3.5 text-primary" />
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">1RM Values</h3>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          {[
            { label: 'Squat', value: profile?.squat_1rm },
            { label: 'Deadlift', value: profile?.deadlift_1rm },
            { label: 'Bench', value: profile?.bench_1rm },
            { label: 'OHP', value: profile?.ohp_1rm },
          ].map(item => (
            <div key={item.label} className="bg-secondary/40 rounded-lg p-3">
              <p className="text-[9px] uppercase tracking-wider text-muted-foreground mb-0.5">{item.label}</p>
              <p className="text-base font-semibold tabular-nums">
                {item.value ?? '\u2014'} <span className="text-xs font-normal text-muted-foreground">kg</span>
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
    <div className="bg-card rounded-xl p-4">
      <div className="flex items-center gap-1.5 mb-2">
        <span className="text-primary">{icon}</span>
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <p className="text-xl font-semibold tabular-nums">{value}</p>
        {suffix && <span className="text-[10px] text-muted-foreground">{suffix}</span>}
      </div>
    </div>
  )
}
