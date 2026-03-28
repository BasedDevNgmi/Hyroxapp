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
  Dumbbell,
  Flame,
  Zap,
  MapPin,
  Trophy,
  Target,
} from 'lucide-react'

// ── Phase config ──────────────────────────────────────
const PHASE_CONFIG = [
  {
    label: 'Phase 1',
    name: 'Foundation',
    accent: '#3b82f6',    // blue-500
    accentBg: 'rgba(59,130,246,0.12)',
    accentBorder: 'rgba(59,130,246,0.35)',
    icon: Dumbbell,
  },
  {
    label: 'Phase 2',
    name: 'Buildup',
    accent: '#f59e0b',    // amber-500
    accentBg: 'rgba(245,158,11,0.12)',
    accentBorder: 'rgba(245,158,11,0.35)',
    icon: Flame,
  },
  {
    label: 'Phase 3',
    name: 'Intensity',
    accent: '#ef4444',    // red-500
    accentBg: 'rgba(239,68,68,0.12)',
    accentBorder: 'rgba(239,68,68,0.35)',
    icon: Zap,
  },
  {
    label: 'Phase 4',
    name: 'Race Prep',
    accent: '#a855f7',    // purple-500
    accentBg: 'rgba(168,85,247,0.12)',
    accentBorder: 'rgba(168,85,247,0.35)',
    icon: Trophy,
  },
  {
    label: 'Phase 5',
    name: 'Taper',
    accent: '#10b981',    // emerald-500
    accentBg: 'rgba(16,185,129,0.12)',
    accentBorder: 'rgba(16,185,129,0.35)',
    icon: Target,
  },
] as const

const DELOAD_WEEKS = new Set([4, 8, 16, 24, 36])
const TEST_WEEKS = new Set([12, 20, 28])

// ── Helpers ───────────────────────────────────────────
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
  const diffDays = Math.floor(
    (Date.now() - start.getTime()) / (1000 * 60 * 60 * 24),
  )
  if (diffDays < 0) return 1
  return Math.min(Math.floor(diffDays / 7) + 1, 42)
}

// ── Accordion row for a single week ───────────────────
function WeekRow({
  weekNumber,
  currentWeek,
  phaseIndex,
  completedIds,
  allWorkouts,
  isExpanded,
  onToggle,
}: {
  weekNumber: number
  currentWeek: number
  phaseIndex: number
  completedIds: Set<string>
  allWorkouts: WorkoutSummary[]
  isExpanded: boolean
  onToggle: () => void
}) {
  const navigate = useNavigate()
  const contentRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(0)

  const phase = PHASE_CONFIG[phaseIndex]
  const isDeload = DELOAD_WEEKS.has(weekNumber)
  const isTest = TEST_WEEKS.has(weekNumber)
  const isCurrent = weekNumber === currentWeek
  const weekWorkouts = allWorkouts.filter(
    (w) => w.week_number === weekNumber,
  )
  const doneCount = weekWorkouts.filter((w) => completedIds.has(w.id)).length
  const totalCount = weekWorkouts.length

  // Measure content for smooth expand
  useEffect(() => {
    if (contentRef.current) {
      setHeight(contentRef.current.scrollHeight)
    }
  }, [isExpanded, weekWorkouts.length])

  return (
    <div
      className={`rounded-xl border transition-colors duration-200 ${
        isDeload
          ? 'border-dashed border-border/60'
          : isCurrent
            ? 'border-border'
            : 'border-border/50'
      }`}
      style={{
        borderLeftWidth: '3px',
        borderLeftColor: phase.accent,
        borderLeftStyle: isDeload ? 'dashed' : 'solid',
      }}
    >
      {/* Header */}
      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between px-5 py-4 transition-colors rounded-xl ${
          isCurrent ? 'bg-primary/5' : 'bg-card hover:bg-card/80'
        }`}
      >
        <div className="flex items-center gap-3">
          {/* Week number badge */}
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${
              isCurrent
                ? 'bg-primary text-primary-foreground'
                : doneCount === totalCount && totalCount > 0
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'bg-border/50 text-muted-foreground'
            }`}
          >
            {doneCount === totalCount && totalCount > 0 ? (
              <Trophy className="w-4 h-4" />
            ) : (
              weekNumber
            )}
          </div>

          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-foreground">
                Week {weekNumber}
              </span>
              {isCurrent && (
                <span className="inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-primary/15 text-primary">
                  <MapPin className="w-2.5 h-2.5" />
                  NOW
                </span>
              )}
              {isDeload && (
                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-amber-500/15 text-amber-400">
                  DELOAD
                </span>
              )}
              {isTest && (
                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-primary/15 text-primary">
                  TEST
                </span>
              )}
            </div>
            <span className="text-xs text-muted-foreground">
              {doneCount}/{totalCount} done
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Mini completion dots */}
          <div className="flex gap-1">
            {weekWorkouts.map((w) => (
              <div
                key={w.id}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  completedIds.has(w.id) ? 'bg-emerald-400' : 'bg-border'
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

      {/* Expandable content */}
      <div
        className="overflow-hidden transition-[max-height] duration-300 ease-in-out"
        style={{ maxHeight: isExpanded ? `${height}px` : '0px' }}
      >
        <div ref={contentRef} className="px-5 pb-5 pt-2 space-y-3">
          {weekWorkouts
            .sort((a, b) => a.day_number - b.day_number)
            .map((workout) => {
              const done = completedIds.has(workout.id)
              return (
                <button
                  key={workout.id}
                  onClick={() => navigate(`/workout/${workout.id}`)}
                  className={`w-full flex items-center gap-4 p-4 rounded-lg border text-left transition-all active:scale-[0.98] ${
                    done
                      ? 'bg-emerald-500/5 border-emerald-500/20'
                      : 'bg-background/50 border-border/40 hover:border-border'
                  }`}
                >
                  {/* Day badge */}
                  <div
                    className={`w-11 h-11 rounded-lg flex flex-col items-center justify-center text-[10px] font-semibold shrink-0 ${
                      done
                        ? 'bg-emerald-500/15 text-emerald-400'
                        : 'bg-border/30 text-muted-foreground'
                    }`}
                  >
                    <span className="leading-none">
                      {DAY_NAMES[workout.day_number] || `D${workout.day_number}`}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-medium truncate ${
                        done ? 'text-foreground/70' : 'text-foreground'
                      }`}
                    >
                      {workout.name}
                    </p>
                    {workout.focus && (
                      <p className="text-xs text-muted-foreground truncate">
                        {workout.focus}
                      </p>
                    )}
                  </div>

                  {/* Status */}
                  {done ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-muted-foreground -rotate-90 shrink-0" />
                  )}
                </button>
              )
            })}

          {weekWorkouts.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-6">
              No workouts scheduled
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────
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

  // Track completed workout IDs
  const completedIds = useMemo(
    () => new Set(logs.map((l) => l.workout_id)),
    [logs],
  )

  // Accordion state: expand current week by default
  const [expandedWeeks, setExpandedWeeks] = useState<Set<number>>(new Set())
  const initialized = useRef(false)

  useEffect(() => {
    if (!loading && !initialized.current) {
      setExpandedWeeks(new Set([currentWeek]))
      initialized.current = true
    }
  }, [loading, currentWeek])

  const toggleWeek = useCallback((week: number) => {
    setExpandedWeeks((prev) => {
      const next = new Set(prev)
      if (next.has(week)) {
        next.delete(week)
      } else {
        next.add(week)
      }
      return next
    })
  }, [])

  // Refs for scroll-to-phase
  const phaseRefs = useRef<(HTMLDivElement | null)[]>([null, null, null, null, null])

  const scrollToPhase = useCallback((index: number) => {
    phaseRefs.current[index]?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }, [])

  // Compute phase completion percentages
  const phaseCompletion = useMemo(() => {
    return programs.map((program) => {
      const phaseWorkouts = allWorkouts.filter(
        (w) =>
          w.week_number >= program.week_start &&
          w.week_number <= program.week_end,
      )
      if (phaseWorkouts.length === 0) return 0
      const done = phaseWorkouts.filter((w) => completedIds.has(w.id)).length
      return Math.round((done / phaseWorkouts.length) * 100)
    })
  }, [programs, allWorkouts, completedIds])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Program</h1>
        <p className="text-sm text-muted-foreground mt-1">
          42-Week Hybrid Athlete Plan — Amsterdam 2027
        </p>
      </div>

      {/* ── Phase overview cards ─────────────────────────── */}
      <div className="flex gap-4 overflow-x-auto pb-1 -mx-1 px-1 snap-x snap-mandatory scrollbar-hide">
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
              className={`shrink-0 snap-start w-[calc(28%-8px)] min-w-[120px] rounded-xl p-4 border text-left transition-all active:scale-[0.97] ${
                isCurrent ? 'ring-1' : ''
              }`}
              style={{
                backgroundColor: config.accentBg,
                borderColor: isCurrent ? config.accent : config.accentBorder,
                ...(isCurrent ? { ringColor: config.accent } : {}),
              }}
            >
              <div className="flex items-center gap-1.5 mb-2">
                <Icon
                  className="w-3.5 h-3.5"
                  style={{ color: config.accent }}
                />
                <span
                  className="text-[10px] font-bold uppercase tracking-wider"
                  style={{ color: config.accent }}
                >
                  {config.label}
                </span>
              </div>

              <p className="text-xs font-medium text-foreground leading-tight mb-1 line-clamp-2">
                {config.name}
              </p>

              <p className="text-[10px] text-muted-foreground mb-2">
                Weeks {program.week_start}-{program.week_end}
              </p>

              {/* Progress bar */}
              <div className="w-full h-1.5 rounded-full bg-border/40 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: config.accent,
                  }}
                />
              </div>
              <p
                className="text-[10px] font-medium mt-1"
                style={{ color: config.accent }}
              >
                {pct}%
              </p>
            </button>
          )
        })}
      </div>

      {/* ── Week accordion by phase ──────────────────────── */}
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
            ref={(el) => {
              phaseRefs.current[pi] = el
            }}
            className="space-y-3"
          >
            {/* Phase section header */}
            <div className="flex items-center gap-2 pt-2 pb-1">
              <Icon
                className="w-4 h-4"
                style={{ color: config.accent }}
              />
              <h2
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: config.accent }}
              >
                {config.label} &mdash; {config.name}
              </h2>
            </div>

            {weeks.map((week) => (
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
