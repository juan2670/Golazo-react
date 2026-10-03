from decimal import Decimal
from typing import TYPE_CHECKING

from sqlalchemy import Boolean, Integer, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

if TYPE_CHECKING:
    from app.models.reserva import Reserva


class Cancha(Base):
    __tablename__ = "canchas"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True,
    )

    nombre: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    tipo: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )

    precio_hora: Mapped[Decimal] = mapped_column(
        Numeric(10, 2),
        nullable=False,
    )

    capacidad: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    estado: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )

    reservas: Mapped[list["Reserva"]] = relationship(
        back_populates="cancha"
    )