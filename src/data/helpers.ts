import type { WorkoutExercise, Exercise } from '@/hooks/useProgram'

let _weCounter = 0

/**
 * Helper to construct a WorkoutExercise object.
 * exerciseKey must match a key from the exercises record.
 */
export function we(
  workoutId: string,
  exercise: Exercise,
  orderIndex: number,
  opts: Partial<Omit<WorkoutExercise, 'id' | 'workout_id' | 'exercise_id' | 'exercise' | 'order_index'>> = {}
): WorkoutExercise {
  _weCounter++
  return {
    id: `we-${workoutId}-${_weCounter}`,
    workout_id: workoutId,
    exercise_id: exercise.id,
    order_index: orderIndex,
    sets: opts.sets ?? 3,
    reps: opts.reps ?? null,
    tempo: opts.tempo ?? null,
    rest_seconds: opts.rest_seconds ?? null,
    duration_seconds: opts.duration_seconds ?? null,
    target_weight_kg: opts.target_weight_kg ?? null,
    distance_meters: opts.distance_meters ?? null,
    notes: opts.notes ?? null,
    exercise,
    ...(opts.input_type ? { input_type: opts.input_type } : {}),
  }
}

/** Round to nearest 2.5 kg (standard plate increments) */
export function roundTo2_5(kg: number): number {
  return Math.round(kg / 2.5) * 2.5
}

/** Prehab protocol items shown as warm-up on every training day */
export const PREHAB_ITEMS = [
  'Foam roll IT-band + calves: 2 min/side',
  'Banded clamshells: 2×15/side (glute med activation)',
  'Eccentric calf raises (from step): 3×12/side',
  'Ankle mobility (knee-over-toe at wall): 2×20/side',
  'Copenhagen adductors: 2×8/side',
  'Single-leg glute bridges: 2×12/side',
  '90/90 hip stretch: 30 sec/side',
]
