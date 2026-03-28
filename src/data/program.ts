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
  { id: 'p1', name: 'Phase 1: Foundation',  description: 'Linear strength progression, run/walk buildup, hypertrophy, grip & core. Goal: Squat ~118kg / Deadlift ~152kg / 30 min continuous run.', week_start: 1,  week_end: 12, order_index: 1 },
  { id: 'p2', name: 'Phase 2: Buildup',     description: '5/3/1 strength progression, run volume up, station-specific work under fatigue. Goal: Squat ~130kg / Deadlift ~168kg / 8km TT < 34 min.', week_start: 13, week_end: 20, order_index: 2 },
  { id: 'p3', name: 'Phase 3: Intensity',   description: 'Second peak cycle, race-pace work, first full Hyrox simulation. Goal: Squat ~140kg / Deadlift ~178kg / Sim sub 1:25.', week_start: 21, week_end: 28, order_index: 3 },
  { id: 'p4', name: 'Phase 4: Race Prep',   description: 'Strength maintenance at peak, full Hyrox simulations, race strategy. Goal: Maintain 140/180, sim sub 1:22.', week_start: 29, week_end: 38, order_index: 4 },
  { id: 'p5', name: 'Phase 5: Taper',       description: 'Volume down, nervous system fresh, supercompensation. Race day: Sub 1:20 Hyrox Amsterdam 2027.', week_start: 39, week_end: 42, order_index: 5 },
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
