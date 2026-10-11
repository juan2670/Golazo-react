import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { Button, Container } from 'react-bootstrap'

import { MEDIA, gsap, useGSAP } from '../../animations/gsap'
import { retrasoDeEntrada } from '../../animations/transition'
import Ball from '../../components/Ball/Ball'
import Magnetic from '../../components/Magnetic/Magnetic'

function NotFound() {
  const raiz = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add(MEDIA.motion, () => {
        gsap.from('.nf__cifra', {
          yPercent: 120,
          rotate: 10,
          opacity: 0,
          duration: 1,
          ease: 'power4.out',
          stagger: 0.12,
          delay: retrasoDeEntrada(),
        })

        // El balón de la 404 rueda sin parar.
        gsap.to('.nf__balon', {
          rotation: 360,
          duration: 2.6,
          ease: 'none',
          repeat: -1,
        })

        gsap.from('.nf__texto > *', {
          y: 24,
          opacity: 0,
          stagger: 0.12,
          delay: 0.6 + retrasoDeEntrada(),
        })
      })

      return () => mm.revert()
    },
    { scope: raiz },
  )

  return (
    <section
      ref={raiz}
      className="min-vh-page d-flex align-items-center bg-body-tertiary pitch-stripes"
    >
      <Container className="text-center py-6">
        <p
          className="display-1 text-outline d-flex justify-content-center align-items-center gap-2 mb-4"
          aria-label="Error 404"
        >
          <span className="nf__cifra d-inline-block" aria-hidden="true">4</span>
          <Ball
            className="nf__balon nf__cifra"
            style={{ width: '0.8em', height: '0.8em' }}
          />
          <span className="nf__cifra d-inline-block" aria-hidden="true">4</span>
        </p>

        <div className="nf__texto">
          <h1 className="display-6 mb-3">Esta jugada se fue al lateral</h1>

          <p className="lead text-body-secondary mx-auto mb-4" style={{ maxWidth: '30rem' }}>
            La página que buscas no existe o cambió de lugar. Volvamos al partido.
          </p>

          <div className="d-flex flex-wrap justify-content-center gap-3">
            <Magnetic>
              <Button as={Link} to="/" variant="primary" size="lg" className="btn-sport">
                <span>Ir al inicio</span>
              </Button>
            </Magnetic>

            <Magnetic>
              <Button as={Link} to="/reservas" variant="outline-primary" size="lg" className="btn-sport">
                <span>Reservar cancha</span>
              </Button>
            </Magnetic>
          </div>
        </div>
      </Container>
    </section>
  )
}

export default NotFound
