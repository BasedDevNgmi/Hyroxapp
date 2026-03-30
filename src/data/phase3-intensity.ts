import { exercises } from './exercises'
import { we } from './helpers'
import type { Workout } from '@/hooks/useProgram'

// ═══════════════════════════════════════════════════════════
// PHASE 3: INTENSITEIT (Weeks 21-28)
// Tweede cyclus naar absolute peak. DIT is waar we 140/180 raken.
// Estimated 1RM start: Squat ~130kg, Deadlift ~170kg
// Goal: Squat 140+ / DL 180+ / Eerste volledige sim sub 1:25
// ═══════════════════════════════════════════════════════════

// Weeks 21-24: Kracht + Threshold
function weeks21to24(w: number): Workout[] {
  const sq1rm = 130
  const dl1rm = 170
  const isDeload = w === 24

  const sqConfig: Record<number, { sets: number; reps: string; wt: number; note: string }> = {
    21: { sets: 5, reps: '5', wt: Math.round(sq1rm * 0.78 / 2.5) * 2.5, note: '5s week — 78% nieuwe 1RM' },
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

  return [
    // ── MA: Lower Kracht — 5/3/1 Squat ──
    {
      id: `w${w}-1`, program_id: 'p3', week_number: w, day_number: 1,
      name: 'Lower Kracht — 5/3/1', focus: 'Squat op nieuwe maxes + Burpees + Lunges',
      notes: isDeload ? 'DELOAD WEEK: verminderd volume.' : `5/3/1 op NIEUWE MAXES — ${sq.note}`,
      workout_exercises: [
        we(`w${w}-1`, exercises.back_squat, 1, { sets: sq.sets, reps: sq.reps, target_weight_kg: sq.wt, notes: sq.note }),
        we(`w${w}-1`, exercises.pause_squat, 2, { sets: 3, reps: '3', target_weight_kg: Math.round(sq1rm * 0.72 / 2.5) * 2.5, notes: '72% — kracht uit het gat' }),
        we(`w${w}-1`, exercises.rdl, 3, { sets: 4, reps: '5', notes: 'Zwaar' }),
        we(`w${w}-1`, exercises.ghr, 4, { sets: 3, reps: '6' }),
        we(`w${w}-1`, exercises.farmers_carry, 5, { sets: 4, distance_meters: 50, notes: 'MAX SPEED race weight' }),
        we(`w${w}-1`, exercises.burpee_broad, 6, { sets: 4, reps: '8', notes: '+ 80m time trial 1x (doel: sub 5:15 fris)' }),
        we(`w${w}-1`, exercises.sandbag_lunges, 7, { sets: 4, reps: '25 steps', notes: 'Race weight — SNEL' }),
      ],
    },
    // ── DI: Hybrid — Threshold + Station Circuit ──
    {
      id: `w${w}-2`, program_id: 'p3', week_number: w, day_number: 2,
      name: 'Threshold Run + Race Pace Stations', focus: 'Threshold + Verkorte Station Circuit',
      notes: isDeload ? 'Easy run alleen.' : 'Threshold run + daarna verkorte circuit RACE PACE. Tijd noteren.',
      workout_exercises: isDeload ? [
        we(`w${w}-2`, exercises.running, 1, { sets: 1, duration_seconds: 1800, notes: '30 min easy' }),
      ] : [
        we(`w${w}-2`, exercises.running, 1, { sets: 1, duration_seconds: 2400, notes: '40 min met 25 min @ 4:20-4:30/km' }),
        we(`w${w}-2`, exercises.skierg, 2, { sets: 1, distance_meters: 500, notes: 'Race-pace circuit: alles achter elkaar' }),
        we(`w${w}-2`, exercises.sled_push, 3, { sets: 1, distance_meters: 25, notes: 'Race pace' }),
        we(`w${w}-2`, exercises.sled_pull, 4, { sets: 1, distance_meters: 25, notes: 'Race pace' }),
        we(`w${w}-2`, exercises.burpee_broad, 5, { sets: 1, distance_meters: 40, notes: 'Race pace' }),
        we(`w${w}-2`, exercises.rowerg, 6, { sets: 1, distance_meters: 500, notes: 'Race pace' }),
        we(`w${w}-2`, exercises.farmers_carry, 7, { sets: 1, distance_meters: 100, notes: 'Race pace' }),
        we(`w${w}-2`, exercises.walking_lunges, 8, { sets: 1, distance_meters: 50, notes: 'Race pace' }),
        we(`w${w}-2`, exercises.wall_balls, 9, { sets: 1, reps: '50', notes: 'Race pace — ALLES op race-pace, tijd noteren' }),
      ],
    },
    // ── WO: Upper Kracht — 5/3/1 Bench ──
    {
      id: `w${w}-3`, program_id: 'p3', week_number: w, day_number: 3,
      name: 'Upper Kracht — 5/3/1', focus: 'Bench op nieuwe max + Pull',
      notes: isDeload ? 'DELOAD: licht upper work.' : `5/3/1 bench op nieuwe max — ${sq.note}`,
      workout_exercises: [
        we(`w${w}-3`, exercises.bench_press, 1, { sets: sq.sets, reps: sq.reps, notes: `5/3/1 op nieuwe max` }),
        we(`w${w}-3`, exercises.ohp, 2, { sets: 4, reps: '4', notes: 'Zwaar' }),
        we(`w${w}-3`, exercises.weighted_pullups, 3, { sets: 5, reps: '4', notes: 'ZWAAR' }),
        we(`w${w}-3`, exercises.pendlay_row, 4, { sets: 4, reps: '5' }),
        we(`w${w}-3`, exercises.db_incline_press, 5, { sets: 3, reps: '8' }),
        we(`w${w}-3`, exercises.cable_row, 6, { sets: 3, reps: '10' }),
        we(`w${w}-3`, exercises.face_pulls, 7, { sets: 3, reps: '15', notes: 'Schoudergezondheid' }),
      ],
    },
    // ── VR: Lower — 5/3/1 Deadlift + Stations ──
    {
      id: `w${w}-5`, program_id: 'p3', week_number: w, day_number: 5,
      name: 'Lower — 5/3/1 Deadlift + Stations', focus: 'Deadlift + Sled + Wall Balls + Grip',
      notes: isDeload ? 'DELOAD: verminderd volume.' : dl.note,
      workout_exercises: [
        we(`w${w}-5`, exercises.deadlift, 1, { sets: dl.sets, reps: dl.reps, target_weight_kg: dl.wt, notes: dl.note }),
        we(`w${w}-5`, exercises.front_squat, 2, { sets: 3, reps: '4', target_weight_kg: Math.round(sq1rm * 0.72 / 2.5) * 2.5, notes: '72%' }),
        we(`w${w}-5`, exercises.sled_push, 3, { sets: 6, distance_meters: 50, notes: 'Full distance race pace' }),
        we(`w${w}-5`, exercises.sled_pull, 4, { sets: 6, distance_meters: 50, notes: 'Full distance race pace' }),
        we(`w${w}-5`, exercises.wall_balls, 5, { sets: 1, reps: '75', notes: 'Ononderbroken poging!' }),
        we(`w${w}-5`, exercises.dead_hang, 6, { sets: 1, reps: 'Max hold', notes: 'Grip finisher' }),
        we(`w${w}-5`, exercises.towel_pullups, 7, { sets: 3, reps: 'Max' }),
        we(`w${w}-5`, exercises.plate_pinch, 8, { sets: 3, duration_seconds: 25 }),
      ],
    },
    // ── ZA: Race-Pace + Long Run ──
    {
      id: `w${w}-6`, program_id: 'p3', week_number: w, day_number: 6,
      name: 'Race-Pace Intervals + Stations', focus: 'Race Simulatie',
      notes: isDeload ? 'Lichte run + mobiliteit.' : 'Race-pace intervals + 2-3 stations. Elke 2e week: lange run 50-55 min.',
      workout_exercises: isDeload ? [
        we(`w${w}-6`, exercises.running, 1, { sets: 1, duration_seconds: 1800, notes: 'Lichte run + mobiliteit' }),
      ] : [
        we(`w${w}-6`, exercises.running, 1, { sets: 8, distance_meters: 1000, rest_seconds: 60, notes: '8× 1km @ 4:10-4:20, 60s rust' }),
        we(`w${w}-6`, exercises.wall_balls, 2, { sets: 1, reps: '50', notes: 'Na runs — race pace' }),
        we(`w${w}-6`, exercises.sled_push, 3, { sets: 2, distance_meters: 50, notes: 'Race pace' }),
        we(`w${w}-6`, exercises.sled_pull, 4, { sets: 2, distance_meters: 50, notes: 'Race pace' }),
      ],
    },
  ]
}

// Weeks 25-28: PEAK + Simulaties
function weeks25to28(w: number): Workout[] {
  const sq1rm = 130
  const dl1rm = 170
  const isTest = w === 28

  const sqConfig: Record<number, { sets: number; reps: string; wt: number; note: string }> = {
    25: { sets: 3, reps: '2', wt: Math.round(sq1rm * 0.90 / 2.5) * 2.5, note: '90% — zware doubles' },
    26: { sets: 3, reps: '2', wt: Math.round(sq1rm * 0.92 / 2.5) * 2.5, note: '92% — peak doubles' },
    27: { sets: 3, reps: '1', wt: Math.round(sq1rm * 0.95 / 2.5) * 2.5, note: '95%+ — singles' },
    28: { sets: 1, reps: '1RM TEST', wt: 0, note: 'TEST DAG — DOEL: 140+' },
  }
  const dlConfig: Record<number, { sets: number; reps: string; wt: number; note: string }> = {
    25: { sets: 2, reps: '2', wt: Math.round(dl1rm * 0.92 / 2.5) * 2.5, note: '92%' },
    26: { sets: 2, reps: '2', wt: Math.round(dl1rm * 0.92 / 2.5) * 2.5, note: '92%' },
    27: { sets: 2, reps: '1', wt: Math.round(dl1rm * 0.95 / 2.5) * 2.5, note: '95%+ — singles' },
    28: { sets: 1, reps: '1RM TEST', wt: 0, note: 'TEST DAG — DOEL: 180+' },
  }
  const sq = sqConfig[w]
  const dl = dlConfig[w]
  const isFullSim = w === 25 || w === 27

  return [
    // ── MA: Lower — Peak Squat ──
    {
      id: `w${w}-1`, program_id: 'p3', week_number: w, day_number: 1,
      name: isTest ? 'Lower — 1RM Test (Squat)' : 'Lower — Peak Squat',
      focus: isTest ? '1RM Squat Test — DOEL: 140+' : 'Opbouw naar 1RM',
      notes: isTest ? 'DE GROTE TEST: Werk naar 1RM squat. DOEL: 140+! Eet en slaap goed.' : sq.note + ' — accessories minimaal, alles voor de test.',
      workout_exercises: isTest ? [
        we(`w${w}-1`, exercises.back_squat, 1, { sets: 1, reps: '1RM TEST', notes: 'DOEL: 140+ kg! Warm up grondig.' }),
      ] : [
        we(`w${w}-1`, exercises.back_squat, 1, { sets: sq.sets, reps: sq.reps, target_weight_kg: sq.wt, notes: sq.note }),
      ],
    },
    // ── DI: Hybrid — Sim of Intervals ──
    {
      id: `w${w}-2`, program_id: 'p3', week_number: w, day_number: 2,
      name: isFullSim ? 'VOLLEDIGE HYROX SIMULATIE' : isTest ? 'Station Time Trials' : 'Race-Pace Intervals',
      focus: isFullSim ? '8× 1km + alle 8 stations' : isTest ? 'Benchmark alle stations' : 'Race-pace runs + stations',
      notes: isFullSim ? 'VOLLEDIGE SIM: 8× 1km + alle 8 stations, volledige afstanden + gewichten. Doel: sub 1:25. NOTEER ALLE SPLITS!' :
        isTest ? 'RE-TEST alle station benchmarks — vergelijk met wk 1, 12, 20!' : '6× 1km @ 4:05/km + station work.',
      workout_exercises: isFullSim ? [
        we(`w${w}-2`, exercises.running, 1, { sets: 8, distance_meters: 1000, notes: '8× 1km @ race pace' }),
        we(`w${w}-2`, exercises.skierg, 2, { sets: 1, distance_meters: 1000, notes: 'Volledige afstand' }),
        we(`w${w}-2`, exercises.sled_push, 3, { sets: 1, distance_meters: 50, notes: 'Race weight' }),
        we(`w${w}-2`, exercises.sled_pull, 4, { sets: 1, distance_meters: 50, notes: 'Race weight' }),
        we(`w${w}-2`, exercises.burpee_broad, 5, { sets: 1, distance_meters: 80 }),
        we(`w${w}-2`, exercises.rowerg, 6, { sets: 1, distance_meters: 1000 }),
        we(`w${w}-2`, exercises.farmers_carry, 7, { sets: 1, distance_meters: 200 }),
        we(`w${w}-2`, exercises.walking_lunges, 8, { sets: 1, distance_meters: 100 }),
        we(`w${w}-2`, exercises.wall_balls, 9, { sets: 1, reps: '100' }),
      ] : isTest ? [
        we(`w${w}-2`, exercises.skierg, 1, { sets: 1, distance_meters: 1000, notes: 'Time trial — noteer' }),
        we(`w${w}-2`, exercises.rowerg, 2, { sets: 1, distance_meters: 1000, notes: 'Time trial — noteer' }),
        we(`w${w}-2`, exercises.burpee_broad, 3, { sets: 1, distance_meters: 80, notes: 'Time trial — noteer' }),
        we(`w${w}-2`, exercises.wall_balls, 4, { sets: 1, reps: '100', notes: 'For time — noteer' }),
      ] : [
        we(`w${w}-2`, exercises.running, 1, { sets: 6, distance_meters: 1000, notes: '6× 1km @ 4:05/km' }),
        we(`w${w}-2`, exercises.wall_balls, 2, { sets: 1, reps: '75', notes: 'Na runs — race pace' }),
        we(`w${w}-2`, exercises.sled_push, 3, { sets: 2, distance_meters: 50, notes: 'Race pace' }),
      ],
    },
    // ── WO: Upper — Peak Bench ──
    {
      id: `w${w}-3`, program_id: 'p3', week_number: w, day_number: 3,
      name: isTest ? 'Upper — 1RM Test (Bench)' : 'Upper — Peak Build',
      focus: isTest ? '1RM Bench Test' : 'Opbouw naar bench 1RM',
      notes: isTest ? 'Bench 1RM test. Minimaal volume.' : 'Minimaal volume.',
      workout_exercises: isTest ? [
        we(`w${w}-3`, exercises.bench_press, 1, { sets: 1, reps: '1RM TEST', notes: 'Warm up grondig → poging' }),
        we(`w${w}-3`, exercises.pullups, 2, { sets: 3, reps: 'Max', notes: 'Licht — dat is alles' }),
      ] : [
        we(`w${w}-3`, exercises.bench_press, 1, { sets: sq.sets, reps: sq.reps, notes: `Opbouw — ${sq.note}` }),
        we(`w${w}-3`, exercises.ohp, 2, { sets: 3, reps: '2', notes: 'Zwaar' }),
        we(`w${w}-3`, exercises.weighted_pullups, 3, { sets: 3, reps: 'Max', notes: 'Gewogen' }),
        we(`w${w}-3`, exercises.barbell_row, 4, { sets: 3, reps: '5', notes: 'Zwaar' }),
      ],
    },
    // ── VR: Lower — Peak Deadlift ──
    {
      id: `w${w}-5`, program_id: 'p3', week_number: w, day_number: 5,
      name: isTest ? 'Lower — 1RM Test (Deadlift)' : 'Lower — Peak Deadlift',
      focus: isTest ? '1RM Deadlift Test — DOEL: 180+' : 'Opbouw naar DL 1RM',
      notes: isTest ? 'DE GROTE TEST: Werk naar 1RM deadlift. DOEL: 180+!' : dl.note,
      workout_exercises: isTest ? [
        we(`w${w}-5`, exercises.deadlift, 1, { sets: 1, reps: '1RM TEST', notes: 'DOEL: 180+ kg! Warm up grondig.' }),
        we(`w${w}-5`, exercises.skierg, 2, { sets: 1, distance_meters: 1000, notes: 'Time trial — noteer' }),
        we(`w${w}-5`, exercises.rowerg, 3, { sets: 1, distance_meters: 1000, notes: 'Time trial — noteer' }),
        we(`w${w}-5`, exercises.burpee_broad, 4, { sets: 1, distance_meters: 80, notes: 'For time — noteer' }),
        we(`w${w}-5`, exercises.wall_balls, 5, { sets: 1, reps: '100', notes: 'For time — noteer' }),
      ] : [
        we(`w${w}-5`, exercises.deadlift, 1, { sets: dl.sets, reps: dl.reps, target_weight_kg: dl.wt, notes: dl.note }),
        we(`w${w}-5`, exercises.sled_push, 2, { sets: 3, distance_meters: 50, notes: 'Race weight, race pace' }),
        we(`w${w}-5`, exercises.sled_pull, 3, { sets: 3, distance_meters: 50 }),
        we(`w${w}-5`, exercises.wall_balls, 4, { sets: 1, reps: '75', notes: 'Ononderbroken poging' }),
      ],
    },
    // ── ZA: Long Run / Recovery ──
    {
      id: `w${w}-6`, program_id: 'p3', week_number: w, day_number: 6,
      name: isTest ? 'Herstel na Tests' : 'Lange Run + Stations',
      focus: isTest ? 'Herstel' : 'Endurance + Race Prep',
      notes: isTest ? 'Alleen lichte run + mobiliteit na test. RE-TEST alle benchmarks — vergelijk met wk 1, 12, 20!' : 'Lange run 55-60 min easy elke 2e week.',
      workout_exercises: isTest ? [
        we(`w${w}-6`, exercises.running, 1, { sets: 1, duration_seconds: 1800, notes: 'Lichte run + mobiliteit' }),
      ] : [
        we(`w${w}-6`, exercises.running, 1, { sets: 1, duration_seconds: 3300, notes: '55 min easy, negatief split laatste 10 min' }),
        we(`w${w}-6`, exercises.wall_balls, 2, { sets: 1, reps: '50', notes: 'Na run — vermoeidheid' }),
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
  ...weeks25to28(28), // test
]
