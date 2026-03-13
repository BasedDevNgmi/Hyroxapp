import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth'

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

export function useProgress() {
  const { user } = useAuth()
  const [prData, setPrData] = useState<PRData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    const fetch = async () => {
      // Fetch exercise logs with exercise info for tracked exercises
      const { data: logs } = await supabase
        .from('exercise_logs')
        .select(`
          *,
          workout_exercise:workout_exercises(
            exercise:exercises(*)
          ),
          workout_log:workout_logs(completed_at, user_id)
        `)
        .eq('completed', true)

      if (!logs) {
        setLoading(false)
        return
      }

      // Filter to user's logs and group by exercise
      const exerciseMap = new Map<string, { name: string; points: ProgressPoint[]; unit: string }>()
      const trackedExercises = ['Back Squat', 'Deadlift', 'Running (1km)', 'Deadmill Reverse Walk']

      for (const log of logs) {
        const exercise = (log.workout_exercise as Record<string, unknown>)?.exercise as { name: string } | undefined
        const workoutLog = log.workout_log as { completed_at: string; user_id: string } | null

        if (!exercise || !workoutLog || workoutLog.user_id !== user.id) continue
        if (!trackedExercises.includes(exercise.name)) continue

        const isTimeExercise = exercise.name === 'Running (1km)' || exercise.name === 'Deadmill Reverse Walk'
        const value = isTimeExercise ? log.time_seconds : log.weight_kg
        if (value == null) continue

        if (!exerciseMap.has(exercise.name)) {
          exerciseMap.set(exercise.name, {
            name: exercise.name,
            points: [],
            unit: isTimeExercise ? 'seconds' : 'kg',
          })
        }

        exerciseMap.get(exercise.name)!.points.push({
          date: workoutLog.completed_at,
          value: Number(value),
        })
      }

      const result: PRData[] = []
      for (const [, data] of exerciseMap) {
        data.points.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

        // For weight exercises: max value is PR. For time: min value is PR
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

      setPrData(result)
      setLoading(false)
    }
    fetch()
  }, [user])

  return { prData, loading }
}
