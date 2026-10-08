import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'

import { useNavigate } from 'react-router-dom'

import { api } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const navigate = useNavigate()

  const [usuario, setUsuario] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cargarUsuario = async () => {
      const token = localStorage.getItem('golazo_token')

      if (!token) {
        setLoading(false)
        return
      }

      try {
        const data = await api.get('/usuarios/me')

        setUsuario(data)
      } catch {
        localStorage.removeItem('golazo_token')
        setUsuario(null)
      } finally {
        setLoading(false)
      }
    }

    cargarUsuario()
  }, [])

  const login = async (accessToken) => {
    localStorage.setItem('golazo_token', accessToken)

    try {
      const data = await api.get('/usuarios/me')

      setUsuario(data)

      return data
    } catch (error) {
      localStorage.removeItem('golazo_token')
      setUsuario(null)

      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem('golazo_token')
    setUsuario(null)

    navigate('/login')
  }

  return (
    <AuthContext.Provider
      value={{
        usuario,
        autenticado: !!usuario,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}