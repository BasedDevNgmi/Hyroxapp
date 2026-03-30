import { exercises } from './exercises'
import { we } from './helpers'
import type { Workout } from '@/hooks/useProgram'

// ═══════════════════════════════════════════════════════════
// PHASE 5: TAPER (Weeks 39-42)
// Volume drastisch omlaag. Kracht: singles en doubles.
// Je lichaam supercompenseert. Fris en scherp op racedag.
// 1RM values: Squat 140kg, Deadlift 180kg
// ═══════════════════════════════════════════════════════════

export const phase5Workouts: Workout[] = [
  // ══════════════════════════════════════════════════════
  // Week 39: Afbouw (-40% volume)
  // ══════════════════════════════════════════════════════

  // MA: Lower
  {
    id: 'w39-1', program_id: 'p5', week_number: 39, day_number: 1,
    name: 'Lower Activatie', focus: 'Squat + DL + Carry — Dat is alles',
    notes: 'Zwaar genoeg om te behouden, laag volume. Geen grinding reps.',
    workout_exercises: [
      we('w39-1', exercises.back_squat, 1, { sets: 2, reps: '2', target_weight_kg: 115, notes: '82% — crisp doubles' }),
      we('w39-1', exercises.deadlift, 2, { sets: 2, reps: '1', target_weight_kg: 153, notes: '85% — zware singles' }),
      we('w39-1', exercises.farmers_carry, 3, { sets: 1, distance_meters: 100, notes: 'Race weight. Dat is alles.' }),
    ],
  },
  // DI: Tempo Run
  {
    id: 'w39-2', program_id: 'p5', week_number: 39, day_number: 2,
    name: 'Tempo Run', focus: 'Race Pace Sharpening',
    notes: 'Korter, zelfde snelheid. Blijf relaxed op tempo.',
    workout_exercises: [
      we('w39-2', exercises.running, 1, { sets: 1, duration_seconds: 1800, notes: '30 min met 15 min @ 4:10/km' }),
    ],
  },
  // WO: Upper
  {
    id: 'w39-3', program_id: 'p5', week_number: 39, day_number: 3,
    name: 'Upper Activatie', focus: 'Bench/OHP/Pull — Kort',
    notes: 'Minimaal volume. Houd het signaal.',
    workout_exercises: [
      we('w39-3', exercises.bench_press, 1, { sets: 2, reps: '2', target_weight_kg: 115, notes: '82%' }),
      we('w39-3', exercises.ohp, 2, { sets: 2, reps: '2', notes: '~80%' }),
      we('w39-3', exercises.weighted_pullups, 3, { sets: 3, reps: '5' }),
    ],
  },
  // VR: Easy Run + Strides
  {
    id: 'w39-5', program_id: 'p5', week_number: 39, day_number: 5,
    name: 'Easy Run + Strides', focus: 'Actief Herstel',
    notes: 'Easy run + strides. Geen hard werk.',
    workout_exercises: [
      we('w39-5', exercises.running, 1, { sets: 1, duration_seconds: 1500, notes: 'Easy run 25 min' }),
      we('w39-5', exercises.strides, 2, { sets: 4, distance_meters: 80, notes: '4× strides' }),
    ],
  },
  // ZA: Mini Sim
  {
    id: 'w39-6', program_id: 'p5', week_number: 39, day_number: 6,
    name: 'Mini Sim', focus: '3× 1km + 3 Stations @ Race Pace',
    notes: 'Bevestig pacing plan. Laatste kans om splits te checken.',
    workout_exercises: [
      we('w39-6', exercises.running, 1, { sets: 3, distance_meters: 1000, notes: '3× 1km @ race pace' }),
      we('w39-6', exercises.skierg, 2, { sets: 1, distance_meters: 1000, notes: 'Race pace' }),
      we('w39-6', exercises.rowerg, 3, { sets: 1, distance_meters: 1000, notes: 'Race pace' }),
      we('w39-6', exercises.wall_balls, 4, { sets: 1, reps: '50', notes: 'Race pace' }),
    ],
  },

  // ══════════════════════════════════════════════════════
  // Week 40: Afbouw (-40% volume)
  // ══════════════════════════════════════════════════════

  // MA: Lower
  {
    id: 'w40-1', program_id: 'p5', week_number: 40, day_number: 1,
    name: 'Lower Activatie', focus: 'Squat + DL — Minimaal',
    notes: 'Zelfde als week 39. Behoud, niet opbouwen.',
    workout_exercises: [
      we('w40-1', exercises.back_squat, 1, { sets: 2, reps: '2', target_weight_kg: 115, notes: '82% — crisp' }),
      we('w40-1', exercises.deadlift, 2, { sets: 2, reps: '1', target_weight_kg: 153, notes: '85%' }),
      we('w40-1', exercises.farmers_carry, 3, { sets: 1, distance_meters: 100, notes: 'Race weight' }),
    ],
  },
  // DI: Tempo Run
  {
    id: 'w40-2', program_id: 'p5', week_number: 40, day_number: 2,
    name: 'Tempo Run', focus: 'Race Pace',
    notes: 'Korter, zelfde snelheid.',
    workout_exercises: [
      we('w40-2', exercises.running, 1, { sets: 1, duration_seconds: 1800, notes: '30 min met 15 min @ 4:10/km' }),
    ],
  },
  // WO: Upper
  {
    id: 'w40-3', program_id: 'p5', week_number: 40, day_number: 3,
    name: 'Upper Activatie', focus: 'Bench/OHP/Pull',
    notes: 'Minimaal volume.',
    workout_exercises: [
      we('w40-3', exercises.bench_press, 1, { sets: 2, reps: '2', target_weight_kg: 115, notes: '82%' }),
      we('w40-3', exercises.ohp, 2, { sets: 2, reps: '2', notes: '~80%' }),
      we('w40-3', exercises.weighted_pullups, 3, { sets: 3, reps: '5' }),
    ],
  },
  // VR: Easy Run
  {
    id: 'w40-5', program_id: 'p5', week_number: 40, day_number: 5,
    name: 'Easy Run + Strides', focus: 'Actief Herstel',
    notes: 'Easy run + strides.',
    workout_exercises: [
      we('w40-5', exercises.running, 1, { sets: 1, duration_seconds: 1500, notes: 'Easy run 25 min' }),
      we('w40-5', exercises.strides, 2, { sets: 4, distance_meters: 80, notes: '4× strides' }),
    ],
  },
  // ZA: Mini Sim
  {
    id: 'w40-6', program_id: 'p5', week_number: 40, day_number: 6,
    name: 'Mini Sim', focus: '3× 1km + 3 Stations',
    notes: 'Laatste mini sim. Bevestig pacing plan.',
    workout_exercises: [
      we('w40-6', exercises.running, 1, { sets: 3, distance_meters: 1000, notes: '3× 1km @ race pace' }),
      we('w40-6', exercises.wall_balls, 2, { sets: 1, reps: '50', notes: 'Race pace' }),
      we('w40-6', exercises.burpee_broad, 3, { sets: 1, distance_meters: 40, notes: 'Race pace — halve afstand' }),
      we('w40-6', exercises.farmers_carry, 4, { sets: 1, distance_meters: 100, notes: 'Race pace' }),
    ],
  },

  // ══════════════════════════════════════════════════════
  // Week 41: Race Week (begin)
  // ══════════════════════════════════════════════════════

  // MA: Easy Run + Strides
  {
    id: 'w41-1', program_id: 'p5', week_number: 41, day_number: 1,
    name: 'Easy Run + Strides', focus: 'Activatie',
    notes: 'Makkelijke run + korte strides. Niets meer.',
    workout_exercises: [
      we('w41-1', exercises.running, 1, { sets: 1, duration_seconds: 1200, notes: 'Easy run 20 min' }),
      we('w41-1', exercises.strides, 2, { sets: 4, distance_meters: 80, notes: '4× korte strides' }),
    ],
  },
  // DI: Laatste keer zwaar
  {
    id: 'w41-2', program_id: 'p5', week_number: 41, day_number: 2,
    name: 'Lower Activatie — Laatste', focus: 'Squat + DL — 20 min in de gym',
    notes: 'Activatie. 20 min in de gym. Laatste keer zwaar voor race.',
    workout_exercises: [
      we('w41-2', exercises.back_squat, 1, { sets: 2, reps: '1', target_weight_kg: 112, notes: '80% — activatie' }),
      we('w41-2', exercises.deadlift, 2, { sets: 1, reps: '1', target_weight_kg: 144, notes: '80% — activatie' }),
    ],
  },
  // WO: Rust (Prehab + Foam Rolling + Visualisatie)
  {
    id: 'w41-3', program_id: 'p5', week_number: 41, day_number: 3,
    name: 'Rust + Visualisatie', focus: 'Prehab + Foam Rolling',
    notes: 'Prehab protocol + foam rolling + visualisatie. Geen training.',
    workout_exercises: [
      we('w41-3', exercises.foam_roll, 1, { sets: 1, duration_seconds: 600, notes: 'Uitgebreide foam roll sessie' }),
    ],
  },
  // VR: Openers
  {
    id: 'w41-5', program_id: 'p5', week_number: 41, day_number: 5,
    name: 'Openers', focus: 'Activatie — Geen vermoeidheid',
    notes: '15 min easy run + korte openers. Activatie, geen vermoeidheid.',
    workout_exercises: [
      we('w41-5', exercises.running, 1, { sets: 1, duration_seconds: 900, notes: '15 min easy run' }),
      we('w41-5', exercises.running, 2, { sets: 3, distance_meters: 200, notes: '3× 200m @ race pace' }),
      we('w41-5', exercises.wall_balls, 3, { sets: 1, reps: '10', notes: 'Kort — activatie' }),
      we('w41-5', exercises.sled_push, 4, { sets: 1, distance_meters: 25, notes: 'Kort — activatie' }),
    ],
  },
  // ZA: Rust
  {
    id: 'w41-6', program_id: 'p5', week_number: 41, day_number: 6,
    name: 'Rust', focus: 'Materiaal checken. Vroeg slapen.',
    notes: 'Rust. Materiaal checken. Voeding voorbereiden. Vroeg slapen. Vertrouwen.',
    workout_exercises: [
      we('w41-6', exercises.foam_roll, 1, { sets: 1, duration_seconds: 300, notes: 'Lichte mobiliteit als je wilt. Verder: RUST.' }),
    ],
  },

  // ══════════════════════════════════════════════════════
  // Week 42: RACE WEEK
  // ══════════════════════════════════════════════════════

  // MA: Easy Run
  {
    id: 'w42-1', program_id: 'p5', week_number: 42, day_number: 1,
    name: 'Easy Run + Strides', focus: 'Activatie',
    notes: 'Makkelijke run. Niets meer.',
    workout_exercises: [
      we('w42-1', exercises.running, 1, { sets: 1, duration_seconds: 1200, notes: 'Easy 20 min' }),
      we('w42-1', exercises.strides, 2, { sets: 4, distance_meters: 80 }),
    ],
  },
  // DI: Laatste activatie
  {
    id: 'w42-2', program_id: 'p5', week_number: 42, day_number: 2,
    name: 'Laatste Activatie', focus: 'Squat + DL singles',
    notes: 'Activatie. 20 min in de gym. Laatste keer.',
    workout_exercises: [
      we('w42-2', exercises.back_squat, 1, { sets: 2, reps: '1', target_weight_kg: 112, notes: '80% — activatie' }),
      we('w42-2', exercises.deadlift, 2, { sets: 1, reps: '1', target_weight_kg: 144, notes: '80% — activatie' }),
    ],
  },
  // WO: Rust
  {
    id: 'w42-3', program_id: 'p5', week_number: 42, day_number: 3,
    name: 'Rust + Visualisatie', focus: 'Prehab + Visualisatie',
    notes: 'Prehab + foam rolling + visualisatie. Verder niks.',
    workout_exercises: [
      we('w42-3', exercises.foam_roll, 1, { sets: 1, duration_seconds: 600, notes: 'Foam rolling + visualisatie' }),
    ],
  },
  // VR: Openers
  {
    id: 'w42-5', program_id: 'p5', week_number: 42, day_number: 5,
    name: 'Openers', focus: 'Activatie — Geen vermoeidheid',
    notes: 'Korte run + openers. Activatie. Hydratatie. Voeding voorbereiden.',
    workout_exercises: [
      we('w42-5', exercises.running, 1, { sets: 1, duration_seconds: 900, notes: '15 min easy' }),
      we('w42-5', exercises.running, 2, { sets: 3, distance_meters: 200, notes: '3× 200m @ race pace' }),
      we('w42-5', exercises.wall_balls, 3, { sets: 1, reps: '10', notes: 'Kort — activatie' }),
    ],
  },
  // ZA: Rust — Morgen is race day
  {
    id: 'w42-6', program_id: 'p5', week_number: 42, day_number: 6,
    name: 'Rust — Morgen Race Day', focus: 'Materiaal. Slapen. Vertrouwen.',
    notes: 'Rust. Materiaal checken. Vroeg slapen. Vertrouwen. Morgen: HYROX AMSTERDAM 2027.',
    workout_exercises: [
      we('w42-6', exercises.foam_roll, 1, { sets: 1, duration_seconds: 300, notes: 'Lichte mobiliteit. Verder: RUST. Morgen geven we alles.' }),
    ],
  },
]
