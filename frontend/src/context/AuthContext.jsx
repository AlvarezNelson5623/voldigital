import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('vd_token')
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      api.get('/auth/me')
        .then(res => setUser(res.data))
        .catch(() => { localStorage.removeItem('vd_token'); delete api.defaults.headers.common['Authorization'] })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password })
    const { token, role, profileId, name } = res.data
    localStorage.setItem('vd_token', token)
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    const meRes = await api.get('/auth/me')
    setUser(meRes.data)
    return meRes.data
  }

  const logout = () => {
    localStorage.removeItem('vd_token')
    delete api.defaults.headers.common['Authorization']
    setUser(null)
  }

  const refreshUser = async () => {
    const res = await api.get('/auth/me')
    setUser(res.data)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
