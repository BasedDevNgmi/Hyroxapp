import { createContext, useContext, type ReactNode } from 'react'

// Mock user for testing without auth
const MOCK_USER = {
  id: 'local-user',
  email: 'Wegener.max@gmail.com',
} as const

interface AuthContextType {
  user: typeof MOCK_USER
  loading: false
}

const AuthContext = createContext<AuthContextType>({
  user: MOCK_USER,
  loading: false,
})

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <AuthContext.Provider value={{ user: MOCK_USER, loading: false }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
