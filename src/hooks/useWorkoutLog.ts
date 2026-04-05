import { useEffect, useState } from 'react'

export interface WorkoutLog {
  id: string
  user_id: string
  workout_id: string
  completed_at: string
  knee_pain_level: number | null
  overall_rpe: number | null
  notes: string | null
  duration_minutes: number | null
}

export interface ExerciseLogDraft {
  workout_exercise_id: string
  set_number: number
  weight_kg: number | null
  reps_completed: number | null
  time_seconds: number | null
  completed: boolean
  notes: string
}

export interface WorkoutLogDraft {
  workout_id: string
  knee_pain_level: number
  overall_rpe: number
  notes: string
  exercise_logs: ExerciseLogDraft[]
}

const LOGS_KEY = 'hyrox_workout_logs'
const EXERCISE_LOGS_KEY = 'hyrox_exercise_logs'
const DRAFT_KEY = (workoutId: string) => `hyrox_draft_${workoutId}`

function getAllLogs(): WorkoutLog[] {
  const stored = localStorage.getItem(LOGS_KEY)
  return stored ? JSON.parse(stored) : []
}

function saveLogs(logs: WorkoutLog[]) {
  localStorage.setItem(LOGS_KEY, JSON.stringify(logs))
}

function getAllExerciseLogs() {
  const stored = localStorage.getItem(EXERCISE_LOGS_KEY)
  return stored ? JSON.parse(stored) : []
}

function saveExerciseLogs(logs: unknown[]) {
  localStorage.setItem(EXERCISE_LOGS_KEY, JSON.stringify(logs))
}

export function useWorkoutLog(workoutId: string) {
  const [saving, setSaving] = useState(false)
  const [existingLog, setExistingLog] = useState<WorkoutLog | null>(null)

  useEffect(() => {
    if (!workoutId) return
    const logs = getAllLogs()
    const found = logs
      .filter(l => l.workout_id === workoutId)
      .sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime())[0]
    setExistingLog(found || null)
  }, [workoutId])

  const saveDraft = (draft: WorkoutLogDraft) => {
    localStorage.setItem(DRAFT_KEY(workoutId), JSON.stringify(draft))
  }

  const loadDraft = (): WorkoutLogDraft | null => {
    const stored = localStorage.getItem(DRAFT_KEY(workoutId))
    return stored ? JSON.parse(stored) : null
  }

  const clearDraft = () => {
    localStorage.removeItem(DRAFT_KEY(workoutId))
  }

  const saveWorkoutLog = async (draft: WorkoutLogDraft, startTime: Date) => {
    setSaving(true)
    const durationMinutes = Math.round((Date.now() - startTime.getTime()) / 60000)

    const workoutLog: WorkoutLog = {
      id: crypto.randomUUID(),
      user_id: 'local-user',
      workout_id: draft.workout_id,
      completed_at: new Date().toISOString(),
      knee_pain_level: draft.knee_pain_level,
      overall_rpe: draft.overall_rpe,
      notes: draft.notes || null,
      duration_minutes: durationMinutes,
    }

    const logs = getAllLogs()
    logs.unshift(workoutLog)
    saveLogs(logs)

    // Resolve exercise_id (stable across weeks) from program data + AI cache
    const { allWorkouts } = await import('@/data/program')
    const weToExerciseId = new Map(allWorkouts.flatMap(w => w.workout_exercises.map(we => [we.id, we.exercise_id])))

    // Also check AI workout cache for ai-* workout exercise IDs
    try {
      const aiRaw = localStorage.getItem('hyrox_ai_workouts')
      if (aiRaw) {
        const aiCache = JSON.parse(aiRaw) as Record<string, { workout: { workout_exercises: { id: string; exercise_id: string }[] } }>
        for (const entry of Object.values(aiCache)) {
          for (const we of entry.workout.workout_exercises) {
            weToExerciseId.set(we.id, we.exercise_id)
          }
        }
      }
    } catch { /* ignore */ }

    const exerciseLogs = draft.exercise_logs.map(el => ({
      id: crypto.randomUUID(),
      workout_log_id: workoutLog.id,
      workout_exercise_id: el.workout_exercise_id,
      exercise_id: weToExerciseId.get(el.workout_exercise_id) ?? el.workout_exercise_id,
      set_number: el.set_number,
      weight_kg: el.weight_kg,
      reps_completed: el.reps_completed,
      time_seconds: el.time_seconds,
      completed: el.completed,
      notes: el.notes || null,
    }))

    const existing = getAllExerciseLogs()
    saveExerciseLogs([...existing, ...exerciseLogs])

    clearDraft()
    setSaving(false)
    return { error: null, workoutLog }
  }

  return { saveWorkoutLog, saveDraft, loadDraft, clearDraft, saving, existingLog }
}

/**
 * Build a map of exercise_id → last logged values (weight, reps, time)
 * by scanning all past exercise logs and matching workout_exercise_ids
 * back to their exercise_id via the program data.
 */
export function getLastLoggedByExercise(
  allWorkoutExercises: { id: string; exercise_id: string }[],
): Map<string, { weight_kg: number | null; reps_completed: number | null; time_seconds: number | null }> {
  const weToExercise = new Map<string, string>()
  for (const we of allWorkoutExercises) {
    weToExercise.set(we.id, we.exercise_id)
  }

  const pastLogs = getAllExerciseLogs() as {
    workout_exercise_id: string
    completed: boolean
    weight_kg: number | null
    reps_completed: number | null
    time_seconds: number | null
  }[]

  const result = new Map<string, { weight_kg: number | null; reps_completed: number | null; time_seconds: number | null }>()

  // Iterate backwards (most recent first) and take first completed set per exercise
  for (let i = pastLogs.length - 1; i >= 0; i--) {
    const log = pastLogs[i]
    if (!log.completed) continue
    const exId = weToExercise.get(log.workout_exercise_id)
    if (!exId || result.has(exId)) continue
    result.set(exId, {
      weight_kg: log.weight_kg,
      reps_completed: log.reps_completed,
      time_seconds: log.time_seconds,
    })
  }

  return result
}

export function useWorkoutLogs() {
  const [logs, setLogs] = useState<WorkoutLog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLogs(getAllLogs())
    setLoading(false)
  }, [])

  return { logs, loading }
}
