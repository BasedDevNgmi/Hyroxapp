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
  Heart,
} from 'lucide-react'
import { PREHAB_ITEMS } from '@/data/helpers'

const confettiColors = ['#00e5ff', '#ff2d6f', '#00ff88', '#d946ef', '#f59e0b', '#3b82f6', '#10b981', '#ef4444']

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

function CategoryBadge({ category }: { category: string }) {
  const config: Record<string, { label: string; classes: string }> = {
    strength: { label: 'STR', classes: 'bg-primary/10 text-primary border-primary/20' },
    cardio: { label: 'CARDIO', classes: 'bg-success/10 text-success border-success/20' },
    hyrox_specific: { label: 'HYROX', classes: 'bg-accent/10 text-accent border-accent/20' },
    core: { label: 'CORE', classes: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
    prehab: { label: 'PREHAB', classes: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
    grip: { label: 'GRIP', classes: 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20' },
    arms: { label: 'ARMS', classes: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  }
  const c = config[category]
  if (!c) return null
  return (
    <span className={`text-[8px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${c.classes}`}>
      {c.label}
    </span>
  )
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
      className={`fixed inset-x-0 bottom-0 z-50 ${done ? 'bg-success/90' : 'bg-card/95 backdrop-blur-xl border-t border-primary/20'}`}
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="max-w-lg mx-auto p-4 flex items-center gap-4">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className={`text-xs font-mono font-bold uppercase ${done ? 'text-primary-foreground' : 'text-muted-foreground'}`}>
              {done ? 'GO!' : 'Rest'}
            </span>
            <span className={`text-2xl font-mono font-bold tabular-nums ${done ? 'text-primary-foreground animate-pulse' : 'text-primary glow-text'}`}>
              {done ? '0:00' : `${min}:${String(sec).padStart(2, '0')}`}
            </span>
          </div>
          {!done && (
            <div className="h-1 bg-border rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(0,229,255,0.4)]" style={{ width: `${pct}%` }} />
            </div>
          )}
        </div>
        <div className="flex gap-2">
          {!done && (
            <button
              onClick={() => setRunning(r => !r)}
              className="px-3 py-2 bg-background border border-border rounded text-[10px] font-mono font-bold uppercase"
            >
              {running ? 'Pause' : 'Resume'}
            </button>
          )}
          <button
            onClick={onDismiss}
            className={`p-2 rounded ${done ? 'bg-white/20 text-white' : 'bg-background border border-border text-muted-foreground'}`}
          >
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
    const id = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime.getTime()) / 1000))
    }, 1000)
    return () => clearInterval(id)
  }, [startTime])

  const min = Math.floor(elapsed / 60)
  const sec = elapsed % 60
  return (
    <span className="text-xs text-primary font-mono font-bold tabular-nums glow-text">
      <Timer className="w-3 h-3 inline mr-1" />
      {min}:{String(sec).padStart(2, '0')}
    </span>
  )
}

function getPreviousPerformance(workoutExerciseId: string): { weight_kg: number | null; reps_completed: number | null; time_seconds: number | null } | null {
  const raw = localStorage.getItem('hyrox_exercise_logs')
  if (!raw) return null
  const logs = JSON.parse(raw) as { workout_exercise_id: string; weight_kg: number | null; reps_completed: number | null; time_seconds: number | null; completed: boolean }[]
  const matching = logs.filter(l => l.workout_exercise_id === workoutExerciseId && l.completed)
  if (matching.length === 0) return null
  return matching[matching.length - 1]
}

function formatDuration(totalSeconds: number): string {
  const hrs = Math.floor(totalSeconds / 3600)
  const mins = Math.floor((totalSeconds % 3600) / 60)
  const secs = totalSeconds % 60
  if (hrs > 0) return `${hrs}h ${mins}m ${secs}s`
  if (mins > 0) return `${mins}m ${secs}s`
  return `${secs}s`
}

function PrehabSection() {
  const [expanded, setExpanded] = useState(false)
  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-3 flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded bg-success/10 flex items-center justify-center">
            <Heart className="w-3.5 h-3.5 text-success" />
          </div>
          <div>
            <p className="text-xs font-heading font-bold uppercase tracking-wider">Warm-up Protocol</p>
            <p className="text-[10px] font-mono text-muted-foreground">IT-band, ankles, glutes</p>
          </div>
        </div>
        {expanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
      </button>
      {expanded && (
        <div className="px-4 pb-3 space-y-1.5">
          {PREHAB_ITEMS.map((item, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
              <span className="text-success mt-0.5 text-[8px]">&#9654;</span>
              <span>{item}</span>
            </div>
          ))}
          <p className="text-[9px] font-mono text-muted-foreground/50 mt-2">
            // Not tracked. Execute before every session.
          </p>
        </div>
      )}
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
  const [expandedExercise, setExpandedExercise] = useState<string | null>(null)
  const [showComplete, setShowComplete] = useState(false)
  const [restTimer, setRestTimer] = useState<number | null>(null)
  const [expandedInfo, setExpandedInfo] = useState<string | null>(null)
  const [animatingSetKey, setAnimatingSetKey] = useState<string | null>(null)
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

  const autoAdvance = useCallback((updatedLogs: ExerciseLogDraft[], justCompletedWeId: string) => {
    if (!workout) return
    const setsForExercise = updatedLogs.filter(el => el.workout_exercise_id === justCompletedWeId)
    const allDone = setsForExercise.every(s => s.completed)
    if (!allDone) return
    const exerciseOrder = workout.workout_exercises.map(we => we.id)
    const currentIdx = exerciseOrder.indexOf(justCompletedWeId)
    for (let i = currentIdx + 1; i < exerciseOrder.length; i++) {
      const nextId = exerciseOrder[i]
      const nextSets = updatedLogs.filter(el => el.workout_exercise_id === nextId)
      if (!nextSets.every(s => s.completed)) {
        setExpandedExercise(nextId)
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
        setAnimatingSetKey(`${weId}-${setNum}`)
        setTimeout(() => setAnimatingSetKey(null), 300)
        if (workout) {
          const we = workout.workout_exercises.find(w => w.id === weId)
          if (we?.rest_seconds && we.rest_seconds > 0) {
            setRestTimer(we.rest_seconds)
          } else {
            const exercise = we?.exercise as { category: string } | undefined
            if (exercise?.category === 'strength') setRestTimer(90)
          }
        }
        setTimeout(() => autoAdvance(updated, weId), 400)
      }
      return updated
    })
  }, [workout, autoAdvance])

  const quickFill = (weId: string) => {
    if (!workout) return
    const we = workout.workout_exercises.find(w => w.id === weId)
    if (!we) return
    setExerciseLogs(prev =>
      prev.map(el => {
        if (el.workout_exercise_id !== weId) return el
        const updates: Partial<ExerciseLogDraft> = {}
        if (we.target_weight_kg && el.weight_kg === null) updates.weight_kg = Number(we.target_weight_kg)
        if (we.reps && el.reps_completed === null) {
          const parsed = parseInt(we.reps)
          if (!isNaN(parsed)) updates.reps_completed = parsed
        }
        if (we.duration_seconds && el.time_seconds === null) updates.time_seconds = we.duration_seconds
        return { ...el, ...updates }
      })
    )
  }

  const handleSave = async () => {
    if (!workoutId) return
    const { error } = await saveWorkoutLog(
      { workout_id: workoutId, knee_pain_level: kneePain, overall_rpe: rpe, notes, exercise_logs: exerciseLogs },
      startTimeRef.current
    )
    if (error) alert('Error saving: ' + String(error))
    else setShowComplete(true)
  }

  if (workoutLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
      </div>
    )
  }

  if (!workout) {
    return (
      <div className="text-center pt-12">
        <p className="text-muted-foreground font-mono">// Workout not found</p>
      </div>
    )
  }

  if (showComplete) {
    const completedSets = exerciseLogs.filter(el => el.completed).length
    const totalSets = exerciseLogs.length
    const elapsedSeconds = Math.floor((Date.now() - startTimeRef.current.getTime()) / 1000)
    const completedExercises = workout.workout_exercises.filter(we => {
      const sets = exerciseLogs.filter(el => el.workout_exercise_id === we.id)
      return sets.length > 0 && sets.every(s => s.completed)
    }).length
    const nextDayNumber = workout.day_number + 1
    const nextWorkout = getWorkoutByWeekDay(workout.week_number, nextDayNumber)

    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 relative grid-bg">
        <ConfettiOverlay />
        <div className="w-20 h-20 rounded-lg border border-primary/30 bg-primary/5 flex items-center justify-center mb-6 animate-pulse-glow">
          <Trophy className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-3xl font-heading font-bold uppercase tracking-wider mb-2 glow-text text-primary">Protocol Complete</h2>
        <p className="text-lg font-mono text-muted-foreground mb-8">{formatDuration(elapsedSeconds)}</p>
        <div className="grid grid-cols-2 gap-3 w-full max-w-sm mb-6">
          <div className="bg-card rounded-lg p-4 border border-border text-center">
            <p className="text-[9px] font-mono text-muted-foreground mb-1 uppercase">Sets</p>
            <p className="text-2xl font-mono font-bold text-primary">{completedSets}<span className="text-sm text-muted-foreground font-normal">/{totalSets}</span></p>
          </div>
          <div className="bg-card rounded-lg p-4 border border-border text-center">
            <p className="text-[9px] font-mono text-muted-foreground mb-1 uppercase">Exercises</p>
            <p className="text-2xl font-mono font-bold text-primary">{completedExercises}<span className="text-sm text-muted-foreground font-normal">/{workout.workout_exercises.length}</span></p>
          </div>
          <div className="bg-card rounded-lg p-4 border border-border text-center">
            <p className="text-[9px] font-mono text-muted-foreground mb-1 uppercase">Knee Pain</p>
            <p className={`text-2xl font-mono font-bold ${kneePain >= 7 ? 'text-destructive' : kneePain >= 4 ? 'text-amber-400' : 'text-success'}`}>
              {kneePain}<span className="text-sm font-normal">/10</span>
            </p>
          </div>
          <div className="bg-card rounded-lg p-4 border border-border text-center">
            <p className="text-[9px] font-mono text-muted-foreground mb-1 uppercase">RPE</p>
            <p className="text-2xl font-mono font-bold">{rpe}<span className="text-sm text-muted-foreground font-normal">/10</span></p>
          </div>
        </div>
        {nextWorkout && (
          <div className="w-full max-w-sm bg-card rounded-lg p-4 border border-primary/20 mb-6 neon-border">
            <p className="text-[9px] font-mono font-bold text-primary uppercase tracking-wider mb-1">Next Protocol</p>
            <p className="text-sm font-heading font-bold uppercase">{nextWorkout.name}</p>
            {nextWorkout.focus && <p className="text-[10px] font-mono text-muted-foreground">{nextWorkout.focus}</p>}
          </div>
        )}
        <button
          onClick={() => navigate('/')}
          className="w-full max-w-sm py-3.5 bg-primary text-primary-foreground rounded-lg font-heading font-bold uppercase tracking-wider text-center shadow-[0_0_16px_rgba(0,229,255,0.3)]"
        >
          Return to HQ
        </button>
      </div>
    )
  }

  const completedCount = exerciseLogs.filter(el => el.completed).length
  const totalCount = exerciseLogs.length
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0

  return (
    <div className={`max-w-lg mx-auto px-4 pt-6 space-y-4 ${restTimer !== null ? 'pb-32' : 'pb-8'}`}>
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-primary/10 rounded transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-base font-heading font-bold uppercase tracking-wider">{workout.name}</h1>
          <p className="text-[10px] font-mono text-muted-foreground">{workout.focus}</p>
        </div>
        <SessionTimer startTime={startTimeRef.current} />
      </div>

      {/* Progress Bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
          <span>PROGRESS</span>
          <span>{completedCount}/{totalCount}</span>
        </div>
        <div className="h-1.5 bg-border rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300 shadow-[0_0_8px_rgba(0,229,255,0.4)]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <PrehabSection />

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
              className={`bg-card rounded-lg border overflow-hidden transition-colors duration-300 ${
                allDone ? 'border-success/30' : 'border-border'
              }`}
            >
              <button
                onClick={() => setExpandedExercise(isExpanded ? null : we.id)}
                className="w-full p-4 flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-3">
                  {allDone ? (
                    <div className="w-7 h-7 rounded bg-success/15 flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 text-success" />
                    </div>
                  ) : (
                    <div className="w-7 h-7 rounded border border-border flex items-center justify-center">
                      <span className="text-[9px] font-mono text-muted-foreground font-bold">
                        {sets.filter(s => s.completed).length}/{sets.length}
                      </span>
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-heading font-bold text-sm uppercase tracking-wider">{exercise.name}</p>
                      <CategoryBadge category={exercise.category} />
                    </div>
                    <p className="text-[10px] font-mono text-muted-foreground mt-0.5">
                      {we.sets}&times;{we.reps || `${we.duration_seconds}s`}
                      {we.target_weight_kg && ` @ ${we.target_weight_kg}kg`}
                      {we.distance_meters && ` \u00b7 ${we.distance_meters}m`}
                      {we.tempo && ` \u00b7 ${we.tempo}`}
                      {we.rest_seconds && ` \u00b7 ${we.rest_seconds}s rest`}
                    </p>
                  </div>
                </div>
                {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />}
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 space-y-3">
                  {exercise.description && (
                    <div className="mb-2">
                      <button
                        onClick={() => setExpandedInfo(showInfo ? null : we.id)}
                        className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Info className="w-3.5 h-3.5" />
                        <span>{showInfo ? 'Hide info' : 'Show info'}</span>
                      </button>
                      {showInfo && (
                        <p className="mt-1.5 text-xs text-muted-foreground bg-background/50 px-3 py-2 rounded leading-relaxed">
                          {exercise.description}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="space-y-1.5 mb-2">
                    {we.notes && (
                      <p className="text-[10px] font-mono text-primary bg-primary/5 px-3 py-1.5 rounded border border-primary/10">
                        {we.notes}
                      </p>
                    )}
                    {prev && (
                      <p className="text-[10px] font-mono text-muted-foreground bg-background px-3 py-1.5 rounded">
                        Last: {prev.weight_kg ? `${prev.weight_kg}kg` : ''}{prev.reps_completed ? ` \u00d7 ${prev.reps_completed}` : ''}{prev.time_seconds ? `${prev.time_seconds}s` : ''}
                      </p>
                    )}
                    {(we.target_weight_kg || (we.reps && /^\d+$/.test(we.reps)) || we.duration_seconds) && (
                      <button
                        onClick={() => quickFill(we.id)}
                        className="flex items-center gap-1 text-[10px] font-mono font-bold text-primary px-3 py-1.5 bg-primary/5 rounded hover:bg-primary/10 transition-colors border border-primary/10"
                      >
                        <Zap className="w-3 h-3" />
                        Auto-fill prescribed
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-[40px_1fr_1fr_40px] gap-2 text-[9px] font-mono font-bold text-muted-foreground uppercase tracking-wider px-1">
                    <span>Set</span>
                    <span>{we.duration_seconds ? 'Time' : 'Weight'}</span>
                    <span>{we.duration_seconds ? '' : 'Reps'}</span>
                    <span></span>
                  </div>

                  {sets.map(set => {
                    const setKey = `${we.id}-${set.set_number}`
                    const isAnimating = animatingSetKey === setKey

                    return (
                      <div
                        key={set.set_number}
                        className={`grid grid-cols-[40px_1fr_1fr_40px] gap-2 items-center transition-opacity ${
                          set.completed ? 'opacity-50' : ''
                        }`}
                      >
                        <span className="text-xs text-center font-mono text-muted-foreground">{set.set_number}</span>
                        {we.duration_seconds ? (
                          <input
                            type="number"
                            inputMode="numeric"
                            placeholder={String(we.duration_seconds)}
                            value={set.time_seconds ?? ''}
                            onChange={e => updateSet(we.id, set.set_number, { time_seconds: e.target.value ? Number(e.target.value) : null })}
                            className="h-11 px-3 bg-background border border-border rounded text-sm font-mono text-center focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                          />
                        ) : (
                          <input
                            type="number"
                            inputMode="decimal"
                            placeholder={we.target_weight_kg ? `${we.target_weight_kg}` : 'kg'}
                            value={set.weight_kg ?? ''}
                            onChange={e => updateSet(we.id, set.set_number, { weight_kg: e.target.value ? Number(e.target.value) : null })}
                            className="h-11 px-3 bg-background border border-border rounded text-sm font-mono text-center focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                          />
                        )}
                        {!we.duration_seconds ? (
                          <input
                            type="number"
                            inputMode="numeric"
                            placeholder={we.reps || ''}
                            value={set.reps_completed ?? ''}
                            onChange={e => updateSet(we.id, set.set_number, { reps_completed: e.target.value ? Number(e.target.value) : null })}
                            className="h-11 px-3 bg-background border border-border rounded text-sm font-mono text-center focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                          />
                        ) : <div />}
                        <button
                          onClick={() => toggleSetComplete(we.id, set.set_number)}
                          className={`w-11 h-11 rounded flex items-center justify-center transition-all duration-200 ${
                            isAnimating ? 'scale-125' : 'scale-100'
                          } ${
                            set.completed
                              ? 'bg-primary/20 text-primary shadow-[0_0_8px_rgba(0,229,255,0.2)]'
                              : 'bg-background border border-border text-muted-foreground hover:border-primary/50'
                          }`}
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

      {/* Knee Pain */}
      <div className="bg-card rounded-lg p-4 border border-border space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className={`w-4 h-4 ${kneePain >= 7 ? 'text-destructive' : kneePain >= 4 ? 'text-amber-400' : 'text-success'}`} />
            <span className="text-xs font-heading font-bold uppercase tracking-wider">Knee Pain</span>
          </div>
          <span className={`text-lg font-mono font-bold ${kneePain >= 7 ? 'text-destructive' : kneePain >= 4 ? 'text-amber-400' : 'text-success'}`}>
            {kneePain}
          </span>
        </div>
        <input type="range" min={1} max={10} value={kneePain} onChange={e => setKneePain(Number(e.target.value))} className="w-full" />
        <div className="flex justify-between text-[9px] font-mono text-muted-foreground">
          <span>None</span><span>Severe</span>
        </div>
      </div>

      {/* RPE */}
      <div className="bg-card rounded-lg p-4 border border-border space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-heading font-bold uppercase tracking-wider">Session RPE</span>
          <span className="text-lg font-mono font-bold">{rpe}/10</span>
        </div>
        <input type="range" min={1} max={10} value={rpe} onChange={e => setRpe(Number(e.target.value))} className="w-full" />
      </div>

      <textarea
        placeholder="// Session notes..."
        value={notes}
        onChange={e => setNotes(e.target.value)}
        rows={3}
        className="w-full px-4 py-3 bg-card border border-border rounded-lg text-sm font-mono placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary resize-none"
      />

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full py-3.5 bg-primary text-primary-foreground rounded-lg font-heading font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(0,229,255,0.3)] transition-all disabled:opacity-50"
      >
        {saving ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <>
            <Save className="w-5 h-5" />
            Complete Protocol
          </>
        )}
      </button>

      {restTimer !== null && (
        <RestTimer seconds={restTimer} onDismiss={() => setRestTimer(null)} />
      )}
    </div>
  )
}
