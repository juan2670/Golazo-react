import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import { iniciarScrollSuave } from '../animations/smoothScroll'

import Footer from '../components/Footer/Footer'
import Navbar from '../components/Navbar/Navbar'
import ScrollProgress from '../components/ScrollProgress/ScrollProgress'
import WhatsAppButton from '../components/WhatsAppButton/WhatsAppButton'
import { RUTAS_CON_HERO } from '../routes/rutasConHero'

function MainLayout({ children }) {
  const { pathname } = useLocation()
  const conHero = RUTAS_CON_HERO.includes(pathname)

  useEffect(() => iniciarScrollSuave(), [])

  return (
    <>
      <a href="#contenido" className="visually-hidden-focusable skip-link btn btn-info">
        Saltar al contenido
      </a>

      <ScrollProgress />

      <Navbar />

      <main id="contenido" className={conHero ? '' : 'main-offset'}>
        {children}
      </main>

      <Footer />

      <WhatsAppButton />
    </>
  )
}

export default MainLayout
