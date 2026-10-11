// Mientras la transición de página cubre la pantalla, las animaciones de
// entrada de la nueva página esperan a que se descubra.
let cambiando = false

export const marcarCambioDePagina = (valor) => {
  cambiando = valor
}

export const retrasoDeEntrada = () => (cambiando ? 0.25 : 0)
