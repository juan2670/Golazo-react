import { createContext, useContext, useState } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [carrito, setCarrito] = useState([])

  const agregarAlCarrito = (producto) => {
    setCarrito((carritoActual) => {
      const productoExistente = carritoActual.find(
        (item) => item.id === producto.id,
      )

      if (productoExistente) {
        return carritoActual.map((item) =>
          item.id === producto.id
            ? {
                ...item,
                cantidad: item.cantidad + 1,
              }
            : item,
        )
      }

      return [
        ...carritoActual,
        {
          ...producto,
          cantidad: 1,
        },
      ]
    })
  }

  const aumentarCantidad = (id) => {
    setCarrito((carritoActual) =>
      carritoActual.map((item) =>
        item.id === id
          ? {
              ...item,
              cantidad: item.cantidad + 1,
            }
          : item,
      ),
    )
  }

  const disminuirCantidad = (id) => {
    setCarrito((carritoActual) =>
      carritoActual
        .map((item) =>
          item.id === id
            ? {
                ...item,
                cantidad: item.cantidad - 1,
              }
            : item,
        )
        .filter((item) => item.cantidad > 0),
    )
  }

  const eliminarDelCarrito = (id) => {
    setCarrito((carritoActual) =>
      carritoActual.filter((item) => item.id !== id),
    )
  }

  const vaciarCarrito = () => {
    setCarrito([])
  }

  const cantidadTotal = carrito.reduce(
    (total, item) => total + item.cantidad,
    0,
  )

  const precioTotal = carrito.reduce(
    (total, item) => total + item.precio * item.cantidad,
    0,
  )

  return (
    <CartContext.Provider
      value={{
        carrito,
        agregarAlCarrito,
        aumentarCantidad,
        disminuirCantidad,
        eliminarDelCarrito,
        vaciarCarrito,
        cantidadTotal,
        precioTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}