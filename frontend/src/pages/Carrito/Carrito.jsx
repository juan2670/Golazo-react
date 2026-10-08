import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import './Carrito.css'

function Carrito() {
  const {
    carrito,
    aumentarCantidad,
    disminuirCantidad,
    eliminarDelCarrito,
    vaciarCarrito,
    precioTotal,
  } = useCart()

  if (carrito.length === 0) {
    return (
      <section className="carrito carrito--vacio">
        <p className="carrito__label">GOLAZO STORE</p>

        <h1>Tu carrito está vacío.</h1>

        <p>
          Agrega algunos productos para comenzar tu compra.
        </p>

        <Link to="/tienda" className="carrito__button">
          Explorar tienda
        </Link>
      </section>
    )
  }

  return (
    <section className="carrito">
      <div className="carrito__header">
        <div>
          <p className="carrito__label">GOLAZO STORE</p>

          <h1>Tu carrito.</h1>
        </div>

        <button
          className="carrito__vaciar"
          onClick={vaciarCarrito}
        >
          Vaciar carrito
        </button>
      </div>

      <div className="carrito__layout">
        <div className="carrito__productos">
          {carrito.map((producto) => (
            <article
              className="carrito__producto"
              key={producto.id}
            >
              <img
                src={producto.imagen}
                alt={producto.nombre}
              />

              <div className="carrito__producto-info">
                <p>{producto.categoria}</p>

                <h2>{producto.nombre}</h2>

                <strong>
                  $
                  {producto.precio.toLocaleString('es-CO')}
                </strong>
              </div>

              <div className="carrito__cantidad">
                <button
                  onClick={() =>
                    disminuirCantidad(producto.id)
                  }
                >
                  −
                </button>

                <span>{producto.cantidad}</span>

                <button
                  onClick={() =>
                    aumentarCantidad(producto.id)
                  }
                >
                  +
                </button>
              </div>

              <div className="carrito__subtotal">
                <strong>
                  $
                  {(
                    producto.precio * producto.cantidad
                  ).toLocaleString('es-CO')}
                </strong>

                <button
                  onClick={() =>
                    eliminarDelCarrito(producto.id)
                  }
                >
                  Eliminar
                </button>
              </div>
            </article>
          ))}
        </div>

        <aside className="carrito__resumen">
          <p>RESUMEN</p>

          <h2>Tu compra</h2>

          <div>
            <span>Productos</span>

            <strong>
              ${precioTotal.toLocaleString('es-CO')}
            </strong>
          </div>

          <div>
            <span>Envío</span>

            <strong>Por calcular</strong>
          </div>

          <hr />

          <div className="carrito__total">
            <span>Total</span>

            <strong>
              ${precioTotal.toLocaleString('es-CO')}
            </strong>
          </div>

          <button className="carrito__comprar">
            Continuar compra
          </button>

          <Link to="/tienda">
            Seguir comprando →
          </Link>
        </aside>
      </div>
    </section>
  )
}

export default Carrito