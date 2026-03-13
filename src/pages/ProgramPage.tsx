import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePrograms, useWorkoutsForWeek } from '@/hooks/useProgram'
import { useWorkoutLogs } from '@/hooks/useWorkoutLog'
import { useProfile } from '@/hooks/useProfile'
import {
  ChevronRight,
  Loader2,
  CheckCircle2,
  Dumbbell,
  Flame,
  Zap,
} from 'lucide-react'

export default function ProgramPage() {
  const { programs, loading: programsLoading } = usePrograms()
  const { logs } = useWorkoutLogs()
  const { profile } = useProfile()
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null)

  // Calculate current week
  let currentWeek = 1
  if (profile?.program_start_date) {
    const start = new Date(profile.program_start_date)
    const diffDays = Math.floor((Date.now() - start.getTime()) / (1000 * 60 * 60 * 24))
    currentWeek = Math.min(Math.floor(diffDays / 7) + 1, 12)
  }

  if (programsLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    )
  }

  if (selectedWeek !== null) {
    return (
      <WeekView
        weekNumber={selectedWeek}
        onBack={() => setSelectedWeek(null)}
        logs={logs}
        currentWeek={currentWeek}
      />
    )
  }

  const phaseIcons = [Dumbbell, Flame, Zap]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Program</h1>
        <p className="text-sm text-muted-foreground mt-1">12-Week Hyrox Training</p>
      </div>

      {programs.map((program, pi) => {
        const PhaseIcon = phaseIcons[pi] || Dumbbell
        return (
          <div key={program.id} className="space-y-2">
            <div className="flex items-center gap-2 mb-3">
              <PhaseIcon className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-primary">
                {program.name}
              </h2>
            </div>

            {Array.from({ length: program.week_end - program.week_start + 1 }, (_, i) => {
              const week = program.week_start + i
              const isCurrentWeek = week === currentWeek
              const isPast = week < currentWeek
              const weekLogs = logs.filter(l => {
                if (!profile?.program_start_date) return false
                const start = new Date(profile.program_start_date)
                const logDate = new Date(l.completed_at)
                const weekStart = new Date(start)
                weekStart.setDate(weekStart.getDate() + (week - 1) * 7)
                const weekEnd = new Date(weekStart)
                weekEnd.setDate(weekEnd.getDate() + 7)
                return logDate >= weekStart && logDate < weekEnd
              })

              const isDeload = week === 4 || week === 8 || week === 12

              return (
                <button
                  key={week}
                  onClick={() => setSelectedWeek(week)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                    isCurrentWeek
                      ? 'bg-primary/5 border-primary/30'
                      : 'bg-card border-border hover:border-primary/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                      isCurrentWeek ? 'bg-primary text-primary-foreground' :
                      isPast ? 'bg-success/20 text-success' :
                      'bg-border text-muted-foreground'
                    }`}>
                      {week}
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium">
                        Week {week}
                        {isDeload && <span className="text-xs text-muted-foreground ml-2">(Deload)</span>}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {weekLogs.length}/5 completed
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Mini completion dots */}
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map(d => (
                        <div
                          key={d}
                          className={`w-1.5 h-1.5 rounded-full ${
                            d <= weekLogs.length ? 'bg-primary' : 'bg-border'
                          }`}
                        />
                      ))}
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                </button>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}

function WeekView({
  weekNumber,
  onBack,
  logs,
  currentWeek,
}: {
  weekNumber: number
  onBack: () => void
  logs: { workout_id: string; completed_at: string }[]
  currentWeek: number
}) {
  const navigate = useNavigate()
  const { workouts, loading } = useWorkoutsForWeek(weekNumber)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <button onClick={onBack} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ChevronRight className="w-4 h-4 rotate-180" />
        Back to Program
      </button>

      <div>
        <h1 className="text-2xl font-bold">Week {weekNumber}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {weekNumber <= 4 ? 'Foundation' : weekNumber <= 8 ? 'Build' : 'Peak'}
          {weekNumber === currentWeek && ' · Current Week'}
        </p>
      </div>

      <div className="space-y-3">
        {workouts.map(workout => {
          const isCompleted = logs.some(l => l.workout_id === workout.id)
          return (
            <button
              key={workout.id}
              onClick={() => navigate(`/workout/${workout.id}`)}
              className="w-full bg-card rounded-2xl border border-border p-4 text-left hover:border-primary/20 transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-muted-foreground">
                      Day {workout.day_number}
                    </span>
                    {isCompleted && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                    )}
                  </div>
                  <p className="font-medium">{workout.name}</p>
                  <p className="text-xs text-muted-foreground">{workout.focus}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground mt-1" />
              </div>

              <div className="flex flex-wrap gap-1.5 mt-3">
                {workout.workout_exercises.slice(0, 3).map(we => (
                  <span key={we.id} className="text-[10px] px-2 py-0.5 bg-background rounded-full text-muted-foreground">
                    {(we.exercise as { name: string }).name}
                  </span>
                ))}
                {workout.workout_exercises.length > 3 && (
                  <span className="text-[10px] px-2 py-0.5 bg-background rounded-full text-muted-foreground">
                    +{workout.workout_exercises.length - 3}
                  </span>
                )}
              </div>
            </button>
          )
        })}

        {workouts.length === 0 && (
          <div className="bg-card rounded-2xl p-8 border border-border text-center">
            <p className="text-muted-foreground text-sm">No workouts found for this week</p>
          </div>
        )}
      </div>
    </div>
  )
}
