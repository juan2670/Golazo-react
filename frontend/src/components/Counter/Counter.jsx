import { useRef } from 'react'

import { MEDIA, gsap, useGSAP } from '../../animations/gsap'

// Contador de marcador: cuenta de 0 al valor cuando entra en pantalla.
function Counter({ value, prefix = '', suffix = '', className = '' }) {
  const ref = useRef(null)

  useGSAP(
    () => {
      const elemento = ref.current
      const final = `${prefix}${value}${suffix}`

      elemento.textContent = final

      const mm = gsap.matchMedia()

      mm.add(MEDIA.motion, () => {
        const estado = { n: 0 }

        elemento.textContent = `${prefix}0${suffix}`

        gsap.to(estado, {
          n: value,
          duration: 1.8,
          ease: 'power2.out',
          snap: { n: 1 },
          scrollTrigger: {
            trigger: elemento,
            start: 'top 92%',
            once: true,
          },
          onUpdate: () => {
            elemento.textContent = `${prefix}${estado.n}${suffix}`
          },
        })
      })

      return () => mm.revert()
    },
    { scope: ref },
  )

  return <span ref={ref} className={className} />
}

export default Counter
