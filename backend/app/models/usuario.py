from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

if TYPE_CHECKING:
    from app.models.pedido import Pedido
    from app.models.reserva import Reserva


class Usuario(Base):
    __tablename__ = "usuarios"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True,
    )

    nombre: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    apellido: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    email: Mapped[str] = mapped_column(
        String(150),
        unique=True,
        index=True,
        nullable=False,
    )

    password_hash: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    telefono: Mapped[str | None] = mapped_column(
        String(20),
        nullable=True,
    )

    rol: Mapped[str] = mapped_column(
        String(20),
        default="cliente",
        nullable=False,
    )

    fecha_registro: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    reservas: Mapped[list["Reserva"]] = relationship(
        back_populates="usuario"
    )

    pedidos: Mapped[list["Pedido"]] = relationship(
        back_populates="usuario"
    )