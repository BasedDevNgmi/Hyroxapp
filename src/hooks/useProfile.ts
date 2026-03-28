import { useEffect, useState } from 'react'

export interface Profile {
  id: string
  email: string
  display_name: string | null
  program_start_date: string | null
  squat_1rm: number | null
  deadlift_1rm: number | null
  bench_1rm: number | null
  ohp_1rm: number | null
  created_at: string
  updated_at: string
}

const PROFILE_KEY = 'hyrox_profile'

const DEFAULT_PROFILE: Profile = {
  id: 'local-user',
  email: 'Wegener.max@gmail.com',
  display_name: 'Max',
  program_start_date: null,
  squat_1rm: 105,
  deadlift_1rm: 135,
  bench_1rm: null,
  ohp_1rm: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem(PROFILE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      // Migrate old profiles that don't have 1RM fields
      if (parsed.squat_1rm === undefined) parsed.squat_1rm = 105
      if (parsed.deadlift_1rm === undefined) parsed.deadlift_1rm = 135
      if (parsed.bench_1rm === undefined) parsed.bench_1rm = null
      if (parsed.ohp_1rm === undefined) parsed.ohp_1rm = null
      setProfile(parsed)
    } else {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(DEFAULT_PROFILE))
      setProfile(DEFAULT_PROFILE)
    }
    setLoading(false)
  }, [])

  const updateProfile = async (updates: Partial<Profile>) => {
    const updated = { ...profile!, ...updates, updated_at: new Date().toISOString() }
    localStorage.setItem(PROFILE_KEY, JSON.stringify(updated))
    setProfile(updated)
    return { error: null }
  }

  return { profile, loading, updateProfile }
}
