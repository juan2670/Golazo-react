import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import {
  Badge,
  Button,
  Container,
  Nav,
  Navbar,
  Offcanvas,
} from 'react-bootstrap'
import { Cart3 } from 'react-bootstrap-icons'

import { ScrollTrigger, useGSAP } from '../../animations/gsap'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { RUTAS_CON_HERO } from '../../routes/rutasConHero'
import Bump from '../Bump/Bump'
import ThemeToggle from '../ThemeToggle/ThemeToggle'
import logo from '../../assets/logo/logoGolazo.png'

const enlaces = [
  { to: '/', texto: 'Inicio', exacto: true },
  { to: '/servicios', texto: 'Servicios' },
  { to: '/torneos', texto: 'Torneos' },
  { to: '/reservas', texto: 'Reservas' },
  { to: '/tienda', texto: 'Tienda' },
  { to: '/nosotros', texto: 'Nosotros' },
  { to: '/ubicacion', texto: 'Ubicación' },
]

function SiteNavbar() {
  const { pathname } = useLocation()
  const { usuario, autenticado, logout } = useAuth()
  const { cantidadTotal } = useCart()

  const [abierto, setAbierto] = useState(false)
  const [desplazado, setDesplazado] = useState(false)

  useGSAP(() => {
    const disparador = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => setDesplazado(self.scroll() > 24),
    })

    return () => disparador.kill()
  })

  const sobreHero =
    RUTAS_CON_HERO.includes(pathname) && !desplazado && !abierto

  const cerrar = () => setAbierto(false)

  const cuenta = autenticado ? (
    <>
      <Button
        as={Link}
        to="/perfil"
        variant="outline-primary"
        onClick={cerrar}
      >
        {usuario?.nombre || 'Mi perfil'}
      </Button>

      <Button
        variant="link"
        className="text-body-secondary"
        onClick={() => {
          cerrar()
          logout()
        }}
      >
        Cerrar sesión
      </Button>
    </>
  ) : (
    <Button
      as={Link}
      to="/login"
      variant="primary"
      className="btn-sport"
      onClick={cerrar}
    >
      <span>Iniciar sesión</span>
    </Button>
  )

  return (
    <Navbar
      expand="xl"
      fixed="top"
      expanded={abierto}
      onToggle={setAbierto}
      className={`site-nav ${sobreHero ? 'site-nav--clear' : 'site-nav--solid'}`}
      data-bs-theme={sobreHero ? 'dark' : undefined}
    >
      <Container className="gap-2">
        <Navbar.Brand as={Link} to="/" className="me-auto me-xl-4 py-0" onClick={cerrar}>
          <img className="site-nav__logo" src={logo} alt="El Golazo Club" />
        </Navbar.Brand>

        <Navbar.Offcanvas
          id="menu-principal"
          placement="end"
          aria-labelledby="menu-principal-titulo"
        >
          <Offcanvas.Header closeButton closeLabel="Cerrar menú">
            <Offcanvas.Title id="menu-principal-titulo" as="div" className="h4 mb-0">
              Menú
            </Offcanvas.Title>
          </Offcanvas.Header>

          <Offcanvas.Body className="d-xl-flex">
            <Nav className="mx-xl-auto gap-xl-1 flex-grow-0">
              {enlaces.map((enlace) => (
                <Nav.Link
                  key={enlace.to}
                  as={NavLink}
                  to={enlace.to}
                  end={enlace.exacto}
                  onClick={cerrar}
                >
                  {enlace.texto}
                </Nav.Link>
              ))}
            </Nav>

            <div className="d-grid gap-2 mt-4 d-xl-none">{cuenta}</div>
          </Offcanvas.Body>
        </Navbar.Offcanvas>

        <div className="d-flex align-items-center gap-1">
          <ThemeToggle />

          <Button
            as={Link}
            to="/carrito"
            variant="link"
            className="position-relative p-2 lh-1 text-body"
            aria-label={`Carrito, ${cantidadTotal} productos`}
            onClick={cerrar}
          >
            <Cart3 size={26} />

            {/* El contenedor queda siempre montado para que también lata al pasar de 0 a 1 */}
            <span className="site-nav__cart-badge">
              <Bump value={cantidadTotal}>
                {cantidadTotal > 0 && (
                  <Badge bg="info" text="dark" pill>
                    {cantidadTotal}
                  </Badge>
                )}
              </Bump>
            </span>
          </Button>

          <div className="d-none d-xl-flex align-items-center gap-2 ms-2">
            {cuenta}
          </div>

          <Navbar.Toggle
            aria-controls="menu-principal"
            aria-label="Abrir menú"
            className="ms-1"
          />
        </div>
      </Container>
    </Navbar>
  )
}

export default SiteNavbar
