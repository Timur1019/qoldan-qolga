import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authApi } from '../api/client'

const STORAGE_KEY = 'token'

function getStorage(remember) {
  return remember ? localStorage : sessionStorage
}

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const setAuth = useCallback((token, userData, rememberMe = true) => {
    localStorage.removeItem(STORAGE_KEY)
    sessionStorage.removeItem(STORAGE_KEY)
    if (token) {
      getStorage(rememberMe).setItem(STORAGE_KEY, token)
      setUser(userData)
    } else {
      setUser(null)
    }
  }, [])

  const logout = useCallback(() => {
    setAuth(null)
  }, [setAuth])

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY)
    if (!token) {
      setLoading(false)
      return
    }
    try {
      const data = await authApi.me()
      setUser(data)
    } catch {
      localStorage.removeItem(STORAGE_KEY)
      sessionStorage.removeItem(STORAGE_KEY)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadUser()
  }, [loadUser])

  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY)
    if (!token) return
    try {
      const data = await authApi.me()
      setUser(data)
      return data
    } catch {
      setUser(null)
    }
  }, [])

  const value = {
    user,
    loading,
    setAuth,
    logout,
    refreshUser,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN',
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
