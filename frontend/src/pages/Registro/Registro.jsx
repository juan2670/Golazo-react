import { Link } from 'react-router-dom'
import './Registro.css'

function Registro() {
  const handleSubmit = (event) => {
    event.preventDefault()
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
              <label htmlFor="nombre">Nombre</label>

              <input
                id="nombre"
                type="text"
                placeholder="Sebastián"
                required
              />
            </div>

            <div className="registro__field">
              <label htmlFor="apellido">Apellido</label>

              <input
                id="apellido"
                type="text"
                placeholder="Pérez"
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
              required
            />
          </div>

          <div className="registro__field">
            <label htmlFor="telefono">Teléfono</label>

            <input
              id="telefono"
              type="tel"
              placeholder="+57 300 000 0000"
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
                required
              />
            </div>
          </div>

          <label className="registro__terms">
            <input type="checkbox" required />

            <span>
              Acepto los términos y condiciones de Golazo.
            </span>
          </label>

          <button type="submit">
            Crear cuenta
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