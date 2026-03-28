import { exercises } from './exercises'
import { we } from './helpers'
import type { Workout } from '@/hooks/useProgram'

// ═══════════════════════════════════════════════════════════
// PHASE 4: RACE PREP (Weeks 29-38)
// Strength: MAINTENANCE — peak achieved (140 squat / 180 DL)
// Hyrox: Full simulations at sub-1:20 pace, race strategy
// Goal: Maintain 140/180, sim sub 1:22, everything race-ready
// ═══════════════════════════════════════════════════════════

// Weeks 29-34: Race Sharpness
function weeks29to34(w: number): Workout[] {
  const sqMaint = [115, 117, 119, 115, 117, 119][w - 29]  // 82-85% of 140
  const dlMaint = [148, 150, 153, 148, 150, 153][w - 29]  // 82-85% of 180
  const isFullSim = w === 31 || w === 34

  return [
    // Monday - Lower Maintenance
    {
      id: `w${w}-1`, program_id: 'p4', week_number: w, day_number: 1,
      name: 'Lower — Maintenance', focus: 'Maintain Peak Strength',
      notes: 'Maintenance only — peak is in the bank. Keep the signal, reduce the noise.',
      workout_exercises: [
        we(`w${w}-1`, exercises.back_squat, 1, { sets: 3, reps: '3', target_weight_kg: sqMaint, notes: `~${Math.round(sqMaint/140*100)}% 1RM — maintenance` }),
        we(`w${w}-1`, exercises.deadlift, 2, { sets: 3, reps: '2', target_weight_kg: dlMaint, notes: `~${Math.round(dlMaint/180*100)}% 1RM — maintenance` }),
        we(`w${w}-1`, exercises.farmers_carry, 3, { sets: 1, distance_meters: 200, notes: 'Race-pace reps' }),
        we(`w${w}-1`, exercises.sled_push, 4, { sets: 3, notes: 'Race distance, race pace' }),
        we(`w${w}-1`, exercises.sled_pull, 5, { sets: 3 }),
      ],
    },
    // Tuesday - Race-Pace Run
    {
      id: `w${w}-2`, program_id: 'p4', week_number: w, day_number: 2,
      name: 'Race-Pace Run', focus: '4:10/km Goal Tempo',
      notes: 'This is your race pace. It should start feeling normal.',
      workout_exercises: [
        we(`w${w}-2`, exercises.running, 1, { sets: 1, distance_meters: 10000, notes: '8-10 km — 6 km @ 4:10/km race pace' }),
        we(`w${w}-2`, exercises.sled_push, 2, { sets: 1, notes: '1-2 stations at race-pace after run' }),
        we(`w${w}-2`, exercises.wall_balls, 3, { sets: 1, reps: '50', notes: 'Race pace' }),
      ],
    },
    // Wednesday - Upper Maintenance
    {
      id: `w${w}-3`, program_id: 'p4', week_number: w, day_number: 3,
      name: 'Upper — Maintenance', focus: 'Maintain Upper Strength',
      notes: 'Minimal volume — maintain strength, don\'t fatigue.',
      workout_exercises: [
        we(`w${w}-3`, exercises.bench_press, 1, { sets: 3, reps: '3', notes: '82-85% — maintenance' }),
        we(`w${w}-3`, exercises.ohp, 2, { sets: 3, reps: '3', notes: '80%' }),
        we(`w${w}-3`, exercises.weighted_pullups, 3, { sets: 3, reps: '5' }),
        we(`w${w}-3`, exercises.barbell_row, 4, { sets: 3, reps: '5' }),
      ],
    },
    // Friday - Hyrox Pairs
    {
      id: `w${w}-5`, program_id: 'p4', week_number: w, day_number: 5,
      name: 'Hyrox Pairs — Race Pace', focus: 'Run + Station Transitions',
      notes: 'Minimize transition time. Race pace on everything.',
      workout_exercises: [
        we(`w${w}-5`, exercises.running, 1, { sets: 5, distance_meters: 1000, notes: 'Hyrox-pairs: 1km + station, ×4-6' }),
        we(`w${w}-5`, exercises.sled_push, 2, { sets: 1, distance_meters: 50, notes: 'Rotate stations each week' }),
        we(`w${w}-5`, exercises.farmers_carry, 3, { sets: 1, distance_meters: 200 }),
        we(`w${w}-5`, exercises.sandbag_lunges, 4, { sets: 1, distance_meters: 100 }),
        we(`w${w}-5`, exercises.burpee_broad, 5, { sets: 1, distance_meters: 80 }),
        we(`w${w}-5`, exercises.wall_balls, 6, { sets: 1, reps: '100', notes: 'Goal: sub 4:00' }),
      ],
    },
    // Saturday - Full Sim or Half Sim
    {
      id: `w${w}-6`, program_id: 'p4', week_number: w, day_number: 6,
      name: isFullSim ? 'FULL HYROX SIMULATION' : 'Half Sim / Station Focus',
      focus: isFullSim ? `Full Sim — Goal: sub ${w === 34 ? '1:22' : '1:25'}` : 'Race Practice',
      notes: isFullSim
        ? `FULL SIMULATION: 8× 1km + all 8 stations. Goal: sub ${w === 34 ? '1:22' : '1:25'}. Record all splits!`
        : 'Half sim or focused station work.',
      workout_exercises: isFullSim ? [
        we(`w${w}-6`, exercises.running, 1, { sets: 8, distance_meters: 1000, notes: '8× 1km between all stations' }),
        we(`w${w}-6`, exercises.skierg, 2, { sets: 1, distance_meters: 1000 }),
        we(`w${w}-6`, exercises.sled_push, 3, { sets: 1, distance_meters: 50 }),
        we(`w${w}-6`, exercises.sled_pull, 4, { sets: 1, distance_meters: 50 }),
        we(`w${w}-6`, exercises.burpee_broad, 5, { sets: 1, distance_meters: 80 }),
        we(`w${w}-6`, exercises.rowerg, 6, { sets: 1, distance_meters: 1000 }),
        we(`w${w}-6`, exercises.farmers_carry, 7, { sets: 1, distance_meters: 200 }),
        we(`w${w}-6`, exercises.sandbag_lunges, 8, { sets: 1, distance_meters: 100 }),
        we(`w${w}-6`, exercises.wall_balls, 9, { sets: 1, reps: '100' }),
      ] : [
        we(`w${w}-6`, exercises.running, 1, { sets: 4, distance_meters: 1000, notes: 'Half sim: 4× 1km + stations' }),
        we(`w${w}-6`, exercises.skierg, 2, { sets: 1, distance_meters: 1000 }),
        we(`w${w}-6`, exercises.sled_push, 3, { sets: 1, distance_meters: 50 }),
        we(`w${w}-6`, exercises.rowerg, 4, { sets: 1, distance_meters: 1000 }),
        we(`w${w}-6`, exercises.wall_balls, 5, { sets: 1, reps: '50' }),
      ],
    },
  ]
}

// Weeks 35-38: Final Block
function weeks35to38(w: number): Workout[] {
  const isDeload = w === 36
  const isLastSim = w === 37

  return [
    // Monday - Lower Maintenance (Minimal)
    {
      id: `w${w}-1`, program_id: 'p4', week_number: w, day_number: 1,
      name: 'Lower — Maintenance', focus: 'Signal to Stay Strong',
      notes: isDeload ? 'DELOAD: lighter, reduced.' : 'Heavy but minimal volume. In and out.',
      workout_exercises: [
        we(`w${w}-1`, exercises.back_squat, 1, { sets: isDeload ? 2 : 3, reps: '2', target_weight_kg: isDeload ? 112 : 119, notes: isDeload ? 'Deload — 80%' : '85% — maintenance' }),
        we(`w${w}-1`, exercises.deadlift, 2, { sets: isDeload ? 2 : 2, reps: '2', target_weight_kg: isDeload ? 144 : 153, notes: isDeload ? 'Deload — 80%' : '85% — maintenance' }),
        we(`w${w}-1`, exercises.farmers_carry, 3, { sets: 1, distance_meters: 200, notes: 'Unbroken' }),
      ],
    },
    // Tuesday - Tempo Run
    {
      id: `w${w}-2`, program_id: 'p4', week_number: w, day_number: 2,
      name: 'Tempo Run', focus: 'Faster Than Race Pace',
      notes: isDeload ? 'Easy run — deload.' : 'Faster than race pace — race should feel easy.',
      workout_exercises: [
        we(`w${w}-2`, exercises.running, 1, { sets: 1, distance_meters: isDeload ? 5000 : 8000, notes: isDeload ? '5 km easy' : '8 km — 5 km @ 4:05-4:10/km (faster than race pace)' }),
      ],
    },
    // Wednesday - Upper Maintenance (Minimal)
    {
      id: `w${w}-3`, program_id: 'p4', week_number: w, day_number: 3,
      name: 'Upper — Maintenance', focus: 'Quick Session',
      notes: isDeload ? 'DELOAD: light.' : 'In and out. 35-40 min max.',
      workout_exercises: [
        we(`w${w}-3`, exercises.bench_press, 1, { sets: isDeload ? 2 : 3, reps: '2', notes: isDeload ? '80%' : '85%' }),
        we(`w${w}-3`, exercises.ohp, 2, { sets: isDeload ? 2 : 2, reps: '3', notes: '80%' }),
        we(`w${w}-3`, exercises.weighted_pullups, 3, { sets: 3, reps: '5' }),
        we(`w${w}-3`, exercises.barbell_row, 4, { sets: 3, reps: '5' }),
      ],
    },
    // Friday - Station Blitz
    {
      id: `w${w}-5`, program_id: 'p4', week_number: w, day_number: 5,
      name: isDeload ? 'Light Station Work' : 'Station Blitz — All 8',
      focus: 'Pure Station Capacity',
      notes: isDeload ? 'Deload — easy stations.' : 'All 8 stations back-to-back, RACE PACE. No runs between — pure station power test.',
      workout_exercises: isDeload ? [
        we(`w${w}-5`, exercises.sled_push, 1, { sets: 2, notes: 'Easy' }),
        we(`w${w}-5`, exercises.wall_balls, 2, { sets: 1, reps: '30' }),
        we(`w${w}-5`, exercises.farmers_carry, 3, { sets: 1, distance_meters: 100 }),
      ] : [
        we(`w${w}-5`, exercises.skierg, 1, { sets: 1, distance_meters: 1000, notes: 'All stations back-to-back — RACE PACE' }),
        we(`w${w}-5`, exercises.sled_push, 2, { sets: 1, distance_meters: 50 }),
        we(`w${w}-5`, exercises.sled_pull, 3, { sets: 1, distance_meters: 50 }),
        we(`w${w}-5`, exercises.burpee_broad, 4, { sets: 1, distance_meters: 80 }),
        we(`w${w}-5`, exercises.rowerg, 5, { sets: 1, distance_meters: 1000 }),
        we(`w${w}-5`, exercises.farmers_carry, 6, { sets: 1, distance_meters: 200 }),
        we(`w${w}-5`, exercises.sandbag_lunges, 7, { sets: 1, distance_meters: 100 }),
        we(`w${w}-5`, exercises.wall_balls, 8, { sets: 1, reps: '100' }),
      ],
    },
    // Saturday - Sim or Recovery
    {
      id: `w${w}-6`, program_id: 'p4', week_number: w, day_number: 6,
      name: isLastSim ? 'FINAL FULL SIMULATION' : isDeload ? 'Easy Run' : 'Half Sim',
      focus: isLastSim ? 'Goal: SUB 1:20 — Full Race Protocol' : 'Race Practice',
      notes: isLastSim
        ? 'LAST FULL SIM. Goal: sub 1:20. Full race-day protocol: nutrition, warm-up, pacing — everything exactly like race day!'
        : isDeload ? 'Easy recovery run.' : 'Half sim or station focus.',
      workout_exercises: isLastSim ? [
        we(`w${w}-6`, exercises.running, 1, { sets: 8, distance_meters: 1000, notes: '8× 1km — RACE PROTOCOL. Record everything!' }),
        we(`w${w}-6`, exercises.skierg, 2, { sets: 1, distance_meters: 1000 }),
        we(`w${w}-6`, exercises.sled_push, 3, { sets: 1, distance_meters: 50 }),
        we(`w${w}-6`, exercises.sled_pull, 4, { sets: 1, distance_meters: 50 }),
        we(`w${w}-6`, exercises.burpee_broad, 5, { sets: 1, distance_meters: 80 }),
        we(`w${w}-6`, exercises.rowerg, 6, { sets: 1, distance_meters: 1000 }),
        we(`w${w}-6`, exercises.farmers_carry, 7, { sets: 1, distance_meters: 200 }),
        we(`w${w}-6`, exercises.sandbag_lunges, 8, { sets: 1, distance_meters: 100 }),
        we(`w${w}-6`, exercises.wall_balls, 9, { sets: 1, reps: '100' }),
      ] : isDeload ? [
        we(`w${w}-6`, exercises.running, 1, { sets: 1, duration_seconds: 1800, notes: '30 min easy' }),
      ] : [
        we(`w${w}-6`, exercises.running, 1, { sets: 4, distance_meters: 1000 }),
        we(`w${w}-6`, exercises.skierg, 2, { sets: 1, distance_meters: 1000 }),
        we(`w${w}-6`, exercises.sled_push, 3, { sets: 1, distance_meters: 50 }),
        we(`w${w}-6`, exercises.rowerg, 4, { sets: 1, distance_meters: 1000 }),
        we(`w${w}-6`, exercises.wall_balls, 5, { sets: 1, reps: '50' }),
      ],
    },
  ]
}

export const phase4Workouts: Workout[] = [
  ...weeks29to34(29),
  ...weeks29to34(30),
  ...weeks29to34(31), // full sim
  ...weeks29to34(32),
  ...weeks29to34(33),
  ...weeks29to34(34), // full sim
  ...weeks35to38(35),
  ...weeks35to38(36), // deload
  ...weeks35to38(37), // FINAL full sim
  ...weeks35to38(38),
]
