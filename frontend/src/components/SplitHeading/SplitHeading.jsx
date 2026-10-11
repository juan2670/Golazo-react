import { useRef } from 'react'

import { MEDIA, SplitText, gsap, useGSAP } from '../../animations/gsap'
import { retrasoDeEntrada } from '../../animations/transition'

// Título que sube línea por línea dentro de una máscara.
function SplitHeading({
  as: Tag = 'h2',
  delay = 0,
  alEntrar = true,
  className,
  children,
  ...resto
}) {
  const ref = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add(MEDIA.motion, () => {
        SplitText.create(ref.current, {
          type: 'lines',
          mask: 'lines',
          linesClass: 'split-line',
          autoSplit: true,
          onSplit: (division) =>
            gsap.from(division.lines, {
              yPercent: 115,
              duration: 0.8,
              ease: 'power4.out',
              stagger: 0.08,
              delay: delay + retrasoDeEntrada(),
              scrollTrigger: alEntrar
                ? { trigger: ref.current, start: 'top 90%', once: true }
                : undefined,
            }),
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

export default SplitHeading
