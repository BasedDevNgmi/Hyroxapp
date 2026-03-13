import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useWorkout } from '@/hooks/useProgram'
import { useWorkoutLog, type ExerciseLogDraft } from '@/hooks/useWorkoutLog'
import {
  ArrowLeft,
  Check,
  Loader2,
  ChevronDown,
  ChevronUp,
  Save,
  Trophy,
  AlertTriangle,
} from 'lucide-react'

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

  // Initialize exercise logs from workout template
  useEffect(() => {
    if (!workout) return

    // Try to load draft first
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

  // Auto-save draft on changes
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

  const toggleSetComplete = (weId: string, setNum: number) => {
    setExerciseLogs(prev =>
      prev.map(el =>
        el.workout_exercise_id === weId && el.set_number === setNum
          ? { ...el, completed: !el.completed }
          : el
      )
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
      alert('Error saving: ' + error.message)
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

  if (showComplete) {
    const completedSets = exerciseLogs.filter(el => el.completed).length
    const totalSets = exerciseLogs.length
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] space-y-6 text-center">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
          <Trophy className="w-10 h-10 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Workout Complete!</h2>
          <p className="text-muted-foreground mt-2">
            {completedSets}/{totalSets} sets completed
          </p>
        </div>
        <div className="flex gap-4 text-center">
          <div className="bg-card rounded-xl p-3 border border-border min-w-[80px]">
            <p className="text-xs text-muted-foreground">Knee Pain</p>
            <p className={`text-lg font-bold ${kneePain >= 7 ? 'text-destructive' : kneePain >= 4 ? 'text-yellow-500' : 'text-success'}`}>
              {kneePain}/10
            </p>
          </div>
          <div className="bg-card rounded-xl p-3 border border-border min-w-[80px]">
            <p className="text-xs text-muted-foreground">RPE</p>
            <p className="text-lg font-bold">{rpe}/10</p>
          </div>
        </div>
        <button
          onClick={() => navigate('/')}
          className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-semibold"
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
    <div className="space-y-4 pb-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-card rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-semibold">{workout.name}</h1>
          <p className="text-xs text-muted-foreground">{workout.focus}</p>
        </div>
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

      {/* Knee Pain Level */}
      <div className="bg-card rounded-2xl p-4 border border-border space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className={`w-4 h-4 ${kneePain >= 7 ? 'text-destructive' : kneePain >= 4 ? 'text-yellow-500' : 'text-success'}`} />
            <span className="text-sm font-medium">Knee Pain Level</span>
          </div>
          <span className={`text-lg font-bold ${kneePain >= 7 ? 'text-destructive' : kneePain >= 4 ? 'text-yellow-500' : 'text-success'}`}>
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

      {/* Exercises */}
      <div className="space-y-3">
        {workout.workout_exercises.map(we => {
          const exercise = we.exercise as { name: string; category: string }
          const sets = exerciseLogs.filter(el => el.workout_exercise_id === we.id)
          const allDone = sets.every(s => s.completed)
          const isExpanded = expandedExercise === we.id

          return (
            <div key={we.id} className="bg-card rounded-2xl border border-border overflow-hidden">
              <button
                onClick={() => setExpandedExercise(isExpanded ? null : we.id)}
                className="w-full p-4 flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-3">
                  {allDone ? (
                    <div className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 text-success" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full border-2 border-border" />
                  )}
                  <div>
                    <p className="font-medium text-sm">{exercise.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {we.sets}×{we.reps || `${we.duration_seconds}s`}
                      {we.target_weight_kg && ` @ ${we.target_weight_kg}kg`}
                      {we.distance_meters && ` · ${we.distance_meters}m`}
                      {we.tempo && ` · ${we.tempo}`}
                      {we.rest_seconds && ` · ${we.rest_seconds}s rest`}
                    </p>
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 space-y-2">
                  {we.notes && (
                    <p className="text-xs text-primary bg-primary/5 px-3 py-1.5 rounded-lg mb-2">
                      {we.notes}
                    </p>
                  )}

                  {/* Set Header */}
                  <div className="grid grid-cols-[40px_1fr_1fr_40px] gap-2 text-[10px] font-medium text-muted-foreground uppercase tracking-wider px-1">
                    <span>Set</span>
                    <span>{we.duration_seconds ? 'Time (s)' : 'Weight'}</span>
                    <span>{we.duration_seconds ? '' : 'Reps'}</span>
                    <span></span>
                  </div>

                  {sets.map(set => (
                    <div
                      key={set.set_number}
                      className={`grid grid-cols-[40px_1fr_1fr_40px] gap-2 items-center ${
                        set.completed ? 'opacity-60' : ''
                      }`}
                    >
                      <span className="text-sm text-center text-muted-foreground">
                        {set.set_number}
                      </span>

                      {we.duration_seconds ? (
                        <input
                          type="number"
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
                          placeholder={we.target_weight_kg ? `${we.target_weight_kg}kg` : 'kg'}
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
                        className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                          set.completed
                            ? 'bg-success/20 text-success'
                            : 'bg-background border border-border text-muted-foreground hover:border-primary'
                        }`}
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
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
    </div>
  )
}
