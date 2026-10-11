import { useEffect, useState } from 'react'
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Collapse,
  Container,
  FloatingLabel,
  Form,
  Modal,
  Row,
  Spinner,
} from 'react-bootstrap'

import Reveal from '../../components/Reveal/Reveal'
import SplitHeading from '../../components/SplitHeading/SplitHeading'
import { api } from '../../services/api'

function TarjetaReserva({ reserva, cancelada = false, cancelando, alCancelar }) {
  return (
    <Card
      className={`border-0 shadow-sm border-start border-5 ${
        cancelada ? 'border-secondary opacity-75' : 'border-success'
      }`}
    >
      <Card.Body className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 entra">
        <div>
          <small className="text-success fw-bold">Reserva #{reserva.id}</small>

          <h3 className="h4 my-1">Cancha {reserva.cancha_id}</h3>

          <p className="text-body-secondary mb-0">
            {reserva.fecha} · {reserva.hora_inicio.slice(0, 5)} -{' '}
            {reserva.hora_fin.slice(0, 5)}
          </p>
        </div>

        <div className="d-flex flex-wrap align-items-center gap-3">
          <strong className="fs-5">
            ${Number(reserva.total).toLocaleString('es-CO')}
          </strong>

          <Badge
            bg={cancelada ? 'secondary' : 'success'}
            className="text-uppercase"
          >
            {cancelada ? 'cancelada' : reserva.estado}
          </Badge>

          {!cancelada && (
            <Button
              type="button"
              variant="outline-danger"
              size="sm"
              disabled={cancelando}
              onClick={alCancelar}
            >
              {cancelando ? 'Cancelando…' : 'Cancelar reserva'}
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  )
}

function Reservas() {
  const [canchas, setCanchas] = useState([])
  const [canchaId, setCanchaId] = useState('')
  const [fecha, setFecha] = useState('')
  const [hora, setHora] = useState('')
  const [duracion, setDuracion] = useState('1')
  const [horarios, setHorarios] = useState([])

  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')

  const [cargandoCanchas, setCargandoCanchas] = useState(true)
  const [cargandoHorarios, setCargandoHorarios] = useState(false)
  const [reservando, setReservando] = useState(false)

  const [misReservas, setMisReservas] = useState([])
  const [cargandoReservas, setCargandoReservas] = useState(true)
  const [cancelandoId, setCancelandoId] = useState(null)
  const [reservaPorCancelar, setReservaPorCancelar] = useState(null)
  const [mostrarHistorial, setMostrarHistorial] = useState(false)

  const canchaSeleccionada = canchas.find(
    (cancha) => cancha.id === Number(canchaId),
  )

  const precioBase = canchaSeleccionada
    ? Number(canchaSeleccionada.precio_hora)
    : 0

  const totalEstimado = precioBase * Number(duracion)

  // =====================================================
  // CARGAR CANCHAS
  // =====================================================

  useEffect(() => {
    const cargarCanchas = async () => {
      try {
        setCargandoCanchas(true)
        setError('')

        const data = await api.get('/canchas/')

        setCanchas(data)
      } catch (error) {
        setError(error.message)
      } finally {
        setCargandoCanchas(false)
      }
    }

    cargarCanchas()
  }, [])

  // =====================================================
  // CARGAR MIS RESERVAS
  // =====================================================

  useEffect(() => {
    const cargarMisReservas = async () => {
      try {
        setCargandoReservas(true)

        const data = await api.get('/reservas/')

        setMisReservas(data)
      } catch (error) {
        setError(error.message)
      } finally {
        setCargandoReservas(false)
      }
    }

    cargarMisReservas()
  }, [])

  // =====================================================
  // CARGAR DISPONIBILIDAD
  // =====================================================

  useEffect(() => {
    if (!canchaId || !fecha) {
      setHorarios([])
      setHora('')
      return
    }

    const cargarDisponibilidad = async () => {
      try {
        setCargandoHorarios(true)
        setError('')
        setHora('')

        const data = await api.get(
          `/reservas/disponibilidad?cancha_id=${canchaId}&fecha=${fecha}`,
        )

        setHorarios(data.horarios)
      } catch (error) {
        setHorarios([])
        setError(error.message)
      } finally {
        setCargandoHorarios(false)
      }
    }

    cargarDisponibilidad()
  }, [canchaId, fecha])

  // =====================================================
  // HORARIOS DISPONIBLES
  // =====================================================

  const horariosDisponibles = horarios.filter((horario, index) => {
    if (!horario.disponible) {
      return false
    }

    const horas = Number(duracion)

    for (let i = 0; i < horas; i++) {
      const siguienteHorario = horarios[index + i]

      if (!siguienteHorario || !siguienteHorario.disponible) {
        return false
      }
    }

    return true
  })

  // =====================================================
  // CREAR RESERVA
  // =====================================================

  const handleSubmit = async (event) => {
    event.preventDefault()

    setMensaje('')
    setError('')

    if (!canchaId || !fecha || !hora) {
      setError('Completa todos los campos para continuar.')
      return
    }

    const horaInicio = Number(hora.split(':')[0])
    const horaFin = horaInicio + Number(duracion)

    const horaFinFormateada =
      horaFin === 24
        ? '00:00'
        : `${String(horaFin).padStart(2, '0')}:00`

    try {
      setReservando(true)

      const reserva = await api.post('/reservas/', {
        cancha_id: Number(canchaId),
        fecha,
        hora_inicio: hora,
        hora_fin: horaFinFormateada,
      })

      setMensaje(
        `Reserva creada correctamente. Cancha: ${canchaSeleccionada.nombre}, ${reserva.fecha} de ${reserva.hora_inicio.slice(0, 5)} a ${reserva.hora_fin.slice(0, 5)}.`,
      )

      setHora('')

      // Actualizar disponibilidad
      const disponibilidad = await api.get(
        `/reservas/disponibilidad?cancha_id=${canchaId}&fecha=${fecha}`,
      )

      setHorarios(disponibilidad.horarios)

      // Actualizar mis reservas
      const reservasActualizadas = await api.get('/reservas/')

      setMisReservas(reservasActualizadas)
    } catch (error) {
      setError(error.message)
    } finally {
      setReservando(false)
    }
  }

  // =====================================================
  // CANCELAR RESERVA
  // =====================================================

  const handleCancelar = async (reservaId) => {
    setReservaPorCancelar(null)

    try {
      setCancelandoId(reservaId)
      setError('')
      setMensaje('')

      await api.patch(`/reservas/${reservaId}/cancelar`)

      const reservasActualizadas = await api.get('/reservas/')

      setMisReservas(reservasActualizadas)

      // Actualizar disponibilidad si la reserva
      // pertenece a la cancha y fecha actualmente seleccionadas.
      const reservaCancelada = reservasActualizadas.find(
        (reserva) => reserva.id === reservaId,
      )

      if (
        canchaId &&
        fecha &&
        reservaCancelada &&
        reservaCancelada.cancha_id === Number(canchaId) &&
        reservaCancelada.fecha === fecha
      ) {
        const disponibilidad = await api.get(
          `/reservas/disponibilidad?cancha_id=${canchaId}&fecha=${fecha}`,
        )

        setHorarios(disponibilidad.horarios)
      }

      setMensaje('Reserva cancelada correctamente.')
    } catch (error) {
      setError(error.message)
    } finally {
      setCancelandoId(null)
    }
  }

  // =====================================================
  // SEPARAR RESERVAS
  // =====================================================

  const reservasActivas = misReservas.filter(
    (reserva) => reserva.estado !== 'cancelada',
  )

  const reservasCanceladas = misReservas.filter(
    (reserva) => reserva.estado === 'cancelada',
  )

  // =====================================================
  // FECHA MÍNIMA
  // =====================================================

  const fechaMinima = new Date()
    .toISOString()
    .split('T')[0]

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <section className="bg-body-tertiary min-vh-page py-6">
      <Container style={{ maxWidth: '64rem' }}>
        <header className="mb-5">
          <SplitHeading as="h1" className="display-5" alEntrar={false}>
            Reserva tu cancha
          </SplitHeading>

          <p className="lead text-body-secondary mt-3 mb-0">
            Elige la cancha, fecha y horario para organizar tu próximo partido.
          </p>
        </header>

        <Reveal>
          <Form onSubmit={handleSubmit}>
            <Card className="border-0 shadow">
              <Card.Body className="p-4 p-md-5">
                <h2 className="h3 mb-4">Encuentra tu horario</h2>

                <Row className="g-3">
                  <Col md={6}>
                    <FloatingLabel controlId="cancha" label="Cancha">
                      <Form.Select
                        value={canchaId}
                        onChange={(event) => {
                          setCanchaId(event.target.value)
                          setHora('')
                          setMensaje('')
                          setError('')
                        }}
                        disabled={cargandoCanchas}
                      >
                        <option value="">
                          {cargandoCanchas
                            ? 'Cargando canchas…'
                            : 'Selecciona una cancha'}
                        </option>

                        {canchas.map((cancha) => (
                          <option key={cancha.id} value={cancha.id}>
                            {cancha.nombre} — {cancha.tipo}
                          </option>
                        ))}
                      </Form.Select>
                    </FloatingLabel>
                  </Col>

                  <Col md={6}>
                    <FloatingLabel controlId="fecha" label="Fecha">
                      <Form.Control
                        type="date"
                        value={fecha}
                        min={fechaMinima}
                        onChange={(event) => {
                          setFecha(event.target.value)
                          setMensaje('')
                          setError('')
                        }}
                      />
                    </FloatingLabel>
                  </Col>

                  <Col md={6}>
                    <FloatingLabel controlId="hora" label="Hora">
                      <Form.Select
                        value={hora}
                        onChange={(event) => {
                          setHora(event.target.value)
                          setMensaje('')
                          setError('')
                        }}
                        disabled={!canchaId || !fecha || cargandoHorarios}
                      >
                        <option value="">
                          {cargandoHorarios
                            ? 'Consultando disponibilidad…'
                            : 'Selecciona una hora'}
                        </option>

                        {horariosDisponibles.map((horario) => (
                          <option
                            key={horario.hora_inicio}
                            value={horario.hora_inicio}
                          >
                            {horario.hora_inicio}
                          </option>
                        ))}
                      </Form.Select>
                    </FloatingLabel>
                  </Col>

                  <Col md={6}>
                    <FloatingLabel controlId="duracion" label="Duración">
                      <Form.Select
                        value={duracion}
                        onChange={(event) => {
                          setDuracion(event.target.value)
                          setHora('')
                          setMensaje('')
                          setError('')
                        }}
                      >
                        <option value="1">1 hora</option>
                        <option value="2">2 horas</option>
                      </Form.Select>
                    </FloatingLabel>
                  </Col>
                </Row>

                <div className="d-flex justify-content-between align-items-baseline border-top mt-4 pt-4">
                  <span className="text-body-secondary fw-bold">
                    Total estimado
                  </span>

                  <strong className="font-display fs-2 text-success">
                    ${totalEstimado.toLocaleString('es-CO')}
                  </strong>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-100 mt-4"
                  disabled={reservando}
                >
                  {reservando ? 'Creando reserva…' : 'Continuar con la reserva'}
                </Button>

                {error && (
                  <Alert variant="danger" className="mt-3 mb-0">
                    {error}
                  </Alert>
                )}

                {mensaje && (
                  <Alert variant="success" className="mt-3 mb-0">
                    {mensaje}
                  </Alert>
                )}
              </Card.Body>
            </Card>
          </Form>
        </Reveal>

        {/* ================= MIS RESERVAS ================= */}

        <section className="mt-6" aria-labelledby="mis-reservas">
          <h2 id="mis-reservas" className="display-6 mb-4">
            Próximos partidos
          </h2>

          {cargandoReservas ? (
            <div className="d-flex align-items-center gap-3 text-body-secondary">
              <Spinner animation="border" size="sm" />
              Cargando tus reservas…
            </div>
          ) : reservasActivas.length === 0 ? (
            <div className="border border-2 border-dashed rounded-3 bg-body p-5 text-center">
              <p className="fw-bold mb-1">No tienes reservas activas</p>

              <p className="text-body-secondary mb-0">
                Cuando reserves una cancha, aparecerá aquí.
              </p>
            </div>
          ) : (
            <Reveal className="d-grid gap-3" stagger={0.1} y={24}>
              {reservasActivas.map((reserva) => (
                <TarjetaReserva
                  key={reserva.id}
                  reserva={reserva}
                  cancelando={cancelandoId === reserva.id}
                  alCancelar={() => setReservaPorCancelar(reserva.id)}
                />
              ))}
            </Reveal>
          )}

          {reservasCanceladas.length > 0 && (
            <div className="mt-5 border-top pt-3">
              <Button
                type="button"
                variant="link"
                className="text-body-secondary px-0 fw-bold text-decoration-none"
                aria-expanded={mostrarHistorial}
                aria-controls="historial-reservas"
                onClick={() => setMostrarHistorial(!mostrarHistorial)}
              >
                Historial de reservas ({reservasCanceladas.length}){' '}
                {mostrarHistorial ? '−' : '+'}
              </Button>

              <Collapse in={mostrarHistorial}>
                <div id="historial-reservas">
                  <div className="d-grid gap-3 pt-3">
                    {reservasCanceladas.map((reserva) => (
                      <TarjetaReserva
                        key={reserva.id}
                        reserva={reserva}
                        cancelada
                      />
                    ))}
                  </div>
                </div>
              </Collapse>
            </div>
          )}
        </section>
      </Container>

      <Modal
        show={reservaPorCancelar !== null}
        onHide={() => setReservaPorCancelar(null)}
        centered
      >
        <Modal.Header closeButton closeLabel="Cerrar">
          <Modal.Title as="h2" className="h4">
            Cancelar reserva
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          ¿Seguro que quieres cancelar la reserva #{reservaPorCancelar}? Esta
          acción libera el horario para otras personas.
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="outline-secondary"
            onClick={() => setReservaPorCancelar(null)}
          >
            Mantener reserva
          </Button>

          <Button
            variant="danger"
            onClick={() => handleCancelar(reservaPorCancelar)}
          >
            Cancelar reserva
          </Button>
        </Modal.Footer>
      </Modal>
    </section>
  )
}

export default Reservas
