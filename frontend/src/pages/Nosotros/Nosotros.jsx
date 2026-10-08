import { Link } from 'react-router-dom'
import './Nosotros.css'

function Nosotros() {
  return (
    <section className="nosotros">
      <div className="nosotros__hero">
        <div className="nosotros__hero-content">
          <p className="nosotros__label">SOBRE GOLAZO</p>

          <h1>
            EL FÚTBOL
            <br />
            NOS UNE.
          </h1>

          <p>
            Golazo nace como un espacio creado para quienes viven
            el fútbol dentro y fuera de la cancha.
          </p>
        </div>
      </div>

      <div className="nosotros__content">
        <section className="nosotros__intro">
          <div>
            <p className="nosotros__section-label">
              NUESTRA HISTORIA
            </p>

            <h2>
              Más que jugar.
              <br />
              Una experiencia.
            </h2>
          </div>

          <div className="nosotros__text">
            <p>
              En Golazo queremos reunir en un solo lugar todo lo
              que necesitas para disfrutar el fútbol.
            </p>

            <p>
              Desde reservar una cancha con tus amigos hasta
              encontrar el equipamiento necesario para el partido.
              Nuestro objetivo es hacer que organizar tu próxima
              jornada de fútbol sea sencillo.
            </p>

            <p>
              Queremos construir una comunidad alrededor del
              deporte, la competencia y los buenos momentos.
            </p>
          </div>
        </section>

        <section className="nosotros__values">
          <div className="value">
            <span>01</span>

            <h3>Pasión</h3>

            <p>
              El fútbol está en el centro de todo lo que hacemos.
            </p>
          </div>

          <div className="value">
            <span>02</span>

            <h3>Experiencia</h3>

            <p>
              Diseñamos cada espacio pensando en quienes vienen
              a jugar.
            </p>
          </div>

          <div className="value">
            <span>03</span>

            <h3>Comunidad</h3>

            <p>
              Queremos conectar jugadores, equipos y amigos.
            </p>
          </div>
        </section>

        <section className="nosotros__cta">
          <div>
            <p className="nosotros__section-label">
              ¿LISTO PARA JUGAR?
            </p>

            <h2>
              La próxima jugada
              <br />
              empieza contigo.
            </h2>
          </div>

          <Link to="/reservas">
            Reservar cancha →
          </Link>
        </section>
      </div>
    </section>
  )
}

export default Nosotros