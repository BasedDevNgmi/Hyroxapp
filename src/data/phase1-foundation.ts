import { exercises } from './exercises'
import { we } from './helpers'
import type { Workout } from '@/hooks/useProgram'

// ═══════════════════════════════════════════════════════════
// PHASE 1: FUNDAMENT (Weeks 1-12)
// Lineaire progressie. Hypertrofie. Grip bouwen. Burpee techniek.
// Run/walk → continu lopen. Station-techniek. Baseline tests.
// Starting 1RM: Squat 105kg, Deadlift 135kg
// Goal: Squat ~118kg / Deadlift ~152kg / 30 min continu pijnvrij
// ═══════════════════════════════════════════════════════════

// Weeks 1-4: Gewenning
function weeks1to4(w: number): Workout[] {
  const sqWt = [79, 82, 84, 84][w - 1]     // 75% progressing +2.5/wk
  const dlWt = [101, 104, 108, 108][w - 1]  // 75% progressing
  const rdlWt = [81, 84, 87, 87][w - 1]     // 60% DL
  const fsWt = [63, 65, 67, 67][w - 1]      // 60% squat
  const isDeload = w === 4

  return [
    // ── MA: Lower Kracht ──
    {
      id: `w${w}-1`, program_id: 'p1', week_number: w, day_number: 1,
      name: 'Lower Kracht', focus: 'Squat (zwaar) + DL variatie + lunges + grip + burpees',
      notes: isDeload ? 'DELOAD WEEK: verminderd volume, behoud gewicht.' : w === 1 ? 'WEEK 1: Baseline test week! Noteer alles.' : 'Focus diepte en tempo (3-1-1).',
      workout_exercises: [
        we(`w${w}-1`, exercises.back_squat, 1, { sets: isDeload ? 3 : 4, reps: isDeload ? '3' : '5', target_weight_kg: sqWt, tempo: '3-1-1', notes: `75% 1RM — volle diepte` }),
        we(`w${w}-1`, exercises.rdl, 2, { sets: isDeload ? 2 : 3, reps: '8', target_weight_kg: rdlWt, notes: `60% DL 1RM` }),
        we(`w${w}-1`, exercises.bulgarian, 3, { sets: isDeload ? 2 : 3, reps: '10/side' }),
        we(`w${w}-1`, exercises.leg_curl, 4, { sets: 3, reps: '12' }),
        we(`w${w}-1`, exercises.leg_extension, 5, { sets: 3, reps: '12' }),
        we(`w${w}-1`, exercises.dead_hang, 6, { sets: 3, reps: 'Max hold', notes: 'Grip endurance' }),
        we(`w${w}-1`, exercises.farmers_carry, 7, { sets: 3, duration_seconds: 30, notes: 'Zo zwaar mogelijk — grip builder' }),
        we(`w${w}-1`, exercises.plate_pinch, 8, { sets: 3, duration_seconds: 20 }),
        we(`w${w}-1`, exercises.burpee_broad, 9, { sets: 5, reps: '3', notes: 'FRIS — techniek: hip hinge, explosieve sprong, direct door' }),
      ],
    },
    // ── DI: Run + Stations ──
    {
      id: `w${w}-2`, program_id: 'p1', week_number: w, day_number: 2,
      name: 'Run + Stations', focus: 'Aerobic Base + Station Techniek',
      notes: 'Run/walk intervals — EASY pace. Noteer splits op ski en row!',
      workout_exercises: [
        we(`w${w}-2`, exercises.run_walk, 1, { sets: 1, duration_seconds: 1500, notes: '25 min: 2 min run / 1 min walk @ 5:30-6:00/km' }),
        we(`w${w}-2`, exercises.skierg, 2, { sets: 3, duration_seconds: 180, rest_seconds: 90, notes: 'Focus lange halen, heupscharnier' }),
        we(`w${w}-2`, exercises.rowerg, 3, { sets: 3, duration_seconds: 180, rest_seconds: 90, notes: 'Focus drive met benen, 1:2 ratio' }),
        we(`w${w}-2`, exercises.wall_balls, 4, { sets: 5, reps: '10', rest_seconds: 60, notes: 'Techniek: kwart squat, ritme vinden' }),
      ],
    },
    // ── WO: Upper Kracht ──
    {
      id: `w${w}-3`, program_id: 'p1', week_number: w, day_number: 3,
      name: 'Upper Kracht', focus: 'Bench/OHP + Pull',
      notes: isDeload ? 'DELOAD: verminderde sets.' : 'RPE 7 op hoofdliften. Volume opbouwen.',
      workout_exercises: [
        we(`w${w}-3`, exercises.bench_press, 1, { sets: isDeload ? 3 : 4, reps: '6', input_type: 'weight_reps', notes: 'RPE 7 — bepaal startgewicht week 1' }),
        we(`w${w}-3`, exercises.ohp, 2, { sets: 3, reps: '8', input_type: 'weight_reps', notes: 'RPE 7' }),
        we(`w${w}-3`, exercises.barbell_row, 3, { sets: isDeload ? 3 : 4, reps: '8', input_type: 'weight_reps' }),
        we(`w${w}-3`, exercises.pullups, 4, { sets: 4, reps: 'Max', input_type: 'reps_only', notes: 'Gewogen als je 12+ kan' }),
        we(`w${w}-3`, exercises.db_lateral_raise, 5, { sets: 3, reps: '15', input_type: 'weight_reps' }),
        we(`w${w}-3`, exercises.face_pulls, 6, { sets: 3, reps: '15', input_type: 'weight_reps' }),
        we(`w${w}-3`, exercises.ez_curl, 7, { sets: 3, reps: '10', input_type: 'weight_reps' }),
        we(`w${w}-3`, exercises.tricep_dips, 8, { sets: 3, reps: '10', input_type: 'reps_only' }),
        we(`w${w}-3`, exercises.ab_wheel, 9, { sets: 3, reps: '8', input_type: 'reps_only' }),
        we(`w${w}-3`, exercises.pallof_press, 10, { sets: 3, reps: '10/side', input_type: 'weight_reps' }),
      ],
    },
    // ── VR: Lower Hyper + Hyrox ──
    {
      id: `w${w}-5`, program_id: 'p1', week_number: w, day_number: 5,
      name: 'Lower Hyper + Hyrox', focus: 'Deadlift + Sled + Grip + Burpees',
      notes: isDeload ? 'DELOAD: verminderd volume.' : null,
      workout_exercises: [
        we(`w${w}-5`, exercises.deadlift, 1, { sets: isDeload ? 3 : 4, reps: isDeload ? '3' : '5', target_weight_kg: dlWt, notes: '75% 1RM' }),
        we(`w${w}-5`, exercises.front_squat, 2, { sets: 3, reps: '8', target_weight_kg: fsWt, notes: '60% squat 1RM — hypertrofie + core' }),
        we(`w${w}-5`, exercises.hip_thrust, 3, { sets: 3, reps: '12', notes: 'Zwaar' }),
        we(`w${w}-5`, exercises.walking_lunges, 4, { sets: 3, reps: '12/side', notes: 'Met dumbbells' }),
        we(`w${w}-5`, exercises.sled_push, 5, { sets: 3, distance_meters: 20, notes: 'Licht — techniek leren' }),
        we(`w${w}-5`, exercises.sled_pull, 6, { sets: 3, distance_meters: 20, notes: 'Licht — techniek leren' }),
        we(`w${w}-5`, exercises.towel_hang, 7, { sets: 3, reps: 'Max hold' }),
        we(`w${w}-5`, exercises.barbell_hold, 8, { sets: 3, duration_seconds: 20 }),
        we(`w${w}-5`, exercises.burpee_broad, 9, { sets: 4, reps: '4', notes: 'Ritme: 2+2 met 2 sec pauze' }),
      ],
    },
    // ── ZA: Hyrox Sim ──
    {
      id: `w${w}-6`, program_id: 'p1', week_number: w, day_number: 6,
      name: 'Hyrox Simulatie', focus: 'Flow + Techniek',
      notes: 'Alles licht — doorstroming en techniek, niet hard gaan.',
      workout_exercises: [
        we(`w${w}-6`, exercises.run_walk, 1, { sets: 1, duration_seconds: 1200, notes: '20 min run/walk (2:1 ratio)' }),
        we(`w${w}-6`, exercises.running, 2, { sets: 1, distance_meters: 500, notes: 'Mini-circuit start' }),
        we(`w${w}-6`, exercises.wall_balls, 3, { sets: 1, reps: '15' }),
        we(`w${w}-6`, exercises.rowerg, 4, { sets: 1, distance_meters: 250 }),
        we(`w${w}-6`, exercises.burpee_broad, 5, { sets: 1, reps: '10' }),
        we(`w${w}-6`, exercises.skierg, 6, { sets: 1, distance_meters: 250 }),
        we(`w${w}-6`, exercises.sled_push, 7, { sets: 2, distance_meters: 20, notes: 'Licht' }),
        we(`w${w}-6`, exercises.sled_pull, 8, { sets: 2, distance_meters: 20, notes: 'Licht' }),
        we(`w${w}-6`, exercises.farmers_carry, 9, { sets: 2, distance_meters: 30 }),
      ],
    },
  ]
}

// Weeks 5-8: Opbouwen
function weeks5to8(w: number): Workout[] {
  const sqWt = [84, 87, 89, 89][w - 5]      // ~80% progressing
  const dlWt = [108, 111, 115, 115][w - 5]
  const pauseWt = [68, 70, 72, 72][w - 5]   // 65% squat
  const fsWt = [68, 70, 72, 72][w - 5]      // 65% squat
  const isDeload = w === 8

  return [
    // ── MA: Lower Kracht ──
    {
      id: `w${w}-1`, program_id: 'p1', week_number: w, day_number: 1,
      name: 'Lower Kracht', focus: 'Squat + Pause Work + Grip + Burpees',
      notes: isDeload ? 'DELOAD WEEK: verminderd volume, behoud intensiteit.' : '80% — 4×4 opbouwen.',
      workout_exercises: [
        we(`w${w}-1`, exercises.back_squat, 1, { sets: isDeload ? 3 : 4, reps: isDeload ? '3' : '4', target_weight_kg: sqWt, notes: '~80% 1RM' }),
        we(`w${w}-1`, exercises.pause_squat, 2, { sets: 3, reps: '5', target_weight_kg: pauseWt, notes: '65% — 2 sec pauze onderaan' }),
        we(`w${w}-1`, exercises.rdl, 3, { sets: 3, reps: '8', notes: 'Verhoog gewicht vs wk 1-4' }),
        we(`w${w}-1`, exercises.leg_press, 4, { sets: 3, reps: '10' }),
        we(`w${w}-1`, exercises.farmers_carry, 5, { sets: 4, distance_meters: 40, notes: 'Elke week zwaarder' }),
        we(`w${w}-1`, exercises.fat_grip_hang, 6, { sets: 2, reps: 'Max hold' }),
        we(`w${w}-1`, exercises.burpee_broad, 7, { sets: 5, reps: '4', notes: 'Ritme verhogen: 4 achter elkaar, korte pauze' }),
        we(`w${w}-1`, exercises.sandbag_lunges, 8, { sets: 3, reps: '20 steps', notes: 'Hyrox gewicht, tempo focus' }),
      ],
    },
    // ── DI: Run + Stations ──
    {
      id: `w${w}-2`, program_id: 'p1', week_number: w, day_number: 2,
      name: 'Run + Stations', focus: 'Continue Run + Stations',
      notes: 'Geen walk breaks meer! STOP direct bij knie-/enkelpijn.',
      workout_exercises: [
        we(`w${w}-2`, exercises.running, 1, { sets: 1, duration_seconds: 1500, notes: '20-25 min continu @ 5:15-5:30/km — STOP bij pijn' }),
        we(`w${w}-2`, exercises.skierg, 2, { sets: 4, duration_seconds: 240, rest_seconds: 75, notes: 'Verhoog rate naar 26-28 spm' }),
        we(`w${w}-2`, exercises.rowerg, 3, { sets: 4, duration_seconds: 240, rest_seconds: 75, notes: 'Target: sub 2:05/500m' }),
        we(`w${w}-2`, exercises.wall_balls, 4, { sets: 4, reps: '15', rest_seconds: 45, notes: 'Tempo iets hoger' }),
        we(`w${w}-2`, exercises.sled_push, 5, { sets: 4, distance_meters: 25, notes: 'Middelzwaar' }),
        we(`w${w}-2`, exercises.sled_pull, 6, { sets: 4, distance_meters: 25, notes: 'Middelzwaar' }),
      ],
    },
    // ── WO: Upper Kracht ──
    {
      id: `w${w}-3`, program_id: 'p1', week_number: w, day_number: 3,
      name: 'Upper Kracht', focus: 'Bench/OHP + Weighted Pulls',
      notes: isDeload ? 'DELOAD: verminderde sets.' : '+2.5 kg/week bench, +1-2 kg/week OHP.',
      workout_exercises: [
        we(`w${w}-3`, exercises.bench_press, 1, { sets: isDeload ? 3 : 4, reps: '5', notes: '+2.5 kg/week' }),
        we(`w${w}-3`, exercises.ohp, 2, { sets: 4, reps: '6', notes: '+1-2 kg/week' }),
        we(`w${w}-3`, exercises.weighted_pullups, 3, { sets: 4, reps: '6', notes: 'Of bodyweight 4×max' }),
        we(`w${w}-3`, exercises.pendlay_row, 4, { sets: 4, reps: '6' }),
        we(`w${w}-3`, exercises.db_incline_press, 5, { sets: 3, reps: '10' }),
        we(`w${w}-3`, exercises.cable_row, 6, { sets: 3, reps: '12' }),
        we(`w${w}-3`, exercises.ez_curl, 7, { sets: 3, reps: '10', notes: 'Superset met skull crushers' }),
        we(`w${w}-3`, exercises.skull_crusher, 8, { sets: 3, reps: '10' }),
        we(`w${w}-3`, exercises.hanging_knee, 9, { sets: 3, reps: '10' }),
        we(`w${w}-3`, exercises.side_plank, 10, { sets: 3, duration_seconds: 30, notes: 'Per kant' }),
      ],
    },
    // ── VR: Lower Hyper + Hyrox ──
    {
      id: `w${w}-5`, program_id: 'p1', week_number: w, day_number: 5,
      name: 'Lower Hyper + Hyrox', focus: 'Deadlift + Sled + Grip + Burpees',
      notes: isDeload ? 'DELOAD: verminderd volume.' : null,
      workout_exercises: [
        we(`w${w}-5`, exercises.deadlift, 1, { sets: isDeload ? 3 : 4, reps: isDeload ? '3' : '4', target_weight_kg: dlWt, notes: '~80% 1RM' }),
        we(`w${w}-5`, exercises.front_squat, 2, { sets: 3, reps: '6', target_weight_kg: fsWt, notes: '65% squat' }),
        we(`w${w}-5`, exercises.hip_thrust, 3, { sets: 3, reps: '10', notes: 'Zwaarder dan wk 1-4' }),
        we(`w${w}-5`, exercises.sled_push, 4, { sets: 5, distance_meters: 25, notes: 'Opbouwen gewicht' }),
        we(`w${w}-5`, exercises.sled_pull, 5, { sets: 5, distance_meters: 25, notes: 'Opbouwen gewicht' }),
        we(`w${w}-5`, exercises.dead_hang, 6, { sets: 3, reps: 'Max hold' }),
        we(`w${w}-5`, exercises.towel_hang, 7, { sets: 2, reps: 'Max hold' }),
        we(`w${w}-5`, exercises.barbell_hold, 8, { sets: 3, duration_seconds: 25 }),
        we(`w${w}-5`, exercises.burpee_broad, 9, { sets: 4, reps: '5', notes: 'Begin met timing: 40m for time, noteer' }),
        we(`w${w}-5`, exercises.wall_balls, 10, { sets: 3, reps: '20', notes: 'Ononderbroken als het kan' }),
      ],
    },
    // ── ZA: Hyrox Sim ──
    {
      id: `w${w}-6`, program_id: 'p1', week_number: w, day_number: 6,
      name: 'Hyrox Simulatie', focus: 'Pacing + Endurance',
      notes: 'Matig tempo, focus pacing niet snelheid.',
      workout_exercises: [
        we(`w${w}-6`, exercises.running, 1, { sets: 1, duration_seconds: 1500, notes: '25 min continu @ easy pace' }),
        we(`w${w}-6`, exercises.running, 2, { sets: 1, distance_meters: 1000, notes: 'Circuit: 1km run' }),
        we(`w${w}-6`, exercises.skierg, 3, { sets: 1, distance_meters: 500 }),
        we(`w${w}-6`, exercises.running, 4, { sets: 1, distance_meters: 1000, notes: '1km run' }),
        we(`w${w}-6`, exercises.rowerg, 5, { sets: 1, distance_meters: 500 }),
        we(`w${w}-6`, exercises.strides, 6, { sets: 4, distance_meters: 80, notes: '80m strides na circuit' }),
        we(`w${w}-6`, exercises.farmers_carry, 7, { sets: 2, distance_meters: 50, notes: 'Race weight' }),
      ],
    },
  ]
}

// Weeks 9-12: Consolidatie + Test
function weeks9to12(w: number): Workout[] {
  const sqWt = [90, 94, 97, 0][w - 9]     // 83-85%, week 12 = test
  const dlWt = [118, 121, 125, 0][w - 9]
  const tempoWt = [74, 74, 74, 74][w - 9] // 70% squat
  const isTest = w === 12

  return [
    // ── MA: Lower Kracht ──
    {
      id: `w${w}-1`, program_id: 'p1', week_number: w, day_number: 1,
      name: isTest ? 'Lower — 3RM Test' : 'Lower Kracht',
      focus: isTest ? '3RM Squat Test' : 'Zware Triples + Grip + Burpees',
      notes: isTest ? 'TEST WEEK: Werk op naar 3RM squat. Eet en slaap goed!' : 'Zware triples — 83-85%.',
      workout_exercises: isTest ? [
        we(`w${w}-1`, exercises.back_squat, 1, { sets: 1, reps: '3RM TEST', notes: 'Warm up: leeg → 50% → 70% → 80% → 85% → 3RM poging' }),
        we(`w${w}-1`, exercises.rdl, 2, { sets: 3, reps: '6', notes: 'Matig — spaar energie voor DL test vrijdag' }),
      ] : [
        we(`w${w}-1`, exercises.back_squat, 1, { sets: 5, reps: '3', target_weight_kg: sqWt, notes: `~${Math.round(sqWt / 105 * 100)}% 1RM` }),
        we(`w${w}-1`, exercises.tempo_squat, 2, { sets: 3, reps: '6', target_weight_kg: tempoWt, tempo: '4-0-1-0', notes: '4 sec excentrisch — hypertrofie' }),
        we(`w${w}-1`, exercises.rdl, 3, { sets: 4, reps: '6', notes: 'Zwaar' }),
        we(`w${w}-1`, exercises.walking_lunges, 4, { sets: 4, reps: '16/side', notes: 'Zwaarder' }),
        we(`w${w}-1`, exercises.farmers_carry, 5, { sets: 5, distance_meters: 50, notes: 'Race weight of meer' }),
        we(`w${w}-1`, exercises.towel_hang, 6, { sets: 3, reps: 'Max hold' }),
        we(`w${w}-1`, exercises.plate_pinch, 7, { sets: 3, duration_seconds: 20 }),
        we(`w${w}-1`, exercises.burpee_broad, 8, { sets: 4, reps: '6', notes: w === 11 ? '40m time trial — doel sub 3:00' : 'Opbouwen naar 6 reps' }),
        we(`w${w}-1`, exercises.dragon_flag, 9, { sets: 3, reps: '5' }),
        we(`w${w}-1`, exercises.ab_wheel, 10, { sets: 3, reps: '12' }),
      ],
    },
    // ── DI: Run + Mixed ──
    {
      id: `w${w}-2`, program_id: 'p1', week_number: w, day_number: 2,
      name: 'Run + Mixed Cardio', focus: 'Continue Run + Benchmark',
      notes: isTest ? 'Noteer je mixed cardio benchmark tijd! RE-TEST alle baseline benchmarks!' : '30 min continu — eerste tempo-blok.',
      workout_exercises: [
        we(`w${w}-2`, exercises.running, 1, { sets: 1, duration_seconds: 1800, notes: '30 min @ 5:00-5:15/km, eerste tempo-blok: 10 min @ 4:50 in het midden' }),
        we(`w${w}-2`, exercises.skierg, 2, { sets: 1, distance_meters: 1000, notes: 'Mixed benchmark (geen rust ertussen)' }),
        we(`w${w}-2`, exercises.rowerg, 3, { sets: 1, distance_meters: 1000, notes: 'Direct door naar row' }),
        we(`w${w}-2`, exercises.wall_balls, 4, { sets: 1, reps: '75', notes: 'Direct door — noteer totaaltijd' }),
        we(`w${w}-2`, exercises.burpee_broad, 5, { sets: 4, reps: '8', notes: 'Ritme: 3+3+2' }),
      ],
    },
    // ── WO: Upper Kracht ──
    {
      id: `w${w}-3`, program_id: 'p1', week_number: w, day_number: 3,
      name: 'Upper Kracht', focus: 'Zwaar Persen + Trekken',
      notes: isTest ? 'Houd upper moderate — spaar voor lower test.' : 'Zware triples — RPE 8-9.',
      workout_exercises: [
        we(`w${w}-3`, exercises.bench_press, 1, { sets: 5, reps: '3', notes: '~85% of RPE 8-9' }),
        we(`w${w}-3`, exercises.ohp, 2, { sets: 4, reps: '5', notes: 'Zwaar' }),
        we(`w${w}-3`, exercises.weighted_pullups, 3, { sets: 5, reps: '5', notes: 'Verhoog gewicht' }),
        we(`w${w}-3`, exercises.barbell_row, 4, { sets: 4, reps: '5', notes: 'Zwaar' }),
        we(`w${w}-3`, exercises.db_flye, 5, { sets: 3, reps: '12' }),
        we(`w${w}-3`, exercises.cable_lat_raise, 6, { sets: 3, reps: '15' }),
        we(`w${w}-3`, exercises.hammer_curl, 7, { sets: 3, reps: '10' }),
        we(`w${w}-3`, exercises.overhead_tricep, 8, { sets: 3, reps: '10' }),
      ],
    },
    // ── VR: Lower + Hyrox (or DL test) ──
    {
      id: `w${w}-5`, program_id: 'p1', week_number: w, day_number: 5,
      name: isTest ? 'Lower — 3RM Test' : 'Lower Hyper + Hyrox',
      focus: isTest ? '3RM Deadlift Test' : 'Deadlift + Stations + Grip',
      notes: isTest ? 'TEST WEEK: Werk op naar 3RM deadlift. Nieuwe maxes!' : null,
      workout_exercises: isTest ? [
        we(`w${w}-5`, exercises.deadlift, 1, { sets: 1, reps: '3RM TEST', notes: 'Warm up: leeg → 50% → 70% → 80% → 85% → 3RM poging' }),
        we(`w${w}-5`, exercises.bulgarian, 2, { sets: 2, reps: '8/side', notes: 'Licht — gewoon bewegen' }),
      ] : [
        we(`w${w}-5`, exercises.deadlift, 1, { sets: 5, reps: '3', target_weight_kg: dlWt, notes: `~${Math.round(dlWt / 135 * 100)}% 1RM` }),
        we(`w${w}-5`, exercises.deficit_deadlift, 2, { sets: 3, reps: '5', notes: '70% 1RM — of pause deadlift' }),
        we(`w${w}-5`, exercises.bulgarian, 3, { sets: 3, reps: '8/side', notes: 'Zwaar' }),
        we(`w${w}-5`, exercises.sled_push, 4, { sets: 5, distance_meters: 25, notes: 'Zwaarder dan vorige weken' }),
        we(`w${w}-5`, exercises.sled_pull, 5, { sets: 5, distance_meters: 25 }),
        we(`w${w}-5`, exercises.dead_hang, 6, { sets: 1, reps: 'Max hold', notes: 'Grip challenge — doel: 60+ sec' }),
        we(`w${w}-5`, exercises.wall_balls, 7, { sets: 3, reps: '30', notes: 'Ononderbroken — endurance opbouwen' }),
      ],
    },
    // ── ZA: Half Hyrox Sim ──
    {
      id: `w${w}-6`, program_id: 'p1', week_number: w, day_number: 6,
      name: isTest ? 'Half Hyrox Sim — Benchmark' : 'Half Hyrox Simulatie',
      focus: 'Race Simulatie',
      notes: isTest ? 'RE-TEST alle baseline benchmarks van week 1! Noteer alle splits!' : 'Race-achtig tempo maar controleerbaar.',
      workout_exercises: [
        we(`w${w}-6`, exercises.running, 1, { sets: 4, distance_meters: 1000, notes: '4× 1km runs tussen stations' }),
        we(`w${w}-6`, exercises.skierg, 2, { sets: 1, distance_meters: 1000, notes: 'Station 1' }),
        we(`w${w}-6`, exercises.sled_push, 3, { sets: 1, distance_meters: 50, notes: 'Station 2 — race weight' }),
        we(`w${w}-6`, exercises.rowerg, 4, { sets: 1, distance_meters: 1000, notes: 'Station 3' }),
        we(`w${w}-6`, exercises.wall_balls, 5, { sets: 1, reps: '50', notes: 'Station 4' }),
      ],
    },
  ]
}

export const phase1Workouts: Workout[] = [
  ...weeks1to4(1),
  ...weeks1to4(2),
  ...weeks1to4(3),
  ...weeks1to4(4),  // deload
  ...weeks5to8(5),
  ...weeks5to8(6),
  ...weeks5to8(7),
  ...weeks5to8(8),  // deload
  ...weeks9to12(9),
  ...weeks9to12(10),
  ...weeks9to12(11),
  ...weeks9to12(12), // test
]
