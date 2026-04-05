import { z } from 'zod'
import { exercises } from '@/data/exercises'
import type { Workout, WorkoutExercise, Exercise } from '@/hooks/useProgram'

// Valid exercise keys — the keys of the exercises record
const VALID_EXERCISE_KEYS = Object.keys(exercises)

// Map from exercise key to Exercise object for hydration
const exerciseByKey = new Map<string, { key: string; exercise: Exercise }>()
for (const [key, ex] of Object.entries(exercises)) {
  exerciseByKey.set(key, { key, exercise: ex })
}

// ── Zod schema for Claude's raw output ──────────────────────

const AIWorkoutExerciseSchema = z.object({
  exercise_key: z.string().refine(k => VALID_EXERCISE_KEYS.includes(k), {
    message: 'Unknown exercise key',
  }),
  order_index: z.number().int().min(1),
  sets: z.number().int().min(1),
  reps: z.string().nullable().optional(),
  tempo: z.string().nullable().optional(),
  rest_seconds: z.number().nullable().optional(),
  duration_seconds: z.number().nullable().optional(),
  target_weight_kg: z.number().nullable().optional(),
  distance_meters: z.number().nullable().optional(),
  notes: z.string().nullable().optional(),
})

const AIWorkoutSchema = z.object({
  name: z.string().min(1),
  focus: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  workout_exercises: z.array(AIWorkoutExerciseSchema).min(1),
})

export type AIWorkoutRaw = z.infer<typeof AIWorkoutSchema>

// ── Validate & hydrate raw Claude output into a Workout ─────

let _aiCounter = 0

export function validateAndHydrate(
  raw: unknown,
  weekNumber: number,
  dayNumber: number,
): { workout: Workout; error: null } | { workout: null; error: string } {
  const result = AIWorkoutSchema.safeParse(raw)
  if (!result.success) {
    return { workout: null, error: result.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join('; ') }
  }

  const data = result.data
  const ts = Date.now()
  const workoutId = `ai-w${weekNumber}-${dayNumber}-${ts}`

  const workoutExercises: WorkoutExercise[] = []

  for (const rawEx of data.workout_exercises) {
    const entry = exerciseByKey.get(rawEx.exercise_key)
    if (!entry) continue // Already validated by Zod, but guard anyway

    _aiCounter++
    const weId = `ai-we-${_aiCounter}-${ts}`

    workoutExercises.push({
      id: weId,
      workout_id: workoutId,
      exercise_id: entry.exercise.id,
      order_index: rawEx.order_index,
      sets: rawEx.sets,
      reps: rawEx.reps ?? null,
      tempo: rawEx.tempo ?? null,
      rest_seconds: rawEx.rest_seconds ?? null,
      duration_seconds: rawEx.duration_seconds ?? null,
      target_weight_kg: rawEx.target_weight_kg ?? null,
      distance_meters: rawEx.distance_meters ?? null,
      notes: rawEx.notes ?? null,
      exercise: entry.exercise,
    })
  }

  const workout: Workout = {
    id: workoutId,
    program_id: 'ai',
    week_number: weekNumber,
    day_number: dayNumber,
    name: data.name,
    focus: data.focus ?? null,
    notes: data.notes ?? null,
    workout_exercises: workoutExercises,
  }

  return { workout, error: null }
}
