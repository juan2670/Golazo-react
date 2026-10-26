const pad = (n) => String(n).padStart(2, '0')

// Fecha local en formato YYYY-MM-DD (toISOString da la fecha en UTC y en
// Colombia, después de las 7 p. m., ya sería "mañana").
export const fechaLocal = (fecha = new Date()) =>
  `${fecha.getFullYear()}-${pad(fecha.getMonth() + 1)}-${pad(fecha.getDate())}`

export const aFecha = (texto) => {
  const [anio, mes, dia] = texto.split('-').map(Number)

  return new Date(anio, mes - 1, dia)
}

export const sumarDias = (texto, dias) => {
  const fecha = aFecha(texto)

  fecha.setDate(fecha.getDate() + dias)

  return fechaLocal(fecha)
}

// Mismo día en otro mes; si no existe (31 de noviembre), el último del mes
export const sumarMeses = (texto, meses) => {
  const fecha = aFecha(texto)
  const dia = fecha.getDate()

  fecha.setDate(1)
  fecha.setMonth(fecha.getMonth() + meses)

  const ultimo = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0).getDate()

  fecha.setDate(Math.min(dia, ultimo))

  return fechaLocal(fecha)
}
