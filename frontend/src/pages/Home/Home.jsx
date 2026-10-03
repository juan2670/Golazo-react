import { Link } from 'react-router-dom'
import './Home.css'
import heroImage from '../../assets/golazo-hero.jpg'

const servicios = [
  {
    numero: '01',
    titulo: 'Reserva tu cancha',
    descripcion:
      'Encuentra el horario que necesitas y organiza tu próximo partido.',
    enlace: '/reservas',
  },
  {
    numero: '02',
    titulo: 'Equípate',
    descripcion:
      'Encuentra balones, ropa, bebidas y accesorios para el partido.',
    enlace: '/tienda',
  },
  {
    numero: '03',
    titulo: 'Vive Golazo',
    descripcion:
      'Un espacio pensado para disfrutar el fútbol con tu equipo y amigos.',
    enlace: '/nosotros',
  },
]

const canchas = [
  {
    nombre: 'Fútbol 5',
    descripcion: 'Ideal para partidos rápidos y competitivos.',
  },
  {
    nombre: 'Fútbol 5 Pro',
    descripcion: 'Más espacio para llevar tu partido al siguiente nivel.',
  },
  {
    nombre: 'Fútbol 8',
    descripcion: 'Una cancha pensada para equipos más grandes.',
  },
]

function Home() {
  return (
    <div className="home">
      {/* HERO */}
      <section
        className="home__hero"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="home__hero-overlay"></div>

        <div className="home__hero-content">
          <p className="home__eyebrow">
            GOLAZO · FÚTBOL · EXPERIENCIA
          </p>

          <h1>
            EL FÚTBOL
            <br />
            EMPIEZA AQUÍ.
          </h1>

          <p className="home__hero-description">
            Reserva tu cancha, reúne a tu equipo y vive cada partido
            como se debe.
          </p>

          <div className="home__hero-actions">
            <Link
              to="/reservas"
              className="home__button home__button--primary"
            >
              Reservar cancha
            </Link>

            <Link
              to="/tienda"
              className="home__button home__button--secondary"
            >
              Ver tienda
            </Link>
          </div>
        </div>

        <div className="home__hero-bottom">
          <span>BOGOTÁ · COLOMBIA</span>

          <span>FÚTBOL PARA TODOS</span>
        </div>
      </section>

      {/* SERVICIOS */}
      <section className="home__services">
        <div className="home__section-header">
          <div>
            <p className="home__section-label">TODO EN UN SOLO LUGAR</p>

            <h2>
              Más que una cancha.
            </h2>
          </div>

          <p>
            Golazo reúne todo lo necesario para que solo tengas que
            preocuparte por jugar.
          </p>
        </div>

        <div className="home__services-grid">
          {servicios.map((servicio) => (
            <Link
              to={servicio.enlace}
              className="service-card"
              key={servicio.numero}
            >
              <span className="service-card__number">
                {servicio.numero}
              </span>

              <div>
                <h3>{servicio.titulo}</h3>

                <p>{servicio.descripcion}</p>
              </div>

              <span className="service-card__arrow">↗</span>
            </Link>
          ))}
        </div>
      </section>

      {/* CANCHAS */}
      <section className="home__courts">
        <div className="home__section-header">
          <div>
            <p className="home__section-label">
              NUESTRAS INSTALACIONES
            </p>

            <h2>
              Elige cómo quieres jugar.
            </h2>
          </div>

          <Link to="/reservas" className="home__text-link">
            Ver disponibilidad →
          </Link>
        </div>

        <div className="home__courts-grid">
          {canchas.map((cancha, index) => (
            <article className="court-card" key={cancha.nombre}>
              <div className={`court-card__image court-card__image--${index + 1}`}>
                <span>0{index + 1}</span>
              </div>

              <div className="court-card__content">
                <p>CANCHA</p>

                <h3>{cancha.nombre}</h3>

                <span>{cancha.descripcion}</span>

                <Link to="/reservas">
                  Reservar →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ESTADÍSTICAS */}
      <section className="home__stats">
        <div className="home__stats-content">
          <p className="home__section-label">
            GOLAZO EN NÚMEROS
          </p>

          <h2>
            Tu partido.
            <br />
            Nuestra cancha.
          </h2>
        </div>

        <div className="home__stats-grid">
          <div className="stat">
            <strong>500+</strong>
            <span>reservas</span>
          </div>

          <div className="stat">
            <strong>3</strong>
            <span>canchas</span>
          </div>

          <div className="stat">
            <strong>7/7</strong>
            <span>atención</span>
          </div>

          <div className="stat">
            <strong>100%</strong>
            <span>fútbol</span>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="home__cta">
        <div>
          <p className="home__section-label">
            ¿LISTO PARA JUGAR?
          </p>

          <h2>
            Tu próximo partido
            <br />
            empieza aquí.
          </h2>
        </div>

        <Link
          to="/reservas"
          className="home__button home__button--primary"
        >
          Reservar ahora →
        </Link>
      </section>
    </div>
  )
}

export default Home