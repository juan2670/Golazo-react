import { useRef } from 'react'

import { MEDIA, gsap, useGSAP } from '../../animations/gsap'

// Late una vez (1 → 1.2 → 1, 220 ms) cuando cambia `value`. No anima al
// montar: solo cuando el valor cambia de verdad. Con clics seguidos la
// animación se reinicia desde donde va (overwrite), no se encola.
function Bump({ value, className = '', children }) {
  const ref = useRef(null)
  const anterior = useRef(value)

  useGSAP(
    () => {
      if (anterior.current === value) return

      anterior.current = value

      // Sin movimiento: el número nuevo ya comunica el cambio.
      if (window.matchMedia(MEDIA.reduce).matches) return

      gsap.to(ref.current, {
        keyframes: [
          { scale: 1.2, duration: 0.11, ease: 'power2.out' },
          { scale: 1, duration: 0.11, ease: 'power2.out' },
        ],
        overwrite: true,
      })
    },
    { dependencies: [value], scope: ref },
  )

  return (
    <span ref={ref} className={`d-inline-block ${className}`.trim()}>
      {children}
    </span>
  )
}

export default Bump
