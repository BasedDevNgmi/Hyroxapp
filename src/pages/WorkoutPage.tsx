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

function getPreviousPerformance(id: string) {
  const raw = localStorage.getItem('hyrox_exercise_logs')
  if (!raw) return null
  const logs = JSON.parse(raw) as { workout_exercise_id: string; weight_kg: number | null; reps_completed: number | null; time_seconds: number | null; completed: boolean }[]
  const matching = logs.filter(l => l.workout_exercise_id === id && l.completed)
  return matching.length > 0 ? matching[matching.length - 1] : null
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
    if (draft) { setKneePain(draft.knee_pain_level); setRpe(draft.overall_rpe); setNotes(draft.notes); setExerciseLogs(draft.exercise_logs); return }
    const logs: ExerciseLogDraft[] = []
    for (const we of workout.workout_exercises) {
      for (let s = 1; s <= we.sets; s++) {
        logs.push({ workout_exercise_id: we.id, set_number: s, weight_kg: null, reps_completed: null, time_seconds: null, completed: false, notes: '' })
      }
    }
    setExerciseLogs(logs)
    if (workout.workout_exercises.length > 0) setExpandedExercise(workout.workout_exercises[0].id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workout])

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
    const order = workout.workout_exercises.map(we => we.id)
    const idx = order.indexOf(weId)
    for (let i = idx + 1; i < order.length; i++) {
      if (!updatedLogs.filter(el => el.workout_exercise_id === order[i]).every(s => s.completed)) {
        setExpandedExercise(order[i])
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

  const quickFill = (weId: string) => {
    if (!workout) return
    const we = workout.workout_exercises.find(w => w.id === weId)
    if (!we) return
    setExerciseLogs(prev => prev.map(el => {
      if (el.workout_exercise_id !== weId) return el
      const u: Partial<ExerciseLogDraft> = {}
      if (we.target_weight_kg && el.weight_kg === null) u.weight_kg = Number(we.target_weight_kg)
      if (we.reps && el.reps_completed === null) { const p = parseInt(we.reps); if (!isNaN(p)) u.reps_completed = p }
      if (we.duration_seconds && el.time_seconds === null) u.time_seconds = we.duration_seconds
      return { ...el, ...u }
    }))
  }

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
    <div className={`max-w-lg mx-auto px-5 pt-6 space-y-4 ${restTimer !== null ? 'pb-32' : 'pb-8'}`}>
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

      {/* Progress */}
      <div className="space-y-1">
        <div className="flex justify-between text-[11px] text-muted-foreground">
          <span>Progress</span>
          <span>{completedCount}/{totalCount} sets</span>
        </div>
        <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <PrehabSection />

      {/* Exercises */}
      <div className="space-y-2">
        {workout.workout_exercises.map(we => {
          const exercise = we.exercise as { name: string; category: string; description: string | null }
          const sets = exerciseLogs.filter(el => el.workout_exercise_id === we.id)
          const allDone = sets.every(s => s.completed)
          const isExpanded = expandedExercise === we.id
          const prev = getPreviousPerformance(we.id)
          const showInfo = expandedInfo === we.id

          return (
            <div key={we.id} ref={el => { exerciseRefs.current[we.id] = el }}
              className={`bg-card rounded-xl overflow-hidden transition-colors ${allDone ? 'ring-1 ring-success/20' : ''}`}>
              <button onClick={() => setExpandedExercise(isExpanded ? null : we.id)}
                className="w-full p-4 flex items-center justify-between text-left">
                <div className="flex items-center gap-3">
                  {allDone ? (
                    <div className="w-7 h-7 rounded-full bg-success/10 flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 text-success" />
                    </div>
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center">
                      <span className="text-[10px] text-muted-foreground font-medium">{sets.filter(s => s.completed).length}/{sets.length}</span>
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-[13px] font-medium">{exercise.name}</p>
                      <CategoryBadge category={exercise.category} />
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
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
                    <div>
                      <button onClick={() => setExpandedInfo(showInfo ? null : we.id)}
                        className="flex items-center gap-1.5 text-[10px] text-muted-foreground hover:text-foreground transition-colors">
                        <Info className="w-3 h-3" /><span>{showInfo ? 'Hide' : 'Info'}</span>
                      </button>
                      {showInfo && <p className="mt-1 text-xs text-muted-foreground bg-background px-3 py-2 rounded-lg">{exercise.description}</p>}
                    </div>
                  )}

                  <div className="space-y-1">
                    {we.notes && <p className="text-[10px] text-primary bg-primary/5 px-3 py-1.5 rounded-lg">{we.notes}</p>}
                    {prev && <p className="text-[10px] text-muted-foreground bg-background px-3 py-1.5 rounded-lg">Last: {prev.weight_kg ? `${prev.weight_kg}kg` : ''}{prev.reps_completed ? ` × ${prev.reps_completed}` : ''}{prev.time_seconds ? `${prev.time_seconds}s` : ''}</p>}
                    {(we.target_weight_kg || (we.reps && /^\d+$/.test(we.reps)) || we.duration_seconds) && (
                      <button onClick={() => quickFill(we.id)}
                        className="flex items-center gap-1 text-[10px] text-primary font-medium px-3 py-1.5 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors">
                        <Zap className="w-3 h-3" /> Auto-fill
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-[36px_1fr_1fr_36px] gap-2 text-[9px] font-medium text-muted-foreground uppercase px-0.5">
                    <span>Set</span>
                    <span>{we.duration_seconds ? 'Time' : 'Weight'}</span>
                    <span>{we.duration_seconds ? '' : 'Reps'}</span>
                    <span></span>
                  </div>

                  {sets.map(set => {
                    const isAnim = animatingSetKey === `${we.id}-${set.set_number}`
                    return (
                      <div key={set.set_number} className={`grid grid-cols-[36px_1fr_1fr_36px] gap-2 items-center ${set.completed ? 'opacity-50' : ''}`}>
                        <span className="text-xs text-center text-muted-foreground">{set.set_number}</span>
                        {we.duration_seconds ? (
                          <input type="number" inputMode="numeric" placeholder={String(we.duration_seconds)} value={set.time_seconds ?? ''}
                            onChange={e => updateSet(we.id, set.set_number, { time_seconds: e.target.value ? Number(e.target.value) : null })}
                            className="h-11 px-3 bg-background border border-border rounded-lg text-sm text-center focus:outline-none focus:ring-1 focus:ring-primary" />
                        ) : (
                          <input type="number" inputMode="decimal" placeholder={we.target_weight_kg ? `${we.target_weight_kg}` : 'kg'} value={set.weight_kg ?? ''}
                            onChange={e => updateSet(we.id, set.set_number, { weight_kg: e.target.value ? Number(e.target.value) : null })}
                            className="h-11 px-3 bg-background border border-border rounded-lg text-sm text-center focus:outline-none focus:ring-1 focus:ring-primary" />
                        )}
                        {!we.duration_seconds ? (
                          <input type="number" inputMode="numeric" placeholder={we.reps || ''} value={set.reps_completed ?? ''}
                            onChange={e => updateSet(we.id, set.set_number, { reps_completed: e.target.value ? Number(e.target.value) : null })}
                            className="h-11 px-3 bg-background border border-border rounded-lg text-sm text-center focus:outline-none focus:ring-1 focus:ring-primary" />
                        ) : <div />}
                        <button onClick={() => toggleSetComplete(we.id, set.set_number)}
                          className={`w-11 h-11 rounded-lg flex items-center justify-center transition-all duration-200 ${isAnim ? 'scale-110' : ''} ${
                            set.completed ? 'bg-primary/15 text-primary' : 'bg-background border border-border text-muted-foreground hover:border-primary/50'
                          }`}>
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
