import { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  usePrograms,
  useAllWorkouts,
  DAY_NAMES,
} from '@/hooks/useProgram'
import type { WorkoutSummary } from '@/hooks/useProgram'
import { useWorkoutLogs } from '@/hooks/useWorkoutLog'
import { useProfile } from '@/hooks/useProfile'
import {
  ChevronDown,
  ChevronRight,
  Loader2,
  CheckCircle2,
  MapPin,
  Trophy,
} from 'lucide-react'

const DELOAD_WEEKS = new Set([4, 8, 16, 24, 36])
const TEST_WEEKS = new Set([12, 20, 28])

const PHASE_LABELS = ['Foundation', 'Buildup', 'Intensity', 'Race Prep', 'Taper']

function getPhaseIndex(week: number): number {
  if (week <= 12) return 0
  if (week <= 20) return 1
  if (week <= 28) return 2
  if (week <= 38) return 3
  return 4
}

function computeCurrentWeek(programStartDate: string | null): number {
  if (!programStartDate) return 1
  const start = new Date(programStartDate)
  const diffDays = Math.floor((Date.now() - start.getTime()) / (1000 * 60 * 60 * 24))
  if (diffDays < 0) return 1
  return Math.min(Math.floor(diffDays / 7) + 1, 42)
}

// Compact week row
function WeekRow({
  weekNumber, currentWeek, completedIds, allWorkouts, isExpanded, onToggle,
}: {
  weekNumber: number; currentWeek: number; completedIds: Set<string>
  allWorkouts: WorkoutSummary[]; isExpanded: boolean; onToggle: () => void
}) {
  const navigate = useNavigate()
  const contentRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(0)

  const isDeload = DELOAD_WEEKS.has(weekNumber)
  const isTest = TEST_WEEKS.has(weekNumber)
  const isCurrent = weekNumber === currentWeek
  const isPast = weekNumber < currentWeek
  const weekWorkouts = allWorkouts.filter(w => w.week_number === weekNumber)
  const doneCount = weekWorkouts.filter(w => completedIds.has(w.id)).length
  const totalCount = weekWorkouts.length
  const allComplete = doneCount === totalCount && totalCount > 0

  useEffect(() => {
    if (contentRef.current) setHeight(contentRef.current.scrollHeight)
  }, [isExpanded, weekWorkouts.length])

  return (
    <div className={`rounded-xl overflow-hidden transition-colors duration-150 ${
      isCurrent ? 'bg-card border border-primary/20' : 'bg-card/50 border border-transparent'
    }`}>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className={`text-sm font-semibold tabular-nums ${
            isCurrent ? 'text-primary' : isPast ? 'text-muted-foreground' : 'text-foreground'
          }`}>
            W{weekNumber}
          </span>

          {isCurrent && (
            <span className="flex items-center gap-0.5 text-[10px] font-medium text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">
              <MapPin className="w-2.5 h-2.5" />
              Now
            </span>
          )}
          {isDeload && (
            <span className="text-[10px] font-medium text-amber-400/80 bg-amber-400/8 px-1.5 py-0.5 rounded-full">
              Deload
            </span>
          )}
          {isTest && (
            <span className="text-[10px] font-medium text-blue-400/80 bg-blue-400/8 px-1.5 py-0.5 rounded-full">
              Test
            </span>
          )}

          {allComplete && (
            <Trophy className="w-3.5 h-3.5 text-success" />
          )}
        </div>

        <div className="flex items-center gap-2.5">
          {/* Mini dots */}
          <div className="flex gap-0.5">
            {weekWorkouts.map(w => (
              <div
                key={w.id}
                className={`w-1.5 h-1.5 rounded-full ${
                  completedIds.has(w.id) ? 'bg-success' : 'bg-border'
                }`}
              />
            ))}
          </div>
          <span className="text-[11px] text-muted-foreground tabular-nums w-8 text-right">
            {doneCount}/{totalCount}
          </span>
          <ChevronDown
            className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${
              isExpanded ? 'rotate-180' : ''
            }`}
          />
        </div>
      </button>

      <div
        className="overflow-hidden transition-[max-height] duration-200 ease-in-out"
        style={{ maxHeight: isExpanded ? `${height}px` : '0px' }}
      >
        <div ref={contentRef} className="px-3 pb-3 space-y-1.5">
          {weekWorkouts
            .sort((a, b) => a.day_number - b.day_number)
            .map(workout => {
              const done = completedIds.has(workout.id)
              return (
                <button
                  key={workout.id}
                  onClick={() => navigate(`/workout/${workout.id}`)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors active:scale-[0.98] ${
                    done ? 'bg-success/5' : 'bg-background/50 hover:bg-background/80'
                  }`}
                >
                  <span className={`text-[11px] font-medium w-8 shrink-0 ${
                    done ? 'text-success' : 'text-muted-foreground'
                  }`}>
                    {DAY_NAMES[workout.day_number] || `D${workout.day_number}`}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-[13px] font-medium truncate ${
                      done ? 'text-muted-foreground' : 'text-foreground'
                    }`}>
                      {workout.name}
                    </p>
                    {workout.focus && (
                      <p className="text-[10px] text-muted-foreground truncate">{workout.focus}</p>
                    )}
                  </div>
                  {done ? (
                    <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50 shrink-0" />
                  )}
                </button>
              )
            })}
        </div>
      </div>
    </div>
  )
}

export default function ProgramPage() {
  const { programs, loading: programsLoading } = usePrograms()
  const { workouts: allWorkouts, loading: workoutsLoading } = useAllWorkouts()
  const { logs, loading: logsLoading } = useWorkoutLogs()
  const { profile, loading: profileLoading } = useProfile()

  const loading = programsLoading || workoutsLoading || logsLoading || profileLoading

  const currentWeek = useMemo(
    () => computeCurrentWeek(profile?.program_start_date ?? null),
    [profile?.program_start_date],
  )

  const completedIds = useMemo(
    () => new Set(logs.map(l => l.workout_id)),
    [logs],
  )

  // Expand current week + next 4 by default
  const [expandedWeeks, setExpandedWeeks] = useState<Set<number>>(new Set())
  const [collapsedPhases, setCollapsedPhases] = useState<Set<number>>(new Set())
  const initialized = useRef(false)

  useEffect(() => {
    if (!loading && !initialized.current) {
      const initial = new Set<number>()
      for (let w = currentWeek; w <= Math.min(currentWeek + 4, 42); w++) {
        initial.add(w)
      }
      setExpandedWeeks(initial)

      // Collapse phases that are fully past (not containing current week)
      const collapsed = new Set<number>()
      for (let pi = 0; pi < programs.length; pi++) {
        const p = programs[pi]
        if (p.week_end < currentWeek) {
          collapsed.add(pi)
        }
      }
      setCollapsedPhases(collapsed)

      initialized.current = true
    }
  }, [loading, currentWeek, programs])

  const toggleWeek = useCallback((week: number) => {
    setExpandedWeeks(prev => {
      const next = new Set(prev)
      if (next.has(week)) next.delete(week)
      else next.add(week)
      return next
    })
  }, [])

  const togglePhase = useCallback((index: number) => {
    setCollapsedPhases(prev => {
      const next = new Set(prev)
      if (next.has(index)) next.delete(index)
      else next.add(index)
      return next
    })
  }, [])

  // Phase completion
  const phaseCompletion = useMemo(() => {
    return programs.map(program => {
      const phaseWorkouts = allWorkouts.filter(
        w => w.week_number >= program.week_start && w.week_number <= program.week_end,
      )
      if (phaseWorkouts.length === 0) return 0
      const done = phaseWorkouts.filter(w => completedIds.has(w.id)).length
      return Math.round((done / phaseWorkouts.length) * 100)
    })
  }, [programs, allWorkouts, completedIds])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-5 h-5 text-primary animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-5 pb-8 pt-2">
      <div>
        <h1 className="text-[22px] font-semibold tracking-tight">Program</h1>
        <p className="text-sm text-muted-foreground">
          42 weeks &middot; Amsterdam 2027
        </p>
      </div>

      {/* Phase progress bar */}
      <div className="flex gap-1 h-1.5 rounded-full overflow-hidden bg-secondary">
        {programs.map((_, i) => {
          const pct = phaseCompletion[i]
          const currentPhaseIdx = getPhaseIndex(currentWeek)
          return (
            <div key={i} className="flex-1 relative overflow-hidden rounded-full">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  i < currentPhaseIdx ? 'bg-success/60' :
                  i === currentPhaseIdx ? 'bg-primary' :
                  'bg-transparent'
                }`}
                style={{ width: `${pct}%` }}
              />
            </div>
          )
        })}
      </div>

      {/* Weeks grouped by phase */}
      {programs.map((program, pi) => {
        const isCollapsed = collapsedPhases.has(pi)
        const currentPhaseIdx = getPhaseIndex(currentWeek)
        const isCurrentPhase = pi === currentPhaseIdx
        const isPastPhase = pi < currentPhaseIdx
        const weeks = Array.from(
          { length: program.week_end - program.week_start + 1 },
          (_, i) => program.week_start + i,
        )
        const pct = phaseCompletion[pi]

        return (
          <div key={program.id} className="space-y-1.5">
            {/* Phase header */}
            <button
              onClick={() => togglePhase(pi)}
              className="w-full flex items-center justify-between py-2"
            >
              <div className="flex items-center gap-2">
                <h2 className={`text-xs font-semibold uppercase tracking-wider ${
                  isCurrentPhase ? 'text-primary' : isPastPhase ? 'text-muted-foreground' : 'text-foreground/60'
                }`}>
                  Phase {pi + 1} &middot; {PHASE_LABELS[pi]}
                </h2>
                <span className="text-[10px] text-muted-foreground">
                  W{program.week_start}-{program.week_end}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-muted-foreground tabular-nums">{pct}%</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-muted-foreground transition-transform duration-200 ${
                    isCollapsed ? '-rotate-90' : ''
                  }`}
                />
              </div>
            </button>

            {/* Weeks */}
            {!isCollapsed && (
              <div className="space-y-1">
                {weeks.map(week => (
                  <WeekRow
                    key={week}
                    weekNumber={week}
                    currentWeek={currentWeek}
                    completedIds={completedIds}
                    allWorkouts={allWorkouts}
                    isExpanded={expandedWeeks.has(week)}
                    onToggle={() => toggleWeek(week)}
                  />
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
