import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { Spinner } from 'react-bootstrap'

import { useAuth } from '../context/AuthContext'

function ProtectedRoute() {
  const { autenticado, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <section className="min-vh-page d-flex align-items-center justify-content-center gap-3 text-body-secondary">
        <Spinner animation="border" size="sm" />
        Cargando…
      </section>
    )
  }

  if (!autenticado) {
    // Login devuelve al usuario a esta página después de entrar.
    return <Navigate to="/login" replace state={{ desde: location.pathname }} />
  }

  return <Outlet />
}

export default ProtectedRoute
