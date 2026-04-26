// src/context/AuthContext.jsx
import { createContext, useState, useCallback } from 'react'
import { authService } from '../services/authService'

export const AuthContext = createContext(null)

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

  // Cập nhật admin info trong context (sau khi update profile)
  const refreshAdmin = useCallback((newInfo) => {
    setAdmin((prev) => ({ ...prev, ...newInfo }))
  }, [])

  const isLoggedIn = !!admin

  return (
    <AuthContext.Provider value={{ admin, login, logout, isLoggedIn, refreshAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}