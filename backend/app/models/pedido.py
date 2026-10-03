from datetime import datetime
from decimal import Decimal
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, ForeignKey, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

if TYPE_CHECKING:
    from app.models.detalle_pedido import DetallePedido
    from app.models.usuario import Usuario


class Pedido(Base):
    __tablename__ = "pedidos"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True,
    )

    usuario_id: Mapped[int] = mapped_column(
        ForeignKey("usuarios.id"),
        nullable=False,
    )

    fecha: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    total: Mapped[Decimal] = mapped_column(
        Numeric(10, 2),
        nullable=False,
    )

    estado: Mapped[str] = mapped_column(
        String(30),
        default="pendiente",
        nullable=False,
    )

    usuario: Mapped["Usuario"] = relationship(
        back_populates="pedidos"
    )

    detalles: Mapped[list["DetallePedido"]] = relationship(
        back_populates="pedido",
        cascade="all, delete-orphan",
    )