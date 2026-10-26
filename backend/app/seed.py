"""Carga inicial: las canchas del club y el catálogo de la tienda.

Uso (desde la carpeta backend, con el .env configurado):

    python -m app.seed

Es idempotente. Las canchas se buscan por nombre: si faltan se crean y, si ya
existen, se les corrigen el tipo, las tarifas y la relación con el fútbol 8.
Si un producto ya existe (mismo nombre) no lo duplica ni lo modifica. Los
productos son los mismos que mostraba la tienda del frontend.
El stock inicial (STOCK_INICIAL) es un valor de ejemplo: ajústalo al
inventario real del club.
"""

from decimal import Decimal

from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.cancha import Cancha
from app.models.producto import Producto


STOCK_INICIAL = 50

PEXELS = "https://images.pexels.com/photos/{id}/pexels-photo-{id}.jpeg?auto=compress&cs=tinysrgb&w=900"

PRODUCTOS = [
    {"nombre": "Balón Golazo Pro", "categoria": "Fútbol", "precio": "85000", "foto": 3999307},
    {"nombre": "Camiseta Golazo", "categoria": "Ropa", "precio": "95000", "foto": 28555936},
    {"nombre": "Guayos Pro", "categoria": "Fútbol", "precio": "180000", "foto": 774321},
    {"nombre": "Bebida deportiva", "categoria": "Bebidas", "precio": "7000", "foto": 20847016},
    {"nombre": "Medias deportivas", "categoria": "Ropa", "precio": "25000", "foto": 35571216},
    {"nombre": "Agua", "categoria": "Bebidas", "precio": "4000", "foto": 5069203},
]


# Las canchas reales del club. Las canchas 2 y 3 son las mitades del fútbol 8:
# reservar una ocupa el fútbol 8, y reservar el fútbol 8 ocupa las dos.
# Tarifas por hora: de día (precio_hora) y desde las 18:00 (precio_noche).
CANCHA_GRANDE = "Cancha 2 + 3"

CANCHAS = [
    {"nombre": "Cancha 1", "tipo": "Fútbol 5", "dia": "80000", "noche": "100000", "capacidad": 10, "padre": None},
    {"nombre": CANCHA_GRANDE, "tipo": "Fútbol 8", "dia": "140000", "noche": "160000", "capacidad": 16, "padre": None},
    {"nombre": "Cancha 2", "tipo": "Fútbol 5", "dia": "80000", "noche": "100000", "capacidad": 10, "padre": CANCHA_GRANDE},
    {"nombre": "Cancha 3", "tipo": "Fútbol 5", "dia": "80000", "noche": "100000", "capacidad": 10, "padre": CANCHA_GRANDE},
]


def sembrar_canchas(db: Session) -> tuple[int, int]:
    """Crea las canchas que falten y deja las existentes (mismo nombre) con
    el tipo, las tarifas y la relación correctas. Devuelve (creadas, ajustadas)."""
    creadas = ajustadas = 0
    por_nombre = {c.nombre: c for c in db.query(Cancha).all()}

    # El orden de CANCHAS garantiza que el fútbol 8 exista antes que sus mitades
    for datos in CANCHAS:
        padre = por_nombre[datos["padre"]] if datos["padre"] else None
        valores = {
            "tipo": datos["tipo"],
            "precio_hora": Decimal(datos["dia"]),
            "precio_noche": Decimal(datos["noche"]),
            "capacidad": datos["capacidad"],
            "cancha_padre_id": padre.id if padre else None,
        }
        cancha = por_nombre.get(datos["nombre"])

        if cancha is None:
            cancha = Cancha(nombre=datos["nombre"], estado=True, **valores)
            db.add(cancha)
            creadas += 1
        elif any(getattr(cancha, campo) != valor for campo, valor in valores.items()):
            for campo, valor in valores.items():
                setattr(cancha, campo, valor)
            ajustadas += 1

        db.flush()
        por_nombre[datos["nombre"]] = cancha

    db.commit()

    return creadas, ajustadas


def sembrar_productos(db: Session) -> int:
    existentes = {nombre for (nombre,) in db.query(Producto.nombre).all()}
    nuevos = 0

    for datos in PRODUCTOS:
        if datos["nombre"] in existentes:
            continue

        db.add(
            Producto(
                nombre=datos["nombre"],
                categoria=datos["categoria"],
                precio=Decimal(datos["precio"]),
                stock=STOCK_INICIAL,
                imagen=PEXELS.format(id=datos["foto"]),
                estado=True,
            )
        )
        nuevos += 1

    db.commit()

    return nuevos


if __name__ == "__main__":
    with SessionLocal() as sesion:
        canchas_creadas, canchas_ajustadas = sembrar_canchas(sesion)
        creados = sembrar_productos(sesion)

        nombres = {datos["nombre"] for datos in CANCHAS}
        otras = [
            c.nombre
            for c in sesion.query(Cancha).filter(Cancha.estado.is_(True)).all()
            if c.nombre not in nombres
        ]

    print(f"Canchas creadas: {canchas_creadas}, ajustadas: {canchas_ajustadas}.")
    print(f"Productos creados: {creados} (los existentes no se tocaron).")

    if otras:
        print(
            "Aviso: hay otras canchas activas que no son las del club: "
            + ", ".join(otras)
            + ". Desactívalas (estado = false) si no deben mostrarse."
        )
