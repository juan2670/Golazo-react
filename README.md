# ⚽ GOLAZO

> Plataforma web para la gestión de canchas deportivas, reservas, tienda y servicios de un complejo deportivo.

**Golazo** es una aplicación web full-stack desarrollada para digitalizar la gestión de un complejo deportivo, permitiendo a los usuarios consultar canchas, verificar disponibilidad, realizar reservas, gestionar sus reservas y posteriormente acceder a una tienda, perfil y otros servicios.

El proyecto está construido con una arquitectura separada entre **Frontend y Backend**, utilizando **React, FastAPI y PostgreSQL**.

---

## 🚀 Estado del proyecto

| Módulo                    | Estado           |
| ------------------------- | ---------------- |
| Landing / Home            | ✅ Implementado   |
| Navegación                | ✅ Implementado   |
| Diseño responsive         | ✅ Implementado   |
| Tienda                    | 🟡 En desarrollo |
| Carrito                   | ✅ Implementado   |
| Autenticación             | ✅ Implementado   |
| Registro                  | 🟡 En desarrollo |
| Reservas                  | ✅ Implementado   |
| Disponibilidad de canchas | ✅ Implementado   |
| Cancelación de reservas   | ✅ Implementado   |
| Historial de reservas     | ✅ Implementado   |
| Perfil de usuario         | 🟡 Pendiente     |
| Administración            | 🟡 Pendiente     |
| PostgreSQL                | ✅ Implementado   |
| Migraciones Alembic       | ✅ Implementado   |
| Tests automatizados       | 🟡 Pendiente     |
| Deployment                | 🟡 Pendiente     |

---

# 🎯 Objetivo

El objetivo de Golazo es crear una plataforma que centralice las operaciones principales de un complejo deportivo.

El usuario podrá:

* Consultar las canchas disponibles.
* Revisar horarios disponibles.
* Reservar una cancha.
* Elegir la duración del partido.
* Consultar el precio de la reserva.
* Visualizar sus próximas reservas.
* Cancelar reservas.
* Consultar el historial de reservas.
* Comprar productos deportivos.
* Gestionar su carrito.
* Administrar su perfil.
* Recibir una experiencia web moderna y responsive.

A futuro, el sistema contará también con funcionalidades administrativas para gestionar usuarios, canchas, reservas, productos y pedidos.

---

# 🧠 Arquitectura

El proyecto utiliza una arquitectura separada por responsabilidades:

```text
                    ┌─────────────────────┐
                    │       USUARIO       │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │      REACT + VITE   │
                    │      FRONTEND       │
                    └──────────┬──────────┘
                               │
                         HTTP / REST API
                               │
                               ▼
                    ┌─────────────────────┐
                    │   FASTAPI + PYTHON  │
                    │      BACKEND        │
                    └──────────┬──────────┘
                               │
                        SQLAlchemy ORM
                               │
                               ▼
                    ┌─────────────────────┐
                    │     POSTGRESQL      │
                    │      DATABASE       │
                    └─────────────────────┘
```

### Tecnologías principales

**Frontend**

* React
* Vite
* JavaScript
* React Router
* CSS
* Fetch API
* Context API

**Backend**

* Python
* FastAPI
* SQLAlchemy
* Pydantic
* JWT
* Argon2
* Alembic

**Base de datos**

* PostgreSQL

**Herramientas**

* Git
* GitHub
* VS Code
* Swagger / OpenAPI
* Azure DevOps

---

# 📁 Estructura del proyecto

```text
Golazo-react/
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
│   │   │   └── AppRoutes.jsx
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   └── styles/
│   │       └── globals.css
│   │
│   └── package.json
│
├── backend/
│   ├── app/
│   │   ├── core/
│   │   │   ├── security.py
│   │   │   └── dependencies.py
│   │   │
│   │   ├── models/
│   │   │   ├── usuario.py
│   │   │   ├── cancha.py
│   │   │   ├── reserva.py
│   │   │   ├── producto.py
│   │   │   ├── pedido.py
│   │   │   └── detalle_pedido.py
│   │   │
│   │   ├── routers/
│   │   │   ├── usuarios.py
│   │   │   ├── canchas.py
│   │   │   └── reservas.py
│   │   │
│   │   ├── schemas/
│   │   │   ├── usuario.py
│   │   │   ├── cancha.py
│   │   │   └── reserva.py
│   │   │
│   │   ├── services/
│   │   ├── database.py
│   │   └── main.py
│   │
│   ├── migrations/
│   │   └── versions/
│   │
│   ├── tests/
│   ├── .env
│   ├── .gitignore
│   ├── alembic.ini
│   └── requirements.txt
│
├── .gitignore
└── README.md
```

---

# 🔐 Autenticación y seguridad

La aplicación cuenta con un sistema inicial de autenticación basado en **JWT**.

### Registro

Los usuarios se registran proporcionando:

* Nombre
* Apellido
* Correo electrónico
* Contraseña
* Teléfono

Las contraseñas **no se almacenan directamente en la base de datos**.

Se almacenan utilizando hashes seguros mediante **Argon2**.

### Login

El usuario inicia sesión mediante:

```text
POST /usuarios/login
```

El backend valida las credenciales y genera un token JWT.

El frontend utiliza posteriormente el token para realizar solicitudes protegidas.

### Protección de endpoints

Los endpoints que requieren autenticación utilizan el esquema:

```text
Authorization: Bearer <token>
```

Actualmente la autenticación protege principalmente las operaciones relacionadas con las reservas.

### Variables sensibles

Las credenciales de PostgreSQL y las claves JWT se mantienen mediante variables de entorno.

El archivo:

```text
.env
```

no se versiona en Git.

---

# ⚽ Sistema de reservas

El módulo de reservas es uno de los componentes principales de Golazo.

El flujo actual es:

```text
Seleccionar cancha
       ↓
Seleccionar fecha
       ↓
Consultar disponibilidad
       ↓
Seleccionar horario
       ↓
Seleccionar duración
       ↓
Calcular precio
       ↓
Crear reserva
       ↓
Guardar en PostgreSQL
       ↓
Actualizar disponibilidad
```

### Funcionalidades

* Consulta de canchas desde PostgreSQL.
* Consulta de disponibilidad en tiempo real.
* Reservas de 1 o 2 horas.
* Horarios desde las 08:00 hasta las 00:00.
* Validación de horarios ocupados.
* Validación de solapamiento de reservas.
* Cálculo automático del valor.
* Asociación de cada reserva con el usuario autenticado.
* Cancelación de reservas.
* Historial de reservas canceladas.

### Estados

Actualmente las reservas pueden manejar estados como:

```text
pendiente
cancelada
```

La arquitectura permite extender posteriormente el sistema con estados como:

```text
confirmada
completada
```

---

# 🗄️ Modelo de datos

La base de datos utiliza PostgreSQL.

Actualmente existen las siguientes entidades principales:

```text
usuarios
    │
    ├───────────────┐
    │               │
    ▼               ▼
reservas          pedidos
    │               │
    ▼               ▼
canchas       detalles_pedido
                    │
                    ▼
                productos
```

### Tablas principales

#### usuarios

Almacena la información de los usuarios y sus credenciales.

#### canchas

Contiene:

* Nombre
* Tipo
* Precio por hora
* Capacidad
* Estado

#### reservas

Contiene:

* Usuario
* Cancha
* Fecha
* Hora inicial
* Hora final
* Estado
* Total

#### productos

Contiene:

* Nombre
* Descripción
* Precio
* Stock
* Categoría
* Imagen
* Estado

#### pedidos

Representa las compras realizadas por los usuarios.

#### detalles_pedido

Relaciona cada pedido con sus productos.

---

# 🔄 Migraciones

El proyecto utiliza **Alembic** para controlar los cambios estructurales de la base de datos.

Crear una nueva migración:

```bash
alembic revision --autogenerate -m "descripcion del cambio"
```

Aplicar migraciones:

```bash
alembic upgrade head
```

Consultar la versión actual:

```bash
alembic current
```

---

# 📡 API

El backend está construido con FastAPI y expone una API REST.

### Usuarios

```text
POST /usuarios/registro
POST /usuarios/login
```

### Canchas

```text
GET  /canchas/
POST /canchas/
```

### Reservas

```text
GET   /reservas/
POST  /reservas/
PATCH /reservas/{id}/cancelar
GET   /reservas/disponibilidad
```

La documentación interactiva está disponible mediante Swagger:

```text
http://127.0.0.1:8000/docs
```

---

# 🛒 Tienda

La plataforma incluye una tienda deportiva integrada con el sistema.

Actualmente cuenta con:

* Catálogo de productos.
* Categorías.
* Detalle de producto.
* Carrito.
* Incremento y disminución de cantidades.
* Eliminación de productos.
* Cálculo del total.

El siguiente paso será conectar el catálogo directamente con PostgreSQL y posteriormente implementar el flujo de pedidos.

---

# 🎨 Diseño

Golazo utiliza una identidad visual inspirada en el deporte y el fútbol moderno.

### Características

* Fondo oscuro.
* Blanco como color principal.
* Verde neón como color de identidad.
* Diseño minimalista.
* Tipografía de alto impacto.
* Componentes reutilizables.
* Diseño responsive.
* Interfaz orientada a dispositivos móviles y escritorio.

Paleta principal:

```text
Negro       #050505
Blanco      #FFFFFF
Verde       #8CFF00
```

---

# 🧪 Pruebas

El proyecto busca validar cada módulo antes de integrarlo al siguiente.

Actualmente se han realizado pruebas manuales sobre:

* Conexión PostgreSQL.
* Modelos SQLAlchemy.
* Mapeo de relaciones.
* Creación de usuarios.
* Login.
* Generación de JWT.
* Protección de endpoints.
* Consulta de canchas.
* Disponibilidad.
* Creación de reservas.
* Validación de horarios.
* Cancelación de reservas.
* Actualización de disponibilidad.

La siguiente etapa será incorporar pruebas automatizadas para backend y frontend.

---

# 🛠️ Instalación

## 1. Clonar el proyecto

```bash
git clone https://github.com/juan2670/Golazo-react.git
cd Golazo-react
```

## 2. Backend

```bash
cd backend
```

Crear entorno virtual:

```bash
python -m venv venv
```

Activar:

### Windows PowerShell

```powershell
.\venv\Scripts\Activate.ps1
```

Instalar dependencias:

```bash
pip install -r requirements.txt
```

Configurar `.env`:

```env
DATABASE_URL=postgresql+psycopg://usuario:password@localhost:5432/golazo_db

JWT_SECRET_KEY=tu_clave_secreta
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=60
```

Aplicar migraciones:

```bash
alembic upgrade head
```

Iniciar servidor:

```bash
python -m uvicorn app.main:app --reload
```

Backend:

```text
http://127.0.0.1:8000
```

Swagger:

```text
http://127.0.0.1:8000/docs
```

---

## 3. Frontend

Abrir otra terminal:

```bash
cd frontend
```

Instalar dependencias:

```bash
npm install
```

Iniciar:

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

# 🌿 Flujo de Git

El desarrollo se realiza mediante ramas para evitar trabajar directamente sobre `main`.

Rama principal de desarrollo:

```text
sebas
```

Flujo recomendado:

```bash
git checkout sebas

git pull origin sebas

git add .

git commit -m "tipo: descripcion"

git push origin sebas
```

Ejemplos:

```bash
git commit -m "feat: implementar autenticacion"

git commit -m "feat: completar modulo de reservas"

git commit -m "fix: corregir disponibilidad de canchas"

git commit -m "style: mejorar diseño de reservas"
```

---

# 🗺️ Roadmap

## Fase 1 — Fundación

* [x] Configuración React + Vite
* [x] Arquitectura frontend
* [x] Arquitectura backend
* [x] PostgreSQL
* [x] SQLAlchemy
* [x] Alembic
* [x] API REST
* [x] CORS

## Fase 2 — Autenticación

* [x] Modelo de usuario
* [x] Hash de contraseñas
* [x] Login
* [x] JWT
* [x] Protección de endpoints
* [ ] Registro frontend
* [ ] Perfil de usuario
* [ ] Recuperación de contraseña

## Fase 3 — Reservas

* [x] Canchas
* [x] Disponibilidad
* [x] Creación de reservas
* [x] Validación de conflictos
* [x] Cálculo de precios
* [x] Cancelación
* [x] Historial
* [ ] Estados avanzados
* [ ] Confirmación de pago

## Fase 4 — Tienda

* [x] Catálogo inicial
* [x] Producto
* [x] Carrito
* [ ] API de productos
* [ ] Stock real
* [ ] Pedidos
* [ ] Historial de pedidos
* [ ] Pagos

## Fase 5 — Administración

* [ ] Dashboard
* [ ] Gestión de usuarios
* [ ] Gestión de canchas
* [ ] Gestión de reservas
* [ ] Gestión de productos
* [ ] Gestión de pedidos
* [ ] Estadísticas

## Fase 6 — Calidad y producción

* [ ] Tests automatizados
* [ ] Validación de seguridad
* [ ] Manejo avanzado de errores
* [ ] Rate limiting
* [ ] Logging
* [ ] Optimización
* [ ] CI/CD
* [ ] Deployment
* [ ] HTTPS
* [ ] Variables de entorno de producción

---

# 📌 Estado actual

Golazo se encuentra en una etapa de desarrollo activo.

La arquitectura principal ya está establecida y el sistema cuenta con una primera integración funcional entre:

```text
React
   ↓
FastAPI
   ↓
SQLAlchemy
   ↓
PostgreSQL
```

Los módulos de **autenticación y reservas** ya cuentan con integración real entre frontend y backend.

El proyecto continuará evolucionando hacia una plataforma completa para la gestión de un complejo deportivo.

---

# 👨‍💻 Autores

**Sebastián Pérez**
Ingeniería de Software

**Juan Jején**

Ingeniería de Software

Proyecto académico y de desarrollo de software.

---

## ⚽ GOLAZO

**Reserva. Juega. Disfruta.**
