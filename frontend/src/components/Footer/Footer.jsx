import { Link } from 'react-router-dom'
import { Col, Container, Row } from 'react-bootstrap'
import {
  Facebook,
  Instagram,
  Tiktok,
  Whatsapp,
} from 'react-bootstrap-icons'

import { negocio } from '../../data/negocio'
import Reveal from '../Reveal/Reveal'
import logo from '../../assets/logo/logoGolazo.png'

const redes = {
  Instagram: Instagram,
  Facebook: Facebook,
  TikTok: Tiktok,
}

const enlaces = [
  { to: '/', texto: 'Inicio' },
  { to: '/servicios', texto: 'Servicios' },
  { to: '/torneos', texto: 'Torneos' },
  { to: '/reservas', texto: 'Reservas' },
  { to: '/tienda', texto: 'Tienda' },
  { to: '/nosotros', texto: 'Nosotros' },
]

function Footer() {
  return (
    <footer className="site-footer pt-6 pb-4" data-bs-theme="dark">
      <Container>
        <Row className="g-5">
          <Col lg={4}>
            <img src={logo} alt="El Golazo Club" height="96" />

            <p className="text-body-secondary mt-3 mb-4 col-xl-10">
              Canchas sintéticas de fútbol 5 y fútbol 8 en Soacha, con luz LED
              y un ambiente seguro para toda la familia.
            </p>

            <ul className="list-unstyled d-flex flex-wrap gap-2 mb-0">
              {negocio.redes.map((red) => {
                const Icono = redes[red.nombre]

                return (
                  <li key={red.nombre}>
                    <a
                      href={red.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline-light d-inline-flex align-items-center justify-content-center rounded-circle p-0"
                      style={{ width: '2.8rem', height: '2.8rem' }}
                      aria-label={red.nombre}
                    >
                      <Icono size={18} />
                    </a>
                  </li>
                )
              })}

              <li>
                <a
                  href={negocio.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-light d-inline-flex align-items-center justify-content-center rounded-circle p-0"
                  style={{ width: '2.8rem', height: '2.8rem' }}
                  aria-label="WhatsApp"
                >
                  <Whatsapp size={18} />
                </a>
              </li>
            </ul>
          </Col>

          <Col xs={6} lg={2}>
            <h2 className="h5 text-info mb-3">Explorar</h2>

            <ul className="list-unstyled d-grid gap-2 mb-0">
              {enlaces.map((enlace) => (
                <li key={enlace.to}>
                  <Link to={enlace.to}>{enlace.texto}</Link>
                </li>
              ))}
            </ul>
          </Col>

          <Col xs={6} lg={3}>
            <h2 className="h5 text-info mb-3">Horario</h2>

            <p className="mb-1">{negocio.horario.dias}</p>
            <p className="text-body-secondary mb-3">{negocio.horario.horas}</p>

            <Link to="/ubicacion">Cómo llegar</Link>
          </Col>

          <Col lg={3}>
            <h2 className="h5 text-info mb-3">Contacto</h2>

            <ul className="list-unstyled d-grid gap-2 mb-0">
              <li>
                <a href={negocio.mapaHref} target="_blank" rel="noopener noreferrer">
                  {negocio.direccion}
                </a>
              </li>
              <li>
                <a href={negocio.telefonoHref}>{negocio.telefono}</a>
              </li>
              <li>
                <a href={`mailto:${negocio.email}`}>{negocio.email}</a>
              </li>
            </ul>
          </Col>
        </Row>

        <Reveal y={90}>
          <div className="site-footer__wordmark font-display" aria-hidden="true">
            El Golazo
          </div>
        </Reveal>

        <div className="d-flex flex-column flex-md-row justify-content-between gap-2 border-top pt-3 mt-3 small text-body-secondary">
          <span>
            © {new Date().getFullYear()} {negocio.nombre}. Todos los derechos
            reservados.
          </span>

          <span>Hecho para los que viven el fútbol.</span>
        </div>
      </Container>
    </footer>
  )
}

export default Footer
