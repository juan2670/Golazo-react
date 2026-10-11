import { Link } from 'react-router-dom'
import { Badge, Button, Col, Container, Row } from 'react-bootstrap'
import {
  Facebook,
  GeoAltFill,
  Instagram,
  TelephoneFill,
  Tiktok,
} from 'react-bootstrap-icons'

import Magnetic from '../../../components/Magnetic/Magnetic'
import Reveal from '../../../components/Reveal/Reveal'
import SplitHeading from '../../../components/SplitHeading/SplitHeading'
import { negocio } from '../../../data/negocio'

const ICONOS = { Instagram, Facebook, TikTok: Tiktok }

function Visit() {
  return (
    <section className="py-7 bg-body-tertiary">
      <Container>
        <Row className="g-5 align-items-center">
          <Col lg={7}>
            <Reveal className="ticket-wrap">
              <div className="ticket">
                <div className="ticket__main p-4 p-md-5">
                  <Badge bg="info" text="dark" className="mb-3">
                    Horario de atención
                  </Badge>

                  <h2 className="display-6 mb-2">{negocio.horario.dias}</h2>

                  <p className="font-display fs-3 text-success mb-4">
                    {negocio.horario.horas}
                  </p>

                  <ul className="list-unstyled d-grid gap-2 mb-0">
                    <li className="d-flex gap-2 align-items-start">
                      <GeoAltFill className="mt-1 text-success flex-shrink-0" />
                      {negocio.direccion}
                    </li>
                    <li className="d-flex gap-2 align-items-center">
                      <TelephoneFill className="text-success flex-shrink-0" />
                      <a href={negocio.telefonoHref}>{negocio.telefono}</a>
                    </li>
                  </ul>
                </div>

                <div className="ticket__stub p-4 text-center">
                  <p className="fw-bold mb-3">Tu cancha te espera</p>

                  <Magnetic>
                    <Button
                      as={Link}
                      to="/reservas"
                      variant="primary"
                      className="btn-sport"
                    >
                      <span>Reservar</span>
                    </Button>
                  </Magnetic>

                  <div className="ticket__bars mt-4" aria-hidden="true" />
                </div>
              </div>
            </Reveal>
          </Col>

          <Col lg={5}>
            <SplitHeading as="h2" className="display-6">
              Síguenos
            </SplitHeading>

            <Reveal delay={0.1}>
              <p className="lead text-body-secondary mt-3">
                Mira los partidos y las novedades del club en nuestras redes.
              </p>

              <div className="d-flex flex-wrap gap-2">
                {negocio.redes.map((red) => {
                  const Icono = ICONOS[red.nombre]

                  return (
                    <Button
                      key={red.nombre}
                      href={red.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="outline-primary"
                    >
                      <Icono className="me-2" />
                      {red.nombre}
                    </Button>
                  )
                })}
              </div>
            </Reveal>
          </Col>
        </Row>
      </Container>
    </section>
  )
}

export default Visit
