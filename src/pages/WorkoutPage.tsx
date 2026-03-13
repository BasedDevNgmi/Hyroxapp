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
  Zap,
  X,
  Info,
} from 'lucide-react'

// --- CSS-only Confetti ---
const confettiColors = ['#d4ff00', '#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b', '#6c5ce7', '#a29bfe']

function ConfettiPiece({ index }: { index: number }) {
  const color = confettiColors[index % confettiColors.length]
  const left = `${(index * 7.3 + 3) % 100}%`
  const delay = `${(index * 0.15) % 2.5}s`
  const duration = `${2 + (index % 3) * 0.7}s`
  const size = index % 3 === 0 ? 8 : index % 3 === 1 ? 6 : 10
  const isSquare = index % 2 === 0

  return (
    <div
      style={{
        position: 'absolute',
        top: '-12px',
        left,
        width: size,
        height: size,
        backgroundColor: color,
        borderRadius: isSquare ? '1px' : '50%',
        opacity: 0,
        animation: `confettiFall ${duration} ${delay} ease-out forwards`,
      }}
    />
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
      {Array.from({ length: 40 }, (_, i) => (
        <ConfettiPiece key={i} index={i} />
      ))}
    </div>
  )
}

// --- Category Badge ---
function CategoryBadge({ category }: { category: string }) {
  const config: Record<string, { label: string; classes: string }> = {
    strength: { label: 'STR', classes: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
    cardio: { label: 'CARDIO', classes: 'bg-green-500/20 text-green-400 border-green-500/30' },
    hyrox_specific: { label: 'HYROX', classes: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
  }
  const c = config[category]
  if (!c) return null
  return (
    <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${c.classes}`}>
      {c.label}
    </span>
  )
}

// --- Rest Timer (fixed bottom) ---
function RestTimer({ seconds, onDismiss }: { seconds: number; onDismiss: () => void }) {
  const [remaining, setRemaining] = useState(seconds)
  const [running, setRunning] = useState(true)
  const hasFiredRef = useRef(false)

  useEffect(() => {
    if (!running || remaining <= 0) return
    const id = setInterval(() => setRemaining(r => r - 1), 1000)
    return () => clearInterval(id)
  }, [running, remaining])

  // Vibrate when timer hits 0
  useEffect(() => {
    if (remaining <= 0 && !hasFiredRef.current) {
      hasFiredRef.current = true
      navigator.vibrate?.(200)
    }
  }, [remaining])

  const min = Math.floor(remaining / 60)
  const sec = remaining % 60
  const pct = seconds > 0 ? ((seconds - remaining) / seconds) * 100 : 100
  const done = remaining <= 0

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-50 ${done ? 'bg-green-600' : 'bg-card border-t border-border'}`}
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="max-w-lg mx-auto p-4 flex items-center gap-4">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className={`text-sm font-semibold ${done ? 'text-white' : ''}`}>
              {done ? 'GO!' : 'Rest'}
            </span>
            <span className={`text-2xl font-mono font-bold tabular-nums ${done ? 'text-white animate-pulse' : 'text-primary'}`}>
              {done ? '0:00' : `${min}:${String(sec).padStart(2, '0')}`}
            </span>
          </div>
          {!done && (
            <div className="h-1.5 bg-border rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${pct}%` }} />
            </div>
          )}
        </div>
        <div className="flex gap-2">
          {!done && (
            <button
              onClick={() => setRunning(r => !r)}
              className="px-3 py-2 bg-background border border-border rounded-lg text-xs font-medium"
            >
              {running ? 'Pause' : 'Resume'}
            </button>
          )}
          <button
            onClick={onDismiss}
            className={`p-2 rounded-lg ${done ? 'bg-white/20 text-white' : 'bg-background border border-border text-muted-foreground'}`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

// --- Session Timer ---
function SessionTimer({ startTime }: { startTime: Date }) {
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime.getTime()) / 1000))
    }, 1000)
    return () => clearInterval(id)
  }, [startTime])

  const min = Math.floor(elapsed / 60)
  const sec = elapsed % 60
  return (
    <span className="text-xs text-muted-foreground font-mono tabular-nums">
      <Timer className="w-3 h-3 inline mr-1" />
      {min}:{String(sec).padStart(2, '0')}
    </span>
  )
}

// --- Previous Performance ---
function getPreviousPerformance(workoutExerciseId: string): { weight_kg: number | null; reps_completed: number | null; time_seconds: number | null } | null {
  const raw = localStorage.getItem('hyrox_exercise_logs')
  if (!raw) return null
  const logs = JSON.parse(raw) as { workout_exercise_id: string; weight_kg: number | null; reps_completed: number | null; time_seconds: number | null; completed: boolean }[]
  const matching = logs.filter(l => l.workout_exercise_id === workoutExerciseId && l.completed)
  if (matching.length === 0) return null
  return matching[matching.length - 1]
}

// --- Format duration ---
function formatDuration(totalSeconds: number): string {
  const hrs = Math.floor(totalSeconds / 3600)
  const mins = Math.floor((totalSeconds % 3600) / 60)
  const secs = totalSeconds % 60
  if (hrs > 0) return `${hrs}h ${mins}m ${secs}s`
  if (mins > 0) return `${mins}m ${secs}s`
  return `${secs}s`
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
  const [expandedExercise, setExpandedExercise] = useState<string | null>(null)
  const [showComplete, setShowComplete] = useState(false)
  const [restTimer, setRestTimer] = useState<number | null>(null)
  const [expandedInfo, setExpandedInfo] = useState<string | null>(null)
  const [animatingSetKey, setAnimatingSetKey] = useState<string | null>(null)

  // Refs for auto-scroll
  const exerciseRefs = useRef<Record<string, HTMLDivElement | null>>({})

  useEffect(() => {
    if (!workout) return

    const draft = loadDraft()
    if (draft) {
      setKneePain(draft.knee_pain_level)
      setRpe(draft.overall_rpe)
      setNotes(draft.notes)
      setExerciseLogs(draft.exercise_logs)
      return
    }

    const logs: ExerciseLogDraft[] = []
    for (const we of workout.workout_exercises) {
      for (let s = 1; s <= we.sets; s++) {
        logs.push({
          workout_exercise_id: we.id,
          set_number: s,
          weight_kg: null,
          reps_completed: null,
          time_seconds: null,
          completed: false,
          notes: '',
        })
      }
    }
    setExerciseLogs(logs)
    if (workout.workout_exercises.length > 0) {
      setExpandedExercise(workout.workout_exercises[0].id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workout])

  // Auto-save draft
  useEffect(() => {
    if (!workoutId || exerciseLogs.length === 0) return
    const timeout = setTimeout(() => {
      saveDraft({
        workout_id: workoutId,
        knee_pain_level: kneePain,
        overall_rpe: rpe,
        notes,
        exercise_logs: exerciseLogs,
      })
    }, 1000)
    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exerciseLogs, kneePain, rpe, notes])

  const updateSet = (weId: string, setNum: number, updates: Partial<ExerciseLogDraft>) => {
    setExerciseLogs(prev =>
      prev.map(el =>
        el.workout_exercise_id === weId && el.set_number === setNum
          ? { ...el, ...updates }
          : el
      )
    )
  }

  // Auto-advance to next incomplete exercise
  const autoAdvance = useCallback((updatedLogs: ExerciseLogDraft[], justCompletedWeId: string) => {
    if (!workout) return
    const setsForExercise = updatedLogs.filter(el => el.workout_exercise_id === justCompletedWeId)
    const allDone = setsForExercise.every(s => s.completed)
    if (!allDone) return

    // Find next incomplete exercise
    const exerciseOrder = workout.workout_exercises.map(we => we.id)
    const currentIdx = exerciseOrder.indexOf(justCompletedWeId)
    for (let i = currentIdx + 1; i < exerciseOrder.length; i++) {
      const nextId = exerciseOrder[i]
      const nextSets = updatedLogs.filter(el => el.workout_exercise_id === nextId)
      const nextAllDone = nextSets.every(s => s.completed)
      if (!nextAllDone) {
        setExpandedExercise(nextId)
        // Scroll into view after a short delay to allow DOM update
        setTimeout(() => {
          exerciseRefs.current[nextId]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 150)
        return
      }
    }
  }, [workout])

  const toggleSetComplete = useCallback((weId: string, setNum: number) => {
    setExerciseLogs(prev => {
      const updated = prev.map(el =>
        el.workout_exercise_id === weId && el.set_number === setNum
          ? { ...el, completed: !el.completed }
          : el
      )
      const justCompleted = updated.find(el => el.workout_exercise_id === weId && el.set_number === setNum)

      if (justCompleted?.completed) {
        // Trigger set completion animation
        setAnimatingSetKey(`${weId}-${setNum}`)
        setTimeout(() => setAnimatingSetKey(null), 300)

        // Start rest timer
        if (workout) {
          const we = workout.workout_exercises.find(w => w.id === weId)
          if (we?.rest_seconds && we.rest_seconds > 0) {
            setRestTimer(we.rest_seconds)
          } else {
            const exercise = we?.exercise as { category: string } | undefined
            if (exercise?.category === 'strength') {
              setRestTimer(90)
            }
          }
        }

        // Auto-advance after a short delay
        setTimeout(() => autoAdvance(updated, weId), 400)
      }

      return updated
    })
  }, [workout, autoAdvance])

  // Quick-fill: set all empty sets with prescribed values
  const quickFill = (weId: string) => {
    if (!workout) return
    const we = workout.workout_exercises.find(w => w.id === weId)
    if (!we) return
    setExerciseLogs(prev =>
      prev.map(el => {
        if (el.workout_exercise_id !== weId) return el
        const updates: Partial<ExerciseLogDraft> = {}
        if (we.target_weight_kg && el.weight_kg === null) {
          updates.weight_kg = Number(we.target_weight_kg)
        }
        if (we.reps && el.reps_completed === null) {
          const parsed = parseInt(we.reps)
          if (!isNaN(parsed)) updates.reps_completed = parsed
        }
        if (we.duration_seconds && el.time_seconds === null) {
          updates.time_seconds = we.duration_seconds
        }
        return { ...el, ...updates }
      })
    )
  }

  const handleSave = async () => {
    if (!workoutId) return
    const { error } = await saveWorkoutLog(
      {
        workout_id: workoutId,
        knee_pain_level: kneePain,
        overall_rpe: rpe,
        notes,
        exercise_logs: exerciseLogs,
      },
      startTimeRef.current
    )
    if (error) {
      alert('Error saving: ' + String(error))
    } else {
      setShowComplete(true)
    }
  }

  if (workoutLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    )
  }

  if (!workout) {
    return (
      <div className="text-center pt-12">
        <p className="text-muted-foreground">Workout not found</p>
      </div>
    )
  }

  // --- Completion Screen with Confetti ---
  if (showComplete) {
    const completedSets = exerciseLogs.filter(el => el.completed).length
    const totalSets = exerciseLogs.length
    const elapsedSeconds = Math.floor((Date.now() - startTimeRef.current.getTime()) / 1000)
    const completedExercises = workout.workout_exercises.filter(we => {
      const sets = exerciseLogs.filter(el => el.workout_exercise_id === we.id)
      return sets.length > 0 && sets.every(s => s.completed)
    }).length

    // Check for next workout (tomorrow = day_number + 1)
    const nextDayNumber = workout.day_number + 1
    const nextWorkout = getWorkoutByWeekDay(workout.week_number, nextDayNumber)

    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 relative">
        <ConfettiOverlay />

        <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6 animate-bounce">
          <Trophy className="w-12 h-12 text-primary" />
        </div>

        <h2 className="text-3xl font-bold mb-2">Workout Complete!</h2>
        <p className="text-lg text-muted-foreground mb-8">{formatDuration(elapsedSeconds)}</p>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3 w-full max-w-sm mb-6">
          <div className="bg-card rounded-2xl p-4 border border-border text-center">
            <p className="text-xs text-muted-foreground mb-1">Sets</p>
            <p className="text-2xl font-bold text-primary">{completedSets}<span className="text-sm text-muted-foreground font-normal">/{totalSets}</span></p>
          </div>
          <div className="bg-card rounded-2xl p-4 border border-border text-center">
            <p className="text-xs text-muted-foreground mb-1">Exercises</p>
            <p className="text-2xl font-bold text-primary">{completedExercises}<span className="text-sm text-muted-foreground font-normal">/{workout.workout_exercises.length}</span></p>
          </div>
          <div className="bg-card rounded-2xl p-4 border border-border text-center">
            <p className="text-xs text-muted-foreground mb-1">Knee Pain</p>
            <p className={`text-2xl font-bold ${kneePain >= 7 ? 'text-destructive' : kneePain >= 4 ? 'text-yellow-500' : 'text-green-400'}`}>
              {kneePain}<span className="text-sm font-normal">/10</span>
            </p>
          </div>
          <div className="bg-card rounded-2xl p-4 border border-border text-center">
            <p className="text-xs text-muted-foreground mb-1">RPE</p>
            <p className="text-2xl font-bold">{rpe}<span className="text-sm text-muted-foreground font-normal">/10</span></p>
          </div>
        </div>

        {/* Next workout teaser */}
        {nextWorkout && (
          <div className="w-full max-w-sm bg-card rounded-2xl p-4 border border-primary/30 mb-6">
            <p className="text-xs text-primary font-semibold uppercase tracking-wider mb-1">Up Next</p>
            <p className="text-sm font-medium">{nextWorkout.name}</p>
            {nextWorkout.focus && <p className="text-xs text-muted-foreground">{nextWorkout.focus}</p>}
          </div>
        )}

        <button
          onClick={() => navigate('/')}
          className="w-full max-w-sm py-4 bg-primary text-primary-foreground rounded-2xl font-semibold text-center"
        >
          Back to Dashboard
        </button>
      </div>
    )
  }

  const completedCount = exerciseLogs.filter(el => el.completed).length
  const totalCount = exerciseLogs.length
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0

  return (
    <div className={`space-y-4 ${restTimer !== null ? 'pb-32' : 'pb-8'}`}>
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-card rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-semibold">{workout.name}</h1>
          <p className="text-xs text-muted-foreground">{workout.focus}</p>
        </div>
        <SessionTimer startTime={startTimeRef.current} />
      </div>

      {/* Progress Bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Progress</span>
          <span>{completedCount}/{totalCount} sets</span>
        </div>
        <div className="h-2 bg-border rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Exercises */}
      <div className="space-y-3">
        {workout.workout_exercises.map(we => {
          const exercise = we.exercise as { name: string; category: string; description: string | null }
          const sets = exerciseLogs.filter(el => el.workout_exercise_id === we.id)
          const allDone = sets.every(s => s.completed)
          const isExpanded = expandedExercise === we.id
          const prev = getPreviousPerformance(we.id)
          const showInfo = expandedInfo === we.id

          return (
            <div
              key={we.id}
              ref={el => { exerciseRefs.current[we.id] = el }}
              className={`bg-card rounded-2xl border overflow-hidden transition-colors duration-300 ${
                allDone ? 'border-green-500/30' : 'border-border'
              }`}
            >
              <button
                onClick={() => setExpandedExercise(isExpanded ? null : we.id)}
                className="w-full p-4 flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-3">
                  {allDone ? (
                    <div className="w-7 h-7 rounded-full bg-green-500/20 flex items-center justify-center">
                      <Check className="w-4 h-4 text-green-400" />
                    </div>
                  ) : (
                    <div className="w-7 h-7 rounded-full border-2 border-border flex items-center justify-center">
                      <span className="text-[10px] text-muted-foreground font-medium">
                        {sets.filter(s => s.completed).length}/{sets.length}
                      </span>
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">{exercise.name}</p>
                      <CategoryBadge category={exercise.category} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {we.sets}&times;{we.reps || `${we.duration_seconds}s`}
                      {we.target_weight_kg && ` @ ${we.target_weight_kg}kg`}
                      {we.distance_meters && ` \u00b7 ${we.distance_meters}m`}
                      {we.tempo && ` \u00b7 ${we.tempo}`}
                      {we.rest_seconds && ` \u00b7 ${we.rest_seconds}s rest`}
                    </p>
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                )}
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 space-y-2">
                  {/* Exercise Info Panel */}
                  {exercise.description && (
                    <div className="mb-2">
                      <button
                        onClick={() => setExpandedInfo(showInfo ? null : we.id)}
                        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Info className="w-3.5 h-3.5" />
                        <span>{showInfo ? 'Hide info' : 'Exercise info'}</span>
                      </button>
                      {showInfo && (
                        <p className="mt-1.5 text-xs text-muted-foreground bg-background/50 px-3 py-2 rounded-lg leading-relaxed">
                          {exercise.description}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Notes + Previous + Quick Fill */}
                  <div className="space-y-1.5 mb-2">
                    {we.notes && (
                      <p className="text-xs text-primary bg-primary/5 px-3 py-1.5 rounded-lg">
                        {we.notes}
                      </p>
                    )}

                    {prev && (
                      <p className="text-xs text-muted-foreground bg-background px-3 py-1.5 rounded-lg">
                        Last: {prev.weight_kg ? `${prev.weight_kg}kg` : ''}{prev.reps_completed ? ` \u00d7 ${prev.reps_completed}` : ''}{prev.time_seconds ? `${prev.time_seconds}s` : ''}
                      </p>
                    )}

                    {(we.target_weight_kg || (we.reps && /^\d+$/.test(we.reps)) || we.duration_seconds) && (
                      <button
                        onClick={() => quickFill(we.id)}
                        className="flex items-center gap-1 text-xs text-primary font-medium px-3 py-1.5 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors"
                      >
                        <Zap className="w-3 h-3" />
                        Fill prescribed values
                      </button>
                    )}
                  </div>

                  {/* Set Header */}
                  <div className="grid grid-cols-[40px_1fr_1fr_40px] gap-2 text-[10px] font-medium text-muted-foreground uppercase tracking-wider px-1">
                    <span>Set</span>
                    <span>{we.duration_seconds ? 'Time (s)' : 'Weight'}</span>
                    <span>{we.duration_seconds ? '' : 'Reps'}</span>
                    <span></span>
                  </div>

                  {sets.map(set => {
                    const setKey = `${we.id}-${set.set_number}`
                    const isAnimating = animatingSetKey === setKey

                    return (
                      <div
                        key={set.set_number}
                        className={`grid grid-cols-[40px_1fr_1fr_40px] gap-2 items-center transition-opacity duration-200 ${
                          set.completed ? 'opacity-60' : ''
                        }`}
                      >
                        <span className="text-sm text-center text-muted-foreground">
                          {set.set_number}
                        </span>

                        {we.duration_seconds ? (
                          <input
                            type="number"
                            inputMode="numeric"
                            placeholder={String(we.duration_seconds)}
                            value={set.time_seconds ?? ''}
                            onChange={e =>
                              updateSet(we.id, set.set_number, {
                                time_seconds: e.target.value ? Number(e.target.value) : null,
                              })
                            }
                            className="h-10 px-3 bg-background border border-border rounded-lg text-sm text-center focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                        ) : (
                          <input
                            type="number"
                            inputMode="decimal"
                            placeholder={we.target_weight_kg ? `${we.target_weight_kg}` : 'kg'}
                            value={set.weight_kg ?? ''}
                            onChange={e =>
                              updateSet(we.id, set.set_number, {
                                weight_kg: e.target.value ? Number(e.target.value) : null,
                              })
                            }
                            className="h-10 px-3 bg-background border border-border rounded-lg text-sm text-center focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                        )}

                        {!we.duration_seconds && (
                          <input
                            type="number"
                            inputMode="numeric"
                            placeholder={we.reps || ''}
                            value={set.reps_completed ?? ''}
                            onChange={e =>
                              updateSet(we.id, set.set_number, {
                                reps_completed: e.target.value ? Number(e.target.value) : null,
                              })
                            }
                            className="h-10 px-3 bg-background border border-border rounded-lg text-sm text-center focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                        )}

                        {we.duration_seconds && <div />}

                        <button
                          onClick={() => toggleSetComplete(we.id, set.set_number)}
                          className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 ${
                            isAnimating ? 'scale-125' : 'scale-100'
                          } ${
                            set.completed
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-background border border-border text-muted-foreground hover:border-primary'
                          }`}
                          style={{ transitionProperty: 'transform, background-color, color, border-color' }}
                        >
                          <Check className="w-4 h-4" />
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

      {/* Knee Pain Level - AFTER exercises */}
      <div className="bg-card rounded-2xl p-4 border border-border space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className={`w-4 h-4 ${kneePain >= 7 ? 'text-destructive' : kneePain >= 4 ? 'text-yellow-500' : 'text-green-400'}`} />
            <span className="text-sm font-medium">Knee Pain Level</span>
          </div>
          <span className={`text-lg font-bold ${kneePain >= 7 ? 'text-destructive' : kneePain >= 4 ? 'text-yellow-500' : 'text-green-400'}`}>
            {kneePain}
          </span>
        </div>
        <input
          type="range"
          min={1}
          max={10}
          value={kneePain}
          onChange={e => setKneePain(Number(e.target.value))}
          className="w-full accent-primary"
        />
        <div className="flex justify-between text-[10px] text-muted-foreground">
          <span>No pain</span>
          <span>Severe</span>
        </div>
      </div>

      {/* RPE & Notes */}
      <div className="bg-card rounded-2xl p-4 border border-border space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Session RPE</span>
          <span className="text-lg font-bold">{rpe}/10</span>
        </div>
        <input
          type="range"
          min={1}
          max={10}
          value={rpe}
          onChange={e => setRpe(Number(e.target.value))}
          className="w-full accent-primary"
        />
      </div>

      <textarea
        placeholder="Session notes (how did it feel, adjustments, etc.)"
        value={notes}
        onChange={e => setNotes(e.target.value)}
        rows={3}
        className="w-full px-4 py-3 bg-card border border-border rounded-2xl text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
      />

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50"
      >
        {saving ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <>
            <Save className="w-5 h-5" />
            Complete Workout
          </>
        )}
      </button>

      {/* Rest Timer Overlay - fixed at bottom */}
      {restTimer !== null && (
        <RestTimer seconds={restTimer} onDismiss={() => setRestTimer(null)} />
      )}
    </div>
  )
}
