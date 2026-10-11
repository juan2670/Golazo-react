import { useRef } from 'react'

import { MEDIA, gsap, useGSAP } from '../../animations/gsap'

// El botón se acerca al cursor. Solo con mouse y sin "reducir movimiento".
function Magnetic({ fuerza = 0.35, className = '', children }) {
  const ref = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add(`${MEDIA.motion} and ${MEDIA.fine}`, () => {
        const elemento = ref.current
        const moverX = gsap.quickTo(elemento, 'x', {
          duration: 0.35,
          ease: 'power3.out',
        })
        const moverY = gsap.quickTo(elemento, 'y', {
          duration: 0.35,
          ease: 'power3.out',
        })

        const alMover = (evento) => {
          const caja = elemento.getBoundingClientRect()
          const centroX =
            caja.left + caja.width / 2 - Number(gsap.getProperty(elemento, 'x'))
          const centroY =
            caja.top + caja.height / 2 - Number(gsap.getProperty(elemento, 'y'))

          moverX((evento.clientX - centroX) * fuerza)
          moverY((evento.clientY - centroY) * fuerza)
        }

        const alSalir = () => {
          moverX(0)
          moverY(0)
        }

        elemento.addEventListener('pointermove', alMover)
        elemento.addEventListener('pointerleave', alSalir)

        return () => {
          elemento.removeEventListener('pointermove', alMover)
          elemento.removeEventListener('pointerleave', alSalir)
        }
      })

      return () => mm.revert()
    },
    { scope: ref },
  )

  return (
    <span ref={ref} className={`d-inline-block ${className}`.trim()}>
      {children}
    </span>
  )
}

export default Magnetic
