import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Alert,
  Button,
  ButtonGroup,
  Card,
  Col,
  Container,
  Row,
} from 'react-bootstrap'
import { Cart3, Trash3 } from 'react-bootstrap-icons'

import Reveal from '../../components/Reveal/Reveal'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { api } from '../../services/api'

function Carrito() {
  const {
    carrito,
    aumentarCantidad,
    disminuirCantidad,
    eliminarDelCarrito,
    vaciarCarrito,
    precioTotal,
  } = useCart()
  const { autenticado, loading: cargandoSesion } = useAuth()
  const navigate = useNavigate()

  const [procesando, setProcesando] = useState(false)
  const [error, setError] = useState('')
  const [pedidoCreado, setPedidoCreado] = useState(null)

  const continuarCompra = async () => {
    // Sin sesión: se inicia sesión y Login devuelve al carrito, que sigue guardado.
    if (!autenticado) {
      navigate('/login', { state: { desde: '/carrito' } })
      return
    }

    setError('')
    setProcesando(true)

    try {
      // Solo se envían ids y cantidades: el precio lo pone el servidor.
      const pedido = await api.post('/pedidos/', {
        items: carrito.map((producto) => ({
          producto_id: producto.id,
          cantidad: producto.cantidad,
        })),
      })

      setPedidoCreado(pedido)
      vaciarCarrito()
    } catch (errorCompra) {
      setError(errorCompra.message)
    } finally {
      setProcesando(false)
    }
  }

  if (pedidoCreado) {
    return (
      <section className="bg-body-tertiary min-vh-page d-flex align-items-center">
        <Container className="py-6" style={{ maxWidth: '44rem' }}>
          <Reveal>
            <Card className="border-0 shadow-sm entra">
              <Card.Body className="p-4 p-md-5">
                <p className="text-success fw-bold mb-2">Pedido #{pedidoCreado.id}</p>

                <h1 className="display-6 mb-3">¡Pedido recibido!</h1>

                <p className="lead text-body-secondary mb-4">
                  Tu pedido quedó registrado como pendiente. Puedes consultarlo
                  cuando quieras en tu perfil.
                </p>

                <ul className="list-unstyled d-grid gap-2 mb-4">
                  {pedidoCreado.detalles.map((detalle) => (
                    <li key={detalle.id} className="d-flex justify-content-between gap-3">
                      <span>
                        {detalle.cantidad} × {detalle.producto.nombre}
                      </span>
                      <strong>${detalle.subtotal.toLocaleString('es-CO')}</strong>
                    </li>
                  ))}
                </ul>

                <div className="d-flex justify-content-between align-items-baseline border-top pt-3 mb-4">
                  <span className="fw-bold">Total</span>
                  <strong className="font-display fs-2 text-success">
                    ${pedidoCreado.total.toLocaleString('es-CO')}
                  </strong>
                </div>

                <div className="d-flex flex-wrap gap-3">
                  <Button as={Link} to="/perfil" variant="primary" className="btn-sport">
                    <span>Ver mis pedidos</span>
                  </Button>

                  <Button as={Link} to="/tienda" variant="outline-primary" className="btn-sport">
                    <span>Seguir comprando</span>
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Reveal>
        </Container>
      </section>
    )
  }

  if (carrito.length === 0) {
    return (
      <section className="bg-body-tertiary min-vh-page d-flex align-items-center">
        <Container className="text-center py-6">
          <Reveal>
            <Cart3 size={56} className="text-success mb-4" />

            <h1 className="display-6 mb-3">Tu carrito está vacío</h1>

            <p className="lead text-body-secondary mb-4">
              Agrega productos de la tienda para comenzar tu compra.
            </p>

            <Button as={Link} to="/tienda" variant="primary" size="lg" className="btn-sport">
              <span>Explorar tienda</span>
            </Button>
          </Reveal>
        </Container>
      </section>
    )
  }

  return (
    <section className="bg-body-tertiary min-vh-page py-6">
      <Container>
        <header className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-4">
          <h1 className="display-5 mb-0">Tu carrito</h1>

          <Button variant="outline-danger" size="sm" onClick={vaciarCarrito}>
            Vaciar carrito
          </Button>
        </header>

        <Row className="g-4 align-items-start">
          <Col lg={8}>
            <div className="d-grid gap-3">
              {carrito.map((producto) => (
                <Card className="border-0 shadow-sm" key={producto.id}>
                  <Card.Body>
                    <Row className="g-3 align-items-center">
                      <Col xs={4} sm={3} md={2}>
                        <div className="ratio ratio-1x1">
                          <img
                            src={producto.imagen}
                            alt={producto.nombre}
                            className="object-fit-cover rounded"
                          />
                        </div>
                      </Col>

                      <Col xs={8} sm={9} md={4}>
                        <small className="text-success fw-bold">
                          {producto.categoria}
                        </small>

                        <h2 className="h5 mb-1">{producto.nombre}</h2>

                        <span className="text-body-secondary">
                          ${producto.precio.toLocaleString('es-CO')}
                        </span>
                      </Col>

                      <Col xs={6} md={3}>
                        <ButtonGroup aria-label={`Cantidad de ${producto.nombre}`}>
                          <Button
                            variant="outline-secondary"
                            aria-label="Quitar uno"
                            onClick={() => disminuirCantidad(producto.id)}
                          >
                            −
                          </Button>

                          <Button variant="outline-secondary" disabled className="opacity-100 text-body">
                            {producto.cantidad}
                          </Button>

                          <Button
                            variant="outline-secondary"
                            aria-label="Agregar uno"
                            // No deja pasar del stock que informó el servidor
                            disabled={
                              typeof producto.stock === 'number' &&
                              producto.cantidad >= producto.stock
                            }
                            onClick={() => aumentarCantidad(producto.id)}
                          >
                            +
                          </Button>
                        </ButtonGroup>
                      </Col>

                      <Col xs={6} md={3} className="text-end">
                        <strong className="d-block fs-5">
                          $
                          {(producto.precio * producto.cantidad).toLocaleString('es-CO')}
                        </strong>

                        <Button
                          variant="link"
                          size="sm"
                          className="text-danger p-0"
                          onClick={() => eliminarDelCarrito(producto.id)}
                        >
                          <Trash3 className="me-1" />
                          Eliminar
                        </Button>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              ))}
            </div>
          </Col>

          <Col lg={4}>
            <Card className="border-0 shadow position-sticky" style={{ top: 'calc(var(--nav-h) + 1.5rem)' }}>
              <Card.Body className="p-4">
                <h2 className="h3 mb-4">Tu compra</h2>

                <div className="d-flex justify-content-between mb-2">
                  <span className="text-body-secondary">Productos</span>
                  <strong>${precioTotal.toLocaleString('es-CO')}</strong>
                </div>

                <div className="d-flex justify-content-between mb-3">
                  <span className="text-body-secondary">Envío</span>
                  <strong>Por calcular</strong>
                </div>

                <hr />

                <div className="d-flex justify-content-between align-items-baseline mb-4">
                  <span className="fw-bold">Total</span>
                  <strong className="font-display fs-2 text-success">
                    ${precioTotal.toLocaleString('es-CO')}
                  </strong>
                </div>

                {error && (
                  <Alert variant="danger" className="py-2">
                    {error}
                  </Alert>
                )}

                <Button
                  variant="primary"
                  size="lg"
                  className="w-100"
                  disabled={procesando || cargandoSesion}
                  onClick={continuarCompra}
                >
                  {procesando ? 'Procesando…' : 'Continuar compra'}
                </Button>

                {!autenticado && !cargandoSesion && (
                  <p className="small text-body-secondary text-center mt-2 mb-0">
                    Te pediremos iniciar sesión para confirmar el pedido.
                  </p>
                )}

                <Button as={Link} to="/tienda" variant="link" className="w-100 mt-2">
                  Seguir comprando
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  )
}

export default Carrito
