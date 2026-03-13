import { useNavigate } from 'react-router-dom'
import { useProfile } from '@/hooks/useProfile'
import { useTodayWorkout } from '@/hooks/useProgram'
import { useWorkoutLogs } from '@/hooks/useWorkoutLog'
import {
  Dumbbell,
  Play,
  CheckCircle2,
  Calendar,
  Zap,
  Loader2,
} from 'lucide-react'

export default function DashboardPage() {
  const navigate = useNavigate()
  const { profile, loading: profileLoading } = useProfile()
  const { workout, weekNumber, dayNumber, loading: workoutLoading } = useTodayWorkout(
    profile?.program_start_date ?? null
  )
  const { logs } = useWorkoutLogs()

  const loading = profileLoading || workoutLoading

  // Count completed workouts this week
  const weekLogs = logs.filter(log => {
    if (!profile?.program_start_date) return false
    const start = new Date(profile.program_start_date)
    const logDate = new Date(log.completed_at)
    const weekStart = new Date(start)
    weekStart.setDate(weekStart.getDate() + (weekNumber - 1) * 7)
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekEnd.getDate() + 7)
    return logDate >= weekStart && logDate < weekEnd
  })

  const todayCompleted = logs.some(l => l.workout_id === workout?.id)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    )
  }

  if (!profile?.program_start_date) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-3 pt-12">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
            <Calendar className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-xl font-semibold">Set Your Start Date</h2>
          <p className="text-sm text-muted-foreground">
            Go to Profile to set your program start date to begin tracking.
          </p>
          <button
            onClick={() => navigate('/profile')}
            className="mt-4 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold"
          >
            Go to Profile
          </button>
        </div>
      </div>
    )
  }

  const phaseLabel =
    weekNumber <= 4 ? 'Phase 1: Foundation' :
    weekNumber <= 8 ? 'Phase 2: Build' :
    'Phase 3: Peak'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-xs font-medium text-primary uppercase tracking-widest">{phaseLabel}</p>
        <h1 className="text-2xl font-bold mt-1">
          Week {weekNumber}, Day {dayNumber}
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          {workout?.name || 'Rest Day'}
        </p>
      </div>

      {/* Week Progress */}
      <div className="bg-card rounded-2xl p-4 border border-border">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium">Week Progress</span>
          <span className="text-xs text-muted-foreground">{weekLogs.length}/5 workouts</span>
        </div>
        <div className="flex gap-1.5">
          {[1, 2, 3, 4, 5].map(day => (
              <div
                key={day}
                className={`h-2 flex-1 rounded-full ${
                  day <= weekLogs.length ? 'bg-primary' : 'bg-border'
                }`}
              />
            )
          })}
        </div>
      </div>

      {/* Today's Workout Card */}
      {workout ? (
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">{workout.focus || 'Training'}</span>
              </div>
              {todayCompleted && (
                <span className="flex items-center gap-1 text-xs text-success font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Done
                </span>
              )}
            </div>

            <h2 className="text-lg font-semibold">{workout.name}</h2>

            {/* Exercise Preview */}
            <div className="space-y-2">
              {workout.workout_exercises.slice(0, 4).map((we) => (
                <div key={we.id} className="flex items-center gap-3 text-sm">
                  <Dumbbell className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                  <span className="text-muted-foreground">
                    {(we.exercise as { name: string }).name}
                  </span>
                  <span className="text-xs text-muted-foreground/60 ml-auto">
                    {we.sets}×{we.reps || we.duration_seconds + 's'}
                  </span>
                </div>
              ))}
              {workout.workout_exercises.length > 4 && (
                <p className="text-xs text-muted-foreground">
                  +{workout.workout_exercises.length - 4} more exercises
                </p>
              )}
            </div>

            {workout.notes && (
              <p className="text-xs text-muted-foreground italic">{workout.notes}</p>
            )}
          </div>

          <button
            onClick={() => navigate(`/workout/${workout.id}`)}
            className="w-full py-4 bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
          >
            <Play className="w-4 h-4" />
            {todayCompleted ? 'View / Log Again' : 'Start Workout'}
          </button>
        </div>
      ) : (
        <div className="bg-card rounded-2xl p-8 border border-border text-center">
          <p className="text-muted-foreground">Rest day. Recover and stretch!</p>
        </div>
      )}
    </div>
  )
}
