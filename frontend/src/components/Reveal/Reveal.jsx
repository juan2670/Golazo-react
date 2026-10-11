import { useRef } from 'react'

import { MEDIA, gsap, useGSAP } from '../../animations/gsap'

// Entrada al hacer scroll. Con `stagger` anima los hijos directos uno a uno.
function Reveal({
  as: Tag = 'div',
  y = 28,
  delay = 0,
  stagger = 0,
  className,
  children,
  ...resto
}) {
  const ref = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add(MEDIA.motion, () => {
        const destinos = stagger ? ref.current.children : ref.current

        gsap.from(destinos, {
          y,
          opacity: 0,
          delay,
          stagger,
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: ref.current,
            start: 'top 88%',
            once: true,
          },
        })
      })

      return () => mm.revert()
    },
    { scope: ref },
  )

  return (
    <Tag ref={ref} className={className} {...resto}>
      {children}
    </Tag>
  )
}

export default Reveal
