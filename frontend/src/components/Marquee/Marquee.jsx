import { useRef } from 'react'

import { MEDIA, ScrollTrigger, gsap, useGSAP } from '../../animations/gsap'
import Ball from '../Ball/Ball'

// Cartel corrido. Invierte el sentido cuando se hace scroll hacia arriba
// y acelera con la velocidad del scroll.
function Marquee({
  items,
  repeticiones = 2,
  velocidad = 80,
  inverso = false,
  conBalon = true,
  claseTexto = '',
  className = '',
}) {
  const pista = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add(MEDIA.motion, () => {
        const elemento = pista.current
        const duracion = () => elemento.scrollWidth / 2 / velocidad

        const giro = gsap.fromTo(
          elemento,
          { xPercent: inverso ? -50 : 0 },
          {
            xPercent: inverso ? 0 : -50,
            ease: 'none',
            duration: duracion(),
            repeat: -1,
          },
        )

        const ajustar = gsap.quickTo(giro, 'timeScale', {
          duration: 0.5,
          ease: 'power2.out',
        })
        let sentido = 1

        const disparador = ScrollTrigger.create({
          start: 0,
          end: 'max',
          onUpdate: (self) => {
            sentido = self.direction
            const impulso = 1 + Math.min(Math.abs(self.getVelocity()) / 500, 4)

            ajustar(sentido * impulso)
          },
        })

        const alTerminar = () => ajustar(sentido)

        ScrollTrigger.addEventListener('scrollEnd', alTerminar)

        const observador = new ResizeObserver(() => giro.duration(duracion()))

        observador.observe(elemento)

        return () => {
          disparador.kill()
          ScrollTrigger.removeEventListener('scrollEnd', alTerminar)
          observador.disconnect()
        }
      })

      return () => mm.revert()
    },
    { scope: pista },
  )

  const grupo = (clave, oculto) => (
    <div key={clave} className="marquee__group" aria-hidden={oculto || undefined}>
      {Array.from({ length: repeticiones }).flatMap((_, vuelta) =>
        items.map((texto) => (
          <span className="marquee__item" key={`${vuelta}-${texto}`}>
            <span className={claseTexto || undefined}>{texto}</span>
            {conBalon && <Ball className="marquee__ball" />}
          </span>
        )),
      )}
    </div>
  )

  return (
    <div className={`marquee ${className}`.trim()} aria-hidden="true">
      <div ref={pista} className="marquee__track">
        {grupo('a', false)}
        {grupo('b', true)}
      </div>
    </div>
  )
}

export default Marquee
