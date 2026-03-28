import { useState, useEffect } from 'react'
import {
  programs as localPrograms,
  allWorkouts as localAllWorkouts,
  getWorkoutsByWeek,
  getWorkoutById,
  getWorkoutByWeekDay,
} from '@/data/program'

export interface Exercise {
  id: string
  name: string
  category: string
  description: string | null
  video_url: string | null
}

export interface WorkoutExercise {
  id: string
  workout_id: string
  exercise_id: string
  order_index: number
  sets: number
  reps: string | null
  tempo: string | null
  rest_seconds: number | null
  duration_seconds: number | null
  target_weight_kg: number | null
  distance_meters: number | null
  notes: string | null
  exercise: Exercise
}

export interface Workout {
  id: string
  program_id: string
  week_number: number
  day_number: number
  name: string
  focus: string | null
  notes: string | null
  workout_exercises: WorkoutExercise[]
}

export interface Program {
  id: string
  name: string
  description: string | null
  week_start: number
  week_end: number
  order_index: number
}

export function usePrograms() {
  return { programs: localPrograms, loading: false }
}

export function useWorkoutsForWeek(weekNumber: number) {
  return { workouts: getWorkoutsByWeek(weekNumber), loading: false }
}

export function useWorkout(workoutId: string | undefined) {
  const workout = workoutId ? getWorkoutById(workoutId) : null
  return { workout, loading: false }
}

const DAY_NAMES = ['', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const
// Training days: Mon(1), Tue(2), Wed(3), Fri(5), Sat(6). Thu(4) and Sun(7) are rest.
const TRAINING_DAYS = new Set([1, 2, 3, 5, 6])

export { DAY_NAMES, TRAINING_DAYS }

export interface WorkoutSummary {
  id: string
  week_number: number
  day_number: number
  name: string
  focus: string | null
}

export function useAllWorkouts() {
  const workouts: WorkoutSummary[] = localAllWorkouts.map(w => ({
    id: w.id,
    week_number: w.week_number,
    day_number: w.day_number,
    name: w.name,
    focus: w.focus,
  }))
  return { workouts, loading: false }
}

export function useTodayWorkout(programStartDate: string | null) {
  const [workout, setWorkout] = useState<Workout | null>(null)
  const [weekNumber, setWeekNumber] = useState(1)
  const [dayNumber, setDayNumber] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!programStartDate) {
      setLoading(false)
      return
    }

    const start = new Date(programStartDate)
    const now = new Date()
    const diffMs = now.getTime() - start.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays < 0) {
      setLoading(false)
      return
    }

    const currentWeek = Math.min(Math.floor(diffDays / 7) + 1, 42)
    const jsDay = now.getDay()
    const dayOfWeek = jsDay === 0 ? 7 : jsDay
    const isTrainingDay = TRAINING_DAYS.has(dayOfWeek)

    setWeekNumber(currentWeek)
    setDayNumber(dayOfWeek)

    if (!isTrainingDay) {
      setLoading(false)
      return
    }

    const found = getWorkoutByWeekDay(currentWeek, dayOfWeek)
    setWorkout(found)
    setLoading(false)
  }, [programStartDate])

  return { workout, weekNumber, dayNumber, loading }
}
