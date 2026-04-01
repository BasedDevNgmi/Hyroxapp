import { useEffect, useState } from 'react'
import { allExercises, allWorkouts } from '@/data/program'

export interface ProgressPoint {
  date: string
  value: number
}

export interface PRData {
  exercise_name: string
  current_value: number
  unit: string
  history: ProgressPoint[]
}

interface StoredExerciseLog {
  workout_log_id: string
  workout_exercise_id: string
  exercise_id?: string          // present in new logs; missing in old logs (fallback to weId lookup)
  weight_kg: number | null
  time_seconds: number | null
  completed: boolean
}

interface StoredWorkoutLog {
  id: string
  completed_at: string
}

// Stable map: workout_exercise_id → exercise_id, built from program data
const _weToExId = new Map(allWorkouts.flatMap(w => w.workout_exercises.map(we => [we.id, we.exercise_id])))
// exercise_id → display name
const _exIdToName = new Map(Object.values(allExercises).map(ex => [ex.id, ex.name]))

export function useProgress() {
  const [prData, setPrData] = useState<PRData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const exerciseLogsRaw = localStorage.getItem('hyrox_exercise_logs')
    const workoutLogsRaw = localStorage.getItem('hyrox_workout_logs')

    if (!exerciseLogsRaw || !workoutLogsRaw) {
      setLoading(false)
      return
    }

    const exerciseLogs: StoredExerciseLog[] = JSON.parse(exerciseLogsRaw)
    const workoutLogs: StoredWorkoutLog[] = JSON.parse(workoutLogsRaw)
    const logMap = new Map(workoutLogs.map(l => [l.id, l]))

    // Group by exercise_id (stable), falling back to weId→exId lookup for old logs
    const exerciseMap = new Map<string, { name: string; points: ProgressPoint[]; unit: string }>()

    for (const log of exerciseLogs) {
      if (!log.completed) continue
      const workoutLog = logMap.get(log.workout_log_id)
      if (!workoutLog) continue

      const value = log.weight_kg ?? log.time_seconds
      if (value == null) continue

      // Resolve stable exercise_id: prefer stored value, fall back to program lookup
      const exId = log.exercise_id ?? _weToExId.get(log.workout_exercise_id) ?? log.workout_exercise_id
      const name = _exIdToName.get(exId) ?? exId
      const unit = log.weight_kg != null ? 'kg' : 'seconds'

      if (!exerciseMap.has(exId)) {
        exerciseMap.set(exId, { name, points: [], unit })
      }

      exerciseMap.get(exId)!.points.push({
        date: workoutLog.completed_at,
        value: Number(value),
      })
    }

    const result: PRData[] = []
    for (const [, data] of exerciseMap) {
      data.points.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

      const isTimeBased = data.unit === 'seconds'
      const bestValue = isTimeBased
        ? Math.min(...data.points.map(p => p.value))
        : Math.max(...data.points.map(p => p.value))

      result.push({
        exercise_name: data.name,
        current_value: bestValue,
        unit: data.unit,
        history: data.points,
      })
    }

    // Sort by most data points (most-tracked exercises first)
    result.sort((a, b) => b.history.length - a.history.length)

    setPrData(result)
    setLoading(false)
  }, [])

  return { prData, loading }
}
