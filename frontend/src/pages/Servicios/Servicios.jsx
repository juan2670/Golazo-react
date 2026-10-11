import { Link } from 'react-router-dom'
import { Button, Col, Container, Row } from 'react-bootstrap'

import CtaBand from '../../components/CtaBand/CtaBand'
import Magnetic from '../../components/Magnetic/Magnetic'
import PageHero from '../../components/PageHero/PageHero'
import Reveal from '../../components/Reveal/Reveal'
import Split from '../../components/Split/Split'
import SplitHeading from '../../components/SplitHeading/SplitHeading'
import VideoGallery from '../../components/VideoGallery/VideoGallery'
import {
  imagenes,
  negocio,
  videosCanchas,
  videosClub,
} from '../../data/negocio'

const COMODIDADES = [
  {
    titulo: 'Parqueadero',
    texto: 'Espacio para que llegues tranquilo con tu equipo.',
    imagen: imagenes.parqueadero,
    alt: 'Parqueadero del club',
  },
  {
    titulo: 'Zona social',
    texto: 'Un lugar para compartir antes y después del partido.',
    imagen: imagenes.zonaSocial,
    alt: 'Zona social con mesas y banquitos amarillos',
  },
]

const VENTAJAS = [
  { titulo: 'Luz LED', texto: 'Partidos nocturnos con excelente visibilidad.' },
  {
    titulo: 'Ambiente familiar',
    texto: '100% seguro, donde tu familia es bienvenida.',
  },
]

function Servicios() {
  return (
    <>
      <PageHero
        titulo="Todo para tu partido"
        descripcion="Canchas sintéticas, torneos, ligas y eventos en un solo lugar."
        imagen={imagenes.canchaF5}
      />

      <Split
        titulo="Fútbol 5 y fútbol 8 cuando quieras jugar"
        texto="Reserva tu espacio en nuestras canchas sintéticas con luz LED. Pregunta por disponibilidad, horarios y tarifas."
        items={[
          'Canchas de fútbol 5 y fútbol 8',
          'Luz LED para partidos nocturnos',
          'Mantenimiento constante del césped sintético',
          'Reserva en línea o por WhatsApp',
        ]}
        imagen={imagenes.canchaF5Detalle}
        alt="Cancha sintética de El Golazo"
      >
        <Magnetic>
          <Button as={Link} to="/reservas" variant="primary" size="lg" className="btn-sport">
            <span>Reservar en línea</span>
          </Button>
        </Magnetic>

        <Magnetic>
          <Button
            href={negocio.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            variant="outline-primary"
            size="lg"
            className="btn-sport"
          >
            <span>Consultar por WhatsApp</span>
          </Button>
        </Magnetic>
      </Split>

      <section className="py-6 bg-body-tertiary" aria-labelledby="videos-canchas">
        <Container>
          <SplitHeading as="h2" id="videos-canchas" className="display-5">
            Así se ven nuestras canchas
          </SplitHeading>

          <Reveal>
            <p className="lead text-body-secondary mt-3 mb-5 col-lg-7 px-0">
              Mira el césped, las líneas y el entorno antes de reservar. Toca
              cualquier video para verlo en grande.
            </p>

            <VideoGallery videos={videosCanchas} destacado />
          </Reveal>
        </Container>
      </section>

      <Split
        titulo="Fútbol 8 para equipos grandes"
        texto="Más espacio, más jugadores y partidos de más intensidad. Ideal para ligas, cumpleaños y encuentros de empresa."
        items={[
          'Cancha amplia de césped sintético',
          'Iluminación LED para jugar de noche',
          'Zona social y parqueadero a pocos pasos',
        ]}
        imagen={imagenes.canchaF8}
        alt="Cancha de fútbol 8 de El Golazo"
        invertir
      >
        <Magnetic>
          <Button as={Link} to="/reservas" variant="primary" size="lg" className="btn-sport">
            <span>Reservar fútbol 8</span>
          </Button>
        </Magnetic>
      </Split>

      <section
        className="py-6 bg-body text-body"
        data-bs-theme="dark"
        aria-labelledby="partidos-noche"
      >
        <Container>
          <Row className="align-items-center g-5">
            <Col lg={5}>
              <SplitHeading as="h2" id="partidos-noche" className="display-5">
                Partidos de noche con luz LED
              </SplitHeading>

              <Reveal delay={0.1}>
                <p className="lead text-body-secondary mt-3">
                  Cuando cae el sol, los reflectores encienden las canchas y el
                  partido sigue. Reserva tu horario nocturno en línea o por
                  WhatsApp.
                </p>

                <div className="d-flex flex-wrap gap-3 mt-4">
                  <Magnetic>
                    <Button as={Link} to="/reservas" variant="info" size="lg" className="btn-sport">
                      <span>Reservar en la noche</span>
                    </Button>
                  </Magnetic>
                </div>
              </Reveal>
            </Col>

            <Col lg={7}>
              <Reveal as={Row} stagger={0.12} className="g-3">
                <Col xs={12}>
                  <div className="ratio ratio-16x9 chamfer" style={{ '--cut': '1.5rem' }}>
                    <img
                      src={imagenes.dronNoche}
                      alt="Vista aérea nocturna de las canchas iluminadas"
                      loading="lazy"
                      className="object-fit-cover"
                    />
                  </div>
                </Col>

                <Col xs={6}>
                  <div className="ratio ratio-1x1 chamfer" style={{ '--cut': '1.1rem' }}>
                    <img
                      src={imagenes.partidoNoche}
                      alt="Partido nocturno con público en la tribuna"
                      loading="lazy"
                      className="object-fit-cover"
                    />
                  </div>
                </Col>

                <Col xs={6}>
                  <div className="ratio ratio-1x1 chamfer" style={{ '--cut': '1.1rem' }}>
                    <img
                      src={imagenes.partidoNocheFemenino}
                      alt="Partido nocturno bajo los reflectores"
                      loading="lazy"
                      className="object-fit-cover"
                    />
                  </div>
                </Col>
              </Reveal>
            </Col>
          </Row>
        </Container>
      </section>

      <Split
        titulo="Torneos y ligas para competir en un ambiente sano"
        texto="Reúne a tu equipo y vive la competencia en nuestras canchas. Escríbenos para conocer los torneos y ligas disponibles."
        imagen={imagenes.torneo}
        alt="Equipo posando antes de un torneo en El Golazo"
        invertir
        tinte
      >
        <Magnetic>
          <Button as={Link} to="/torneos" variant="primary" size="lg" className="btn-sport">
            <span>Ver torneos y ligas</span>
          </Button>
        </Magnetic>
      </Split>

      <Split
        titulo="Eventos para celebrar con tu grupo"
        texto="Cumpleaños, encuentros de empresa o reuniones deportivas: cuéntanos qué quieres organizar y lo coordinamos contigo."
        imagen={imagenes.zonaSocial}
        alt="Zona social del club"
        aspecto="75%"
      >
        <Magnetic>
          <Button
            href={negocio.whatsappEventos}
            target="_blank"
            rel="noopener noreferrer"
            variant="primary"
            size="lg"
            className="btn-sport"
          >
            <span>Consultar por un evento</span>
          </Button>
        </Magnetic>
      </Split>

      <section className="py-6 bg-body-tertiary" aria-labelledby="recorre-club">
        <Container>
          <SplitHeading as="h2" id="recorre-club" className="display-5">
            Recorre el club
          </SplitHeading>

          <Reveal>
            <p className="lead text-body-secondary mt-3 mb-5 col-lg-7 px-0">
              De la entrada a la barra y de la barra a la cancha: así es llegar
              a El Golazo.
            </p>

            <VideoGallery videos={videosClub} />
          </Reveal>
        </Container>
      </section>

      <section className="py-6">
        <Container>
          <SplitHeading as="h2" className="mb-5">
            Pensado para que disfrutes todo el día
          </SplitHeading>

          <Reveal as={Row} stagger={0.12} className="g-4">
            {COMODIDADES.map((item) => (
              <Col md={6} key={item.titulo}>
                <article className="chamfer bg-body-tertiary h-100 d-flex flex-column flex-sm-row" style={{ '--cut': '1.5rem' }}>
                  <img
                    src={item.imagen}
                    alt={item.alt}
                    loading="lazy"
                    className="object-fit-cover servicio-foto"
                  />

                  <div className="p-4 align-self-center">
                    <h3 className="h4 mb-2">{item.titulo}</h3>
                    <p className="text-body-secondary mb-0">{item.texto}</p>
                  </div>
                </article>
              </Col>
            ))}

            {VENTAJAS.map((item) => (
              <Col md={6} key={item.titulo}>
                <article className="chamfer bg-body-tertiary h-100 p-4 border-start border-5 border-success" style={{ '--cut': '1.5rem' }}>
                  <h3 className="h4 mb-2">{item.titulo}</h3>
                  <p className="text-body-secondary mb-0">{item.texto}</p>
                </article>
              </Col>
            ))}
          </Reveal>
        </Container>
      </section>

      <CtaBand
        titulo="¿Quieres jugar en El Golazo?"
        texto="Escríbenos y te ayudamos con disponibilidad, horarios y tarifas."
      >
        <Magnetic>
          <Button
            href={negocio.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            variant="info"
            size="lg"
            className="btn-sport"
          >
            <span>Escribir por WhatsApp</span>
          </Button>
        </Magnetic>

        <Magnetic>
          <Button as={Link} to="/reservas" variant="outline-light" size="lg" className="btn-sport">
            <span>Reservar en línea</span>
          </Button>
        </Magnetic>
      </CtaBand>
    </>
  )
}

export default Servicios
