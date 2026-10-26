/* oxlint-disable react/immutability -- three.js es imperativo: cámara, controles y materiales se mutan por diseño dentro de useFrame y useEffect */
import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

import { ANCHO_ENTRADA } from './geometriaCanchas'
import { crearEtiqueta, texturaCancha, texturaEntrada, texturaHalo, texturaRed } from './texturas3d'

// Los elementos decorativos no participan del raycast: solo el velo de cada
// cancha recibe clics y hover, y así cada puntero cuesta una prueba por cancha.
const sinRaycast = () => null

const ALTO_RED = 4
const ALTO_POSTE = 6.5
const FOV = 34
const ESCALA_ETIQUETA = 0.15

// Apariencia de cada estado: color y opacidad del velo y del marco.
const VISUAL = {
  cargando: { color: '#9fb4ba', velo: 0.05, marco: 0.45 },
  libre: { color: '#6fe05a', velo: 0.06, marco: 0.6 },
  ocupada: { color: '#ff5a4d', velo: 0.4, marco: 0.95 },
  seleccionada: { color: '#40cdf2', velo: 0.18, marco: 1 },
}

const COLOR_DIA = {
  fondo: new THREE.Color('#bcd9e3'),
  suelo: new THREE.Color('#5d6d62'),
}

const COLOR_NOCHE = {
  fondo: new THREE.Color('#07141a'),
  suelo: new THREE.Color('#1f2c26'),
}

// ---------------------------------------------------------------------------
// Geometrías y materiales compartidos
// ---------------------------------------------------------------------------

function geometriaRed(ancho, alto) {
  const geometria = new THREE.PlaneGeometry(ancho, alto)
  const uv = geometria.attributes.uv

  // Celdas de 0.45 unidades sin importar el tamaño del paño
  for (let i = 0; i < uv.count; i += 1) {
    uv.setXY(i, uv.getX(i) * (ancho / 0.45), uv.getY(i) * (alto / 0.45))
  }

  return geometria
}

function geometriaMarco(ancho, largo) {
  const grosor = 0.55
  const forma = new THREE.Shape()

  forma.moveTo(-ancho / 2 - grosor, -largo / 2 - grosor)
  forma.lineTo(ancho / 2 + grosor, -largo / 2 - grosor)
  forma.lineTo(ancho / 2 + grosor, largo / 2 + grosor)
  forma.lineTo(-ancho / 2 - grosor, largo / 2 + grosor)
  forma.closePath()

  const hueco = new THREE.Path()

  hueco.moveTo(-ancho / 2, -largo / 2)
  hueco.lineTo(-ancho / 2, largo / 2)
  hueco.lineTo(ancho / 2, largo / 2)
  hueco.lineTo(ancho / 2, -largo / 2)
  hueco.closePath()
  forma.holes.push(hueco)

  return new THREE.ShapeGeometry(forma)
}

// Tramos de malla de un lado, dejando huecos donde hay entradas.
// Devuelve [{ centro, largo }] medidos sobre el lado (de -total/2 a total/2).
function tramosDeMalla(total, huecos) {
  const cortes = [...huecos].sort((a, b) => a - b)
  const tramos = []
  let desde = -total / 2

  cortes.forEach((centro) => {
    const hasta = centro - ANCHO_ENTRADA / 2

    if (hasta - desde > 0.05) tramos.push({ centro: (desde + hasta) / 2, largo: hasta - desde })
    desde = centro + ANCHO_ENTRADA / 2
  })

  if (total / 2 - desde > 0.05) {
    tramos.push({ centro: (desde + total / 2) / 2, largo: total / 2 - desde })
  }

  return tramos
}

function crearGeometrias() {
  return {
    mastil: new THREE.CylinderGeometry(0.13, 0.17, ALTO_POSTE, 10),
    cabeza: new THREE.BoxGeometry(1.5, 0.4, 0.75),
    poste: new THREE.BoxGeometry(0.12, 1, 0.12),
    travesano: new THREE.BoxGeometry(1, 0.12, 0.12),
    entrada: new THREE.PlaneGeometry(4.4, 2.2),
  }
}

function crearMateriales() {
  return {
    concreto: new THREE.MeshStandardMaterial({ color: '#76817a', roughness: 1 }),
    poste: new THREE.MeshStandardMaterial({ color: '#f3f3ef', roughness: 0.55 }),
    led: new THREE.MeshStandardMaterial({
      color: '#d6dde0',
      emissive: new THREE.Color('#e6f6ff'),
      emissiveIntensity: 0.12,
      roughness: 0.4,
    }),
    red: new THREE.MeshBasicMaterial({
      map: texturaRed(),
      transparent: true,
      opacity: 0.5,
      side: THREE.DoubleSide,
      depthWrite: false,
    }),
    suelo: new THREE.MeshStandardMaterial({ color: COLOR_DIA.suelo, roughness: 1 }),
    ...Object.fromEntries(
      ['derecha', 'izquierda', 'arriba', 'abajo'].map((direccion) => [
        `entrada-${direccion}`,
        new THREE.MeshBasicMaterial({ map: texturaEntrada(direccion), transparent: true }),
      ]),
    ),
  }
}

// ---------------------------------------------------------------------------
// Ambiente: día o noche según la hora elegida
// ---------------------------------------------------------------------------

function Ambiente({ noche, sinMovimiento, ambiente, materiales }) {
  const { scene, invalidate } = useThree()
  const hemisferio = useRef(null)
  const sol = useRef(null)

  useFrame((_, delta) => {
    const meta = noche ? 1 : 0
    const actual = ambiente.current
    // Decorativo (no es respuesta a un clic): algo más lento que la interfaz
    const k = sinMovimiento ? 1 : 1 - Math.exp(-7 * Math.min(delta, 0.05))

    actual.noche += (meta - actual.noche) * k

    if (Math.abs(meta - actual.noche) < 0.003) actual.noche = meta
    else invalidate()

    const n = actual.noche

    scene.background.copy(COLOR_DIA.fondo).lerp(COLOR_NOCHE.fondo, n)
    materiales.suelo.color.copy(COLOR_DIA.suelo).lerp(COLOR_NOCHE.suelo, n)
    materiales.led.emissiveIntensity = 0.12 + n * 3.2
    materiales.red.opacity = 0.5 - n * 0.22

    hemisferio.current.intensity = 1.15 - n * 0.98
    sol.current.intensity = 2.3 - n * 2.1
  })

  return (
    <>
      <hemisphereLight ref={hemisferio} args={['#ffffff', '#51604f', 1.15]} />
      <directionalLight ref={sol} position={[-30, 55, 25]} intensity={2.3} />
    </>
  )
}

// ---------------------------------------------------------------------------
// Bloque: el espacio físico (base, césped, malla, postes). El bloque grande
// es uno solo aunque encima haya tres canchas reservables.
// ---------------------------------------------------------------------------

function Bloque({ bloque, modo, geometrias, materiales, ambiente }) {
  const { invalidate } = useThree()
  const { tipo, divisiones, entradas } = bloque
  const { ancho, largo } = tipo

  const textura = useMemo(() => texturaCancha(tipo, divisiones, modo), [tipo, divisiones, modo])

  const propias = useMemo(() => {
    const huecos = (lado) => entradas.filter((e) => e.lado === lado).map((e) => e.en)
    const lados = [
      // [lado, largo del lado, posición y giro de cada tramo]
      ['x-', largo, (c) => [-ancho / 2, c, Math.PI / 2]],
      ['x+', largo, (c) => [ancho / 2, c, Math.PI / 2]],
      ['z-', ancho, (c) => [c, -largo / 2, 0]],
      ['z+', ancho, (c) => [c, largo / 2, 0]],
    ]

    return {
      plano: new THREE.PlaneGeometry(ancho, largo),
      base: new THREE.BoxGeometry(ancho + 3.2, 0.3, largo + 3.2),
      halo: new THREE.PlaneGeometry(ancho * 1.6, largo * 1.5),
      tramos: lados.flatMap(([lado, total, ubicar]) =>
        tramosDeMalla(total, huecos(lado)).map((tramo) => {
          const [x, z, giro] = ubicar(tramo.centro)

          return {
            clave: `${lado}-${tramo.centro.toFixed(2)}`,
            geometria: geometriaRed(tramo.largo, ALTO_RED),
            x,
            z,
            giro,
          }
        }),
      ),
    }
  }, [ancho, largo, entradas])

  useEffect(
    () => () => {
      propias.plano.dispose()
      propias.base.dispose()
      propias.halo.dispose()
      propias.tramos.forEach((tramo) => tramo.geometria.dispose())
    },
    [propias],
  )

  const cesped = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        emissive: new THREE.Color('#ffffff'),
        emissiveIntensity: 0,
        roughness: 0.95,
      }),
    [],
  )
  const halo = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        map: texturaHalo(),
        color: '#dff3ff',
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    [],
  )

  // Cambiar de fútbol 5 a fútbol 8 cambia las líneas visibles
  useLayoutEffect(() => {
    cesped.map = textura
    cesped.emissiveMap = textura
    cesped.needsUpdate = true
    invalidate()
  }, [cesped, textura, invalidate])

  useEffect(
    () => () => {
      cesped.dispose()
      halo.dispose()
    },
    [cesped, halo],
  )

  useFrame(() => {
    const n = ambiente.current.noche

    cesped.emissiveIntensity = n * 0.42
    halo.opacity = n * 0.55
  })

  const esquinas = [
    [-1, -1],
    [1, -1],
    [-1, 1],
    [1, 1],
  ]

  return (
    <group position={[bloque.x, 0, bloque.z]} rotation={[0, bloque.rot, 0]}>
      <mesh
        geometry={propias.base}
        material={materiales.concreto}
        position={[0, -0.16, 0]}
        raycast={sinRaycast}
      />

      <mesh
        geometry={propias.plano}
        material={cesped}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.02, 0]}
        raycast={sinRaycast}
      />

      {/* Resplandor LED */}
      <mesh
        geometry={propias.halo}
        material={halo}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.09, 0]}
        raycast={sinRaycast}
      />

      {/* Malla perimetral, abierta en las entradas */}
      {propias.tramos.map((tramo) => (
        <mesh
          key={tramo.clave}
          geometry={tramo.geometria}
          material={materiales.red}
          position={[tramo.x, ALTO_RED / 2, tramo.z]}
          rotation={[0, tramo.giro, 0]}
          raycast={sinRaycast}
        />
      ))}

      {/* Postes con reflector LED en las esquinas */}
      {esquinas.map(([sx, sz]) => (
        <group key={`poste-${sx}-${sz}`} position={[(sx * ancho) / 2, 0, (sz * largo) / 2]}>
          <mesh
            geometry={geometrias.mastil}
            material={materiales.poste}
            position={[0, ALTO_POSTE / 2, 0]}
            raycast={sinRaycast}
          />
          <mesh
            geometry={geometrias.cabeza}
            material={materiales.led}
            position={[0, ALTO_POSTE + 0.1, 0]}
            rotation={[0.45, Math.atan2(-sx, -sz), 0]}
            raycast={sinRaycast}
          />
        </group>
      ))}
    </group>
  )
}

// ---------------------------------------------------------------------------
// Zona: una cancha reservable (estado, arcos y etiqueta). En el bloque grande
// solo se muestra el formato elegido: las dos mitades o el fútbol 8 entero.
// ---------------------------------------------------------------------------

function Zona({
  item,
  estado,
  hover,
  activa,
  clicable,
  geometrias,
  materiales,
  tocar,
  alElegir,
  alPasar,
}) {
  const { invalidate } = useThree()
  const { cancha, tipo } = item
  const { ancho, largo } = tipo

  const propias = useMemo(
    () => ({
      plano: new THREE.PlaneGeometry(ancho, largo),
      marco: geometriaMarco(ancho, largo),
    }),
    [ancho, largo],
  )

  const velo = useMemo(
    () => new THREE.MeshBasicMaterial({ transparent: true, depthWrite: false, opacity: 0 }),
    [],
  )
  const marco = useMemo(
    () => new THREE.MeshBasicMaterial({ transparent: true, depthWrite: false, opacity: 0 }),
    [],
  )

  const conHover = hover && estado !== 'seleccionada'
  const objetivo = useMemo(() => {
    const base = VISUAL[estado] ?? VISUAL.libre

    // Una mitad oculta (con el fútbol 8 elegido) solo se insinúa al pasar
    // el mouse, para mostrar que también se puede elegir
    if (!activa) {
      return { color: new THREE.Color(base.color), velo: conHover ? 0.16 : 0, marco: conHover ? 0.9 : 0 }
    }

    return {
      color: new THREE.Color(base.color),
      velo: base.velo + (conHover ? 0.14 : 0),
      marco: conHover ? 1 : base.marco,
    }
  }, [estado, activa, conHover])

  const etiqueta = useMemo(
    () => crearEtiqueta(cancha.nombre, tipo.corto, estado),
    [cancha.nombre, tipo.corto, estado],
  )

  const primerCuadro = useRef(true)

  useFrame((_, delta) => {
    const k = primerCuadro.current ? 1 : 1 - Math.exp(-18 * Math.min(delta, 0.05))

    primerCuadro.current = false

    velo.color.lerp(objetivo.color, k)
    marco.color.lerp(objetivo.color, k)
    velo.opacity += (objetivo.velo - velo.opacity) * k
    marco.opacity += (objetivo.marco - marco.opacity) * k

    const pendiente =
      Math.abs(objetivo.velo - velo.opacity) > 0.004 ||
      Math.abs(objetivo.marco - marco.opacity) > 0.004

    if (pendiente) invalidate()
  })

  useEffect(
    () => () => {
      propias.plano.dispose()
      propias.marco.dispose()
    },
    [propias],
  )

  useEffect(
    () => () => {
      velo.dispose()
      marco.dispose()
    },
    [velo, marco],
  )

  useEffect(() => () => etiqueta.dispose(), [etiqueta])

  return (
    <group position={[item.x, 0, item.z]} rotation={[0, item.rot, 0]}>
      {/* Velo de estado: lo único que recibe clic y hover */}
      <mesh
        geometry={propias.plano}
        material={velo}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.05, 0]}
        raycast={clicable ? undefined : sinRaycast}
        onClick={(evento) => {
          // Un arrastre para girar la cámara no cuenta como elegir
          if (evento.delta > 6) return

          evento.stopPropagation()
          alElegir(cancha.id)
        }}
        onPointerOver={
          tocar
            ? undefined
            : (evento) => {
                evento.stopPropagation()
                alPasar(cancha.id)
              }
        }
        onPointerOut={tocar ? undefined : () => alPasar(null)}
      />

      <mesh
        geometry={propias.marco}
        material={marco}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.07, 0]}
        raycast={sinRaycast}
      />

      {/* Arcos: están siempre, como en la cancha real (los del fútbol 8
          arriba y abajo; los de cada mitad, a los lados) */}
      {[-1, 1].map((lado) => (
        <group key={`arco-${lado}`} position={[0, 0, (lado * largo) / 2 - lado * 0.3]}>
          {[-1, 1].map((poste) => (
            <mesh
              key={poste}
              geometry={geometrias.poste}
              material={materiales.poste}
              position={[(poste * tipo.arco.ancho) / 2, tipo.arco.alto / 2, 0]}
              scale={[1, tipo.arco.alto, 1]}
              raycast={sinRaycast}
            />
          ))}
          <mesh
            geometry={geometrias.travesano}
            material={materiales.poste}
            position={[0, tipo.arco.alto, 0]}
            scale={[tipo.arco.ancho, 1, 1]}
            raycast={sinRaycast}
          />
        </group>
      ))}

      {/* Etiqueta con nombre y estado, solo del formato que se muestra */}
      {activa && (
        <sprite
          position={[0, ALTO_POSTE + 2.2, 0]}
          // Tamaño fijo en pantalla (sizeAttenuation=false): no crece al acercar
          scale={[ESCALA_ETIQUETA, ESCALA_ETIQUETA * (200 / 640), 1]}
          renderOrder={20}
          raycast={sinRaycast}
        >
          <spriteMaterial map={etiqueta} transparent depthTest={false} sizeAttenuation={false} />
        </sprite>
      )}
    </group>
  )
}

// ---------------------------------------------------------------------------
// Cámara: aérea con ligera inclinación, transición suave e interrumpible
// ---------------------------------------------------------------------------

function calcularVista(vista, foco, radio, aspecto) {
  // En pantallas estrechas se aleja para que la cancha entre completa
  const factor = aspecto < 1.2 ? Math.min(2, 1.2 / Math.max(aspecto, 0.45)) : 1
  const esferica = new THREE.Spherical()
  const objetivo = new THREE.Vector3()

  if (!foco || vista === 'general') {
    esferica.set((radio * 2.25 + 12) * factor, 0.66, 0.18)
  } else {
    const medida = Math.max(foco.tipo.ancho, foco.tipo.largo)

    objetivo.set(foco.x, 0, foco.z)

    // Las canchas del bloque grande están giradas: lateral y arco se miden
    // respecto a su eje largo
    if (vista === 'lateral') {
      esferica.set((medida * 1.45 + 9) * factor, 1.0, Math.PI / 2 - foco.rot)
    } else if (vista === 'arco') {
      esferica.set((foco.tipo.largo * 0.9 + 8) * factor, 1.2, foco.rot)
    } else {
      // Zoom a la cancha elegida: la distancia justa para que llene el visor
      // (su huella en el mundo, según esté girada o no)
      const enX = foco.rot ? foco.tipo.largo : foco.tipo.ancho
      const enZ = foco.rot ? foco.tipo.ancho : foco.tipo.largo
      const alto = 2 * Math.tan(THREE.MathUtils.degToRad(FOV / 2))
      // Margen extra: con la inclinación, el borde cercano se ve más grande
      const distancia = (Math.max(enZ, enX / Math.max(aspecto, 0.45)) / alto) * 1.3 + 4

      esferica.set(distancia, 0.55, 0.3)
    }
  }

  const posicion = new THREE.Vector3().setFromSpherical(esferica).add(objetivo)

  return { posicion, objetivo }
}

function Camara({ vista, foco, radio, sinMovimiento }) {
  const { camera, gl, invalidate, size } = useThree()
  const meta = useRef({
    posicion: new THREE.Vector3(),
    objetivo: new THREE.Vector3(),
    activa: false,
  })
  const inicial = useRef(true)

  const controles = useMemo(() => new OrbitControls(camera, gl.domElement), [camera, gl])

  useEffect(() => {
    controles.enablePan = false
    controles.enableDamping = !sinMovimiento
    controles.dampingFactor = 0.12
    controles.rotateSpeed = 0.7
    controles.zoomSpeed = 0.8
    controles.minPolarAngle = 0.12
    controles.maxPolarAngle = 1.38 // nunca baja del piso
    controles.minDistance = 7
    controles.maxDistance = radio * 5 + 40
    // Un dedo gira; dos dedos pellizcan para acercar y a la vez giran
    controles.touches = { ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_ROTATE }

    const alCambiar = () => invalidate()
    // Si el usuario toma el control, la transición automática se detiene
    const alEmpezar = () => {
      meta.current.activa = false
    }

    controles.addEventListener('change', alCambiar)
    controles.addEventListener('start', alEmpezar)

    // La rueda sola desplaza la página; para acercar se usa Ctrl + rueda (o
    // pellizco en táctil). Así el visor no atrapa el scroll.
    const alRodar = (evento) => {
      if (!evento.ctrlKey && !evento.metaKey) evento.stopImmediatePropagation()
    }

    gl.domElement.addEventListener('wheel', alRodar, { capture: true })

    return () => {
      controles.removeEventListener('change', alCambiar)
      controles.removeEventListener('start', alEmpezar)
      gl.domElement.removeEventListener('wheel', alRodar, { capture: true })
    }
  }, [controles, gl, invalidate, radio, sinMovimiento])

  useEffect(() => () => controles.dispose(), [controles])

  const aspecto = size.width / Math.max(size.height, 1)

  useEffect(() => {
    const destino = calcularVista(vista, foco, radio, aspecto)

    meta.current.posicion.copy(destino.posicion)
    meta.current.objetivo.copy(destino.objetivo)

    if (inicial.current || sinMovimiento) {
      camera.position.copy(destino.posicion)
      controles.target.copy(destino.objetivo)
      controles.update()
      meta.current.activa = false
      inicial.current = false
    } else {
      meta.current.activa = true
    }

    invalidate()
  }, [vista, foco, radio, aspecto, sinMovimiento, camera, controles, invalidate])

  useFrame((_, delta) => {
    const actual = meta.current

    if (actual.activa) {
      // ease-out por amortiguación exponencial: arranca rápido y se asienta
      // (≈95 % en 190 ms, 99 % en 290 ms). Al ser un seguimiento del destino,
      // cambiar de vista a mitad de camino la redirige sin saltos.
      const k = 1 - Math.exp(-16 * Math.min(delta, 0.05))

      camera.position.lerp(actual.posicion, k)
      controles.target.lerp(actual.objetivo, k)

      if (
        camera.position.distanceToSquared(actual.posicion) < 0.01 &&
        controles.target.distanceToSquared(actual.objetivo) < 0.01
      ) {
        camera.position.copy(actual.posicion)
        controles.target.copy(actual.objetivo)
        actual.activa = false
      }

      invalidate()
    }

    controles.update()
  })

  return null
}

// ---------------------------------------------------------------------------
// Enfoque: todo lo que no es la cancha elegida queda desenfocado.
//
// Visto desde arriba, todas las canchas están a la misma distancia de la
// cámara, así que una profundidad de campo no las separaría. En cambio, la
// escena se dibuja en una textura y un último paso la copia a la pantalla:
// fuera de la silueta de la cancha elegida (con postes y etiqueta) la
// desenfoca, le baja el color y la oscurece; dentro la deja nítida, con un
// borde suave. La silueta se recalcula en cada cuadro, así acompaña a la
// cámara al girar o acercar. (Un backdrop-filter de CSS no sirve: Chromium
// desenfoca toda la caja e ignora el hueco del clip-path.)
// ---------------------------------------------------------------------------

const MAX_PUNTOS = 8

const VERTICE_ENFOQUE = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`

const FRAGMENTO_ENFOQUE = /* glsl */ `
  #define MAX_PUNTOS ${MAX_PUNTOS}

  uniform sampler2D tEscena;
  uniform vec2 texel;
  uniform float fuerza;
  uniform float radio;
  uniform float borde;
  uniform int total;
  uniform vec2 puntos[MAX_PUNTOS];

  varying vec2 vUv;

  // Distancia con signo al borde del polígono convexo (positiva adentro)
  float distanciaSilueta(vec2 p) {
    float d = 1e6;

    for (int i = 0; i < MAX_PUNTOS; i++) {
      if (i >= total) break;

      vec2 a = puntos[i];
      vec2 b = puntos[i + 1 < total ? i + 1 : 0];
      vec2 e = b - a;

      d = min(d, (e.x * (p.y - a.y) - e.y * (p.x - a.x)) / max(length(e), 0.0001));
    }

    return d;
  }

  void main() {
    vec4 nitida = texture2D(tEscena, vUv);

    gl_FragColor = nitida;

    if (fuerza > 0.001) {
      // Desenfoque en dos anillos de 10 muestras
      vec3 suma = nitida.rgb;
      float peso = 1.0;

      for (int anillo = 1; anillo <= 2; anillo++) {
        float r = radio * float(anillo) * 0.5;

        for (int i = 0; i < 10; i++) {
          float angulo = (float(i) + float(anillo) * 0.5) * 0.6283185;

          suma += texture2D(tEscena, vUv + vec2(cos(angulo), sin(angulo)) * r * texel).rgb;
          peso += 1.0;
        }
      }

      vec3 borrosa = suma / peso;
      float gris = dot(borrosa, vec3(0.2126, 0.7152, 0.0722));

      borrosa = mix(vec3(gris), borrosa, 0.5) * 0.62;

      float dentro = smoothstep(-borde, borde, distanciaSilueta(gl_FragCoord.xy));

      gl_FragColor.rgb = mix(nitida.rgb, mix(borrosa, nitida.rgb, dentro), fuerza);
    }

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`

// Envolvente convexa (cadena monótona) de puntos [x, y]
function envolvente(puntos) {
  const p = [...puntos].sort((a, b) => a[0] - b[0] || a[1] - b[1])
  const cruz = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])
  const mitad = (lista) => {
    const resultado = []

    lista.forEach((punto) => {
      while (
        resultado.length >= 2 &&
        cruz(resultado[resultado.length - 2], resultado[resultado.length - 1], punto) <= 0
      ) {
        resultado.pop()
      }
      resultado.push(punto)
    })
    resultado.pop()

    return resultado
  }

  return [...mitad(p), ...mitad([...p].reverse())]
}

const ESQUINAS = [
  [-1, -1],
  [1, -1],
  [1, 1],
  [-1, 1],
]

function Enfoque({ foco, sinMovimiento }) {
  const { gl, scene, camera, invalidate } = useThree()

  const recursos = useMemo(() => {
    const destino = new THREE.WebGLRenderTarget(1, 1, {
      type: THREE.HalfFloatType,
      samples: 4, // conserva el antialias de la escena
    })
    const material = new THREE.ShaderMaterial({
      vertexShader: VERTICE_ENFOQUE,
      fragmentShader: FRAGMENTO_ENFOQUE,
      uniforms: {
        tEscena: { value: destino.texture },
        texel: { value: new THREE.Vector2(1, 1) },
        fuerza: { value: 0 },
        radio: { value: 6 },
        borde: { value: 8 },
        total: { value: 0 },
        puntos: { value: Array.from({ length: MAX_PUNTOS }, () => new THREE.Vector2()) },
      },
      depthTest: false,
      depthWrite: false,
    })
    const cuadro = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material)

    cuadro.frustumCulled = false

    const escenaFinal = new THREE.Scene()

    escenaFinal.add(cuadro)

    return {
      destino,
      material,
      cuadro,
      escenaFinal,
      camaraFinal: new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1),
      tamano: new THREE.Vector2(),
      punto: new THREE.Vector3(),
    }
  }, [])

  useEffect(
    () => () => {
      recursos.destino.dispose()
      recursos.material.dispose()
      recursos.cuadro.geometry.dispose()
    },
    [recursos],
  )

  // Prioridad 1: este paso dibuja la escena (R3F deja de hacerlo solo)
  useFrame((_, delta) => {
    const { destino, material, escenaFinal, camaraFinal, tamano, punto } = recursos
    const u = material.uniforms

    // Entra y sale con ease-out (~200 ms); sin movimiento, de golpe
    const meta = foco ? 1 : 0
    const k = sinMovimiento ? 1 : 1 - Math.exp(-14 * Math.min(delta, 0.05))

    u.fuerza.value += (meta - u.fuerza.value) * k
    if (Math.abs(meta - u.fuerza.value) < 0.004) u.fuerza.value = meta
    else invalidate()

    // Sin enfoque se dibuja directo, sin pasos extra
    if (u.fuerza.value === 0) {
      gl.setRenderTarget(null)
      gl.render(scene, camera)
      return
    }

    gl.getDrawingBufferSize(tamano)

    if (destino.width !== tamano.x || destino.height !== tamano.y) {
      destino.setSize(tamano.x, tamano.y)
    }

    const escala = gl.getPixelRatio()

    u.texel.value.set(1 / tamano.x, 1 / tamano.y)
    u.radio.value = 6 * escala
    u.borde.value = 8 * escala

    // Silueta en pantalla de la cancha elegida. Al salir (foco = null) se
    // conserva la última mientras se desvanece.
    if (foco) {
      // La matriz de la cámara se actualiza al renderizar; se fuerza antes de
      // proyectar para no ir un cuadro atrás
      camera.updateMatrixWorld()

      const { ancho, largo } = foco.tipo
      const cos = Math.cos(foco.rot)
      const sen = Math.sin(foco.rot)
      const pantalla = []

      // Píxeles del búfer, con el origen abajo (como gl_FragCoord)
      const aPantalla = () => [((punto.x + 1) / 2) * tamano.x, ((punto.y + 1) / 2) * tamano.y]

      // Piso de la cancha, con su borde
      ESQUINAS.forEach(([sx, sz]) => {
        const lx = sx * (ancho / 2 + 1)
        const lz = sz * (largo / 2 + 1)

        punto.set(foco.x + lx * cos + lz * sen, 0, foco.z - lx * sen + lz * cos).project(camera)
        pantalla.push(aPantalla())
      })

      // Recuadro de la etiqueta: tiene tamaño fijo en pantalla (ver <sprite>)
      punto.set(foco.x, ALTO_POSTE + 2.2, foco.z).project(camera)

      const [ex, ey] = aPantalla()
      const mitadAlto = (camera.projectionMatrix.elements[5] * tamano.y) / 2
      const semiAncho = ESCALA_ETIQUETA * 0.5 * mitadAlto
      const semiAlto = ESCALA_ETIQUETA * (200 / 640) * 0.5 * mitadAlto

      ESQUINAS.forEach(([sx, sy]) => pantalla.push([ex + sx * semiAncho, ey + sy * semiAlto]))

      const casco = envolvente(pantalla)
      const cx = casco.reduce((s, p) => s + p[0], 0) / casco.length
      const cy = casco.reduce((s, p) => s + p[1], 0) / casco.length
      const aire = 14 * escala // para que el borde no corte la malla

      casco.forEach(([x, y], indice) => {
        const d = Math.hypot(x - cx, y - cy) || 1

        u.puntos.value[indice].set(x + ((x - cx) / d) * aire, y + ((y - cy) / d) * aire)
      })
      u.total.value = casco.length
    }

    gl.setRenderTarget(destino)
    gl.render(scene, camera)
    gl.setRenderTarget(null)
    gl.render(escenaFinal, camaraFinal)
  }, 1)

  return null
}

// ---------------------------------------------------------------------------
// Mundo
// ---------------------------------------------------------------------------

function Mundo({
  disposicion,
  estados,
  seleccionadaId,
  hoverId,
  alElegir,
  alPasar,
  vista,
  noche,
  sinMovimiento,
  tocar,
}) {
  const { gl } = useThree()
  const ambiente = useRef({ noche: noche ? 1 : 0 })

  const geometrias = useMemo(() => crearGeometrias(), [])
  const materiales = useMemo(() => crearMateriales(), [])

  useEffect(
    () => () => Object.values(geometrias).forEach((g) => g.dispose()),
    [geometrias],
  )

  useEffect(
    () => () => Object.values(materiales).forEach((m) => m.dispose()),
    [materiales],
  )

  useEffect(() => {
    gl.domElement.style.cursor = hoverId ? 'pointer' : ''
  }, [hoverId, gl])

  const foco = disposicion.items.find((it) => it.cancha.id === seleccionadaId) ?? null
  const radio = disposicion.radio

  // El bloque grande muestra el fútbol 8 solo cuando es la cancha elegida
  const modoDe = (grandeId) => (grandeId != null && grandeId === seleccionadaId ? 'f8' : 'f5')

  return (
    <>
      <color attach="background" args={['#bcd9e3']} />

      <Ambiente
        noche={noche}
        sinMovimiento={sinMovimiento}
        ambiente={ambiente}
        materiales={materiales}
      />

      <mesh
        material={materiales.suelo}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.32, 0]}
        raycast={sinRaycast}
      >
        <planeGeometry args={[radio * 12 + 200, radio * 12 + 200]} />
      </mesh>

      {disposicion.bloques.map((bloque) => (
        <Bloque
          key={bloque.clave}
          bloque={bloque}
          modo={modoDe(bloque.grandeId)}
          geometrias={geometrias}
          materiales={materiales}
          ambiente={ambiente}
        />
      ))}

      {/* Marcas de entrada pintadas en el piso */}
      {disposicion.bloques.flatMap((bloque) =>
        bloque.marcas.map((marca) => (
          <mesh
            key={`${bloque.clave}-${marca.x.toFixed(1)}-${marca.z.toFixed(1)}`}
            geometry={geometrias.entrada}
            material={materiales[`entrada-${marca.direccion}`]}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[marca.x, 0.02, marca.z]}
            raycast={sinRaycast}
          />
        )),
      )}

      {disposicion.items.map((item) => {
        const modo = modoDe(item.grandeId)
        const activa =
          item.rol === 'suelta' || (item.rol === 'grande' ? modo === 'f8' : modo === 'f5')

        return (
          <Zona
            key={item.cancha.id}
            item={item}
            estado={
              item.cancha.id === seleccionadaId
                ? 'seleccionada'
                : (estados[item.cancha.id] ?? 'cargando')
            }
            hover={hoverId === item.cancha.id}
            activa={activa}
            // El fútbol 8 se elige desde el panel ("Cancha completa"); en el
            // 3D se tocan sus mitades
            clicable={item.rol !== 'grande'}
            geometrias={geometrias}
            materiales={materiales}
            tocar={tocar}
            alElegir={alElegir}
            alPasar={alPasar}
          />
        )
      })}

      <Camara vista={vista} foco={foco} radio={radio} sinMovimiento={sinMovimiento} />
      <Enfoque foco={foco} sinMovimiento={sinMovimiento} />
    </>
  )
}

export default function Escena3D({ alFallar, ...props }) {
  return (
    <Canvas
      frameloop="demand"
      dpr={[1, 1.75]}
      camera={{ fov: FOV, near: 0.5, far: 900, position: [0, 80, 80] }}
      gl={{ antialias: true, powerPreference: 'default' }}
      onCreated={({ gl }) => {
        // Si el navegador pierde el contexto WebGL se pasa a la vista de lista
        gl.domElement.addEventListener('webglcontextlost', (evento) => {
          evento.preventDefault()
          alFallar?.()
        })
      }}
    >
      <Mundo {...props} />
    </Canvas>
  )
}
