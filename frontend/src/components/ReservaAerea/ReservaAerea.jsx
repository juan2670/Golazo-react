import { Component, Suspense, lazy, useEffect, useMemo, useState } from 'react'
import { Alert, Button } from 'react-bootstrap'
import {
  CheckCircleFill,
  CircleFill,
  HourglassSplit,
  MoonStarsFill,
  SunFill,
  XCircleFill,
} from 'react-bootstrap-icons'

import { api } from '../../services/api'
import CalendarioMes from './CalendarioMes'
import { fechaLocal } from './fechas'
import { distribuir } from './geometriaCanchas'
import { detectarSoporte } from './soporte3d'

// three.js y la escena se descargan cuando se muestra la vista 3D.
const Escena3D = lazy(() => import('./Escena3D'))

const VISTAS = [
  { clave: 'general', texto: 'General', nombre: 'Vista general', necesitaCancha: false },
  { clave: 'cancha', texto: 'Aérea', nombre: 'Vista aérea de la cancha', necesitaCancha: true },
  { clave: 'lateral', texto: 'Lateral', nombre: 'Vista lateral', necesitaCancha: true },
  { clave: 'arco', texto: 'Arco', nombre: 'Vista desde el arco', necesitaCancha: true },
]

const ESTADO_TEXTO = {
  cargando: { palabra: 'Consultando', Icono: HourglassSplit },
  libre: { palabra: 'Libre', Icono: CircleFill },
  ocupada: { palabra: 'Ocupada', Icono: XCircleFill },
  seleccionada: { palabra: 'Elegida', Icono: CheckCircleFill },
}

// Hora de luz LED y tarifa de noche: desde las 6 p. m. Es solo un respaldo:
// el servidor marca cada franja con `noche` y su `precio`, y es quien cobra.
const HORA_NOCHE = 18

const pad = (n) => String(n).padStart(2, '0')

const pesos = (valor) => `$${Number(valor).toLocaleString('es-CO')}`

const esFranjaNoche = (franja) => franja.noche ?? Number(franja.hora_inicio.slice(0, 2)) >= HORA_NOCHE

const precioFranja = (franja, cancha) =>
  Number(franja.precio ?? (esFranjaNoche(franja) ? cancha.precio_noche : cancha.precio_hora))

const horaFin = (hora, duracion) => {
  const fin = Number(hora.slice(0, 2)) + duracion

  return fin === 24 ? '00:00' : `${pad(fin)}:00`
}

// Una franja sirve como inicio si ella y las siguientes horas están libres
function esInicioValido(horarios, indice, duracion) {
  if (indice < 0) return false

  for (let i = 0; i < duracion; i += 1) {
    if (!horarios[indice + i]?.disponible) return false
  }

  return true
}

// Si la carga del 3D falla (red, WebGL), se pasa a la lista sin romper la página
class LimiteErrores extends Component {
  state = { fallo: false }

  static getDerivedStateFromError() {
    return { fallo: true }
  }

  componentDidCatch() {
    this.props.alFallar?.()
  }

  render() {
    return this.state.fallo ? null : this.props.children
  }
}

function Estado({ estado }) {
  const { palabra, Icono } = ESTADO_TEXTO[estado]

  return (
    <span className={`estado-cancha estado-cancha--${estado}`}>
      <Icono aria-hidden="true" size={13} />
      {palabra}
    </span>
  )
}

// Selección de cancha con radios nativos: funciona con teclado (flechas),
// lector de pantalla y táctil. Es también la alternativa cuando no hay 3D.
function SelectorCanchas({ items, canchaId, estados, alElegir, cargando }) {
  return (
    <fieldset className="aerea__selector">
      <legend className="h5 mb-2">Elige tu cancha</legend>

      {/* Qué horas son de día y cuáles de noche: precio por hora en cada caso */}
      <p className="aerea__franjas-dia mb-3">
        <span className="tarifa tarifa--dia">
          <SunFill aria-hidden="true" size={13} />
          <span>
            <strong>Día</strong> 8:00 a. m. – 6:00 p. m.
          </span>
        </span>
        <span className="tarifa tarifa--noche">
          <MoonStarsFill aria-hidden="true" size={12} />
          <span>
            <strong>Noche</strong> 6:00 p. m. – 12:00 a. m. · luz LED
          </span>
        </span>
      </p>

      {cargando && <p className="text-body-secondary mb-0">Cargando canchas…</p>}

      <div className="aerea__opciones">
        {items.map(({ cancha, tipo, rol, grandeId }) => {
          const elegida = cancha.id === canchaId
          const nombreDe = (id) => items.find((it) => it.cancha.id === id)?.cancha.nombre
          const relacion =
            rol === 'mitad'
              ? `Mitad de ${nombreDe(grandeId)}`
              : rol === 'grande'
                ? `Ocupa ${items
                    .filter((it) => it.rol === 'mitad' && it.grandeId === cancha.id)
                    .map((it) => it.cancha.nombre)
                    .join(' y ')}`
                : null

          return (
            <label
              key={cancha.id}
              className={`cancha-opcion ${elegida ? 'cancha-opcion--elegida' : ''}`.trim()}
            >
              <input
                type="radio"
                name="cancha"
                className="visually-hidden"
                value={cancha.id}
                checked={elegida}
                onChange={() => alElegir(cancha.id)}
              />

              <span className="cancha-opcion__tipo" aria-hidden="true">
                {tipo.corto}
              </span>

              <span className="cancha-opcion__datos">
                <strong>{cancha.nombre}</strong>
                <small>
                  {tipo.nombre}
                  {relacion && ` · ${relacion}`}
                </small>
                <span className="tarifas">
                  <span className="tarifa tarifa--dia">
                    <SunFill aria-hidden="true" size={13} />
                    <span>
                      Día <strong>{pesos(cancha.precio_hora)}</strong>
                    </span>
                  </span>
                  <span className="tarifa tarifa--noche">
                    <MoonStarsFill aria-hidden="true" size={12} />
                    <span>
                      Noche <strong>{pesos(cancha.precio_noche ?? cancha.precio_hora)}</strong>
                    </span>
                  </span>
                </span>
              </span>

              <Estado estado={elegida ? 'seleccionada' : (estados[cancha.id] ?? 'cargando')} />
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}

function ReservaAerea({ versionDisponibilidad = 0, alCrearReserva }) {
  const soporte = useMemo(() => detectarSoporte(), [])

  const [fallo3d, setFallo3d] = useState(false)

  const [canchas, setCanchas] = useState([])
  const [cargandoCanchas, setCargandoCanchas] = useState(true)
  const [errorCanchas, setErrorCanchas] = useState('')
  const [recargaCanchas, setRecargaCanchas] = useState(0)

  const [canchaId, setCanchaId] = useState(null)
  const [ultimaMitad, setUltimaMitad] = useState(null)
  const [fecha, setFecha] = useState(() => fechaLocal())
  const [duracion, setDuracion] = useState(1)
  const [hora, setHora] = useState('')
  const [vista, setVista] = useState('general')
  const [hoverId, setHoverId] = useState(null)

  const [disponibilidad, setDisponibilidad] = useState({ clave: '', datos: {} })
  const [refresco, setRefresco] = useState(0)

  const [reservando, setReservando] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')

  const hoy = fechaLocal()

  // ---------------------------------------------------------------------
  // Canchas (endpoint existente: GET /canchas/)
  // ---------------------------------------------------------------------

  useEffect(() => {
    let vigente = true

    api
      .get('/canchas/')
      .then((datos) => {
        if (!vigente) return

        setCanchas(datos.filter((cancha) => cancha.estado !== false))
        setErrorCanchas('')
      })
      .catch((falla) => vigente && setErrorCanchas(falla.message))
      .finally(() => vigente && setCargandoCanchas(false))

    return () => {
      vigente = false
    }
  }, [recargaCanchas])

  const disposicion = useMemo(() => distribuir(canchas), [canchas])

  // ---------------------------------------------------------------------
  // Disponibilidad de todas las canchas para la fecha
  // (endpoint existente: GET /reservas/disponibilidad). El servidor sigue
  // validando al reservar: esto solo sirve para mostrar y guiar.
  // ---------------------------------------------------------------------

  const claveActual = `${fecha}|${versionDisponibilidad}|${refresco}|${canchas.length}`

  useEffect(() => {
    if (canchas.length === 0 || !fecha) return undefined

    let vigente = true

    Promise.all(
      canchas.map((cancha) =>
        api
          .get(`/reservas/disponibilidad?cancha_id=${cancha.id}&fecha=${fecha}`)
          .then((respuesta) => [cancha.id, respuesta.horarios])
          .catch(() => [cancha.id, null]),
      ),
    ).then((pares) => {
      if (vigente) {
        setDisponibilidad({ clave: claveActual, datos: Object.fromEntries(pares) })
      }
    })

    return () => {
      vigente = false
    }
  }, [canchas, fecha, claveActual])

  const consultando = disponibilidad.clave !== claveActual && canchas.length > 0
  const datos = disponibilidad.datos
  const horariosElegida = canchaId ? datos[canchaId] : null

  // La hora elegida solo vale si sigue libre para la cancha y la duración
  const horaActual =
    hora && Array.isArray(horariosElegida)
      ? esInicioValido(
          horariosElegida,
          horariosElegida.findIndex((franja) => franja.hora_inicio === hora),
          duracion,
        )
        ? hora
        : ''
      : ''

  // Libre u ocupada: con hora elegida, para esa hora; sin hora, si queda
  // alguna franja libre en el día
  const estados = useMemo(() => {
    const resultado = {}

    canchas.forEach((cancha) => {
      const franjas = datos[cancha.id]

      if (!Array.isArray(franjas)) {
        resultado[cancha.id] = 'cargando'
        return
      }

      const libre = horaActual
        ? esInicioValido(
            franjas,
            franjas.findIndex((franja) => franja.hora_inicio === horaActual),
            duracion,
          )
        : franjas.some((_, indice) => esInicioValido(franjas, indice, duracion))

      resultado[cancha.id] = libre ? 'libre' : 'ocupada'
    })

    return resultado
  }, [canchas, datos, horaActual, duracion])

  const elegida = disposicion.items.find((item) => item.cancha.id === canchaId) ?? null

  // Las horas que cubre la reserva, con el precio que dio el servidor para
  // cada una (de día o de noche)
  const indiceHora = horaActual ? horariosElegida.findIndex((f) => f.hora_inicio === horaActual) : -1
  const franjasReserva = indiceHora >= 0 ? horariosElegida.slice(indiceHora, indiceHora + duracion) : []
  const total = franjasReserva.reduce((suma, franja) => suma + precioFranja(franja, elegida.cancha), 0)
  const horasNoche = franjasReserva.filter(esFranjaNoche).length
  const horasDia = franjasReserva.length - horasNoche
  const noche = franjasReserva.length > 0 && esFranjaNoche(franjasReserva[0])

  // Bloque grande: se juega como dos canchas de fútbol 5 o como un fútbol 8
  const grupo = elegida?.grandeId ?? null
  const mitadesGrupo = disposicion.items.filter((item) => item.rol === 'mitad' && item.grandeId === grupo)
  const formato = elegida?.rol === 'grande' ? 'f8' : 'f5'

  // ---------------------------------------------------------------------
  // Acciones: cada paso mueve la cámara a una perspectiva distinta
  // ---------------------------------------------------------------------

  const limpiarAvisos = () => {
    setMensaje('')
    setError('')
  }

  const elegirCancha = (id) => {
    if (disposicion.items.some((item) => item.cancha.id === id && item.rol === 'mitad')) {
      setUltimaMitad(id)
    }

    setCanchaId(id)
    setVista('cancha')
    limpiarAvisos()
  }

  // Media cancha vuelve a la última mitad elegida (o a la primera)
  const cambiarFormato = (valor) => {
    if (valor === 'f8') {
      elegirCancha(grupo)
    } else {
      const anterior = mitadesGrupo.find((item) => item.cancha.id === ultimaMitad)

      elegirCancha((anterior ?? mitadesGrupo[0]).cancha.id)
    }
  }

  const elegirHora = (valor) => {
    setHora(valor)
    setVista('lateral')
    limpiarAvisos()
  }

  const cambiarFecha = (valor) => {
    setFecha(valor)
    setHora('')
    limpiarAvisos()
  }

  const cambiarDuracion = (valor) => {
    setDuracion(valor)
    limpiarAvisos()
  }

  const alTeclado = (evento) => {
    // Solo si el foco está en el visor mismo, no en sus botones
    if (evento.target !== evento.currentTarget || disposicion.items.length === 0) return

    const ids = disposicion.items.map((item) => item.cancha.id)
    const posicion = ids.indexOf(canchaId)

    if (['ArrowRight', 'ArrowDown'].includes(evento.key)) {
      evento.preventDefault()
      elegirCancha(ids[(posicion + 1) % ids.length])
    } else if (['ArrowLeft', 'ArrowUp'].includes(evento.key)) {
      evento.preventDefault()
      elegirCancha(ids[(posicion <= 0 ? ids.length : posicion) - 1])
    } else if (evento.key === 'Escape') {
      setCanchaId(null)
      setVista('general')
    }
  }

  const reservar = async () => {
    if (!elegida || !horaActual) return

    limpiarAvisos()
    setReservando(true)

    try {
      const reserva = await api.post('/reservas/', {
        cancha_id: elegida.cancha.id,
        fecha,
        hora_inicio: horaActual,
        hora_fin: horaFin(horaActual, duracion),
      })

      setMensaje(
        `Reserva creada. ${elegida.cancha.nombre}, ${reserva.fecha}, de ${reserva.hora_inicio.slice(0, 5)} a ${reserva.hora_fin.slice(0, 5)}.`,
      )
      setHora('')
      setVista('cancha')
      await alCrearReserva?.()
    } catch (falla) {
      // Puede ser un choque con otra reserva: la disponibilidad se vuelve a
      // pedir al servidor, que es quien manda
      setError(falla.message)
    } finally {
      setRefresco((valor) => valor + 1)
      setReservando(false)
    }
  }

  const anuncio = elegida
    ? `${elegida.cancha.nombre}, ${elegida.tipo.nombre}, elegida.${noche ? ' Horario con luz LED.' : ''}${
        horaActual ? ` Total ${pesos(total)}.` : ''
      }`
    : ''

  const fechaTexto = new Date(`${fecha}T00:00:00`).toLocaleDateString('es-CO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
  const fechaLarga = fechaTexto.charAt(0).toUpperCase() + fechaTexto.slice(1)

  const puede3D = soporte.webgl && !fallo3d

  // ---------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------

  return (
    <section className="aerea" aria-labelledby="aerea-titulo">
      <div className="mb-3">
        <h2 id="aerea-titulo" className="h3 mb-0">
          Reserva desde la vista aérea
        </h2>
      </div>

      {!soporte.webgl && (
        <p className="small text-body-secondary mb-3">
          Tu navegador no puede mostrar la vista 3D. Puedes elegir una cancha en la lista.
        </p>
      )}

      {fallo3d && (
        <p className="small text-body-secondary mb-3">
          No pudimos abrir la vista 3D en este dispositivo. Puedes reservar con la lista.
        </p>
      )}

      <p className="visually-hidden" role="status" aria-live="polite">
        {anuncio}
      </p>

      {errorCanchas && (
        <Alert variant="danger" className="d-flex flex-wrap justify-content-between align-items-center gap-2">
          <span>{errorCanchas}</span>
          <Button
            size="sm"
            variant="outline-danger"
            onClick={() => {
              setCargandoCanchas(true)
              setRecargaCanchas((valor) => valor + 1)
            }}
          >
            Reintentar
          </Button>
        </Alert>
      )}

      <div className="row g-4 align-items-start">
        <div className="col-lg-8">
          {puede3D && !errorCanchas && (
            <>
              <div
                className="aerea__visor"
                data-bs-theme="dark"
                role="group"
                aria-label="Vista aérea 3D de las canchas. Con el teclado usa las flechas para cambiar de cancha y Escape para volver a la vista general."
                tabIndex={0}
                onKeyDown={alTeclado}
              >
                <LimiteErrores alFallar={() => setFallo3d(true)}>
                  <Suspense
                    fallback={
                      <div className="aerea__cargando" role="status">
                        Cargando la vista aérea…
                      </div>
                    }
                  >
                    {disposicion.items.length > 0 && (
                      <Escena3D
                        disposicion={disposicion}
                        estados={estados}
                        seleccionadaId={canchaId}
                        hoverId={hoverId}
                        alElegir={elegirCancha}
                        alPasar={setHoverId}
                        vista={vista}
                        noche={noche}
                        sinMovimiento={soporte.sinMovimiento}
                        tocar={!soporte.conHover}
                        alFallar={() => setFallo3d(true)}
                      />
                    )}
                  </Suspense>
                </LimiteErrores>

                <ul className="aerea__leyenda" aria-hidden="true">
                  {['libre', 'ocupada', 'seleccionada'].map((estado) => (
                    <li key={estado}>
                      <Estado estado={estado} />
                    </li>
                  ))}
                </ul>

                {noche && (
                  <span className="aerea__noche">
                    <MoonStarsFill aria-hidden="true" size={13} /> Luz LED encendida
                  </span>
                )}

                <div className="aerea__vistas" role="group" aria-label="Perspectiva de la cámara">
                  {VISTAS.map(({ clave, texto, nombre, necesitaCancha }) => (
                    <button
                      key={clave}
                      type="button"
                      className="aerea__vista"
                      aria-label={nombre}
                      aria-pressed={vista === clave}
                      disabled={necesitaCancha && !elegida}
                      onClick={() => setVista(clave)}
                    >
                      {texto}
                    </button>
                  ))}
                </div>
              </div>

              <p className="aerea__ayuda">
                Toca una cancha para elegirla. Las dos canchas de la derecha juntas son el fútbol 8:
                elige una y cambia a «Fútbol 8» en el panel. Arrastra para girar la vista y pellizca
                para acercar.
                En computador, Ctrl + rueda acerca.
              </p>
            </>
          )}

          <SelectorCanchas
            items={disposicion.items}
            canchaId={canchaId}
            estados={estados}
            alElegir={elegirCancha}
            cargando={cargandoCanchas}
          />

          {!cargandoCanchas && !errorCanchas && canchas.length === 0 && (
            <p className="text-body-secondary mb-0">Todavía no hay canchas disponibles.</p>
          )}
        </div>

        {/* ============== PANEL DE RESERVA (HTML) ============== */}
        <div className="col-lg-4">
          <div className="aerea__panel">
            <h3 className="h5 mb-3">Fecha y hora</h3>

            {grupo != null && mitadesGrupo.length > 0 && (
              <fieldset className="mb-3">
                <legend className="form-label fw-bold fs-6">Formato</legend>
                <div className="aerea__segmento aerea__segmento--ancho">
                  {[
                    { valor: 'f5', texto: 'Fútbol 5' },
                    { valor: 'f8', texto: 'Fútbol 8' },
                  ].map(({ valor, texto }) => (
                    <label key={valor} className="aerea__segmento-opcion">
                      <input
                        type="radio"
                        name="formato"
                        className="visually-hidden"
                        checked={formato === valor}
                        onChange={() => cambiarFormato(valor)}
                      />
                      <span>{texto}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            )}

            <fieldset className="mb-3">
              <legend className="form-label fw-bold fs-6">Fecha</legend>
              <CalendarioMes id="aerea-calendario" valor={fecha} minimo={hoy} alCambiar={cambiarFecha} />
            </fieldset>

            <fieldset className="mb-3">
              <legend className="form-label fw-bold fs-6">Duración</legend>
              <div className="aerea__segmento">
                {[1, 2].map((horas) => (
                  <label key={horas} className="aerea__segmento-opcion">
                    <input
                      type="radio"
                      name="duracion"
                      className="visually-hidden"
                      checked={duracion === horas}
                      onChange={() => cambiarDuracion(horas)}
                    />
                    <span>{horas === 1 ? '1 hora' : '2 horas'}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset className="mb-3">
              <legend className="form-label fw-bold fs-6">Hora de inicio</legend>

              {elegida && (
                <p className="aerea__tarifas small mb-2">
                  Día <strong>{pesos(elegida.cancha.precio_hora)}</strong>
                    {' · '}
                  <MoonStarsFill aria-hidden="true" size={12} /> Noche, desde las 6:00 p. m.{' '}
                  <strong>{pesos(elegida.cancha.precio_noche ?? elegida.cancha.precio_hora)}</strong>
                  <span className="text-body-secondary"> por hora</span>
                </p>
              )}

              {!elegida && (
                <p className="text-body-secondary mb-0">
                  Elige una cancha en la vista aérea o en la lista para ver sus horarios.
                </p>
              )}

              {elegida && !Array.isArray(horariosElegida) && (
                <p className="text-body-secondary mb-0" role="status">
                  {consultando ? 'Consultando disponibilidad…' : 'No pudimos consultar la disponibilidad.'}
                </p>
              )}

              {elegida && Array.isArray(horariosElegida) && (
                <div className="aerea__horas" aria-busy={consultando}>
                  {horariosElegida.map((franja, indice) => {
                    const libre = esInicioValido(horariosElegida, indice, duracion)
                    const activa = horaActual === franja.hora_inicio

                    return (
                      <label
                        key={franja.hora_inicio}
                        className={`franja ${activa ? 'franja--activa' : ''} ${libre ? '' : 'franja--ocupada'}`.trim()}
                      >
                        <input
                          type="radio"
                          name="hora"
                          className="visually-hidden"
                          value={franja.hora_inicio}
                          checked={activa}
                          disabled={!libre}
                          onChange={() => elegirHora(franja.hora_inicio)}
                        />
                        <span>
                          {franja.hora_inicio}
                          {esFranjaNoche(franja) && (
                            <MoonStarsFill className="franja__noche" aria-hidden="true" size={10} />
                          )}
                        </span>
                        {esFranjaNoche(franja) && <span className="visually-hidden"> tarifa de noche</span>}
                        {!libre && <span className="visually-hidden"> no disponible</span>}
                      </label>
                    )
                  })}
                </div>
              )}
            </fieldset>

            <div className="aerea__resumen">
              {elegida ? (
                <p className="mb-2">
                  <strong>{elegida.cancha.nombre}</strong> · {elegida.tipo.nombre}
                  <br />
                  <span className="text-body-secondary">{fechaLarga}</span>
                  {horaActual && (
                    <>
                      <br />
                      {horaActual} a {horaFin(horaActual, duracion)}
                      {noche && ' · con luz LED'}
                    </>
                  )}
                </p>
              ) : (
                <p className="mb-2 text-body-secondary">Todavía no has elegido cancha.</p>
              )}

              {horasDia > 0 && horasNoche > 0 && (
                <p className="small text-body-secondary mb-2">
                  {horasDia} h de día + {horasNoche} h de noche
                </p>
              )}

              <div className="d-flex justify-content-between align-items-baseline">
                <span className="fw-bold">Total</span>
                {horaActual ? (
                  <strong className="font-display fs-2 aerea__total">{pesos(total)}</strong>
                ) : (
                  <span className="text-body-secondary">Elige una hora</span>
                )}
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              className="w-100 mt-3"
              disabled={!elegida || !horaActual || reservando}
              aria-describedby="aerea-nota"
              onClick={reservar}
            >
              {reservando ? 'Creando reserva…' : 'Reservar cancha'}
            </Button>

            <p id="aerea-nota" className="small text-body-secondary mt-2 mb-0">
              {elegida && horaActual
                ? 'La reserva se confirma al enviarla: si alguien tomó ese horario antes, te avisamos.'
                : 'Elige una cancha y una hora para continuar.'}
            </p>

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
          </div>
        </div>
      </div>
    </section>
  )
}

export default ReservaAerea
