import { useRef } from 'react'
import { Button, Col, Container, ListGroup, Row } from 'react-bootstrap'
import { Whatsapp } from 'react-bootstrap-icons'

import { MEDIA, gsap, useGSAP } from '../../../animations/gsap'
import ImageReveal from '../../../components/ImageReveal/ImageReveal'
import Magnetic from '../../../components/Magnetic/Magnetic'
import PitchLines from '../../../components/PitchLines/PitchLines'
import Reveal from '../../../components/Reveal/Reveal'
import SplitHeading from '../../../components/SplitHeading/SplitHeading'
import { imagenes, negocio } from '../../../data/negocio'

const RAZONES = [
  {
    titulo: 'Luz LED',
    texto: 'Juega de noche con excelente visibilidad en cada jugada.',
  },
  {
    titulo: 'Ambiente seguro y familiar',
    texto: 'Un espacio 100% seguro donde tu familia es bienvenida.',
  },
  {
    titulo: 'Mantenimiento constante',
    texto: 'Cuidamos el césped sintético para que disfrutes cada partido.',
  },
]

function Why() {
  const raiz = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add(MEDIA.motion, () => {
        gsap.from('.why__sticker', {
          scale: 0,
          rotate: -40,
          duration: 0.9,
          ease: 'back.out(2.4)',
          delay: 0.5,
          scrollTrigger: {
            trigger: '.why__sticker',
            start: 'top 92%',
            once: true,
          },
        })
      })

      return () => mm.revert()
    },
    { scope: raiz },
  )

  return (
    <section ref={raiz} className="py-7 position-relative overflow-hidden">
      <PitchLines
        className="position-absolute text-success opacity-25 d-none d-lg-block"
        style={{ width: '30rem', left: '-8rem', top: '50%', transform: 'translateY(-50%) rotate(-12deg)' }}
      />

      <Container className="position-relative">
        <Row className="align-items-center g-5">
          <Col lg={6}>
            <SplitHeading as="h2">Una cancha de confianza</SplitHeading>

            <Reveal delay={0.1}>
              <p className="lead text-body-secondary mt-3">
                Disfruta de nuestras canchas sintéticas y de la luz LED para
                tus partidos nocturnos, en un ambiente 100% seguro donde tu
                familia es bienvenida. Con mantenimiento constante para que
                disfrutes cada partido.
              </p>

              <ListGroup variant="flush" className="my-4">
                {RAZONES.map((razon) => (
                  <ListGroup.Item
                    key={razon.titulo}
                    className="bg-transparent px-0 py-3 border-start-0 border-end-0"
                  >
                    <strong className="d-block">{razon.titulo}</strong>
                    <span className="text-body-secondary">{razon.texto}</span>
                  </ListGroup.Item>
                ))}
              </ListGroup>

              <Magnetic>
                <Button
                  href={negocio.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="primary"
                  size="lg"
                  className="btn-sport"
                >
                  <span>
                    <Whatsapp /> Pregunta por tu espacio
                  </span>
                </Button>
              </Magnetic>
            </Reveal>
          </Col>

          <Col lg={6}>
            <div className="position-relative">
              <ImageReveal
                src={imagenes.canchaF5Detalle}
                alt="Cancha sintética de El Golazo vista desde la tribuna"
                aspecto="120%"
              />

              <div
                className="why__sticker position-absolute bottom-0 start-0 translate-middle-y ms-4 px-4 py-3 bg-info text-dark text-center shadow"
                style={{ transform: 'rotate(-5deg)' }}
              >
                <span className="font-display d-block fs-1 lh-1">
                  {negocio.experiencia}
                </span>
                <span className="fw-bold small">años de experiencia</span>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  )
}

export default Why
