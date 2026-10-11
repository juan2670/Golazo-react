import { useRef } from 'react'

import { MEDIA, gsap, useGSAP } from '../../animations/gsap'

function PitchLines({ className = '', style }) {
  const raiz = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add(MEDIA.motion, () => {
        gsap.fromTo(
          raiz.current.querySelectorAll('.pl'),
          { drawSVG: '0%' },
          {
            drawSVG: '100%',
            duration: 2.4,
            ease: 'power2.inOut',
            stagger: 0.18,
            scrollTrigger: {
              trigger: raiz.current,
              start: 'top 85%',
              once: true,
            },
          },
        )
      })

      return () => mm.revert()
    },
    { scope: raiz },
  )

  return (
    <svg
      ref={raiz}
      viewBox="0 0 400 600"
      className={className}
      style={style}
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      aria-hidden="true"
      focusable="false"
    >
      <rect className="pl" x="10" y="10" width="380" height="580" />
      <line className="pl" x1="10" y1="300" x2="390" y2="300" />
      <circle className="pl" cx="200" cy="300" r="62" />
      <rect className="pl" x="90" y="10" width="220" height="104" />
      <rect className="pl" x="145" y="10" width="110" height="42" />
      <path className="pl" d="M156 114A52 52 0 0 0 244 114" />
      <rect className="pl" x="90" y="486" width="220" height="104" />
      <rect className="pl" x="145" y="548" width="110" height="42" />
      <path className="pl" d="M156 486A52 52 0 0 1 244 486" />
    </svg>
  )
}

export default PitchLines
