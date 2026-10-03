# ⚽ Golazo React

Sistema web para la gestión integral de un complejo deportivo enfocado principalmente en la reserva de canchas de fútbol y la venta de productos deportivos.

El proyecto está desarrollado como una aplicación **full-stack** utilizando **React + Vite** para el frontend y **FastAPI + PostgreSQL** para el backend.

Actualmente se encuentra en desarrollo y cuenta con una base funcional de autenticación, gestión de canchas y reservas, además de una interfaz web orientada a una futura plataforma completa de servicios deportivos.

---

## 📌 Descripción del proyecto

**Golazo** busca centralizar diferentes servicios de un complejo deportivo en una sola plataforma.

El sistema está diseñado para permitir que los usuarios puedan:

* Consultar las canchas disponibles.
* Consultar horarios disponibles.
* Realizar reservas.
* Consultar y cancelar sus reservas.
* Registrarse e iniciar sesión.
* Consultar productos deportivos.
* Agregar productos a un carrito de compras.
* Consultar información del complejo deportivo.
* Consultar la ubicación.
* Contactar con el establecimiento.

A futuro, el sistema contará también con funcionalidades administrativas, gestión completa de productos, pedidos, pagos y una integración completa entre frontend y backend.

---

# 🏗️ Arquitectura

El proyecto utiliza una arquitectura separada entre frontend y backend:

```text
Golazo-react/
│
├── frontend/          # Aplicación web React
│
├── backend/           # API REST con FastAPI
│
├── README.md
└── package-lock.json
```

### Frontend

Construido con:

* React
* Vite
* React Router
* JavaScript
* CSS
* Context API

### Backend

Construido con:

* Python
* FastAPI
* SQLAlchemy
* PostgreSQL
* Pydantic
* JWT
* Argon2
* Alembic

---

# 🖥️ Tecnologías utilizadas

## Frontend

| Tecnología   | Uso                           |
| ------------ | ----------------------------- |
| React        | Construcción de la interfaz   |
| Vite         | Entorno de desarrollo y build |
| React Router | Navegación entre páginas      |
| JavaScript   | Lógica de la aplicación       |
| CSS          | Diseño y estilos              |
| Context API  | Gestión global del carrito    |

## Backend

| Tecnología | Uso                             |
| ---------- | ------------------------------- |
| Python     | Lenguaje principal              |
| FastAPI    | Desarrollo de la API REST       |
| SQLAlchemy | ORM y acceso a la base de datos |
| PostgreSQL | Base de datos relacional        |
| Pydantic   | Validación de datos             |
| PyJWT      | Autenticación mediante tokens   |
| Argon2     | Hash seguro de contraseñas      |
| Alembic    | Migraciones de base de datos    |
| Uvicorn    | Servidor ASGI                   |

---

# 📂 Estructura del proyecto

## Frontend

```text
frontend/
└── src/
    ├── components/
    │   ├── Navbar/
    │   ├── Footer/
    │   ├── Button/
    │   ├── Card/
    │   └── Modal/
    │
    ├── context/
    │   └── CartContext.jsx
    │
    ├── layouts/
    │   ├── MainLayout.jsx
    │   └── AdminLayout.jsx
    │
    ├── pages/
    │   ├── Home/
    │   ├── Reservas/
    │   ├── Tienda/
    │   ├── Carrito/
    │   ├── Producto/
    │   ├── Nosotros/
    │   ├── Ubicacion/
    │   ├── Contacto/
    │   ├── Login/
    │   ├── Registro/
    │   ├── Perfil/
    │   └── Admin/
    │
    ├── routes/
    │   └── AppRoutes.jsx
    │
    ├── services/
    │   └── api.js
    │
    └── styles/
        └── globals.css
```

## Backend

```text
backend/
├── app/
│   ├── core/
│   │   ├── security.py
│   │   └── dependencies.py
│   │
│   ├── models/
│   │   ├── usuario.py
│   │   ├── cancha.py
│   │   ├── reserva.py
│   │   ├── producto.py
│   │   ├── pedido.py
│   │   └── detalle_pedido.py
│   │
│   ├── routers/
│   │   ├── canchas.py
│   │   ├── reservas.py
│   │   └── usuarios.py
│   │
│   ├── schemas/
│   │   ├── cancha.py
│   │   ├── reserva.py
│   │   └── usuario.py
│   │
│   ├── services/
│   │
│   ├── database.py
│   └── main.py
│
├── migrations/
│   ├── env.py
│   ├── script.py.mako
│   └── versions/
│
├── tests/
├── .env
├── .gitignore
├── alembic.ini
├── requirements.txt
└── test_db.py
```

---

# ⚙️ Funcionalidades actuales

## 🔐 Autenticación

El backend cuenta con un sistema inicial de autenticación.

### Registro

Permite crear usuarios mediante:

```text
POST /usuarios/registro
```

Los datos principales son:

* Nombre
* Apellido
* Correo electrónico
* Contraseña
* Teléfono

Las contraseñas no se almacenan directamente. Se almacenan utilizando un hash seguro mediante **Argon2**.

### Login

```text
POST /usuarios/login
```

El usuario proporciona sus credenciales y el backend genera un **JWT** para autenticar las solicitudes posteriores.

---

# ⚽ Gestión de canchas

El backend permite consultar y crear canchas.

### Obtener canchas

```text
GET /canchas/
```

### Crear cancha

```text
POST /canchas/
```

Cada cancha contiene información como:

```text
id
nombre
tipo
precio_hora
capacidad
estado
```

Ejemplo:

```json
{
  "nombre": "Cancha 1",
  "tipo": "Fútbol 5",
  "precio_hora": 50000,
  "capacidad": 10,
  "estado": true
}
```

---

# 📅 Sistema de reservas

El sistema cuenta con una lógica inicial para gestionar reservas.

Actualmente permite:

* Crear reservas.
* Consultar las reservas del usuario autenticado.
* Cancelar reservas.
* Consultar disponibilidad.
* Evitar reservas duplicadas.
* Validar duración mínima.
* Calcular automáticamente el precio.
* Verificar que la cancha exista.
* Verificar que la cancha esté activa.

### Crear reserva

```text
POST /reservas/
```

La reserva utiliza:

```json
{
  "cancha_id": 1,
  "fecha": "2026-10-15",
  "hora_inicio": "18:00",
  "hora_fin": "20:00"
}
```

El precio total es calculado por el backend utilizando el precio de la cancha y la duración de la reserva.

### Consultar reservas

```text
GET /reservas/
```

Esta ruta requiere autenticación y devuelve únicamente las reservas del usuario autenticado.

### Consultar disponibilidad

```text
GET /reservas/disponibilidad
```

Ejemplo:

```text
/reservas/disponibilidad?cancha_id=1&fecha=2026-10-15
```

La API devuelve los horarios disponibles y ocupados para la cancha seleccionada.

### Cancelar reserva

```text
PATCH /reservas/{reserva_id}/cancelar
```

El usuario solamente puede cancelar sus propias reservas.

---

# 🛒 Tienda

El frontend cuenta actualmente con una tienda de productos deportivos.

Incluye:

* Productos.
* Categorías.
* Precios.
* Carrito de compras.
* Cantidades.
* Subtotales.
* Total de compra.
* Eliminación de productos.
* Actualización de cantidades.

El carrito se administra mediante **React Context API**.

Actualmente algunos productos todavía utilizan información estática en el frontend.

La integración completa con el backend está prevista para una siguiente etapa.

---

# 🧭 Páginas principales

Actualmente el frontend contempla las siguientes rutas:

```text
/
├── /reservas
├── /tienda
├── /carrito
├── /nosotros
├── /ubicacion
├── /login
└── /registro
```

También existe una estructura preparada para:

```text
/perfil
/admin
/producto
/contacto
```

---

# 🎨 Diseño

La interfaz utiliza una identidad visual inspirada en el fútbol y los complejos deportivos.

Características principales:

* Tema oscuro.
* Negro como color principal.
* Blanco para contenido.
* Verde neón como color de énfasis.
* Diseño responsive.
* Componentes reutilizables.
* Fotografías deportivas.
* Tarjetas y botones personalizados.
* Navegación mediante React Router.

Color principal de énfasis:

```text
#8cff00
```

---

# 🗄️ Base de datos

El proyecto utiliza **PostgreSQL**.

Base de datos de desarrollo:

```text
golazo_db
```

Actualmente existen las siguientes entidades principales:

```text
usuarios
canchas
reservas
productos
pedidos
detalles_pedido
```

Relaciones principales:

```text
Usuario
   │
   ├── Reservas
   │       │
   │       └── Cancha
   │
   └── Pedidos
           │
           └── DetallesPedido
                    │
                    └── Producto
```

---

# 🔄 Migraciones

Las modificaciones estructurales de la base de datos se gestionan mediante **Alembic**.

Para crear una migración:

```bash
alembic revision --autogenerate -m "descripcion del cambio"
```

Para aplicar las migraciones:

```bash
alembic upgrade head
```

Antes de aplicar una migración generada automáticamente, se debe revisar el archivo para verificar que los cambios sean correctos.

---

# 🔒 Seguridad

La seguridad es uno de los objetivos principales del proyecto.

Actualmente se implementan:

* Hash de contraseñas mediante Argon2.
* Autenticación mediante JWT.
* Variables de entorno para información sensible.
* Separación entre modelos y schemas.
* Validación de datos mediante Pydantic.
* Control de acceso para las reservas.
* Protección para que un usuario no pueda cancelar reservas de otro usuario.
* `.env` excluido del repositorio mediante `.gitignore`.

Nunca se deben subir credenciales, contraseñas, tokens o claves secretas al repositorio.

---

# 🚀 Instalación

## Requisitos

Antes de ejecutar el proyecto se necesita instalar:

* Git
* Node.js
* npm
* Python 3.11+
* PostgreSQL

---

# 📥 Clonar el repositorio

```bash
git clone https://github.com/juan2670/Golazo-react.git
```

Entrar al proyecto:

```bash
cd Golazo-react
```

Cambiar a la rama de desarrollo:

```bash
git checkout sebas
```

---

# 🖥️ Ejecutar el frontend

Entrar en la carpeta:

```bash
cd frontend
```

Instalar dependencias:

```bash
npm install
```

Ejecutar el servidor:

```bash
npm run dev
```

La aplicación estará disponible normalmente en:

```text
http://localhost:5173
```

---

# 🐍 Ejecutar el backend

Abrir otra terminal.

Entrar al backend:

```bash
cd backend
```

Activar el entorno virtual en Windows:

```powershell
.\venv\Scripts\Activate.ps1
```

Instalar dependencias:

```bash
pip install -r requirements.txt
```

Crear/configurar el archivo:

```text
backend/.env
```

Ejemplo:

```env
DATABASE_URL=postgresql+psycopg://postgres:TU_PASSWORD@localhost:5432/golazo_db

JWT_SECRET_KEY=TU_SECRET_KEY
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=60
```

Ejecutar FastAPI:

```bash
python -m uvicorn app.main:app --reload
```

API:

```text
http://127.0.0.1:8000
```

Documentación interactiva:

```text
http://127.0.0.1:8000/docs
```

Documentación alternativa:

```text
http://127.0.0.1:8000/redoc
```

---

# 🧪 Pruebas rápidas

Comprobar conexión con PostgreSQL:

```bash
python test_db.py
```

Comprobar los mappers de SQLAlchemy:

```bash
python -c "from sqlalchemy.orm import configure_mappers; from app.models import *; configure_mappers(); print('Mappers configurados correctamente')"
```

---

# 🔀 Flujo de desarrollo

El desarrollo se realiza mediante ramas de Git.

Rama principal:

```text
main
```

Rama de desarrollo actual:

```text
sebas
```

Los cambios deben desarrollarse y probarse en la rama correspondiente antes de integrarse a `main`.

Para comprobar el estado:

```bash
git status
```

Agregar cambios:

```bash
git add .
```

Crear commit:

```bash
git commit -m "descripcion del cambio"
```

Subir cambios:

```bash
git push origin sebas
```

---

# 🧩 Estado actual del proyecto

## Frontend

* [x] Estructura React + Vite
* [x] Navegación con React Router
* [x] Home
* [x] Página de reservas
* [x] Tienda
* [x] Carrito
* [x] Nosotros
* [x] Ubicación
* [x] Login
* [x] Registro
* [x] Diseño responsive inicial
* [ ] Conectar reservas con API
* [ ] Conectar tienda con API
* [ ] Conectar autenticación con frontend
* [ ] Perfil de usuario
* [ ] Panel administrativo

## Backend

* [x] FastAPI
* [x] PostgreSQL
* [x] SQLAlchemy
* [x] Alembic
* [x] Modelos principales
* [x] Schemas
* [x] API de canchas
* [x] Registro de usuarios
* [x] Login
* [x] Hash de contraseñas
* [x] JWT
* [x] Reservas
* [x] Consulta de disponibilidad
* [x] Cancelación de reservas
* [ ] API de productos
* [ ] API de pedidos
* [ ] Roles y permisos administrativos avanzados
* [ ] Pruebas automatizadas
* [ ] Mejoras de validación de horarios
* [ ] Integración completa con frontend

---

# 🛣️ Roadmap

## Fase 1 — Base del proyecto

* [x] Crear frontend React
* [x] Crear backend FastAPI
* [x] Configurar PostgreSQL
* [x] Configurar SQLAlchemy
* [x] Configurar Alembic
* [x] Crear modelos principales

## Fase 2 — Usuarios y reservas

* [x] Registro
* [x] Login
* [x] Hash de contraseñas
* [x] JWT
* [x] Crear reservas
* [x] Consultar reservas
* [x] Cancelar reservas
* [x] Consultar disponibilidad

## Fase 3 — Integración

* [ ] Conectar React con FastAPI
* [ ] Autenticación desde React
* [ ] Protección de rutas
* [ ] Reservas utilizando datos reales
* [ ] Disponibilidad en tiempo real
* [ ] Manejo de errores
* [ ] Estados de carga

## Fase 4 — Tienda

* [ ] API de productos
* [ ] CRUD de productos
* [ ] Stock
* [ ] Categorías
* [ ] Pedidos
* [ ] Detalles de pedidos
* [ ] Integración carrito/backend

## Fase 5 — Administración

* [ ] Panel administrativo
* [ ] Gestión de usuarios
* [ ] Gestión de canchas
* [ ] Gestión de reservas
* [ ] Gestión de productos
* [ ] Gestión de pedidos
* [ ] Estadísticas

## Fase 6 — Producción

* [ ] Tests
* [ ] Validaciones finales
* [ ] Seguridad
* [ ] Variables de entorno de producción
* [ ] Configuración CORS
* [ ] HTTPS
* [ ] Deploy del frontend
* [ ] Deploy del backend
* [ ] Deploy de PostgreSQL
* [ ] Monitoreo y logs

---

# 👨‍💻 Autores

**Sebastián Pérez**

Estudiante de Ingeniería de Software.

**Juan José Jején**

Estudiante de Ingeniería de Software.

---

# 📄 Licencia

Este proyecto se encuentra actualmente en desarrollo académico.

El uso, modificación y distribución del código queda sujeto a las condiciones definidas por los autores del proyecto.
