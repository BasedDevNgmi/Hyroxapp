import { useState, useEffect, useCallback } from 'react'
import type { Workout } from '@/hooks/useProgram'
import type { WorkoutLog } from '@/hooks/useWorkoutLog'

const AI_ENABLED_KEY = 'hyrox_ai_enabled'
const AI_CACHE_KEY = 'hyrox_ai_workouts'
const HEALTH_DATA_KEY = 'hyrox_health_data'

interface AIWorkoutCache {
  [workoutKey: string]: {
    workout: Workout
    generated_at: string
  }
}

function getAICache(): AIWorkoutCache {
  try {
    const raw = localStorage.getItem(AI_CACHE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function setAICache(cache: AIWorkoutCache) {
  localStorage.setItem(AI_CACHE_KEY, JSON.stringify(cache))
}

/** Get a cached AI workout by its workout ID */
export function getAIWorkoutById(workoutId: string): Workout | null {
  const cache = getAICache()
  for (const entry of Object.values(cache)) {
    if (entry.workout.id === workoutId) return entry.workout
  }
  return null
}

export function useAIWorkout(weekNumber: number, dayNumber: number) {
  const [aiWorkout, setAiWorkout] = useState<Workout | null>(null)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isAIEnabled, setIsAIEnabled] = useState(() => localStorage.getItem(AI_ENABLED_KEY) === 'true')

  const cacheKey = `w${weekNumber}-d${dayNumber}`

  // Load cached workout on mount
  useEffect(() => {
    const cache = getAICache()
    const entry = cache[cacheKey]
    if (entry) {
      // Check if generated today (within 24h)
      const generatedAt = new Date(entry.generated_at)
      const hoursSince = (Date.now() - generatedAt.getTime()) / (1000 * 60 * 60)
      if (hoursSince < 24) {
        setAiWorkout(entry.workout)
      }
    }
  }, [cacheKey])

  const generate = useCallback(async (
    staticWorkout: Workout | null,
    recentLogs: WorkoutLog[],
  ) => {
    setGenerating(true)
    setError(null)

    try {
      // Dynamic imports to avoid bundling in main chunk
      const { buildWorkoutPrompt } = await import('@/lib/workout-prompt')
      const { validateAndHydrate } = await import('@/lib/workout-schema')

      // Get profile from localStorage
      const profileRaw = localStorage.getItem('hyrox_profile')
      const profile = profileRaw ? JSON.parse(profileRaw) : null
      if (!profile) throw new Error('No profile found')

      // Get health data
      const healthRaw = localStorage.getItem(HEALTH_DATA_KEY)
      const healthData = healthRaw ? JSON.parse(healthRaw) : null

      const { system, user } = buildWorkoutPrompt({
        profile,
        weekNumber,
        dayNumber,
        recentLogs,
        healthData,
        staticWorkout,
      })

      const response = await fetch('/api/generate-workout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ system, user }),
      })

      if (!response.ok) {
        const err = await response.json().catch(() => ({ error: `HTTP ${response.status}` }))
        throw new Error(err.error || `API error: ${response.status}`)
      }

      const raw = await response.json()
      const result = validateAndHydrate(raw, weekNumber, dayNumber)

      if (result.error || !result.workout) {
        throw new Error(`Validation: ${result.error}`)
      }

      const generatedWorkout = result.workout

      // Cache the workout
      const cache = getAICache()
      cache[cacheKey] = {
        workout: generatedWorkout,
        generated_at: new Date().toISOString(),
      }
      setAICache(cache)

      setAiWorkout(generatedWorkout)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setGenerating(false)
    }
  }, [weekNumber, dayNumber, cacheKey])

  const toggleAI = useCallback(() => {
    const next = !isAIEnabled
    localStorage.setItem(AI_ENABLED_KEY, String(next))
    setIsAIEnabled(next)
  }, [isAIEnabled])

  return { aiWorkout, generating, error, generate, isAIEnabled, toggleAI }
}
