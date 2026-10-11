import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { Button, Col, Container, Row } from 'react-bootstrap'

import { MEDIA, gsap, useGSAP } from '../../../animations/gsap'
import Magnetic from '../../../components/Magnetic/Magnetic'
import Reveal from '../../../components/Reveal/Reveal'
import SplitHeading from '../../../components/SplitHeading/SplitHeading'
import { imagenes } from '../../../data/negocio'

const CANCHAS = [
  {
    numero: '5',
    titulo: 'Fútbol 5',
    texto: 'Ritmo rápido y mucha técnica para partidos entre amigos.',
    foto: imagenes.canchaF5,
    desde: -1,
  },
  {
    numero: '8',
    titulo: 'Fútbol 8',
    texto: 'Más espacio para equipos grandes y partidos de más intensidad.',
    foto: imagenes.canchaF8,
    desde: 1,
  },
]

// Luces parpadeantes de entrada: se repite el gesto del hero en la franja nocturna.
const ENCENDIDO = [
  { filter: 'brightness(0.55)', duration: 0.07 },
  { filter: 'brightness(0.12)', duration: 0.12 },
  { filter: 'brightness(0.9)', duration: 0.07 },
  { filter: 'brightness(0.2)', duration: 0.14 },
  { filter: 'brightness(1)', duration: 0.6, ease: 'power2.out' },
]

function Dorsal({ numero, titulo, texto, foto, desde }) {
  const raiz = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add(MEDIA.motion, () => {
        const cifra = raiz.current.querySelector('.dorsal__num')

        gsap.from(cifra, {
          xPercent: desde * 40,
          rotate: desde * 14,
          opacity: 0,
          duration: 1.2,
          ease: 'power4.out',
          scrollTrigger: { trigger: raiz.current, start: 'top 85%', once: true },
        })
      })

      mm.add(`${MEDIA.motion} and ${MEDIA.fine}`, () => {
        const cifra = raiz.current.querySelector('.dorsal__num')

        const alMover = (evento) => {
          const caja = raiz.current.getBoundingClientRect()
          const x = ((evento.clientX - caja.left) / caja.width) * 100
          const y = ((evento.clientY - caja.top) / caja.height) * 100

          gsap.to(cifra, {
            backgroundPositionX: `${100 - x}%`,
            backgroundPositionY: `${100 - y}%`,
            duration: 0.8,
            overwrite: 'auto',
          })
        }

        raiz.current.addEventListener('pointermove', alMover)

        return () => raiz.current?.removeEventListener('pointermove', alMover)
      })

      return () => mm.revert()
    },
    { scope: raiz },
  )

  return (
    <article
      ref={raiz}
      className="dorsal chamfer bg-body h-100 p-4 p-lg-5 d-flex flex-column gap-4"
    >
      <span
        className="dorsal__num"
        style={{ '--photo': `url(${foto})` }}
        aria-hidden="true"
      >
        {numero}
      </span>

      <div className="mt-auto">
        <h3 className="mb-2">{titulo}</h3>

        <p className="text-body-secondary mb-4">{texto}</p>

        <Magnetic>
          <Button
            as={Link}
            to="/reservas"
            variant="primary"
            className="btn-sport"
          >
            <span>Reservar {titulo.toLowerCase()}</span>
          </Button>
        </Magnetic>
      </div>
    </article>
  )
}

function NightStrip() {
  const raiz = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add(MEDIA.motion, () => {
        const foto = raiz.current.querySelector('img')

        gsap.set(foto, { filter: 'brightness(0.1)' })

        gsap.to(foto, {
          keyframes: ENCENDIDO,
          ease: 'none',
          scrollTrigger: { trigger: raiz.current, start: 'top 75%', once: true },
        })

        gsap.fromTo(
          foto,
          { yPercent: -6, scale: 1.15 },
          {
            yPercent: 6,
            ease: 'none',
            scrollTrigger: {
              trigger: raiz.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          },
        )
      })

      return () => mm.revert()
    },
    { scope: raiz },
  )

  return (
    <div
      ref={raiz}
      className="night-strip chamfer position-relative mt-4"
      style={{ minHeight: '26rem' }}
      data-bs-theme="dark"
    >
      <img
        src={imagenes.dronNoche}
        alt="Vista aérea nocturna de las canchas iluminadas de El Golazo"
        className="position-absolute top-0 start-0 w-100 h-100 object-fit-cover"
        loading="lazy"
      />

      <div className="night-strip__text">
        <h3 className="display-6 text-uppercase mb-2">Juega de noche</h3>

        <p className="lead mb-3 col-lg-6 px-0">
          Reserva en la noche y juega bajo la luz LED de nuestras canchas.
        </p>

        <Magnetic>
          <Button as={Link} to="/reservas" variant="info" className="btn-sport">
            <span>Reservar en la noche</span>
          </Button>
        </Magnetic>
      </div>
    </div>
  )
}

function Courts() {
  return (
    <section className="py-7 bg-body-tertiary pitch-stripes">
      <Container>
        <SplitHeading as="h2" className="display-5 mb-5">
          Elige tu cancha
        </SplitHeading>

        <Row className="g-4">
          {CANCHAS.map((cancha) => (
            <Col md={6} key={cancha.numero}>
              <Dorsal {...cancha} />
            </Col>
          ))}
        </Row>

        <Reveal>
          <NightStrip />
        </Reveal>
      </Container>
    </section>
  )
}

export default Courts
