const telefonoWhatsapp = '573125793699'

const mensajeWhatsapp =
  'Hola, estoy interesado en alquilar cancha de Fútbol 5 o Fútbol 8 para la fecha dd/mm/aaaa. ¿Tienen disponibilidad, horarios y tarifas? Gracias.'

export const negocio = {
  nombre: 'El Golazo Club',
  eslogan: 'Alquiler de canchas sintéticas en Soacha, Cundinamarca',
  experiencia: '+4',

  telefono: '+57 312 579 3699',
  telefonoHref: 'tel:+573125793699',
  email: 'golazosoacha@gmail.com',

  direccion: 'Cra. 7 #14 SUR-46, Soacha, Cundinamarca, Colombia',
  mapaHref:
    'https://www.google.com/maps/place/el+golazo/@4.5618701,-74.2342582,17z',
  mapaEmbed:
    'https://www.google.com/maps?q=4.5618648,-74.2316833&z=17&output=embed',

  horario: {
    dias: 'Lunes a domingo',
    // Espacios duros para que "a. m." y "p. m." no se partan en dos líneas
    horas: '7:00 a. m. – 12:00 p. m.',
  },

  whatsapp: `https://wa.me/${telefonoWhatsapp}?text=${encodeURIComponent(mensajeWhatsapp)}`,
  whatsappTorneos: `https://wa.me/${telefonoWhatsapp}?text=${encodeURIComponent(
    'Hola, quiero información para inscribir un equipo en los torneos y ligas de El Golazo.',
  )}`,
  whatsappEventos: `https://wa.me/${telefonoWhatsapp}?text=${encodeURIComponent(
    'Hola, quiero información para organizar un evento en El Golazo.',
  )}`,

  redes: [
    {
      nombre: 'Instagram',
      href: 'https://www.instagram.com/elgolazoclub',
    },
    {
      nombre: 'Facebook',
      href: 'https://www.facebook.com/elgolazoclub',
    },
    {
      nombre: 'TikTok',
      href: 'https://www.tiktok.com/@elgolazoclub',
    },
  ],
}

export const imagenes = {
  canchaF5: '/images/fut5/dia/CanchasPlanoGeneral.jpeg',
  canchaF5Detalle: '/images/fut5/dia/cancha.jpeg',
  canchaF8: '/images/fut8/dia/fondoCanchaGolazo-web.jpg',
  dronNoche: '/images/dron/noche/tomaNocheAlta.jpg',
  partidoNoche: '/images/dron/noche/tomaCancha.jpeg',
  partidoNocheFemenino: '/images/dron/noche/cancha2.jpeg',
  zonaSocial: '/images/negocio/zonaSocial/zona_social.jpeg',
  parqueadero: '/images/negocio/parqueadero/parqueadero.jpeg',
  torneo: '/images/torneos/masculino/Torneo.jpg',
}

export const videos = {
  hero: '/videos/hero-web.mp4',
  heroPoster: '/videos/hero-poster.jpg',
  dron: '/videos/dron/videoDron-web.mp4',
}

// Las versiones "-web" están comprimidas para internet; los originales
// pesan entre 4 y 25 MB y se quedan en la carpeta sin usarse.
export const videosCanchas = [
  {
    id: 'f5-recorrido',
    titulo: 'Recorrido por la cancha de fútbol 5',
    texto: 'Césped sintético, líneas nuevas y mallas altas.',
    src: '/videos/fut5/dia/1-video-cancha-web.mp4',
    poster: '/videos/fut5/dia/1-poster.jpg',
  },
  {
    id: 'f5-sol',
    titulo: 'Fútbol 5 a pleno sol',
    texto: 'Una cancha cerrada y lista para tu partido.',
    src: '/videos/fut5/dia/2-video-cancha-web.mp4',
    poster: '/videos/fut5/dia/2-poster.jpg',
  },
  {
    id: 'f5-vista',
    titulo: 'Vista elevada del césped',
    texto: 'Las canchas y la zona social vistas desde arriba.',
    src: '/videos/fut5/dia/3-video-cancha-web.mp4',
    poster: '/videos/fut5/dia/3-poster.jpg',
  },
]

export const videosClub = [
  {
    id: 'entrada',
    titulo: 'Así se llega al club',
    texto: 'La entrada sobre la Cra. 7, en Soacha.',
    src: '/videos/entrada-web.mp4',
    poster: '/videos/entrada-poster.jpg',
  },
  {
    id: 'barra',
    titulo: 'Zona de la barra',
    texto: 'Mesas, bebidas y algo para comer entre partidos.',
    src: '/videos/negocio/barra/barra-web.mp4',
    poster: '/videos/negocio/barra/barra-poster.jpg',
  },
  {
    id: 'noche',
    titulo: 'Un partido de noche',
    texto: 'La cancha iluminada vista desde el aire.',
    src: '/videos/dron/videoCancha-web.mp4',
    poster: '/videos/dron/videoCancha-poster.jpg',
  },
  {
    id: 'aereo',
    titulo: 'Vista aérea del club',
    texto: 'Todas las canchas en una sola toma.',
    src: '/videos/dron/videoDron-web.mp4',
    poster: '/videos/dron/videoDron-poster.jpg',
  },
]
