import { useRef } from 'react'

import { MEDIA, gsap, useGSAP } from '../../animations/gsap'

function ScrollProgress() {
  const barra = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add(MEDIA.motion, () => {
        gsap.to(barra.current, {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: { start: 0, end: 'max', scrub: 0.3 },
        })
      })

      return () => mm.revert()
    },
    { scope: barra },
  )

  return (
    <div className="scroll-progress" aria-hidden="true">
      <div ref={barra} className="scroll-progress__bar" />
    </div>
  )
}

export default ScrollProgress
