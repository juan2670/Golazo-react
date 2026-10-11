import { useEffect, useRef, useState } from 'react'
import { Modal } from 'react-bootstrap'
import { PlayFill } from 'react-bootstrap-icons'

import { MEDIA } from '../../animations/gsap'

// Cada video se reproduce en silencio solo mientras está a la vista, así la
// página no descarga ni decodifica todos a la vez. Con movimiento reducido o
// ahorro de datos se queda en la portada y se abre al hacer clic.
function VideoTile({ video, onOpen }) {
  const caja = useRef(null)
  const reproductor = useRef(null)

  useEffect(() => {
    const marco = caja.current
    const elemento = reproductor.current

    const sinMovimiento = window.matchMedia(MEDIA.reduce).matches
    const ahorroDeDatos = navigator.connection?.saveData

    if (sinMovimiento || ahorroDeDatos || !('IntersectionObserver' in window)) {
      return undefined
    }

    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          elemento.play().catch(() => {})
        } else {
          elemento.pause()
        }
      },
      { threshold: 0.4 },
    )

    observador.observe(marco)

    return () => observador.disconnect()
  }, [])

  return (
    <button
      ref={caja}
      type="button"
      className="video-tile chamfer"
      style={{ '--cut': '1.25rem' }}
      aria-label={`Ver video: ${video.titulo}`}
      onClick={() => onOpen(video)}
    >
      <video
        ref={reproductor}
        src={video.src}
        poster={video.poster}
        muted
        loop
        playsInline
        preload="none"
        aria-hidden="true"
        tabIndex={-1}
      />

      <span className="video-tile__play" aria-hidden="true">
        <PlayFill size={26} />
      </span>

      <span className="video-tile__caption">
        <strong className="d-block">{video.titulo}</strong>
        <span className="d-none d-sm-block small opacity-75">{video.texto}</span>
      </span>
    </button>
  )
}

// destacado: el primer video ocupa dos filas en pantallas grandes.
function VideoGallery({ videos, destacado = false }) {
  const [activo, setActivo] = useState(null)

  return (
    <>
      <div className={`video-grid ${destacado ? 'video-grid--feature' : ''}`.trim()}>
        {videos.map((video) => (
          <VideoTile key={video.id} video={video} onOpen={setActivo} />
        ))}
      </div>

      <Modal
        show={Boolean(activo)}
        onHide={() => setActivo(null)}
        size="xl"
        centered
        data-bs-theme="dark"
        contentClassName="video-modal"
      >
        <Modal.Header closeButton closeLabel="Cerrar">
          <Modal.Title as="h2" className="h5 mb-0">
            {activo?.titulo}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="p-0">
          {activo && (
            <video
              className="video-modal__player"
              src={activo.src}
              poster={activo.poster}
              controls
              autoPlay
              loop
              playsInline
            />
          )}
        </Modal.Body>
      </Modal>
    </>
  )
}

export default VideoGallery
