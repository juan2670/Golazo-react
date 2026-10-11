import { Col, Container, Row } from 'react-bootstrap'

import Marquee from '../Marquee/Marquee'
import SplitHeading from '../SplitHeading/SplitHeading'

function CtaBand({ titulo, texto, children }) {
  return (
    <section className="cta-band py-6" data-bs-theme="dark">
      <Marquee
        className="cta-band__marquee font-display text-uppercase"
        items={['Reserva tu cancha']}
        conBalon={false}
        velocidad={60}
        repeticiones={3}
      />

      <Container className="position-relative">
        <Row className="align-items-center g-4">
          <Col lg={7}>
            <SplitHeading as="h2" className="display-5 text-uppercase">
              {titulo}
            </SplitHeading>

            {texto && <p className="lead mt-3 mb-0">{texto}</p>}
          </Col>

          <Col lg={5} className="d-flex flex-wrap gap-3 justify-content-lg-end">
            {children}
          </Col>
        </Row>
      </Container>
    </section>
  )
}

export default CtaBand
