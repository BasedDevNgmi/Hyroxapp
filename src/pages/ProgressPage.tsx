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
  Dumbbell,
  Activity,
  Weight,
  ArrowUpRight,
} from 'lucide-react'
import {
  format,
  formatDistanceToNow,
  startOfWeek,
  subWeeks,
  addDays,
  differenceInCalendarWeeks,
} from 'date-fns'

// ── Types ─────────────────────────────────────────────
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

// ── Helpers ───────────────────────────────────────────

/** Build a map from workout_exercise_id -> exercise name */
function buildExerciseNameMap(): Map<string, string> {
  const map = new Map<string, string>()
  for (const workout of allWorkouts) {
    for (const we of workout.workout_exercises) {
      map.set(we.id, we.exercise.name)
    }
  }
  return map
}

/** Build a map from workout_exercise_id -> workout_log_id -> completed_at date */
function buildLogDateMap(
  workoutLogs: WorkoutLogEntry[]
): Map<string, string> {
  const map = new Map<string, string>()
  for (const log of workoutLogs) {
    map.set(log.id, log.completed_at)
  }
  return map
}

// ── Component ─────────────────────────────────────────

export default function ProgressPage() {
  const navigate = useNavigate()
  const { logs, loading: logsLoading } = useWorkoutLogs()
  const { workouts, loading: workoutsLoading } = useAllWorkouts()
  const { profile } = useProfile()

  const loading = logsLoading || workoutsLoading

  // Workout name lookup
  const workoutNames = useMemo(() => {
    const map = new Map<string, { name: string; focus: string | null }>()
    for (const w of workouts) {
      map.set(w.id, { name: w.name, focus: w.focus })
    }
    return map
  }, [workouts])

  // Exercise name lookup
  const exerciseNameMap = useMemo(() => buildExerciseNameMap(), [])

  // Exercise logs from localStorage
  const exerciseLogs: ExerciseLog[] = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('hyrox_exercise_logs') || '[]')
    } catch {
      return []
    }
  }, [])

  // Log date map for linking exercise logs to dates
  const logDateMap = useMemo(
    () => buildLogDateMap(logs as WorkoutLogEntry[]),
    [logs]
  )

  // ── Stats ────────────────────────────────────────
  const totalWorkouts = logs.length
  const totalMinutes = logs.reduce(
    (sum, l) => sum + (l.duration_minutes || 0),
    0
  )
  const totalHours = (totalMinutes / 60).toFixed(1)

  const avgRpe = useMemo(() => {
    const withRpe = logs.filter((l) => l.overall_rpe != null)
    if (withRpe.length === 0) return null
    const sum = withRpe.reduce((s, l) => s + (l.overall_rpe || 0), 0)
    return (sum / withRpe.length).toFixed(1)
  }, [logs])

  // Current program week
  let currentWeek = 1
  if (profile?.program_start_date) {
    const start = new Date(profile.program_start_date)
    const diffDays = Math.floor(
      (Date.now() - start.getTime()) / (1000 * 60 * 60 * 24)
    )
    currentWeek = Math.min(Math.max(Math.floor(diffDays / 7) + 1, 1), 12)
  }

  // Weekly streak: consecutive weeks (ending at current week) with >= 1 workout
  const weekStreak = useMemo(() => {
    if (!profile?.program_start_date) return 0
    const start = new Date(profile.program_start_date)
    let streak = 0
    for (let w = currentWeek; w >= 1; w--) {
      const weekStart = new Date(start)
      weekStart.setDate(weekStart.getDate() + (w - 1) * 7)
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekEnd.getDate() + 7)
      const hasLog = logs.some((l) => {
        const d = new Date(l.completed_at)
        return d >= weekStart && d < weekEnd
      })
      if (hasLog) streak++
      else break
    }
    return streak
  }, [logs, profile, currentWeek])

  // ── Heatmap data (last 12 weeks) ────────────────
  const heatmapData = useMemo(() => {
    const today = new Date()
    const mondayThisWeek = startOfWeek(today, { weekStartsOn: 1 })
    const startDate = subWeeks(mondayThisWeek, 11) // 12 weeks including current

    // Build set of dates that have a completed workout
    const completedDates = new Map<string, number>() // dateKey -> max RPE
    for (const log of logs) {
      const d = new Date(log.completed_at)
      const key = format(d, 'yyyy-MM-dd')
      const rpe = log.overall_rpe || 5
      completedDates.set(key, Math.max(completedDates.get(key) || 0, rpe))
    }

    // Build 12 weeks x 7 days grid
    const weeks: {
      weekLabel: string
      days: {
        date: Date
        dateKey: string
        hasWorkout: boolean
        rpe: number
        isFuture: boolean
      }[]
    }[] = []

    for (let w = 0; w < 12; w++) {
      const weekStart = addDays(startDate, w * 7)
      const weekNum =
        differenceInCalendarWeeks(weekStart, startDate, {
          weekStartsOn: 1,
        }) + 1
      const days = []
      for (let d = 0; d < 7; d++) {
        const date = addDays(weekStart, d)
        const dateKey = format(date, 'yyyy-MM-dd')
        const isFuture = date > today
        days.push({
          date,
          dateKey,
          hasWorkout: completedDates.has(dateKey),
          rpe: completedDates.get(dateKey) || 0,
          isFuture,
        })
      }
      weeks.push({
        weekLabel: `W${weekNum}`,
        days,
      })
    }

    return weeks
  }, [logs])

  // ── Weight progression ──────────────────────────
  const weightProgressions = useMemo(() => {
    // Group exercise logs by workout_exercise_id, include only those with weight_kg
    const byExercise = new Map<
      string,
      { weight: number; date: string }[]
    >()

    for (const el of exerciseLogs) {
      if (el.weight_kg == null || el.weight_kg <= 0) continue
      const name = exerciseNameMap.get(el.workout_exercise_id)
      if (!name) continue

      // Use exercise name as key to aggregate across weeks
      const dateStr = logDateMap.get(el.workout_log_id) || ''
      if (!byExercise.has(name)) {
        byExercise.set(name, [])
      }
      byExercise.get(name)!.push({ weight: el.weight_kg, date: dateStr })
    }

    // For each exercise, compute first and latest max weight
    const progressions: {
      name: string
      firstWeight: number
      latestWeight: number
      change: number
      entries: number
    }[] = []

    for (const [name, entries] of byExercise) {
      if (entries.length < 2) continue

      // Sort by date
      entries.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      )

      // Get max weight from first session and last session
      const firstDate = entries[0].date
      const lastDate = entries[entries.length - 1].date

      // If all same date, skip
      if (firstDate === lastDate) continue

      const firstSessionEntries = entries.filter((e) => e.date === firstDate)
      const lastSessionEntries = entries.filter((e) => e.date === lastDate)

      const firstMax = Math.max(...firstSessionEntries.map((e) => e.weight))
      const lastMax = Math.max(...lastSessionEntries.map((e) => e.weight))

      progressions.push({
        name,
        firstWeight: firstMax,
        latestWeight: lastMax,
        change: lastMax - firstMax,
        entries: entries.length,
      })
    }

    // Sort by absolute change descending
    progressions.sort(
      (a, b) => Math.abs(b.change) - Math.abs(a.change)
    )

    return progressions
  }, [exerciseLogs, exerciseNameMap, logDateMap])

  // ── Sorted logs for history ─────────────────────
  const sortedLogs = useMemo(
    () =>
      [...logs].sort(
        (a, b) =>
          new Date(b.completed_at).getTime() -
          new Date(a.completed_at).getTime()
      ),
    [logs]
  )

  // ── Heatmap helpers ─────────────────────────────
  function getCellColor(
    hasWorkout: boolean,
    rpe: number,
    isFuture: boolean
  ): string {
    if (isFuture) return 'bg-transparent'
    if (!hasWorkout) return 'bg-zinc-800/60'
    // Intensity based on RPE: low=dim green, high=bright neon green
    if (rpe <= 4) return 'bg-[#3a5c00]'
    if (rpe <= 6) return 'bg-[#6b9a00]'
    if (rpe <= 8) return 'bg-[#a8d600]'
    return 'bg-[#d4ff00]'
  }

  const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

  // ── Render ──────────────────────────────────────

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-8 h-8 text-[#d4ff00] animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Progress</h1>
        <p className="text-sm text-zinc-400 mt-1">
          Week {currentWeek} of 12
        </p>
      </div>

      {/* ─── Hero Stats 2x2 ─────────────────────── */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          icon={<Dumbbell className="w-4 h-4" />}
          label="Workouts"
          value={String(totalWorkouts)}
        />
        <StatCard
          icon={<Timer className="w-4 h-4" />}
          label="Training Time"
          value={`${totalHours}h`}
        />
        <StatCard
          icon={<Flame className="w-4 h-4" />}
          label="Week Streak"
          value={String(weekStreak)}
          suffix={weekStreak === 1 ? 'week' : 'weeks'}
        />
        <StatCard
          icon={<Activity className="w-4 h-4" />}
          label="Avg RPE"
          value={avgRpe || '--'}
          suffix={avgRpe ? '/ 10' : ''}
        />
      </div>

      {/* ─── Activity Heatmap ───────────────────── */}
      <div className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-4 h-4 text-[#d4ff00]" />
          <h3 className="text-sm font-semibold text-white">
            Activity — Last 12 Weeks
          </h3>
        </div>

        <div className="overflow-x-auto">
          <div className="inline-flex gap-0.5">
            {/* Day labels column */}
            <div className="flex flex-col gap-0.5 mr-1 pt-5">
              {DAY_LABELS.map((label, i) => (
                <div
                  key={i}
                  className="h-3 w-4 flex items-center justify-end"
                >
                  {i % 2 === 0 ? (
                    <span className="text-[9px] text-zinc-500 leading-none">
                      {label}
                    </span>
                  ) : null}
                </div>
              ))}
            </div>

            {/* Week columns */}
            {heatmapData.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-0.5">
                {/* Week number label */}
                <div className="h-4 flex items-center justify-center">
                  {wi % 3 === 0 ? (
                    <span className="text-[9px] text-zinc-500">
                      {format(week.days[0].date, 'M/d')}
                    </span>
                  ) : null}
                </div>
                {/* Day cells */}
                {week.days.map((day) => (
                  <div
                    key={day.dateKey}
                    className={`w-3 h-3 rounded-[2px] ${getCellColor(
                      day.hasWorkout,
                      day.rpe,
                      day.isFuture
                    )} ${
                      day.isFuture
                        ? ''
                        : day.hasWorkout
                        ? ''
                        : 'border border-zinc-700/40'
                    }`}
                    title={`${format(day.date, 'EEE, MMM d')}${
                      day.hasWorkout ? ` — RPE ${day.rpe}` : ''
                    }`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 mt-3 justify-end">
          <span className="text-[9px] text-zinc-500">Less</span>
          <div className="w-3 h-3 rounded-[2px] bg-zinc-800/60 border border-zinc-700/40" />
          <div className="w-3 h-3 rounded-[2px] bg-[#3a5c00]" />
          <div className="w-3 h-3 rounded-[2px] bg-[#6b9a00]" />
          <div className="w-3 h-3 rounded-[2px] bg-[#a8d600]" />
          <div className="w-3 h-3 rounded-[2px] bg-[#d4ff00]" />
          <span className="text-[9px] text-zinc-500">More</span>
        </div>
      </div>

      {/* ─── Weight Progression ─────────────────── */}
      {weightProgressions.length > 0 && (
        <div className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800">
          <div className="flex items-center gap-2 mb-4">
            <ArrowUpRight className="w-4 h-4 text-[#d4ff00]" />
            <h3 className="text-sm font-semibold text-white">
              Weight Progression
            </h3>
          </div>

          <div className="space-y-3">
            {weightProgressions.map((prog) => (
              <div
                key={prog.name}
                className="flex items-center justify-between py-2 border-b border-zinc-800 last:border-b-0"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {prog.name}
                  </p>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    {prog.entries} sets logged
                  </p>
                </div>
                <div className="flex items-center gap-3 ml-3">
                  <div className="text-right">
                    <span className="text-xs text-zinc-500">
                      {prog.firstWeight}kg
                    </span>
                    <span className="text-xs text-zinc-600 mx-1.5">
                      {'\u2192'}
                    </span>
                    <span className="text-sm font-semibold text-white">
                      {prog.latestWeight}kg
                    </span>
                  </div>
                  <div
                    className={`flex items-center gap-0.5 text-xs font-medium px-1.5 py-0.5 rounded ${
                      prog.change > 0
                        ? 'text-[#d4ff00] bg-[#d4ff00]/10'
                        : prog.change < 0
                        ? 'text-red-400 bg-red-400/10'
                        : 'text-zinc-400 bg-zinc-700/50'
                    }`}
                  >
                    {prog.change > 0 ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : prog.change < 0 ? (
                      <TrendingDown className="w-3 h-3" />
                    ) : (
                      <Minus className="w-3 h-3" />
                    )}
                    <span>
                      {prog.change > 0 ? '+' : ''}
                      {prog.change}kg
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── Workout History ────────────────────── */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-4 h-4 text-[#d4ff00]" />
          <h3 className="text-sm font-semibold text-white">
            Recent Workouts
          </h3>
        </div>

        {sortedLogs.length === 0 ? (
          <div className="bg-zinc-900 rounded-2xl p-8 border border-zinc-800 text-center space-y-3">
            <Dumbbell className="w-8 h-8 text-zinc-600 mx-auto" />
            <p className="text-zinc-400 text-sm">
              No workouts logged yet. Complete a workout to track your
              progress!
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {(sortedLogs as WorkoutLogEntry[]).map((log) => {
              const wo = workoutNames.get(log.workout_id)
              return (
                <button
                  key={log.id}
                  onClick={() => navigate(`/workout/${log.workout_id}`)}
                  className="w-full bg-zinc-900 rounded-xl border border-zinc-800 p-3 text-left hover:border-[#d4ff00]/30 transition-colors active:scale-[0.98]"
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5 flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {wo?.name || 'Workout'}
                      </p>
                      <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                        <span>
                          {format(
                            new Date(log.completed_at),
                            'EEE, MMM d'
                          )}
                        </span>
                        <span className="text-zinc-700">{'\u00B7'}</span>
                        <span>
                          {formatDistanceToNow(
                            new Date(log.completed_at),
                            { addSuffix: true }
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 ml-2 shrink-0">
                      {log.duration_minutes != null && (
                        <span className="text-xs text-zinc-400 tabular-nums">
                          {log.duration_minutes}m
                        </span>
                      )}
                      {log.knee_pain_level != null && (
                        <span
                          className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                            log.knee_pain_level >= 7
                              ? 'text-red-400 bg-red-400/10'
                              : log.knee_pain_level >= 4
                              ? 'text-yellow-400 bg-yellow-400/10'
                              : 'text-emerald-400 bg-emerald-400/10'
                          }`}
                        >
                          K:{log.knee_pain_level}
                        </span>
                      )}
                      {log.overall_rpe != null && (
                        <span className="text-[10px] font-semibold text-zinc-300 bg-zinc-800 px-1.5 py-0.5 rounded">
                          RPE {log.overall_rpe}
                        </span>
                      )}
                      <ChevronRight className="w-4 h-4 text-zinc-600" />
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* ─── Starting Benchmarks ────────────────── */}
      <div className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800">
        <div className="flex items-center gap-2 mb-3">
          <Weight className="w-4 h-4 text-[#d4ff00]" />
          <h3 className="text-sm font-semibold text-white">
            Starting Benchmarks
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-zinc-800/50 rounded-lg p-3">
            <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">
              Back Squat 1RM
            </p>
            <p className="text-lg font-bold text-white">
              105{' '}
              <span className="text-sm font-normal text-zinc-400">kg</span>
            </p>
          </div>
          <div className="bg-zinc-800/50 rounded-lg p-3">
            <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">
              RDL 1RM
            </p>
            <p className="text-lg font-bold text-white">
              135{' '}
              <span className="text-sm font-normal text-zinc-400">kg</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── StatCard sub-component ────────────────────────────

function StatCard({
  icon,
  label,
  value,
  suffix,
}: {
  icon: React.ReactNode
  label: string
  value: string
  suffix?: string
}) {
  return (
    <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[#d4ff00]">{icon}</span>
        <span className="text-[10px] uppercase tracking-wider text-zinc-500">
          {label}
        </span>
      </div>
      <div className="flex items-baseline gap-1.5">
        <p className="text-2xl font-bold text-white">{value}</p>
        {suffix && (
          <span className="text-xs text-zinc-500">{suffix}</span>
        )}
      </div>
    </div>
  )
}
