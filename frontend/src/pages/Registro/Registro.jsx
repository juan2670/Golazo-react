import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { api } from '../../services/api'
import './Registro.css'

function Registro() {
  const navigate = useNavigate()

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

      navigate('/login')
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="registro">
      <div className="registro__container">

        <div className="registro__header">
          <p>GOLAZO</p>

          <h1>Crear cuenta.</h1>

          <span>
            Regístrate para reservar canchas y realizar tus
            compras.
          </span>
        </div>

        <form
          className="registro__form"
          onSubmit={handleSubmit}
        >

          <div className="registro__row">

            <div className="registro__field">
              <label htmlFor="nombre">
                Nombre
              </label>

              <input
                id="nombre"
                type="text"
                placeholder="Sebastián"
                value={nombre}
                onChange={(event) => setNombre(event.target.value)}
                required
              />
            </div>

            <div className="registro__field">
              <label htmlFor="apellido">
                Apellido
              </label>

              <input
                id="apellido"
                type="text"
                placeholder="Pérez"
                value={apellido}
                onChange={(event) => setApellido(event.target.value)}
                required
              />
            </div>

          </div>

          <div className="registro__field">
            <label htmlFor="registro-email">
              Correo electrónico
            </label>

            <input
              id="registro-email"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="registro__field">
            <label htmlFor="telefono">
              Teléfono
            </label>

            <input
              id="telefono"
              type="tel"
              placeholder="+57 300 000 0000"
              value={telefono}
              onChange={(event) => setTelefono(event.target.value)}
            />
          </div>

          <div className="registro__row">

            <div className="registro__field">
              <label htmlFor="registro-password">
                Contraseña
              </label>

              <input
                id="registro-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                minLength={8}
                required
              />
            </div>

            <div className="registro__field">
              <label htmlFor="confirmar-password">
                Confirmar contraseña
              </label>

              <input
                id="confirmar-password"
                type="password"
                placeholder="••••••••"
                value={confirmarPassword}
                onChange={(event) =>
                  setConfirmarPassword(event.target.value)
                }
                minLength={8}
                required
              />
            </div>

          </div>

          <label className="registro__terms">
            <input
              type="checkbox"
              required
            />

            <span>
              Acepto los términos y condiciones de Golazo.
            </span>
          </label>

          {error && (
            <p className="registro__error">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
          >
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>

        </form>

        <div className="registro__footer">
          <span>¿Ya tienes una cuenta?</span>

          <Link to="/login">
            Iniciar sesión
          </Link>
        </div>

      </div>
    </section>
  )
}

export default Registro