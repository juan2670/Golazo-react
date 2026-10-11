import Lenis from 'lenis'
import 'lenis/dist/lenis.css'

import { MEDIA, ScrollTrigger, gsap } from './gsap'

let lenis = null

// Scroll suave con Lenis. Se sincroniza con GSAP: Lenis avanza en el mismo
// ticker (un solo bucle de animación) y le avisa a ScrollTrigger en cada
// movimiento, así los pines y los scrubs siguen el scroll suavizado.
// Con "reducir movimiento" no se activa y el navegador scrollea como siempre.
export function iniciarScrollSuave() {
  if (lenis || window.matchMedia(MEDIA.reduce).matches) return () => {}

  lenis = new Lenis({
    lerp: 0.12,
    // En táctil se deja el scroll nativo (inercia propia del sistema)
    syncTouch: false,
  })

  lenis.on('scroll', ScrollTrigger.update)

  const alAvanzar = (tiempo) => lenis?.raf(tiempo * 1000)

  gsap.ticker.add(alAvanzar)
  gsap.ticker.lagSmoothing(0)

  // Modales y menú lateral de Bootstrap bloquean el scroll del body: Lenis se
  // pausa mientras tanto para no mover la página que queda detrás.
  const vigilante = new MutationObserver(() => {
    const bloqueado =
      document.body.classList.contains('modal-open') ||
      getComputedStyle(document.body).overflow === 'hidden'

    if (bloqueado) lenis?.stop()
    else lenis?.start()
  })

  vigilante.observe(document.body, {
    attributes: true,
    attributeFilter: ['class', 'style'],
  })

  return () => {
    vigilante.disconnect()
    gsap.ticker.remove(alAvanzar)
    lenis?.destroy()
    lenis = null
  }
}

// Sube al inicio (cambio de página) sin animación, con o sin Lenis.
export function subirAlInicio() {
  if (lenis) lenis.scrollTo(0, { immediate: true, force: true })
  else window.scrollTo(0, 0)
}
