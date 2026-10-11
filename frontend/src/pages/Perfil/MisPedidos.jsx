import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Alert, Badge, Button, Card, Spinner } from 'react-bootstrap'

import { api } from '../../services/api'

const formatoFecha = new Intl.DateTimeFormat('es-CO', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

const COLOR_ESTADO = {
  pendiente: 'warning',
  cancelado: 'secondary',
}

// El backend guarda la fecha en UTC sin zona: se marca como UTC para que el
// navegador la muestre en la hora local.
function fechaLocal(fechaUtc) {
  return formatoFecha.format(new Date(`${fechaUtc}Z`))
}

function Pedido({ pedido, alCancelar }) {
  const [confirmando, setConfirmando] = useState(false)
  const [cancelando, setCancelando] = useState(false)

  const cancelar = async () => {
    setCancelando(true)

    try {
      await alCancelar(pedido.id)
    } finally {
      setCancelando(false)
      setConfirmando(false)
    }
  }

  return (
    <article className={`border rounded-3 p-3 entra ${pedido.estado === 'cancelado' ? 'opacity-75' : ''}`}>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-2">
        <div>
          <strong>Pedido #{pedido.id}</strong>
          <small className="d-block text-body-secondary">{fechaLocal(pedido.fecha)}</small>
        </div>

        <Badge bg={COLOR_ESTADO[pedido.estado] || 'success'} text="dark" className="text-uppercase">
          {pedido.estado}
        </Badge>
      </div>

      <ul className="list-unstyled small mb-2">
        {pedido.detalles.map((detalle) => (
          <li key={detalle.id} className="d-flex justify-content-between gap-3">
            <span>
              {detalle.cantidad} × {detalle.producto.nombre}
            </span>
            <span>${detalle.subtotal.toLocaleString('es-CO')}</span>
          </li>
        ))}
      </ul>

      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 border-top pt-2">
        <strong>Total ${pedido.total.toLocaleString('es-CO')}</strong>

        {pedido.estado === 'pendiente' &&
          (confirmando ? (
            <div className="d-flex align-items-center gap-2">
              <small className="text-body-secondary">¿Cancelar este pedido?</small>
              <Button size="sm" variant="danger" disabled={cancelando} onClick={cancelar}>
                {cancelando ? 'Cancelando…' : 'Sí, cancelar'}
              </Button>
              <Button size="sm" variant="link" disabled={cancelando} onClick={() => setConfirmando(false)}>
                No
              </Button>
            </div>
          ) : (
            <Button size="sm" variant="outline-danger" onClick={() => setConfirmando(true)}>
              Cancelar pedido
            </Button>
          ))}
      </div>
    </article>
  )
}

function MisPedidos() {
  const [pedidos, setPedidos] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let activo = true

    api
      .get('/pedidos/')
      .then((datos) => activo && setPedidos(datos))
      .catch((errorCarga) => activo && setError(errorCarga.message))

    return () => {
      activo = false
    }
  }, [])

  const cancelarPedido = async (pedidoId) => {
    setError('')

    try {
      const actualizado = await api.patch(`/pedidos/${pedidoId}/cancelar`)

      setPedidos((actuales) =>
        actuales.map((pedido) => (pedido.id === pedidoId ? actualizado : pedido)),
      )
    } catch (errorCancelar) {
      setError(errorCancelar.message)
    }
  }

  return (
    <Card className="border-0 shadow-sm">
      <Card.Body className="p-4 p-md-5">
        <h2 className="h3 mb-4">Mis pedidos</h2>

        {error && (
          <Alert variant="danger" className="py-2">
            {error}
          </Alert>
        )}

        {pedidos === null && !error && (
          <div className="d-flex align-items-center gap-3 text-body-secondary">
            <Spinner animation="border" size="sm" />
            Cargando tus pedidos…
          </div>
        )}

        {pedidos?.length === 0 && (
          <div className="border border-2 border-dashed rounded-3 p-4 text-center">
            <p className="fw-bold mb-1">Todavía no tienes pedidos</p>
            <p className="text-body-secondary mb-3">Cuando compres en la tienda, aparecerán aquí.</p>
            <Button as={Link} to="/tienda" variant="outline-primary" size="sm">
              Ir a la tienda
            </Button>
          </div>
        )}

        {pedidos?.length > 0 && (
          <div className="d-grid gap-3">
            {pedidos.map((pedido) => (
              <Pedido key={pedido.id} pedido={pedido} alCancelar={cancelarPedido} />
            ))}
          </div>
        )}
      </Card.Body>
    </Card>
  )
}

export default MisPedidos
