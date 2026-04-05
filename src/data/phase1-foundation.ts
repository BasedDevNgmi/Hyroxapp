import { exercises } from './exercises'
import { we } from './helpers'
import type { Workout } from '@/hooks/useProgram'

// ═══════════════════════════════════════════════════════════
// PHASE 1: FUNDAMENT (Weeks 1-12)
// Lineaire progressie. Hypertrofie. Grip bouwen. Burpee techniek.
// Run/walk → continu lopen. Station-techniek. Baseline tests.
// Starting 1RM: Squat 105kg, Deadlift 135kg, Bench 80kg, OHP 43kg
// Goal: Squat ~118kg / Deadlift ~152kg / 30 min continu pijnvrij
// ═══════════════════════════════════════════════════════════

// ── WEEK 1: BASELINE TESTS + START ──────────────────────────
function week1(): Workout[] {
  return [
    // ── MA: Lower Kracht (Baseline Tests) ──
    {
      id: 'w1-1', program_id: 'p1', week_number: 1, day_number: 1,
      name: 'Lower Kracht', focus: 'Baseline Tests',
      notes: 'Test week. Noteer alles. Dit zijn je startpunten.',
      workout_exercises: [
        we('w1-1', exercises.back_squat, 1, { sets: 1, reps: '5RM TEST', notes: 'Warm-up: 20kg×8, 40kg×5, 60kg×3, 80kg×2. Werk naar 5RM. Start ~85kg, verhoog per 5kg.' }),
        we('w1-1', exercises.deadlift, 2, { sets: 1, reps: '5RM TEST', notes: 'Warm-up: 60kg×5, 80kg×3, 100kg×2. Werk naar 5RM. Start ~110kg, verhoog per 5kg.' }),
        we('w1-1', exercises.farmers_hold, 3, { sets: 1, reps: 'Max hold', notes: '2×24kg — pak op, sta stil, hou vast tot je moet loslaten. NOTEER tijd.' }),
        we('w1-1', exercises.dead_hang, 4, { sets: 1, reps: 'Max hold', notes: 'NOTEER tijd in seconden.' }),
        we('w1-1', exercises.burpee_broad, 5, { sets: 1, reps: '20', notes: '20 reps for time. NOTEER tijd + film jezelf voor techniek check.' }),
      ],
    },
    // ── DI: Run + Cardio Stations (Baseline Tests) ──
    {
      id: 'w1-2', program_id: 'p1', week_number: 1, day_number: 2,
      name: 'Run + Cardio Stations', focus: 'Baseline Tests',
      notes: 'Test alle cardio stations. Zorg dat je fris start per test (3 min rust ertussen).',
      workout_exercises: [
        we('w1-2', exercises.running, 1, { sets: 1, distance_meters: 1000, notes: '1km ALL OUT maar controlled. NOTEER tijd + gemiddelde HR.' }),
        we('w1-2', exercises.run_walk, 2, { sets: 1, duration_seconds: 1080, notes: '18 min: 2 min run / 1 min walk. Tempo 5:30-6:00/km. EASY.' }),
        we('w1-2', exercises.skierg, 3, { sets: 1, distance_meters: 1000, notes: '1000m for time. NOTEER tijd + /500m splits.' }),
        we('w1-2', exercises.rowerg, 4, { sets: 1, distance_meters: 1000, notes: '1000m for time. NOTEER tijd + /500m splits.' }),
        we('w1-2', exercises.wall_balls, 5, { sets: 1, reps: '50', notes: '50 reps for time. NOTEER tijd + set-breaks (bijv. 20-15-10-5).' }),
      ],
    },
    // ── WO: Upper Kracht ──
    {
      id: 'w1-3', program_id: 'p1', week_number: 1, day_number: 3,
      name: 'Upper Kracht', focus: 'Bench/OHP + Pull',
      notes: 'Eerste echte training dag. Vind je startgewichten.',
      workout_exercises: [
        we('w1-3', exercises.bench_press, 1, { sets: 4, reps: '6', target_weight_kg: 60, rest_seconds: 150, notes: 'RPE 7 (3 reps in de tank). Tempo: controlled omlaag, explosief omhoog.' }),
        we('w1-3', exercises.ohp, 2, { sets: 3, reps: '8', target_weight_kg: 30, rest_seconds: 120, notes: 'RPE 7.' }),
        we('w1-3', exercises.barbell_row, 3, { sets: 4, reps: '8', target_weight_kg: 50, rest_seconds: 90, notes: 'Strict form: borst naar bar, squeeze bovenaan.' }),
        we('w1-3', exercises.pullups, 4, { sets: 4, reps: 'Max', rest_seconds: 120, notes: 'Bodyweight. Noteer elke set.' }),
        we('w1-3', exercises.db_lateral_raise, 5, { sets: 3, reps: '15', target_weight_kg: 7.5, rest_seconds: 60 }),
        we('w1-3', exercises.face_pulls, 6, { sets: 3, reps: '15', target_weight_kg: 17.5, rest_seconds: 60 }),
        we('w1-3', exercises.ez_curl, 7, { sets: 3, reps: '10', target_weight_kg: 12.5, rest_seconds: 60 }),
        we('w1-3', exercises.tricep_dips, 8, { sets: 3, reps: '10', rest_seconds: 60, notes: 'Bodyweight (of assisted als nodig).' }),
        we('w1-3', exercises.ab_wheel, 9, { sets: 3, reps: '8', rest_seconds: 60, notes: 'Vanuit knieen. Zo ver mogelijk.' }),
        we('w1-3', exercises.pallof_press, 10, { sets: 3, reps: '10/side', rest_seconds: 45 }),
      ],
    },
    // ── DO: Run + Power Stations (Baseline Tests) ──
    {
      id: 'w1-4', program_id: 'p1', week_number: 1, day_number: 4,
      name: 'Run + Power Stations', focus: 'Baseline Tests',
      notes: 'Test alle power stations. Film sled pull voor techniek check.',
      workout_exercises: [
        we('w1-4', exercises.run_walk, 1, { sets: 1, duration_seconds: 1080, notes: '18 min: 2 min run / 1 min walk @ easy effort.' }),
        we('w1-4', exercises.sled_pull, 2, { sets: 1, distance_meters: 50, notes: '50m for time — FILM JEZELF. Hand-over-hand techniek. NOTEER tijd.' }),
        we('w1-4', exercises.sled_push, 3, { sets: 1, distance_meters: 50, notes: '50m for time. Lage positie, korte stappen, constant duwen. NOTEER tijd.' }),
        we('w1-4', exercises.farmers_carry, 4, { sets: 1, distance_meters: 100, notes: '2×24kg, 100m for time. NOTEER: moest je neerzetten? (ja/nee + waar)' }),
        we('w1-4', exercises.burpee_broad, 5, { sets: 1, distance_meters: 40, notes: '40m for time. NOTEER tijd.' }),
      ],
    },
    // ── VR: Lower Hypertrofie + Mini Sim ──
    {
      id: 'w1-5', program_id: 'p1', week_number: 1, day_number: 5,
      name: 'Lower Hypertrofie + Mini Sim', focus: 'Deadlift + Hyrox Flow',
      notes: 'Eerste lower volume dag. Lichtere gewichten, meer reps.',
      workout_exercises: [
        we('w1-5', exercises.deadlift, 1, { sets: 4, reps: '5', target_weight_kg: 101, rest_seconds: 150, notes: '75% 1RM (pas aan na dinsdag 5RM test).' }),
        we('w1-5', exercises.front_squat, 2, { sets: 3, reps: '8', target_weight_kg: 60, rest_seconds: 120, notes: '55-60% squat 1RM.' }),
        we('w1-5', exercises.hip_thrust, 3, { sets: 3, reps: '12', rest_seconds: 90, notes: 'Start 60-80kg, zoek RPE 7-8.' }),
        we('w1-5', exercises.leg_curl, 4, { sets: 3, reps: '12', rest_seconds: 60, notes: 'RPE 8.' }),
        we('w1-5', exercises.rowerg, 5, { sets: 1, distance_meters: 500, notes: 'Mini Hyrox Circuit — matig tempo. Dit gaat om flow, niet snelheid.' }),
        we('w1-5', exercises.wall_balls, 6, { sets: 1, reps: '15', notes: 'Mini circuit deel 2.' }),
        we('w1-5', exercises.skierg, 7, { sets: 1, distance_meters: 250, notes: 'Mini circuit deel 3. Rust 2 min na circuit.' }),
        we('w1-5', exercises.towel_hang, 8, { sets: 3, reps: 'Max hold', rest_seconds: 60 }),
        we('w1-5', exercises.plate_pinch, 9, { sets: 3, duration_seconds: 15, rest_seconds: 45, notes: '2×5kg plates glad tegen elkaar, pinch grip.' }),
      ],
    },
    // ── ZA/ZO: Easy Run (Zone 2) ──
    {
      id: 'w1-6', program_id: 'p1', week_number: 1, day_number: 6,
      name: 'Easy Run', focus: 'Zone 2',
      notes: 'ZONE 2 = onder 145 bpm. Dit voelt belachelijk langzaam. Dat is precies goed.',
      workout_exercises: [
        we('w1-6', exercises.run_walk, 1, { sets: 1, duration_seconds: 1200, notes: '20 min: 2 min run / 1 min walk. Tempo IRRELEVANT — alleen HR telt. Onder 145 bpm. Praat-test: als je niet kunt praten in hele zinnen, ga je te hard.' }),
        we('w1-6', exercises.running, 2, { sets: 1, duration_seconds: 300, notes: 'Cool-down walk 5 min.' }),
      ],
    },
  ]
}

// ── WEEK 2: STRUCTUUR LEREN ─────────────────────────────────
function week2(): Workout[] {
  return [
    // ── MA: Lower Kracht ──
    {
      id: 'w2-1', program_id: 'p1', week_number: 2, day_number: 1,
      name: 'Lower Kracht', focus: 'Squat + RDL + Grip + Burpees',
      notes: 'Eerste echte lower kracht sessie. Gebruik 5RM van week 1 om gewichten te bepalen.',
      workout_exercises: [
        we('w2-1', exercises.back_squat, 1, { sets: 4, reps: '5', target_weight_kg: 79, rest_seconds: 150, tempo: '3-1-1', notes: '75% — 3s omlaag, 1s pauze onderaan, 1s omhoog.' }),
        we('w2-1', exercises.rdl, 2, { sets: 3, reps: '8', target_weight_kg: 81, rest_seconds: 120, notes: '60% DL. Stijve benen, heupscharnier, voel de hamstrings.' }),
        we('w2-1', exercises.bulgarian, 3, { sets: 3, reps: '10/kant', rest_seconds: 60, notes: 'Bodyweight of lichte DBs (10-12.5kg).' }),
        we('w2-1', exercises.sandbag_lunges, 4, { sets: 3, reps: '16', rest_seconds: 90, notes: '8/kant. Hyrox gewicht (20kg). SNELLE korte stappen, niet te diep. Tel stappen.' }),
        we('w2-1', exercises.dead_hang, 5, { sets: 3, reps: 'Max hold', rest_seconds: 60, notes: 'Probeer langer dan week 1 test. Noteer.' }),
        we('w2-1', exercises.farmers_hold, 6, { sets: 3, duration_seconds: 30, rest_seconds: 60, notes: '2×24kg of zwaarder. Sta stil, squeeze hard, adem door.' }),
        we('w2-1', exercises.plate_pinch, 7, { sets: 3, duration_seconds: 20, rest_seconds: 45 }),
        we('w2-1', exercises.burpee_broad, 8, { sets: 5, reps: '3', rest_seconds: 45, notes: 'FRIS. Techniek: chest to ground, explosieve hip snap, spring ver.' }),
      ],
    },
    // ── DI: Run + Cardio Stations ──
    {
      id: 'w2-2', program_id: 'p1', week_number: 2, day_number: 2,
      name: 'Run + Cardio Stations', focus: 'Aerobic Base + Station Techniek',
      notes: null,
      workout_exercises: [
        we('w2-2', exercises.run_walk, 1, { sets: 1, duration_seconds: 1200, notes: '20 min: 2 min run / 1 min walk @ 5:30-6:00/km. Ontspannen lopen.' }),
        we('w2-2', exercises.skierg, 2, { sets: 3, duration_seconds: 180, rest_seconds: 90, notes: 'Focus: heupscharnier, handen trekken naar heupen, lange halen. Noteer gem. /500m.' }),
        we('w2-2', exercises.rowerg, 3, { sets: 3, duration_seconds: 180, rest_seconds: 90, notes: 'Focus: drive met benen EERST, dan lean back, dan armen. Tempo ~2:10/500m.' }),
        we('w2-2', exercises.wall_balls, 4, { sets: 5, reps: '12', rest_seconds: 45, notes: '6kg bal, 3m target. Kwart squat (NIET volle squat). Ritme > kracht. Tel terug.' }),
        we('w2-2', exercises.sled_pull, 5, { sets: 4, reps: '1', rest_seconds: 90, notes: 'Licht gewicht. Hand-over-hand. FILM JEZELF. Focus: zit laag, handen snel. Geen tijdsdruk — techniek werk.' }),
      ],
    },
    // ── WO: Upper Kracht ──
    {
      id: 'w2-3', program_id: 'p1', week_number: 2, day_number: 3,
      name: 'Upper Kracht', focus: 'Bench/OHP + Pull',
      notes: null,
      workout_exercises: [
        we('w2-3', exercises.bench_press, 1, { sets: 4, reps: '6', target_weight_kg: 60, rest_seconds: 150, notes: 'Zelfde als wk 1. Doel: 4×6 schoon. Als wk 1 makkelijk: ga naar 62.5kg.' }),
        we('w2-3', exercises.ohp, 2, { sets: 3, reps: '8', target_weight_kg: 30, rest_seconds: 120, notes: 'Als wk 1 RPE <7: verhoog naar 32.5kg.' }),
        we('w2-3', exercises.barbell_row, 3, { sets: 4, reps: '8', target_weight_kg: 50, rest_seconds: 90, notes: 'Vast werkgewicht, geen pyramide.' }),
        we('w2-3', exercises.pullups, 4, { sets: 4, reps: 'Max', rest_seconds: 120, notes: 'Doel: minimaal zelfde totaal als wk 1 (9), liefst +1-2 reps.' }),
        we('w2-3', exercises.db_lateral_raise, 5, { sets: 3, reps: '15', target_weight_kg: 7.5, rest_seconds: 60 }),
        we('w2-3', exercises.face_pulls, 6, { sets: 3, reps: '15', target_weight_kg: 17.5, rest_seconds: 60 }),
        we('w2-3', exercises.ez_curl, 7, { sets: 3, reps: '10', target_weight_kg: 12.5, rest_seconds: 60 }),
        we('w2-3', exercises.skull_crusher, 8, { sets: 3, reps: '10', rest_seconds: 60, notes: 'Zoek RPE 7-8.' }),
        we('w2-3', exercises.ab_wheel, 9, { sets: 3, reps: '8', rest_seconds: 60 }),
        we('w2-3', exercises.hanging_knee, 10, { sets: 3, reps: '8', rest_seconds: 60, notes: 'Controlled, geen swing.' }),
      ],
    },
    // ── DO: Run + Power Stations ──
    {
      id: 'w2-4', program_id: 'p1', week_number: 2, day_number: 4,
      name: 'Run + Power Stations', focus: 'Sled + Carry + Burpees',
      notes: null,
      workout_exercises: [
        we('w2-4', exercises.run_walk, 1, { sets: 1, duration_seconds: 1200, notes: '20 min (2:1 ratio). Andere route dan dinsdag als mogelijk.' }),
        we('w2-4', exercises.sled_push, 2, { sets: 4, distance_meters: 20, rest_seconds: 90, notes: 'Lage positie, korte stappen. Begin licht, bouw op per set.' }),
        we('w2-4', exercises.sled_pull, 3, { sets: 5, distance_meters: 20, rest_seconds: 90, notes: 'Hand-over-hand, focus RITME niet kracht. Licht tot middel.' }),
        we('w2-4', exercises.farmers_carry, 4, { sets: 3, distance_meters: 30, rest_seconds: 60, notes: '2×24kg. Snelle stappen, rechtop, ogen vooruit.' }),
        we('w2-4', exercises.burpee_broad, 5, { sets: 4, reps: '3', rest_seconds: 45, notes: 'Herhaal techniek cues van maandag.' }),
      ],
    },
    // ── VR: Lower Hypertrofie + Mini Sim ──
    {
      id: 'w2-5', program_id: 'p1', week_number: 2, day_number: 5,
      name: 'Lower Hypertrofie + Mini Sim', focus: 'Deadlift + Hyrox Circuit',
      notes: null,
      workout_exercises: [
        we('w2-5', exercises.deadlift, 1, { sets: 4, reps: '5', target_weight_kg: 101, rest_seconds: 150, notes: '75% 1RM.' }),
        we('w2-5', exercises.front_squat, 2, { sets: 3, reps: '8', target_weight_kg: 63, rest_seconds: 120, notes: '60% squat.' }),
        we('w2-5', exercises.hip_thrust, 3, { sets: 3, reps: '12', rest_seconds: 90, notes: 'Zelfde of +5kg vs wk 1.' }),
        we('w2-5', exercises.walking_lunges, 4, { sets: 3, reps: '12/kant', rest_seconds: 60, notes: 'Met 10-15kg DBs.' }),
        we('w2-5', exercises.rowerg, 5, { sets: 1, distance_meters: 500, notes: 'Hyrox Mini Circuit — doorstroming, niet max effort.' }),
        we('w2-5', exercises.wall_balls, 6, { sets: 1, reps: '15' }),
        we('w2-5', exercises.skierg, 7, { sets: 1, distance_meters: 250 }),
        we('w2-5', exercises.burpee_broad, 8, { sets: 1, reps: '5' }),
        we('w2-5', exercises.sled_push, 9, { sets: 1, distance_meters: 20 }),
        we('w2-5', exercises.sled_pull, 10, { sets: 1, distance_meters: 20 }),
        we('w2-5', exercises.towel_hang, 11, { sets: 3, reps: 'Max hold', rest_seconds: 60 }),
        we('w2-5', exercises.barbell_hold, 12, { sets: 3, duration_seconds: 20, rest_seconds: 45, notes: '80-100kg. Double overhand grip. Squeeze.' }),
      ],
    },
    // ── ZA/ZO: Easy Run (Zone 2) ──
    {
      id: 'w2-6', program_id: 'p1', week_number: 2, day_number: 6,
      name: 'Easy Run', focus: 'Zone 2',
      notes: 'ZONE 2: onder 145 bpm. Praat-test. Als je niet kunt praten in hele zinnen = te hard.',
      workout_exercises: [
        we('w2-6', exercises.run_walk, 1, { sets: 1, duration_seconds: 1320, notes: '22 min: 2 min run / 1 min walk. Onder 145 bpm.' }),
        we('w2-6', exercises.running, 2, { sets: 1, duration_seconds: 300, notes: 'Cool-down walk 5 min.' }),
      ],
    },
  ]
}

// ── WEEK 3: GEWICHT VERHOGEN ────────────────────────────────
function week3(): Workout[] {
  return [
    // ── MA: Lower Kracht ──
    {
      id: 'w3-1', program_id: 'p1', week_number: 3, day_number: 1,
      name: 'Lower Kracht', focus: 'Squat + RDL + Grip + Burpees',
      notes: null,
      workout_exercises: [
        we('w3-1', exercises.back_squat, 1, { sets: 4, reps: '5', target_weight_kg: 81, rest_seconds: 150, tempo: '3-1-1', notes: '76-77% — +2kg vs wk 2.' }),
        we('w3-1', exercises.rdl, 2, { sets: 3, reps: '8', target_weight_kg: 84, rest_seconds: 120, notes: '+2.5kg vs wk 2.' }),
        we('w3-1', exercises.bulgarian, 3, { sets: 3, reps: '10/kant', rest_seconds: 60, notes: 'Voeg gewicht toe t.o.v. wk 2.' }),
        we('w3-1', exercises.sandbag_lunges, 4, { sets: 3, reps: '18', rest_seconds: 90, notes: '9/kant. Race weight (20kg), focus snelle stappen.' }),
        we('w3-1', exercises.dead_hang, 5, { sets: 3, reps: 'Max hold', rest_seconds: 60, notes: 'Doel: langer dan wk 2.' }),
        we('w3-1', exercises.farmers_hold, 6, { sets: 3, duration_seconds: 35, rest_seconds: 60, notes: 'Probeer zwaarder dan wk 2.' }),
        we('w3-1', exercises.burpee_broad, 7, { sets: 5, reps: '3', rest_seconds: 45, notes: 'Doe 5 sets van 3 als warm-up.' }),
        we('w3-1', exercises.burpee_broad, 8, { sets: 1, reps: '6', notes: 'TIMING TEST: 6 burpees zo snel mogelijk. Noteer tijd.' }),
      ],
    },
    // ── DI: Run + Cardio Stations ──
    {
      id: 'w3-2', program_id: 'p1', week_number: 3, day_number: 2,
      name: 'Run + Cardio Stations', focus: 'Aerobic Base + Station Progressie',
      notes: null,
      workout_exercises: [
        we('w3-2', exercises.run_walk, 1, { sets: 1, duration_seconds: 1320, notes: '22 min: 2.5 min run / 1 min walk — iets meer run. Tempo 5:30-6:00/km.' }),
        we('w3-2', exercises.skierg, 2, { sets: 3, duration_seconds: 210, rest_seconds: 80, notes: '3.5 min. Probeer rate 26-28 spm consistent. Noteer /500m splits.' }),
        we('w3-2', exercises.rowerg, 3, { sets: 3, duration_seconds: 210, rest_seconds: 80, notes: '3.5 min. Target: 2:10/500m of iets sneller.' }),
        we('w3-2', exercises.wall_balls, 4, { sets: 4, reps: '14', rest_seconds: 40, notes: 'Bouw set grootte langzaam op.' }),
        we('w3-2', exercises.sled_pull, 5, { sets: 5, reps: '1', rest_seconds: 90, notes: 'Toenemend gewicht. Set 1-2 licht, 3-4 middel, 5 race weight. Houd ritme vast.' }),
      ],
    },
    // ── WO: Upper Kracht ──
    {
      id: 'w3-3', program_id: 'p1', week_number: 3, day_number: 3,
      name: 'Upper Kracht', focus: 'Bench/OHP + Pull',
      notes: null,
      workout_exercises: [
        we('w3-3', exercises.bench_press, 1, { sets: 4, reps: '6', target_weight_kg: 62.5, rest_seconds: 150, notes: '+2.5kg vs wk 2 (of 60kg als wk 2 al zwaar was).' }),
        we('w3-3', exercises.ohp, 2, { sets: 3, reps: '8', target_weight_kg: 31, rest_seconds: 120, notes: '+1kg vs wk 2.' }),
        we('w3-3', exercises.barbell_row, 3, { sets: 4, reps: '8', target_weight_kg: 52.5, rest_seconds: 90, notes: '+2.5kg.' }),
        we('w3-3', exercises.pullups, 4, { sets: 4, reps: 'Max', rest_seconds: 120, notes: 'Doel totaal minstens 10 (wk 1 was 9). EXTRA: doe 2-3 singles verspreid door sessie.' }),
        we('w3-3', exercises.db_lateral_raise, 5, { sets: 3, reps: '15', target_weight_kg: 7.5, rest_seconds: 60 }),
        we('w3-3', exercises.face_pulls, 6, { sets: 3, reps: '15', target_weight_kg: 20, rest_seconds: 60 }),
        we('w3-3', exercises.hammer_curl, 7, { sets: 3, reps: '10', rest_seconds: 60, notes: 'Zoek RPE 7-8.' }),
        we('w3-3', exercises.tricep_dips, 8, { sets: 3, reps: '10', rest_seconds: 60 }),
        we('w3-3', exercises.ab_wheel, 9, { sets: 3, reps: '10', rest_seconds: 60, notes: 'Was 3×8 — +2 reps.' }),
        we('w3-3', exercises.pallof_press, 10, { sets: 3, reps: '12/side', rest_seconds: 45, notes: 'Was 3×10 — +2 reps.' }),
      ],
    },
    // ── DO: Run + Power Stations ──
    {
      id: 'w3-4', program_id: 'p1', week_number: 3, day_number: 4,
      name: 'Run + Power Stations', focus: 'Sled + Carry + Burpees',
      notes: null,
      workout_exercises: [
        we('w3-4', exercises.run_walk, 1, { sets: 1, duration_seconds: 1320, notes: '22 min: 2.5 min run / 1 min walk.' }),
        we('w3-4', exercises.sled_push, 2, { sets: 4, distance_meters: 25, rest_seconds: 90, notes: 'Iets zwaarder dan wk 2.' }),
        we('w3-4', exercises.sled_pull, 3, { sets: 5, distance_meters: 25, rest_seconds: 90, notes: 'TIJD ELKE SET. Vergelijk met wk 1 baseline.' }),
        we('w3-4', exercises.farmers_carry, 4, { sets: 3, distance_meters: 40, rest_seconds: 60, notes: 'Zwaarder of langer dan wk 2.' }),
        we('w3-4', exercises.burpee_broad, 5, { sets: 5, reps: '3', rest_seconds: 45, notes: 'Ritme: 3 achter elkaar, doorlopen, 3 achter elkaar.' }),
      ],
    },
    // ── VR: Lower Hypertrofie + Hyrox Circuit ──
    {
      id: 'w3-5', program_id: 'p1', week_number: 3, day_number: 5,
      name: 'Lower Hypertrofie + Hyrox Circuit', focus: 'Deadlift + Groter Circuit',
      notes: null,
      workout_exercises: [
        we('w3-5', exercises.deadlift, 1, { sets: 4, reps: '5', target_weight_kg: 104, rest_seconds: 150, notes: '76-77% (+2.5kg).' }),
        we('w3-5', exercises.front_squat, 2, { sets: 3, reps: '8', target_weight_kg: 65, rest_seconds: 120, notes: '+2.5kg.' }),
        we('w3-5', exercises.hip_thrust, 3, { sets: 3, reps: '12', rest_seconds: 90, notes: 'Verhoog gewicht.' }),
        we('w3-5', exercises.leg_curl, 4, { sets: 3, reps: '12', rest_seconds: 60 }),
        we('w3-5', exercises.run_walk, 5, { sets: 1, distance_meters: 750, notes: 'Hyrox Circuit (GROTER dan wk 1-2). Doorstroming + transitie-snelheid oefenen.' }),
        we('w3-5', exercises.rowerg, 6, { sets: 1, distance_meters: 500 }),
        we('w3-5', exercises.wall_balls, 7, { sets: 1, reps: '20' }),
        we('w3-5', exercises.burpee_broad, 8, { sets: 1, reps: '8' }),
        we('w3-5', exercises.sled_push, 9, { sets: 2, distance_meters: 20 }),
        we('w3-5', exercises.sled_pull, 10, { sets: 2, distance_meters: 20 }),
        we('w3-5', exercises.dead_hang, 11, { sets: 3, reps: 'Max hold', rest_seconds: 60 }),
        we('w3-5', exercises.plate_pinch, 12, { sets: 3, duration_seconds: 20, rest_seconds: 45 }),
      ],
    },
    // ── ZA/ZO: Easy Run (Zone 2) ──
    {
      id: 'w3-6', program_id: 'p1', week_number: 3, day_number: 6,
      name: 'Easy Run', focus: 'Zone 2',
      notes: 'Je bouwt langzaam op. Dit is precies de bedoeling.',
      workout_exercises: [
        we('w3-6', exercises.run_walk, 1, { sets: 1, duration_seconds: 1440, notes: '24 min: 2.5 min run / 1 min walk. ZONE 2: onder 145 bpm.' }),
        we('w3-6', exercises.running, 2, { sets: 1, duration_seconds: 300, notes: 'Cool-down walk 5 min.' }),
      ],
    },
  ]
}

// ── WEEK 4: DELOAD ──────────────────────────────────────────
function week4(): Workout[] {
  return [
    // ── MA: Lower Kracht (Deload) ──
    {
      id: 'w4-1', program_id: 'p1', week_number: 4, day_number: 1,
      name: 'Lower Kracht', focus: 'Deload — Verminderd Volume',
      notes: 'DELOAD WEEK: verminderd volume, behoud gewicht. Herstel en beweeg goed.',
      workout_exercises: [
        we('w4-1', exercises.back_squat, 1, { sets: 3, reps: '3', target_weight_kg: 84, rest_seconds: 150, notes: '80% 1RM — licht voelen, perfecte techniek.' }),
        we('w4-1', exercises.rdl, 2, { sets: 2, reps: '8', target_weight_kg: 87, rest_seconds: 120, notes: '60% DL — ontspannen.' }),
        we('w4-1', exercises.bulgarian, 3, { sets: 2, reps: '10/side', rest_seconds: 90, notes: 'Licht, geen RPE boven 6.' }),
        we('w4-1', exercises.leg_curl, 4, { sets: 3, reps: '12', rest_seconds: 60 }),
        we('w4-1', exercises.dead_hang, 5, { sets: 2, reps: 'Max hold', rest_seconds: 60, notes: 'Houd bij, vergelijk met wk1.' }),
        we('w4-1', exercises.farmers_carry, 6, { sets: 2, duration_seconds: 30, rest_seconds: 60, notes: 'Normaal gewicht, minder sets.' }),
        we('w4-1', exercises.burpee_broad, 7, { sets: 3, reps: '3', rest_seconds: 60, notes: 'Techniek focus, niet hard.' }),
      ],
    },
    // ── DI: Run + Cardio Stations (Deload) ──
    {
      id: 'w4-2', program_id: 'p1', week_number: 4, day_number: 2,
      name: 'Run + Cardio Stations', focus: 'Deload — Easy Tempo',
      notes: 'Alles op 70-75% intensiteit. Beweeg, herstel, niet pushen.',
      workout_exercises: [
        we('w4-2', exercises.run_walk, 1, { sets: 1, duration_seconds: 1200, notes: '20 min: 2 min run / 1 min walk. EASY Zone 2.' }),
        we('w4-2', exercises.skierg, 2, { sets: 2, duration_seconds: 180, rest_seconds: 90, notes: 'Ontspannen, lange halen.' }),
        we('w4-2', exercises.rowerg, 3, { sets: 2, duration_seconds: 180, rest_seconds: 90, notes: 'Licht, techniek.' }),
        we('w4-2', exercises.wall_balls, 4, { sets: 3, reps: '10', rest_seconds: 60, notes: 'Licht ritme, niet uitpuffen.' }),
      ],
    },
    // ── WO: Upper Kracht (Deload) ──
    {
      id: 'w4-3', program_id: 'p1', week_number: 4, day_number: 3,
      name: 'Upper Kracht', focus: 'Deload — Verminderde Sets',
      notes: 'DELOAD: verminderde sets. Geniet van het lichte gevoel.',
      workout_exercises: [
        we('w4-3', exercises.bench_press, 1, { sets: 3, reps: '6', target_weight_kg: 60, rest_seconds: 120, notes: '75% 1RM — makkelijk.' }),
        we('w4-3', exercises.ohp, 2, { sets: 2, reps: '8', rest_seconds: 90, notes: 'RPE 5-6.' }),
        we('w4-3', exercises.barbell_row, 3, { sets: 3, reps: '8', rest_seconds: 90, notes: 'Normaal gewicht.' }),
        we('w4-3', exercises.pullups, 4, { sets: 3, reps: 'Max', rest_seconds: 90, notes: 'Bodyweight, geen gewicht.' }),
        we('w4-3', exercises.db_lateral_raise, 5, { sets: 2, reps: '15', rest_seconds: 60 }),
        we('w4-3', exercises.face_pulls, 6, { sets: 2, reps: '15', rest_seconds: 60 }),
        we('w4-3', exercises.ab_wheel, 7, { sets: 2, reps: '8', rest_seconds: 60 }),
      ],
    },
    // ── DO: Run + Power Stations (Deload) ──
    {
      id: 'w4-4', program_id: 'p1', week_number: 4, day_number: 4,
      name: 'Run + Power Stations', focus: 'Deload — Lichte Stations',
      notes: 'DELOAD: verminderd volume op stations. Beweeg goed, niet pushen.',
      workout_exercises: [
        we('w4-4', exercises.run_walk, 1, { sets: 1, duration_seconds: 1200, notes: '20 min run/walk. Héél makkelijk, zone 2.' }),
        we('w4-4', exercises.sled_push, 2, { sets: 2, distance_meters: 20, rest_seconds: 90, notes: 'Licht gewicht, techniek.' }),
        we('w4-4', exercises.sled_pull, 3, { sets: 2, distance_meters: 20, rest_seconds: 90, notes: 'Licht, hand-over-hand ritme.' }),
        we('w4-4', exercises.farmers_carry, 4, { sets: 2, distance_meters: 30, rest_seconds: 60, notes: 'Normaal gewicht, minder sets.' }),
        we('w4-4', exercises.burpee_broad, 5, { sets: 3, reps: '3', rest_seconds: 45, notes: 'Techniek, niet tempo.' }),
      ],
    },
    // ── VR: Lower Hypertrofie + Mini Sim (Deload) ──
    {
      id: 'w4-5', program_id: 'p1', week_number: 4, day_number: 5,
      name: 'Lower Hypertrofie + Hyrox Circuit', focus: 'Deload — Licht Volume',
      notes: 'DELOAD: verminderd volume. Sled en stations op laag gewicht.',
      workout_exercises: [
        we('w4-5', exercises.deadlift, 1, { sets: 3, reps: '3', target_weight_kg: 108, rest_seconds: 150, notes: '80% 1RM — smooth, geen grinden.' }),
        we('w4-5', exercises.front_squat, 2, { sets: 2, reps: '8', target_weight_kg: 67, rest_seconds: 120, notes: 'Licht.' }),
        we('w4-5', exercises.hip_thrust, 3, { sets: 2, reps: '12', rest_seconds: 90, notes: 'Normaal gewicht, minder sets.' }),
        we('w4-5', exercises.sled_push, 4, { sets: 2, distance_meters: 20, rest_seconds: 60, notes: 'Licht gewicht.' }),
        we('w4-5', exercises.sled_pull, 5, { sets: 2, distance_meters: 20, rest_seconds: 60, notes: 'Licht gewicht.' }),
        we('w4-5', exercises.dead_hang, 6, { sets: 2, reps: 'Max hold', rest_seconds: 60 }),
        we('w4-5', exercises.burpee_broad, 7, { sets: 3, reps: '4', rest_seconds: 60, notes: 'Ritme, niet tempo.' }),
      ],
    },
    // ── ZA/ZO: Easy Run (Zone 2, Deload) ──
    {
      id: 'w4-6', program_id: 'p1', week_number: 4, day_number: 6,
      name: 'Easy Run', focus: 'Zone 2 — Herstel',
      notes: 'Deload run. Lekker bewegen, niet pushen. Klaar voor week 5!',
      workout_exercises: [
        we('w4-6', exercises.run_walk, 1, { sets: 1, duration_seconds: 1200, notes: '20 min: 2 min run / 1 min walk. Héél makkelijk, zone 2.' }),
        we('w4-6', exercises.running, 2, { sets: 1, duration_seconds: 300, notes: 'Cool-down walk 5 min.' }),
      ],
    },
  ]
}

// ═══════════════════════════════════════════════════════════
// WEEKS 5-8: OPBOUWEN
// ═══════════════════════════════════════════════════════════
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

// ═══════════════════════════════════════════════════════════
// WEEKS 9-12: CONSOLIDATIE + TEST
// ═══════════════════════════════════════════════════════════
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

// ═══════════════════════════════════════════════════════════
// EXPORT: All Phase 1 Workouts
// ═══════════════════════════════════════════════════════════
export const phase1Workouts: Workout[] = [
  ...week1(),
  ...week2(),
  ...week3(),
  ...week4(),
  ...weeks5to8(5),
  ...weeks5to8(6),
  ...weeks5to8(7),
  ...weeks5to8(8),  // deload
  ...weeks9to12(9),
  ...weeks9to12(10),
  ...weeks9to12(11),
  ...weeks9to12(12), // test
]
