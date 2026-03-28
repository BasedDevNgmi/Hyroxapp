import { exercises } from './exercises'
import { we } from './helpers'
import type { Workout } from '@/hooks/useProgram'

// ═══════════════════════════════════════════════════════════
// PHASE 1: FOUNDATION (Weeks 1-12)
// Linear strength progression, run/walk buildup, hypertrophy, grip/core.
// Starting 1RM: Squat 105kg, Deadlift 135kg
// Goal: Squat ~118kg / Deadlift ~152kg / 30 min continuous run
// ═══════════════════════════════════════════════════════════

// Helper to generate a week of workouts for sub-phase weeks 1-4
function weeks1to4(w: number): Workout[] {
  // Progressive overload: +2.5kg/wk squat, +2.5-5kg/wk deadlift
  const sqWt = [79, 82, 84, 84][w - 1]   // 75% progressing
  const dlWt = [101, 104, 108, 108][w - 1]
  const rdlWt = [81, 84, 87, 87][w - 1]
  const fsWt = [63, 65, 67, 67][w - 1]
  const isDeload = w === 4
  const sqSets = isDeload ? 3 : 4
  const sqReps = isDeload ? '3' : '5'
  const dlSets = isDeload ? 3 : 4
  const dlReps = isDeload ? '3' : '5'

  return [
    // Monday - Lower Heavy
    {
      id: `w${w}-1`, program_id: 'p1', week_number: w, day_number: 1,
      name: 'Lower Heavy', focus: 'Squat + Posterior Chain',
      notes: isDeload ? 'DELOAD WEEK: reduced volume, maintain weight.' : 'Focus depth and tempo (3-1-1).',
      workout_exercises: [
        we(`w${w}-1`, exercises.back_squat, 1, { sets: sqSets, reps: sqReps, target_weight_kg: sqWt, tempo: '3-1-1', notes: `${Math.round(sqWt/105*100)}% 1RM` }),
        we(`w${w}-1`, exercises.rdl, 2, { sets: isDeload ? 2 : 3, reps: '8', target_weight_kg: rdlWt, notes: `~${Math.round(rdlWt/135*100)}% DL 1RM` }),
        we(`w${w}-1`, exercises.bulgarian, 3, { sets: isDeload ? 2 : 3, reps: '10/side' }),
        we(`w${w}-1`, exercises.leg_curl, 4, { sets: 3, reps: '12' }),
        we(`w${w}-1`, exercises.leg_extension, 5, { sets: 3, reps: '12' }),
        we(`w${w}-1`, exercises.farmers_carry, 6, { sets: 3, duration_seconds: 30, notes: 'As heavy as possible — grip builder' }),
        we(`w${w}-1`, exercises.dead_hang, 7, { sets: 3, reps: 'Max hold', notes: 'Grip endurance' }),
      ],
    },
    // Tuesday - Run + Hyrox
    {
      id: `w${w}-2`, program_id: 'p1', week_number: w, day_number: 2,
      name: 'Run + Hyrox Stations', focus: 'Aerobic Base + Technique',
      notes: 'Run/walk intervals — EASY pace. Build the base.',
      workout_exercises: [
        we(`w${w}-2`, exercises.run_walk, 1, { sets: 1, duration_seconds: 1500, notes: '25 min total: 2 min run / 1 min walk @ 5:30-6:00/km' }),
        we(`w${w}-2`, exercises.skierg, 2, { sets: 3, duration_seconds: 180, rest_seconds: 60, notes: 'Moderate effort' }),
        we(`w${w}-2`, exercises.rowerg, 3, { sets: 3, duration_seconds: 180, rest_seconds: 60, notes: 'Moderate effort' }),
        we(`w${w}-2`, exercises.wall_balls, 4, { sets: 5, reps: '10', rest_seconds: 45, notes: 'Focus technique and rhythm' }),
      ],
    },
    // Wednesday - Upper Heavy
    {
      id: `w${w}-3`, program_id: 'p1', week_number: w, day_number: 3,
      name: 'Upper Heavy', focus: 'Bench/OHP + Pull',
      notes: isDeload ? 'DELOAD: reduced sets.' : 'RPE 7 on main lifts. Build volume.',
      workout_exercises: [
        we(`w${w}-3`, exercises.bench_press, 1, { sets: isDeload ? 3 : 4, reps: '6', notes: 'RPE 7 — determine starting weight week 1' }),
        we(`w${w}-3`, exercises.ohp, 2, { sets: 3, reps: '8', notes: 'RPE 7' }),
        we(`w${w}-3`, exercises.barbell_row, 3, { sets: isDeload ? 3 : 4, reps: '8' }),
        we(`w${w}-3`, exercises.pullups, 4, { sets: 4, reps: 'Max', notes: 'Or weighted if you can do 12+' }),
        we(`w${w}-3`, exercises.db_lateral_raise, 5, { sets: 3, reps: '15' }),
        we(`w${w}-3`, exercises.face_pulls, 6, { sets: 3, reps: '15' }),
        we(`w${w}-3`, exercises.barbell_curl, 7, { sets: 3, reps: '10' }),
        we(`w${w}-3`, exercises.tricep_dips, 8, { sets: 3, reps: '10' }),
      ],
    },
    // Friday - Lower Hypertrophy + Hyrox
    {
      id: `w${w}-5`, program_id: 'p1', week_number: w, day_number: 5,
      name: 'Lower Hypertrophy + Hyrox', focus: 'Deadlift + Accessories + Stations',
      notes: isDeload ? 'DELOAD: reduced volume.' : null,
      workout_exercises: [
        we(`w${w}-5`, exercises.deadlift, 1, { sets: dlSets, reps: dlReps, target_weight_kg: dlWt, notes: `${Math.round(dlWt/135*100)}% 1RM` }),
        we(`w${w}-5`, exercises.front_squat, 2, { sets: 3, reps: '8', target_weight_kg: fsWt, notes: `60% squat 1RM` }),
        we(`w${w}-5`, exercises.hip_thrust, 3, { sets: 3, reps: '12', notes: 'Heavy' }),
        we(`w${w}-5`, exercises.walking_lunges, 4, { sets: 3, reps: '12/side', notes: 'With dumbbells' }),
        we(`w${w}-5`, exercises.ab_wheel, 5, { sets: 3, reps: '10' }),
        we(`w${w}-5`, exercises.pallof_press, 6, { sets: 3, reps: '10/side' }),
        we(`w${w}-5`, exercises.plate_pinch, 7, { sets: 3, duration_seconds: 20, notes: 'Grip circuit' }),
        we(`w${w}-5`, exercises.towel_hang, 8, { sets: 3, reps: 'Max hold' }),
      ],
    },
    // Saturday - Hyrox Simulation
    {
      id: `w${w}-6`, program_id: 'p1', week_number: w, day_number: 6,
      name: 'Hyrox Simulation', focus: 'Flow + Technique',
      notes: 'Flow and technique, NOT hard effort. Learn the movements.',
      workout_exercises: [
        we(`w${w}-6`, exercises.run_walk, 1, { sets: 1, duration_seconds: 1200, notes: '20 min run/walk (2:1 ratio)' }),
        we(`w${w}-6`, exercises.running, 2, { sets: 1, distance_meters: 500, notes: 'Mini-circuit start' }),
        we(`w${w}-6`, exercises.wall_balls, 3, { sets: 1, reps: '15' }),
        we(`w${w}-6`, exercises.rowerg, 4, { sets: 1, distance_meters: 250 }),
        we(`w${w}-6`, exercises.burpee_broad, 5, { sets: 1, reps: '15' }),
        we(`w${w}-6`, exercises.sled_push, 6, { sets: 3, distance_meters: 20, notes: 'Light weight — technique' }),
        we(`w${w}-6`, exercises.sled_pull, 7, { sets: 3, distance_meters: 20, notes: 'Light weight — technique' }),
      ],
    },
  ]
}

// Helper for weeks 5-8
function weeks5to8(w: number): Workout[] {
  const sqWt = [84, 87, 89, 89][w - 5]
  const dlWt = [108, 111, 115, 115][w - 5]
  const pauseWt = [68, 70, 72, 72][w - 5]  // 65% of ~105
  const fsWt = [68, 70, 72, 72][w - 5]     // 65% squat
  const isDeload = w === 8

  return [
    // Monday - Lower Heavy
    {
      id: `w${w}-1`, program_id: 'p1', week_number: w, day_number: 1,
      name: 'Lower Heavy', focus: 'Squat + Pause Work',
      notes: isDeload ? 'DELOAD WEEK: reduced volume, maintain intensity.' : 'Building up — 4×4 at 80%.',
      workout_exercises: [
        we(`w${w}-1`, exercises.back_squat, 1, { sets: isDeload ? 3 : 4, reps: isDeload ? '3' : '4', target_weight_kg: sqWt, notes: `~80% 1RM` }),
        we(`w${w}-1`, exercises.pause_squat, 2, { sets: 3, reps: '5', target_weight_kg: pauseWt, notes: '65% — 2 sec pause at bottom' }),
        we(`w${w}-1`, exercises.rdl, 3, { sets: 3, reps: '8', notes: 'Increase weight vs weeks 1-4' }),
        we(`w${w}-1`, exercises.leg_press, 4, { sets: 3, reps: '10' }),
        we(`w${w}-1`, exercises.leg_curl, 5, { sets: 3, reps: '12' }),
        we(`w${w}-1`, exercises.farmers_carry, 6, { sets: 4, distance_meters: 40, notes: 'Increase weight each week' }),
        we(`w${w}-1`, exercises.dead_hang, 7, { sets: 3, reps: 'Max hold' }),
        we(`w${w}-1`, exercises.fat_grip_hang, 8, { sets: 2, reps: 'Max hold' }),
      ],
    },
    // Tuesday - Run + Hyrox
    {
      id: `w${w}-2`, program_id: 'p1', week_number: w, day_number: 2,
      name: 'Run + Hyrox Stations', focus: 'Continuous Run + Stations',
      notes: 'No more walk breaks! STOP immediately if knee/ankle pain.',
      workout_exercises: [
        we(`w${w}-2`, exercises.running, 1, { sets: 1, duration_seconds: 1500, notes: '20-25 min continuous @ 5:15-5:30/km' }),
        we(`w${w}-2`, exercises.skierg, 2, { sets: 4, duration_seconds: 240, rest_seconds: 75 }),
        we(`w${w}-2`, exercises.rowerg, 3, { sets: 4, duration_seconds: 240, rest_seconds: 75 }),
        we(`w${w}-2`, exercises.wall_balls, 4, { sets: 4, reps: '15', rest_seconds: 45, notes: 'Faster tempo than phase start' }),
        we(`w${w}-2`, exercises.burpee_broad, 5, { sets: 5, reps: '5', notes: 'Focus technique' }),
      ],
    },
    // Wednesday - Upper Heavy
    {
      id: `w${w}-3`, program_id: 'p1', week_number: w, day_number: 3,
      name: 'Upper Heavy', focus: 'Bench/OHP + Weighted Pulls',
      notes: isDeload ? 'DELOAD: reduced sets.' : 'Increase 2.5kg/week on bench, 1-2kg/week on OHP.',
      workout_exercises: [
        we(`w${w}-3`, exercises.bench_press, 1, { sets: isDeload ? 3 : 4, reps: '5', notes: '+2.5 kg/week' }),
        we(`w${w}-3`, exercises.ohp, 2, { sets: 4, reps: '6', notes: '+1-2 kg/week' }),
        we(`w${w}-3`, exercises.weighted_pullups, 3, { sets: 4, reps: '6', notes: 'Or bodyweight 4×max' }),
        we(`w${w}-3`, exercises.pendlay_row, 4, { sets: 4, reps: '6' }),
        we(`w${w}-3`, exercises.db_incline_press, 5, { sets: 3, reps: '10' }),
        we(`w${w}-3`, exercises.cable_row, 6, { sets: 3, reps: '12' }),
        we(`w${w}-3`, exercises.ez_curl, 7, { sets: 3, reps: '10', notes: 'Superset with skull crushers' }),
        we(`w${w}-3`, exercises.skull_crusher, 8, { sets: 3, reps: '10' }),
      ],
    },
    // Friday - Lower Hypertrophy + Hyrox
    {
      id: `w${w}-5`, program_id: 'p1', week_number: w, day_number: 5,
      name: 'Lower Hypertrophy + Hyrox', focus: 'Deadlift + Sled Work',
      notes: isDeload ? 'DELOAD: reduced volume.' : null,
      workout_exercises: [
        we(`w${w}-5`, exercises.deadlift, 1, { sets: isDeload ? 3 : 4, reps: isDeload ? '3' : '4', target_weight_kg: dlWt, notes: `~80% 1RM` }),
        we(`w${w}-5`, exercises.front_squat, 2, { sets: 3, reps: '6', target_weight_kg: fsWt, notes: '65% squat' }),
        we(`w${w}-5`, exercises.sandbag_lunges, 3, { sets: 4, reps: '20 steps', notes: 'Hyrox race weight' }),
        we(`w${w}-5`, exercises.hip_thrust, 4, { sets: 3, reps: '10', notes: 'Heavier than weeks 1-4' }),
        we(`w${w}-5`, exercises.sled_push, 5, { sets: 4, distance_meters: 20, notes: 'Medium weight' }),
        we(`w${w}-5`, exercises.sled_pull, 6, { sets: 4, distance_meters: 20, notes: 'Medium weight' }),
        we(`w${w}-5`, exercises.hanging_knee, 7, { sets: 3, reps: '12' }),
        we(`w${w}-5`, exercises.side_plank, 8, { sets: 3, duration_seconds: 30, notes: 'Per side' }),
      ],
    },
    // Saturday - Hyrox Simulation
    {
      id: `w${w}-6`, program_id: 'p1', week_number: w, day_number: 6,
      name: 'Hyrox Simulation', focus: 'Pacing + Endurance',
      notes: 'Moderate tempo, focus on pacing. Not max effort.',
      workout_exercises: [
        we(`w${w}-6`, exercises.running, 1, { sets: 1, duration_seconds: 1500, notes: '25 min continuous @ easy pace' }),
        we(`w${w}-6`, exercises.running, 2, { sets: 1, distance_meters: 1000, notes: 'Circuit: 1km run' }),
        we(`w${w}-6`, exercises.skierg, 3, { sets: 1, distance_meters: 500 }),
        we(`w${w}-6`, exercises.running, 4, { sets: 1, distance_meters: 1000, notes: '1km run' }),
        we(`w${w}-6`, exercises.rowerg, 5, { sets: 1, distance_meters: 500 }),
        we(`w${w}-6`, exercises.strides, 6, { sets: 4, distance_meters: 80, notes: '80m accelerations after circuit' }),
      ],
    },
  ]
}

// Helper for weeks 9-12
function weeks9to12(w: number): Workout[] {
  const sqWt = [90, 94, 97, 0][w - 9]   // Week 12 = test
  const dlWt = [118, 121, 125, 0][w - 9]
  const tempoWt = [74, 74, 74, 74][w - 9]  // 70% squat
  const isTest = w === 12

  return [
    // Monday - Lower Heavy
    {
      id: `w${w}-1`, program_id: 'p1', week_number: w, day_number: 1,
      name: isTest ? 'Lower — 3RM Test' : 'Lower Heavy', focus: isTest ? '3RM Squat Test' : 'Heavy Triples',
      notes: isTest ? 'TEST WEEK: Work up to 3RM on squat. Eat and sleep well this week!' : 'Heavy triples — 83-85% range.',
      workout_exercises: isTest ? [
        we(`w${w}-1`, exercises.back_squat, 1, { sets: 1, reps: '3RM TEST', notes: 'Warm up: empty → 50% → 70% → 80% → 85% → 3RM attempt' }),
        we(`w${w}-1`, exercises.rdl, 2, { sets: 3, reps: '6', notes: 'Moderate — save energy for DL test Friday' }),
      ] : [
        we(`w${w}-1`, exercises.back_squat, 1, { sets: 5, reps: '3', target_weight_kg: sqWt, notes: `~${Math.round(sqWt/105*100)}% 1RM` }),
        we(`w${w}-1`, exercises.tempo_squat, 2, { sets: 3, reps: '6', target_weight_kg: tempoWt, tempo: '4-0-1-0', notes: '4 sec eccentric' }),
        we(`w${w}-1`, exercises.rdl, 3, { sets: 4, reps: '6', notes: 'Heavy' }),
        we(`w${w}-1`, exercises.walking_lunges, 4, { sets: 4, reps: '16/side', notes: 'Heavier than previous weeks' }),
        we(`w${w}-1`, exercises.farmers_carry, 5, { sets: 5, distance_meters: 50, notes: 'Race weight or heavier' }),
        we(`w${w}-1`, exercises.towel_hang, 6, { sets: 3, reps: 'Max hold' }),
        we(`w${w}-1`, exercises.barbell_hold, 7, { sets: 3, duration_seconds: 20 }),
        we(`w${w}-1`, exercises.plate_pinch, 8, { sets: 3, duration_seconds: 20 }),
      ],
    },
    // Tuesday - Run + Hyrox
    {
      id: `w${w}-2`, program_id: 'p1', week_number: w, day_number: 2,
      name: 'Run + Mixed Cardio', focus: 'Continuous Run + Benchmark',
      notes: isTest ? 'Record your mixed cardio benchmark time!' : '30 min continuous — building endurance.',
      workout_exercises: [
        we(`w${w}-2`, exercises.running, 1, { sets: 1, duration_seconds: 1800, notes: '30 min @ 5:00-5:15/km continuous' }),
        we(`w${w}-2`, exercises.skierg, 2, { sets: 1, distance_meters: 1000, notes: 'Mixed cardio benchmark (no rest between)' }),
        we(`w${w}-2`, exercises.rowerg, 3, { sets: 1, distance_meters: 1000, notes: 'Straight into row' }),
        we(`w${w}-2`, exercises.wall_balls, 4, { sets: 1, reps: '75', notes: 'Straight into wall balls — record total time' }),
        we(`w${w}-2`, exercises.burpee_broad, 5, { sets: 4, reps: '8', notes: 'Rhythm: 3+3+2, short rests' }),
      ],
    },
    // Wednesday - Upper Heavy
    {
      id: `w${w}-3`, program_id: 'p1', week_number: w, day_number: 3,
      name: isTest ? 'Upper Heavy' : 'Upper Heavy', focus: 'Heavy Pressing + Pulling',
      notes: isTest ? 'Keep upper work moderate — save for lower test.' : 'Heavy triples — RPE 8-9.',
      workout_exercises: [
        we(`w${w}-3`, exercises.bench_press, 1, { sets: 5, reps: '3', notes: '~85% or RPE 8-9' }),
        we(`w${w}-3`, exercises.ohp, 2, { sets: 4, reps: '5', notes: 'Heavy' }),
        we(`w${w}-3`, exercises.weighted_pullups, 3, { sets: 5, reps: '5', notes: 'Increase weight' }),
        we(`w${w}-3`, exercises.barbell_row, 4, { sets: 4, reps: '5', notes: 'Heavy' }),
        we(`w${w}-3`, exercises.db_flye, 5, { sets: 3, reps: '12' }),
        we(`w${w}-3`, exercises.cable_lat_raise, 6, { sets: 3, reps: '15' }),
        we(`w${w}-3`, exercises.hammer_curl, 7, { sets: 3, reps: '10' }),
        we(`w${w}-3`, exercises.overhead_tricep, 8, { sets: 3, reps: '10' }),
      ],
    },
    // Friday - Lower + Hyrox (or DL test)
    {
      id: `w${w}-5`, program_id: 'p1', week_number: w, day_number: 5,
      name: isTest ? 'Lower — 3RM Test' : 'Lower Hypertrophy + Hyrox', focus: isTest ? '3RM Deadlift Test' : 'Heavy Deadlift + Stations',
      notes: isTest ? 'TEST WEEK: Work up to 3RM on deadlift. New maxes incoming!' : null,
      workout_exercises: isTest ? [
        we(`w${w}-5`, exercises.deadlift, 1, { sets: 1, reps: '3RM TEST', notes: 'Warm up: empty → 50% → 70% → 80% → 85% → 3RM attempt' }),
        we(`w${w}-5`, exercises.bulgarian, 2, { sets: 2, reps: '8/side', notes: 'Light — just move' }),
      ] : [
        we(`w${w}-5`, exercises.deadlift, 1, { sets: 5, reps: '3', target_weight_kg: dlWt, notes: `~${Math.round(dlWt/135*100)}% 1RM` }),
        we(`w${w}-5`, exercises.deficit_deadlift, 2, { sets: 3, reps: '5', notes: '70% 1RM — or pause deadlift' }),
        we(`w${w}-5`, exercises.bulgarian, 3, { sets: 3, reps: '8/side', notes: 'Heavy' }),
        we(`w${w}-5`, exercises.sled_push, 4, { sets: 5, distance_meters: 25, notes: 'Heavier than before' }),
        we(`w${w}-5`, exercises.sled_pull, 5, { sets: 5, distance_meters: 25 }),
        we(`w${w}-5`, exercises.wall_balls, 6, { sets: 3, reps: '30', notes: 'Unbroken — build endurance' }),
      ],
    },
    // Saturday - Hyrox Simulation
    {
      id: `w${w}-6`, program_id: 'p1', week_number: w, day_number: 6,
      name: isTest ? 'Half Hyrox Sim — Benchmark' : 'Half Hyrox Simulation', focus: 'Race Simulation',
      notes: isTest ? 'Record all splits! Use this as your Phase 1 benchmark.' : 'Race-like tempo but controllable.',
      workout_exercises: [
        we(`w${w}-6`, exercises.running, 1, { sets: 4, distance_meters: 1000, notes: '4× 1km runs between stations' }),
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
