import { exercises } from './exercises'
import { we } from './helpers'
import type { Workout } from '@/hooks/useProgram'

// ═══════════════════════════════════════════════════════════
// PHASE 5: TAPER (Weeks 39-42)
// Volume drops drastically. Strength: only singles and doubles
// to keep nervous system sharp. Body recovers and supercompensates.
//
// 1RM values: Squat 140kg, Deadlift 180kg
// ═══════════════════════════════════════════════════════════

export const phase5Workouts: Workout[] = [
  // ── Week 39: Taper Down (-40% volume) ──

  {
    id: 'w39-1', program_id: 'p5', week_number: 39, day_number: 1,
    name: 'Lower Activation', focus: 'Nervous System Maintenance',
    notes: 'Heavy enough to maintain, low volume. No grinding reps — move the bar fast.',
    workout_exercises: [
      we('w39-1', exercises.back_squat, 1, { sets: 2, reps: '2', target_weight_kg: 115, notes: '82% 1RM — crisp doubles, no grind' }),
      we('w39-1', exercises.deadlift, 2, { sets: 2, reps: '1', target_weight_kg: 153, notes: '85% 1RM — heavy singles, reset each rep' }),
      we('w39-1', exercises.farmers_carry, 3, { sets: 1, distance_meters: 100, notes: 'Race weight (2x24kg). Smooth and controlled.' }),
    ],
  },

  {
    id: 'w39-2', program_id: 'p5', week_number: 39, day_number: 2,
    name: 'Tempo Run', focus: 'Race Pace Sharpening',
    notes: 'Shorter than normal, same speed. Stay relaxed at pace.',
    workout_exercises: [
      we('w39-2', exercises.running, 1, { sets: 1, duration_seconds: 1800, notes: 'Tempo run: 30 min total with 15 min @ race pace (4:10/km). Easy warm-up/cool-down around the tempo block.' }),
    ],
  },

  {
    id: 'w39-3', program_id: 'p5', week_number: 39, day_number: 3,
    name: 'Upper Activation', focus: 'Nervous System Maintenance',
    notes: 'Minimal volume. Just enough to stay sharp.',
    workout_exercises: [
      we('w39-3', exercises.bench_press, 1, { sets: 2, reps: '2', notes: '82% 1RM — fast and controlled' }),
      we('w39-3', exercises.ohp, 2, { sets: 2, reps: '2', notes: '80% 1RM — explosive press' }),
      we('w39-3', exercises.pullups, 3, { sets: 3, reps: '5', notes: 'Bodyweight only. Easy.' }),
    ],
  },

  {
    id: 'w39-5', program_id: 'p5', week_number: 39, day_number: 5,
    name: 'Easy Run + Strides', focus: 'Aerobic Maintenance',
    notes: 'Keep it easy. Strides at the end to keep the legs snappy.',
    workout_exercises: [
      we('w39-5', exercises.running, 1, { sets: 1, duration_seconds: 1500, notes: 'Easy run 25 min — conversational pace' }),
      we('w39-5', exercises.strides, 2, { sets: 4, reps: '1', notes: '4x strides (~80m each) with full recovery between' }),
    ],
  },

  {
    id: 'w39-6', program_id: 'p5', week_number: 39, day_number: 6,
    name: 'Mini Hyrox Sim', focus: 'Race Pace Confirmation',
    notes: 'Mini-sim: 3 rounds (3x 1km run + 3 stations) @ race pace. Confirm your pacing plan. This is a dress rehearsal, not a max effort.',
    workout_exercises: [
      we('w39-6', exercises.running, 1, { sets: 3, distance_meters: 1000, notes: '3x 1km @ race pace (4:10/km). Transition quickly between stations.' }),
      we('w39-6', exercises.wall_balls, 2, { sets: 1, reps: '50', notes: 'Race weight (6kg). Find your rhythm.' }),
      we('w39-6', exercises.sled_push, 3, { sets: 1, distance_meters: 50, notes: 'Race weight. Smooth and steady.' }),
      we('w39-6', exercises.farmers_carry, 4, { sets: 1, distance_meters: 200, notes: 'Race weight (2x24kg). Practice transitions.' }),
    ],
  },

  // ── Week 40: Taper Down (-40% volume) ──

  {
    id: 'w40-1', program_id: 'p5', week_number: 40, day_number: 1,
    name: 'Lower Activation', focus: 'Nervous System Maintenance',
    notes: 'Heavy enough to maintain, low volume. No grinding reps — move the bar fast.',
    workout_exercises: [
      we('w40-1', exercises.back_squat, 1, { sets: 2, reps: '2', target_weight_kg: 115, notes: '82% 1RM — crisp doubles, no grind' }),
      we('w40-1', exercises.deadlift, 2, { sets: 2, reps: '1', target_weight_kg: 153, notes: '85% 1RM — heavy singles, reset each rep' }),
      we('w40-1', exercises.farmers_carry, 3, { sets: 1, distance_meters: 100, notes: 'Race weight (2x24kg). Smooth and controlled.' }),
    ],
  },

  {
    id: 'w40-2', program_id: 'p5', week_number: 40, day_number: 2,
    name: 'Tempo Run', focus: 'Race Pace Sharpening',
    notes: 'Shorter than normal, same speed. Stay relaxed at pace.',
    workout_exercises: [
      we('w40-2', exercises.running, 1, { sets: 1, duration_seconds: 1800, notes: 'Tempo run: 30 min total with 15 min @ race pace (4:10/km). Easy warm-up/cool-down around the tempo block.' }),
    ],
  },

  {
    id: 'w40-3', program_id: 'p5', week_number: 40, day_number: 3,
    name: 'Upper Activation', focus: 'Nervous System Maintenance',
    notes: 'Minimal volume. Just enough to stay sharp.',
    workout_exercises: [
      we('w40-3', exercises.bench_press, 1, { sets: 2, reps: '2', notes: '82% 1RM — fast and controlled' }),
      we('w40-3', exercises.ohp, 2, { sets: 2, reps: '2', notes: '80% 1RM — explosive press' }),
      we('w40-3', exercises.pullups, 3, { sets: 3, reps: '5', notes: 'Bodyweight only. Easy.' }),
    ],
  },

  {
    id: 'w40-5', program_id: 'p5', week_number: 40, day_number: 5,
    name: 'Easy Run + Strides', focus: 'Aerobic Maintenance',
    notes: 'Keep it easy. Strides at the end to keep the legs snappy.',
    workout_exercises: [
      we('w40-5', exercises.running, 1, { sets: 1, duration_seconds: 1500, notes: 'Easy run 25 min — conversational pace' }),
      we('w40-5', exercises.strides, 2, { sets: 4, reps: '1', notes: '4x strides (~80m each) with full recovery between' }),
    ],
  },

  {
    id: 'w40-6', program_id: 'p5', week_number: 40, day_number: 6,
    name: 'Mini Hyrox Sim', focus: 'Race Pace Confirmation',
    notes: 'Mini-sim: 3 rounds (3x 1km run + 3 stations) @ race pace. Confirm your pacing plan. This is a dress rehearsal, not a max effort.',
    workout_exercises: [
      we('w40-6', exercises.running, 1, { sets: 3, distance_meters: 1000, notes: '3x 1km @ race pace (4:10/km). Transition quickly between stations.' }),
      we('w40-6', exercises.wall_balls, 2, { sets: 1, reps: '50', notes: 'Race weight (6kg). Find your rhythm.' }),
      we('w40-6', exercises.sled_push, 3, { sets: 1, distance_meters: 50, notes: 'Race weight. Smooth and steady.' }),
      we('w40-6', exercises.farmers_carry, 4, { sets: 1, distance_meters: 200, notes: 'Race weight (2x24kg). Practice transitions.' }),
    ],
  },

  // ── Week 41: RACE WEEK ──
  // Mon, Tue, Fri have workouts. Wed and Sat are rest (no entries).

  {
    id: 'w41-1', program_id: 'p5', week_number: 41, day_number: 1,
    name: 'Easy Run + Strides', focus: 'Leg Feel',
    notes: 'Feel the legs, nothing else.',
    workout_exercises: [
      we('w41-1', exercises.running, 1, { sets: 1, duration_seconds: 1200, notes: 'Easy run 20 min — super easy pace' }),
      we('w41-1', exercises.strides, 2, { sets: 4, reps: '1', notes: '4x short strides. Light and bouncy.' }),
    ],
  },

  {
    id: 'w41-2', program_id: 'p5', week_number: 41, day_number: 2,
    name: 'Final Activation', focus: 'Last Heavy Session',
    notes: 'Activation only, no fatigue. 20 min in the gym. Last heavy session before race.',
    workout_exercises: [
      we('w41-2', exercises.back_squat, 1, { sets: 2, reps: '1', target_weight_kg: 112, notes: '80% 1RM — smooth singles. No grind.' }),
      we('w41-2', exercises.deadlift, 2, { sets: 1, reps: '1', target_weight_kg: 144, notes: '80% 1RM — one clean single. Walk away.' }),
    ],
  },

  // Week 41 Wednesday (day 3): REST — Prehab + foam rolling + visualization only (no workout entry)
  // Week 41 Saturday (day 6): REST — Pre-race routine, check gear, early sleep (no workout entry)

  {
    id: 'w41-5', program_id: 'p5', week_number: 41, day_number: 5,
    name: 'Openers', focus: 'Race Activation',
    notes: 'Activation only. Open up the body, feel fast, then shut it down.',
    workout_exercises: [
      we('w41-5', exercises.running, 1, { sets: 1, duration_seconds: 900, notes: '15 min easy run — relaxed and smooth' }),
      we('w41-5', exercises.strides, 2, { sets: 3, distance_meters: 200, notes: '3x 200m @ race pace. Controlled effort.' }),
      we('w41-5', exercises.wall_balls, 3, { sets: 1, reps: '10', notes: 'Light set — just feel the movement pattern' }),
      we('w41-5', exercises.sled_push, 4, { sets: 1, distance_meters: 25, notes: 'Short push — activation only, race weight' }),
    ],
  },

  // ── Week 42: RACE WEEK (Final) ──
  // Only Monday has a light workout. Tue/Wed/Fri/Sat are all rest (no entries).

  {
    id: 'w42-1', program_id: 'p5', week_number: 42, day_number: 1,
    name: 'Shake Out', focus: 'Light Mobility',
    notes: 'Shake out the legs. Nothing more.',
    workout_exercises: [
      we('w42-1', exercises.running, 1, { sets: 1, duration_seconds: 900, notes: 'Light 15 min easy jog + mobility. Just move, stay loose.' }),
    ],
  },

  // Week 42 Tuesday (day 2): REST — Hydration, nutrition prep, visualization (no workout entry)
  // Week 42 Wednesday (day 3): REST — Full rest, prepare race nutrition (no workout entry)
  // Week 42 Friday (day 5): REST — Full rest, travel to venue if needed (no workout entry)
  // Week 42 Saturday (day 6): REST — Pre-race prep, early sleep (no workout entry)

  // ── RACE DAY ──

  {
    id: 'w42-7', program_id: 'p5', week_number: 42, day_number: 7,
    name: 'RACE DAY — Hyrox Amsterdam 2027', focus: 'Sub 1:20:00',
    notes: 'Squat 140+ / Deadlift 180+ already in the pocket. Trust your training. Hybrid athlete. LET\'S GO.',
    workout_exercises: [
      we('w42-7', exercises.running, 1, { sets: 8, distance_meters: 1000, notes:
        'RACE PACING PLAN — Target: Sub 1:20:00\n' +
        '────────────────────────────────\n' +
        'Run splits: 8x 1km @ 4:10/km = ~33:20 total running\n' +
        'Station targets: ~46:00 total for all 8 stations\n' +
        'Transitions: stay under 10 sec each\n' +
        '────────────────────────────────\n' +
        'Runs 1-3: Settle in. 4:10-4:15/km. DO NOT go out too fast.\n' +
        'Runs 4-6: Hold pace. 4:10/km. This is where races are won.\n' +
        'Runs 7-8: Empty the tank. Anything you have left.\n' +
        '────────────────────────────────\n' +
        'Station strategy:\n' +
        '1. SkiErg 1000m — steady pull, ~4:00\n' +
        '2. Sled Push 50m — low and drive, ~1:45\n' +
        '3. Sled Pull 50m — hand over hand, ~1:45\n' +
        '4. Burpee Broad Jumps 80m — pace yourself, ~5:00\n' +
        '5. RowErg 1000m — strong strokes, ~3:45\n' +
        '6. Farmers Carry 200m — race weight, no stops, ~2:00\n' +
        '7. Sandbag Lunges 100m — steady rhythm, ~5:30\n' +
        '8. Wall Balls 100 reps — sets of 25, ~6:00\n' +
        '────────────────────────────────\n' +
        'You trained 42 weeks for this. Trust the process. GO.' }),
    ],
  },
]
