import { useEffect, useState } from 'react'

import { api } from '../../services/api'

import './Reservas.css'

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
        `Reserva creada correctamente. Cancha: ${canchaSeleccionada.nombre}, ${reserva.fecha} de ${reserva.hora_inicio} a ${reserva.hora_fin}.`,
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
    const confirmar = window.confirm(
      '¿Estás seguro de que quieres cancelar esta reserva?',
    )

    if (!confirmar) {
      return
    }

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
    <section className="reservas">
      {/* =================================================
          HEADER
      ================================================== */}

      <div className="reservas__header">
        <p>RESERVAS</p>

        <h1>Reserva tu cancha</h1>

        <span>
          Elige la cancha, fecha y horario para organizar
          tu próximo partido.
        </span>
      </div>

      <div className="reservas__content">
        {/* =================================================
            FORMULARIO
        ================================================== */}

        <form
          className="reservas__card"
          onSubmit={handleSubmit}
        >
          <h2>Encuentra tu horario</h2>

          <div className="reservas__form">
            {/* CANCHA */}

            <div className="form__group">
              <label htmlFor="cancha">
                Cancha
              </label>

              <select
                id="cancha"
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
                    ? 'Cargando canchas...'
                    : 'Selecciona una cancha'}
                </option>

                {canchas.map((cancha) => (
                  <option
                    key={cancha.id}
                    value={cancha.id}
                  >
                    {cancha.nombre} — {cancha.tipo}
                  </option>
                ))}
              </select>
            </div>

            {/* FECHA */}

            <div className="form__group">
              <label htmlFor="fecha">
                Fecha
              </label>

              <input
                id="fecha"
                type="date"
                value={fecha}
                min={fechaMinima}
                onChange={(event) => {
                  setFecha(event.target.value)
                  setMensaje('')
                  setError('')
                }}
              />
            </div>

            {/* HORA */}

            <div className="form__group">
              <label htmlFor="hora">
                Hora
              </label>

              <select
                id="hora"
                value={hora}
                onChange={(event) => {
                  setHora(event.target.value)
                  setMensaje('')
                  setError('')
                }}
                disabled={
                  !canchaId ||
                  !fecha ||
                  cargandoHorarios
                }
              >
                <option value="">
                  {cargandoHorarios
                    ? 'Consultando disponibilidad...'
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
              </select>
            </div>

            {/* DURACIÓN */}

            <div className="form__group">
              <label htmlFor="duracion">
                Duración
              </label>

              <select
                id="duracion"
                value={duracion}
                onChange={(event) => {
                  setDuracion(event.target.value)
                  setHora('')
                  setMensaje('')
                  setError('')
                }}
              >
                <option value="1">
                  1 hora
                </option>

                <option value="2">
                  2 horas
                </option>
              </select>
            </div>
          </div>

          {/* TOTAL */}

          <div className="reservas__summary">
            <span>
              Total estimado
            </span>

            <strong>
              ${totalEstimado.toLocaleString('es-CO')}
            </strong>
          </div>

          {/* BOTÓN */}

          <button
            type="submit"
            disabled={reservando}
          >
            {reservando
              ? 'Creando reserva...'
              : 'Continuar con la reserva'}
          </button>

          {/* ERROR */}

          {error && (
            <p className="reservas__message reservas__message--error">
              {error}
            </p>
          )}

          {/* MENSAJE */}

          {mensaje && (
            <p className="reservas__message reservas__message--success">
              {mensaje}
            </p>
          )}
        </form>

        {/* =================================================
            MIS RESERVAS
        ================================================== */}

        <div className="reservas__mis-reservas">
          <div className="reservas__mis-reservas-header">
            <p>MIS RESERVAS</p>

            <h2>Próximos partidos</h2>
          </div>

          {/* RESERVAS ACTIVAS */}

          {cargandoReservas ? (
            <p className="reservas__message">
              Cargando tus reservas...
            </p>
          ) : reservasActivas.length === 0 ? (
            <div className="reservas__empty">
              <span>
                NO TIENES RESERVAS ACTIVAS
              </span>

              <p>
                Cuando reserves una cancha,
                aparecerá aquí.
              </p>
            </div>
          ) : (
            <div className="reservas__list">
              {reservasActivas.map((reserva) => (
                <article
                  className="reserva__item"
                  key={reserva.id}
                >
                  <div className="reserva__info">
                    <span>
                      RESERVA #{reserva.id}
                    </span>

                    <h3>
                      Cancha {reserva.cancha_id}
                    </h3>

                    <p>
                      {reserva.fecha}
                    </p>

                    <p>
                      {reserva.hora_inicio.slice(0, 5)}
                      {' - '}
                      {reserva.hora_fin.slice(0, 5)}
                    </p>
                  </div>

                  <div className="reserva__details">
                    <strong>
                      $
                      {Number(reserva.total).toLocaleString(
                        'es-CO',
                      )}
                    </strong>

                    <span
                      className={`reserva__estado reserva__estado--${reserva.estado}`}
                    >
                      {reserva.estado}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        handleCancelar(reserva.id)
                      }
                      disabled={
                        cancelandoId === reserva.id
                      }
                    >
                      {cancelandoId === reserva.id
                        ? 'Cancelando...'
                        : 'Cancelar reserva'}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* =================================================
              HISTORIAL
          ================================================== */}

          {reservasCanceladas.length > 0 && (
            <div className="reservas__historial">
              <button
                type="button"
                className="reservas__historial-toggle"
                onClick={() =>
                  setMostrarHistorial(
                    !mostrarHistorial,
                  )
                }
              >
                <span>
                  HISTORIAL DE RESERVAS
                </span>

                <span className="reservas__historial-arrow">
                  {mostrarHistorial ? '−' : '+'}
                </span>
              </button>

              {mostrarHistorial && (
                <div className="reservas__list reservas__list--historial">
                  {reservasCanceladas.map(
                    (reserva) => (
                      <article
                        className="reserva__item reserva__item--cancelada"
                        key={reserva.id}
                      >
                        <div className="reserva__info">
                          <span>
                            RESERVA #{reserva.id}
                          </span>

                          <h3>
                            Cancha {reserva.cancha_id}
                          </h3>

                          <p>
                            {reserva.fecha}
                          </p>

                          <p>
                            {reserva.hora_inicio.slice(0, 5)}
                            {' - '}
                            {reserva.hora_fin.slice(0, 5)}
                          </p>
                        </div>

                        <div className="reserva__details">
                          <strong>
                            $
                            {Number(
                              reserva.total,
                            ).toLocaleString('es-CO')}
                          </strong>

                          <span className="reserva__estado reserva__estado--cancelada">
                            cancelada
                          </span>
                        </div>
                      </article>
                    ),
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default Reservas
