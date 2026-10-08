# GOLAZO

Sistema web para la gestión de un complejo deportivo enfocado en fútbol, desarrollado como una aplicación full-stack con React, FastAPI y PostgreSQL.

Golazo permite gestionar usuarios, autenticación, reservas de canchas, disponibilidad de horarios y próximamente productos, pedidos y administración del sistema.

---

## Estado del proyecto

El proyecto se encuentra en desarrollo activo.

| Módulo                          | Estado        |
| ------------------------------- | ------------- |
| Landing / Home                  | Implementado  |
| Navegación                      | Implementado  |
| Diseño responsive               | Implementado  |
| Reservas                        | Implementado  |
| Disponibilidad de canchas       | Implementado  |
| Cancelación de reservas         | Implementado  |
| Historial de reservas           | Implementado  |
| Registro de usuarios            | Implementado  |
| Login                           | Implementado  |
| JWT Authentication              | Implementado  |
| Protección de rutas             | Implementado  |
| Perfil de usuario               | Implementado  |
| Edición de perfil               | Implementado  |
| Tienda                          | En desarrollo |
| Carrito                         | Implementado  |
| Productos conectados al backend | Pendiente     |
| Pedidos                         | Pendiente     |
| Administración                  | Pendiente     |
| PostgreSQL                      | Implementado  |
| SQLAlchemy                      | Implementado  |
| Alembic                         | Implementado  |
| Validaciones backend            | Implementado  |
| Pruebas automatizadas           | Pendiente     |
| Despliegue                      | Pendiente     |

---

## Objetivo

Construir una plataforma web moderna para un complejo deportivo que permita centralizar:

* Registro y autenticación de usuarios.
* Gestión de perfiles.
* Reserva de canchas.
* Consulta de disponibilidad.
* Cancelación de reservas.
* Historial de reservas.
* Catálogo de productos deportivos.
* Carrito de compras.
* Gestión de pedidos.
* Administración de usuarios, canchas y productos.
* Integración futura con servicios externos.
* Administración segura de la información.

El proyecto busca aplicar buenas prácticas de desarrollo full-stack, arquitectura por capas, seguridad, validación de datos, control de acceso y persistencia en base de datos.

---

# Arquitectura

```text
┌─────────────────────────────┐
│           React             │
│          Frontend           │
│                             │
│  Pages / Components /       │
│  Context / Services /       │
│  Protected Routes           │
└──────────────┬──────────────┘
               │ HTTP / JSON
               ▼
┌─────────────────────────────┐
│          FastAPI            │
│           Backend           │
│                             │
│ Routers / Schemas /         │
│ Services / Security         │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│         SQLAlchemy          │
│          ORM                │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│        PostgreSQL           │
│          Database           │
└─────────────────────────────┘
```

---

# Tecnologías

## Frontend

* React
* Vite
* React Router
* JavaScript
* CSS
* Context API
* Fetch API
* LocalStorage para persistencia temporal del JWT

## Backend

* Python
* FastAPI
* SQLAlchemy
* Pydantic
* PyJWT
* pwdlib
* Argon2
* Alembic
* Uvicorn

## Base de datos

* PostgreSQL 18

## Herramientas

* Visual Studio Code
* Git
* GitHub
* Git Bash / PowerShell
* pgAdmin
* Swagger / OpenAPI
* Azure DevOps

---

# Estructura del proyecto

```text
Golazo-react/
│
├── backend/
│   ├── app/
│   │   ├── core/
│   │   │   ├── __init__.py
│   │   │   ├── dependencies.py
│   │   │   └── security.py
│   │   │
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   ├── usuario.py
│   │   │   ├── cancha.py
│   │   │   ├── reserva.py
│   │   │   ├── producto.py
│   │   │   ├── pedido.py
│   │   │   └── detalle_pedido.py
│   │   │
│   │   ├── routers/
│   │   │   ├── __init__.py
│   │   │   ├── usuarios.py
│   │   │   ├── canchas.py
│   │   │   └── reservas.py
│   │   │
│   │   ├── schemas/
│   │   │   ├── __init__.py
│   │   │   ├── usuario.py
│   │   │   ├── cancha.py
│   │   │   └── reserva.py
│   │   │
│   │   ├── services/
│   │   │   └── __init__.py
│   │   │
│   │   ├── database.py
│   │   └── main.py
│   │
│   ├── migrations/
│   │   ├── README
│   │   ├── env.py
│   │   ├── script.py.mako
│   │   └── versions/
│   │
│   ├── tests/
│   │   └── __init__.py
│   │
│   ├── .env
│   ├── .gitignore
│   ├── alembic.ini
│   ├── requirements.txt
│   └── test_db.py
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar/
│   │   │   ├── Footer/
│   │   │   ├── Button/
│   │   │   ├── Card/
│   │   │   └── Modal/
│   │   │
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── CartContext.jsx
│   │   │
│   │   ├── layouts/
│   │   │   ├── MainLayout.jsx
│   │   │   └── AdminLayout.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Home/
│   │   │   ├── Reservas/
│   │   │   ├── Tienda/
│   │   │   ├── Carrito/
│   │   │   ├── Producto/
│   │   │   ├── Nosotros/
│   │   │   ├── Ubicacion/
│   │   │   ├── Contacto/
│   │   │   ├── Login/
│   │   │   ├── Registro/
│   │   │   ├── Perfil/
│   │   │   └── Admin/
│   │   │
│   │   ├── routes/
│   │   │   ├── AppRoutes.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   └── styles/
│   │       └── globals.css
│   │
│   ├── package.json
│   └── package-lock.json
│
├── README.md
└── package.json
```

---

# Autenticación

El sistema cuenta actualmente con autenticación basada en JWT.

## Registro

Endpoint:

```text
POST /usuarios/registro
```

Permite crear nuevos usuarios con:

* Nombre
* Apellido
* Correo electrónico
* Contraseña
* Teléfono

Las contraseñas nunca se almacenan directamente. Se convierten en hashes seguros utilizando Argon2 mediante `pwdlib`.

---

## Login

Endpoint:

```text
POST /usuarios/login
```

El usuario proporciona:

```json
{
  "email": "usuario@email.com",
  "password": "********"
}
```

Si las credenciales son correctas, el backend genera un JWT.

El frontend almacena temporalmente el token y lo envía en las peticiones protegidas mediante:

```text
Authorization: Bearer <token>
```

---

## Usuario autenticado

Endpoint:

```text
GET /usuarios/me
```

Obtiene la información del usuario correspondiente al JWT actual.

El backend valida:

1. Existencia del token.
2. Firma del JWT.
3. Expiración.
4. Identificador del usuario.
5. Existencia del usuario en PostgreSQL.

---

## Actualización del perfil

Endpoint:

```text
PATCH /usuarios/me
```

Actualmente permite modificar:

* Nombre
* Apellido
* Teléfono

El usuario se obtiene directamente desde el token, evitando que el cliente pueda indicar arbitrariamente el ID de otro usuario.

---

# Protección de rutas

El frontend utiliza un componente `ProtectedRoute`.

Actualmente están protegidas:

```text
/perfil
/reservas
```

Flujo:

```text
Usuario
   │
   ▼
Ruta protegida
   │
   ├── Autenticado ──► Página
   │
   └── No autenticado
             │
             ▼
           /login
```

Esto evita que usuarios sin sesión accedan directamente a páginas privadas.

---

# Sistema de reservas

El módulo de reservas permite consultar canchas, verificar disponibilidad y gestionar reservas.

## Funcionalidades

* Consulta de canchas.
* Consulta de disponibilidad.
* Selección de fecha.
* Selección de hora.
* Duración de la reserva.
* Cálculo automático del precio.
* Creación de reservas.
* Validación de horarios.
* Prevención de reservas solapadas.
* Cancelación.
* Historial de reservas.
* Protección mediante autenticación.

---

## Horarios

Las canchas funcionan dentro del rango:

```text
08:00 → 00:00
```

Las reservas se manejan por horas completas.

Actualmente se contemplan duraciones como:

```text
1 hora
2 horas
```

---

## Reglas del backend

El backend valida:

* Que la cancha exista.
* Que la cancha esté activa.
* Que la fecha no sea pasada.
* Que la hora esté dentro del horario permitido.
* Que la duración sea válida.
* Que no exista otra reserva en conflicto.
* Que el usuario esté autenticado.
* Que la reserva pertenezca al usuario que intenta cancelarla.

El precio se calcula utilizando el precio de la cancha y la duración:

```text
precio total = precio por hora × número de horas
```

---

# Endpoints actuales

## Usuarios

```text
POST  /usuarios/registro
POST  /usuarios/login
GET   /usuarios/me
PATCH /usuarios/me
```

## Canchas

```text
GET  /canchas/
POST /canchas/
```

## Reservas

```text
GET   /reservas/
POST  /reservas/
PATCH /reservas/{id}/cancelar
GET   /reservas/disponibilidad
```

---

# Modelo de datos

Actualmente la base de datos contiene las siguientes entidades:

```text
usuarios
    │
    ├─────────────── reservas
    │                    │
    │                    ▼
    │                 canchas
    │
    └─────────────── pedidos
                         │
                         ▼
                  detalles_pedido
                         │
                         ▼
                     productos
```

Tablas actuales:

```text
usuarios
canchas
reservas
productos
pedidos
detalles_pedido
```

---

# Usuarios

La tabla `usuarios` contiene información de autenticación y perfil.

Principales campos:

```text
id
nombre
apellido
email
password_hash
telefono
rol
fecha_registro
```

El campo `password_hash` almacena únicamente el hash de la contraseña.

---

# Canchas

La tabla `canchas` contiene:

```text
id
nombre
tipo
precio_hora
capacidad
estado
```

Actualmente existen canchas de:

* Fútbol 5
* Fútbol 8

---

# Productos

El modelo de productos está preparado para la futura implementación de la tienda.

Campos:

```text
id
nombre
descripcion
precio
stock
categoria
imagen
estado
```

---

# Pedidos

El modelo de pedidos permite relacionar una compra con un usuario.

Campos principales:

```text
id
usuario_id
fecha
total
estado
```

Los productos individuales de cada pedido se almacenan en `detalles_pedido`.

---

# SQLAlchemy

El proyecto utiliza SQLAlchemy como ORM.

Esto permite trabajar con PostgreSQL desde modelos Python en lugar de escribir directamente todas las consultas SQL.

La arquitectura mantiene separadas:

```text
Models
Schemas
Routers
Database
Security
Services
```

Esto facilita el mantenimiento y la futura evolución del proyecto.

---

# Alembic

Alembic se utiliza para controlar las migraciones de la base de datos.

Inicialización:

```bash
alembic init migrations
```

Crear una migración:

```bash
alembic revision --autogenerate -m "descripcion del cambio"
```

Aplicar migraciones:

```bash
alembic upgrade head
```

Consultar estado:

```bash
alembic current
```

Consultar historial:

```bash
alembic history
```

---

# Seguridad

La seguridad es uno de los objetivos principales del proyecto.

Actualmente se aplican:

* Hash de contraseñas mediante Argon2.
* JWT para autenticación.
* Validación de datos con Pydantic.
* Protección de endpoints mediante dependencias de FastAPI.
* Protección de rutas en React.
* Variables de entorno para secretos.
* `.env` excluido de Git.
* CORS configurado para el frontend.
* Validación de propiedad de las reservas.
* Validación de disponibilidad desde backend.

No se deben almacenar:

```text
Contraseñas en texto plano
JWT_SECRET_KEY
Credenciales de PostgreSQL
Tokens
Claves privadas
```

dentro del repositorio.

---

# Variables de entorno

El backend utiliza un archivo `.env`.

Ejemplo:

```env
DATABASE_URL=postgresql+psycopg://usuario:password@localhost:5432/golazo_db

JWT_SECRET_KEY=clave-secreta

JWT_ALGORITHM=HS256

JWT_ACCESS_TOKEN_EXPIRE_MINUTES=60
```

El archivo `.env` está incluido en `.gitignore`.

---

# Instalación

## Backend

Entrar al backend:

```powershell
cd backend
```

Crear entorno virtual:

```powershell
python -m venv venv
```

Activar:

```powershell
.\venv\Scripts\Activate.ps1
```

Instalar dependencias:

```powershell
pip install -r requirements.txt
```

Ejecutar:

```powershell
python -m uvicorn app.main:app --reload
```

API:

```text
http://127.0.0.1:8000
```

Documentación:

```text
http://127.0.0.1:8000/docs
```

---

# Frontend

Entrar al frontend:

```powershell
cd frontend
```

Instalar dependencias:

```powershell
npm install
```

Ejecutar:

```powershell
npm run dev
```

Aplicación:

```text
http://localhost:5173
```

---

# Base de datos

Base de datos utilizada durante el desarrollo:

```text
golazo_db
```

Servidor:

```text
localhost
```

Puerto:

```text
5432
```

Motor:

```text
PostgreSQL
```

---

# Carrito

El frontend cuenta actualmente con un carrito funcional mediante `CartContext`.

Permite:

* Agregar productos.
* Incrementar cantidades.
* Disminuir cantidades.
* Eliminar productos.
* Vaciar carrito.
* Calcular subtotal.
* Calcular total.

La tienda todavía utiliza productos definidos en el frontend y posteriormente será conectada con el backend y PostgreSQL.

---

# Diseño

La identidad visual de Golazo está basada en una estética deportiva moderna.

Características:

* Fondo oscuro.
* Blanco como color principal de texto.
* Verde neón como color de acento.
* Tipografía fuerte.
* Bordes sutiles.
* Componentes responsive.
* Fotografías deportivas.
* Animaciones y transiciones discretas.

Paleta principal:

```text
Negro
Blanco
Verde neón
```

---

# Flujo actual de usuario

```text
                  ┌──────────────┐
                  │    Inicio    │
                  └──────┬───────┘
                         │
          ┌──────────────┼──────────────┐
          ▼              ▼              ▼
      Reservas         Tienda        Ubicación
          │
          ▼
   ¿Autenticado?
      │       │
     NO      SÍ
      │       │
   /login     ▼
           Reservar
```

Flujo de autenticación:

```text
Registro
   │
   ▼
Login
   │
   ▼
JWT
   │
   ▼
AuthContext
   │
   ├── Navbar
   ├── Perfil
   └── Rutas protegidas
```

---

# Próximos objetivos

## Autenticación y usuarios

* [x] Registro
* [x] Login
* [x] JWT
* [x] Obtener usuario autenticado
* [x] Logout
* [x] Protección de rutas
* [x] Perfil
* [x] Editar perfil
* [ ] Cambio de contraseña
* [ ] Recuperación de contraseña
* [ ] Mejoras de seguridad para producción

## Reservas

* [x] Listado de canchas
* [x] Disponibilidad
* [x] Creación de reservas
* [x] Validación de conflictos
* [x] Cancelación
* [x] Historial
* [x] Autenticación

## Tienda

* [x] Catálogo visual inicial
* [x] Carrito
* [ ] Productos desde PostgreSQL
* [ ] API de productos
* [ ] Detalle de producto
* [ ] Stock real
* [ ] Creación de pedidos
* [ ] Historial de pedidos

## Administración

* [ ] Panel administrativo
* [ ] Gestión de usuarios
* [ ] Gestión de roles
* [ ] Gestión de canchas
* [ ] Gestión de reservas
* [ ] Gestión de productos
* [ ] Gestión de stock
* [ ] Gestión de pedidos
* [ ] Dashboard

## Calidad

* [ ] Pruebas unitarias
* [ ] Pruebas de integración
* [ ] Pruebas de API
* [ ] Pruebas frontend
* [ ] Manejo global de errores
* [ ] Validaciones adicionales
* [ ] Rate limiting
* [ ] Auditoría de seguridad

## Producción

* [ ] Configuración de producción
* [ ] HTTPS
* [ ] Variables de entorno de producción
* [ ] Base de datos de producción
* [ ] Deploy del backend
* [ ] Deploy del frontend
* [ ] Dominio
* [ ] Monitoreo

---

# Flujo de desarrollo

El proyecto utiliza Git para controlar las versiones.

Rama principal de desarrollo:

```text
sebas
```

Flujo recomendado:

```text
Modificar
   ↓
Probar
   ↓
Corregir
   ↓
Verificar
   ↓
git add .
   ↓
git commit
   ↓
git push origin sebas
```

La rama `main` no debe modificarse directamente durante el desarrollo.

---

# Estado actual

Actualmente Golazo cuenta con una base funcional full-stack:

```text
React
  ↓
React Router
  ↓
AuthContext / CartContext
  ↓
Protected Routes
  ↓
FastAPI
  ↓
JWT + Argon2
  ↓
SQLAlchemy
  ↓
PostgreSQL
```

Los principales flujos funcionales actualmente implementados son:

```text
Registro
   ↓
Login
   ↓
Autenticación JWT
   ↓
Navbar autenticado
   ↓
Perfil
   ↓
Edición de perfil
```

y:

```text
Login
   ↓
Reservas
   ↓
Consulta de disponibilidad
   ↓
Selección de cancha
   ↓
Reserva
   ↓
Cancelación
   ↓
Historial
```

El siguiente gran bloque de desarrollo será completar la **tienda conectada al backend**, seguido por el **panel administrativo**, pruebas y preparación para producción.

---

# Autores

**Sebastián Pérez**
Ingeniería de Software

**Juan Jején**

---

## Golazo

> **Juega. Reserva. Vive el fútbol.**
