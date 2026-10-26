import * as THREE from 'three'

// Todo lo visual de la cancha se dibuja en código sobre canvas 2D: el césped
// con franjas y las líneas de juego van en una sola textura por tipo de
// cancha, así cada cancha cuesta una sola malla.

const PX = 32 // píxeles de textura por unidad de mundo

const cache = new Map()

// Medidas de las marcas de cada mitad de fútbol 5 dentro del bloque grande
const MARCAS_MITAD = { area: { ancho: 7, fondo: 3.5 }, circulo: 2.2 }

const BLANCO = 'rgba(255, 255, 255, 0.92)'
const AMARILLO = 'rgba(244, 194, 13, 0.85)'

function crearTextura(canvas, repetir = false) {
  const textura = new THREE.CanvasTexture(canvas)

  textura.colorSpace = THREE.SRGBColorSpace
  textura.anisotropy = 8

  if (repetir) {
    textura.wrapS = THREE.RepeatWrapping
    textura.wrapT = THREE.RepeatWrapping
  }

  return textura
}

// Líneas de juego de una cancha que ocupa, en el canvas, el rectángulo de
// centro (cx, cy), ancho w y alto h. El eje largo (el de los arcos) es el
// vertical; con `girar` pasa a ser el horizontal (las mitades del fútbol 8).
function dibujarMarcas(ctx, cx, cy, w, h, medidas, color, grosor, girar = false) {
  const margen = 0.55 * PX

  ctx.save()
  ctx.translate(cx, cy)

  if (girar) {
    ctx.rotate(Math.PI / 2)
    ;[w, h] = [h, w]
  }

  ctx.strokeStyle = color
  ctx.fillStyle = color
  ctx.lineWidth = grosor * PX
  ctx.lineCap = 'butt'

  ctx.strokeRect(-w / 2 + margen, -h / 2 + margen, w - margen * 2, h - margen * 2)

  ctx.beginPath()
  ctx.moveTo(-w / 2 + margen, 0)
  ctx.lineTo(w / 2 - margen, 0)
  ctx.stroke()

  ctx.beginPath()
  ctx.arc(0, 0, medidas.circulo * PX, 0, Math.PI * 2)
  ctx.stroke()

  ctx.beginPath()
  ctx.arc(0, 0, 0.22 * PX, 0, Math.PI * 2)
  ctx.fill()

  // Áreas y punto penal en cada extremo
  const aw = medidas.area.ancho * PX
  const af = medidas.area.fondo * PX
  const arriba = -h / 2 + margen
  const abajo = h / 2 - margen

  ctx.strokeRect(-aw / 2, arriba, aw, af)
  ctx.strokeRect(-aw / 2, abajo - af, aw, af)
  ;[arriba + af * 0.7, abajo - af * 0.7].forEach((y) => {
    ctx.beginPath()
    ctx.arc(0, y, 0.2 * PX, 0, Math.PI * 2)
    ctx.fill()
  })

  ctx.restore()
}

// Césped sintético en franjas (como el de la foto) y marcas de juego.
//
// En el bloque grande (divisiones > 1) hay dos juegos de marcas, como en las
// canchas reales: el fútbol 8 juega de arriba abajo y cada mitad de fútbol 5
// de lado a lado. Con modo 'f5' se ven en blanco las de las mitades y en
// amarillo las del fútbol 8; con modo 'f8', al revés.
export function texturaCancha(tipo, divisiones = 1, modo = 'f5') {
  const clave = `${tipo.clave}-${tipo.ancho}x${tipo.largo}-${divisiones}-${modo}`

  if (cache.has(clave)) return cache.get(clave)

  const ancho = Math.round(tipo.ancho * PX)
  const largo = Math.round(tipo.largo * PX)
  const canvas = document.createElement('canvas')

  canvas.width = ancho
  canvas.height = largo

  const ctx = canvas.getContext('2d')

  // Franjas a lo largo de la cancha
  const franjas = Math.round(tipo.ancho / 2.5)
  const anchoFranja = ancho / franjas

  for (let i = 0; i < franjas; i += 1) {
    ctx.fillStyle = i % 2 === 0 ? '#3f9a2b' : '#357f24'
    ctx.fillRect(i * anchoFranja, 0, anchoFranja + 1, largo)
  }

  // Desgaste y grano del césped: manchas pequeñas, siempre iguales (semilla fija)
  let semilla = divisiones > 1 ? 7 : 3
  const azar = () => {
    semilla = (semilla * 16807) % 2147483647

    return semilla / 2147483647
  }
  const manchas = Math.round((tipo.ancho * tipo.largo) / 0.14)

  for (let i = 0; i < manchas; i += 1) {
    ctx.fillStyle = azar() > 0.5 ? 'rgba(10, 40, 8, 0.07)' : 'rgba(180, 230, 120, 0.05)'
    ctx.fillRect(azar() * ancho, azar() * largo, 2 + azar() * 6, 2 + azar() * 6)
  }

  if (divisiones > 1) {
    const altoMitad = largo / divisiones
    const colorMitad = modo === 'f8' ? AMARILLO : BLANCO
    const colorGrande = modo === 'f8' ? BLANCO : AMARILLO

    // Primero el juego secundario, para que el principal quede encima
    const mitades = () => {
      for (let i = 0; i < divisiones; i += 1) {
        const cy = altoMitad * (i + 0.5)

        dibujarMarcas(ctx, ancho / 2, cy, ancho, altoMitad, MARCAS_MITAD, colorMitad, 0.12, true)
      }
    }
    const grande = () =>
      dibujarMarcas(ctx, ancho / 2, largo / 2, ancho, largo, tipo, colorGrande, 0.14)

    if (modo === 'f8') {
      mitades()
      grande()
    } else {
      grande()
      mitades()
    }
  } else {
    dibujarMarcas(ctx, ancho / 2, largo / 2, ancho, largo, tipo, BLANCO, 0.14)
  }

  const textura = crearTextura(canvas)

  cache.set(clave, textura)

  return textura
}

const GIRO_FLECHA = { derecha: 0, abajo: Math.PI / 2, izquierda: Math.PI, arriba: -Math.PI / 2 }

// Marca pintada en el piso junto a cada entrada: flecha hacia la cancha y la
// palabra "Entrada" (el texto siempre se lee derecho desde la vista aérea).
export function texturaEntrada(direccion) {
  const clave = `entrada-${direccion}`

  if (cache.has(clave)) return cache.get(clave)

  const canvas = document.createElement('canvas')

  canvas.width = 440
  canvas.height = 220

  const ctx = canvas.getContext('2d')

  ctx.beginPath()
  ctx.roundRect(6, 6, 428, 208, 28)
  ctx.fillStyle = 'rgba(6, 26, 30, 0.88)'
  ctx.fill()
  ctx.lineWidth = 8
  ctx.strokeStyle = '#f4c20d'
  ctx.stroke()

  // Flecha
  ctx.save()
  ctx.translate(220, 70)
  ctx.rotate(GIRO_FLECHA[direccion] ?? 0)
  // Vertical, la flecha se acorta para caber sobre el texto
  if (direccion === 'arriba' || direccion === 'abajo') ctx.scale(0.5, 0.75)
  ctx.fillStyle = '#f4c20d'
  ctx.beginPath()
  ctx.moveTo(-90, -14)
  ctx.lineTo(40, -14)
  ctx.lineTo(40, -38)
  ctx.lineTo(95, 0)
  ctx.lineTo(40, 38)
  ctx.lineTo(40, 14)
  ctx.lineTo(-90, 14)
  ctx.closePath()
  ctx.fill()
  ctx.restore()

  ctx.fillStyle = '#ffffff'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font = '800 64px "Nunito Variable", Nunito, system-ui, sans-serif'
  ctx.fillText('ENTRADA', 220, 162)

  const textura = crearTextura(canvas)

  cache.set(clave, textura)

  return textura
}

// Malla de la red perimetral: líneas finas con fondo transparente.
export function texturaRed() {
  if (cache.has('red')) return cache.get('red')

  const canvas = document.createElement('canvas')

  canvas.width = 64
  canvas.height = 64

  const ctx = canvas.getContext('2d')

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)'
  ctx.lineWidth = 3
  ctx.strokeRect(0, 0, 64, 64)

  const textura = crearTextura(canvas, true)

  cache.set('red', textura)

  return textura
}

// Resplandor de los reflectores LED sobre la cancha (de noche).
export function texturaHalo() {
  if (cache.has('halo')) return cache.get('halo')

  const canvas = document.createElement('canvas')

  canvas.width = 256
  canvas.height = 256

  const ctx = canvas.getContext('2d')
  const degradado = ctx.createRadialGradient(128, 128, 0, 128, 128, 128)

  degradado.addColorStop(0, 'rgba(255, 255, 255, 1)')
  degradado.addColorStop(0.55, 'rgba(255, 255, 255, 0.35)')
  degradado.addColorStop(1, 'rgba(255, 255, 255, 0)')
  ctx.fillStyle = degradado
  ctx.fillRect(0, 0, 256, 256)

  const textura = crearTextura(canvas)

  cache.set('halo', textura)

  return textura
}

export const ESTILO_ETIQUETA = {
  cargando: { borde: '#9fb4ba', texto: '#dbe6e9', simbolo: '…', palabra: 'Consultando' },
  libre: { borde: '#7ee06a', texto: '#9cf08a', simbolo: '●', palabra: 'Libre' },
  ocupada: { borde: '#ff7b6e', texto: '#ffa79d', simbolo: '✕', palabra: 'Ocupada' },
  seleccionada: { borde: '#40cdf2', texto: '#8be3f8', simbolo: '✓', palabra: 'Elegida' },
}

// Etiqueta flotante sobre cada cancha. El estado va en texto y símbolo, no
// solo en color, para que se entienda sin distinguir colores.
export function crearEtiqueta(titulo, subtitulo, estado) {
  const estilo = ESTILO_ETIQUETA[estado] ?? ESTILO_ETIQUETA.libre
  const canvas = document.createElement('canvas')

  canvas.width = 640
  canvas.height = 200

  const ctx = canvas.getContext('2d')
  const radio = 36

  ctx.beginPath()
  ctx.roundRect(8, 8, 624, 184, radio)
  ctx.fillStyle = 'rgba(6, 26, 30, 0.92)'
  ctx.fill()
  ctx.lineWidth = 8
  ctx.strokeStyle = estilo.borde
  ctx.stroke()

  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = '#ffffff'
  ctx.font = '800 60px "Nunito Variable", Nunito, system-ui, sans-serif'
  ctx.fillText(titulo, 320, 70)

  ctx.fillStyle = estilo.texto
  ctx.font = '800 50px "Nunito Variable", Nunito, system-ui, sans-serif'
  ctx.fillText(`${estilo.simbolo} ${estilo.palabra}  ·  ${subtitulo}`, 320, 138)

  const textura = new THREE.CanvasTexture(canvas)

  textura.colorSpace = THREE.SRGBColorSpace

  return textura
}
