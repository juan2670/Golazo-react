import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { api } from '../../services/api'
import './Login.css'

import { useAuth } from '../../context/AuthContext'

function Login() {
  const navigate = useNavigate()

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

      login(data.access_token)

      navigate('/reservas')
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="auth">
      <div className="auth__visual">
        <div className="auth__visual-content">
          <p>GOLAZO</p>

          <h1>
            VIVE
            <br />
            EL PARTIDO.
          </h1>

          <span>
            Reserva, compra y disfruta todo lo que Golazo tiene
            para ti.
          </span>
        </div>
      </div>

      <div className="auth__form-container">
        <div className="auth__form">

          <div className="auth__header">
            <p>BIENVENIDO DE NUEVO</p>

            <h2>Iniciar sesión</h2>

            <span>
              Ingresa a tu cuenta para continuar.
            </span>
          </div>

          <form onSubmit={handleSubmit}>

            <div className="auth__field">
              <label htmlFor="email">
                Correo electrónico
              </label>

              <input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>

            <div className="auth__field">
              <label htmlFor="password">
                Contraseña
              </label>

              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>

            <div className="auth__options">
              <label>
                <input type="checkbox" />
                <span>Recordarme</span>
              </label>

              <button type="button">
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            {error && (
              <p className="auth__error">
                {error}
              </p>
            )}

            <button
              className="auth__submit"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>

          </form>

          <div className="auth__footer">
            <span>¿Todavía no tienes una cuenta?</span>

            <Link to="/registro">
              Crear cuenta
            </Link>
          </div>

        </div>
      </div>
    </section>
  )
}

export default Login