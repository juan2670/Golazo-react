"""Carga inicial del catálogo de la tienda.

Uso (desde la carpeta backend, con el .env configurado):

    python -m app.seed

Es idempotente: si un producto ya existe (mismo nombre) no lo duplica ni lo
modifica. Los productos son los mismos que mostraba la tienda del frontend.
El stock inicial (STOCK_INICIAL) es un valor de ejemplo: ajústalo al
inventario real del club.
"""

from decimal import Decimal

from sqlalchemy.orm import Session

from app.database import SessionLocal
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
        creados = sembrar_productos(sesion)

    print(f"Productos creados: {creados} (los existentes no se tocaron).")
