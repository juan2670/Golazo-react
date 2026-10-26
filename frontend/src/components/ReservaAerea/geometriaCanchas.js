// Medidas de cada tipo de cancha (1 unidad = 1 metro aproximado) y reparto de
// las canchas en el plano, como en el plano del club:
//
//               ┌────────[ ]────────┐
//   ┌──[ ]──┐ → │[                 ]│  Fútbol 5 (mitad de arriba)
//   │       │   ├───────────────────┤                              } Fútbol 8
//   │  F5   │   │[                 ]│  Fútbol 5 (mitad de abajo)
//   │       │ → └────────[ ]────────┘
//   └──[ ]──┘
//          ↑
//   ([ ] son los arcos y las flechas, las entradas)
//
// Cada cancha se describe en su marco local, con el eje largo (el de los
// arcos) a lo largo de Z. El fútbol 8 juega de arriba abajo; sus mitades de
// fútbol 5 van giradas 90° y juegan de izquierda a derecha.

export const TIPOS = {
  f5: {
    clave: 'f5',
    nombre: 'Fútbol 5',
    corto: 'F5',
    ancho: 15,
    largo: 32,
    arco: { ancho: 3, alto: 2 },
    area: { ancho: 8, fondo: 3.5 },
    circulo: 2.2,
  },
  // Mitad del fútbol 8: su largo es el ancho del bloque y su ancho, la mitad
  // del largo del bloque (se calcula en distribuir)
  f5Mitad: {
    clave: 'f5Mitad',
    nombre: 'Fútbol 5',
    corto: 'F5',
    ancho: 17,
    largo: 32,
    arco: { ancho: 3, alto: 2 },
    area: { ancho: 7, fondo: 3.5 },
    circulo: 2.2,
  },
  f8: {
    clave: 'f8',
    nombre: 'Fútbol 8',
    corto: 'F8',
    ancho: 32,
    largo: 34,
    arco: { ancho: 5, alto: 2.1 },
    area: { ancho: 14, fondo: 5 },
    circulo: 4,
  },
}

// El backend guarda el tipo como texto libre ("Fútbol 5", "Fútbol 8"…).
export function tipoDe(cancha) {
  return /8/.test(cancha.tipo) ? TIPOS.f8 : TIPOS.f5
}

// Pasillo entre canchas: ahí quedan las entradas
const SEPARACION = 12
export const ANCHO_ENTRADA = 2.6
const GIRO = Math.PI / 2

// Distancia de la marca "Entrada" al borde de la cancha
const FUERA = 2.6

// Devuelve:
// - items: cada cancha reservable con su posición, giro y tipo;
// - bloques: los espacios físicos (base, malla, postes, entradas). El bloque
//   grande es uno solo aunque tenga tres canchas reservables encima;
// - radio: para que la cámara encuadre la vista general.
export function distribuir(canchas) {
  const ordenadas = [...canchas].sort((a, b) => a.id - b.id)
  const ids = new Set(ordenadas.map((c) => c.id))

  // Una cancha "grande" es la que tiene mitades activas
  const mitadesDe = new Map()

  ordenadas.forEach((cancha) => {
    const padre = cancha.cancha_padre_id

    if (padre != null && ids.has(padre)) {
      mitadesDe.set(padre, [...(mitadesDe.get(padre) ?? []), cancha])
    }
  })

  const esMitad = (cancha) => cancha.cancha_padre_id != null && ids.has(cancha.cancha_padre_id)
  const sueltas = ordenadas.filter((c) => !esMitad(c) && !mitadesDe.has(c.id))
  const grandes = ordenadas.filter((c) => mitadesDe.has(c.id))

  if (ordenadas.length === 0) return { items: [], bloques: [], radio: 20 }

  const piezas = [
    ...sueltas.map((cancha) => ({ cancha, tipo: tipoDe(cancha), grande: false })),
    ...grandes.map((cancha) => ({ cancha, tipo: TIPOS.f8, grande: true })),
  ]
  const total =
    piezas.reduce((suma, p) => suma + p.tipo.ancho, 0) + SEPARACION * (piezas.length - 1)

  const items = []
  const bloques = []
  let x = -total / 2

  piezas.forEach(({ cancha, tipo, grande }) => {
    const bloque = {
      clave: `bloque-${cancha.id}`,
      x: x + tipo.ancho / 2,
      z: 0,
      rot: 0,
      tipo,
      grandeId: grande ? cancha.id : null,
      divisiones: grande ? mitadesDe.get(cancha.id).length : 1,
      entradas: [],
      marcas: [],
    }

    if (grande) {
      // Dos entradas por el lado izquierdo, arriba y abajo
      const borde = tipo.largo / 2 - 3

      bloque.entradas = [
        { lado: 'x-', en: -borde },
        { lado: 'x-', en: borde },
      ]

      // Las mitades se reparten de arriba abajo y juegan de lado a lado
      const mitades = mitadesDe.get(cancha.id)
      const anchoMitad = tipo.largo / mitades.length

      mitades.forEach((mitad, indice) => {
        items.push({
          cancha: mitad,
          tipo: { ...TIPOS.f5Mitad, ancho: anchoMitad, largo: tipo.ancho },
          x: bloque.x,
          z: bloque.z - tipo.largo / 2 + anchoMitad * (indice + 0.5),
          rot: GIRO,
          bloque: bloque.clave,
          grandeId: cancha.id,
          rol: 'mitad',
        })
      })

      items.push({
        cancha,
        tipo,
        x: bloque.x,
        z: bloque.z,
        rot: 0,
        bloque: bloque.clave,
        grandeId: cancha.id,
        rol: 'grande',
      })
    } else {
      // Cancha suelta: entrada en el lado de abajo, en la esquina derecha
      bloque.entradas = [{ lado: 'z+', en: tipo.ancho / 2 - 2.6 }]

      items.push({
        cancha,
        tipo,
        x: bloque.x,
        z: bloque.z,
        rot: 0,
        bloque: bloque.clave,
        grandeId: null,
        rol: 'suelta',
      })
    }

    // Marca "Entrada" en el piso, por fuera de cada hueco de la malla, con la
    // flecha hacia adentro de la cancha
    bloque.marcas = bloque.entradas.map(({ lado, en }) => {
      const { ancho, largo } = tipo

      if (lado === 'x-') return { x: bloque.x - ancho / 2 - FUERA, z: bloque.z + en, direccion: 'derecha' }
      if (lado === 'x+') return { x: bloque.x + ancho / 2 + FUERA, z: bloque.z + en, direccion: 'izquierda' }
      if (lado === 'z+') return { x: bloque.x + en, z: bloque.z + largo / 2 + FUERA, direccion: 'arriba' }

      return { x: bloque.x + en, z: bloque.z - largo / 2 - FUERA, direccion: 'abajo' }
    })

    bloques.push(bloque)
    x += tipo.ancho + SEPARACION
  })

  const alto = Math.max(...piezas.map((p) => p.tipo.largo))

  return { items, bloques, radio: Math.hypot(total, alto) / 2 }
}
