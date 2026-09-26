import { Link, Outlet } from 'react-router-dom'
import './MainLayout.css'

function MainLayout() {
  return (
    <div className="app-layout">
      <header className="main-header">
        <Link to="/" className="brand">El Golazo Club</Link>
        <nav>
          <Link to="/">Inicio</Link>
          <Link to="/servicios">Servicios</Link>
          <Link to="/torneos">Torneos</Link>
          <Link to="/eventos">Eventos</Link>
          <Link to="/ubicacion">Ubicación</Link>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>

      <footer className="main-footer">
        <p>&copy; {new Date().getFullYear()} El Golazo Club</p>
      </footer>
    </div>
  )
}
export default MainLayout