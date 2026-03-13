import { useEffect, useState } from 'react'

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
  weight_kg: number | null
  time_seconds: number | null
  completed: boolean
}

interface StoredWorkoutLog {
  id: string
  completed_at: string
}

export function useProgress() {
  const [prData, setPrData] = useState<PRData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Read exercise logs from localStorage
    const exerciseLogsRaw = localStorage.getItem('hyrox_exercise_logs')
    const workoutLogsRaw = localStorage.getItem('hyrox_workout_logs')

    if (!exerciseLogsRaw || !workoutLogsRaw) {
      setLoading(false)
      return
    }

    const exerciseLogs: StoredExerciseLog[] = JSON.parse(exerciseLogsRaw)
    const workoutLogs: StoredWorkoutLog[] = JSON.parse(workoutLogsRaw)
    const logMap = new Map(workoutLogs.map(l => [l.id, l]))

    // Group by workout_exercise_id and find weight/time trends
    const exerciseMap = new Map<string, { points: ProgressPoint[]; unit: string }>()

    for (const log of exerciseLogs) {
      if (!log.completed) continue
      const workoutLog = logMap.get(log.workout_log_id)
      if (!workoutLog) continue

      const value = log.weight_kg ?? log.time_seconds
      if (value == null) continue

      const unit = log.weight_kg != null ? 'kg' : 'seconds'
      const key = log.workout_exercise_id

      if (!exerciseMap.has(key)) {
        exerciseMap.set(key, { points: [], unit })
      }

      exerciseMap.get(key)!.points.push({
        date: workoutLog.completed_at,
        value: Number(value),
      })
    }

    const result: PRData[] = []
    for (const [weId, data] of exerciseMap) {
      data.points.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

      const isTimeBased = data.unit === 'seconds'
      const bestValue = isTimeBased
        ? Math.min(...data.points.map(p => p.value))
        : Math.max(...data.points.map(p => p.value))

      result.push({
        exercise_name: weId,
        current_value: bestValue,
        unit: data.unit,
        history: data.points,
      })
    }

    setPrData(result)
    setLoading(false)
  }, [])

  return { prData, loading }
}
