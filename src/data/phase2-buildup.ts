import { exercises } from './exercises'
import { we } from './helpers'
import type { Workout } from '@/hooks/useProgram'

// ═══════════════════════════════════════════════════════════
// PHASE 2: OPBOUW (Weeks 13-20)
// 5/3/1 golven. Hypertrofie blijft. Eerste peak test week 20.
// Estimated 1RM start: Squat ~118kg, Deadlift ~152kg
// Goal: Squat ~130kg / Deadlift ~168kg / 8km TT sub 34 min
// ═══════════════════════════════════════════════════════════

// Weeks 13-16: Volume + Kracht (5/3/1 waves)
function weeks13to16(w: number): Workout[] {
  const sq1rm = 118
  const dl1rm = 152
  const isDeload = w === 16

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
    // ── MA: Lower Kracht — 5/3/1 Squat ──
    {
      id: `w${w}-1`, program_id: 'p2', week_number: w, day_number: 1,
      name: 'Lower Kracht — 5/3/1', focus: 'Squat Wave + Lunges + Grip + Burpees',
      notes: isDeload ? 'DELOAD WEEK: verminderd volume.' : `5/3/1 cyclus — ${sq.note}`,
      workout_exercises: [
        we(`w${w}-1`, exercises.back_squat, 1, { sets: sq.sets, reps: sq.reps, target_weight_kg: sq.wt, notes: sq.note }),
        we(`w${w}-1`, exercises.leg_press, 2, { sets: isDeload ? 2 : 4, reps: '10', notes: 'Hypertrofie' }),
        we(`w${w}-1`, exercises.ghr, 3, { sets: 3, reps: '8', notes: 'Of Nordic curl' }),
        we(`w${w}-1`, exercises.sandbag_lunges, 4, { sets: 5, distance_meters: 20, notes: 'Race weight — focus SNELHEID, tel stappen' }),
        we(`w${w}-1`, exercises.farmers_carry, 5, { sets: 5, distance_meters: 50, notes: 'Race weight op snelheid' }),
        we(`w${w}-1`, exercises.fat_grip_hang, 6, { sets: 2, reps: 'Max hold' }),
        we(`w${w}-1`, exercises.deadlift, 7, { sets: 3, reps: '5', notes: 'Fat grip DL — grip specifiek' }),
        we(`w${w}-1`, exercises.burpee_broad, 8, { sets: 5, reps: '5', notes: '+ 40m time trial 1x/week (doel: sub 2:45)' }),
        we(`w${w}-1`, exercises.pallof_press, 9, { sets: 3, reps: '10/side', notes: 'Zwaar' }),
        we(`w${w}-1`, exercises.dead_bug, 10, { sets: 3, reps: '10/side', notes: 'Met gewicht' }),
      ],
    },
    // ── DI: Hybrid Run + Stations ──
    {
      id: `w${w}-2`, program_id: 'p2', week_number: w, day_number: 2,
      name: 'Tempo Run + Stations', focus: 'Threshold + Station Work',
      notes: isDeload ? 'Easy run alleen — recovery week.' : 'Middenblok op threshold pace.',
      workout_exercises: isDeload ? [
        we(`w${w}-2`, exercises.running, 1, { sets: 1, duration_seconds: 1800, notes: '30 min easy' }),
      ] : [
        we(`w${w}-2`, exercises.running, 1, { sets: 1, duration_seconds: 2400, notes: '35-40 min — middenblok 15 min @ 4:40-4:50/km' }),
        we(`w${w}-2`, exercises.skierg, 2, { sets: 5, distance_meters: 1000, rest_seconds: 60, notes: 'Target: sub 3:45 — noteer splits!' }),
        we(`w${w}-2`, exercises.wall_balls, 3, { sets: 1, reps: '100', notes: '100 reps for time — doel: sub 4:30, sets van 20+' }),
        we(`w${w}-2`, exercises.sled_push, 4, { sets: 3, notes: 'Race weight, heen en weer met pull' }),
        we(`w${w}-2`, exercises.sled_pull, 5, { sets: 3, notes: 'Race weight, tempo' }),
        we(`w${w}-2`, exercises.rowerg, 6, { sets: 3, distance_meters: 1000, rest_seconds: 90, notes: 'Target: sub 3:50' }),
      ],
    },
    // ── WO: Upper Kracht — 5/3/1 Bench ──
    {
      id: `w${w}-3`, program_id: 'p2', week_number: w, day_number: 3,
      name: 'Upper Kracht — 5/3/1', focus: 'Bench Wave + Pull',
      notes: isDeload ? 'DELOAD: licht upper work.' : `5/3/1 bench wave — zelfde schema als squat.`,
      workout_exercises: [
        we(`w${w}-3`, exercises.bench_press, 1, { sets: sq.sets, reps: sq.reps, notes: `5/3/1 — ${sq.note}` }),
        we(`w${w}-3`, exercises.ohp, 2, { sets: 4, reps: '5', notes: 'Zwaar, progressief' }),
        we(`w${w}-3`, exercises.weighted_pullups, 3, { sets: 5, reps: '5' }),
        we(`w${w}-3`, exercises.pendlay_row, 4, { sets: 4, reps: '6' }),
        we(`w${w}-3`, exercises.db_incline_press, 5, { sets: 3, reps: '10' }),
        we(`w${w}-3`, exercises.chest_supported, 6, { sets: 3, reps: '12' }),
        we(`w${w}-3`, exercises.ez_curl, 7, { sets: 3, reps: '12', notes: 'Superset' }),
        we(`w${w}-3`, exercises.skull_crusher, 8, { sets: 3, reps: '12' }),
        we(`w${w}-3`, exercises.face_pulls, 9, { sets: 3, reps: '15' }),
      ],
    },
    // ── VR: Lower — 5/3/1 Deadlift + Hyrox ──
    {
      id: `w${w}-5`, program_id: 'p2', week_number: w, day_number: 5,
      name: 'Lower — 5/3/1 Deadlift + Hyrox', focus: 'Deadlift Wave + Stations',
      notes: isDeload ? 'DELOAD: verminderd volume.' : dl.note,
      workout_exercises: [
        we(`w${w}-5`, exercises.deadlift, 1, { sets: dl.sets, reps: dl.reps, target_weight_kg: dl.wt, notes: dl.note }),
        we(`w${w}-5`, exercises.front_squat, 2, { sets: isDeload ? 2 : 4, reps: '5', target_weight_kg: Math.round(sq1rm * 0.70 / 2.5) * 2.5, notes: '70% squat' }),
        we(`w${w}-5`, exercises.hip_thrust, 3, { sets: 4, reps: '8', notes: 'Zwaar' }),
        we(`w${w}-5`, exercises.burpee_broad, 4, { sets: 4, reps: '6', notes: 'Onder lichte vermoeidheid (na sled work)' }),
        we(`w${w}-5`, exercises.towel_pullups, 5, { sets: 3, reps: 'Max' }),
        we(`w${w}-5`, exercises.dead_hang, 6, { sets: 3, reps: 'Max hold' }),
        we(`w${w}-5`, exercises.plate_pinch, 7, { sets: 3, duration_seconds: 25 }),
        we(`w${w}-5`, exercises.wall_balls, 8, { sets: 2, reps: '40', notes: 'Ononderbroken — push de ceiling' }),
      ],
    },
    // ── ZA: Hyrox Pairs ──
    {
      id: `w${w}-6`, program_id: 'p2', week_number: w, day_number: 6,
      name: 'Hyrox Pairs', focus: 'Run + Station Transities',
      notes: isDeload ? 'Easy — halve afstand.' : 'Race tempo — oefen run→station transitie: DIRECT door.',
      workout_exercises: isDeload ? [
        we(`w${w}-6`, exercises.running, 1, { sets: 1, duration_seconds: 1800, notes: '30 min easy run' }),
      ] : [
        we(`w${w}-6`, exercises.running, 1, { sets: 1, duration_seconds: 2700, notes: '40-45 min easy warm-up/cool-down' }),
        we(`w${w}-6`, exercises.running, 2, { sets: 5, distance_meters: 1000, notes: 'Hyrox-pairs: 1km + 1 station, ×5 (roteer stations per week)' }),
        we(`w${w}-6`, exercises.sled_push, 3, { sets: 1, notes: 'Roteer stations per week' }),
        we(`w${w}-6`, exercises.farmers_carry, 4, { sets: 1, distance_meters: 200 }),
        we(`w${w}-6`, exercises.walking_lunges, 5, { sets: 1, distance_meters: 100 }),
        we(`w${w}-6`, exercises.burpee_broad, 6, { sets: 1, distance_meters: 80, notes: w === 14 ? 'BENCHMARK: 80m for time' : null }),
      ],
    },
  ]
}

// Weeks 17-20: Kracht Peak #1
function weeks17to20(w: number): Workout[] {
  const sq1rm = 118
  const dl1rm = 152
  const isTest = w === 20

  const sqConfig: Record<number, { sets: number; reps: string; wt: number; note: string }> = {
    17: { sets: 3, reps: '3', wt: Math.round(sq1rm * 0.87 / 2.5) * 2.5, note: '87% — opbouw naar test' },
    18: { sets: 3, reps: '3', wt: Math.round(sq1rm * 0.90 / 2.5) * 2.5, note: '90% — zware triples' },
    19: { sets: 2, reps: '2', wt: Math.round(sq1rm * 0.92 / 2.5) * 2.5, note: '92% — peak doubles' },
    20: { sets: 1, reps: '1-2RM TEST', wt: 0, note: 'TEST DAG — werk naar 1-2RM' },
  }
  const dlConfig: Record<number, { sets: number; reps: string; wt: number; note: string }> = {
    17: { sets: 3, reps: '3', wt: Math.round(dl1rm * 0.87 / 2.5) * 2.5, note: '87%' },
    18: { sets: 3, reps: '3', wt: Math.round(dl1rm * 0.90 / 2.5) * 2.5, note: '90%' },
    19: { sets: 2, reps: '2', wt: Math.round(dl1rm * 0.92 / 2.5) * 2.5, note: '92%' },
    20: { sets: 1, reps: '1-2RM TEST', wt: 0, note: 'TEST DAG — werk naar 1-2RM' },
  }
  const sq = sqConfig[w]
  const dl = dlConfig[w]

  return [
    // ── MA: Lower — Peak Squat ──
    {
      id: `w${w}-1`, program_id: 'p2', week_number: w, day_number: 1,
      name: isTest ? 'Lower — 2RM Test (Squat)' : 'Lower Kracht — Peak Build',
      focus: isTest ? '1-2RM Squat Test' : 'Zware Squat',
      notes: isTest ? 'TEST WEEK: Warm up grondig → werk naar 1-2RM squat. Verwacht: ~125-130kg.' : sq.note,
      workout_exercises: isTest ? [
        we(`w${w}-1`, exercises.back_squat, 1, { sets: 1, reps: '1-2RM TEST', notes: 'Warm up: bar → 60 → 80 → 100 → 110 → 120 → poging' }),
        we(`w${w}-1`, exercises.farmers_carry, 2, { sets: 5, distance_meters: 50, notes: 'BOVEN race weight' }),
      ] : [
        we(`w${w}-1`, exercises.back_squat, 1, { sets: sq.sets, reps: sq.reps, target_weight_kg: sq.wt, notes: sq.note }),
        we(`w${w}-1`, exercises.leg_press, 2, { sets: 3, reps: '8', notes: 'Lichte accessories — spaar energie' }),
        we(`w${w}-1`, exercises.farmers_carry, 3, { sets: 5, distance_meters: 50, notes: 'BOVEN race weight' }),
      ],
    },
    // ── DI: Intervals + Stations ──
    {
      id: `w${w}-2`, program_id: 'p2', week_number: w, day_number: 2,
      name: isTest ? '8km Time Trial + Station Tests' : 'Interval Run + Stations',
      focus: isTest ? '8km TT — Doel: sub 34 min' : 'Speed Intervals',
      notes: isTest ? 'RE-TEST alle station benchmarks! 8km time trial!' : null,
      workout_exercises: isTest ? [
        we(`w${w}-2`, exercises.running, 1, { sets: 1, distance_meters: 8000, notes: '8km TIME TRIAL — doel: sub 34 min (4:15/km gem)' }),
      ] : [
        we(`w${w}-2`, exercises.running, 1, { sets: 8, distance_meters: 800, rest_seconds: 75, notes: '8× 800m @ 4:00-4:10/km, 75s walk rust' }),
        we(`w${w}-2`, exercises.rowerg, 2, { sets: 4, distance_meters: 1000, rest_seconds: 60, notes: 'Doel: sub 3:50 per 1000m' }),
        we(`w${w}-2`, exercises.skierg, 3, { sets: 4, distance_meters: 1000, rest_seconds: 60, notes: 'Doel: sub 3:40' }),
        we(`w${w}-2`, exercises.wall_balls, 4, { sets: 1, reps: '100', notes: 'Doel: sub 4:15' }),
      ],
    },
    // ── WO: Upper — Peak Bench ──
    {
      id: `w${w}-3`, program_id: 'p2', week_number: w, day_number: 3,
      name: isTest ? 'Upper — 2RM Test (Bench)' : 'Upper Kracht — Peak Build',
      focus: isTest ? '1-2RM Bench Test' : 'Zwaar Persen',
      notes: isTest ? 'TEST: Werk naar 1-2RM bench.' : 'Minimaal accessories — spaar energie.',
      workout_exercises: isTest ? [
        we(`w${w}-3`, exercises.bench_press, 1, { sets: 1, reps: '1-2RM TEST', notes: 'Warm up grondig → poging' }),
        we(`w${w}-3`, exercises.pullups, 2, { sets: 3, reps: 'Max', notes: 'Licht trekken — dat is alles' }),
      ] : [
        we(`w${w}-3`, exercises.bench_press, 1, { sets: sq.sets, reps: sq.reps, notes: `Opbouw naar test — ${sq.note}` }),
        we(`w${w}-3`, exercises.ohp, 2, { sets: 3, reps: '3', notes: 'Zwaar' }),
        we(`w${w}-3`, exercises.weighted_pullups, 3, { sets: 3, reps: 'Max' }),
        we(`w${w}-3`, exercises.barbell_row, 4, { sets: 4, reps: '5', notes: 'Zwaar' }),
      ],
    },
    // ── VR: Lower — Peak Deadlift ──
    {
      id: `w${w}-5`, program_id: 'p2', week_number: w, day_number: 5,
      name: isTest ? 'Lower — 2RM Test (Deadlift)' : 'Lower — Peak Deadlift',
      focus: isTest ? '1-2RM Deadlift Test' : 'Zware Deadlift',
      notes: isTest ? 'TEST WEEK: Werk naar 1-2RM deadlift. Verwacht: ~165-170kg.' : dl.note,
      workout_exercises: isTest ? [
        we(`w${w}-5`, exercises.deadlift, 1, { sets: 1, reps: '1-2RM TEST', notes: 'Warm up: bar → 60 → 100 → 120 → 140 → 150 → poging' }),
        we(`w${w}-5`, exercises.sled_push, 2, { sets: 2, notes: 'Licht — race distance, matige effort' }),
        we(`w${w}-5`, exercises.sled_pull, 3, { sets: 2, notes: 'Race distance' }),
        we(`w${w}-5`, exercises.burpee_broad, 4, { sets: 1, distance_meters: 80, notes: '80m for time — doel: sub 5:30' }),
      ] : [
        we(`w${w}-5`, exercises.deadlift, 1, { sets: dl.sets, reps: dl.reps, target_weight_kg: dl.wt, notes: dl.note }),
        we(`w${w}-5`, exercises.front_squat, 2, { sets: 3, reps: '4', notes: 'Licht — spaar voor test' }),
        we(`w${w}-5`, exercises.sled_push, 3, { sets: 3, notes: 'Race distance, matige effort' }),
        we(`w${w}-5`, exercises.sled_pull, 4, { sets: 3 }),
        we(`w${w}-5`, exercises.burpee_broad, 5, { sets: 1, distance_meters: 80, notes: '80m for time — doel: sub 5:30' }),
      ],
    },
    // ── ZA: Hyrox Sim ──
    {
      id: `w${w}-6`, program_id: 'p2', week_number: w, day_number: 6,
      name: isTest ? 'Easy Recovery' : '6-Station Hyrox Sim',
      focus: isTest ? 'Herstel na test week' : 'Multi-Station Simulatie',
      notes: isTest ? 'Herstel na test week.' : '6-station sim — race tempo. Noteer alle splits.',
      workout_exercises: isTest ? [
        we(`w${w}-6`, exercises.running, 1, { sets: 1, duration_seconds: 1800, notes: 'Easy 30 min — herstel na test week' }),
      ] : [
        we(`w${w}-6`, exercises.running, 1, { sets: 6, distance_meters: 1000, notes: '6× 1km tussen stations' }),
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
