import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProfile } from '@/hooks/useProfile'
import { useTodayWorkout, useAllWorkouts, DAY_NAMES, TRAINING_DAYS } from '@/hooks/useProgram'
import { useWorkoutLogs } from '@/hooks/useWorkoutLog'
import {
  Dumbbell,
  Play,
  CheckCircle2,
  Calendar,
  Zap,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Flame,
  Clock,
  Eye,
} from 'lucide-react'
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isToday,
  addMonths,
  subMonths,
  addDays,
} from 'date-fns'
import type { WorkoutSummary } from '@/hooks/useProgram'

// Map a calendar date to its week_number and day_number relative to program start
function getWorkoutForDate(
  date: Date,
  programStart: Date,
  workoutMap: Map<string, WorkoutSummary>
): WorkoutSummary | null {
  const diffMs = date.getTime() - programStart.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  if (diffDays < 0) return null

  const weekNumber = Math.floor(diffDays / 7) + 1
  if (weekNumber > 12) return null

  // day_number = day of week: 1=Mon..7=Sun
  const jsDay = date.getDay()
  const dayOfWeek = jsDay === 0 ? 7 : jsDay

  return workoutMap.get(`${weekNumber}-${dayOfWeek}`) || null
}

function getPhaseForWeek(week: number): { label: string; color: string } {
  if (week <= 4) return { label: 'P1', color: 'bg-blue-500' }
  if (week <= 8) return { label: 'P2', color: 'bg-amber-500' }
  return { label: 'P3', color: 'bg-red-500' }
}

function isDeloadWeek(week: number) {
  return week === 4 || week === 8 || week === 12
}

function getGreeting(name: string, isTrainingDay: boolean): { greeting: string; message: string } {
  const hour = new Date().getHours()
  let timeGreeting: string
  if (hour < 6) timeGreeting = 'Up early'
  else if (hour < 12) timeGreeting = 'Good morning'
  else if (hour < 17) timeGreeting = 'Good afternoon'
  else if (hour < 21) timeGreeting = 'Good evening'
  else timeGreeting = 'Late grind'

  const trainingMessages = [
    'Time to put in the work.',
    'Let\'s get after it today.',
    'Another day, another chance to improve.',
    'Consistency beats everything.',
    'Show up and do the work.',
  ]

  const restMessages = [
    'Recovery is part of the process.',
    'Rest up, you\'ve earned it.',
    'Recharge for tomorrow\'s session.',
    'Active recovery or full rest -- your call.',
  ]

  const messages = isTrainingDay ? trainingMessages : restMessages
  // Use day-of-year as a simple seed for a stable daily message
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
  )
  const message = messages[dayOfYear % messages.length]

  return { greeting: `${timeGreeting}, ${name}`, message }
}

function calculateStreak(
  logs: { workout_id: string; completed_at: string }[],
  programStart: Date
): number {
  if (logs.length === 0) return 0

  // Get unique dates (as date strings) when workouts were completed
  const completedDates = new Set<string>()
  for (const log of logs) {
    const d = new Date(log.completed_at)
    completedDates.add(format(d, 'yyyy-MM-dd'))
  }

  // Walk backward from today counting consecutive training days that have logs
  const today = new Date()
  let streak = 0
  let current = new Date(today)

  // If today is a training day and not yet completed, start from yesterday
  const todayJs = today.getDay()
  const todayDow = todayJs === 0 ? 7 : todayJs
  const todayIsTraining = TRAINING_DAYS.has(todayDow)
  const todayKey = format(today, 'yyyy-MM-dd')
  const todayCompleted = completedDates.has(todayKey)

  if (todayIsTraining && !todayCompleted) {
    current.setDate(current.getDate() - 1)
  }

  // Walk backward
  for (let i = 0; i < 365; i++) {
    const key = format(current, 'yyyy-MM-dd')
    const jsDay = current.getDay()
    const dow = jsDay === 0 ? 7 : jsDay
    const isTraining = TRAINING_DAYS.has(dow)

    if (current < programStart) break

    if (isTraining) {
      if (completedDates.has(key)) {
        streak++
      } else {
        break
      }
    }
    // Skip rest days -- they don't break the streak

    current.setDate(current.getDate() - 1)
  }

  return streak
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const { profile, loading: profileLoading } = useProfile()
  const { workout, weekNumber, dayNumber, loading: workoutLoading } = useTodayWorkout(
    profile?.program_start_date ?? null
  )
  const { workouts: allWorkouts, loading: allWorkoutsLoading } = useAllWorkouts()
  const { logs } = useWorkoutLogs()
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [calendarExpanded, setCalendarExpanded] = useState(false)

  const loading = profileLoading || workoutLoading || allWorkoutsLoading

  // Build a map of "week-day" -> workout for O(1) lookup
  const workoutMap = useMemo(() => {
    const map = new Map<string, WorkoutSummary>()
    for (const w of allWorkouts) {
      map.set(`${w.week_number}-${w.day_number}`, w)
    }
    return map
  }, [allWorkouts])

  // Set of completed workout IDs for quick lookup
  const completedIds = useMemo(() => new Set(logs.map(l => l.workout_id)), [logs])

  const todayCompleted = workout ? completedIds.has(workout.id) : false

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

  // Determine which specific training days this week are completed
  const weekCompletedDays = useMemo(() => {
    const completed = new Set<number>()
    if (!profile?.program_start_date) return completed
    const start = new Date(profile.program_start_date)
    const weekStart = new Date(start)
    weekStart.setDate(weekStart.getDate() + (weekNumber - 1) * 7)
    for (const log of logs) {
      const logDate = new Date(log.completed_at)
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekEnd.getDate() + 7)
      if (logDate >= weekStart && logDate < weekEnd) {
        const jsDay = logDate.getDay()
        const dow = jsDay === 0 ? 7 : jsDay
        completed.add(dow)
      }
    }
    return completed
  }, [logs, profile?.program_start_date, weekNumber])

  // Streak calculation
  const streak = useMemo(() => {
    if (!profile?.program_start_date) return 0
    return calculateStreak(logs, new Date(profile.program_start_date))
  }, [logs, profile?.program_start_date])

  // Calendar grid
  const programStart = profile?.program_start_date ? new Date(profile.program_start_date) : null

  // Current week row for collapsed calendar
  const today = new Date()
  const currentWeekStart = startOfWeek(today, { weekStartsOn: 1 })
  const currentWeekEnd = endOfWeek(today, { weekStartsOn: 1 })
  const currentWeekDays = eachDayOfInterval({ start: currentWeekStart, end: currentWeekEnd })

  // Full month calendar
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const calStart = startOfWeek(monthStart, { weekStartsOn: 1 })
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })
  const calDays = eachDayOfInterval({ start: calStart, end: calEnd })

  // Program date range for highlighting
  const programEnd = programStart ? addDays(programStart, 12 * 7 - 1) : null

  // Training day check
  const isTrainingDay = TRAINING_DAYS.has(dayNumber)

  // Greeting
  const displayName = profile?.display_name || 'Athlete'
  const { greeting, message } = getGreeting(displayName, isTrainingDay)

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
    weekNumber <= 4 ? 'Phase 1: Base & Bulletproofing' :
    weekNumber <= 8 ? 'Phase 2: Hyrox Strength & Threshold' :
    'Phase 3: Compromised Running'

  // Estimated duration based on exercise count (rough heuristic)
  const exerciseCount = workout?.workout_exercises.length ?? 0
  const estimatedMinutes = exerciseCount > 0 ? Math.round(exerciseCount * 6 + 10) : 0

  // Training days of the week for progress display: Mon(1), Tue(2), Wed(3), Fri(5), Sat(6)
  const trainingDaysList = [1, 2, 3, 5, 6]
  const trainingDayLabels: Record<number, string> = { 1: 'M', 2: 'T', 3: 'W', 5: 'F', 6: 'S' }

  // Render a calendar day cell (shared between collapsed and expanded)
  function renderCalendarDay(day: Date, inMonth: boolean = true) {
    const dayIsToday = isToday(day)
    const wo = programStart ? getWorkoutForDate(day, programStart, workoutMap) : null
    const isCompleted = wo ? completedIds.has(wo.id) : false
    const inProgram = programStart && programEnd && day >= programStart && day <= programEnd
    const diffFromStart = programStart ? Math.floor((day.getTime() - programStart.getTime()) / (1000 * 60 * 60 * 24)) : -1
    const weekNum = diffFromStart >= 0 ? Math.floor(diffFromStart / 7) + 1 : 0
    const deload = weekNum > 0 && weekNum <= 12 && isDeloadWeek(weekNum)
    const phase = weekNum > 0 && weekNum <= 12 ? getPhaseForWeek(weekNum) : null

    return (
      <button
        key={day.toISOString()}
        disabled={!wo}
        onClick={() => wo && navigate(`/workout/${wo.id}`)}
        className={`
          relative flex flex-col items-center justify-center py-1.5 min-h-[42px] rounded-lg transition-all
          ${!inMonth ? 'opacity-25' : ''}
          ${dayIsToday ? 'ring-2 ring-primary ring-offset-1 ring-offset-card' : ''}
          ${wo ? 'hover:bg-primary/10 cursor-pointer' : 'cursor-default'}
          ${isCompleted ? 'bg-green-500/10' : ''}
          ${inProgram && !wo && inMonth ? 'bg-background/50' : ''}
        `}
      >
        <span className={`text-xs leading-none ${
          dayIsToday ? 'font-bold text-primary' :
          wo ? 'font-semibold text-foreground' :
          'text-muted-foreground'
        }`}>
          {format(day, 'd')}
        </span>

        {wo && (
          <div className="flex items-center gap-0.5 mt-0.5">
            {isCompleted ? (
              <CheckCircle2 className="w-2.5 h-2.5 text-green-500" />
            ) : (
              <div className={`w-1.5 h-1.5 rounded-full ${phase?.color || 'bg-primary'}`} />
            )}
          </div>
        )}

        {deload && inMonth && wo && (
          <span className="text-[7px] text-muted-foreground leading-none">DL</span>
        )}
      </button>
    )
  }

  return (
    <div className="space-y-4">
      {/* Greeting Header */}
      <div className="space-y-1">
        <p className="text-xs font-medium text-primary uppercase tracking-widest">{phaseLabel}</p>
        <h1 className="text-2xl font-bold mt-1">{greeting}</h1>
        <p className="text-sm text-muted-foreground">{message}</p>
        <p className="text-xs text-muted-foreground mt-1">
          Week {weekNumber}, {DAY_NAMES[dayNumber] || 'Day ' + dayNumber}
        </p>
      </div>

      {/* Streak + Week Progress Row */}
      <div className="flex gap-3">
        {/* Streak Counter */}
        <div className="bg-card rounded-2xl p-4 border border-border flex flex-col items-center justify-center min-w-[90px]">
          <div className={`text-2xl mb-1 ${streak > 0 ? 'drop-shadow-[0_0_6px_rgba(239,68,68,0.5)]' : ''}`}>
            <Flame className={`w-7 h-7 ${streak > 0 ? 'text-orange-500' : 'text-muted-foreground'}`} />
          </div>
          <span className={`text-2xl font-bold ${streak > 0 ? 'text-foreground' : 'text-muted-foreground'}`}>
            {streak}
          </span>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">
            {streak === 1 ? 'day streak' : 'day streak'}
          </span>
        </div>

        {/* Week Progress */}
        <div className="bg-card rounded-2xl p-4 border border-border flex-1">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium">Week {weekNumber}</span>
            <span className="text-xs text-muted-foreground">{weekLogs.length}/5 workouts</span>
          </div>
          <div className="flex justify-between gap-2">
            {trainingDaysList.map(day => {
              const isDone = weekCompletedDays.has(day)
              const isCurrent = day === dayNumber
              return (
                <div key={day} className="flex flex-col items-center gap-1.5">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      isDone
                        ? 'bg-primary text-primary-foreground'
                        : isCurrent
                          ? 'ring-2 ring-primary bg-primary/10'
                          : 'bg-border/50'
                    }`}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <span className={`text-[10px] font-bold ${isCurrent ? 'text-primary' : 'text-muted-foreground'}`}>
                        {trainingDayLabels[day]}
                      </span>
                    )}
                  </div>
                  <span className={`text-[10px] font-medium ${
                    isCurrent ? 'text-primary' : 'text-muted-foreground'
                  }`}>
                    {trainingDayLabels[day]}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Today's Workout Card */}
      {workout ? (
        <div className="bg-card rounded-2xl border border-border overflow-hidden relative">
          {/* Gradient accent line on left */}
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-green-400 to-emerald-600 rounded-l-2xl" />

          <div className="p-4 pl-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">{workout.focus || 'Training'}</span>
              </div>
              {todayCompleted ? (
                <span className="flex items-center gap-1 text-xs text-success font-medium bg-green-500/10 px-2 py-1 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                </span>
              ) : (
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Dumbbell className="w-3 h-3" />
                    {exerciseCount} exercises
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    ~{estimatedMinutes} min
                  </span>
                </div>
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
                    {we.sets}x{we.reps || we.duration_seconds + 's'}
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
            className={`w-full py-4 font-semibold flex items-center justify-center gap-2 transition-colors ${
              todayCompleted
                ? 'bg-card border-t border-border text-muted-foreground hover:text-foreground hover:bg-background/50'
                : 'bg-primary text-primary-foreground hover:bg-primary/90'
            }`}
          >
            {todayCompleted ? (
              <>
                <Eye className="w-4 h-4" />
                View / Log Again
              </>
            ) : (
              <>
                <span className="relative flex items-center gap-2">
                  <span className="absolute -inset-1 rounded-full bg-primary-foreground/20 animate-ping" />
                  <Play className="w-4 h-4 relative" />
                </span>
                <span className="ml-1">Start Workout</span>
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="bg-card rounded-2xl p-8 border border-border text-center space-y-2">
          <p className="text-lg font-medium text-foreground">Rest Day</p>
          <p className="text-muted-foreground text-sm">Recover and stretch. You deserve it.</p>
        </div>
      )}

      {/* Calendar -- collapsed by default, shows current week row */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        {/* Calendar Header */}
        <button
          onClick={() => setCalendarExpanded(!calendarExpanded)}
          className="w-full flex items-center justify-between p-3 hover:bg-background/50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold">
              {calendarExpanded ? format(currentMonth, 'MMMM yyyy') : 'This Week'}
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span>{calendarExpanded ? 'Collapse' : 'Show full month'}</span>
            {calendarExpanded ? (
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            )}
          </div>
        </button>

        {/* Collapsed: Current week row */}
        {!calendarExpanded && (
          <div className="px-3 pb-3">
            {/* Day headers */}
            <div className="grid grid-cols-7 mb-1">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                <div key={i} className="text-center text-[10px] font-medium text-muted-foreground py-1">
                  {d}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-px">
              {currentWeekDays.map(day => renderCalendarDay(day, true))}
            </div>
          </div>
        )}

        {/* Expanded: Full month view */}
        {calendarExpanded && (
          <div className="px-3 pb-3">
            {/* Month nav */}
            <div className="flex items-center justify-between mb-2">
              <button
                onClick={() => setCurrentMonth(m => subMonths(m, 1))}
                className="p-1.5 rounded-lg hover:bg-background transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-muted-foreground" />
              </button>
              <button
                onClick={() => setCurrentMonth(new Date())}
                className="text-xs text-primary font-medium px-2 py-1 rounded-md hover:bg-primary/10 transition-colors"
              >
                Today
              </button>
              <button
                onClick={() => setCurrentMonth(m => addMonths(m, 1))}
                className="p-1.5 rounded-lg hover:bg-background transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 mb-1">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                <div key={i} className="text-center text-[10px] font-medium text-muted-foreground py-1">
                  {d}
                </div>
              ))}
            </div>

            {/* Day grid */}
            <div className="grid grid-cols-7 gap-px">
              {calDays.map(day => renderCalendarDay(day, isSameMonth(day, currentMonth)))}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-3 mt-2 pt-2 border-t border-border">
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                <span className="text-[9px] text-muted-foreground">P1</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                <span className="text-[9px] text-muted-foreground">P2</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                <span className="text-[9px] text-muted-foreground">P3</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle2 className="w-2.5 h-2.5 text-green-500" />
                <span className="text-[9px] text-muted-foreground">Done</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[8px] text-muted-foreground font-medium">DL</span>
                <span className="text-[9px] text-muted-foreground">Deload</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
