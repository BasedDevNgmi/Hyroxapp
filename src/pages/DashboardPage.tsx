import { useState, useMemo, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProfile } from '@/hooks/useProfile'
import { useWorkoutLogs } from '@/hooks/useWorkoutLog'
import { getWorkoutByWeekDay } from '@/data/program'
import type { Workout } from '@/hooks/useProgram'
import {
  Play,
  CheckCircle2,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye,
  Moon,
} from 'lucide-react'
import {
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isToday,
  addWeeks,
  isSameDay,
} from 'date-fns'

function getPhaseInfo(week: number): { name: string } {
  if (week <= 12) return { name: 'Foundation' }
  if (week <= 20) return { name: 'Buildup' }
  if (week <= 28) return { name: 'Intensity' }
  if (week <= 38) return { name: 'Race Prep' }
  return { name: 'Taper' }
}

function getWorkoutForDate(
  date: Date,
  programStart: Date,
): Workout | null {
  const diffMs = date.getTime() - programStart.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  if (diffDays < 0) return null
  const weekNumber = Math.floor(diffDays / 7) + 1
  if (weekNumber > 42) return null
  const jsDay = date.getDay()
  const dayOfWeek = jsDay === 0 ? 7 : jsDay
  return getWorkoutByWeekDay(weekNumber, dayOfWeek) || null
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const { profile, loading: profileLoading } = useProfile()
  const { logs } = useWorkoutLogs()

  const [selectedDate, setSelectedDate] = useState(new Date())
  const [weekOffset, setWeekOffset] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)

  const completedIds = useMemo(() => new Set(logs.map(l => l.workout_id)), [logs])

  const programStart = profile?.program_start_date ? new Date(profile.program_start_date) : null

  // Week strip days
  const today = new Date()
  const baseWeekStart = startOfWeek(today, { weekStartsOn: 1 })
  const currentWeekStart = weekOffset === 0 ? baseWeekStart : addWeeks(baseWeekStart, weekOffset)
  const currentWeekEnd = endOfWeek(currentWeekStart, { weekStartsOn: 1 })
  const weekDays = eachDayOfInterval({ start: currentWeekStart, end: currentWeekEnd })

  // Selected day's workout (full Workout object)
  const selectedWorkout = useMemo(() => {
    if (!programStart) return null
    return getWorkoutForDate(selectedDate, programStart)
  }, [selectedDate, programStart])

  const selectedCompleted = selectedWorkout ? completedIds.has(selectedWorkout.id) : false

  // Week number for selected date
  const selectedWeekNumber = useMemo(() => {
    if (!programStart) return 0
    const diff = Math.floor((selectedDate.getTime() - programStart.getTime()) / (1000 * 60 * 60 * 24))
    if (diff < 0) return 0
    return Math.floor(diff / 7) + 1
  }, [selectedDate, programStart])

  const phase = selectedWeekNumber > 0 && selectedWeekNumber <= 42 ? getPhaseInfo(selectedWeekNumber) : null

  useEffect(() => {
    if (scrollRef.current) {
      const todayEl = scrollRef.current.querySelector('[data-today="true"]')
      todayEl?.scrollIntoView({ inline: 'center', block: 'nearest' })
    }
  }, [])

  const exerciseCount = selectedWorkout?.workout_exercises.length ?? 0
  const estimatedMinutes = exerciseCount > 0 ? Math.round(exerciseCount * 6 + 10) : 0

  // Exercise completion from localStorage
  const exerciseCompletionMap = useMemo(() => {
    if (!selectedWorkout) return new Map<string, boolean>()
    const raw = localStorage.getItem('hyrox_exercise_logs')
    if (!raw) return new Map<string, boolean>()
    try {
      const allLogs = JSON.parse(raw) as { workout_exercise_id: string; completed: boolean }[]
      const map = new Map<string, boolean>()
      for (const we of selectedWorkout.workout_exercises) {
        const weLogs = allLogs.filter(l => l.workout_exercise_id === we.id)
        const allDone = weLogs.length >= we.sets && weLogs.every(l => l.completed)
        map.set(we.id, allDone)
      }
      return map
    } catch {
      return new Map<string, boolean>()
    }
  }, [selectedWorkout])

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-5 h-5 text-primary animate-spin" />
      </div>
    )
  }

  if (!profile?.program_start_date) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] space-y-5">
        <h2 className="text-xl font-semibold">Welcome</h2>
        <p className="text-sm text-muted-foreground text-center max-w-[260px]">
          Set your program start date in Settings to get started.
        </p>
        <button
          onClick={() => navigate('/profile')}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-semibold"
        >
          Open Settings
        </button>
      </div>
    )
  }

  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  return (
    <div className="space-y-5 pt-2">
      {/* Date Header */}
      <div>
        <h1 className="text-[22px] font-semibold tracking-tight">
          {format(selectedDate, 'EEEE')}
        </h1>
        <p className="text-sm text-muted-foreground">
          {format(selectedDate, 'MMMM d, yyyy')}
          {selectedWeekNumber > 0 && selectedWeekNumber <= 42 && (
            <span className="text-primary"> &middot; Week {selectedWeekNumber}</span>
          )}
          {phase && (
            <span className="text-muted-foreground"> &middot; {phase.name}</span>
          )}
        </p>
      </div>

      {/* Week Strip */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setWeekOffset(w => w - 1)}
            className="p-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          {weekOffset !== 0 && (
            <button
              onClick={() => { setWeekOffset(0); setSelectedDate(new Date()) }}
              className="text-[11px] text-primary font-medium px-2 py-0.5 rounded-md hover:bg-primary/10 transition-colors"
            >
              Today
            </button>
          )}
          <button
            onClick={() => setWeekOffset(w => w + 1)}
            className="p-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div ref={scrollRef} className="grid grid-cols-7 gap-1.5">
          {weekDays.map((day, i) => {
            const isSelected = isSameDay(day, selectedDate)
            const isTodayDate = isToday(day)
            const wo = programStart ? getWorkoutForDate(day, programStart) : null
            const isDone = wo ? completedIds.has(wo.id) : false

            return (
              <button
                key={day.toISOString()}
                data-today={isTodayDate}
                onClick={() => setSelectedDate(day)}
                className={`flex flex-col items-center py-2.5 rounded-xl transition-all duration-150 ${
                  isSelected
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-card'
                }`}
              >
                <span className={`text-[10px] font-medium mb-1 ${
                  isSelected ? 'text-primary-foreground/70' : 'text-muted-foreground'
                }`}>
                  {dayLabels[i]}
                </span>
                <span className={`text-[15px] font-semibold ${
                  isSelected ? '' : isTodayDate ? 'text-primary' : ''
                }`}>
                  {format(day, 'd')}
                </span>
                <div className="mt-1 h-1.5">
                  {isDone ? (
                    <div className="w-1.5 h-1.5 rounded-full bg-success" />
                  ) : wo ? (
                    <div className={`w-1.5 h-1.5 rounded-full ${
                      isSelected ? 'bg-primary-foreground/40' : 'bg-primary/40'
                    }`} />
                  ) : null}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Workout Content */}
      {selectedWorkout ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">{selectedWorkout.name}</h2>
              {selectedWorkout.focus && (
                <p className="text-xs text-muted-foreground mt-0.5">{selectedWorkout.focus}</p>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />
              <span>~{estimatedMinutes}m</span>
            </div>
          </div>

          {selectedCompleted && (
            <div className="flex items-center gap-2 px-3 py-2 bg-success/8 border border-success/15 rounded-lg">
              <CheckCircle2 className="w-4 h-4 text-success" />
              <span className="text-xs text-success font-medium">Completed</span>
            </div>
          )}

          {/* Exercise List */}
          <div className="space-y-1.5">
            {selectedWorkout.workout_exercises.map((we, idx) => {
              const exercise = we.exercise as { name: string; category: string }
              const isDone = exerciseCompletionMap.get(we.id) || false

              return (
                <button
                  key={we.id}
                  onClick={() => navigate(`/workout/${selectedWorkout.id}`)}
                  className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-left transition-colors ${
                    isDone ? 'bg-card/60' : 'bg-card hover:bg-card/80'
                  }`}
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${
                    isDone ? 'bg-success/15 text-success' : 'bg-secondary text-muted-foreground'
                  }`}>
                    {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-[13px] font-medium ${isDone ? 'text-muted-foreground' : 'text-foreground'}`}>
                      {exercise.name}
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {we.sets} &times; {we.reps || `${we.duration_seconds}s`}
                      {we.target_weight_kg ? ` @ ${we.target_weight_kg} kg` : ''}
                      {we.distance_meters ? ` \u00b7 ${we.distance_meters}m` : ''}
                    </p>
                  </div>
                  <span className={`text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded shrink-0 ${
                    exercise.category === 'strength' ? 'text-blue-400/70 bg-blue-400/8' :
                    exercise.category === 'cardio' ? 'text-emerald-400/70 bg-emerald-400/8' :
                    exercise.category === 'hyrox_specific' ? 'text-primary/70 bg-primary/8' :
                    exercise.category === 'core' ? 'text-amber-400/70 bg-amber-400/8' :
                    'text-muted-foreground bg-secondary'
                  }`}>
                    {exercise.category === 'hyrox_specific' ? 'hyrox' : exercise.category}
                  </span>
                </button>
              )
            })}
          </div>

          {selectedWorkout.notes && (
            <p className="text-xs text-muted-foreground italic px-1">{selectedWorkout.notes}</p>
          )}

          <button
            onClick={() => navigate(`/workout/${selectedWorkout.id}`)}
            className={`w-full py-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
              selectedCompleted
                ? 'bg-card border border-border text-muted-foreground hover:text-foreground'
                : 'bg-primary text-primary-foreground'
            }`}
          >
            {selectedCompleted ? (
              <><Eye className="w-4 h-4" /> Review Workout</>
            ) : (
              <><Play className="w-4 h-4" /> Start Workout</>
            )}
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 space-y-3">
          <div className="w-12 h-12 rounded-full bg-card flex items-center justify-center">
            <Moon className="w-5 h-5 text-muted-foreground" />
          </div>
          <p className="text-base font-medium text-muted-foreground">Rest Day</p>
          <p className="text-xs text-muted-foreground/60">Recover. You earned it.</p>
        </div>
      )}
    </div>
  )
}
