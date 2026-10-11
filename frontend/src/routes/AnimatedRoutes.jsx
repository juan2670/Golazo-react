import { Suspense, useEffect, useRef, useState } from 'react'
import { Routes, useLocation } from 'react-router-dom'

import { MEDIA, ScrollTrigger, gsap } from '../animations/gsap'
import { subirAlInicio } from '../animations/smoothScroll'
import { marcarCambioDePagina } from '../animations/transition'

const BARRAS = 7

// Cambia de página con franjas de césped que cubren y destapan la pantalla.
function AnimatedRoutes({ children }) {
  const ubicacion = useLocation()
  const [mostrada, setMostrada] = useState(ubicacion)
  const mostradaActual = useRef(ubicacion)
  const cortina = useRef(null)
  const [sinMovimiento] = useState(
    () => window.matchMedia(MEDIA.reduce).matches,
  )

  useEffect(() => {
    if (sinMovimiento) {
      subirAlInicio()
      return undefined
    }

    if (ubicacion.pathname === mostradaActual.current.pathname) {
      return undefined
    }

    const barras = cortina.current.children

    marcarCambioDePagina(true)

    const linea = gsap.timeline()

    linea
      .set(cortina.current, { visibility: 'visible' })
      .set(barras, { transformOrigin: 'bottom' })
      .to(barras, {
        scaleY: 1,
        duration: 0.24,
        ease: 'power3.out',
        stagger: 0.025,
      })
      .add(() => {
        subirAlInicio()
        mostradaActual.current = ubicacion
        setMostrada(ubicacion)
      })
      .set(barras, { transformOrigin: 'top' }, '+=0.04')
      .to(barras, {
        scaleY: 0,
        duration: 0.26,
        ease: 'power3.out',
        stagger: 0.025,
      })
      .add(() => {
        marcarCambioDePagina(false)
        gsap.set(cortina.current, { visibility: 'hidden' })
        ScrollTrigger.refresh()
      })

    return () => {
      linea.kill()
    }
  }, [ubicacion, sinMovimiento])

  const rutaActiva =
    sinMovimiento || ubicacion.pathname === mostrada.pathname
      ? ubicacion
      : mostrada

  return (
    <>
      <Suspense fallback={<div className="min-vh-page" />}>
        <Routes location={rutaActiva}>{children}</Routes>
      </Suspense>

      <div ref={cortina} className="page-transition" aria-hidden="true">
        {Array.from({ length: BARRAS }, (_, indice) => (
          <span key={indice} />
        ))}
      </div>
    </>
  )
}

export default AnimatedRoutes
