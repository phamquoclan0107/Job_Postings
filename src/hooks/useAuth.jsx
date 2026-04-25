// src/hooks/useAuth.js
import { createContext, useContext, useState, useCallback } from 'react'
import { authService } from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(() => authService.getAdmin())

  const login = useCallback(async (username, password) => {
    const info = await authService.login(username, password)
    setAdmin(info)
    return info
  }, [])

  const logout = useCallback(() => {
    authService.logout()
    setAdmin(null)
  }, [])

  const isLoggedIn = !!admin

  return (
    <AuthContext.Provider value={{ admin, login, logout, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
