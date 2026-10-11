import { Link } from 'react-router-dom'
import { Button, Col, Container, Row } from 'react-bootstrap'
import {
  ClockFill,
  EnvelopeFill,
  GeoAltFill,
  TelephoneFill,
} from 'react-bootstrap-icons'

import Magnetic from '../../components/Magnetic/Magnetic'
import PageHero from '../../components/PageHero/PageHero'
import Reveal from '../../components/Reveal/Reveal'
import { imagenes, negocio } from '../../data/negocio'

function Dato({ icono: Icono, titulo, children }) {
  return (
    <div className="d-flex gap-3 py-4 border-bottom">
      <Icono className="text-success flex-shrink-0 mt-1" size={22} />

      <div>
        <h2 className="h5 mb-1">{titulo}</h2>
        {children}
      </div>
    </div>
  )
}

function Ubicacion() {
  return (
    <>
      <PageHero
        titulo="Ven a jugar"
        descripcion="Estamos en Soacha, Cundinamarca, con parqueadero y zona social para ti y tu equipo."
        imagen={imagenes.canchaF5}
      />

      <section className="py-7">
        <Container>
          <Row className="g-5">
            <Col lg={7}>
              <Reveal>
                <div className="map-frame ratio ratio-4x3 chamfer">
                  <iframe
                    title="Mapa de El Golazo Club en Soacha"
                    src={negocio.mapaEmbed}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                  />
                </div>
              </Reveal>
            </Col>

            <Col lg={5}>
              <Reveal delay={0.1}>
                <Dato icono={GeoAltFill} titulo="Dirección">
                  <p className="mb-3">{negocio.direccion}</p>

                  <Button
                    href={negocio.mapaHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="primary"
                    size="sm"
                  >
                    Abrir en Google Maps
                  </Button>
                </Dato>

                <Dato icono={ClockFill} titulo="Horario de atención">
                  <p className="mb-0">{negocio.horario.dias}</p>
                  <p className="font-display fs-3 text-success mb-0">
                    {negocio.horario.horas}
                  </p>
                </Dato>

                <Dato icono={TelephoneFill} titulo="Teléfono">
                  <a href={negocio.telefonoHref}>{negocio.telefono}</a>
                </Dato>

                <Dato icono={EnvelopeFill} titulo="Correo">
                  <a href={`mailto:${negocio.email}`} className="text-break">
                    {negocio.email}
                  </a>
                </Dato>

                <div className="d-flex flex-wrap gap-3 pt-4">
                  <Magnetic>
                    <Button
                      href={negocio.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="outline-primary"
                      className="btn-sport"
                    >
                      <span>WhatsApp</span>
                    </Button>
                  </Magnetic>

                  <Magnetic>
                    <Button as={Link} to="/reservas" variant="primary" className="btn-sport">
                      <span>Reservar cancha</span>
                    </Button>
                  </Magnetic>
                </div>
              </Reveal>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  )
}

export default Ubicacion
