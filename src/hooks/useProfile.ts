import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth'
export interface Profile {
  id: string
  email: string
  display_name: string | null
  program_start_date: string | null
  created_at: string
  updated_at: string
}

export function useProfile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    const fetch = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      setProfile(data)
      setLoading(false)
    }
    fetch()
  }, [user])

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single()

    if (!error && data) {
      setProfile(data)
    }
    return { error }
  }

  return { profile, loading, updateProfile }
}
