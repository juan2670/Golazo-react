import { useState } from 'react'
import './Reservas.css'

const canchas = [
  {
    id: 1,
    nombre: 'Cancha 1',
    tipo: 'Fútbol 5',
    precio: 50000,
  },
  {
    id: 2,
    nombre: 'Cancha 2',
    tipo: 'Fútbol 5',
    precio: 55000,
  },
  {
    id: 3,
    nombre: 'Cancha 3',
    tipo: 'Fútbol 8',
    precio: 70000,
  },
]

const horarios = [
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
  '20:00',
  '21:00',
  '22:00',
  '23:00',
]

function Reservas() {
  const [canchaId, setCanchaId] = useState('')
  const [fecha, setFecha] = useState('')
  const [hora, setHora] = useState('')
  const [duracion, setDuracion] = useState('1')
  const [mensaje, setMensaje] = useState('')

  const canchaSeleccionada = canchas.find(
    (cancha) => cancha.id === Number(canchaId),
  )

  const precioBase = canchaSeleccionada?.precio || 0

  const total = precioBase * Number(duracion)

  const horariosDisponibles = horarios.filter((horario) => {
    const horaInicio = Number(horario.split(':')[0])
    const horas = Number(duracion)

    return horaInicio + horas <= 24
  })

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!canchaId || !fecha || !hora) {
      setMensaje('Completa todos los campos para continuar.')
      return
    }

    setMensaje(
      `Reserva seleccionada: ${canchaSeleccionada.nombre}, ${fecha} a las ${hora}.`,
    )
  }

  return (
    <section className="reservas">
      <div className="reservas__header">
        <p>RESERVAS</p>

        <h1>Reserva tu cancha</h1>

        <span>
          Elige la cancha, fecha y horario para organizar tu próximo partido.
        </span>
      </div>

      <div className="reservas__content">
        <form className="reservas__card" onSubmit={handleSubmit}>
          <h2>Encuentra tu horario</h2>

          <div className="reservas__form">
            <div className="form__group">
              <label htmlFor="cancha">Cancha</label>

              <select
                id="cancha"
                value={canchaId}
                onChange={(event) => setCanchaId(event.target.value)}
              >
                <option value="">Selecciona una cancha</option>

                {canchas.map((cancha) => (
                  <option key={cancha.id} value={cancha.id}>
                    {cancha.nombre} — {cancha.tipo}
                  </option>
                ))}
              </select>
            </div>

            <div className="form__group">
              <label htmlFor="fecha">Fecha</label>

              <input
                id="fecha"
                type="date"
                value={fecha}
                onChange={(event) => setFecha(event.target.value)}
              />
            </div>

            <div className="form__group">
              <label htmlFor="hora">Hora</label>

              <select
                id="hora"
                value={hora}
                onChange={(event) => setHora(event.target.value)}
              >
                <option value="">Selecciona una hora</option>

                {horariosDisponibles.map((horario) => (
                  <option key={horario} value={horario}>
                    {horario}
                  </option>
                ))}
              </select>
            </div>

            <div className="form__group">
              <label htmlFor="duracion">Duración</label>

              <select
                id="duracion"
                value={duracion}
                onChange={(event) => setDuracion(event.target.value)}
              >
                <option value="1">1 hora</option>
                <option value="2">2 horas</option>
              </select>
            </div>
          </div>

          <div className="reservas__summary">
            <span>Total estimado</span>

            <strong>
              ${total.toLocaleString('es-CO')}
            </strong>
          </div>

          <button type="submit">
            Continuar con la reserva
          </button>

          {mensaje && (
            <p className="reservas__message">
              {mensaje}
            </p>
          )}
        </form>
      </div>
    </section>
  )
}

export default Reservas