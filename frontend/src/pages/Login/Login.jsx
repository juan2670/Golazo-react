import { Link } from 'react-router-dom'
import './Login.css'

function Login() {
  const handleSubmit = (event) => {
    event.preventDefault()
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

            <button className="auth__submit" type="submit">
              Iniciar sesión
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