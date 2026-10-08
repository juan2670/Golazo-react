from decimal import Decimal
from typing import TYPE_CHECKING

from sqlalchemy import Boolean, Integer, Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

if TYPE_CHECKING:
    from app.models.detalle_pedido import DetallePedido


class Producto(Base):
    __tablename__ = "productos"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True,
    )

    nombre: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
    )

    descripcion: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    precio: Mapped[Decimal] = mapped_column(
        Numeric(10, 2),
        nullable=False,
    )

    stock: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
    )

    categoria: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )

    imagen: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )

    estado: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )

    detalles: Mapped[list["DetallePedido"]] = relationship(
        back_populates="producto"
    )