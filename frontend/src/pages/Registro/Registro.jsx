import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  FloatingLabel,
  Form,
  Row,
} from 'react-bootstrap'

import { api } from '../../services/api'
import Reveal from '../../components/Reveal/Reveal'
import logo from '../../assets/logo/logoGolazo.png'

function Registro() {
  const navigate = useNavigate()
  // Se conserva a dónde volver después de iniciar sesión (p. ej. el carrito)
  const location = useLocation()

  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [email, setEmail] = useState('')
  const [telefono, setTelefono] = useState('')
  const [password, setPassword] = useState('')
  const [confirmarPassword, setConfirmarPassword] = useState('')

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()

    setError('')

    if (password !== confirmarPassword) {
      setError('Las contraseñas no coinciden.')
      return
    }

    if (password.length < 8) {
      setError('La contraseña debe tener mínimo 8 caracteres.')
      return
    }

    setLoading(true)

    try {
      await api.post('/usuarios/registro', {
        nombre,
        apellido,
        email,
        password,
        telefono: telefono || null,
      })

      navigate('/login', { state: location.state })
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="bg-body-tertiary min-vh-page py-6">
      <Container style={{ maxWidth: '42rem' }}>
        <Reveal>
          <header className="text-center mb-4">
            <img src={logo} alt="El Golazo Club" height="90" className="mb-3" />

            <h1 className="display-5">Crear cuenta</h1>

            <p className="text-body-secondary mb-0">
              Regístrate para reservar canchas y realizar tus compras.
            </p>
          </header>

          <Card className="border-0 shadow">
            <Card.Body className="p-4 p-md-5">
              <Form onSubmit={handleSubmit}>
                <Row className="g-3">
                  <Col md={6}>
                    <FloatingLabel controlId="nombre" label="Nombre">
                      <Form.Control
                        type="text"
                        placeholder="Tu nombre"
                        value={nombre}
                        onChange={(event) => setNombre(event.target.value)}
                        required
                      />
                    </FloatingLabel>
                  </Col>

                  <Col md={6}>
                    <FloatingLabel controlId="apellido" label="Apellido">
                      <Form.Control
                        type="text"
                        placeholder="Tu apellido"
                        value={apellido}
                        onChange={(event) => setApellido(event.target.value)}
                        required
                      />
                    </FloatingLabel>
                  </Col>

                  <Col xs={12}>
                    <FloatingLabel controlId="registro-email" label="Correo electrónico">
                      <Form.Control
                        type="email"
                        placeholder="tu@email.com"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        required
                      />
                    </FloatingLabel>
                  </Col>

                  <Col xs={12}>
                    <FloatingLabel controlId="telefono" label="Teléfono (opcional)">
                      <Form.Control
                        type="tel"
                        placeholder="+57 300 000 0000"
                        value={telefono}
                        onChange={(event) => setTelefono(event.target.value)}
                      />
                    </FloatingLabel>
                  </Col>

                  <Col md={6}>
                    <FloatingLabel controlId="registro-password" label="Contraseña">
                      <Form.Control
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        minLength={8}
                        required
                      />
                    </FloatingLabel>
                  </Col>

                  <Col md={6}>
                    <FloatingLabel controlId="confirmar-password" label="Confirmar contraseña">
                      <Form.Control
                        type="password"
                        placeholder="Confirmar contraseña"
                        value={confirmarPassword}
                        onChange={(event) => setConfirmarPassword(event.target.value)}
                        minLength={8}
                        required
                      />
                    </FloatingLabel>
                  </Col>
                </Row>

                <Form.Check
                  type="checkbox"
                  id="terminos"
                  label="Acepto los términos y condiciones de El Golazo."
                  className="my-4"
                  required
                />

                {error && (
                  <Alert variant="danger" className="py-2">
                    {error}
                  </Alert>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-100"
                  disabled={loading}
                >
                  {loading ? 'Creando cuenta…' : 'Crear cuenta'}
                </Button>
              </Form>
            </Card.Body>
          </Card>

          <p className="text-center text-body-secondary mt-4 mb-0">
            ¿Ya tienes una cuenta?{' '}
            <Link to="/login" state={location.state} className="fw-bold">
              Iniciar sesión
            </Link>
          </p>
        </Reveal>
      </Container>
    </section>
  )
}

export default Registro
