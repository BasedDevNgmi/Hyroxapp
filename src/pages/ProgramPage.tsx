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
  Loader2,
  CheckCircle2,
  Crosshair,
  Flame,
  Zap,
  MapPin,
  Trophy,
  Target,
} from 'lucide-react'

const PHASE_CONFIG = [
  {
    label: 'Phase 1',
    name: 'Foundation',
    accent: '#00e5ff',
    accentBg: 'rgba(0,229,255,0.06)',
    accentBorder: 'rgba(0,229,255,0.2)',
    icon: Crosshair,
  },
  {
    label: 'Phase 2',
    name: 'Buildup',
    accent: '#f59e0b',
    accentBg: 'rgba(245,158,11,0.06)',
    accentBorder: 'rgba(245,158,11,0.2)',
    icon: Flame,
  },
  {
    label: 'Phase 3',
    name: 'Intensity',
    accent: '#ef4444',
    accentBg: 'rgba(239,68,68,0.06)',
    accentBorder: 'rgba(239,68,68,0.2)',
    icon: Zap,
  },
  {
    label: 'Phase 4',
    name: 'Race Prep',
    accent: '#d946ef',
    accentBg: 'rgba(217,70,239,0.06)',
    accentBorder: 'rgba(217,70,239,0.2)',
    icon: Trophy,
  },
  {
    label: 'Phase 5',
    name: 'Taper',
    accent: '#10b981',
    accentBg: 'rgba(16,185,129,0.06)',
    accentBorder: 'rgba(16,185,129,0.2)',
    icon: Target,
  },
] as const

const DELOAD_WEEKS = new Set([4, 8, 16, 24, 36])
const TEST_WEEKS = new Set([12, 20, 28])

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

function WeekRow({
  weekNumber, currentWeek, phaseIndex, completedIds, allWorkouts, isExpanded, onToggle,
}: {
  weekNumber: number; currentWeek: number; phaseIndex: number; completedIds: Set<string>
  allWorkouts: WorkoutSummary[]; isExpanded: boolean; onToggle: () => void
}) {
  const navigate = useNavigate()
  const contentRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(0)

  const phase = PHASE_CONFIG[phaseIndex]
  const isDeload = DELOAD_WEEKS.has(weekNumber)
  const isTest = TEST_WEEKS.has(weekNumber)
  const isCurrent = weekNumber === currentWeek
  const weekWorkouts = allWorkouts.filter(w => w.week_number === weekNumber)
  const doneCount = weekWorkouts.filter(w => completedIds.has(w.id)).length
  const totalCount = weekWorkouts.length

  useEffect(() => {
    if (contentRef.current) setHeight(contentRef.current.scrollHeight)
  }, [isExpanded, weekWorkouts.length])

  return (
    <div
      className="rounded-lg border transition-colors duration-200"
      style={{
        borderColor: isCurrent ? phase.accent + '60' : undefined,
        borderLeftWidth: '2px',
        borderLeftColor: phase.accent,
        borderLeftStyle: isDeload ? 'dashed' : 'solid',
      }}
    >
      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between px-4 py-3 transition-colors rounded-lg ${
          isCurrent ? 'bg-primary/5' : 'bg-card hover:bg-card/80'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-7 h-7 rounded flex items-center justify-center text-xs font-mono font-bold shrink-0 ${
              isCurrent
                ? 'bg-primary text-primary-foreground shadow-[0_0_8px_rgba(0,229,255,0.3)]'
                : doneCount === totalCount && totalCount > 0
                  ? 'bg-success/15 text-success'
                  : 'bg-border/30 text-muted-foreground'
            }`}
          >
            {doneCount === totalCount && totalCount > 0 ? (
              <Trophy className="w-3.5 h-3.5" />
            ) : (
              weekNumber
            )}
          </div>

          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="text-sm font-heading font-bold uppercase tracking-wider text-foreground">
                W{weekNumber}
              </span>
              {isCurrent && (
                <span className="inline-flex items-center gap-1 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-primary/15 text-primary">
                  <MapPin className="w-2.5 h-2.5" />
                  NOW
                </span>
              )}
              {isDeload && (
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400">
                  DELOAD
                </span>
              )}
              {isTest && (
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-accent/15 text-accent">
                  TEST
                </span>
              )}
            </div>
            <span className="text-[10px] font-mono text-muted-foreground">
              {doneCount}/{totalCount} complete
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            {weekWorkouts.map(w => (
              <div
                key={w.id}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  completedIds.has(w.id) ? 'bg-success' : 'bg-border'
                }`}
              />
            ))}
          </div>
          <ChevronDown
            className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${
              isExpanded ? 'rotate-180' : ''
            }`}
          />
        </div>
      </button>

      <div
        className="overflow-hidden transition-[max-height] duration-300 ease-in-out"
        style={{ maxHeight: isExpanded ? `${height}px` : '0px' }}
      >
        <div ref={contentRef} className="px-4 pb-4 pt-1 space-y-2">
          {weekWorkouts
            .sort((a, b) => a.day_number - b.day_number)
            .map(workout => {
              const done = completedIds.has(workout.id)
              return (
                <button
                  key={workout.id}
                  onClick={() => navigate(`/workout/${workout.id}`)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-all active:scale-[0.98] ${
                    done
                      ? 'bg-success/5 border-success/15'
                      : 'bg-background/30 border-border/40 hover:border-primary/30'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded flex flex-col items-center justify-center text-[10px] font-mono font-bold shrink-0 ${
                      done
                        ? 'bg-success/10 text-success'
                        : 'bg-border/20 text-muted-foreground'
                    }`}
                  >
                    {DAY_NAMES[workout.day_number] || `D${workout.day_number}`}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-heading font-bold uppercase tracking-wide truncate ${
                      done ? 'text-foreground/60' : 'text-foreground'
                    }`}>
                      {workout.name}
                    </p>
                    {workout.focus && (
                      <p className="text-[10px] font-mono text-muted-foreground truncate">{workout.focus}</p>
                    )}
                  </div>
                  {done ? (
                    <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-muted-foreground -rotate-90 shrink-0" />
                  )}
                </button>
              )
            })}
          {weekWorkouts.length === 0 && (
            <p className="text-[10px] font-mono text-muted-foreground text-center py-4">
              No workouts scheduled
            </p>
          )}
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
  const currentPhaseIndex = getPhaseIndex(currentWeek)

  const completedIds = useMemo(
    () => new Set(logs.map(l => l.workout_id)),
    [logs],
  )

  const [expandedWeeks, setExpandedWeeks] = useState<Set<number>>(new Set())
  const initialized = useRef(false)

  useEffect(() => {
    if (!loading && !initialized.current) {
      setExpandedWeeks(new Set([currentWeek]))
      initialized.current = true
    }
  }, [loading, currentWeek])

  const toggleWeek = useCallback((week: number) => {
    setExpandedWeeks(prev => {
      const next = new Set(prev)
      if (next.has(week)) next.delete(week)
      else next.add(week)
      return next
    })
  }, [])

  const phaseRefs = useRef<(HTMLDivElement | null)[]>([null, null, null, null, null])

  const scrollToPhase = useCallback((index: number) => {
    phaseRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

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
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="text-2xl font-heading font-bold uppercase tracking-wider text-foreground">Protocol</h1>
        <p className="text-[10px] font-mono text-muted-foreground mt-1 tracking-wider">
          42-WEEK HYBRID ATHLETE SEQUENCE // AMSTERDAM 2027
        </p>
      </div>

      {/* Phase cards */}
      <div className="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1 snap-x snap-mandatory scrollbar-hide">
        {programs.map((program, i) => {
          const config = PHASE_CONFIG[i]
          if (!config) return null
          const Icon = config.icon
          const isCurrent = i === currentPhaseIndex
          const pct = phaseCompletion[i]

          return (
            <button
              key={program.id}
              onClick={() => scrollToPhase(i)}
              className={`shrink-0 snap-start w-[110px] rounded-lg p-3 border text-left transition-all active:scale-[0.97] ${
                isCurrent ? 'ring-1' : ''
              }`}
              style={{
                backgroundColor: config.accentBg,
                borderColor: isCurrent ? config.accent : config.accentBorder,
                ...(isCurrent ? { ringColor: config.accent } : {}),
              }}
            >
              <div className="flex items-center gap-1.5 mb-2">
                <Icon className="w-3 h-3" style={{ color: config.accent }} />
                <span
                  className="text-[9px] font-mono font-bold uppercase tracking-wider"
                  style={{ color: config.accent }}
                >
                  {config.label}
                </span>
              </div>
              <p className="text-[11px] font-heading font-bold text-foreground uppercase tracking-wider leading-tight mb-1">
                {config.name}
              </p>
              <p className="text-[9px] font-mono text-muted-foreground mb-2">
                W{program.week_start}-{program.week_end}
              </p>
              <div className="w-full h-1 rounded-full bg-border/40 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${pct}%`, backgroundColor: config.accent }}
                />
              </div>
              <p className="text-[9px] font-mono font-bold mt-1" style={{ color: config.accent }}>
                {pct}%
              </p>
            </button>
          )
        })}
      </div>

      {/* Weeks by phase */}
      {programs.map((program, pi) => {
        const config = PHASE_CONFIG[pi]
        if (!config) return null
        const Icon = config.icon
        const weeks = Array.from(
          { length: program.week_end - program.week_start + 1 },
          (_, i) => program.week_start + i,
        )

        return (
          <div
            key={program.id}
            ref={el => { phaseRefs.current[pi] = el }}
            className="space-y-2"
          >
            <div className="flex items-center gap-2 pt-2 pb-1">
              <Icon className="w-3.5 h-3.5" style={{ color: config.accent }} />
              <h2
                className="text-[10px] font-mono font-bold uppercase tracking-[0.2em]"
                style={{ color: config.accent }}
              >
                {config.label} // {config.name}
              </h2>
            </div>

            {weeks.map(week => (
              <WeekRow
                key={week}
                weekNumber={week}
                currentWeek={currentWeek}
                phaseIndex={pi}
                completedIds={completedIds}
                allWorkouts={allWorkouts}
                isExpanded={expandedWeeks.has(week)}
                onToggle={() => toggleWeek(week)}
              />
            ))}
          </div>
        )
      })}
    </div>
  )
}
