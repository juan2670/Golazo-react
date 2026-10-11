import { useRef } from 'react'
import { Whatsapp } from 'react-bootstrap-icons'

import { MEDIA, gsap, useGSAP } from '../../animations/gsap'
import { negocio } from '../../data/negocio'

function WhatsAppButton() {
  const anillo = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add(MEDIA.motion, () => {
        gsap.fromTo(
          anillo.current,
          { scale: 1, opacity: 0.8 },
          {
            scale: 1.8,
            opacity: 0,
            duration: 1.9,
            ease: 'power1.out',
            repeat: -1,
          },
        )
      })

      return () => mm.revert()
    },
    { scope: anillo },
  )

  return (
    <a
      className="whatsapp-fab"
      href={negocio.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
    >
      <span ref={anillo} className="whatsapp-fab__ring" />
      <Whatsapp size={28} />
    </a>
  )
}

export default WhatsAppButton
