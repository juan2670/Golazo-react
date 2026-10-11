import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Container,
  Nav,
} from 'react-bootstrap'
import { Cart3 } from 'react-bootstrap-icons'

import Bump from '../../components/Bump/Bump'
import Reveal from '../../components/Reveal/Reveal'
import SplitHeading from '../../components/SplitHeading/SplitHeading'
import { useCart } from '../../context/CartContext'
import { api } from '../../services/api'

// Catálogo de respaldo: se muestra mientras responde el servidor o si no
// hay conexión. El inventario real (precios y stock) viene de /productos/.
const CATALOGO_LOCAL = [
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

  const [productos, setProductos] = useState(CATALOGO_LOCAL)
  const [aviso, setAviso] = useState('')

  useEffect(() => {
    let activo = true

    api
      .get('/productos/')
      .then((datos) => {
        if (!activo) return

        if (Array.isArray(datos) && datos.length > 0) {
          setProductos(datos)
        } else {
          setAviso(
            'La tienda en línea todavía no tiene productos cargados. Muy pronto podrás comprar aquí.',
          )
        }
      })
      .catch(() => {
        if (activo) {
          setAviso(
            'No pudimos cargar el inventario actualizado. Puedes ver los productos, pero para comprar necesitas conexión con el servidor.',
          )
        }
      })

    return () => {
      activo = false
    }
  }, [])

  const productosFiltrados =
    categoriaSeleccionada === 'Todos'
      ? productos
      : productos.filter(
          (producto) =>
            producto.categoria === categoriaSeleccionada,
        )

  return (
    <section className="bg-body-tertiary min-vh-page py-6">
      <Container>
        <header className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-4">
          <div>
            <SplitHeading as="h1" className="display-5" alEntrar={false}>
              Equípate para el partido
            </SplitHeading>

            <p className="lead text-body-secondary mt-3 mb-0">
              Productos deportivos, bebidas y accesorios para tu partido en El Golazo.
            </p>
          </div>

          <Button as={Link} to="/carrito" variant="outline-primary" className="d-inline-flex align-items-center gap-2">
            <Cart3 />
            Carrito
            <Bump value={cantidadTotal}>
              <Badge bg="primary" pill>
                {cantidadTotal}
              </Badge>
            </Bump>
          </Button>
        </header>

        {aviso && (
          <Alert variant="info" className="mb-4">
            {aviso}
          </Alert>
        )}

        <Nav variant="pills" className="gap-2 mb-4">
          {categorias.map((categoria) => (
            <Nav.Item key={categoria}>
              <Nav.Link
                as="button"
                type="button"
                active={categoriaSeleccionada === categoria}
                onClick={() => setCategoriaSeleccionada(categoria)}
              >
                {categoria}
              </Nav.Link>
            </Nav.Item>
          ))}
        </Nav>

        <Reveal className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-4" stagger={0.1}>
          {productosFiltrados.map((producto) => (
            <Col key={producto.id}>
              <Card className="h-100 border-0 shadow-sm overflow-hidden entra entra--suave">
                <div className="ratio ratio-4x3">
                  <img
                    src={producto.imagen}
                    alt={producto.nombre}
                    loading="lazy"
                    className="object-fit-cover"
                  />
                </div>

                <Card.Body className="d-flex flex-column">
                  <Badge bg="info" text="dark" className="align-self-start mb-2">
                    {producto.categoria}
                  </Badge>

                  <Card.Title as="h2" className="h4">
                    {producto.nombre}
                  </Card.Title>

                  <p className="fs-4 fw-bold mb-1">
                    ${producto.precio.toLocaleString('es-CO')}
                  </p>

                  {/* El stock solo existe en los productos que vienen del servidor */}
                  <p className="small text-body-secondary mb-3">
                    {producto.stock === 0
                      ? 'Agotado'
                      : producto.stock <= 5
                        ? `Quedan ${producto.stock}`
                        : '\u00a0'}
                  </p>

                  <Button
                    variant="primary"
                    className="mt-auto"
                    disabled={producto.stock === 0}
                    onClick={() => agregarAlCarrito(producto)}
                  >
                    {producto.stock === 0 ? 'Agotado' : 'Agregar al carrito'}
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Reveal>
      </Container>
    </section>
  )
}

export default Tienda
