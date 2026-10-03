import { Link } from 'react-router-dom'
import './Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__top">
        <div className="footer__brand">
          <Link to="/">GOLAZO</Link>

          <p>
            El lugar donde el fútbol,
            la competencia y la diversión
            se encuentran.
          </p>
        </div>

        <div className="footer__column">
          <h3>Explorar</h3>

          <Link to="/">Inicio</Link>
          <Link to="/reservas">Reservas</Link>
          <Link to="/tienda">Tienda</Link>
          <Link to="/nosotros">Nosotros</Link>
        </div>

        <div className="footer__column">
          <h3>Información</h3>

          <Link to="/ubicacion">Ubicación</Link>
          <Link to="/contacto">Contacto</Link>
          <Link to="/login">Iniciar sesión</Link>
        </div>

        <div className="footer__column">
          <h3>Contacto</h3>

          <span>Bogotá, Colombia</span>
          <span>+57 300 000 0000</span>
          <span>contacto@golazo.com</span>
        </div>
      </div>

      <div className="footer__bottom">
        <span>
          © 2026 Golazo. Todos los derechos reservados.
        </span>

        <span>
          Hecho para los que viven el fútbol.
        </span>
      </div>
    </footer>
  )
}

export default Footer