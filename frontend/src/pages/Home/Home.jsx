import './Home.css'
import heroImage from '../../assets/golazo-hero.jpg'

function Home() {
  return (
    <section
      className="hero"
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      <div className="hero__overlay"></div>

      <div className="hero__content">
        <p className="hero__eyebrow">GOLAZO</p>

        <h1>
          EL FÚTBOL
          <br />
          EMPIEZA AQUÍ.
        </h1>

        <p className="hero__description">
          Reserva tu cancha, reúne a tu equipo y vive el fútbol
          como se debe.
        </p>

        <div className="hero__actions">
          <a href="/reservas" className="hero__button hero__button--primary">
            Reservar cancha
          </a>

          <a href="/tienda" className="hero__button hero__button--secondary">
            Ver tienda
          </a>
        </div>
      </div>
    </section>
  )
}

export default Home