import { exercises } from '@/data/exercises'
import type { Profile } from '@/hooks/useProfile'
import type { Workout } from '@/hooks/useProgram'
import type { WorkoutLog } from '@/hooks/useWorkoutLog'

export interface HealthMetrics {
  sleep_hours: number | null
  hrv_sdnn: number | null
  resting_hr: number | null
  active_calories: number | null
  date: string
}

function getPhaseNameForWeek(week: number): string {
  if (week <= 12) return 'Foundation (Fundament)'
  if (week <= 20) return 'Buildup (Opbouw)'
  if (week <= 28) return 'Intensity (Intensiteit)'
  if (week <= 38) return 'Race Prep'
  return 'Taper'
}

function getPhaseGoals(week: number): string {
  if (week <= 12) return 'Linear strength progression, run/walk → continuous, hypertrophy, grip endurance, burpee technique. Squat goal ~118kg, Deadlift ~152kg, 30 min continuous pain-free running.'
  if (week <= 20) return '5/3/1 strength, intervals, station work under fatigue. Squat ~130kg, Deadlift ~168kg, 8km TT sub 34 min.'
  if (week <= 28) return '2nd strength peak, full sims, race-pace runs. Squat 140+, Deadlift 180+, Sim sub 1:25.'
  if (week <= 38) return 'Strength maintenance, full sims sub 1:22, race strategy, mental toughness. Sim sub 1:20.'
  return 'Volume -40-60%, maintain strength, fresh and sharp for race day.'
}

const DAY_FOCUS: Record<number, string> = {
  1: 'Lower Kracht (strength)',
  2: 'Run + Cardio Stations',
  3: 'Upper Kracht (strength)',
  4: 'Run + Power Stations',
  5: 'Lower Hypertrofie + Hyrox Circuit',
  6: 'Easy Run or Hyrox Simulation',
}

function buildExerciseKeyList(): string {
  const byCategory = new Map<string, string[]>()
  for (const [key, ex] of Object.entries(exercises)) {
    const cat = ex.category
    if (!byCategory.has(cat)) byCategory.set(cat, [])
    byCategory.get(cat)!.push(`${key} (${ex.log.type})`)
  }
  const lines: string[] = []
  for (const [cat, keys] of byCategory) {
    lines.push(`  ${cat}: ${keys.join(', ')}`)
  }
  return lines.join('\n')
}

function summarizeLogs(logs: WorkoutLog[]): string {
  if (logs.length === 0) return 'No recent training data available.'
  return logs.slice(0, 7).map(l => {
    const parts = [`${l.completed_at.slice(0, 10)}`]
    if (l.duration_minutes) parts.push(`${l.duration_minutes}min`)
    if (l.overall_rpe) parts.push(`RPE ${l.overall_rpe}`)
    if (l.knee_pain_level && l.knee_pain_level > 0) parts.push(`knee pain ${l.knee_pain_level}/10`)
    if (l.notes) parts.push(l.notes)
    return `- ${parts.join(' | ')}`
  }).join('\n')
}

function summarizeHealth(health: HealthMetrics[] | null): string {
  if (!health || health.length === 0) return 'No recovery data available.'
  return health.slice(0, 3).map(h => {
    const parts = [h.date]
    if (h.sleep_hours != null) parts.push(`Sleep: ${h.sleep_hours}h`)
    if (h.hrv_sdnn != null) parts.push(`HRV: ${h.hrv_sdnn}ms`)
    if (h.resting_hr != null) parts.push(`RHR: ${h.resting_hr}bpm`)
    if (h.active_calories != null) parts.push(`Active cal: ${h.active_calories}`)
    return `- ${parts.join(' | ')}`
  }).join('\n')
}

function summarizeStaticWorkout(wo: Workout | null): string {
  if (!wo) return 'No static workout available for this slot.'
  const exLines = wo.workout_exercises.map(we => {
    const parts = [`${we.exercise.name}: ${we.sets}×${we.reps || `${we.duration_seconds}s`}`]
    if (we.target_weight_kg) parts.push(`@${we.target_weight_kg}kg`)
    if (we.distance_meters) parts.push(`${we.distance_meters}m`)
    if (we.rest_seconds) parts.push(`rest ${we.rest_seconds}s`)
    return `  - ${parts.join(' ')}`
  })
  return `Static reference: "${wo.name}" (${wo.focus})\n${exLines.join('\n')}`
}

export function buildWorkoutPrompt(context: {
  profile: Profile
  weekNumber: number
  dayNumber: number
  recentLogs: WorkoutLog[]
  healthData: HealthMetrics[] | null
  staticWorkout: Workout | null
}): { system: string; user: string } {
  const { profile, weekNumber, dayNumber, recentLogs, healthData, staticWorkout } = context

  const system = `You are a Hyrox training coach building workouts for a 42-week periodized program targeting sub 1:20 at Hyrox Amsterdam January 2027.

Generate exactly ONE workout for the requested day. Output ONLY valid JSON matching this schema — no markdown, no explanation:
{
  "name": "string",
  "focus": "string or null",
  "notes": "string or null (in Dutch)",
  "workout_exercises": [{
    "exercise_key": "string (must be from the list below)",
    "order_index": number (starting at 1),
    "sets": number,
    "reps": "string or null (e.g. '5', '8/side', 'Max hold', '5RM TEST')",
    "tempo": "string or null (e.g. '3-1-1')",
    "rest_seconds": number or null,
    "duration_seconds": number or null,
    "target_weight_kg": number or null,
    "distance_meters": number or null,
    "notes": "string or null (in Dutch)"
  }]
}

Rules:
- Use ONLY exercise keys from this list. Any other key will be rejected.
- For weight_reps exercises: set target_weight_kg when appropriate
- For time exercises: set duration_seconds, NOT target_weight_kg
- For reps_only exercises: set reps, NOT target_weight_kg or duration_seconds
- For check_only exercises: just set sets and reps as needed
- Notes MUST be in Dutch (the athlete speaks Dutch)
- Include rest_seconds for all strength exercises
- Adjust volume/intensity based on recovery data and recent training load
- If knee pain was reported recently, reduce impact and lower body volume
- Deload weeks (every 4th week) should have -30-40% volume

Available exercises by category:
${buildExerciseKeyList()}`

  const raceDate = new Date('2027-01-01')
  const now = new Date()
  const daysUntilRace = Math.ceil((raceDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

  const user = `Athlete: ${profile.display_name || 'Max'}, age 37, 188cm, 86kg
1RMs: Squat ${profile.squat_1rm ?? '?'}kg, Deadlift ${profile.deadlift_1rm ?? '?'}kg, Bench ${profile.bench_1rm ?? '?'}kg, OHP ${profile.ohp_1rm ?? '?'}kg

Program position: Week ${weekNumber}, Day ${dayNumber} (${DAY_FOCUS[dayNumber] || 'Training'})
Phase: ${getPhaseNameForWeek(weekNumber)}
Phase goals: ${getPhaseGoals(weekNumber)}
Days until race: ${daysUntilRace}
${weekNumber % 4 === 0 ? '⚠️ THIS IS A DELOAD WEEK — reduce volume by 30-40%' : ''}

Recent training (last 7 sessions):
${summarizeLogs(recentLogs)}

Recovery data (last 3 days):
${summarizeHealth(healthData)}

${summarizeStaticWorkout(staticWorkout)}

Generate a personalized workout for today. Use the static workout as a baseline but adapt based on recovery, recent performance, and phase goals.`

  return { system, user }
}
