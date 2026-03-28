import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProfile } from '@/hooks/useProfile'
import { useTodayWorkout, useAllWorkouts, DAY_NAMES, TRAINING_DAYS } from '@/hooks/useProgram'
import { useWorkoutLogs } from '@/hooks/useWorkoutLog'
import {
  Crosshair,
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
  Target,
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

function getWorkoutForDate(
  date: Date,
  programStart: Date,
  workoutMap: Map<string, WorkoutSummary>
): WorkoutSummary | null {
  const diffMs = date.getTime() - programStart.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  if (diffDays < 0) return null
  const weekNumber = Math.floor(diffDays / 7) + 1
  if (weekNumber > 42) return null
  const jsDay = date.getDay()
  const dayOfWeek = jsDay === 0 ? 7 : jsDay
  return workoutMap.get(`${weekNumber}-${dayOfWeek}`) || null
}

function getPhaseForWeek(week: number): { label: string; color: string; glow: string } {
  if (week <= 12) return { label: 'P1', color: 'bg-cyan-500', glow: 'shadow-[0_0_4px_rgba(0,229,255,0.5)]' }
  if (week <= 20) return { label: 'P2', color: 'bg-amber-500', glow: 'shadow-[0_0_4px_rgba(245,158,11,0.5)]' }
  if (week <= 28) return { label: 'P3', color: 'bg-red-500', glow: 'shadow-[0_0_4px_rgba(239,68,68,0.5)]' }
  if (week <= 38) return { label: 'P4', color: 'bg-fuchsia-500', glow: 'shadow-[0_0_4px_rgba(217,70,239,0.5)]' }
  return { label: 'P5', color: 'bg-emerald-500', glow: 'shadow-[0_0_4px_rgba(16,185,129,0.5)]' }
}

const DELOAD_WEEKS = new Set([4, 8, 16, 24, 36])
const TEST_WEEKS = new Set([12, 20, 28])

function getGreeting(name: string, isTrainingDay: boolean): { greeting: string; message: string } {
  const hour = new Date().getHours()
  let timeGreeting: string
  if (hour < 6) timeGreeting = 'Up early'
  else if (hour < 12) timeGreeting = 'Good morning'
  else if (hour < 17) timeGreeting = 'Good afternoon'
  else if (hour < 21) timeGreeting = 'Good evening'
  else timeGreeting = 'Late grind'

  const trainingMessages = [
    'Protocol loaded. Execute.',
    'Target acquired. Time to work.',
    'Systems online. Begin sequence.',
    'Consistency is the algorithm.',
    'Show up. Execute. Repeat.',
  ]
  const restMessages = [
    'Recovery protocol active.',
    'System cooldown in progress.',
    'Recharge cycle initiated.',
    'Stand down. Restore energy.',
  ]

  const messages = isTrainingDay ? trainingMessages : restMessages
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
  )
  return { greeting: `${timeGreeting}, ${name}`, message: messages[dayOfYear % messages.length] }
}

function calculateStreak(
  logs: { workout_id: string; completed_at: string }[],
  programStart: Date
): number {
  if (logs.length === 0) return 0
  const completedDates = new Set<string>()
  for (const log of logs) {
    completedDates.add(format(new Date(log.completed_at), 'yyyy-MM-dd'))
  }
  const today = new Date()
  let streak = 0
  let current = new Date(today)
  const todayJs = today.getDay()
  const todayDow = todayJs === 0 ? 7 : todayJs
  const todayIsTraining = TRAINING_DAYS.has(todayDow)
  const todayKey = format(today, 'yyyy-MM-dd')
  const todayCompleted = completedDates.has(todayKey)
  if (todayIsTraining && !todayCompleted) {
    current.setDate(current.getDate() - 1)
  }
  for (let i = 0; i < 365; i++) {
    const key = format(current, 'yyyy-MM-dd')
    const jsDay = current.getDay()
    const dow = jsDay === 0 ? 7 : jsDay
    const isTraining = TRAINING_DAYS.has(dow)
    if (current < programStart) break
    if (isTraining) {
      if (completedDates.has(key)) streak++
      else break
    }
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

  const workoutMap = useMemo(() => {
    const map = new Map<string, WorkoutSummary>()
    for (const w of allWorkouts) {
      map.set(`${w.week_number}-${w.day_number}`, w)
    }
    return map
  }, [allWorkouts])

  const completedIds = useMemo(() => new Set(logs.map(l => l.workout_id)), [logs])
  const todayCompleted = workout ? completedIds.has(workout.id) : false

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
        completed.add(jsDay === 0 ? 7 : jsDay)
      }
    }
    return completed
  }, [logs, profile?.program_start_date, weekNumber])

  const streak = useMemo(() => {
    if (!profile?.program_start_date) return 0
    return calculateStreak(logs, new Date(profile.program_start_date))
  }, [logs, profile?.program_start_date])

  const programStart = profile?.program_start_date ? new Date(profile.program_start_date) : null
  const today = new Date()
  const currentWeekStart = startOfWeek(today, { weekStartsOn: 1 })
  const currentWeekEnd = endOfWeek(today, { weekStartsOn: 1 })
  const currentWeekDays = eachDayOfInterval({ start: currentWeekStart, end: currentWeekEnd })

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const calStart = startOfWeek(monthStart, { weekStartsOn: 1 })
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })
  const calDays = eachDayOfInterval({ start: calStart, end: calEnd })

  const programEnd = programStart ? addDays(programStart, 42 * 7 - 1) : null
  const isTrainingDay = TRAINING_DAYS.has(dayNumber)
  const displayName = profile?.display_name || 'Athlete'
  const { greeting, message } = getGreeting(displayName, isTrainingDay)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
      </div>
    )
  }

  if (!profile?.program_start_date) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-4 pt-16">
          <div className="w-16 h-16 rounded-lg border border-primary/30 bg-primary/5 flex items-center justify-center mx-auto neon-border">
            <Target className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-xl font-heading font-bold uppercase tracking-wider">Initialize Protocol</h2>
          <p className="text-sm text-muted-foreground">
            Set your program start date to begin the 42-week sequence.
          </p>
          <button
            onClick={() => navigate('/profile')}
            className="mt-4 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-heading font-semibold uppercase tracking-wider shadow-[0_0_16px_rgba(0,229,255,0.3)]"
          >
            Go to Config
          </button>
        </div>
      </div>
    )
  }

  const phaseLabel =
    weekNumber <= 12 ? 'Phase 1 // Foundation' :
    weekNumber <= 20 ? 'Phase 2 // Buildup' :
    weekNumber <= 28 ? 'Phase 3 // Intensity' :
    weekNumber <= 38 ? 'Phase 4 // Race Prep' :
    'Phase 5 // Taper'

  const exerciseCount = workout?.workout_exercises.length ?? 0
  const estimatedMinutes = exerciseCount > 0 ? Math.round(exerciseCount * 6 + 10) : 0

  const trainingDaysList = [1, 2, 3, 5, 6]
  const trainingDayLabels: Record<number, string> = { 1: 'M', 2: 'T', 3: 'W', 5: 'F', 6: 'S' }

  function renderCalendarDay(day: Date, inMonth: boolean = true) {
    const dayIsToday = isToday(day)
    const wo = programStart ? getWorkoutForDate(day, programStart, workoutMap) : null
    const isCompleted = wo ? completedIds.has(wo.id) : false
    const inProgram = programStart && programEnd && day >= programStart && day <= programEnd
    const diffFromStart = programStart ? Math.floor((day.getTime() - programStart.getTime()) / (1000 * 60 * 60 * 24)) : -1
    const weekNum = diffFromStart >= 0 ? Math.floor(diffFromStart / 7) + 1 : 0
    const deload = weekNum > 0 && weekNum <= 42 && DELOAD_WEEKS.has(weekNum)
    const testWeek = weekNum > 0 && weekNum <= 42 && TEST_WEEKS.has(weekNum)
    const phase = weekNum > 0 && weekNum <= 42 ? getPhaseForWeek(weekNum) : null

    return (
      <button
        key={day.toISOString()}
        disabled={!wo}
        onClick={() => wo && navigate(`/workout/${wo.id}`)}
        className={`
          relative flex flex-col items-center justify-center py-1.5 min-h-[40px] rounded transition-all
          ${!inMonth ? 'opacity-20' : ''}
          ${dayIsToday ? 'ring-1 ring-primary bg-primary/5' : ''}
          ${wo ? 'hover:bg-primary/10 cursor-pointer' : 'cursor-default'}
          ${isCompleted ? 'bg-success/8' : ''}
          ${inProgram && !wo && inMonth ? 'bg-card/30' : ''}
        `}
      >
        <span className={`text-[11px] font-mono leading-none ${
          dayIsToday ? 'font-bold text-primary' :
          wo ? 'font-bold text-foreground' :
          'text-muted-foreground'
        }`}>
          {format(day, 'd')}
        </span>

        {wo && (
          <div className="flex items-center gap-0.5 mt-0.5">
            {isCompleted ? (
              <CheckCircle2 className="w-2.5 h-2.5 text-success" />
            ) : (
              <div className={`w-1.5 h-1.5 rounded-full ${phase?.color || 'bg-primary'}`} />
            )}
          </div>
        )}

        {deload && inMonth && wo && (
          <span className="text-[7px] font-mono text-amber-400 leading-none">DL</span>
        )}
        {testWeek && inMonth && wo && (
          <span className="text-[7px] font-mono text-accent leading-none">T</span>
        )}
      </button>
    )
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Crosshair className="w-3.5 h-3.5 text-primary" />
          <p className="text-[10px] font-mono font-bold text-primary uppercase tracking-[0.2em]">{phaseLabel}</p>
        </div>
        <h1 className="text-2xl font-heading font-bold uppercase tracking-wide">{greeting}</h1>
        <p className="text-sm text-muted-foreground">{message}</p>
        <p className="text-xs font-mono text-muted-foreground mt-1">
          W{weekNumber} // {DAY_NAMES[dayNumber] || 'Day ' + dayNumber}
        </p>
      </div>

      {/* Streak + Week Progress */}
      <div className="flex gap-3">
        {/* Streak */}
        <div className="bg-card rounded-lg p-4 border border-border flex flex-col items-center justify-center min-w-[80px]">
          <Flame className={`w-6 h-6 mb-1 ${streak > 0 ? 'text-accent drop-shadow-[0_0_6px_rgba(255,45,111,0.5)]' : 'text-muted-foreground'}`} />
          <span className={`text-2xl font-mono font-bold ${streak > 0 ? 'text-foreground' : 'text-muted-foreground'}`}>
            {streak}
          </span>
          <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider">
            streak
          </span>
        </div>

        {/* Week Progress */}
        <div className="bg-card rounded-lg p-4 border border-border flex-1">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-heading font-bold uppercase tracking-wider">Week {weekNumber}</span>
            <span className="text-[10px] font-mono text-muted-foreground">{weekLogs.length}/5</span>
          </div>
          <div className="flex justify-between gap-2">
            {trainingDaysList.map(day => {
              const isDone = weekCompletedDays.has(day)
              const isCurrent = day === dayNumber
              return (
                <div key={day} className="flex flex-col items-center gap-1.5">
                  <div
                    className={`w-8 h-8 rounded flex items-center justify-center transition-all ${
                      isDone
                        ? 'bg-primary text-primary-foreground shadow-[0_0_8px_rgba(0,229,255,0.3)]'
                        : isCurrent
                          ? 'ring-1 ring-primary bg-primary/10'
                          : 'bg-border/30'
                    }`}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : (
                      <span className={`text-[10px] font-mono font-bold ${isCurrent ? 'text-primary' : 'text-muted-foreground'}`}>
                        {trainingDayLabels[day]}
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Today's Workout Card */}
      {workout ? (
        <div className="bg-card rounded-lg border border-border overflow-hidden relative">
          <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-cyan-400 to-primary/30" />

          <div className="p-4 pl-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-primary" />
                <span className="text-[10px] font-mono font-bold text-primary uppercase tracking-wider">{workout.focus || 'Training'}</span>
              </div>
              {todayCompleted ? (
                <span className="flex items-center gap-1 text-[10px] font-mono text-success font-bold bg-success/10 px-2 py-1 rounded">
                  <CheckCircle2 className="w-3 h-3" /> DONE
                </span>
              ) : (
                <div className="flex items-center gap-3 text-[10px] font-mono text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Crosshair className="w-3 h-3" />
                    {exerciseCount}x
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    ~{estimatedMinutes}m
                  </span>
                </div>
              )}
            </div>

            <h2 className="text-lg font-heading font-bold uppercase tracking-wide">{workout.name}</h2>

            <div className="space-y-1.5">
              {workout.workout_exercises.slice(0, 4).map((we) => (
                <div key={we.id} className="flex items-center gap-3 text-sm">
                  <div className="w-1 h-1 rounded-full bg-primary/50" />
                  <span className="text-muted-foreground text-xs">
                    {(we.exercise as { name: string }).name}
                  </span>
                  <span className="text-[10px] font-mono text-muted-foreground/50 ml-auto">
                    {we.sets}x{we.reps || we.duration_seconds + 's'}
                  </span>
                </div>
              ))}
              {workout.workout_exercises.length > 4 && (
                <p className="text-[10px] font-mono text-muted-foreground/60">
                  +{workout.workout_exercises.length - 4} more
                </p>
              )}
            </div>
          </div>

          <button
            onClick={() => navigate(`/workout/${workout.id}`)}
            className={`w-full py-3.5 font-heading font-bold uppercase tracking-wider text-sm flex items-center justify-center gap-2 transition-all ${
              todayCompleted
                ? 'bg-card border-t border-border text-muted-foreground hover:text-foreground'
                : 'bg-primary text-primary-foreground hover:shadow-[0_0_20px_rgba(0,229,255,0.3)]'
            }`}
          >
            {todayCompleted ? (
              <>
                <Eye className="w-4 h-4" />
                Review Session
              </>
            ) : (
              <>
                <span className="relative flex items-center gap-2">
                  <span className="absolute -inset-1 rounded-full bg-primary-foreground/20 animate-ping" />
                  <Play className="w-4 h-4 relative" />
                </span>
                <span className="ml-1">Execute Protocol</span>
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="bg-card rounded-lg p-8 border border-border text-center space-y-2">
          <p className="text-base font-heading font-bold uppercase tracking-wider text-muted-foreground">System Idle</p>
          <p className="text-muted-foreground text-xs font-mono">Recovery protocol active. Stand down.</p>
        </div>
      )}

      {/* Calendar */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <button
          onClick={() => setCalendarExpanded(!calendarExpanded)}
          className="w-full flex items-center justify-between p-3.5 hover:bg-primary/5 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-heading font-bold uppercase tracking-wider">
              {calendarExpanded ? format(currentMonth, 'MMMM yyyy') : 'This Week'}
            </span>
          </div>
          <div className="flex items-center gap-1 text-[10px] font-mono text-muted-foreground">
            <span>{calendarExpanded ? 'Collapse' : 'Expand'}</span>
            {calendarExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </div>
        </button>

        {!calendarExpanded && (
          <div className="px-3.5 pb-3.5">
            <div className="grid grid-cols-7 mb-1">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                <div key={i} className="text-center text-[9px] font-mono font-bold text-muted-foreground py-1">
                  {d}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-px">
              {currentWeekDays.map(day => renderCalendarDay(day, true))}
            </div>
          </div>
        )}

        {calendarExpanded && (
          <div className="px-3.5 pb-3.5">
            <div className="flex items-center justify-between mb-2">
              <button
                onClick={() => setCurrentMonth(m => subMonths(m, 1))}
                className="p-1.5 rounded hover:bg-primary/10 transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-muted-foreground" />
              </button>
              <button
                onClick={() => setCurrentMonth(new Date())}
                className="text-[10px] font-mono text-primary font-bold px-2 py-1 rounded hover:bg-primary/10 transition-colors"
              >
                TODAY
              </button>
              <button
                onClick={() => setCurrentMonth(m => addMonths(m, 1))}
                className="p-1.5 rounded hover:bg-primary/10 transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            <div className="grid grid-cols-7 mb-1">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                <div key={i} className="text-center text-[9px] font-mono font-bold text-muted-foreground py-1">
                  {d}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-px">
              {calDays.map(day => renderCalendarDay(day, isSameMonth(day, currentMonth)))}
            </div>

            <div className="flex items-center gap-3 mt-2 pt-2 border-t border-border flex-wrap">
              {[
                { color: 'bg-cyan-500', label: 'P1' },
                { color: 'bg-amber-500', label: 'P2' },
                { color: 'bg-red-500', label: 'P3' },
                { color: 'bg-fuchsia-500', label: 'P4' },
                { color: 'bg-emerald-500', label: 'P5' },
              ].map(p => (
                <div key={p.label} className="flex items-center gap-1">
                  <div className={`w-1.5 h-1.5 rounded-full ${p.color}`} />
                  <span className="text-[8px] font-mono text-muted-foreground">{p.label}</span>
                </div>
              ))}
              <div className="flex items-center gap-1">
                <CheckCircle2 className="w-2.5 h-2.5 text-success" />
                <span className="text-[8px] font-mono text-muted-foreground">Done</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
