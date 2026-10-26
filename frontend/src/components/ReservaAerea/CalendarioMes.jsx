import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'react-bootstrap-icons'

import { aFecha, fechaLocal, sumarDias, sumarMeses } from './fechas'

// Calendario de un mes completo para elegir el día de la reserva.
//
// Teclado (patrón "grid" de WAI-ARIA): flechas para moverse por días y
// semanas, Inicio/Fin para el comienzo o fin de la semana, RePág/AvPág para
// cambiar de mes. Solo el día enfocado está en el orden de tabulación.

// La semana empieza el lunes, como en los calendarios de Colombia
const diaSemana = (fecha) => (fecha.getDay() + 6) % 7

const SEMANA = [
  { corto: 'L', largo: 'lunes' },
  { corto: 'M', largo: 'martes' },
  { corto: 'X', largo: 'miércoles' },
  { corto: 'J', largo: 'jueves' },
  { corto: 'V', largo: 'viernes' },
  { corto: 'S', largo: 'sábado' },
  { corto: 'D', largo: 'domingo' },
]

const mayuscula = (texto) => texto.charAt(0).toUpperCase() + texto.slice(1)

function semanasDelMes(anio, mes) {
  const primero = new Date(anio, mes, 1)
  const dias = new Date(anio, mes + 1, 0).getDate()
  const celdas = [
    ...Array(diaSemana(primero)).fill(null),
    ...Array.from({ length: dias }, (_, i) => fechaLocal(new Date(anio, mes, i + 1))),
  ]

  while (celdas.length % 7 !== 0) celdas.push(null)

  const semanas = []

  for (let i = 0; i < celdas.length; i += 7) semanas.push(celdas.slice(i, i + 7))

  return semanas
}

function CalendarioMes({ valor, minimo, alCambiar, id = 'calendario' }) {
  const [foco, setFoco] = useState(valor)
  const [visible, setVisible] = useState(() => valor.slice(0, 7))
  const debeEnfocar = useRef(false)
  const grilla = useRef(null)

  const [anio, mes] = visible.split('-').map(Number)
  const semanas = semanasDelMes(anio, mes - 1)
  const hoy = fechaLocal()

  const titulo = mayuscula(
    new Date(anio, mes - 1, 1).toLocaleDateString('es-CO', { month: 'long', year: 'numeric' }),
  )

  // El día con tabIndex=0 debe estar en el mes visible
  const enfocable = foco.slice(0, 7) === visible ? foco : valor.slice(0, 7) === visible ? valor : null
  const primeroElegible = semanas.flat().find((dia) => dia && dia >= minimo)
  const conTab = enfocable && enfocable >= minimo ? enfocable : primeroElegible

  useEffect(() => {
    if (!debeEnfocar.current) return

    debeEnfocar.current = false
    grilla.current?.querySelector(`[data-fecha="${foco}"]`)?.focus()
  }, [foco, visible])

  const irA = (destino) => {
    const fecha = destino < minimo ? minimo : destino

    debeEnfocar.current = true
    setFoco(fecha)
    setVisible(fecha.slice(0, 7))
  }

  const cambiarMes = (meses) => {
    setVisible(sumarMeses(`${visible}-01`, meses).slice(0, 7))
  }

  const alTeclado = (evento, fecha) => {
    const dia = diaSemana(aFecha(fecha))
    const acciones = {
      ArrowLeft: () => sumarDias(fecha, -1),
      ArrowRight: () => sumarDias(fecha, 1),
      ArrowUp: () => sumarDias(fecha, -7),
      ArrowDown: () => sumarDias(fecha, 7),
      Home: () => sumarDias(fecha, -dia),
      End: () => sumarDias(fecha, 6 - dia),
      PageUp: () => sumarMeses(fecha, evento.shiftKey ? -12 : -1),
      PageDown: () => sumarMeses(fecha, evento.shiftKey ? 12 : 1),
    }
    const accion = acciones[evento.key]

    if (!accion) return

    evento.preventDefault()
    irA(accion())
  }

  const mesAnteriorBloqueado = visible <= minimo.slice(0, 7)

  return (
    <div className="calendario">
      <div className="calendario__cabecera">
        <button
          type="button"
          className="calendario__nav"
          aria-label="Mes anterior"
          disabled={mesAnteriorBloqueado}
          onClick={() => cambiarMes(-1)}
        >
          <ChevronLeft aria-hidden="true" size={18} />
        </button>

        <h4 id={`${id}-titulo`} className="calendario__titulo" aria-live="polite">
          {titulo}
        </h4>

        <button
          type="button"
          className="calendario__nav"
          aria-label="Mes siguiente"
          onClick={() => cambiarMes(1)}
        >
          <ChevronRight aria-hidden="true" size={18} />
        </button>
      </div>

      <table ref={grilla} className="calendario__grilla" role="grid" aria-labelledby={`${id}-titulo`}>
        <thead>
          <tr>
            {SEMANA.map(({ corto, largo }) => (
              <th key={largo} scope="col" abbr={largo}>
                <span aria-hidden="true">{corto}</span>
                <span className="visually-hidden">{largo}</span>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {semanas.map((semana) => (
            <tr key={semana.find(Boolean)}>
              {semana.map((fecha, indice) => {
                if (!fecha) return <td key={`vacio-${indice}`} />

                const elegido = fecha === valor
                const pasado = fecha < minimo
                const esHoy = fecha === hoy
                const etiqueta = aFecha(fecha).toLocaleDateString('es-CO', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })

                return (
                  <td key={fecha} role="gridcell" aria-selected={elegido}>
                    <button
                      type="button"
                      data-fecha={fecha}
                      className={[
                        'calendario__dia',
                        elegido && 'calendario__dia--elegido',
                        esHoy && 'calendario__dia--hoy',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      tabIndex={fecha === conTab ? 0 : -1}
                      disabled={pasado}
                      aria-label={etiqueta}
                      aria-current={esHoy ? 'date' : undefined}
                      onClick={() => {
                        setFoco(fecha)
                        alCambiar(fecha)
                      }}
                      onKeyDown={(evento) => alTeclado(evento, fecha)}
                    >
                      {Number(fecha.slice(8))}
                    </button>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default CalendarioMes
