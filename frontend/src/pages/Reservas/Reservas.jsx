import { useCallback, useEffect, useState } from 'react'
import {
  Alert,
  Badge,
  Button,
  Card,
  Collapse,
  Container,
  Modal,
  Spinner,
} from 'react-bootstrap'

import Reveal from '../../components/Reveal/Reveal'
import ReservaAerea from '../../components/ReservaAerea/ReservaAerea'
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
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')

  const [misReservas, setMisReservas] = useState([])
  const [cargandoReservas, setCargandoReservas] = useState(true)
  const [cancelandoId, setCancelandoId] = useState(null)
  const [reservaPorCancelar, setReservaPorCancelar] = useState(null)
  const [mostrarHistorial, setMostrarHistorial] = useState(false)

  // Al cancelar una reserva sube este contador y la vista aérea vuelve a
  // pedir la disponibilidad al servidor
  const [versionDisponibilidad, setVersionDisponibilidad] = useState(0)

  // =====================================================
  // CARGAR MIS RESERVAS
  // =====================================================

  const cargarMisReservas = useCallback(async () => {
    try {
      setMisReservas(await api.get('/reservas/'))
    } catch (falla) {
      setError(falla.message)
    }
  }, [])

  useEffect(() => {
    let vigente = true

    api
      .get('/reservas/')
      .then((datos) => vigente && setMisReservas(datos))
      .catch((falla) => vigente && setError(falla.message))
      .finally(() => vigente && setCargandoReservas(false))

    return () => {
      vigente = false
    }
  }, [])

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

      await cargarMisReservas()
      setVersionDisponibilidad((version) => version + 1)

      setMensaje('Reserva cancelada correctamente.')
    } catch (falla) {
      setError(falla.message)
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
  // RENDER
  // =====================================================

  return (
    <section className="bg-body-tertiary min-vh-page py-6">
      <Container style={{ maxWidth: '90rem' }}>
        <header className="mb-5">
          <SplitHeading as="h1" className="display-5" alEntrar={false}>
            Reserva tu cancha
          </SplitHeading>

          <p className="lead text-body-secondary mt-3 mb-0">
            Elige la cancha, fecha y horario para organizar tu próximo partido.
          </p>
        </header>

        <Reveal>
          <ReservaAerea
            versionDisponibilidad={versionDisponibilidad}
            alCrearReserva={cargarMisReservas}
          />
        </Reveal>

        {error && (
          <Alert variant="danger" className="mt-4 mb-0">
            {error}
          </Alert>
        )}

        {mensaje && (
          <Alert variant="success" className="mt-4 mb-0">
            {mensaje}
          </Alert>
        )}

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
