import { exercises } from './exercises'
import { we } from './helpers'
import type { Workout } from '@/hooks/useProgram'

// ═══════════════════════════════════════════════════════════
// PHASE 4: RACE PREP (Weeks 29-38)
// Kracht: ONDERHOUD. PRs zitten in de pocket. Nu behouden.
// Hyrox: Volledige simulaties op sub-1:20 pace. Race-scherpte.
// Goal: Kracht behouden, sim sub 1:22 (wk 34), sim sub 1:20 (wk 37)
// ═══════════════════════════════════════════════════════════

// Weeks 29-34: Race-Scherpte
function weeks29to34(w: number): Workout[] {
  const sqMaint = [115, 117, 119, 115, 117, 119][w - 29]  // 82-85% of 140
  const dlMaint = [148, 150, 153, 148, 150, 153][w - 29]  // 82-85% of 180
  const isFullSim = w === 31 || w === 34

  return [
    // ── MA: Lower Onderhoud ──
    {
      id: `w${w}-1`, program_id: 'p4', week_number: w, day_number: 1,
      name: 'Lower — Onderhoud', focus: 'Kracht Behouden + Carries + Sled',
      notes: 'Onderhoud — PRs zitten in de pocket. Houd het signaal, verminder het volume.',
      workout_exercises: [
        we(`w${w}-1`, exercises.back_squat, 1, { sets: 3, reps: '3', target_weight_kg: sqMaint, notes: `~${Math.round(sqMaint / 140 * 100)}% 1RM — onderhoud` }),
        we(`w${w}-1`, exercises.deadlift, 2, { sets: 3, reps: '2', target_weight_kg: dlMaint, notes: `~${Math.round(dlMaint / 180 * 100)}% 1RM — onderhoud` }),
        we(`w${w}-1`, exercises.farmers_carry, 3, { sets: 1, distance_meters: 200, notes: 'Ononderbroken race-pace' }),
        we(`w${w}-1`, exercises.sled_push, 4, { sets: 3, notes: 'Full distance, race pace' }),
        we(`w${w}-1`, exercises.sled_pull, 5, { sets: 3, notes: 'Full distance, race pace' }),
      ],
    },
    // ── DI: Hybrid Run + Stations ──
    {
      id: `w${w}-2`, program_id: 'p4', week_number: w, day_number: 2,
      name: 'Race-Pace Run + Stations', focus: 'Race-pace 8-10km + Station Work',
      notes: 'Race-pace run + 2 stations op race-tempo (roteer per week).',
      workout_exercises: [
        we(`w${w}-2`, exercises.running, 1, { sets: 1, distance_meters: 8000, notes: '8-10 km met 6 km @ 4:10/km' }),
        we(`w${w}-2`, exercises.skierg, 2, { sets: 1, distance_meters: 1000, notes: 'TT 1x/week — doel: sub 3:25' }),
        we(`w${w}-2`, exercises.rowerg, 3, { sets: 1, distance_meters: 1000, notes: 'TT 1x/week — doel: sub 3:30' }),
      ],
    },
    // ── WO: Upper Onderhoud ──
    {
      id: `w${w}-3`, program_id: 'p4', week_number: w, day_number: 3,
      name: 'Upper — Onderhoud', focus: 'Bench/OHP/Pull — In en uit, 35 min max',
      notes: 'In en uit, 35 min max.',
      workout_exercises: [
        we(`w${w}-3`, exercises.bench_press, 1, { sets: 3, reps: '3', target_weight_kg: Math.round(140 * 0.83 / 2.5) * 2.5, notes: '~83% — onderhoud' }),
        we(`w${w}-3`, exercises.ohp, 2, { sets: 3, reps: '3', notes: '~80%' }),
        we(`w${w}-3`, exercises.weighted_pullups, 3, { sets: 3, reps: '5' }),
        we(`w${w}-3`, exercises.barbell_row, 4, { sets: 3, reps: '5' }),
      ],
    },
    // ── VR: ALL STATIONS Race Pace ──
    {
      id: `w${w}-5`, program_id: 'p4', week_number: w, day_number: 5,
      name: 'Alle Stations — Race Pace', focus: 'Alle stations op race tempo',
      notes: 'ALL STATIONS RACE PACE SESSION. Noteer alle tijden.',
      workout_exercises: [
        we(`w${w}-5`, exercises.wall_balls, 1, { sets: 1, reps: '100', notes: 'For time — doel: sub 3:45' }),
        we(`w${w}-5`, exercises.burpee_broad, 2, { sets: 1, distance_meters: 80, notes: 'For time — doel: sub 4:45' }),
        we(`w${w}-5`, exercises.farmers_carry, 3, { sets: 1, distance_meters: 200, notes: 'For time — doel: sub 2:00' }),
        we(`w${w}-5`, exercises.walking_lunges, 4, { sets: 1, distance_meters: 100, notes: 'For time — doel: sub 3:30' }),
        we(`w${w}-5`, exercises.sled_push, 5, { sets: 1, distance_meters: 50, notes: 'Full distance — noteer' }),
        we(`w${w}-5`, exercises.sled_pull, 6, { sets: 1, distance_meters: 50, notes: 'Full distance — noteer' }),
      ],
    },
    // ── ZA: Hyrox Sim (full every 3 weeks) ──
    {
      id: `w${w}-6`, program_id: 'p4', week_number: w, day_number: 6,
      name: isFullSim ? 'VOLLEDIGE HYROX SIMULATIE' : 'Halve Sim / Station Focus',
      focus: isFullSim ? (w === 31 ? 'Doel: sub 1:24' : 'Doel: sub 1:22') : '4-station focus of halve sim',
      notes: isFullSim
        ? `VOLLEDIGE SIM — ${w === 31 ? 'doel: sub 1:24' : 'doel: sub 1:22'}. NOTEER ALLE SPLITS — vergelijk met vorige sims.`
        : 'Halve sim of 4-station focus.',
      workout_exercises: isFullSim ? [
        we(`w${w}-6`, exercises.running, 1, { sets: 8, distance_meters: 1000, notes: '8× 1km @ race pace' }),
        we(`w${w}-6`, exercises.skierg, 2, { sets: 1, distance_meters: 1000 }),
        we(`w${w}-6`, exercises.sled_push, 3, { sets: 1, distance_meters: 50 }),
        we(`w${w}-6`, exercises.sled_pull, 4, { sets: 1, distance_meters: 50 }),
        we(`w${w}-6`, exercises.burpee_broad, 5, { sets: 1, distance_meters: 80 }),
        we(`w${w}-6`, exercises.rowerg, 6, { sets: 1, distance_meters: 1000 }),
        we(`w${w}-6`, exercises.farmers_carry, 7, { sets: 1, distance_meters: 200 }),
        we(`w${w}-6`, exercises.walking_lunges, 8, { sets: 1, distance_meters: 100 }),
        we(`w${w}-6`, exercises.wall_balls, 9, { sets: 1, reps: '100' }),
      ] : [
        we(`w${w}-6`, exercises.running, 1, { sets: 4, distance_meters: 1000, notes: '4× 1km + 4 stations' }),
        we(`w${w}-6`, exercises.skierg, 2, { sets: 1, distance_meters: 1000 }),
        we(`w${w}-6`, exercises.rowerg, 3, { sets: 1, distance_meters: 1000 }),
        we(`w${w}-6`, exercises.wall_balls, 4, { sets: 1, reps: '75' }),
        we(`w${w}-6`, exercises.burpee_broad, 5, { sets: 1, distance_meters: 80 }),
      ],
    },
  ]
}

// Weeks 35-38: Final Block
function weeks35to38(w: number): Workout[] {
  const isLastSim = w === 37

  return [
    // ── MA: Lower — Zwaar, laag volume ──
    {
      id: `w${w}-1`, program_id: 'p4', week_number: w, day_number: 1,
      name: 'Lower — Zwaar Signal', focus: 'Squat + DL + Carry — Klaar',
      notes: 'Zwaar, laag volume. Signaal: blijf sterk. Daarna uit de gym.',
      workout_exercises: [
        we(`w${w}-1`, exercises.back_squat, 1, { sets: 3, reps: '2', target_weight_kg: 119, notes: '85% — crisp doubles' }),
        we(`w${w}-1`, exercises.deadlift, 2, { sets: 2, reps: '2', target_weight_kg: 153, notes: '85% — zwaar, laag volume' }),
        we(`w${w}-1`, exercises.farmers_carry, 3, { sets: 1, distance_meters: 200, notes: 'Ononderbroken. Dat is alles. Uit de gym.' }),
      ],
    },
    // ── DI: Tempo Run ──
    {
      id: `w${w}-2`, program_id: 'p4', week_number: w, day_number: 2,
      name: 'Tempo Run', focus: 'Sneller dan race pace',
      notes: 'Sneller dan race pace — race moet makkelijk voelen.',
      workout_exercises: [
        we(`w${w}-2`, exercises.running, 1, { sets: 1, distance_meters: 8000, notes: '8 km met 5 km @ 4:05-4:10/km — sneller dan race pace' }),
      ],
    },
    // ── WO: Upper — Kort ──
    {
      id: `w${w}-3`, program_id: 'p4', week_number: w, day_number: 3,
      name: 'Upper — Onderhoud', focus: 'Bench/OHP/Pull — In en uit, 30 min',
      notes: 'In en uit, 30 min.',
      workout_exercises: [
        we(`w${w}-3`, exercises.bench_press, 1, { sets: 3, reps: '2', target_weight_kg: 119, notes: '85%' }),
        we(`w${w}-3`, exercises.ohp, 2, { sets: 2, reps: '3', notes: '~80%' }),
        we(`w${w}-3`, exercises.weighted_pullups, 3, { sets: 3, reps: '5' }),
        we(`w${w}-3`, exercises.barbell_row, 4, { sets: 3, reps: '5' }),
      ],
    },
    // ── VR: Station Blitz ──
    {
      id: `w${w}-5`, program_id: 'p4', week_number: w, day_number: 5,
      name: 'Station Blitz', focus: 'Alle 8 stations back-to-back, RACE PACE',
      notes: 'Alle 8 stations back-to-back, RACE PACE. Geen runs ertussen — puur station-vermogen. Noteer totaaltijd — doel: sub 35 min.',
      workout_exercises: [
        we(`w${w}-5`, exercises.skierg, 1, { sets: 1, distance_meters: 1000, notes: 'Back-to-back met alle stations' }),
        we(`w${w}-5`, exercises.sled_push, 2, { sets: 1, distance_meters: 50 }),
        we(`w${w}-5`, exercises.sled_pull, 3, { sets: 1, distance_meters: 50 }),
        we(`w${w}-5`, exercises.burpee_broad, 4, { sets: 1, distance_meters: 80 }),
        we(`w${w}-5`, exercises.rowerg, 5, { sets: 1, distance_meters: 1000 }),
        we(`w${w}-5`, exercises.farmers_carry, 6, { sets: 1, distance_meters: 200 }),
        we(`w${w}-5`, exercises.walking_lunges, 7, { sets: 1, distance_meters: 100 }),
        we(`w${w}-5`, exercises.wall_balls, 8, { sets: 1, reps: '100', notes: 'Doel totaal alle stations: sub 35 min' }),
      ],
    },
    // ── ZA: Hyrox Sim ──
    {
      id: `w${w}-6`, program_id: 'p4', week_number: w, day_number: 6,
      name: isLastSim ? 'LAATSTE VOLLEDIGE SIM — DOEL: SUB 1:20' : 'Race-Pace Training',
      focus: isLastSim ? 'Generale Repetitie' : 'Race conditioning',
      notes: isLastSim
        ? 'LAATSTE VOLLEDIGE SIM — DOEL: SUB 1:20. Volledig race-day protocol: voeding, warming-up, pacing. Treat it like race day.'
        : 'Race-pace training.',
      workout_exercises: isLastSim ? [
        we(`w${w}-6`, exercises.running, 1, { sets: 8, distance_meters: 1000, notes: '8× 1km @ race pace — generale repetitie' }),
        we(`w${w}-6`, exercises.skierg, 2, { sets: 1, distance_meters: 1000 }),
        we(`w${w}-6`, exercises.sled_push, 3, { sets: 1, distance_meters: 50 }),
        we(`w${w}-6`, exercises.sled_pull, 4, { sets: 1, distance_meters: 50 }),
        we(`w${w}-6`, exercises.burpee_broad, 5, { sets: 1, distance_meters: 80 }),
        we(`w${w}-6`, exercises.rowerg, 6, { sets: 1, distance_meters: 1000 }),
        we(`w${w}-6`, exercises.farmers_carry, 7, { sets: 1, distance_meters: 200 }),
        we(`w${w}-6`, exercises.walking_lunges, 8, { sets: 1, distance_meters: 100 }),
        we(`w${w}-6`, exercises.wall_balls, 9, { sets: 1, reps: '100' }),
      ] : [
        we(`w${w}-6`, exercises.running, 1, { sets: 4, distance_meters: 1000, notes: '4× 1km + stations' }),
        we(`w${w}-6`, exercises.wall_balls, 2, { sets: 1, reps: '75', notes: 'Race pace' }),
        we(`w${w}-6`, exercises.burpee_broad, 3, { sets: 1, distance_meters: 80, notes: 'Race pace' }),
        we(`w${w}-6`, exercises.farmers_carry, 4, { sets: 1, distance_meters: 200, notes: 'Race pace' }),
      ],
    },
  ]
}

export const phase4Workouts: Workout[] = [
  ...weeks29to34(29),
  ...weeks29to34(30),
  ...weeks29to34(31),
  ...weeks29to34(32),
  ...weeks29to34(33),
  ...weeks29to34(34),
  ...weeks35to38(35),
  ...weeks35to38(36),
  ...weeks35to38(37),
  ...weeks35to38(38),
]
