import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '../../context/AuthContext'
import { api } from '../../services/api'

import './Perfil.css'

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
      <section className="perfil">
        <div className="perfil__loading">
          Cargando perfil...
        </div>
      </section>
    )
  }

  if (error && !usuario) {
    return (
      <section className="perfil">
        <div className="perfil__error">
          <p>{error}</p>

          <button onClick={() => navigate('/login')}>
            Iniciar sesión
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="perfil">
      <div className="perfil__header">
        <p>GOLAZO</p>

        <h1>Mi perfil.</h1>

        <span>
          Administra tu información y consulta los datos de tu cuenta.
        </span>
      </div>

      <div className="perfil__content">

        <div className="perfil__card">
          <div className="perfil__avatar">
            {usuario.nombre.charAt(0).toUpperCase()}
          </div>

          <div className="perfil__identity">
            <h2>
              {usuario.nombre} {usuario.apellido}
            </h2>

            <span>{usuario.rol}</span>
          </div>
        </div>

        <div className="perfil__card">

          <div className="perfil__card-header">
            <div>
              <p>INFORMACIÓN PERSONAL</p>
              <h2>Datos de la cuenta</h2>
            </div>

            {!editando && (
              <button
                type="button"
                onClick={() => {
                  setMensaje('')
                  setError('')
                  setEditando(true)
                }}
              >
                Editar
              </button>
            )}
          </div>

          {editando ? (
            <form
              className="perfil__form"
              onSubmit={handleGuardar}
            >
              <div className="perfil__field">
                <label htmlFor="nombre">
                  Nombre
                </label>

                <input
                  id="nombre"
                  name="nombre"
                  type="text"
                  value={formulario.nombre}
                  onChange={handleChange}
                  required
                  minLength={2}
                  maxLength={100}
                />
              </div>

              <div className="perfil__field">
                <label htmlFor="apellido">
                  Apellido
                </label>

                <input
                  id="apellido"
                  name="apellido"
                  type="text"
                  value={formulario.apellido}
                  onChange={handleChange}
                  required
                  minLength={2}
                  maxLength={100}
                />
              </div>

              <div className="perfil__field">
                <label htmlFor="telefono">
                  Teléfono
                </label>

                <input
                  id="telefono"
                  name="telefono"
                  type="text"
                  value={formulario.telefono}
                  onChange={handleChange}
                  maxLength={20}
                />
              </div>

              {error && (
                <p className="perfil__form-error">
                  {error}
                </p>
              )}

              <div className="perfil__form-actions">
                <button
                  type="button"
                  onClick={handleCancelar}
                  disabled={guardando}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={guardando}
                >
                  {guardando
                    ? 'Guardando...'
                    : 'Guardar cambios'}
                </button>
              </div>
            </form>
          ) : (
            <div className="perfil__data">

              <div className="perfil__field">
                <span>Nombre</span>
                <strong>{usuario.nombre}</strong>
              </div>

              <div className="perfil__field">
                <span>Apellido</span>
                <strong>{usuario.apellido}</strong>
              </div>

              <div className="perfil__field">
                <span>Correo electrónico</span>
                <strong>{usuario.email}</strong>
              </div>

              <div className="perfil__field">
                <span>Teléfono</span>
                <strong>
                  {usuario.telefono || 'No registrado'}
                </strong>
              </div>

              <div className="perfil__field">
                <span>Rol</span>
                <strong>{usuario.rol}</strong>
              </div>

            </div>
          )}
        </div>

        {mensaje && (
          <div className="perfil__success">
            {mensaje}
          </div>
        )}

        <div className="perfil__actions">
          <button
            className="perfil__logout"
            onClick={logout}
          >
            Cerrar sesión
          </button>
        </div>

      </div>
    </section>
  )
}

export default Perfil