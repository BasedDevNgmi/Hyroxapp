import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAllWorkouts } from '@/hooks/useProgram'
import { useWorkoutLogs } from '@/hooks/useWorkoutLog'
import { useProfile } from '@/hooks/useProfile'
import {
  Loader2,
  TrendingUp,
  Timer,
  Weight,
  Calendar,
  ChevronRight,
  Dumbbell,
  AlertTriangle,
} from 'lucide-react'
import { format, formatDistanceToNow } from 'date-fns'

interface WorkoutLogEntry {
  id: string
  workout_id: string
  completed_at: string
  knee_pain_level: number | null
  overall_rpe: number | null
  duration_minutes: number | null
  notes: string | null
}

export default function ProgressPage() {
  const navigate = useNavigate()
  const { logs, loading: logsLoading } = useWorkoutLogs()
  const { workouts, loading: workoutsLoading } = useAllWorkouts()
  const { profile } = useProfile()

  const loading = logsLoading || workoutsLoading

  // Map workout_id -> workout name
  const workoutNames = useMemo(() => {
    const map = new Map<string, { name: string; focus: string | null }>()
    for (const w of workouts) {
      map.set(w.id, { name: w.name, focus: w.focus })
    }
    return map
  }, [workouts])

  // Stats
  const totalWorkouts = logs.length
  const totalMinutes = logs.reduce((sum, l) => sum + (l.duration_minutes || 0), 0)
  const avgKnee = totalWorkouts > 0
    ? (logs.reduce((sum, l) => sum + (l.knee_pain_level || 0), 0) / totalWorkouts).toFixed(1)
    : null
  const avgRpe = totalWorkouts > 0
    ? (logs.reduce((sum, l) => sum + (l.overall_rpe || 0), 0) / totalWorkouts).toFixed(1)
    : null

  // Current week
  let currentWeek = 1
  if (profile?.program_start_date) {
    const start = new Date(profile.program_start_date)
    const diffDays = Math.floor((Date.now() - start.getTime()) / (1000 * 60 * 60 * 24))
    currentWeek = Math.min(Math.max(Math.floor(diffDays / 7) + 1, 1), 12)
  }

  // Weekly streak
  const weeksWithWorkouts = useMemo(() => {
    if (!profile?.program_start_date) return 0
    const start = new Date(profile.program_start_date)
    let streak = 0
    for (let w = currentWeek; w >= 1; w--) {
      const weekStart = new Date(start)
      weekStart.setDate(weekStart.getDate() + (w - 1) * 7)
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekEnd.getDate() + 7)
      const hasLog = logs.some(l => {
        const d = new Date(l.completed_at)
        return d >= weekStart && d < weekEnd
      })
      if (hasLog) streak++
      else break
    }
    return streak
  }, [logs, profile, currentWeek])

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
        <h1 className="text-2xl font-bold">Progress</h1>
        <p className="text-sm text-muted-foreground mt-1">Week {currentWeek} of 12</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-card rounded-xl p-4 border border-border">
          <div className="flex items-center gap-2 mb-2">
            <Dumbbell className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground">Workouts</span>
          </div>
          <p className="text-2xl font-bold">{totalWorkouts}</p>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border">
          <div className="flex items-center gap-2 mb-2">
            <Timer className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground">Total Time</span>
          </div>
          <p className="text-2xl font-bold">{totalMinutes < 60 ? `${totalMinutes}m` : `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`}</p>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground">Week Streak</span>
          </div>
          <p className="text-2xl font-bold">{weeksWithWorkouts}</p>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground">Avg Knee / RPE</span>
          </div>
          <p className="text-2xl font-bold">{avgKnee || '—'} <span className="text-sm text-muted-foreground font-normal">/ {avgRpe || '—'}</span></p>
        </div>
      </div>

      {/* Starting Benchmarks */}
      <div className="bg-card rounded-2xl p-4 border border-border space-y-3">
        <h3 className="text-sm font-semibold">Starting Benchmarks</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <Weight className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Back Squat 1RM</p>
              <p className="text-sm font-medium">105 kg</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Weight className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">RDL 1RM</p>
              <p className="text-sm font-medium">135 kg</p>
            </div>
          </div>
        </div>
      </div>

      {/* Workout History */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold">Workout History</h3>
        </div>

        {logs.length === 0 ? (
          <div className="bg-card rounded-2xl p-8 border border-border text-center space-y-3">
            <TrendingUp className="w-8 h-8 text-muted-foreground mx-auto" />
            <p className="text-muted-foreground text-sm">
              No workouts logged yet. Complete a workout to see your history!
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {(logs as WorkoutLogEntry[]).map(log => {
              const wo = workoutNames.get(log.workout_id)
              return (
                <button
                  key={log.id}
                  onClick={() => navigate(`/workout/${log.workout_id}`)}
                  className="w-full bg-card rounded-xl border border-border p-3 text-left hover:border-primary/20 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium">{wo?.name || 'Workout'}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(log.completed_at), 'EEE, MMM d')} · {formatDistanceToNow(new Date(log.completed_at), { addSuffix: true })}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      {log.duration_minutes && (
                        <span className="text-xs text-muted-foreground">{log.duration_minutes}m</span>
                      )}
                      {log.knee_pain_level != null && (
                        <span className={`text-xs font-medium ${
                          log.knee_pain_level >= 7 ? 'text-destructive' : log.knee_pain_level >= 4 ? 'text-yellow-500' : 'text-success'
                        }`}>
                          K:{log.knee_pain_level}
                        </span>
                      )}
                      {log.overall_rpe != null && (
                        <span className="text-xs text-muted-foreground">RPE:{log.overall_rpe}</span>
                      )}
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
