from collections import defaultdict
from decimal import Decimal

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, selectinload

from app.core.dependencies import get_current_user
from app.database import get_db
from app.models.detalle_pedido import DetallePedido
from app.models.pedido import Pedido
from app.models.producto import Producto
from app.models.usuario import Usuario
from app.schemas.pedido import PedidoCreate, PedidoResponse


router = APIRouter(
    prefix="/pedidos",
    tags=["Pedidos"],
)


def _con_detalles(consulta):
    return consulta.options(
        selectinload(Pedido.detalles).selectinload(DetallePedido.producto)
    )


@router.get(
    "/",
    response_model=list[PedidoResponse],
)
def listar_pedidos(
    db: Session = Depends(get_db),
    usuario_actual: Usuario = Depends(get_current_user),
):
    return (
        _con_detalles(db.query(Pedido))
        .filter(Pedido.usuario_id == usuario_actual.id)
        .order_by(Pedido.fecha.desc(), Pedido.id.desc())
        .all()
    )


@router.post(
    "/",
    response_model=PedidoResponse,
    status_code=status.HTTP_201_CREATED,
)
def crear_pedido(
    pedido: PedidoCreate,
    db: Session = Depends(get_db),
    usuario_actual: Usuario = Depends(get_current_user),
):
    # =====================================================
    # 1. Unir líneas repetidas del mismo producto
    # =====================================================

    cantidades: dict[int, int] = defaultdict(int)

    for item in pedido.items:
        cantidades[item.producto_id] += item.cantidad

    # =====================================================
    # 2. Buscar productos (bloqueados hasta el commit en PostgreSQL,
    #    para que dos compras a la vez no vendan el mismo stock)
    # =====================================================

    productos = (
        db.query(Producto)
        .filter(Producto.id.in_(cantidades.keys()))
        .with_for_update()
        .all()
    )

    por_id = {producto.id: producto for producto in productos}

    faltantes = [str(pid) for pid in cantidades if pid not in por_id]

    if faltantes:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Producto no encontrado: {', '.join(faltantes)}.",
        )

    # =====================================================
    # 3. Validar disponibilidad y stock
    # =====================================================

    for producto_id, cantidad in cantidades.items():
        producto = por_id[producto_id]

        if not producto.estado:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"{producto.nombre} no está disponible.",
            )

        if producto.stock < cantidad:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=(
                    f"No hay suficiente stock de {producto.nombre}. "
                    f"Disponible: {producto.stock}."
                ),
            )

    # =====================================================
    # 4. Crear pedido con precios de la base de datos
    #    (nunca los que envía el navegador)
    # =====================================================

    nuevo_pedido = Pedido(
        usuario_id=usuario_actual.id,
        estado="pendiente",
        total=Decimal("0"),
    )

    total = Decimal("0")

    for producto_id, cantidad in cantidades.items():
        producto = por_id[producto_id]
        subtotal = producto.precio * cantidad

        nuevo_pedido.detalles.append(
            DetallePedido(
                producto_id=producto_id,
                cantidad=cantidad,
                precio_unitario=producto.precio,
                subtotal=subtotal,
            )
        )

        producto.stock -= cantidad
        total += subtotal

    nuevo_pedido.total = total

    db.add(nuevo_pedido)
    db.commit()

    return (
        _con_detalles(db.query(Pedido))
        .filter(Pedido.id == nuevo_pedido.id)
        .one()
    )


@router.patch(
    "/{pedido_id}/cancelar",
    response_model=PedidoResponse,
)
def cancelar_pedido(
    pedido_id: int,
    db: Session = Depends(get_db),
    usuario_actual: Usuario = Depends(get_current_user),
):
    pedido = (
        _con_detalles(db.query(Pedido))
        .filter(
            Pedido.id == pedido_id,
            Pedido.usuario_id == usuario_actual.id,
        )
        .first()
    )

    if not pedido:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pedido no encontrado.",
        )

    if pedido.estado != "pendiente":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Solo se pueden cancelar pedidos pendientes.",
        )

    # El stock vuelve a la tienda.
    for detalle in pedido.detalles:
        detalle.producto.stock += detalle.cantidad

    pedido.estado = "cancelado"

    db.commit()
    db.refresh(pedido)

    return pedido
