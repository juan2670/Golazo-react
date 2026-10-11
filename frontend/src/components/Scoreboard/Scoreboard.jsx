import { Col, Container, Row } from 'react-bootstrap'

import { negocio } from '../../data/negocio'
import Counter from '../Counter/Counter'
import Reveal from '../Reveal/Reveal'

const CIFRAS = [
  {
    valor: Number(negocio.experiencia.replace('+', '')),
    prefijo: '+',
    etiqueta: 'años de experiencia',
  },
  { valor: 2, etiqueta: 'tipos de cancha: fútbol 5 y 8' },
  { valor: 7, etiqueta: 'días a la semana' },
  { texto: 'LED', etiqueta: 'iluminación para jugar de noche' },
]

function Scoreboard() {
  return (
    <section
      className="scoreboard"
      data-bs-theme="dark"
      aria-label="El Golazo en cifras"
    >
      <Container>
        <Reveal as={Row} stagger={0.12} className="g-4">
          {CIFRAS.map((cifra) => (
            <Col
              xs={6}
              md={3}
              key={cifra.etiqueta}
              className="scoreboard__cell ps-md-4"
            >
              <div className="scoreboard__digit">
                {cifra.texto ?? (
                  <Counter value={cifra.valor} prefix={cifra.prefijo} />
                )}
              </div>

              <p className="mb-0 mt-2 text-body-secondary">{cifra.etiqueta}</p>
            </Col>
          ))}
        </Reveal>
      </Container>
    </section>
  )
}

export default Scoreboard
