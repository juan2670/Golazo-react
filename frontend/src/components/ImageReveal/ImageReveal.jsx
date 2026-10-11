import { useRef } from 'react'

import { MEDIA, gsap, useGSAP } from '../../animations/gsap'

const RECORTE_FINAL =
  'polygon(0% 0%, 92% 0%, 100% 8%, 100% 100%, 8% 100%, 0% 92%)'
const RECORTE_INICIAL =
  'polygon(0% 100%, 92% 100%, 100% 100%, 100% 100%, 8% 100%, 0% 100%)'

// Imagen con esquinas biseladas: se destapa desde abajo y se mueve con el scroll.
function ImageReveal({
  src,
  alt,
  ratio = '4x3',
  aspecto,
  parallax = true,
  className = '',
  imgClassName = '',
}) {
  const marco = useRef(null)
  const imagen = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add(MEDIA.motion, () => {
        gsap.fromTo(
          marco.current,
          { clipPath: RECORTE_INICIAL },
          {
            clipPath: RECORTE_FINAL,
            duration: 0.9,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: marco.current,
              start: 'top 85%',
              once: true,
            },
          },
        )

        if (parallax) {
          gsap.fromTo(
            imagen.current,
            { yPercent: -7, scale: 1.18 },
            {
              yPercent: 7,
              ease: 'none',
              scrollTrigger: {
                trigger: marco.current,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
              },
            },
          )
        }
      })

      return () => mm.revert()
    },
    { scope: marco },
  )

  return (
    <div
      ref={marco}
      className={`ratio ${aspecto ? '' : `ratio-${ratio}`} overflow-hidden ${className}`.replace(/\s+/g, ' ').trim()}
      style={{
        clipPath: RECORTE_FINAL,
        ...(aspecto ? { '--bs-aspect-ratio': aspecto } : {}),
      }}
    >
      <img
        ref={imagen}
        src={src}
        alt={alt}
        loading="lazy"
        className={`object-fit-cover ${imgClassName}`.trim()}
      />
    </div>
  )
}

export default ImageReveal
