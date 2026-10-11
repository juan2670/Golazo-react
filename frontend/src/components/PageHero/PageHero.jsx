import { useRef } from 'react'
import { Container } from 'react-bootstrap'

import { MEDIA, gsap, useGSAP } from '../../animations/gsap'
import { retrasoDeEntrada } from '../../animations/transition'
import SplitHeading from '../SplitHeading/SplitHeading'

function PageHero({ titulo, descripcion, imagen, children }) {
  const raiz = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add(MEDIA.motion, () => {
        gsap.to('.page-hero__media', {
          yPercent: 12,
          ease: 'none',
          scrollTrigger: {
            trigger: raiz.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        })

        gsap.from('.page-hero__lead, .page-hero__actions', {
          y: 26,
          opacity: 0,
          delay: 0.55 + retrasoDeEntrada(),
          stagger: 0.12,
        })
      })

      return () => mm.revert()
    },
    { scope: raiz },
  )

  return (
    <header ref={raiz} className="page-hero" data-bs-theme="dark">
      <img className="page-hero__media" src={imagen} alt="" />
      <div className="page-hero__shade" />
      <div className="page-hero__stripes pitch-stripes" />

      <Container className="page-hero__content">
        <SplitHeading
          as="h1"
          className="display-3 text-uppercase page-hero__title"
          alEntrar={false}
          delay={0.1}
        >
          {titulo}
        </SplitHeading>

        {descripcion && (
          <p className="lead page-hero__lead col-lg-6 mt-3 mb-0">
            {descripcion}
          </p>
        )}

        {children && <div className="page-hero__actions mt-4">{children}</div>}
      </Container>
    </header>
  )
}

export default PageHero
