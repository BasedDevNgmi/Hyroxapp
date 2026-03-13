import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

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
  const [programs, setPrograms] = useState<Program[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase
        .from('programs')
        .select('*')
        .order('order_index')
      setPrograms((data as Program[]) || [])
      setLoading(false)
    }
    fetchData()
  }, [])

  return { programs, loading }
}

function sortWorkoutExercises(data: Record<string, unknown>[]): Workout[] {
  return data.map(w => {
    const workout = w as unknown as Workout
    return {
      ...workout,
      workout_exercises: [...(workout.workout_exercises || [])].sort(
        (a, b) => a.order_index - b.order_index
      ),
    }
  })
}

export function useWorkoutsForWeek(weekNumber: number) {
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const { data } = await supabase
        .from('workouts')
        .select(`
          *,
          workout_exercises(
            *,
            exercise:exercises(*)
          )
        `)
        .eq('week_number', weekNumber)
        .order('day_number')

      setWorkouts(sortWorkoutExercises((data as Record<string, unknown>[]) || []))
      setLoading(false)
    }
    fetchData()
  }, [weekNumber])

  return { workouts, loading }
}

export function useWorkout(workoutId: string | undefined) {
  const [workout, setWorkout] = useState<Workout | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!workoutId) {
      setLoading(false)
      return
    }

    const fetchData = async () => {
      setLoading(true)
      const { data } = await supabase
        .from('workouts')
        .select(`
          *,
          workout_exercises(
            *,
            exercise:exercises(*)
          )
        `)
        .eq('id', workoutId)
        .single()

      if (data) {
        setWorkout(sortWorkoutExercises([data as Record<string, unknown>])[0])
      }
      setLoading(false)
    }
    fetchData()
  }, [workoutId])

  return { workout, loading }
}

const DAY_NAMES = ['', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const
// Training days: Mon(1), Tue(2), Wed(3), Fri(5), Sat(6). Thu(4) and Sun(7) are rest.
const TRAINING_DAYS = new Set([1, 2, 3, 5, 6])

export { DAY_NAMES, TRAINING_DAYS }

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

    const currentWeek = Math.min(Math.floor(diffDays / 7) + 1, 12)
    // Use actual day of week: JS getDay() returns 0=Sun..6=Sat, convert to 1=Mon..7=Sun
    const jsDay = now.getDay()
    const dayOfWeek = jsDay === 0 ? 7 : jsDay
    const isTrainingDay = TRAINING_DAYS.has(dayOfWeek)

    setWeekNumber(currentWeek)
    setDayNumber(dayOfWeek)

    if (!isTrainingDay) {
      setLoading(false)
      return
    }

    const fetchData = async () => {
      setLoading(true)
      const { data } = await supabase
        .from('workouts')
        .select(`
          *,
          workout_exercises(
            *,
            exercise:exercises(*)
          )
        `)
        .eq('week_number', currentWeek)
        .eq('day_number', dayOfWeek)
        .maybeSingle()

      if (data) {
        setWorkout(sortWorkoutExercises([data as Record<string, unknown>])[0])
      }
      setLoading(false)
    }
    fetchData()
  }, [programStartDate])

  return { workout, weekNumber, dayNumber, loading }
}
