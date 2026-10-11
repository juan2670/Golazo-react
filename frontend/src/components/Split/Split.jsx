import { Col, Container, Row } from 'react-bootstrap'
import { CheckLg } from 'react-bootstrap-icons'

import ImageReveal from '../ImageReveal/ImageReveal'
import Reveal from '../Reveal/Reveal'
import SplitHeading from '../SplitHeading/SplitHeading'

function Split({
  titulo,
  texto,
  items,
  imagen,
  alt,
  ratio = '4x3',
  aspecto,
  invertir = false,
  tinte = false,
  children,
}) {
  return (
    <section className={`py-6 ${tinte ? 'bg-body-tertiary' : ''}`.trim()}>
      <Container>
        <Row className="align-items-center g-5">
          <Col lg={6} className={invertir ? 'order-lg-2' : ''}>
            <SplitHeading as="h2">{titulo}</SplitHeading>

            <Reveal delay={0.1}>
              {texto && <p className="lead text-body-secondary mt-3">{texto}</p>}

              {items && (
                <ul className="list-unstyled d-grid gap-2 mt-4 mb-0">
                  {items.map((item) => (
                    <li key={item} className="d-flex align-items-start gap-2 fw-semibold">
                      <CheckLg className="text-success flex-shrink-0 mt-1" size={20} />
                      {item}
                    </li>
                  ))}
                </ul>
              )}

              {children && <div className="d-flex flex-wrap gap-3 mt-4">{children}</div>}
            </Reveal>
          </Col>

          <Col lg={6}>
            <ImageReveal src={imagen} alt={alt} ratio={ratio} aspecto={aspecto} />
          </Col>
        </Row>
      </Container>
    </section>
  )
}

export default Split
