import { exercises } from './exercises'
import { we } from './helpers'
import type { Workout } from '@/hooks/useProgram'

// ═══════════════════════════════════════════════════════════
// PHASE 3: INTENSITY (Weeks 21-28)
// Second peak cycle. DUP with heavier weights. Race-pace work.
// Estimated 1RM start: Squat ~130kg, Deadlift ~170kg
// Goal: Squat ~140kg / Deadlift ~178kg / Full sim sub 1:25
// ═══════════════════════════════════════════════════════════

// Weeks 21-24: Strength + Threshold
function weeks21to24(w: number): Workout[] {
  const sq1rm = 130
  const dl1rm = 170
  const isDeload = w === 24

  const sqConfig: Record<number, { sets: number; reps: string; wt: number; note: string }> = {
    21: { sets: 5, reps: '5', wt: Math.round(sq1rm * 0.78 / 2.5) * 2.5, note: '5s week — 78% new 1RM' },
    22: { sets: 4, reps: '3', wt: Math.round(sq1rm * 0.85 / 2.5) * 2.5, note: '3s week — 85%' },
    23: { sets: 3, reps: '5/3/1', wt: Math.round(sq1rm * 0.75 / 2.5) * 2.5, note: '5/3/1 — 75/85/92%' },
    24: { sets: 3, reps: '5', wt: Math.round(sq1rm * 0.70 / 2.5) * 2.5, note: 'DELOAD — 70%' },
  }
  const dlConfig: Record<number, { sets: number; reps: string; wt: number; note: string }> = {
    21: { sets: 5, reps: '5', wt: Math.round(dl1rm * 0.78 / 2.5) * 2.5, note: '5s week — 78%' },
    22: { sets: 4, reps: '3', wt: Math.round(dl1rm * 0.85 / 2.5) * 2.5, note: '3s week — 85%' },
    23: { sets: 3, reps: '5/3/1', wt: Math.round(dl1rm * 0.75 / 2.5) * 2.5, note: '5/3/1 — 75/85/92%' },
    24: { sets: 3, reps: '5', wt: Math.round(dl1rm * 0.70 / 2.5) * 2.5, note: 'DELOAD — 70%' },
  }
  const sq = sqConfig[w]
  const dl = dlConfig[w]
  const pauseWt = Math.round(sq1rm * 0.72 / 2.5) * 2.5
  const fsWt = Math.round(sq1rm * 0.72 / 2.5) * 2.5

  return [
    // Monday - Lower Heavy
    {
      id: `w${w}-1`, program_id: 'p3', week_number: w, day_number: 1,
      name: 'Lower Heavy — 5/3/1', focus: 'Squat Wave + Pause Work',
      notes: isDeload ? 'DELOAD WEEK.' : `5/3/1 on new maxes — ${sq.note}`,
      workout_exercises: [
        we(`w${w}-1`, exercises.back_squat, 1, { sets: sq.sets, reps: sq.reps, target_weight_kg: sq.wt, notes: sq.note }),
        we(`w${w}-1`, exercises.pause_squat, 2, { sets: 3, reps: '3', target_weight_kg: pauseWt, notes: '72% — strength out of the hole' }),
        we(`w${w}-1`, exercises.rdl, 3, { sets: 4, reps: '5', notes: 'Heavy' }),
        we(`w${w}-1`, exercises.ghr, 4, { sets: 3, reps: '6' }),
        we(`w${w}-1`, exercises.farmers_carry, 5, { sets: 4, distance_meters: 50, notes: 'MAX SPEED — race weight' }),
        we(`w${w}-1`, exercises.pallof_press, 6, { sets: 3, reps: '10/side', notes: 'Heavy' }),
        we(`w${w}-1`, exercises.dragon_flag, 7, { sets: 3, reps: '6' }),
      ],
    },
    // Tuesday - Hybrid (Threshold Run + Stations)
    {
      id: `w${w}-2`, program_id: 'p3', week_number: w, day_number: 2,
      name: 'Hybrid — Threshold + Stations', focus: 'Race Pace Work',
      notes: isDeload ? 'Easy run + light stations.' : 'Threshold run with shortened station circuit at RACE PACE.',
      workout_exercises: isDeload ? [
        we(`w${w}-2`, exercises.running, 1, { sets: 1, duration_seconds: 1800, notes: '30 min easy' }),
      ] : [
        we(`w${w}-2`, exercises.running, 1, { sets: 1, duration_seconds: 2400, notes: '40 min — 25 min @ 4:20-4:30/km threshold' }),
        we(`w${w}-2`, exercises.skierg, 2, { sets: 1, distance_meters: 500, notes: 'Station circuit — RACE PACE' }),
        we(`w${w}-2`, exercises.sled_push, 3, { sets: 1, notes: 'Race pace' }),
        we(`w${w}-2`, exercises.sled_pull, 4, { sets: 1 }),
        we(`w${w}-2`, exercises.burpee_broad, 5, { sets: 1, distance_meters: 40 }),
        we(`w${w}-2`, exercises.rowerg, 6, { sets: 1, distance_meters: 500 }),
        we(`w${w}-2`, exercises.farmers_carry, 7, { sets: 1, distance_meters: 100 }),
        we(`w${w}-2`, exercises.sandbag_lunges, 8, { sets: 1, distance_meters: 50 }),
        we(`w${w}-2`, exercises.wall_balls, 9, { sets: 1, reps: '50', notes: 'Race pace' }),
      ],
    },
    // Wednesday - Upper Heavy
    {
      id: `w${w}-3`, program_id: 'p3', week_number: w, day_number: 3,
      name: 'Upper Heavy — 5/3/1', focus: 'Bench Wave + Heavy Pull',
      notes: isDeload ? 'DELOAD: light upper.' : '5/3/1 bench on new max.',
      workout_exercises: [
        we(`w${w}-3`, exercises.bench_press, 1, { sets: sq.sets, reps: sq.reps, notes: `5/3/1 bench — ${sq.note}` }),
        we(`w${w}-3`, exercises.ohp, 2, { sets: 4, reps: '4', notes: 'Heavy, progressive' }),
        we(`w${w}-3`, exercises.weighted_pullups, 3, { sets: 5, reps: '4', notes: 'Heavy!' }),
        we(`w${w}-3`, exercises.pendlay_row, 4, { sets: 4, reps: '5' }),
        we(`w${w}-3`, exercises.db_incline_press, 5, { sets: 3, reps: '8' }),
        we(`w${w}-3`, exercises.cable_row, 6, { sets: 3, reps: '10' }),
        we(`w${w}-3`, exercises.face_pulls, 7, { sets: 3, reps: '15', notes: 'Shoulder health' }),
      ],
    },
    // Friday - Lower + Hyrox (5/3/1 Deadlift)
    {
      id: `w${w}-5`, program_id: 'p3', week_number: w, day_number: 5,
      name: 'Lower — 5/3/1 Deadlift + Stations', focus: 'Deadlift + Sled + Wall Balls',
      notes: isDeload ? 'DELOAD: reduced.' : dl.note,
      workout_exercises: [
        we(`w${w}-5`, exercises.deadlift, 1, { sets: dl.sets, reps: dl.reps, target_weight_kg: dl.wt, notes: dl.note }),
        we(`w${w}-5`, exercises.front_squat, 2, { sets: 3, reps: '4', target_weight_kg: fsWt, notes: '72% squat' }),
        we(`w${w}-5`, exercises.sled_push, 3, { sets: isDeload ? 3 : 6, notes: 'Full distance, race pace' }),
        we(`w${w}-5`, exercises.sled_pull, 4, { sets: isDeload ? 3 : 6 }),
        we(`w${w}-5`, exercises.wall_balls, 5, { sets: 1, reps: isDeload ? '40' : '75', notes: 'Unbroken or as close as possible' }),
        we(`w${w}-5`, exercises.dead_hang, 6, { sets: 1, reps: 'Max', notes: 'Grip finisher' }),
        we(`w${w}-5`, exercises.towel_pullups, 7, { sets: 2, reps: 'Max' }),
      ],
    },
    // Saturday - Hyrox Sim / Long Run
    {
      id: `w${w}-6`, program_id: 'p3', week_number: w, day_number: 6,
      name: w % 2 === 1 ? 'Race-Pace Intervals' : 'Long Run',
      focus: w % 2 === 1 ? 'Speed + Stations' : 'Aerobic Endurance',
      notes: isDeload ? 'Easy long run — recovery.' : w % 2 === 1 ? 'Race-pace 1km repeats + station work.' : 'Long run 50-55 min @ 5:00/km.',
      workout_exercises: w % 2 === 1 ? [
        we(`w${w}-6`, exercises.running, 1, { sets: 8, distance_meters: 1000, rest_seconds: 60, notes: '8× 1km @ 4:10-4:20, 60s rest' }),
        we(`w${w}-6`, exercises.sled_push, 2, { sets: 2, notes: '2-3 stations at race-tempo after intervals' }),
        we(`w${w}-6`, exercises.wall_balls, 3, { sets: 1, reps: '50' }),
      ] : [
        we(`w${w}-6`, exercises.running, 1, { sets: 1, duration_seconds: 3300, notes: '50-55 min @ 5:00/km' }),
      ],
    },
  ]
}

// Weeks 25-28: Peak #2 + Simulations
function weeks25to28(w: number): Workout[] {
  const sq1rm = 130
  const dl1rm = 170
  const isTest = w === 28
  const isFullSim = w === 25 || w === 27

  const sqConfig: Record<number, { sets: number; reps: string; wt: number; note: string }> = {
    25: { sets: 3, reps: '2', wt: Math.round(sq1rm * 0.90 / 2.5) * 2.5, note: '90% — heavy doubles' },
    26: { sets: 3, reps: '2', wt: Math.round(sq1rm * 0.92 / 2.5) * 2.5, note: '92% — peak doubles' },
    27: { sets: 3, reps: '1', wt: Math.round(sq1rm * 0.95 / 2.5) * 2.5, note: '95%+ — singles' },
    28: { sets: 1, reps: '1RM TEST', wt: 0, note: '1RM TEST — goal: 140+' },
  }
  const dlConfig: Record<number, { sets: number; reps: string; wt: number; note: string }> = {
    25: { sets: 2, reps: '2', wt: Math.round(dl1rm * 0.90 / 2.5) * 2.5, note: '90%' },
    26: { sets: 2, reps: '2', wt: Math.round(dl1rm * 0.92 / 2.5) * 2.5, note: '92%' },
    27: { sets: 2, reps: '1', wt: Math.round(dl1rm * 0.95 / 2.5) * 2.5, note: '95%+ — singles' },
    28: { sets: 1, reps: '1RM TEST', wt: 0, note: '1RM TEST — goal: 180+' },
  }
  const sq = sqConfig[w]
  const dl = dlConfig[w]

  return [
    // Monday - Lower Heavy (Peak)
    {
      id: `w${w}-1`, program_id: 'p3', week_number: w, day_number: 1,
      name: isTest ? 'Lower — 1RM Test (Squat)' : 'Lower Heavy — Peak',
      focus: isTest ? '1RM Squat Test — GOAL: 140+' : 'Heavy Peak Build',
      notes: isTest ? 'THE BIG TEST. Warm up perfectly. Eat and sleep well. You\'ve earned this.' : sq.note,
      workout_exercises: isTest ? [
        we(`w${w}-1`, exercises.back_squat, 1, { sets: 1, reps: '1RM TEST', notes: 'Warm up: bar → 60 → 80 → 100 → 115 → 125 → 135 → 140+ attempt. GOAL: 140kg!' }),
      ] : [
        we(`w${w}-1`, exercises.back_squat, 1, { sets: sq.sets, reps: sq.reps, target_weight_kg: sq.wt, notes: sq.note }),
        we(`w${w}-1`, exercises.rdl, 2, { sets: 3, reps: '5', notes: 'Moderate — save for test' }),
      ],
    },
    // Tuesday - Hybrid (Full Sim or Intervals)
    {
      id: `w${w}-2`, program_id: 'p3', week_number: w, day_number: 2,
      name: isFullSim ? 'FULL HYROX SIMULATION' : isTest ? 'Easy Recovery Run' : 'Interval Run + Stations',
      focus: isFullSim ? 'Full 8-Station Sim — Goal: Sub 1:25' : isTest ? 'Recovery' : 'Speed + Station Work',
      notes: isFullSim ? 'FULL SIMULATION: 8× 1km + all 8 stations at full distances and weights. Record ALL splits!' : isTest ? 'Light recovery after test week.' : 'Intervals + station work.',
      workout_exercises: isFullSim ? [
        we(`w${w}-2`, exercises.running, 1, { sets: 8, distance_meters: 1000, notes: '8× 1km between all stations' }),
        we(`w${w}-2`, exercises.skierg, 2, { sets: 1, distance_meters: 1000, notes: 'Station 1' }),
        we(`w${w}-2`, exercises.sled_push, 3, { sets: 1, distance_meters: 50, notes: 'Station 2 — race weight' }),
        we(`w${w}-2`, exercises.sled_pull, 4, { sets: 1, distance_meters: 50, notes: 'Station 3 — race weight' }),
        we(`w${w}-2`, exercises.burpee_broad, 5, { sets: 1, distance_meters: 80, notes: 'Station 4' }),
        we(`w${w}-2`, exercises.rowerg, 6, { sets: 1, distance_meters: 1000, notes: 'Station 5' }),
        we(`w${w}-2`, exercises.farmers_carry, 7, { sets: 1, distance_meters: 200, notes: 'Station 6 — 2×24kg' }),
        we(`w${w}-2`, exercises.sandbag_lunges, 8, { sets: 1, distance_meters: 100, notes: 'Station 7 — 20kg' }),
        we(`w${w}-2`, exercises.wall_balls, 9, { sets: 1, reps: '100', notes: 'Station 8 — 6kg' }),
      ] : isTest ? [
        we(`w${w}-2`, exercises.running, 1, { sets: 1, duration_seconds: 1800, notes: '30 min easy — recovery' }),
      ] : [
        we(`w${w}-2`, exercises.running, 1, { sets: 6, distance_meters: 1000, rest_seconds: 60, notes: '6× 1km @ 4:05/km' }),
        we(`w${w}-2`, exercises.sled_push, 2, { sets: 2, notes: 'Race pace' }),
        we(`w${w}-2`, exercises.wall_balls, 3, { sets: 1, reps: '75' }),
      ],
    },
    // Wednesday - Upper Heavy
    {
      id: `w${w}-3`, program_id: 'p3', week_number: w, day_number: 3,
      name: isTest ? 'Upper — 1RM Test (Bench)' : 'Upper Heavy — Peak',
      focus: isTest ? '1RM Bench Test' : 'Heavy Pressing',
      notes: isTest ? 'Test 1RM bench. Minimal other work — focus on the big 3 PRs.' : 'Minimal volume — focus on big PRs.',
      workout_exercises: isTest ? [
        we(`w${w}-3`, exercises.bench_press, 1, { sets: 1, reps: '1RM TEST', notes: 'Warm up → work to 1RM' }),
        we(`w${w}-3`, exercises.pullups, 2, { sets: 3, reps: 'Max', notes: 'Light' }),
      ] : [
        we(`w${w}-3`, exercises.bench_press, 1, { sets: sq.sets, reps: sq.reps, notes: `Peak — ${sq.note}` }),
        we(`w${w}-3`, exercises.ohp, 2, { sets: 3, reps: '2', notes: 'Heavy' }),
        we(`w${w}-3`, exercises.weighted_pullups, 3, { sets: 3, reps: 'Max' }),
        we(`w${w}-3`, exercises.barbell_row, 4, { sets: 3, reps: '5', notes: 'Heavy' }),
      ],
    },
    // Friday - Lower (Peak DL or Test)
    {
      id: `w${w}-5`, program_id: 'p3', week_number: w, day_number: 5,
      name: isTest ? 'Lower — 1RM Test (Deadlift)' : 'Lower — Peak Deadlift + Stations',
      focus: isTest ? '1RM Deadlift Test — GOAL: 180+' : 'Heavy Deadlift',
      notes: isTest ? 'THE BIG ONE. 1RM deadlift test. Goal: 180+. This is your strength peak!' : dl.note,
      workout_exercises: isTest ? [
        we(`w${w}-5`, exercises.deadlift, 1, { sets: 1, reps: '1RM TEST', notes: 'Warm up: bar → 60 → 100 → 130 → 150 → 165 → 175 → 180+ attempt. GOAL: 180kg!' }),
      ] : [
        we(`w${w}-5`, exercises.deadlift, 1, { sets: dl.sets, reps: dl.reps, target_weight_kg: dl.wt, notes: dl.note }),
        we(`w${w}-5`, exercises.skierg, 2, { sets: 1, distance_meters: 1000, notes: 'Station time trials' }),
        we(`w${w}-5`, exercises.rowerg, 3, { sets: 1, distance_meters: 1000 }),
        we(`w${w}-5`, exercises.burpee_broad, 4, { sets: 1, distance_meters: 80 }),
        we(`w${w}-5`, exercises.wall_balls, 5, { sets: 1, reps: '100' }),
      ],
    },
    // Saturday - Hyrox / Recovery
    {
      id: `w${w}-6`, program_id: 'p3', week_number: w, day_number: 6,
      name: isTest ? 'Recovery + Mobility' : w % 2 === 1 ? 'Long Run' : 'Half Sim',
      focus: isTest ? 'Active Recovery' : w % 2 === 1 ? 'Aerobic Base' : 'Race Practice',
      notes: isTest ? 'Light run + mobility only after test week. Rest up — strength is peaked!' : null,
      workout_exercises: isTest ? [
        we(`w${w}-6`, exercises.running, 1, { sets: 1, duration_seconds: 1200, notes: '20 min very easy + mobility' }),
      ] : w % 2 === 1 ? [
        we(`w${w}-6`, exercises.running, 1, { sets: 1, duration_seconds: 3600, notes: '55-60 min easy @ 5:00/km' }),
      ] : [
        we(`w${w}-6`, exercises.running, 1, { sets: 4, distance_meters: 1000, notes: 'Half sim: 4× 1km + 4 stations' }),
        we(`w${w}-6`, exercises.skierg, 2, { sets: 1, distance_meters: 1000 }),
        we(`w${w}-6`, exercises.sled_push, 3, { sets: 1, distance_meters: 50 }),
        we(`w${w}-6`, exercises.rowerg, 4, { sets: 1, distance_meters: 1000 }),
        we(`w${w}-6`, exercises.wall_balls, 5, { sets: 1, reps: '50' }),
      ],
    },
  ]
}

export const phase3Workouts: Workout[] = [
  ...weeks21to24(21),
  ...weeks21to24(22),
  ...weeks21to24(23),
  ...weeks21to24(24), // deload
  ...weeks25to28(25),
  ...weeks25to28(26),
  ...weeks25to28(27),
  ...weeks25to28(28), // test (1RM peak)
]
