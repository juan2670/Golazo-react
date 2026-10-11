import { Link } from 'react-router-dom'
import { Button } from 'react-bootstrap'

import CtaBand from '../../components/CtaBand/CtaBand'
import Magnetic from '../../components/Magnetic/Magnetic'
import Scoreboard from '../../components/Scoreboard/Scoreboard'
import { negocio } from '../../data/negocio'

import Courts from './sections/Courts'
import Hero from './sections/Hero'
import Reel from './sections/Reel'
import Services from './sections/Services'
import Visit from './sections/Visit'
import Why from './sections/Why'

function Home() {
  return (
    <>
      <Hero />
      <Scoreboard />
      <Why />
      <Courts />
      <Services />
      <Reel />
      <Visit />

      <CtaBand
        titulo="¿Listo para tu próximo partido?"
        texto="Reserva tu cancha hoy y reúne a tu equipo."
      >
        <Magnetic>
          <Button as={Link} to="/reservas" variant="info" size="lg" className="btn-sport">
            <span>Reservar ahora</span>
          </Button>
        </Magnetic>

        <Magnetic>
          <Button
            href={negocio.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            variant="outline-light"
            size="lg"
            className="btn-sport"
          >
            <span>Escribir por WhatsApp</span>
          </Button>
        </Magnetic>
      </CtaBand>
    </>
  )
}

export default Home
