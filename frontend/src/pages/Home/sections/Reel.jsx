import { useRef } from 'react'

import { MEDIA, gsap, useGSAP } from '../../../animations/gsap'
import { imagenes, videos } from '../../../data/negocio'

const PANELES = [
  { tipo: 'imagen', forma: 'portrait', src: imagenes.partidoNoche, titulo: 'Partido de noche', alt: 'Partido nocturno con público en la tribuna' },
  { tipo: 'imagen', forma: 'landscape', src: imagenes.canchaF5, titulo: 'Fútbol 5', alt: 'Canchas de fútbol 5 en un día soleado' },
  { tipo: 'video', forma: 'wide', src: videos.dron, poster: imagenes.dronNoche, titulo: 'Vista aérea', alt: 'Video aéreo de las canchas de El Golazo' },
  { tipo: 'imagen', forma: 'portrait', src: imagenes.partidoNocheFemenino, titulo: 'Bajo los reflectores', alt: 'Partido nocturno bajo la luz LED' },
  { tipo: 'imagen', forma: 'landscape', src: imagenes.canchaF8, titulo: 'Fútbol 8', alt: 'Partido de fútbol 8' },
  { tipo: 'imagen', forma: 'portrait', src: imagenes.zonaSocial, titulo: 'Zona social', alt: 'Zona social del club' },
]

function Reel() {
  const raiz = useRef(null)
  const pista = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add(`${MEDIA.motion} and ${MEDIA.desktop}`, () => {
        const distancia = () =>
          Math.max(0, pista.current.scrollWidth - window.innerWidth)

        // La sección se queda fija y la galería avanza con el scroll.
        const recorrido = gsap.to(pista.current, {
          x: () => -distancia(),
          ease: 'none',
          scrollTrigger: {
            trigger: raiz.current,
            start: 'top top',
            end: () => `+=${distancia()}`,
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        })

        // Cada foto se desliza un poco dentro de su marco.
        gsap.utils.toArray('.reel__panel').forEach((panel) => {
          gsap.fromTo(
            panel.querySelector('img, video'),
            { xPercent: 6 },
            {
              xPercent: -6,
              ease: 'none',
              scrollTrigger: {
                trigger: panel,
                containerAnimation: recorrido,
                start: 'left right',
                end: 'right left',
                scrub: true,
              },
            },
          )
        })
      })

      return () => mm.revert()
    },
    { scope: raiz },
  )

  return (
    <section
      ref={raiz}
      className="reel bg-body-secondary"
      aria-label="Galería de El Golazo"
    >
      <div ref={pista} className="reel__track">
        <div className="reel__intro">
          <h2 className="display-5">Así se vive El Golazo</h2>

          <p className="lead text-body-secondary mt-3 mb-0">
            <span className="d-none d-lg-inline">Sigue bajando para recorrer el club.</span>
            <span className="d-lg-none">Desliza para ver más.</span>
          </p>
        </div>

        {PANELES.map((panel) => (
          <figure
            key={panel.titulo}
            className={`reel__panel reel__panel--${panel.forma} chamfer`}
            style={{ '--cut': '2rem' }}
          >
            {panel.tipo === 'video' ? (
              <video
                src={panel.src}
                poster={panel.poster}
                autoPlay
                muted
                loop
                playsInline
                preload="none"
                aria-label={panel.alt}
              />
            ) : (
              <img src={panel.src} alt={panel.alt} loading="lazy" />
            )}

            <figcaption>{panel.titulo}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}

export default Reel
