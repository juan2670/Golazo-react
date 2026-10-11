import { lazy, useEffect } from 'react'
import { BrowserRouter, Route } from 'react-router-dom'

import MainLayout from '../layouts/MainLayout'

import { CartProvider } from '../context/CartContext'
import { AuthProvider } from '../context/AuthContext'

import AnimatedRoutes from './AnimatedRoutes'
import ProtectedRoute from './ProtectedRoute'

import Home from '../pages/Home/Home'

// Solo el Home viaja en el primer paquete. Las demás páginas se cargan
// aparte y se precargan cuando el navegador queda libre.
const paginas = {
  servicios: () => import('../pages/Servicios/Servicios'),
  torneos: () => import('../pages/Torneos/Torneos'),
  reservas: () => import('../pages/Reservas/Reservas'),
  tienda: () => import('../pages/Tienda/Tienda'),
  carrito: () => import('../pages/Carrito/Carrito'),
  nosotros: () => import('../pages/Nosotros/Nosotros'),
  ubicacion: () => import('../pages/Ubicacion/Ubicacion'),
  login: () => import('../pages/Login/Login'),
  registro: () => import('../pages/Registro/Registro'),
  perfil: () => import('../pages/Perfil/Perfil'),
  noEncontrada: () => import('../pages/NotFound/NotFound'),
}

const Servicios = lazy(paginas.servicios)
const Torneos = lazy(paginas.torneos)
const Reservas = lazy(paginas.reservas)
const Tienda = lazy(paginas.tienda)
const Carrito = lazy(paginas.carrito)
const Nosotros = lazy(paginas.nosotros)
const Ubicacion = lazy(paginas.ubicacion)
const Login = lazy(paginas.login)
const Registro = lazy(paginas.registro)
const Perfil = lazy(paginas.perfil)
const NotFound = lazy(paginas.noEncontrada)

function precargarPaginas() {
  Object.values(paginas).forEach((cargar) => cargar())
}

function AppRoutes() {
  useEffect(() => {
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(precargarPaginas, { timeout: 4000 })

      return () => window.cancelIdleCallback(id)
    }

    const id = window.setTimeout(precargarPaginas, 2500)

    return () => window.clearTimeout(id)
  }, [])

  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <MainLayout>
            <AnimatedRoutes>
              <Route path="/" element={<Home />} />
              <Route path="/servicios" element={<Servicios />} />
              <Route path="/torneos" element={<Torneos />} />
              <Route path="/tienda" element={<Tienda />} />
              <Route path="/carrito" element={<Carrito />} />
              <Route path="/nosotros" element={<Nosotros />} />
              <Route path="/ubicacion" element={<Ubicacion />} />
              <Route path="/login" element={<Login />} />
              <Route path="/registro" element={<Registro />} />

              <Route element={<ProtectedRoute />}>
                <Route path="/reservas" element={<Reservas />} />
                <Route path="/perfil" element={<Perfil />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </AnimatedRoutes>
          </MainLayout>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default AppRoutes
