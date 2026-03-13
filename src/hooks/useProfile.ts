import { useEffect, useState } from 'react'

export interface Profile {
  id: string
  email: string
  display_name: string | null
  program_start_date: string | null
  created_at: string
  updated_at: string
}

const PROFILE_KEY = 'hyrox_profile'

const DEFAULT_PROFILE: Profile = {
  id: 'local-user',
  email: 'Wegener.max@gmail.com',
  display_name: 'Max',
  program_start_date: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem(PROFILE_KEY)
    if (stored) {
      setProfile(JSON.parse(stored))
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
