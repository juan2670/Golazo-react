import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  Alert,
  Button,
  Card,
  Col,
  FloatingLabel,
  Form,
  Row,
} from 'react-bootstrap'

import { useAuth } from '../../context/AuthContext'
import { imagenes } from '../../data/negocio'
import { api } from '../../services/api'
import Reveal from '../../components/Reveal/Reveal'
import logo from '../../assets/logo/logoGolazo.png'

function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  // Página desde la que se pidió iniciar sesión (Carrito, Reservas, Perfil...)
  const destino = location.state?.desde || '/reservas'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()

  const handleSubmit = async (event) => {
    event.preventDefault()

    setError('')
    setLoading(true)

    try {
      const data = await api.post('/usuarios/login', {
        email,
        password,
      })

      // Se espera a tener el usuario: si no, la ruta protegida lo ve sin
      // sesión y lo devuelve a /login.
      await login(data.access_token)

      navigate(destino, { replace: true })
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Row className="g-0 min-vh-page">
      <Col
        lg={6}
        className="auth-visual d-none d-lg-flex align-items-end p-5"
        data-bs-theme="dark"
      >
        <img className="auth-visual__bg" src={imagenes.partidoNoche} alt="" />

        <div>
          <img src={logo} alt="El Golazo Club" height="110" className="mb-4" />

          <h1 className="display-4 text-uppercase">Vive el partido</h1>

          <p className="lead mb-0 col-xl-9">
            Reserva tu cancha y disfruta todo lo que El Golazo tiene para ti.
          </p>
        </div>
      </Col>

      <Col
        lg={6}
        className="d-flex align-items-center justify-content-center bg-body-tertiary p-4 py-6"
      >
        <Reveal className="w-100" style={{ maxWidth: '28rem' }}>
          <Card className="border-0 shadow">
            <Card.Body className="p-4 p-md-5">
              <h2 className="fs-1 mb-1">Iniciar sesión</h2>
              <p className="text-body-secondary mb-4">
                Ingresa a tu cuenta para continuar.
              </p>

              <Form onSubmit={handleSubmit}>
                <FloatingLabel controlId="email" label="Correo electrónico" className="mb-3">
                  <Form.Control
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />
                </FloatingLabel>

                <FloatingLabel controlId="password" label="Contraseña" className="mb-3">
                  <Form.Control
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                  />
                </FloatingLabel>

                <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
                  <Form.Check type="checkbox" id="recordarme" label="Recordarme" />

                  <Button type="button" variant="link" className="p-0">
                    ¿Olvidaste tu contraseña?
                  </Button>
                </div>

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
                  {loading ? 'Iniciando sesión…' : 'Iniciar sesión'}
                </Button>
              </Form>

              <p className="text-center text-body-secondary mt-4 mb-0">
                ¿Todavía no tienes una cuenta?{' '}
                <Link to="/registro" state={location.state} className="fw-bold">
                  Crear cuenta
                </Link>
              </p>
            </Card.Body>
          </Card>
        </Reveal>
      </Col>
    </Row>
  )
}

export default Login
