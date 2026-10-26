// La vista 3D se muestra siempre que el navegador tenga WebGL.
// La lista queda disponible para elegir cancha y como respaldo si WebGL falla.

function hayWebGL() {
  try {
    const lienzo = document.createElement('canvas')

    return Boolean(
      lienzo.getContext('webgl2') ||
        lienzo.getContext('webgl') ||
        lienzo.getContext('experimental-webgl'),
    )
  } catch {
    return false
  }
}

export function detectarSoporte() {
  const webgl = hayWebGL()
  const sinMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Con hover real (mouse) se resalta la cancha bajo el cursor; en táctil el
  // hover se queda pegado después de tocar, así que no se usa.
  const conHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches

  return { webgl, sinMovimiento, conHover }
}
