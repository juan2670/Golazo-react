import { Navigate, Outlet } from 'react-router-dom'

import { useAuth } from '../context/AuthContext'

function ProtectedRoute() {
  const { autenticado, loading } = useAuth()

  if (loading) {
    return (
      <section>
        <p>Cargando...</p>
      </section>
    )
  }

  if (!autenticado) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export default ProtectedRoute