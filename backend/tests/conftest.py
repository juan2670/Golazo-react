"""Configuración de las pruebas.

Por defecto usan SQLite en memoria. Para correrlas contra PostgreSQL (así se
prueba también el bloqueo de stock de los pedidos) define TEST_DATABASE_URL
con una base DEDICADA a pruebas, cuyo nombre contenga "test":

    $env:TEST_DATABASE_URL = "postgresql+psycopg://usuario:clave@localhost:5432/golazo_test"
    python -m pytest

Cada prueba crea y BORRA todas las tablas, por eso se rechaza cualquier base
cuyo nombre no contenga "test".

Las variables de entorno se fijan ANTES de importar la app, porque
app.database y app.core.security las leen al importarse.
"""

import os
from datetime import date, timedelta
from decimal import Decimal

URL_PRUEBAS = os.environ.get("TEST_DATABASE_URL", "sqlite://")

if not URL_PRUEBAS.startswith("sqlite") and "test" not in URL_PRUEBAS.rsplit("/", 1)[-1].lower():
    raise RuntimeError(
        "TEST_DATABASE_URL debe apuntar a una base dedicada a pruebas "
        "(el nombre debe contener 'test'): las pruebas borran sus tablas."
    )

os.environ["DATABASE_URL"] = URL_PRUEBAS
os.environ["JWT_SECRET_KEY"] = "clave-solo-para-pruebas-" + "x" * 32

import pytest  # noqa: E402
from fastapi.testclient import TestClient  # noqa: E402
from sqlalchemy import create_engine  # noqa: E402
from sqlalchemy.orm import sessionmaker  # noqa: E402
from sqlalchemy.pool import StaticPool  # noqa: E402

import app.models  # noqa: E402,F401  (registra todos los modelos)
from app.database import Base, get_db  # noqa: E402
from app.main import app  # noqa: E402
from app.models.cancha import Cancha  # noqa: E402
from app.models.producto import Producto  # noqa: E402
from app.models.usuario import Usuario  # noqa: E402


if URL_PRUEBAS.startswith("sqlite"):
    motor = create_engine(
        URL_PRUEBAS,
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
else:
    motor = create_engine(URL_PRUEBAS, pool_pre_ping=True)
SesionPruebas = sessionmaker(autocommit=False, autoflush=False, bind=motor)


@pytest.fixture()
def db():
    Base.metadata.create_all(bind=motor)
    sesion = SesionPruebas()

    try:
        yield sesion
    finally:
        sesion.close()
        Base.metadata.drop_all(bind=motor)


@pytest.fixture()
def cliente(db):
    def get_db_pruebas():
        yield db

    app.dependency_overrides[get_db] = get_db_pruebas

    with TestClient(app) as c:
        yield c

    app.dependency_overrides.clear()


def registrar_y_entrar(cliente, email="jugador@ejemplo.com", password="clave-segura-123"):
    cliente.post(
        "/usuarios/registro",
        json={
            "nombre": "Jugador",
            "apellido": "Prueba",
            "email": email,
            "password": password,
        },
    )
    respuesta = cliente.post("/usuarios/login", json={"email": email, "password": password})

    return {"Authorization": f"Bearer {respuesta.json()['access_token']}"}


@pytest.fixture()
def auth(cliente):
    return registrar_y_entrar(cliente)


@pytest.fixture()
def auth_admin(cliente, db):
    cabeceras = registrar_y_entrar(cliente, email="admin@ejemplo.com")
    admin = db.query(Usuario).filter(Usuario.email == "admin@ejemplo.com").one()
    admin.rol = "admin"
    db.commit()

    return cabeceras


@pytest.fixture()
def cancha(db):
    nueva = Cancha(nombre="Cancha 1", tipo="Fútbol 5", precio_hora=Decimal("100000"), capacidad=10, estado=True)
    db.add(nueva)
    db.commit()
    db.refresh(nueva)

    return nueva


@pytest.fixture()
def productos(db):
    lista = [
        Producto(nombre="Balón Golazo Pro", categoria="Fútbol", precio=Decimal("85000"), stock=5, estado=True),
        Producto(nombre="Agua", categoria="Bebidas", precio=Decimal("4000"), stock=10, estado=True),
        Producto(nombre="Producto retirado", categoria="Ropa", precio=Decimal("1000"), stock=10, estado=False),
    ]
    db.add_all(lista)
    db.commit()

    for producto in lista:
        db.refresh(producto)

    return lista


@pytest.fixture()
def manana():
    return (date.today() + timedelta(days=1)).isoformat()
