import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  FloatingLabel,
  Form,
  Row,
  Spinner,
} from 'react-bootstrap'

import Reveal from '../../components/Reveal/Reveal'
import SplitHeading from '../../components/SplitHeading/SplitHeading'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../services/api'

import MisPedidos from './MisPedidos'

function Dato({ etiqueta, valor }) {
  return (
    <Col sm={6}>
      <div className="border-bottom pb-3">
        <small className="text-body-secondary d-block fw-bold">{etiqueta}</small>
        <strong className="text-break">{valor}</strong>
      </div>
    </Col>
  )
}

function Perfil() {
  const navigate = useNavigate()
  const { logout } = useAuth()

  const [usuario, setUsuario] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editando, setEditando] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const [mensaje, setMensaje] = useState('')

  const [formulario, setFormulario] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
  })

  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        const data = await api.get('/usuarios/me')

        setUsuario(data)

        setFormulario({
          nombre: data.nombre,
          apellido: data.apellido,
          telefono: data.telefono || '',
        })
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    cargarPerfil()
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormulario((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleGuardar = async (event) => {
    event.preventDefault()

    setError('')
    setMensaje('')
    setGuardando(true)

    try {
      const data = await api.patch('/usuarios/me', {
        nombre: formulario.nombre,
        apellido: formulario.apellido,
        telefono: formulario.telefono || null,
      })

      setUsuario(data)

      setFormulario({
        nombre: data.nombre,
        apellido: data.apellido,
        telefono: data.telefono || '',
      })

      setEditando(false)
      setMensaje('Datos actualizados correctamente.')
    } catch (error) {
      setError(error.message)
    } finally {
      setGuardando(false)
    }
  }

  const handleCancelar = () => {
    setFormulario({
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      telefono: usuario.telefono || '',
    })

    setEditando(false)
    setError('')
  }

  if (loading) {
    return (
      <section className="min-vh-page d-flex align-items-center justify-content-center gap-3 text-body-secondary">
        <Spinner animation="border" size="sm" />
        Cargando perfil…
      </section>
    )
  }

  if (error && !usuario) {
    return (
      <section className="min-vh-page d-flex flex-column align-items-center justify-content-center gap-3">
        <Alert variant="danger" className="mb-0">
          {error}
        </Alert>

        <Button variant="primary" onClick={() => navigate('/login')}>
          Iniciar sesión
        </Button>
      </section>
    )
  }

  return (
    <section className="bg-body-tertiary min-vh-page py-6">
      <Container style={{ maxWidth: '52rem' }}>
        <header className="mb-5">
          <SplitHeading as="h1" className="display-5" alEntrar={false}>
            Mi perfil
          </SplitHeading>

          <p className="lead text-body-secondary mt-3 mb-0">
            Administra tu información y consulta los datos de tu cuenta.
          </p>
        </header>

        <Reveal className="d-grid gap-4" stagger={0.12} y={24}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="d-flex align-items-center gap-3 p-4">
              <div
                className="rounded-circle d-grid place-items-center text-dark font-display fs-2 flex-shrink-0"
                style={{
                  width: '4.5rem',
                  height: '4.5rem',
                  placeItems: 'center',
                  background: 'linear-gradient(135deg, var(--gl-grass), var(--gl-cyan))',
                }}
              >
                {usuario.nombre.charAt(0).toUpperCase()}
              </div>

              <div>
                <h2 className="h3 mb-0">
                  {usuario.nombre} {usuario.apellido}
                </h2>

                <small className="text-success fw-bold text-uppercase">
                  {usuario.rol}
                </small>
              </div>
            </Card.Body>
          </Card>

          <Card className="border-0 shadow-sm">
            <Card.Body className="p-4 p-md-5">
              <div className="d-flex justify-content-between align-items-start gap-3 mb-4">
                <h2 className="h3 mb-0">Datos de la cuenta</h2>

                {!editando && (
                  <Button
                    type="button"
                    variant="outline-primary"
                    size="sm"
                    onClick={() => {
                      setMensaje('')
                      setError('')
                      setEditando(true)
                    }}
                  >
                    Editar
                  </Button>
                )}
              </div>

              {editando ? (
                <Form onSubmit={handleGuardar} className="entra">
                  <div className="d-grid gap-3">
                    <FloatingLabel controlId="nombre" label="Nombre">
                      <Form.Control
                        name="nombre"
                        type="text"
                        placeholder="Nombre"
                        value={formulario.nombre}
                        onChange={handleChange}
                        required
                        minLength={2}
                        maxLength={100}
                      />
                    </FloatingLabel>

                    <FloatingLabel controlId="apellido" label="Apellido">
                      <Form.Control
                        name="apellido"
                        type="text"
                        placeholder="Apellido"
                        value={formulario.apellido}
                        onChange={handleChange}
                        required
                        minLength={2}
                        maxLength={100}
                      />
                    </FloatingLabel>

                    <FloatingLabel controlId="telefono" label="Teléfono">
                      <Form.Control
                        name="telefono"
                        type="text"
                        placeholder="Teléfono"
                        value={formulario.telefono}
                        onChange={handleChange}
                        maxLength={20}
                      />
                    </FloatingLabel>
                  </div>

                  {error && (
                    <Alert variant="danger" className="mt-3 mb-0 py-2">
                      {error}
                    </Alert>
                  )}

                  <div className="d-flex justify-content-end gap-2 mt-4">
                    <Button
                      type="button"
                      variant="outline-secondary"
                      onClick={handleCancelar}
                      disabled={guardando}
                    >
                      Cancelar
                    </Button>

                    <Button type="submit" variant="primary" disabled={guardando}>
                      {guardando ? 'Guardando…' : 'Guardar cambios'}
                    </Button>
                  </div>
                </Form>
              ) : (
                <Row className="g-4 entra">
                  <Dato etiqueta="Nombre" valor={usuario.nombre} />
                  <Dato etiqueta="Apellido" valor={usuario.apellido} />
                  <Dato etiqueta="Correo electrónico" valor={usuario.email} />
                  <Dato
                    etiqueta="Teléfono"
                    valor={usuario.telefono || 'No registrado'}
                  />
                  <Dato etiqueta="Rol" valor={usuario.rol} />
                </Row>
              )}
            </Card.Body>
          </Card>

          {mensaje && (
            <Alert variant="success" className="mb-0">
              {mensaje}
            </Alert>
          )}

          <MisPedidos />

          <div>
            <Button variant="outline-danger" onClick={logout}>
              Cerrar sesión
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}

export default Perfil
