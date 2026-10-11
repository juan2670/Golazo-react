from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_admin
from app.database import get_db
from app.models.producto import Producto
from app.models.usuario import Usuario
from app.schemas.producto import (
    ProductoCreate,
    ProductoResponse,
    ProductoUpdate,
)


router = APIRouter(
    prefix="/productos",
    tags=["Productos"],
)


@router.get(
    "/",
    response_model=list[ProductoResponse],
)
def listar_productos(
    categoria: str | None = None,
    db: Session = Depends(get_db),
):
    # Solo productos activos; la tienda filtra por categoría opcionalmente.
    consulta = db.query(Producto).filter(Producto.estado.is_(True))

    if categoria:
        consulta = consulta.filter(Producto.categoria == categoria)

    return consulta.order_by(Producto.id).all()


@router.get(
    "/{producto_id}",
    response_model=ProductoResponse,
)
def obtener_producto(
    producto_id: int,
    db: Session = Depends(get_db),
):
    producto = (
        db.query(Producto)
        .filter(
            Producto.id == producto_id,
            Producto.estado.is_(True),
        )
        .first()
    )

    if not producto:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Producto no encontrado.",
        )

    return producto


@router.post(
    "/",
    response_model=ProductoResponse,
    status_code=status.HTTP_201_CREATED,
)
def crear_producto(
    producto: ProductoCreate,
    db: Session = Depends(get_db),
    _admin: Usuario = Depends(get_current_admin),
):
    nuevo_producto = Producto(**producto.model_dump())

    db.add(nuevo_producto)
    db.commit()
    db.refresh(nuevo_producto)

    return nuevo_producto


@router.patch(
    "/{producto_id}",
    response_model=ProductoResponse,
)
def actualizar_producto(
    producto_id: int,
    datos: ProductoUpdate,
    db: Session = Depends(get_db),
    _admin: Usuario = Depends(get_current_admin),
):
    producto = (
        db.query(Producto)
        .filter(Producto.id == producto_id)
        .first()
    )

    if not producto:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Producto no encontrado.",
        )

    for campo, valor in datos.model_dump(exclude_unset=True).items():
        setattr(producto, campo, valor)

    db.commit()
    db.refresh(producto)

    return producto
