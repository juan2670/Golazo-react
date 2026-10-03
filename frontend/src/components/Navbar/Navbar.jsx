import { Link } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar__logo">
        <Link to="/">GOLAZO</Link>
      </div>

      <ul className="navbar__links">
        <li>
          <Link to="/">Inicio</Link>
        </li>

        <li>
          <Link to="/reservas">Reservas</Link>
        </li>

        <li>
          <Link to="/tienda">Tienda</Link>
        </li>

        <li>
          <Link to="/nosotros">Nosotros</Link>
        </li>

        <li>
          <Link to="/ubicacion">Ubicación</Link>
        </li>
      </ul>

      <div className="navbar__actions">
        <Link to="/login" className="navbar__login">
          Iniciar sesión
        </Link>
      </div>
    </nav>
  )
}

export default Navbar