import { useRef } from 'react'
import { Button } from 'react-bootstrap'
import { MoonStarsFill, SunFill } from 'react-bootstrap-icons'

import { MEDIA, gsap, useGSAP } from '../../animations/gsap'
import { useTheme } from '../../context/useTheme'

function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme } = useTheme()
  const icono = useRef(null)
  const anterior = useRef(theme)

  useGSAP(
    () => {
      if (anterior.current === theme) return

      anterior.current = theme

      if (window.matchMedia(MEDIA.reduce).matches) return

      gsap.fromTo(
        icono.current,
        { rotate: -140, scale: 0.3, opacity: 0 },
        { rotate: 0, scale: 1, opacity: 1, duration: 0.8, ease: 'back.out(2.2)' },
      )
    },
    { dependencies: [theme], scope: icono },
  )

  const esNoche = theme === 'dark'
  const etiqueta = esNoche ? 'Cambiar a modo día' : 'Cambiar a modo noche'

  return (
    <Button
      variant="link"
      className={`p-2 lh-1 text-body ${className}`.trim()}
      onClick={toggleTheme}
      aria-label={etiqueta}
      title={etiqueta}
    >
      <span ref={icono} className="d-inline-flex fs-5">
        {esNoche ? <SunFill /> : <MoonStarsFill />}
      </span>
    </Button>
  )
}

export default ThemeToggle
