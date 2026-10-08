import { Link } from 'react-router-dom'
import './Ubicacion.css'

function Ubicacion() {
  return (
    <section className="ubicacion">
      <div className="ubicacion__header">
        <p>ENCUÉNTRANOS</p>

        <h1>
          VEN A
          <br />
          JUGAR.
        </h1>

        <span>
          Estamos ubicados en Bogotá para que puedas llegar,
          reservar y empezar tu partido.
        </span>
      </div>

      <div className="ubicacion__layout">
        <div className="ubicacion__map">
          <div className="ubicacion__map-overlay">
            <span>GOLAZO</span>
          </div>
        </div>

        <div className="ubicacion__info">
          <div>
            <p>UBICACIÓN</p>

            <h2>Bogotá, Colombia</h2>

            <span>
              Dirección próximamente disponible.
            </span>
          </div>

          <div>
            <p>HORARIOS</p>

            <h2>Todos los días</h2>

            <span>
              8:00 AM — 12:00 AM
            </span>
          </div>

          <div>
            <p>CONTACTO</p>

            <h2>+57 300 000 0000</h2>

            <span>
              contacto@golazo.com
            </span>
          </div>

          <Link to="/reservas">
            Reservar una cancha →
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Ubicacion