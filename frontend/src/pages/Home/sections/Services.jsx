import { Link } from 'react-router-dom'
import { Container } from 'react-bootstrap'

import Reveal from '../../../components/Reveal/Reveal'
import SplitHeading from '../../../components/SplitHeading/SplitHeading'
import { imagenes, negocio } from '../../../data/negocio'

const SERVICIOS = [
  {
    titulo: 'Alquiler de canchas',
    texto: 'Reserva tu cancha de fútbol 5 o fútbol 8 en el horario que prefieras.',
    imagen: imagenes.canchaF5Detalle,
    alt: 'Cancha sintética de El Golazo vista desde la tribuna',
    enlace: '/reservas',
    accion: 'Reservar cancha',
  },
  {
    titulo: 'Torneos y ligas',
    texto: 'Inscribe a tu equipo y compite en un ambiente sano y organizado.',
    imagen: imagenes.torneo,
    alt: 'Equipo posando antes de un torneo en El Golazo',
    enlace: '/torneos',
    accion: 'Ver torneos',
  },
  {
    titulo: 'Eventos',
    texto: 'Celebra con tu grupo: cumpleaños, encuentros de empresa y reuniones deportivas.',
    imagen: imagenes.zonaSocial,
    alt: 'Zona social de El Golazo con mesas y banquitos',
    externo: negocio.whatsappEventos,
    accion: 'Consultar por un evento',
  },
]

function Services() {
  return (
    <section className="pt-7">
      <Container className="mb-5">
        <SplitHeading as="h2" className="display-5">
          Todo para tu partido
        </SplitHeading>
      </Container>

      <Reveal className="expander" stagger={0.15} y={70}>
        {SERVICIOS.map((servicio) => (
          <article className="expander__panel" key={servicio.titulo}>
            <img src={servicio.imagen} alt={servicio.alt} loading="lazy" />

            <div className="expander__body">
              <h3 className="text-white mb-2">{servicio.titulo}</h3>

              <div className="expander__more">
                <p className="mb-3 text-white-50">{servicio.texto}</p>

                {servicio.externo ? (
                  <a
                    href={servicio.externo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-info btn-sport"
                  >
                    <span>{servicio.accion}</span>
                  </a>
                ) : (
                  <Link to={servicio.enlace} className="btn btn-info btn-sport">
                    <span>{servicio.accion}</span>
                  </Link>
                )}
              </div>
            </div>
          </article>
        ))}
      </Reveal>
    </section>
  )
}

export default Services
