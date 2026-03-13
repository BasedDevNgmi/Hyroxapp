// Full 12-week Hyrox programme embedded locally.
// Converted from supabase/seed.sql so the app works without a DB connection.

import type { Program, Exercise, Workout, WorkoutExercise } from '@/hooks/useProgram'

// ── Exercises ──────────────────────────────────────────
const exercises: Record<string, Exercise> = {
  deadmill:         { id: 'ex-deadmill',         name: 'Deadmill Reverse Walk',   category: 'hyrox_specific', description: 'Walking backwards on a turned-off treadmill or max incline.', video_url: null },
  back_squat:       { id: 'ex-back-squat',       name: 'Back Squat',              category: 'strength',       description: 'Barbell back squat. 1RM = 105kg.', video_url: null },
  rdl:              { id: 'ex-rdl',              name: 'Romanian Deadlift (RDL)',  category: 'strength',       description: 'Barbell Romanian Deadlift. 1RM = 135kg.', video_url: null },
  bulgarian:        { id: 'ex-bulgarian',        name: 'Bulgarian Split Squats',   category: 'strength',       description: 'Rear foot elevated split squat.', video_url: null },
  bikeerg:          { id: 'ex-bikeerg',          name: 'BikeErg',                  category: 'cardio',         description: 'Concept2 BikeErg or similar stationary bike.', video_url: null },
  rowerg:           { id: 'ex-rowerg',           name: 'RowErg',                   category: 'cardio',         description: 'Concept2 RowErg or similar rowing machine.', video_url: null },
  skierg:           { id: 'ex-skierg',           name: 'SkiErg',                   category: 'cardio',         description: 'Concept2 SkiErg.', video_url: null },
  incline_walk:     { id: 'ex-incline-walk',     name: 'Incline Walk',             category: 'cardio',         description: 'Treadmill incline walking.', video_url: null },
  pullups:          { id: 'ex-pullups',          name: 'Pull-ups',                 category: 'strength',       description: 'Bodyweight pull-ups or lat pulldowns.', video_url: null },
  db_ohp:           { id: 'ex-db-ohp',           name: 'Seated DB Overhead Press', category: 'strength',       description: 'Seated dumbbell overhead press.', video_url: null },
  pushups:          { id: 'ex-pushups',          name: 'Push-ups',                 category: 'strength',       description: 'Bodyweight push-ups.', video_url: null },
  farmers_carry:    { id: 'ex-farmers-carry',    name: 'Farmers Carry',            category: 'hyrox_specific', description: 'Heavy loaded carry with dumbbells/kettlebells.', video_url: null },
  pogo_jumps:       { id: 'ex-pogo-jumps',       name: 'Pogo Jumps',               category: 'strength',       description: 'Quick reactive pogo-style jumps for tendon stiffness.', video_url: null },
  sled_push:        { id: 'ex-sled-push',        name: 'Sled Push',                category: 'hyrox_specific', description: 'Weighted sled push.', video_url: null },
  running:          { id: 'ex-running',          name: 'Running',                  category: 'cardio',         description: 'Running / Walk-Run intervals.', video_url: null },
  weighted_pullups: { id: 'ex-weighted-pullups', name: 'Weighted Pull-ups',        category: 'strength',       description: 'Pull-ups with added weight.', video_url: null },
  push_press:       { id: 'ex-push-press',       name: 'Push Press',               category: 'strength',       description: 'Barbell or dumbbell push press.', video_url: null },
  burpee_broad:     { id: 'ex-burpee-broad',     name: 'Burpee Broad Jumps',       category: 'hyrox_specific', description: 'Burpee into a broad jump. Soft landing!', video_url: null },
  wall_balls:       { id: 'ex-wall-balls',       name: 'Wall Balls',               category: 'hyrox_specific', description: 'Medicine ball wall balls.', video_url: null },
  walking_lunges:   { id: 'ex-walking-lunges',   name: 'Walking Lunges',           category: 'hyrox_specific', description: 'Bodyweight or weighted walking lunges.', video_url: null },
  sandbag_lunges:   { id: 'ex-sandbag-lunges',   name: 'Sandbag Lunges',           category: 'hyrox_specific', description: 'Lunges carrying a sandbag.', video_url: null },
}

// ── Programs ──────────────────────────────────────────
export const programs: Program[] = [
  { id: 'p1', name: 'Phase 1: Base & Bulletproofing', description: 'Hypertrophy, Knee/Tendon strength, Zero running (low impact cardio only).', week_start: 1, week_end: 4, order_index: 1 },
  { id: 'p2', name: 'Phase 2: Hyrox Strength & Threshold', description: 'Intro to running (Walk/Run), heavier squats, longer threshold intervals.', week_start: 5, week_end: 8, order_index: 2 },
  { id: 'p3', name: 'Phase 3: Compromised Running', description: 'Peak Strength near 1RM, increasing running volume via Cardio Sandwiches.', week_start: 9, week_end: 12, order_index: 3 },
]

// ── Helper ──────────────────────────────────────────
let _weCounter = 0
function we(
  workoutId: string,
  exerciseKey: keyof typeof exercises,
  orderIndex: number,
  opts: Partial<Omit<WorkoutExercise, 'id' | 'workout_id' | 'exercise_id' | 'exercise' | 'order_index'>> = {}
): WorkoutExercise {
  _weCounter++
  const ex = exercises[exerciseKey]
  return {
    id: `we-${workoutId}-${_weCounter}`,
    workout_id: workoutId,
    exercise_id: ex.id,
    order_index: orderIndex,
    sets: opts.sets ?? 3,
    reps: opts.reps ?? null,
    tempo: opts.tempo ?? null,
    rest_seconds: opts.rest_seconds ?? null,
    duration_seconds: opts.duration_seconds ?? null,
    target_weight_kg: opts.target_weight_kg ?? null,
    distance_meters: opts.distance_meters ?? null,
    notes: opts.notes ?? null,
    exercise: ex,
  }
}

// ── All Workouts ──────────────────────────────────────
export const allWorkouts: Workout[] = [
  // ═══════════════════════════════════════════════
  // PHASE 1: BASE & BULLETPROOFING (Weeks 1-4)
  // ═══════════════════════════════════════════════

  // ── Week 1 ──
  {
    id: 'w1-1', program_id: 'p1', week_number: 1, day_number: 1,
    name: 'Lower Body Armor', focus: 'Hypertrophy & Knee Protection', notes: null,
    workout_exercises: [
      we('w1-1', 'deadmill', 1, { sets: 4, duration_seconds: 60, notes: 'Walking backwards on turned-off treadmill' }),
      we('w1-1', 'back_squat', 2, { sets: 4, reps: '8', tempo: '3-1-0-0', target_weight_kg: 65, notes: 'Tempo: 3 sec down, 1 sec pause at bottom' }),
      we('w1-1', 'rdl', 3, { sets: 3, reps: '10', target_weight_kg: 85 }),
      we('w1-1', 'bulgarian', 4, { sets: 3, reps: '8 per leg', notes: 'Heavy - use dumbbells' }),
    ],
  },
  {
    id: 'w1-2', program_id: 'p1', week_number: 1, day_number: 2,
    name: 'Aerobic Engine', focus: 'Zone 2 Cardio', notes: 'Choose BikeErg, RowErg, or Incline Walk. Stay in Zone 2.',
    workout_exercises: [
      we('w1-2', 'bikeerg', 1, { sets: 1, duration_seconds: 2700, notes: '45 min Zone 2. Can alternate with RowErg or Incline Walk.' }),
    ],
  },
  {
    id: 'w1-3', program_id: 'p1', week_number: 1, day_number: 3,
    name: 'Upper Body & Grip', focus: 'Upper Strength & Grip Endurance', notes: null,
    workout_exercises: [
      we('w1-3', 'pullups', 1, { sets: 4, reps: '8', notes: 'Or Lat Pulldowns' }),
      we('w1-3', 'db_ohp', 2, { sets: 4, reps: '10' }),
      we('w1-3', 'pushups', 3, { sets: 3, reps: 'Max Reps' }),
      we('w1-3', 'farmers_carry', 4, { sets: 4, distance_meters: 40, notes: 'Heavy as possible' }),
    ],
  },
  {
    id: 'w1-5', program_id: 'p1', week_number: 1, day_number: 5,
    name: 'VO2-Max Intervals', focus: 'Max Effort Intervals', notes: '1 min MAX effort / 1 min rest',
    workout_exercises: [
      we('w1-5', 'skierg', 1, { sets: 10, duration_seconds: 60, rest_seconds: 60, notes: '10 rounds: 1 min MAX / 1 min rest. Can alternate with RowErg.' }),
    ],
  },
  {
    id: 'w1-6', program_id: 'p1', week_number: 1, day_number: 6,
    name: 'Hyrox Simulation', focus: 'AMRAP Circuit', notes: '35 min AMRAP. Complete circuit as many times as possible.',
    workout_exercises: [
      we('w1-6', 'bikeerg', 1, { sets: 1, distance_meters: 1000, notes: '1000m BikeErg' }),
      we('w1-6', 'sled_push', 2, { sets: 1, distance_meters: 25, notes: 'Heavy sled push 25m' }),
      we('w1-6', 'rowerg', 3, { sets: 1, distance_meters: 500, notes: '500m RowErg' }),
      we('w1-6', 'wall_balls', 4, { sets: 1, reps: '20' }),
      we('w1-6', 'walking_lunges', 5, { sets: 1, reps: '20' }),
    ],
  },

  // ── Week 2 ──
  {
    id: 'w2-1', program_id: 'p1', week_number: 2, day_number: 1,
    name: 'Lower Body Armor', focus: 'Hypertrophy & Knee Protection', notes: null,
    workout_exercises: [
      we('w2-1', 'deadmill', 1, { sets: 4, duration_seconds: 75 }),
      we('w2-1', 'back_squat', 2, { sets: 4, reps: '6', tempo: '3-1-0-0', target_weight_kg: 70, notes: 'Tempo: 3 sec down, 1 sec pause' }),
      we('w2-1', 'rdl', 3, { sets: 4, reps: '8', target_weight_kg: 95 }),
      we('w2-1', 'bulgarian', 4, { sets: 3, reps: '8 per leg', notes: 'Heavy - use dumbbells' }),
    ],
  },
  {
    id: 'w2-2', program_id: 'p1', week_number: 2, day_number: 2,
    name: 'Aerobic Engine', focus: 'Zone 2 Cardio', notes: 'Choose BikeErg, RowErg, or Incline Walk.',
    workout_exercises: [
      we('w2-2', 'bikeerg', 1, { sets: 1, duration_seconds: 3000, notes: '50 min Zone 2' }),
    ],
  },
  {
    id: 'w2-3', program_id: 'p1', week_number: 2, day_number: 3,
    name: 'Upper Body & Grip', focus: 'Upper Strength & Grip Endurance', notes: null,
    workout_exercises: [
      we('w2-3', 'pullups', 1, { sets: 4, reps: '9' }),
      we('w2-3', 'db_ohp', 2, { sets: 4, reps: '8' }),
      we('w2-3', 'pushups', 3, { sets: 3, reps: 'Max Reps' }),
      we('w2-3', 'farmers_carry', 4, { sets: 5, distance_meters: 40, notes: 'Heavy' }),
    ],
  },
  {
    id: 'w2-5', program_id: 'p1', week_number: 2, day_number: 5,
    name: 'VO2-Max Intervals', focus: 'Max Effort Intervals', notes: '1 min MAX effort / 1 min rest',
    workout_exercises: [
      we('w2-5', 'skierg', 1, { sets: 12, duration_seconds: 60, rest_seconds: 60, notes: '12 rounds: 1 min MAX / 1 min rest' }),
    ],
  },
  {
    id: 'w2-6', program_id: 'p1', week_number: 2, day_number: 6,
    name: 'Hyrox Simulation', focus: 'AMRAP Circuit', notes: '40 min AMRAP',
    workout_exercises: [
      we('w2-6', 'bikeerg', 1, { sets: 1, distance_meters: 1000, notes: '1000m BikeErg' }),
      we('w2-6', 'sled_push', 2, { sets: 1, distance_meters: 25, notes: 'Heavy sled push' }),
      we('w2-6', 'rowerg', 3, { sets: 1, distance_meters: 500, notes: '500m RowErg' }),
      we('w2-6', 'wall_balls', 4, { sets: 1, reps: '20' }),
      we('w2-6', 'walking_lunges', 5, { sets: 1, reps: '20' }),
    ],
  },

  // ── Week 3 ──
  {
    id: 'w3-1', program_id: 'p1', week_number: 3, day_number: 1,
    name: 'Lower Body Armor', focus: 'Hypertrophy & Knee Protection', notes: null,
    workout_exercises: [
      we('w3-1', 'deadmill', 1, { sets: 4, duration_seconds: 90 }),
      we('w3-1', 'back_squat', 2, { sets: 5, reps: '5', tempo: '3-1-0-0', target_weight_kg: 77.5, notes: 'Tempo: 3 sec down, 1 sec pause' }),
      we('w3-1', 'rdl', 3, { sets: 4, reps: '8', target_weight_kg: 100 }),
      we('w3-1', 'bulgarian', 4, { sets: 3, reps: '8 per leg', notes: 'Heavy' }),
    ],
  },
  {
    id: 'w3-2', program_id: 'p1', week_number: 3, day_number: 2,
    name: 'Aerobic Engine', focus: 'Zone 2 Cardio', notes: 'Choose BikeErg, RowErg, or Incline Walk.',
    workout_exercises: [
      we('w3-2', 'bikeerg', 1, { sets: 1, duration_seconds: 3600, notes: '60 min Zone 2' }),
    ],
  },
  {
    id: 'w3-3', program_id: 'p1', week_number: 3, day_number: 3,
    name: 'Upper Body & Grip', focus: 'Upper Strength & Grip Endurance', notes: null,
    workout_exercises: [
      we('w3-3', 'pullups', 1, { sets: 4, reps: '10' }),
      we('w3-3', 'db_ohp', 2, { sets: 5, reps: '6' }),
      we('w3-3', 'pushups', 3, { sets: 3, reps: 'Max Reps' }),
      we('w3-3', 'farmers_carry', 4, { sets: 6, distance_meters: 40, notes: 'Heavy' }),
    ],
  },
  {
    id: 'w3-5', program_id: 'p1', week_number: 3, day_number: 5,
    name: 'VO2-Max Intervals', focus: 'Max Effort Intervals', notes: '1 min MAX effort / 1 min rest',
    workout_exercises: [
      we('w3-5', 'skierg', 1, { sets: 15, duration_seconds: 60, rest_seconds: 60, notes: '15 rounds: 1 min MAX / 1 min rest' }),
    ],
  },
  {
    id: 'w3-6', program_id: 'p1', week_number: 3, day_number: 6,
    name: 'Hyrox Simulation', focus: 'AMRAP Circuit', notes: '45 min AMRAP',
    workout_exercises: [
      we('w3-6', 'bikeerg', 1, { sets: 1, distance_meters: 1000, notes: '1000m BikeErg' }),
      we('w3-6', 'sled_push', 2, { sets: 1, distance_meters: 25, notes: 'Heavy sled push' }),
      we('w3-6', 'rowerg', 3, { sets: 1, distance_meters: 500, notes: '500m RowErg' }),
      we('w3-6', 'wall_balls', 4, { sets: 1, reps: '20' }),
      we('w3-6', 'walking_lunges', 5, { sets: 1, reps: '20' }),
    ],
  },

  // ── Week 4 (Deload) ──
  {
    id: 'w4-1', program_id: 'p1', week_number: 4, day_number: 1,
    name: 'Lower Body Armor', focus: 'Deload Week', notes: 'Reduced volume and intensity',
    workout_exercises: [
      we('w4-1', 'deadmill', 1, { sets: 3, duration_seconds: 60 }),
      we('w4-1', 'back_squat', 2, { sets: 3, reps: '5', tempo: '3-1-0-0', target_weight_kg: 60 }),
      we('w4-1', 'rdl', 3, { sets: 3, reps: '10', target_weight_kg: 70 }),
      we('w4-1', 'bulgarian', 4, { sets: 2, reps: '8 per leg', notes: 'Light' }),
    ],
  },
  {
    id: 'w4-2', program_id: 'p1', week_number: 4, day_number: 2,
    name: 'Aerobic Engine', focus: 'Deload - Zone 2', notes: 'Easy session',
    workout_exercises: [
      we('w4-2', 'bikeerg', 1, { sets: 1, duration_seconds: 1800, notes: '30 min Zone 2' }),
    ],
  },
  {
    id: 'w4-3', program_id: 'p1', week_number: 4, day_number: 3,
    name: 'Upper Body & Grip', focus: 'Deload Week', notes: 'Reduced volume',
    workout_exercises: [
      we('w4-3', 'pullups', 1, { sets: 3, reps: '8' }),
      we('w4-3', 'db_ohp', 2, { sets: 3, reps: '10' }),
      we('w4-3', 'pushups', 3, { sets: 2, reps: '15' }),
      we('w4-3', 'farmers_carry', 4, { sets: 3, distance_meters: 40 }),
    ],
  },
  {
    id: 'w4-5', program_id: 'p1', week_number: 4, day_number: 5,
    name: 'VO2-Max Intervals', focus: 'Deload Intervals', notes: 'Reduced volume, longer rest',
    workout_exercises: [
      we('w4-5', 'skierg', 1, { sets: 8, duration_seconds: 45, rest_seconds: 75, notes: '8 rounds: 45 sec effort / 75 sec rest' }),
    ],
  },
  {
    id: 'w4-6', program_id: 'p1', week_number: 4, day_number: 6,
    name: 'Hyrox Simulation', focus: 'Deload AMRAP', notes: '25 min at 70% effort',
    workout_exercises: [
      we('w4-6', 'bikeerg', 1, { sets: 1, distance_meters: 1000, notes: '1000m BikeErg at 70%' }),
      we('w4-6', 'sled_push', 2, { sets: 1, distance_meters: 25, notes: 'Light sled push' }),
      we('w4-6', 'rowerg', 3, { sets: 1, distance_meters: 500, notes: '500m RowErg at 70%' }),
      we('w4-6', 'wall_balls', 4, { sets: 1, reps: '20' }),
      we('w4-6', 'walking_lunges', 5, { sets: 1, reps: '20' }),
    ],
  },

  // ═══════════════════════════════════════════════
  // PHASE 2: HYROX STRENGTH & THRESHOLD (Weeks 5-8)
  // ═══════════════════════════════════════════════

  // ── Week 5 ──
  {
    id: 'w5-1', program_id: 'p2', week_number: 5, day_number: 1,
    name: 'Lower Body Power', focus: 'Power & Strength', notes: null,
    workout_exercises: [
      we('w5-1', 'pogo_jumps', 1, { sets: 3, reps: '20' }),
      we('w5-1', 'sled_push', 2, { sets: 4, distance_meters: 20 }),
      we('w5-1', 'back_squat', 3, { sets: 4, reps: '5', target_weight_kg: 80 }),
      we('w5-1', 'rdl', 4, { sets: 3, reps: '8', target_weight_kg: 85 }),
    ],
  },
  {
    id: 'w5-2', program_id: 'p2', week_number: 5, day_number: 2,
    name: 'Engine & Knee Test', focus: 'Cardio + Run Introduction', notes: 'First run introduction - monitor knees',
    workout_exercises: [
      we('w5-2', 'bikeerg', 1, { sets: 1, duration_seconds: 2400, notes: '40 min BikeErg' }),
      we('w5-2', 'running', 2, { sets: 1, duration_seconds: 600, notes: '10 min Run/Walk. Monitor knees closely.' }),
    ],
  },
  {
    id: 'w5-3', program_id: 'p2', week_number: 5, day_number: 3,
    name: 'Upper Body & Hyrox Skills', focus: 'Upper Strength & Hyrox Stations', notes: null,
    workout_exercises: [
      we('w5-3', 'weighted_pullups', 1, { sets: 4, reps: '6-8' }),
      we('w5-3', 'push_press', 2, { sets: 4, reps: '6' }),
      we('w5-3', 'burpee_broad', 3, { sets: 4, distance_meters: 10, notes: 'Soft landing!' }),
      we('w5-3', 'farmers_carry', 4, { sets: 4, distance_meters: 40, notes: 'Very heavy' }),
    ],
  },
  {
    id: 'w5-5', program_id: 'p2', week_number: 5, day_number: 5,
    name: 'Lactate Threshold', focus: 'Threshold Intervals', notes: '2 min rest between blocks',
    workout_exercises: [
      we('w5-5', 'rowerg', 1, { sets: 4, duration_seconds: 240, rest_seconds: 120, notes: '4x 4min blocks, 2 min rest. Can use SkiErg.' }),
    ],
  },
  {
    id: 'w5-6', program_id: 'p2', week_number: 5, day_number: 6,
    name: 'Compromised Running Sim', focus: 'AMRAP Circuit', notes: '35 min AMRAP',
    workout_exercises: [
      we('w5-6', 'running', 1, { sets: 1, distance_meters: 400, notes: '400m Run' }),
      we('w5-6', 'sled_push', 2, { sets: 1, distance_meters: 25, notes: 'Sled push 25m' }),
      we('w5-6', 'rowerg', 3, { sets: 1, distance_meters: 500, notes: '500m RowErg' }),
      we('w5-6', 'wall_balls', 4, { sets: 1, reps: '20' }),
    ],
  },

  // ── Week 6 ──
  {
    id: 'w6-1', program_id: 'p2', week_number: 6, day_number: 1,
    name: 'Lower Body Power', focus: 'Power & Strength', notes: null,
    workout_exercises: [
      we('w6-1', 'pogo_jumps', 1, { sets: 3, reps: '20' }),
      we('w6-1', 'sled_push', 2, { sets: 5, distance_meters: 20 }),
      we('w6-1', 'back_squat', 3, { sets: 4, reps: '5', target_weight_kg: 82.5 }),
      we('w6-1', 'rdl', 4, { sets: 3, reps: '8', target_weight_kg: 85 }),
    ],
  },
  {
    id: 'w6-2', program_id: 'p2', week_number: 6, day_number: 2,
    name: 'Engine & Knee Test', focus: 'Cardio + Run', notes: null,
    workout_exercises: [
      we('w6-2', 'bikeerg', 1, { sets: 1, duration_seconds: 2100, notes: '35 min BikeErg' }),
      we('w6-2', 'running', 2, { sets: 1, duration_seconds: 900, notes: '15 min Run/Walk' }),
    ],
  },
  {
    id: 'w6-3', program_id: 'p2', week_number: 6, day_number: 3,
    name: 'Upper Body & Hyrox Skills', focus: 'Upper Strength & Hyrox Stations', notes: null,
    workout_exercises: [
      we('w6-3', 'weighted_pullups', 1, { sets: 4, reps: '6-8' }),
      we('w6-3', 'push_press', 2, { sets: 4, reps: '6' }),
      we('w6-3', 'burpee_broad', 3, { sets: 4, distance_meters: 10, notes: 'Soft landing!' }),
      we('w6-3', 'farmers_carry', 4, { sets: 4, distance_meters: 40, notes: 'Very heavy' }),
    ],
  },
  {
    id: 'w6-5', program_id: 'p2', week_number: 6, day_number: 5,
    name: 'Lactate Threshold', focus: 'Threshold Intervals', notes: '2 min rest between blocks',
    workout_exercises: [
      we('w6-5', 'rowerg', 1, { sets: 5, duration_seconds: 240, rest_seconds: 120, notes: '5x 4min blocks, 2 min rest' }),
    ],
  },
  {
    id: 'w6-6', program_id: 'p2', week_number: 6, day_number: 6,
    name: 'Compromised Running Sim', focus: 'AMRAP Circuit', notes: '40 min AMRAP',
    workout_exercises: [
      we('w6-6', 'running', 1, { sets: 1, distance_meters: 400, notes: '400m Run' }),
      we('w6-6', 'sled_push', 2, { sets: 1, distance_meters: 25, notes: 'Sled push' }),
      we('w6-6', 'rowerg', 3, { sets: 1, distance_meters: 500, notes: '500m RowErg' }),
      we('w6-6', 'wall_balls', 4, { sets: 1, reps: '20' }),
    ],
  },

  // ── Week 7 ──
  {
    id: 'w7-1', program_id: 'p2', week_number: 7, day_number: 1,
    name: 'Lower Body Power', focus: 'Power & Strength', notes: null,
    workout_exercises: [
      we('w7-1', 'pogo_jumps', 1, { sets: 3, reps: '20' }),
      we('w7-1', 'sled_push', 2, { sets: 6, distance_meters: 20 }),
      we('w7-1', 'back_squat', 3, { sets: 4, reps: '4', target_weight_kg: 85 }),
      we('w7-1', 'rdl', 4, { sets: 3, reps: '8', target_weight_kg: 85 }),
    ],
  },
  {
    id: 'w7-2', program_id: 'p2', week_number: 7, day_number: 2,
    name: 'Engine & Knee Test', focus: 'Cardio + Run', notes: null,
    workout_exercises: [
      we('w7-2', 'bikeerg', 1, { sets: 1, duration_seconds: 1800, notes: '30 min BikeErg' }),
      we('w7-2', 'running', 2, { sets: 1, duration_seconds: 1200, notes: '20 min Run/Walk' }),
    ],
  },
  {
    id: 'w7-3', program_id: 'p2', week_number: 7, day_number: 3,
    name: 'Upper Body & Hyrox Skills', focus: 'Upper Strength & Hyrox Stations', notes: null,
    workout_exercises: [
      we('w7-3', 'weighted_pullups', 1, { sets: 4, reps: '6-8' }),
      we('w7-3', 'push_press', 2, { sets: 4, reps: '6' }),
      we('w7-3', 'burpee_broad', 3, { sets: 4, distance_meters: 10, notes: 'Soft landing!' }),
      we('w7-3', 'farmers_carry', 4, { sets: 4, distance_meters: 40, notes: 'Very heavy' }),
    ],
  },
  {
    id: 'w7-5', program_id: 'p2', week_number: 7, day_number: 5,
    name: 'Lactate Threshold', focus: 'Threshold Intervals', notes: '2 min rest between blocks',
    workout_exercises: [
      we('w7-5', 'rowerg', 1, { sets: 4, duration_seconds: 300, rest_seconds: 120, notes: '4x 5min blocks, 2 min rest' }),
    ],
  },
  {
    id: 'w7-6', program_id: 'p2', week_number: 7, day_number: 6,
    name: 'Compromised Running Sim', focus: 'AMRAP Circuit', notes: '45 min AMRAP',
    workout_exercises: [
      we('w7-6', 'running', 1, { sets: 1, distance_meters: 400, notes: '400m Run' }),
      we('w7-6', 'sled_push', 2, { sets: 1, distance_meters: 25, notes: 'Sled push' }),
      we('w7-6', 'rowerg', 3, { sets: 1, distance_meters: 500, notes: '500m RowErg' }),
      we('w7-6', 'wall_balls', 4, { sets: 1, reps: '20' }),
    ],
  },

  // ── Week 8 (Deload) ──
  {
    id: 'w8-1', program_id: 'p2', week_number: 8, day_number: 1,
    name: 'Lower Body Power', focus: 'Deload Week', notes: 'Reduced volume and intensity',
    workout_exercises: [
      we('w8-1', 'sled_push', 1, { sets: 3, distance_meters: 20, notes: 'Light sled push' }),
      we('w8-1', 'back_squat', 2, { sets: 3, reps: '5', target_weight_kg: 65 }),
      we('w8-1', 'rdl', 3, { sets: 3, reps: '8', target_weight_kg: 85 }),
    ],
  },
  {
    id: 'w8-2', program_id: 'p2', week_number: 8, day_number: 2,
    name: 'Engine & Knee Test', focus: 'Deload - Bike Only', notes: 'No running this week',
    workout_exercises: [
      we('w8-2', 'bikeerg', 1, { sets: 1, duration_seconds: 2400, notes: '40 min BikeErg only' }),
    ],
  },
  {
    id: 'w8-3', program_id: 'p2', week_number: 8, day_number: 3,
    name: 'Upper Body & Hyrox Skills', focus: 'Deload Week', notes: 'Reduced volume',
    workout_exercises: [
      we('w8-3', 'weighted_pullups', 1, { sets: 3, reps: '6-8' }),
      we('w8-3', 'push_press', 2, { sets: 3, reps: '6' }),
      we('w8-3', 'burpee_broad', 3, { sets: 2, distance_meters: 10, notes: 'Light effort' }),
      we('w8-3', 'farmers_carry', 4, { sets: 3, distance_meters: 40, notes: 'Moderate weight' }),
    ],
  },
  {
    id: 'w8-5', program_id: 'p2', week_number: 8, day_number: 5,
    name: 'Lactate Threshold', focus: 'Deload Intervals', notes: 'Light effort',
    workout_exercises: [
      we('w8-5', 'rowerg', 1, { sets: 3, duration_seconds: 240, rest_seconds: 120, notes: '3x 4min blocks, light effort' }),
    ],
  },
  {
    id: 'w8-6', program_id: 'p2', week_number: 8, day_number: 6,
    name: 'Compromised Running Sim', focus: 'Deload AMRAP', notes: '25 min at easy effort',
    workout_exercises: [
      we('w8-6', 'running', 1, { sets: 1, distance_meters: 400, notes: '400m easy Run' }),
      we('w8-6', 'sled_push', 2, { sets: 1, distance_meters: 25, notes: 'Light sled push' }),
      we('w8-6', 'rowerg', 3, { sets: 1, distance_meters: 500, notes: '500m RowErg' }),
      we('w8-6', 'wall_balls', 4, { sets: 1, reps: '20' }),
    ],
  },

  // ═══════════════════════════════════════════════
  // PHASE 3: COMPROMISED RUNNING (Weeks 9-12)
  // ═══════════════════════════════════════════════

  // ── Week 9 ──
  {
    id: 'w9-1', program_id: 'p3', week_number: 9, day_number: 1,
    name: 'Peak Strength', focus: 'Near-1RM Strength', notes: null,
    workout_exercises: [
      we('w9-1', 'pogo_jumps', 1, { sets: 4, reps: '25' }),
      we('w9-1', 'sled_push', 2, { sets: 4, distance_meters: 20, notes: 'Heavy' }),
      we('w9-1', 'back_squat', 3, { sets: 4, reps: '4', target_weight_kg: 87.5 }),
      we('w9-1', 'rdl', 4, { sets: 3, reps: '8', target_weight_kg: 90 }),
    ],
  },
  {
    id: 'w9-2', program_id: 'p3', week_number: 9, day_number: 2,
    name: 'The Cardio Sandwich', focus: 'Bike-Run-Bike', notes: 'Compromised running: run after bike, then finish on bike',
    workout_exercises: [
      we('w9-2', 'bikeerg', 1, { sets: 1, duration_seconds: 900, notes: '15 min BikeErg' }),
      we('w9-2', 'running', 2, { sets: 1, duration_seconds: 900, notes: '15 min Run' }),
      we('w9-2', 'bikeerg', 3, { sets: 1, duration_seconds: 900, notes: '15 min BikeErg' }),
    ],
  },
  {
    id: 'w9-3', program_id: 'p3', week_number: 9, day_number: 3,
    name: 'Upper & Hyrox Specific', focus: 'Upper Strength & Hyrox Stations', notes: null,
    workout_exercises: [
      we('w9-3', 'weighted_pullups', 1, { sets: 4, reps: '5' }),
      we('w9-3', 'push_press', 2, { sets: 4, reps: '5' }),
      we('w9-3', 'sandbag_lunges', 3, { sets: 3, distance_meters: 15 }),
      we('w9-3', 'farmers_carry', 4, { sets: 4, distance_meters: 60, notes: 'Epic carry distance' }),
    ],
  },
  {
    id: 'w9-5', program_id: 'p3', week_number: 9, day_number: 5,
    name: 'Race Pace Intervals', focus: '1000m Repeats', notes: '90 sec rest between repeats',
    workout_exercises: [
      we('w9-5', 'rowerg', 1, { sets: 4, distance_meters: 1000, rest_seconds: 90, notes: '4x 1000m RowErg at race pace' }),
    ],
  },
  {
    id: 'w9-6', program_id: 'p3', week_number: 9, day_number: 6,
    name: 'The Marchon Sim', focus: 'Rounds for Time', notes: '3 rounds for time',
    workout_exercises: [
      we('w9-6', 'running', 1, { sets: 3, distance_meters: 800, notes: '800m Run per round' }),
      we('w9-6', 'sled_push', 2, { sets: 3, distance_meters: 25, notes: '25m Sled Push per round' }),
      we('w9-6', 'burpee_broad', 3, { sets: 3, distance_meters: 25, notes: '25m Burpee Broad Jumps per round' }),
      we('w9-6', 'wall_balls', 4, { sets: 3, reps: '20', notes: '20 Wall Balls per round' }),
    ],
  },

  // ── Week 10 ──
  {
    id: 'w10-1', program_id: 'p3', week_number: 10, day_number: 1,
    name: 'Peak Strength', focus: 'Near-1RM Strength', notes: null,
    workout_exercises: [
      we('w10-1', 'pogo_jumps', 1, { sets: 4, reps: '25' }),
      we('w10-1', 'sled_push', 2, { sets: 5, distance_meters: 20, notes: 'Heavy' }),
      we('w10-1', 'back_squat', 3, { sets: 4, reps: '3', target_weight_kg: 90 }),
      we('w10-1', 'rdl', 4, { sets: 3, reps: '8', target_weight_kg: 90 }),
    ],
  },
  {
    id: 'w10-2', program_id: 'p3', week_number: 10, day_number: 2,
    name: 'The Cardio Sandwich', focus: 'Bike-Run-Bike', notes: 'Increasing run volume',
    workout_exercises: [
      we('w10-2', 'bikeerg', 1, { sets: 1, duration_seconds: 900, notes: '15 min BikeErg' }),
      we('w10-2', 'running', 2, { sets: 1, duration_seconds: 1200, notes: '20 min Run' }),
      we('w10-2', 'bikeerg', 3, { sets: 1, duration_seconds: 900, notes: '15 min BikeErg' }),
    ],
  },
  {
    id: 'w10-3', program_id: 'p3', week_number: 10, day_number: 3,
    name: 'Upper & Hyrox Specific', focus: 'Upper Strength & Hyrox Stations', notes: null,
    workout_exercises: [
      we('w10-3', 'weighted_pullups', 1, { sets: 4, reps: '5' }),
      we('w10-3', 'push_press', 2, { sets: 4, reps: '5' }),
      we('w10-3', 'sandbag_lunges', 3, { sets: 4, distance_meters: 15 }),
      we('w10-3', 'farmers_carry', 4, { sets: 4, distance_meters: 60 }),
    ],
  },
  {
    id: 'w10-5', program_id: 'p3', week_number: 10, day_number: 5,
    name: 'Race Pace Intervals', focus: '1000m Repeats', notes: '90 sec rest',
    workout_exercises: [
      we('w10-5', 'rowerg', 1, { sets: 5, distance_meters: 1000, rest_seconds: 90, notes: '5x 1000m RowErg at race pace' }),
    ],
  },
  {
    id: 'w10-6', program_id: 'p3', week_number: 10, day_number: 6,
    name: 'The Marchon Sim', focus: 'Rounds for Time', notes: '4 rounds for time',
    workout_exercises: [
      we('w10-6', 'running', 1, { sets: 4, distance_meters: 800, notes: '800m Run per round' }),
      we('w10-6', 'sled_push', 2, { sets: 4, distance_meters: 25, notes: '25m Sled Push per round' }),
      we('w10-6', 'burpee_broad', 3, { sets: 4, distance_meters: 25, notes: '25m Burpee Broad Jumps per round' }),
      we('w10-6', 'wall_balls', 4, { sets: 4, reps: '20', notes: '20 Wall Balls per round' }),
    ],
  },

  // ── Week 11 ──
  {
    id: 'w11-1', program_id: 'p3', week_number: 11, day_number: 1,
    name: 'Peak Strength', focus: 'Near-1RM Strength', notes: null,
    workout_exercises: [
      we('w11-1', 'pogo_jumps', 1, { sets: 4, reps: '25' }),
      we('w11-1', 'sled_push', 2, { sets: 6, distance_meters: 20, notes: 'Heavy' }),
      we('w11-1', 'back_squat', 3, { sets: 3, reps: '3', target_weight_kg: 92.5 }),
      we('w11-1', 'rdl', 4, { sets: 3, reps: '8', target_weight_kg: 90 }),
    ],
  },
  {
    id: 'w11-2', program_id: 'p3', week_number: 11, day_number: 2,
    name: 'The Cardio Sandwich', focus: 'Bike-Run-Bike', notes: 'Peak running volume',
    workout_exercises: [
      we('w11-2', 'bikeerg', 1, { sets: 1, duration_seconds: 600, notes: '10 min BikeErg' }),
      we('w11-2', 'running', 2, { sets: 1, duration_seconds: 1800, notes: '30 min Run' }),
      we('w11-2', 'bikeerg', 3, { sets: 1, duration_seconds: 600, notes: '10 min BikeErg' }),
    ],
  },
  {
    id: 'w11-3', program_id: 'p3', week_number: 11, day_number: 3,
    name: 'Upper & Hyrox Specific', focus: 'Upper Strength & Hyrox Stations', notes: null,
    workout_exercises: [
      we('w11-3', 'weighted_pullups', 1, { sets: 4, reps: '5' }),
      we('w11-3', 'push_press', 2, { sets: 4, reps: '5' }),
      we('w11-3', 'sandbag_lunges', 3, { sets: 4, distance_meters: 20 }),
      we('w11-3', 'farmers_carry', 4, { sets: 4, distance_meters: 60 }),
    ],
  },
  {
    id: 'w11-5', program_id: 'p3', week_number: 11, day_number: 5,
    name: 'Race Pace Intervals', focus: '1000m Repeats', notes: '90 sec rest',
    workout_exercises: [
      we('w11-5', 'rowerg', 1, { sets: 6, distance_meters: 1000, rest_seconds: 90, notes: '6x 1000m RowErg at race pace' }),
    ],
  },
  {
    id: 'w11-6', program_id: 'p3', week_number: 11, day_number: 6,
    name: 'The Marchon Sim', focus: 'Rounds for Time', notes: '5 rounds for time',
    workout_exercises: [
      we('w11-6', 'running', 1, { sets: 5, distance_meters: 800, notes: '800m Run per round' }),
      we('w11-6', 'sled_push', 2, { sets: 5, distance_meters: 25, notes: '25m Sled Push per round' }),
      we('w11-6', 'burpee_broad', 3, { sets: 5, distance_meters: 25, notes: '25m Burpee Broad Jumps per round' }),
      we('w11-6', 'wall_balls', 4, { sets: 5, reps: '20', notes: '20 Wall Balls per round' }),
    ],
  },

  // ── Week 12 (Deload) ──
  {
    id: 'w12-1', program_id: 'p3', week_number: 12, day_number: 1,
    name: 'Peak Strength', focus: 'Deload Week', notes: 'Reduced volume and intensity',
    workout_exercises: [
      we('w12-1', 'sled_push', 1, { sets: 3, distance_meters: 20, notes: 'Light sled push' }),
      we('w12-1', 'back_squat', 2, { sets: 3, reps: '5', target_weight_kg: 70 }),
      we('w12-1', 'rdl', 3, { sets: 3, reps: '8', target_weight_kg: 90 }),
    ],
  },
  {
    id: 'w12-2', program_id: 'p3', week_number: 12, day_number: 2,
    name: 'The Cardio Sandwich', focus: 'Deload - Bike Only', notes: 'No running this week',
    workout_exercises: [
      we('w12-2', 'bikeerg', 1, { sets: 1, duration_seconds: 1800, notes: '30 min BikeErg only' }),
    ],
  },
  {
    id: 'w12-3', program_id: 'p3', week_number: 12, day_number: 3,
    name: 'Upper & Hyrox Specific', focus: 'Deload Week', notes: 'Reduced volume',
    workout_exercises: [
      we('w12-3', 'weighted_pullups', 1, { sets: 3, reps: '5' }),
      we('w12-3', 'push_press', 2, { sets: 3, reps: '5' }),
      we('w12-3', 'sandbag_lunges', 3, { sets: 2, distance_meters: 15, notes: 'Light' }),
      we('w12-3', 'farmers_carry', 4, { sets: 3, distance_meters: 40, notes: 'Moderate weight' }),
    ],
  },
  {
    id: 'w12-5', program_id: 'p3', week_number: 12, day_number: 5,
    name: 'Race Pace Intervals', focus: 'Deload Intervals', notes: 'Light effort',
    workout_exercises: [
      we('w12-5', 'rowerg', 1, { sets: 3, distance_meters: 1000, rest_seconds: 90, notes: '3x 1000m RowErg, light pace' }),
    ],
  },
  {
    id: 'w12-6', program_id: 'p3', week_number: 12, day_number: 6,
    name: 'The Marchon Sim', focus: 'Deload', notes: '2 rounds at easy effort',
    workout_exercises: [
      we('w12-6', 'running', 1, { sets: 2, distance_meters: 800, notes: '800m easy Run per round' }),
      we('w12-6', 'sled_push', 2, { sets: 2, distance_meters: 25, notes: '25m light Sled Push per round' }),
      we('w12-6', 'burpee_broad', 3, { sets: 2, distance_meters: 25, notes: '25m Burpee Broad Jumps per round' }),
      we('w12-6', 'wall_balls', 4, { sets: 2, reps: '20', notes: '20 Wall Balls per round' }),
    ],
  },
]

// ── Lookup maps ──────────────────────────────────────
const _workoutsByWeek = new Map<number, Workout[]>()
const _workoutById = new Map<string, Workout>()
const _workoutByWeekDay = new Map<string, Workout>()

for (const w of allWorkouts) {
  _workoutById.set(w.id, w)
  _workoutByWeekDay.set(`${w.week_number}-${w.day_number}`, w)
  const list = _workoutsByWeek.get(w.week_number) || []
  list.push(w)
  _workoutsByWeek.set(w.week_number, list)
}

export function getWorkoutsByWeek(week: number): Workout[] {
  return _workoutsByWeek.get(week) || []
}

export function getWorkoutById(id: string): Workout | null {
  return _workoutById.get(id) || null
}

export function getWorkoutByWeekDay(week: number, day: number): Workout | null {
  return _workoutByWeekDay.get(`${week}-${day}`) || null
}
