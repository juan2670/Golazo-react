import { BrowserRouter, Routes, Route } from 'react-router-dom'

import MainLayout from '../layouts/MainLayout'

import { CartProvider } from '../context/CartContext'
import { AuthProvider } from '../context/AuthContext'

import ProtectedRoute from './ProtectedRoute'

import Home from '../pages/Home/Home'
import Reservas from '../pages/Reservas/Reservas'
import Tienda from '../pages/Tienda/Tienda'
import Carrito from '../pages/Carrito/Carrito'
import Nosotros from '../pages/Nosotros/Nosotros'
import Ubicacion from '../pages/Ubicacion/Ubicacion'
import Login from '../pages/Login/Login'
import Registro from '../pages/Registro/Registro'
import Perfil from '../pages/Perfil/Perfil'

function AppRoutes() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <MainLayout>
            <Routes>

              <Route path="/" element={<Home />} />

              <Route element={<ProtectedRoute />}>
                <Route path="/reservas" element={<Reservas />} />
              </Route>

              <Route path="/tienda" element={<Tienda />} />

              <Route path="/carrito" element={<Carrito />} />

              <Route path="/nosotros" element={<Nosotros />} />

              <Route path="/ubicacion" element={<Ubicacion />} />

              <Route path="/login" element={<Login />} />

              <Route path="/registro" element={<Registro />} />

              <Route element={<ProtectedRoute />}>
                <Route path="/perfil" element={<Perfil />} />
              </Route>

            </Routes>
          </MainLayout>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default AppRoutes