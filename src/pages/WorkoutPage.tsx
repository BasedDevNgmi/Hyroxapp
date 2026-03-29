import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useWorkout } from '@/hooks/useProgram'
import { useWorkoutLog, type ExerciseLogDraft } from '@/hooks/useWorkoutLog'
import { getWorkoutByWeekDay } from '@/data/program'
import {
  ArrowLeft,
  Check,
  Loader2,
  ChevronDown,
  ChevronUp,
  Save,
  Trophy,
  AlertTriangle,
  Timer,
  X,
  Minus,
  Plus,
  Heart,
} from 'lucide-react'
import { PREHAB_ITEMS } from '@/data/helpers'

const confettiColors = ['#c9a96e', '#4a9', '#5b8def', '#e8746a', '#d4af37', '#7ec8e3', '#b87ee6', '#f0c27f']

function ConfettiPiece({ index }: { index: number }) {
  const color = confettiColors[index % confettiColors.length]
  const left = `${(index * 7.3 + 3) % 100}%`
  const delay = `${(index * 0.15) % 2.5}s`
  const duration = `${2 + (index % 3) * 0.7}s`
  const size = index % 3 === 0 ? 8 : index % 3 === 1 ? 6 : 10
  const isSquare = index % 2 === 0
  return (
    <div style={{
      position: 'absolute', top: '-12px', left, width: size, height: size,
      backgroundColor: color, borderRadius: isSquare ? '1px' : '50%',
      opacity: 0, animation: `confettiFall ${duration} ${delay} ease-out forwards`,
    }} />
  )
}

function ConfettiOverlay() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      <style>{`
        @keyframes confettiFall {
          0% { opacity: 1; transform: translateY(0) rotate(0deg) scale(1); }
          50% { opacity: 1; }
          100% { opacity: 0; transform: translateY(100vh) rotate(720deg) scale(0.3); }
        }
      `}</style>
      {Array.from({ length: 40 }, (_, i) => <ConfettiPiece key={i} index={i} />)}
    </div>
  )
}

function CategoryBadge({ category }: { category: string }) {
  const config: Record<string, { label: string; cls: string }> = {
    strength: { label: 'STR', cls: 'text-blue-400/70 bg-blue-400/8' },
    cardio: { label: 'CARDIO', cls: 'text-emerald-400/70 bg-emerald-400/8' },
    hyrox_specific: { label: 'HYROX', cls: 'text-primary/70 bg-primary/8' },
    core: { label: 'CORE', cls: 'text-amber-400/70 bg-amber-400/8' },
    prehab: { label: 'PREHAB', cls: 'text-emerald-400/70 bg-emerald-400/8' },
    grip: { label: 'GRIP', cls: 'text-fuchsia-400/70 bg-fuchsia-400/8' },
    arms: { label: 'ARMS', cls: 'text-blue-400/70 bg-blue-400/8' },
  }
  const c = config[category]
  if (!c) return null
  return <span className={`text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded ${c.cls}`}>{c.label}</span>
}

function RestTimer({ seconds, onDismiss }: { seconds: number; onDismiss: () => void }) {
  const [remaining, setRemaining] = useState(seconds)
  const [running, setRunning] = useState(true)
  const hasFiredRef = useRef(false)

  useEffect(() => {
    if (!running || remaining <= 0) return
    const id = setInterval(() => setRemaining(r => r - 1), 1000)
    return () => clearInterval(id)
  }, [running, remaining])

  useEffect(() => {
    if (remaining <= 0 && !hasFiredRef.current) { hasFiredRef.current = true; navigator.vibrate?.(200) }
  }, [remaining])

  const min = Math.floor(remaining / 60)
  const sec = remaining % 60
  const pct = seconds > 0 ? ((seconds - remaining) / seconds) * 100 : 100
  const done = remaining <= 0

  return (
    <div className={`fixed inset-x-0 bottom-0 z-50 ${done ? 'bg-success' : 'bg-card/95 backdrop-blur-xl border-t border-border'}`}
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
      <div className="max-w-lg mx-auto p-4 flex items-center gap-4">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className={`text-xs font-medium ${done ? 'text-primary-foreground' : 'text-muted-foreground'}`}>{done ? 'Go!' : 'Rest'}</span>
            <span className={`text-2xl font-semibold tabular-nums ${done ? 'text-primary-foreground animate-pulse' : 'text-primary'}`}>
              {done ? '0:00' : `${min}:${String(sec).padStart(2, '0')}`}
            </span>
          </div>
          {!done && (
            <div className="h-1 bg-border rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${pct}%` }} />
            </div>
          )}
        </div>
        <div className="flex gap-2">
          {!done && (
            <button onClick={() => setRunning(r => !r)} className="px-3 py-2 bg-background border border-border rounded-lg text-xs font-medium">
              {running ? 'Pause' : 'Resume'}
            </button>
          )}
          <button onClick={onDismiss} className={`p-2 rounded-lg ${done ? 'bg-white/20 text-white' : 'bg-background border border-border text-muted-foreground'}`}>
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

function SessionTimer({ startTime }: { startTime: Date }) {
  const [elapsed, setElapsed] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setElapsed(Math.floor((Date.now() - startTime.getTime()) / 1000)), 1000)
    return () => clearInterval(id)
  }, [startTime])
  const min = Math.floor(elapsed / 60)
  const sec = elapsed % 60
  return (
    <span className="text-xs text-muted-foreground tabular-nums">
      <Timer className="w-3 h-3 inline mr-1" />
      {min}:{String(sec).padStart(2, '0')}
    </span>
  )
}

function formatDuration(s: number) {
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60
  if (h > 0) return `${h}h ${m}m`
  if (m > 0) return `${m}m ${sec}s`
  return `${sec}s`
}

function PrehabSection() {
  const [expanded, setExpanded] = useState(false)
  return (
    <div className="bg-card rounded-xl overflow-hidden">
      <button onClick={() => setExpanded(!expanded)} className="w-full px-4 py-3 flex items-center justify-between text-left">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-success/10 flex items-center justify-center">
            <Heart className="w-3.5 h-3.5 text-success" />
          </div>
          <div>
            <p className="text-[13px] font-medium">Warm-up</p>
            <p className="text-[10px] text-muted-foreground">IT-band, ankles, glutes</p>
          </div>
        </div>
        {expanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
      </button>
      {expanded && (
        <div className="px-4 pb-3 space-y-1.5">
          {PREHAB_ITEMS.map((item, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
              <span className="text-success mt-0.5">&bull;</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/** Stepper: tap +/- to adjust a value. Shows the value large and centered. */
function Stepper({ value, onChange, step, unit, min: minVal }: {
  value: number; onChange: (v: number) => void; step: number; unit?: string; min?: number
}) {
  const decrement = () => onChange(Math.max(minVal ?? 0, value - step))
  const increment = () => onChange(value + step)
  return (
    <div className="flex items-center gap-0">
      <button onClick={decrement}
        className="w-9 h-9 rounded-l-lg bg-background border border-border flex items-center justify-center active:bg-secondary transition-colors">
        <Minus className="w-3.5 h-3.5 text-muted-foreground" />
      </button>
      <div className="h-9 min-w-[52px] px-1.5 bg-background border-y border-border flex items-center justify-center">
        <span className="text-sm font-semibold tabular-nums">{value}{unit && <span className="text-[10px] font-normal text-muted-foreground ml-0.5">{unit}</span>}</span>
      </div>
      <button onClick={increment}
        className="w-9 h-9 rounded-r-lg bg-background border border-border flex items-center justify-center active:bg-secondary transition-colors">
        <Plus className="w-3.5 h-3.5 text-muted-foreground" />
      </button>
    </div>
  )
}

/** Time stepper for cardio exercises (seconds) */
function TimeStepper({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const decrement = () => onChange(Math.max(0, value - 5))
  const increment = () => onChange(value + 5)
  const min = Math.floor(value / 60)
  const sec = value % 60
  return (
    <div className="flex items-center gap-0">
      <button onClick={decrement}
        className="w-9 h-9 rounded-l-lg bg-background border border-border flex items-center justify-center active:bg-secondary transition-colors">
        <Minus className="w-3.5 h-3.5 text-muted-foreground" />
      </button>
      <div className="h-9 min-w-[60px] px-1.5 bg-background border-y border-border flex items-center justify-center">
        <span className="text-sm font-semibold tabular-nums">{min > 0 ? `${min}:${String(sec).padStart(2, '0')}` : `${sec}s`}</span>
      </div>
      <button onClick={increment}
        className="w-9 h-9 rounded-r-lg bg-background border border-border flex items-center justify-center active:bg-secondary transition-colors">
        <Plus className="w-3.5 h-3.5 text-muted-foreground" />
      </button>
    </div>
  )
}

export default function WorkoutPage() {
  const { workoutId } = useParams()
  const navigate = useNavigate()
  const { workout, loading: workoutLoading } = useWorkout(workoutId)
  const { saveWorkoutLog, saveDraft, loadDraft, saving } = useWorkoutLog(workoutId || '')

  const startTimeRef = useRef(new Date())
  const [kneePain, setKneePain] = useState(1)
  const [rpe, setRpe] = useState(5)
  const [notes, setNotes] = useState('')
  const [exerciseLogs, setExerciseLogs] = useState<ExerciseLogDraft[]>([])
  const [showComplete, setShowComplete] = useState(false)
  const [restTimer, setRestTimer] = useState<number | null>(null)
  const [animatingSetKey, setAnimatingSetKey] = useState<string | null>(null)
  const [collapsedExercises, setCollapsedExercises] = useState<Set<string>>(new Set())
  const exerciseRefs = useRef<Record<string, HTMLDivElement | null>>({})

  // Init: PRE-FILL all sets with target values so user just taps checkmarks
  useEffect(() => {
    if (!workout) return
    const draft = loadDraft()
    if (draft) { setKneePain(draft.knee_pain_level); setRpe(draft.overall_rpe); setNotes(draft.notes); setExerciseLogs(draft.exercise_logs); return }
    const logs: ExerciseLogDraft[] = []
    for (const we of workout.workout_exercises) {
      const targetWeight = we.target_weight_kg ? Number(we.target_weight_kg) : null
      const targetReps = we.reps ? parseInt(we.reps) : null
      const targetTime = we.duration_seconds || null
      for (let s = 1; s <= we.sets; s++) {
        logs.push({
          workout_exercise_id: we.id,
          set_number: s,
          weight_kg: targetWeight,
          reps_completed: !isNaN(targetReps as number) ? targetReps : null,
          time_seconds: targetTime,
          completed: false,
          notes: '',
        })
      }
    }
    setExerciseLogs(logs)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workout])

  // Auto-save draft
  useEffect(() => {
    if (!workoutId || exerciseLogs.length === 0) return
    const timeout = setTimeout(() => {
      saveDraft({ workout_id: workoutId, knee_pain_level: kneePain, overall_rpe: rpe, notes, exercise_logs: exerciseLogs })
    }, 1000)
    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exerciseLogs, kneePain, rpe, notes])

  const updateSet = (weId: string, setNum: number, updates: Partial<ExerciseLogDraft>) => {
    setExerciseLogs(prev => prev.map(el => el.workout_exercise_id === weId && el.set_number === setNum ? { ...el, ...updates } : el))
  }

  const autoAdvance = useCallback((updatedLogs: ExerciseLogDraft[], weId: string) => {
    if (!workout) return
    if (!updatedLogs.filter(el => el.workout_exercise_id === weId).every(s => s.completed)) return
    // Collapse finished exercise
    setCollapsedExercises(prev => new Set(prev).add(weId))
    // Scroll to next incomplete
    const order = workout.workout_exercises.map(we => we.id)
    const idx = order.indexOf(weId)
    for (let i = idx + 1; i < order.length; i++) {
      if (!updatedLogs.filter(el => el.workout_exercise_id === order[i]).every(s => s.completed)) {
        // Uncollapse next exercise if collapsed
        setCollapsedExercises(prev => { const n = new Set(prev); n.delete(order[i]); return n })
        setTimeout(() => exerciseRefs.current[order[i]]?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150)
        return
      }
    }
  }, [workout])

  const toggleSetComplete = useCallback((weId: string, setNum: number) => {
    setExerciseLogs(prev => {
      const updated = prev.map(el => el.workout_exercise_id === weId && el.set_number === setNum ? { ...el, completed: !el.completed } : el)
      const just = updated.find(el => el.workout_exercise_id === weId && el.set_number === setNum)
      if (just?.completed) {
        navigator.vibrate?.(30)
        setAnimatingSetKey(`${weId}-${setNum}`)
        setTimeout(() => setAnimatingSetKey(null), 300)
        if (workout) {
          const we = workout.workout_exercises.find(w => w.id === weId)
          if (we?.rest_seconds && we.rest_seconds > 0) setRestTimer(we.rest_seconds)
          else if ((we?.exercise as { category: string } | undefined)?.category === 'strength') setRestTimer(90)
        }
        setTimeout(() => autoAdvance(updated, weId), 400)
      }
      return updated
    })
  }, [workout, autoAdvance])

  const handleSave = async () => {
    if (!workoutId) return
    const { error } = await saveWorkoutLog({ workout_id: workoutId, knee_pain_level: kneePain, overall_rpe: rpe, notes, exercise_logs: exerciseLogs }, startTimeRef.current)
    if (error) alert('Error: ' + String(error))
    else setShowComplete(true)
  }

  if (workoutLoading) return <div className="flex items-center justify-center h-[60vh]"><Loader2 className="w-5 h-5 text-primary animate-spin" /></div>
  if (!workout) return <div className="text-center pt-12"><p className="text-muted-foreground text-sm">Workout not found</p></div>

  // Completion screen
  if (showComplete) {
    const completedSets = exerciseLogs.filter(el => el.completed).length
    const totalSets = exerciseLogs.length
    const elapsed = Math.floor((Date.now() - startTimeRef.current.getTime()) / 1000)
    const completedExercises = workout.workout_exercises.filter(we => {
      const s = exerciseLogs.filter(el => el.workout_exercise_id === we.id)
      return s.length > 0 && s.every(x => x.completed)
    }).length
    const next = getWorkoutByWeekDay(workout.week_number, workout.day_number + 1)

    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 relative">
        <ConfettiOverlay />
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6 animate-bounce">
          <Trophy className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-2xl font-semibold mb-1">Workout Complete</h2>
        <p className="text-muted-foreground mb-8">{formatDuration(elapsed)}</p>
        <div className="grid grid-cols-2 gap-3 w-full max-w-sm mb-6">
          {[
            { label: 'Sets', value: `${completedSets}/${totalSets}` },
            { label: 'Exercises', value: `${completedExercises}/${workout.workout_exercises.length}` },
            { label: 'Knee Pain', value: `${kneePain}/10`, color: kneePain >= 7 ? 'text-destructive' : kneePain >= 4 ? 'text-amber-400' : 'text-success' },
            { label: 'RPE', value: `${rpe}/10` },
          ].map(s => (
            <div key={s.label} className="bg-card rounded-xl p-4 text-center">
              <p className="text-[10px] text-muted-foreground mb-1 uppercase">{s.label}</p>
              <p className={`text-xl font-semibold ${s.color || ''}`}>{s.value}</p>
            </div>
          ))}
        </div>
        {next && (
          <div className="w-full max-w-sm bg-card rounded-xl p-4 border border-primary/15 mb-6">
            <p className="text-[10px] text-primary font-semibold uppercase mb-1">Up Next</p>
            <p className="text-sm font-medium">{next.name}</p>
            {next.focus && <p className="text-xs text-muted-foreground">{next.focus}</p>}
          </div>
        )}
        <button onClick={() => navigate('/')} className="w-full max-w-sm py-3.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold">
          Done
        </button>
      </div>
    )
  }

  const completedCount = exerciseLogs.filter(el => el.completed).length
  const totalCount = exerciseLogs.length
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0

  return (
    <div className={`max-w-lg mx-auto px-5 pt-6 space-y-3 ${restTimer !== null ? 'pb-32' : 'pb-8'}`}>
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-card rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-base font-semibold truncate">{workout.name}</h1>
          <p className="text-[11px] text-muted-foreground">{workout.focus}</p>
        </div>
        <SessionTimer startTime={startTimeRef.current} />
      </div>

      {/* Progress bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-[11px] text-muted-foreground">
          <span>{completedCount}/{totalCount} sets</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <PrehabSection />

      {/* Exercises — all visible, no accordion needed */}
      <div className="space-y-2">
        {workout.workout_exercises.map(we => {
          const exercise = we.exercise as { name: string; category: string; description: string | null }
          const sets = exerciseLogs.filter(el => el.workout_exercise_id === we.id)
          const completedSets = sets.filter(s => s.completed).length
          const allDone = sets.length > 0 && completedSets === sets.length
          const isCollapsed = collapsedExercises.has(we.id)
          const isTimeBased = !!we.duration_seconds

          return (
            <div key={we.id} ref={el => { exerciseRefs.current[we.id] = el }}
              className={`bg-card rounded-xl overflow-hidden transition-all ${allDone ? 'ring-1 ring-success/20' : ''}`}>

              {/* Exercise header — tap to collapse/expand */}
              <button onClick={() => setCollapsedExercises(prev => {
                const n = new Set(prev); if (n.has(we.id)) n.delete(we.id); else n.add(we.id); return n
              })} className="w-full px-4 py-3 flex items-center justify-between text-left">
                <div className="flex items-center gap-3 min-w-0">
                  {allDone ? (
                    <div className="w-6 h-6 rounded-full bg-success/15 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 text-success" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center shrink-0">
                      <span className="text-[9px] text-muted-foreground font-semibold">{completedSets}/{sets.length}</span>
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className={`text-[13px] font-medium truncate ${allDone ? 'text-muted-foreground line-through' : ''}`}>{exercise.name}</p>
                      <CategoryBadge category={exercise.category} />
                    </div>
                    <p className="text-[10px] text-muted-foreground">
                      {we.sets}&times;{we.reps || `${we.duration_seconds}s`}
                      {we.target_weight_kg && ` @ ${we.target_weight_kg}kg`}
                    </p>
                  </div>
                </div>
                {isCollapsed ? <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" /> : <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />}
              </button>

              {/* Sets — visible by default, collapsible when done */}
              {!isCollapsed && (
                <div className="px-4 pb-3 space-y-1.5">
                  {we.notes && <p className="text-[10px] text-primary bg-primary/5 px-3 py-1.5 rounded-lg mb-2">{we.notes}</p>}

                  {sets.map(set => {
                    const isAnim = animatingSetKey === `${we.id}-${set.set_number}`
                    return (
                      <div key={set.set_number}
                        className={`flex items-center gap-2 py-1 transition-opacity ${set.completed ? 'opacity-40' : ''}`}>

                        {/* Set number */}
                        <span className="text-[11px] text-muted-foreground w-4 text-center shrink-0">{set.set_number}</span>

                        {/* Steppers */}
                        <div className="flex items-center gap-2 flex-1 justify-center">
                          {isTimeBased ? (
                            <TimeStepper
                              value={set.time_seconds ?? 0}
                              onChange={v => updateSet(we.id, set.set_number, { time_seconds: v })}
                            />
                          ) : (
                            <>
                              <Stepper
                                value={set.weight_kg ?? 0}
                                onChange={v => updateSet(we.id, set.set_number, { weight_kg: v })}
                                step={2.5}
                                unit="kg"
                                min={0}
                              />
                              <Stepper
                                value={set.reps_completed ?? 0}
                                onChange={v => updateSet(we.id, set.set_number, { reps_completed: v })}
                                step={1}
                                min={0}
                              />
                            </>
                          )}
                        </div>

                        {/* Big check button */}
                        <button onClick={() => toggleSetComplete(we.id, set.set_number)}
                          className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 shrink-0 ${isAnim ? 'scale-125' : ''} ${
                            set.completed
                              ? 'bg-success text-white'
                              : 'bg-primary/10 text-primary border border-primary/20 active:scale-95'
                          }`}>
                          <Check className={`${set.completed ? 'w-5 h-5' : 'w-4 h-4'}`} />
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Knee Pain */}
      <div className="bg-card rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className={`w-4 h-4 ${kneePain >= 7 ? 'text-destructive' : kneePain >= 4 ? 'text-amber-400' : 'text-success'}`} />
            <span className="text-sm font-medium">Knee Pain</span>
          </div>
          <span className={`text-lg font-semibold tabular-nums ${kneePain >= 7 ? 'text-destructive' : kneePain >= 4 ? 'text-amber-400' : 'text-success'}`}>{kneePain}</span>
        </div>
        <input type="range" min={1} max={10} value={kneePain} onChange={e => setKneePain(Number(e.target.value))} className="w-full" />
        <div className="flex justify-between text-[10px] text-muted-foreground"><span>None</span><span>Severe</span></div>
      </div>

      {/* RPE */}
      <div className="bg-card rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Session RPE</span>
          <span className="text-lg font-semibold tabular-nums">{rpe}/10</span>
        </div>
        <input type="range" min={1} max={10} value={rpe} onChange={e => setRpe(Number(e.target.value))} className="w-full" />
      </div>

      <textarea placeholder="Session notes..." value={notes} onChange={e => setNotes(e.target.value)} rows={2}
        className="w-full px-4 py-3 bg-card rounded-xl text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary resize-none" />

      <button onClick={handleSave} disabled={saving}
        className="w-full py-3.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50">
        {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-4 h-4" /> Complete Workout</>}
      </button>

      {restTimer !== null && <RestTimer seconds={restTimer} onDismiss={() => setRestTimer(null)} />}
    </div>
  )
}
