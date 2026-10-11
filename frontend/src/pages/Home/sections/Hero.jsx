import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Container } from 'react-bootstrap'
import { Whatsapp } from 'react-bootstrap-icons'

import { MEDIA, SplitText, gsap, useGSAP } from '../../../animations/gsap'
import { retrasoDeEntrada } from '../../../animations/transition'
import Magnetic from '../../../components/Magnetic/Magnetic'
import Marquee from '../../../components/Marquee/Marquee'
import { negocio, videos } from '../../../data/negocio'

const SERVICIOS = [
  'Fútbol 5',
  'Fútbol 8',
  'Luz LED',
  'Torneos y ligas',
  'Eventos',
  'Zona social',
  'Parqueadero',
]

// Parpadeo de reflectores: sube y baja la opacidad en saltos bruscos y luego se estabiliza.
const parpadeo = (valores, final) => [
  ...valores.map((opacity, indice) => ({
    opacity,
    duration: indice % 2 ? 0.12 : 0.07,
  })),
  { opacity: final, duration: 0.9, ease: 'power2.out' },
]

function Hero() {
  const raiz = useRef(null)
  const [sinMovimiento] = useState(
    () => window.matchMedia(MEDIA.reduce).matches,
  )

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add(MEDIA.motion, () => {
        const inicio = retrasoDeEntrada()

        // Los focos se encienden sobre la cancha.
        const encendido = gsap.timeline({ delay: inicio + 0.3 })

        encendido
          .to(
            '.hero__dark',
            {
              keyframes: parpadeo([0.55, 0.96, 0.3, 0.85, 0.12, 0.5], 0),
              ease: 'none',
            },
            0,
          )
          .to(
            '.hero__bloom',
            {
              keyframes: parpadeo([0.5, 0, 0.8, 0.2, 0.95, 0.6], 0.55),
              ease: 'none',
            },
            0,
          )

        // Con la cancha iluminada entra el titular, letra por letra.
        SplitText.create('.hero__title', {
          type: 'lines,chars',
          mask: 'lines',
          linesClass: 'split-line',
          autoSplit: true,
          onSplit: (division) =>
            gsap.from(division.chars, {
              yPercent: 125,
              rotate: 7,
              duration: 0.8,
              ease: 'power4.out',
              stagger: 0.022,
              delay: inicio + 0.9,
            }),
        })

        gsap.from('.hero__lead, .hero__actions > *', {
          y: 28,
          opacity: 0,
          stagger: 0.12,
          delay: inicio + 1.7,
        })

        gsap.from('.hero__ticker', {
          yPercent: 100,
          duration: 1,
          delay: inicio + 1.9,
        })

        // Al hacer scroll, la cancha se acerca y el texto se va.
        gsap.to('.hero__media', {
          scale: 1.14,
          yPercent: 8,
          ease: 'none',
          scrollTrigger: {
            trigger: raiz.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        })

        gsap.to('.hero__content', {
          yPercent: -14,
          opacity: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: raiz.current,
            start: 'top top',
            end: '65% top',
            scrub: true,
          },
        })
      })

      return () => mm.revert()
    },
    { scope: raiz },
  )

  return (
    <section
      ref={raiz}
      className="hero"
      data-bs-theme="dark"
      aria-labelledby="hero-titulo"
    >
      {sinMovimiento ? (
        <img className="hero__media" src={videos.heroPoster} alt="" />
      ) : (
        <video
          className="hero__media"
          src={videos.hero}
          poster={videos.heroPoster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        />
      )}

      <div className="hero__shade" />
      <div className="hero__dark" />
      <div className="hero__bloom hero__bloom--left" />
      <div className="hero__bloom hero__bloom--right" />

      <Container className="hero__content">
        <h1 id="hero-titulo" className="hero__title display-1 text-uppercase">
          Tu partido empieza en El Golazo
        </h1>


        <p className="hero__lead lead mt-4">
          Canchas sintéticas de fútbol 5 y fútbol 8 con luz LED en Soacha.
          Reserva en línea o por WhatsApp.
        </p>

        <div className="hero__actions d-flex flex-wrap gap-3 mt-4">
          <Magnetic>
            <Button
              as={Link}
              to="/reservas"
              variant="info"
              size="lg"
              className="btn-sport"
            >
              <span>Reservar cancha</span>
            </Button>
          </Magnetic>

          <Magnetic>
            <Button
              href={negocio.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              variant="outline-light"
              size="lg"
              className="btn-sport"
            >
              <span>
                <Whatsapp /> Escribir por WhatsApp
              </span>
            </Button>
          </Magnetic>
        </div>
      </Container>

      <Marquee
        className="hero__ticker font-display text-uppercase py-3"
        claseTexto="led-text"
        items={SERVICIOS}
        velocidad={70}
      />
    </section>
  )
}

export default Hero
