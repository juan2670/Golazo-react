import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { Alert, Button, Col, Container, Row } from 'react-bootstrap'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'

import { MEDIA, gsap, useGSAP } from '../../animations/gsap'
import Ball from '../../components/Ball/Ball'
import CtaBand from '../../components/CtaBand/CtaBand'
import ImageReveal from '../../components/ImageReveal/ImageReveal'
import Magnetic from '../../components/Magnetic/Magnetic'
import PageHero from '../../components/PageHero/PageHero'
import Reveal from '../../components/Reveal/Reveal'
import Split from '../../components/Split/Split'
import SplitHeading from '../../components/SplitHeading/SplitHeading'
import { imagenes, negocio } from '../../data/negocio'

gsap.registerPlugin(MotionPathPlugin)

const PASOS = [
  {
    titulo: 'Escríbenos',
    texto: 'Cuéntanos por WhatsApp que quieres participar y consulta los torneos disponibles.',
  },
  {
    titulo: 'Reúne a tu equipo',
    texto: 'Organiza a tus jugadores y define el nombre y los colores de tu equipo.',
  },
  {
    titulo: 'Confirma y a jugar',
    texto: 'Confirma tu inscripción con el club y vive la competencia en la cancha.',
  },
]

const FOTOS = [
  { src: imagenes.torneo, alt: 'Equipo posando antes de un partido de torneo', aspecto: '75%' },
  { src: imagenes.partidoNoche, alt: 'Partido nocturno con público en la tribuna', aspecto: '125%' },
  { src: imagenes.partidoNocheFemenino, alt: 'Partido nocturno bajo la luz LED', aspecto: '125%' },
]

const TRAYECTO = 'M20 150 C 180 -30, 340 -30, 480 100 S 760 250, 980 60'

// El balón recorre la jugada mientras se hace scroll y deja su estela.
function Pasos() {
  const raiz = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add(`${MEDIA.motion} and ${MEDIA.desktop}`, () => {
        const recorrido = gsap.timeline({
          scrollTrigger: {
            trigger: raiz.current,
            start: 'top 70%',
            end: 'bottom 60%',
            scrub: 1,
          },
        })

        recorrido
          .fromTo('#estela', { drawSVG: '0%' }, { drawSVG: '100%', ease: 'none' }, 0)
          .to(
            '#balon',
            {
              motionPath: { path: '#trayecto' },
              rotation: 900,
              ease: 'none',
            },
            0,
          )
      })

      return () => mm.revert()
    },
    { scope: raiz },
  )

  return (
    <section ref={raiz} className="py-7 bg-body-tertiary">
      <Container>
        <SplitHeading as="h2" className="mb-5">
          Inscribir a tu equipo es fácil
        </SplitHeading>

        <svg
          className="ball-path d-none d-lg-block mb-4 text-success"
          viewBox="0 0 1000 200"
          fill="none"
          aria-hidden="true"
          focusable="false"
        >
          <path
            id="trayecto"
            d={TRAYECTO}
            stroke="currentColor"
            strokeOpacity="0.3"
            strokeWidth="4"
            strokeDasharray="4 14"
            strokeLinecap="round"
          />
          <path
            id="estela"
            d={TRAYECTO}
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <g id="balon">
            <Ball x="-22" y="-22" width="44" height="44" />
          </g>
        </svg>

        <Reveal as={Row} stagger={0.15} className="g-4">
          {PASOS.map((paso, indice) => (
            <Col md={4} key={paso.titulo}>
              <div className="step-number mb-3">{indice + 1}</div>
              <h3 className="h4 mb-2">{paso.titulo}</h3>
              <p className="text-body-secondary mb-0">{paso.texto}</p>
            </Col>
          ))}
        </Reveal>
      </Container>
    </section>
  )
}

function Torneos() {
  return (
    <>
      <PageHero
        titulo="Compite en El Golazo"
        descripcion="Organizamos torneos y ligas en nuestras canchas sintéticas, con ambiente seguro y partidos de noche con luz LED."
        imagen={imagenes.canchaF8}
      >
        <Magnetic>
          <Button
            href={negocio.whatsappTorneos}
            target="_blank"
            rel="noopener noreferrer"
            variant="info"
            size="lg"
            className="btn-sport"
          >
            <span>Inscribir mi equipo</span>
          </Button>
        </Magnetic>
      </PageHero>

      <Split
        titulo="Un escenario para equipos que quieren jugar en serio"
        texto="Nuestras canchas están pensadas para que cada partido se disfrute: césped sintético con mantenimiento constante, luz LED y un ambiente donde tu familia y tu barra son bienvenidas."
        items={[
          'Partidos de día y de noche',
          'Luz LED en las canchas',
          'Ambiente 100% seguro y familiar',
          'Zona social y parqueadero',
        ]}
        imagen={imagenes.partidoNoche}
        alt="Partido nocturno con público en la tribuna"
        aspecto="110%"
      />

      <Pasos />

      <section className="py-7">
        <Container>
          <SplitHeading as="h2" className="mb-5">
            Así se vive la competencia
          </SplitHeading>

          <Row className="g-4">
            {FOTOS.map((foto) => (
              <Col md={4} key={foto.src}>
                <ImageReveal src={foto.src} alt={foto.alt} aspecto={foto.aspecto} />
              </Col>
            ))}
          </Row>

          <Reveal>
            <Alert variant="info" className="mt-5 mb-0 d-flex flex-wrap gap-2 align-items-center">
              <strong>Próximamente:</strong>
              calendario de partidos, resultados y tabla de posiciones en esta
              misma página.
            </Alert>
          </Reveal>
        </Container>
      </section>

      <CtaBand
        titulo="¿Tu equipo está listo?"
        texto="Escríbenos y reserva tu lugar en el próximo torneo."
      >
        <Magnetic>
          <Button
            href={negocio.whatsappTorneos}
            target="_blank"
            rel="noopener noreferrer"
            variant="info"
            size="lg"
            className="btn-sport"
          >
            <span>Inscribir mi equipo</span>
          </Button>
        </Magnetic>

        <Magnetic>
          <Button as={Link} to="/reservas" variant="outline-light" size="lg" className="btn-sport">
            <span>Reservar una cancha</span>
          </Button>
        </Magnetic>
      </CtaBand>
    </>
  )
}

export default Torneos
