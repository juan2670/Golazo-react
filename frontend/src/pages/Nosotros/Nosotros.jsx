import { Link } from 'react-router-dom'
import { Button, Col, Container, Row } from 'react-bootstrap'

import CtaBand from '../../components/CtaBand/CtaBand'
import Magnetic from '../../components/Magnetic/Magnetic'
import PageHero from '../../components/PageHero/PageHero'
import Reveal from '../../components/Reveal/Reveal'
import Scoreboard from '../../components/Scoreboard/Scoreboard'
import Split from '../../components/Split/Split'
import SplitHeading from '../../components/SplitHeading/SplitHeading'
import { imagenes } from '../../data/negocio'

const VALORES = [
  {
    titulo: 'Seguridad',
    texto: 'Un ambiente 100% seguro donde tu familia es bienvenida.',
  },
  {
    titulo: 'Mantenimiento',
    texto: 'Cuidamos las canchas de forma constante para que cada partido sea mejor.',
  },
  {
    titulo: 'Comunidad',
    texto: 'Torneos, ligas y eventos que reúnen a jugadores y equipos de Soacha.',
  },
]

function Nosotros() {
  return (
    <>
      <PageHero
        titulo="Fútbol, familia y comunidad"
        descripcion="Somos El Golazo Club, tu cancha sintética de confianza en Soacha, Cundinamarca."
        imagen={imagenes.dronNoche}
      />

      <Scoreboard />

      <Split
        titulo="Un lugar para jugar tranquilo y disfrutar"
        texto="Disfruta de nuestras canchas sintéticas y de la luz LED para tus partidos nocturnos, en un ambiente donde tu familia es bienvenida. Con mantenimiento constante buscamos que disfrutes cada partido."
        imagen={imagenes.canchaF8}
        alt="Partido de fútbol 8 en El Golazo"
        tinte
      >
        <Magnetic>
          <Button as={Link} to="/servicios" variant="primary" size="lg" className="btn-sport">
            <span>Ver servicios</span>
          </Button>
        </Magnetic>
      </Split>

      <section className="py-7">
        <Container>
          <SplitHeading as="h2" className="mb-5">
            Lo que nos define
          </SplitHeading>

          <Reveal as={Row} stagger={0.14} className="g-4">
            {VALORES.map((valor) => (
              <Col md={4} key={valor.titulo}>
                <article className="h-100 border-top border-5 border-success pt-4">
                  <h3 className="display-6 mb-3">{valor.titulo}</h3>
                  <p className="text-body-secondary mb-0">{valor.texto}</p>
                </article>
              </Col>
            ))}
          </Reveal>
        </Container>
      </section>

      <CtaBand
        titulo="Ven a conocernos"
        texto="Te esperamos en la Cra. 7 #14 Sur-46, Soacha."
      >
        <Magnetic>
          <Button as={Link} to="/reservas" variant="info" size="lg" className="btn-sport">
            <span>Reservar cancha</span>
          </Button>
        </Magnetic>

        <Magnetic>
          <Button as={Link} to="/ubicacion" variant="outline-light" size="lg" className="btn-sport">
            <span>Cómo llegar</span>
          </Button>
        </Magnetic>
      </CtaBand>
    </>
  )
}

export default Nosotros
