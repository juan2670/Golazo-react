import { Suspense, useEffect, useRef, useState } from 'react'
import { Routes, useLocation, useNavigationType } from 'react-router-dom'

import { MEDIA, ScrollTrigger, gsap } from '../animations/gsap'
import { subirAlInicio } from '../animations/smoothScroll'
import { marcarCambioDePagina } from '../animations/transition'

const BARRAS = 7

// Cambia de página con franjas de césped que cubren y destapan la pantalla.
function AnimatedRoutes({ children }) {
  const ubicacion = useLocation()
  const tipoNavegacion = useNavigationType()
  const [mostrada, setMostrada] = useState(ubicacion)

  // Las redirecciones (<Navigate replace>, por ejemplo de una página privada a
  // /login) cambian de página sin cortina: si la página vieja siguiera montada
  // durante la cortina, redirigiría otra vez en cada render y React entraría
  // en un bucle ("Maximum update depth exceeded").
  const redireccion = tipoNavegacion === 'REPLACE'

  if (redireccion && ubicacion.pathname !== mostrada.pathname) {
    setMostrada(ubicacion)
  }
  const mostradaActual = useRef(ubicacion)
  const cortina = useRef(null)
  const [sinMovimiento] = useState(
    () => window.matchMedia(MEDIA.reduce).matches,
  )

  useEffect(() => {
    if (sinMovimiento || redireccion) {
      // Si la redirección llega a mitad de una cortina, la retira
      if (redireccion && cortina.current) {
        gsap.set(cortina.current.children, { scaleY: 0 })
        gsap.set(cortina.current, { visibility: 'hidden' })
        marcarCambioDePagina(false)
      }

      mostradaActual.current = ubicacion
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
  }, [ubicacion, sinMovimiento, redireccion])

  const rutaActiva =
    sinMovimiento || redireccion || ubicacion.pathname === mostrada.pathname
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
