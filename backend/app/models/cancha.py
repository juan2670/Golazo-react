from decimal import Decimal
from typing import TYPE_CHECKING

from sqlalchemy import Boolean, ForeignKey, Integer, Numeric, String
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

    # Tarifa de día (antes de HORA_NOCHE). Conserva su nombre original para no
    # romper a quien ya consume la API.
    precio_hora: Mapped[Decimal] = mapped_column(
        Numeric(10, 2),
        nullable=False,
    )

    # Tarifa de noche (desde HORA_NOCHE, con luz LED).
    precio_noche: Mapped[Decimal] = mapped_column(
        Numeric(10, 2),
        nullable=False,
    )

    # Cancha que contiene a esta: las dos de fútbol 5 de la derecha son las
    # mitades de la de fútbol 8. Reservar una ocupa también la otra.
    cancha_padre_id: Mapped[int | None] = mapped_column(
        ForeignKey("canchas.id"),
        nullable=True,
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