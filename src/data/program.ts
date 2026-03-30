// 42-week Hybrid Athlete programme — Hyrox Amsterdam 2027
// Barrel file: imports all phases and exports unified API.

import type { Program, Workout } from '@/hooks/useProgram'
import { exercises } from './exercises'
import { phase1Workouts } from './phase1-foundation'
import { phase2Workouts } from './phase2-buildup'
import { phase3Workouts } from './phase3-intensity'
import { phase4Workouts } from './phase4-raceprep'
import { phase5Workouts } from './phase5-taper'

// ── Programs (5 phases) ──────────────────────────────
export const programs: Program[] = [
  { id: 'p1', name: 'Fase 1: Fundament',    description: 'Lineaire krachtopbouw, run/walk → continu, hypertrofie, grip & burpee techniek. Doel: Squat ~118kg / Deadlift ~152kg / 30 min pijnvrij lopen.', week_start: 1,  week_end: 12, order_index: 1 },
  { id: 'p2', name: 'Fase 2: Opbouw',       description: '5/3/1 kracht, intervals, station-werk onder vermoeidheid, 1e kracht peak (wk 20). Doel: Squat ~130kg / Deadlift ~168kg / 8km TT sub 34 min.', week_start: 13, week_end: 20, order_index: 2 },
  { id: 'p3', name: 'Fase 3: Intensiteit',  description: '2e kracht peak = GROTE TEST (wk 28), volledige sims, race-pace runs. Doel: Squat 140+ / Deadlift 180+ / Sim sub 1:25.', week_start: 21, week_end: 28, order_index: 3 },
  { id: 'p4', name: 'Fase 4: Race Prep',    description: 'Kracht ONDERHOUD (PRs in pocket), volledige sims sub 1:22, race-strategie, mentale hardheid. Doel: sim sub 1:20 (wk 37).', week_start: 29, week_end: 38, order_index: 4 },
  { id: 'p5', name: 'Fase 5: Taper',        description: 'Volume -40-60%, kracht behouden, fris en scherp. Race: Hyrox Amsterdam 2027 — Sub 1:20.', week_start: 39, week_end: 42, order_index: 5 },
]

// ── All workouts (210 total) ─────────────────────────
export const allWorkouts: Workout[] = [
  ...phase1Workouts,
  ...phase2Workouts,
  ...phase3Workouts,
  ...phase4Workouts,
  ...phase5Workouts,
]

// ── Re-export exercises ──────────────────────────────
export const allExercises = exercises

// ── Lookup maps ──────────────────────────────────────
const _byWeek = new Map<number, Workout[]>()
const _byId = new Map<string, Workout>()
const _byWeekDay = new Map<string, Workout>()

for (const w of allWorkouts) {
  // By week
  if (!_byWeek.has(w.week_number)) _byWeek.set(w.week_number, [])
  _byWeek.get(w.week_number)!.push(w)
  // By id
  _byId.set(w.id, w)
  // By week-day
  _byWeekDay.set(`${w.week_number}-${w.day_number}`, w)
}

export function getWorkoutsByWeek(week: number): Workout[] {
  return _byWeek.get(week) || []
}

export function getWorkoutById(id: string): Workout | null {
  return _byId.get(id) || null
}

export function getWorkoutByWeekDay(week: number, day: number): Workout | null {
  return _byWeekDay.get(`${week}-${day}`) || null
}
