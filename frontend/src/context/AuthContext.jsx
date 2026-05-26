// context/AuthContext.jsx
// Auth dihapus — langsung dashboard tanpa login
import { createContext, useContext } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  // Guest user; tidak ada login
  const user = { id: 'guest', name: 'Kamu' }
  const logout = () => {}

  return (
    <AuthContext.Provider value={{ user, loading: false, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth harus di dalam AuthProvider')
  return ctx
}
