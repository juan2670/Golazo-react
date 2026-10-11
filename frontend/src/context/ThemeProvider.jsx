import { useCallback, useEffect, useMemo, useState } from 'react'
import { flushSync } from 'react-dom'

import { ThemeContext } from './ThemeContext'

const STORAGE_KEY = 'golazo_theme'

function leerPreferencia() {
  try {
    const guardado = localStorage.getItem(STORAGE_KEY)

    if (guardado === 'light' || guardado === 'dark') return guardado
  } catch {
    // sin acceso al almacenamiento: se usa la preferencia del sistema
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(leerPreferencia)

  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', theme)
  }, [theme])

  useEffect(() => {
    const consulta = window.matchMedia('(prefers-color-scheme: dark)')

    const alCambiarSistema = (evento) => {
      try {
        if (localStorage.getItem(STORAGE_KEY)) return
      } catch {
        // se sigue al sistema
      }

      setTheme(evento.matches ? 'dark' : 'light')
    }

    consulta.addEventListener('change', alCambiarSistema)

    return () => consulta.removeEventListener('change', alCambiarSistema)
  }, [])

  const toggleTheme = useCallback(
    (evento) => {
      const siguiente = theme === 'dark' ? 'light' : 'dark'

      const aplicar = () => {
        document.documentElement.setAttribute('data-bs-theme', siguiente)
        setTheme(siguiente)
      }

      try {
        localStorage.setItem(STORAGE_KEY, siguiente)
      } catch {
        // el cambio sigue funcionando sin guardarse
      }

      const sinMovimiento = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches

      if (!document.startViewTransition || sinMovimiento) {
        aplicar()
        return
      }

      const caja = evento?.currentTarget?.getBoundingClientRect()
      const x = caja ? caja.left + caja.width / 2 : window.innerWidth / 2
      const y = caja ? caja.top + caja.height / 2 : 0
      const radio = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y),
      )

      const transicion = document.startViewTransition(() => {
        flushSync(aplicar)
      })

      transicion.ready.then(() => {
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${radio}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: 700,
            easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
            pseudoElement: '::view-transition-new(root)',
          },
        )
      })
    },
    [theme],
  )

  const valor = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme])

  return <ThemeContext.Provider value={valor}>{children}</ThemeContext.Provider>
}
