import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { User, Session } from '@supabase/supabase-js'
import { supabase } from './supabase'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signInWithMagicLink: (email: string) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const ALLOWED_EMAIL = import.meta.env.VITE_ALLOWED_EMAIL

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const checkAllowedEmail = (email: string): Error | null => {
    if (ALLOWED_EMAIL && email.toLowerCase() !== ALLOWED_EMAIL.toLowerCase()) {
      return new Error('This app is private. Access denied.')
    }
    return null
  }

  const signIn = async (email: string, password: string) => {
    const emailError = checkAllowedEmail(email)
    if (emailError) return { error: emailError }

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error: error ? new Error(error.message) : null }
  }

  const signInWithMagicLink = async (email: string) => {
    const emailError = checkAllowedEmail(email)
    if (emailError) return { error: emailError }

    const { error } = await supabase.auth.signInWithOtp({ email })
    return { error: error ? new Error(error.message) : null }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signInWithMagicLink, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
