import { exercises } from './exercises'
import { we } from './helpers'
import type { Workout } from '@/hooks/useProgram'

// ═══════════════════════════════════════════════════════════
// PHASE 2: BUILDUP (Weeks 13-20)
// 5/3/1 style progression, run volume up, station-specific under fatigue.
// Estimated 1RM start: Squat ~118kg, Deadlift ~152kg
// Goal: Squat ~130kg / Deadlift ~168kg / 8km TT < 34 min
// ═══════════════════════════════════════════════════════════

// Weeks 13-16: Volume + Strength (5/3/1 waves)
function weeks13to16(w: number): Workout[] {
  // 5/3/1 wave based on ~118kg squat, ~152kg DL
  const sq1rm = 118
  const dl1rm = 152
  const isDeload = w === 16

  // 5/3/1 squat weights
  const sqConfig: Record<number, { sets: number; reps: string; wt: number; note: string }> = {
    13: { sets: 5, reps: '5', wt: Math.round(sq1rm * 0.78 / 2.5) * 2.5, note: '5s week — 78% 1RM' },
    14: { sets: 4, reps: '3', wt: Math.round(sq1rm * 0.85 / 2.5) * 2.5, note: '3s week — 85% 1RM' },
    15: { sets: 3, reps: '5/3/1', wt: Math.round(sq1rm * 0.75 / 2.5) * 2.5, note: '5/3/1 week — 75/85/92%' },
    16: { sets: 3, reps: '5', wt: Math.round(sq1rm * 0.70 / 2.5) * 2.5, note: 'DELOAD — 70%' },
  }
  const dlConfig: Record<number, { sets: number; reps: string; wt: number; note: string }> = {
    13: { sets: 5, reps: '5', wt: Math.round(dl1rm * 0.78 / 2.5) * 2.5, note: '5s week — 78% 1RM' },
    14: { sets: 4, reps: '3', wt: Math.round(dl1rm * 0.85 / 2.5) * 2.5, note: '3s week — 85% 1RM' },
    15: { sets: 3, reps: '5/3/1', wt: Math.round(dl1rm * 0.75 / 2.5) * 2.5, note: '5/3/1 week — 75/85/92%' },
    16: { sets: 3, reps: '5', wt: Math.round(dl1rm * 0.70 / 2.5) * 2.5, note: 'DELOAD — 70%' },
  }
  const sq = sqConfig[w]
  const dl = dlConfig[w]

  return [
    // Monday - Lower Heavy (5/3/1 Squat)
    {
      id: `w${w}-1`, program_id: 'p2', week_number: w, day_number: 1,
      name: 'Lower Heavy — 5/3/1', focus: 'Squat Wave',
      notes: isDeload ? 'DELOAD WEEK: reduced volume.' : `5/3/1 cycle — ${sq.note}`,
      workout_exercises: [
        we(`w${w}-1`, exercises.back_squat, 1, { sets: sq.sets, reps: sq.reps, target_weight_kg: sq.wt, notes: sq.note }),
        we(`w${w}-1`, exercises.leg_press, 2, { sets: isDeload ? 2 : 4, reps: '10', notes: 'Hypertrophy' }),
        we(`w${w}-1`, exercises.rdl, 3, { sets: isDeload ? 3 : 4, reps: '6', notes: 'Heavy' }),
        we(`w${w}-1`, exercises.ghr, 4, { sets: 3, reps: '8', notes: 'Or Nordic curl' }),
        we(`w${w}-1`, exercises.farmers_carry, 5, { sets: 5, distance_meters: 50, notes: 'Race weight — focus on SPEED' }),
        we(`w${w}-1`, exercises.ab_wheel, 6, { sets: 3, reps: '12' }),
        we(`w${w}-1`, exercises.dead_bug, 7, { sets: 3, reps: '10/side' }),
      ],
    },
    // Tuesday - Run + Hyrox
    {
      id: `w${w}-2`, program_id: 'p2', week_number: w, day_number: 2,
      name: 'Tempo Run + Stations', focus: 'Threshold + Station Work',
      notes: isDeload ? 'Easy run only — recovery week.' : 'Middle block at threshold pace.',
      workout_exercises: isDeload ? [
        we(`w${w}-2`, exercises.running, 1, { sets: 1, duration_seconds: 1800, notes: '30 min easy' }),
      ] : [
        we(`w${w}-2`, exercises.running, 1, { sets: 1, duration_seconds: 2400, notes: '35-40 min — middle 15 min @ 4:40-4:50/km' }),
        we(`w${w}-2`, exercises.skierg, 2, { sets: 5, distance_meters: 1000, rest_seconds: 60, notes: 'Record splits!' }),
        we(`w${w}-2`, exercises.wall_balls, 3, { sets: 1, reps: '100', notes: '100 reps for time — goal: sets of 20+' }),
        we(`w${w}-2`, exercises.sled_push, 4, { sets: 3, notes: 'Back and forth with sled pull' }),
        we(`w${w}-2`, exercises.sled_pull, 5, { sets: 3 }),
      ],
    },
    // Wednesday - Upper Heavy (5/3/1 Bench)
    {
      id: `w${w}-3`, program_id: 'p2', week_number: w, day_number: 3,
      name: 'Upper Heavy — 5/3/1', focus: 'Bench Wave + Pull',
      notes: isDeload ? 'DELOAD: light upper work.' : `5/3/1 bench wave — same schema as squat.`,
      workout_exercises: [
        we(`w${w}-3`, exercises.bench_press, 1, { sets: sq.sets, reps: sq.reps, notes: `5/3/1 — ${sq.note}` }),
        we(`w${w}-3`, exercises.ohp, 2, { sets: 4, reps: '5', notes: 'Heavy, progressive' }),
        we(`w${w}-3`, exercises.weighted_pullups, 3, { sets: 5, reps: '5' }),
        we(`w${w}-3`, exercises.barbell_row, 4, { sets: 4, reps: '6' }),
        we(`w${w}-3`, exercises.db_incline_press, 5, { sets: 3, reps: '10' }),
        we(`w${w}-3`, exercises.chest_supported, 6, { sets: 3, reps: '12' }),
        we(`w${w}-3`, exercises.ez_curl, 7, { sets: 3, reps: '12', notes: 'Superset' }),
        we(`w${w}-3`, exercises.skull_crusher, 8, { sets: 3, reps: '12' }),
      ],
    },
    // Friday - Lower Hypertrophy + Hyrox (5/3/1 Deadlift)
    {
      id: `w${w}-5`, program_id: 'p2', week_number: w, day_number: 5,
      name: 'Lower — 5/3/1 Deadlift + Hyrox', focus: 'Deadlift Wave + Stations',
      notes: isDeload ? 'DELOAD: reduced volume.' : dl.note,
      workout_exercises: [
        we(`w${w}-5`, exercises.deadlift, 1, { sets: dl.sets, reps: dl.reps, target_weight_kg: dl.wt, notes: dl.note }),
        we(`w${w}-5`, exercises.front_squat, 2, { sets: isDeload ? 2 : 4, reps: '5', target_weight_kg: Math.round(sq1rm * 0.70 / 2.5) * 2.5, notes: '70% squat' }),
        we(`w${w}-5`, exercises.sandbag_lunges, 3, { sets: 5, distance_meters: 20, notes: 'Race weight — tempo!' }),
        we(`w${w}-5`, exercises.hip_thrust, 4, { sets: 4, reps: '8', notes: 'Heavy' }),
        we(`w${w}-5`, exercises.leg_curl, 5, { sets: 3, reps: '12' }),
        we(`w${w}-5`, exercises.burpee_broad, 6, { sets: 5, reps: '8', notes: 'Rhythm 4+4, minimal rest' }),
      ],
    },
    // Saturday - Hyrox Simulation
    {
      id: `w${w}-6`, program_id: 'p2', week_number: w, day_number: 6,
      name: 'Hyrox Pairs', focus: 'Run + Station Transitions',
      notes: isDeload ? 'Easy — half distance only.' : 'Race tempo — practice run→station transitions.',
      workout_exercises: isDeload ? [
        we(`w${w}-6`, exercises.running, 1, { sets: 1, duration_seconds: 1800, notes: '30 min easy run' }),
      ] : [
        we(`w${w}-6`, exercises.running, 1, { sets: 1, duration_seconds: 2700, notes: '40-45 min easy warm-up run' }),
        we(`w${w}-6`, exercises.running, 2, { sets: 5, distance_meters: 1000, notes: 'Hyrox-pairs: 1km + 1 station, ×4-5' }),
        we(`w${w}-6`, exercises.sled_push, 3, { sets: 1, notes: 'Rotate stations each week' }),
        we(`w${w}-6`, exercises.farmers_carry, 4, { sets: 1, distance_meters: 200 }),
        we(`w${w}-6`, exercises.walking_lunges, 5, { sets: 1, distance_meters: 100 }),
        we(`w${w}-6`, exercises.burpee_broad, 6, { sets: 1, distance_meters: 80 }),
      ],
    },
  ]
}

// Weeks 17-20: Peak Attempt #1
function weeks17to20(w: number): Workout[] {
  const sq1rm = 118
  const dl1rm = 152
  const isTest = w === 20

  const sqConfig: Record<number, { sets: number; reps: string; wt: number; note: string }> = {
    17: { sets: 3, reps: '3', wt: Math.round(sq1rm * 0.87 / 2.5) * 2.5, note: '87% — building to test' },
    18: { sets: 3, reps: '3', wt: Math.round(sq1rm * 0.90 / 2.5) * 2.5, note: '90% — heavy triples' },
    19: { sets: 2, reps: '2', wt: Math.round(sq1rm * 0.92 / 2.5) * 2.5, note: '92% — peak doubles' },
    20: { sets: 1, reps: '1-2RM TEST', wt: 0, note: 'TEST DAY — work to 1-2RM' },
  }
  const dlConfig: Record<number, { sets: number; reps: string; wt: number; note: string }> = {
    17: { sets: 3, reps: '3', wt: Math.round(dl1rm * 0.87 / 2.5) * 2.5, note: '87%' },
    18: { sets: 3, reps: '3', wt: Math.round(dl1rm * 0.90 / 2.5) * 2.5, note: '90%' },
    19: { sets: 2, reps: '2', wt: Math.round(dl1rm * 0.92 / 2.5) * 2.5, note: '92%' },
    20: { sets: 1, reps: '1-2RM TEST', wt: 0, note: 'TEST DAY — work to 1-2RM' },
  }
  const sq = sqConfig[w]
  const dl = dlConfig[w]

  return [
    // Monday - Lower Heavy (Peak Squat)
    {
      id: `w${w}-1`, program_id: 'p2', week_number: w, day_number: 1,
      name: isTest ? 'Lower — 2RM Test (Squat)' : 'Lower Heavy — Peak Build',
      focus: isTest ? '1-2RM Squat Test' : 'Heavy Squat',
      notes: isTest ? 'TEST WEEK: Warm up thoroughly → work to 1-2RM squat. Expected: ~125-130kg.' : sq.note,
      workout_exercises: isTest ? [
        we(`w${w}-1`, exercises.back_squat, 1, { sets: 1, reps: '1-2RM TEST', notes: 'Warm up: bar → 60 → 80 → 100 → 110 → 120 → attempt' }),
        we(`w${w}-1`, exercises.farmers_carry, 2, { sets: 3, distance_meters: 50, notes: 'Light — just move after test' }),
      ] : [
        we(`w${w}-1`, exercises.back_squat, 1, { sets: sq.sets, reps: sq.reps, target_weight_kg: sq.wt, notes: sq.note }),
        we(`w${w}-1`, exercises.leg_press, 2, { sets: 3, reps: '8', notes: 'Light accessories — save energy' }),
        we(`w${w}-1`, exercises.farmers_carry, 3, { sets: 5, distance_meters: 50, notes: 'ABOVE race weight' }),
      ],
    },
    // Tuesday - Run + Hyrox
    {
      id: `w${w}-2`, program_id: 'p2', week_number: w, day_number: 2,
      name: isTest ? '8km Time Trial' : 'Interval Run + Stations',
      focus: isTest ? '8km TT — Goal: sub 34 min' : 'Speed Intervals',
      notes: isTest ? 'ALL OUT 8km time trial instead of simulation. Goal: sub 34 min!' : null,
      workout_exercises: isTest ? [
        we(`w${w}-2`, exercises.running, 1, { sets: 1, distance_meters: 8000, notes: '8km TIME TRIAL — goal: sub 34 min (4:15/km avg)' }),
      ] : [
        we(`w${w}-2`, exercises.running, 1, { sets: 8, distance_meters: 800, rest_seconds: 90, notes: '6-8× 800m @ 4:00-4:10/km, 90s walk rest' }),
        we(`w${w}-2`, exercises.rowerg, 2, { sets: 4, distance_meters: 1000, rest_seconds: 60, notes: 'Goal: <3:50 per 1000m' }),
        we(`w${w}-2`, exercises.wall_balls, 3, { sets: 1, reps: '100', notes: 'Goal: unbroken!' }),
      ],
    },
    // Wednesday - Upper Heavy (Peak Bench)
    {
      id: `w${w}-3`, program_id: 'p2', week_number: w, day_number: 3,
      name: isTest ? 'Upper — 2RM Test (Bench)' : 'Upper Heavy — Peak Build',
      focus: isTest ? '1-2RM Bench Test' : 'Heavy Pressing',
      notes: isTest ? 'TEST: Work to 1-2RM bench.' : 'Minimal accessories — save energy for lower tests.',
      workout_exercises: isTest ? [
        we(`w${w}-3`, exercises.bench_press, 1, { sets: 1, reps: '1-2RM TEST', notes: 'Warm up thoroughly → attempt' }),
        we(`w${w}-3`, exercises.pullups, 2, { sets: 3, reps: 'Max', notes: 'Light pulling — that\'s all' }),
      ] : [
        we(`w${w}-3`, exercises.bench_press, 1, { sets: sq.sets, reps: sq.reps, notes: `Building to test — ${sq.note}` }),
        we(`w${w}-3`, exercises.ohp, 2, { sets: 3, reps: '3', notes: 'Heavy' }),
        we(`w${w}-3`, exercises.weighted_pullups, 3, { sets: 3, reps: 'Max' }),
        we(`w${w}-3`, exercises.barbell_row, 4, { sets: 4, reps: '5', notes: 'Heavy' }),
      ],
    },
    // Friday - Lower (Peak Deadlift or Test)
    {
      id: `w${w}-5`, program_id: 'p2', week_number: w, day_number: 5,
      name: isTest ? 'Lower — 2RM Test (Deadlift)' : 'Lower — Peak Deadlift',
      focus: isTest ? '1-2RM Deadlift Test' : 'Heavy Deadlift',
      notes: isTest ? 'TEST WEEK: Work to 1-2RM deadlift. Expected: ~165-170kg.' : dl.note,
      workout_exercises: isTest ? [
        we(`w${w}-5`, exercises.deadlift, 1, { sets: 1, reps: '1-2RM TEST', notes: 'Warm up: bar → 60 → 100 → 120 → 140 → 150 → attempt' }),
        we(`w${w}-5`, exercises.sled_push, 2, { sets: 2, notes: 'Light — race distance, moderate effort' }),
        we(`w${w}-5`, exercises.sled_pull, 3, { sets: 2, notes: 'Race distance' }),
      ] : [
        we(`w${w}-5`, exercises.deadlift, 1, { sets: dl.sets, reps: dl.reps, target_weight_kg: dl.wt, notes: dl.note }),
        we(`w${w}-5`, exercises.front_squat, 2, { sets: 3, reps: '4', notes: 'Light — save for test' }),
        we(`w${w}-5`, exercises.sled_push, 3, { sets: 3, notes: 'Race distance, moderate effort' }),
        we(`w${w}-5`, exercises.sled_pull, 4, { sets: 3 }),
      ],
    },
    // Saturday - Hyrox Simulation
    {
      id: `w${w}-6`, program_id: 'p2', week_number: w, day_number: 6,
      name: isTest ? '8km Time Trial' : '6-Station Hyrox Sim',
      focus: isTest ? 'Time Trial — Sub 34 min' : 'Multi-Station Simulation',
      notes: isTest ? 'Week 20 alternative: 8km time trial if not done Tuesday.' : '6-station sim — race tempo.',
      workout_exercises: isTest ? [
        we(`w${w}-6`, exercises.running, 1, { sets: 1, duration_seconds: 1800, notes: 'Easy 30 min — recovery after test week' }),
      ] : [
        we(`w${w}-6`, exercises.running, 1, { sets: 6, distance_meters: 1000, notes: '6× 1km between stations' }),
        we(`w${w}-6`, exercises.skierg, 2, { sets: 1, distance_meters: 1000 }),
        we(`w${w}-6`, exercises.sled_push, 3, { sets: 1, distance_meters: 50 }),
        we(`w${w}-6`, exercises.rowerg, 4, { sets: 1, distance_meters: 1000 }),
        we(`w${w}-6`, exercises.farmers_carry, 5, { sets: 1, distance_meters: 200 }),
        we(`w${w}-6`, exercises.walking_lunges, 6, { sets: 1, distance_meters: 100 }),
        we(`w${w}-6`, exercises.wall_balls, 7, { sets: 1, reps: '75' }),
      ],
    },
  ]
}

export const phase2Workouts: Workout[] = [
  ...weeks13to16(13),
  ...weeks13to16(14),
  ...weeks13to16(15),
  ...weeks13to16(16), // deload
  ...weeks17to20(17),
  ...weeks17to20(18),
  ...weeks17to20(19),
  ...weeks17to20(20), // test
]
