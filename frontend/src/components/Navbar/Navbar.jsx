import { Link } from 'react-router-dom'

import { useAuth } from '../../context/AuthContext'

import './Navbar.css'

function Navbar() {
  const { usuario, autenticado, logout } = useAuth()

  return (
    <nav className="navbar">

      <div className="navbar__logo">
        <Link to="/">
          GOLAZO
        </Link>
      </div>

      <ul className="navbar__links">

        <li>
          <Link to="/">
            Inicio
          </Link>
        </li>

        <li>
          <Link to="/reservas">
            Reservas
          </Link>
        </li>

        <li>
          <Link to="/tienda">
            Tienda
          </Link>
        </li>

        <li>
          <Link to="/nosotros">
            Nosotros
          </Link>
        </li>

        <li>
          <Link to="/ubicacion">
            Ubicación
          </Link>
        </li>

      </ul>

      <div className="navbar__actions">

        {autenticado ? (
          <>
            <Link
              to="/perfil"
              className="navbar__login"
            >
              {usuario?.nombre || 'Mi perfil'}
            </Link>

            <button
              type="button"
              className="navbar__logout"
              onClick={logout}
            >
              Cerrar sesión
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="navbar__login"
          >
            Iniciar sesión
          </Link>
        )}

      </div>

    </nav>
  )
}

export default Navbar