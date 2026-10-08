import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import './Tienda.css'

const productos = [
  {
    id: 1,
    nombre: 'Balón Golazo Pro',
    categoria: 'Fútbol',
    precio: 85000,
    imagen:
      'https://images.pexels.com/photos/3999307/pexels-photo-3999307.jpeg?auto=compress&cs=tinysrgb&w=900',
  },
  {
    id: 2,
    nombre: 'Camiseta Golazo',
    categoria: 'Ropa',
    precio: 95000,
    imagen:
      'https://images.pexels.com/photos/28555936/pexels-photo-28555936.jpeg?auto=compress&cs=tinysrgb&w=900',
  },
  {
    id: 3,
    nombre: 'Guayos Pro',
    categoria: 'Fútbol',
    precio: 180000,
    imagen:
      'https://images.pexels.com/photos/774321/pexels-photo-774321.jpeg?auto=compress&cs=tinysrgb&w=900',
  },
  {
    id: 4,
    nombre: 'Bebida deportiva',
    categoria: 'Bebidas',
    precio: 7000,
    imagen:
      'https://images.pexels.com/photos/20847016/pexels-photo-20847016.jpeg?auto=compress&cs=tinysrgb&w=900',
  },
  {
    id: 5,
    nombre: 'Medias deportivas',
    categoria: 'Ropa',
    precio: 25000,
    imagen:
      'https://images.pexels.com/photos/35571216/pexels-photo-35571216.jpeg?auto=compress&cs=tinysrgb&w=900',
  },
  {
    id: 6,
    nombre: 'Agua',
    categoria: 'Bebidas',
    precio: 4000,
    imagen:
      'https://images.pexels.com/photos/5069203/pexels-photo-5069203.jpeg?auto=compress&cs=tinysrgb&w=900',
  },
]

const categorias = ['Todos', 'Fútbol', 'Ropa', 'Bebidas']

function Tienda() {
  const [categoriaSeleccionada, setCategoriaSeleccionada] =
    useState('Todos')

  const { agregarAlCarrito, cantidadTotal } = useCart()

  const productosFiltrados =
    categoriaSeleccionada === 'Todos'
      ? productos
      : productos.filter(
          (producto) =>
            producto.categoria === categoriaSeleccionada,
        )

  return (
    <section className="tienda">
      <div className="tienda__header">
        <div>
          <p>GOLAZO STORE</p>

          <h1>Equípate para el partido.</h1>

          <span>
            Encuentra productos deportivos, bebidas y accesorios
            para complementar tu experiencia en Golazo.
          </span>
        </div>

        <Link to="/carrito" className="tienda__carrito">
          Carrito
          <strong>{cantidadTotal}</strong>
        </Link>
      </div>

      <div className="tienda__categorias">
        {categorias.map((categoria) => (
          <button
            key={categoria}
            className={
              categoriaSeleccionada === categoria
                ? 'categoria--activa'
                : ''
            }
            onClick={() => setCategoriaSeleccionada(categoria)}
          >
            {categoria}
          </button>
        ))}
      </div>

      <div className="tienda__productos">
        {productosFiltrados.map((producto) => (
          <article className="producto" key={producto.id}>
            <div className="producto__imagen">
              <img
                src={producto.imagen}
                alt={producto.nombre}
              />
            </div>

            <div className="producto__info">
              <p>{producto.categoria}</p>

              <h2>{producto.nombre}</h2>

              <strong>
                ${producto.precio.toLocaleString('es-CO')}
              </strong>

              <button
                onClick={() => agregarAlCarrito(producto)}
              >
                Agregar al carrito
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Tienda