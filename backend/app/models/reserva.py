from datetime import date, time
from decimal import Decimal
from typing import TYPE_CHECKING

from sqlalchemy import Date, ForeignKey, Numeric, String, Time
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

if TYPE_CHECKING:
    from app.models.cancha import Cancha
    from app.models.usuario import Usuario


class Reserva(Base):
    __tablename__ = "reservas"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True,
    )

    usuario_id: Mapped[int] = mapped_column(
        ForeignKey("usuarios.id"),
        nullable=False,
    )

    cancha_id: Mapped[int] = mapped_column(
        ForeignKey("canchas.id"),
        nullable=False,
    )

    fecha: Mapped[date] = mapped_column(
        Date,
        nullable=False,
    )

    hora_inicio: Mapped[time] = mapped_column(
        Time,
        nullable=False,
    )

    hora_fin: Mapped[time] = mapped_column(
        Time,
        nullable=False,
    )

    estado: Mapped[str] = mapped_column(
        String(30),
        default="pendiente",
        nullable=False,
    )

    total: Mapped[Decimal] = mapped_column(
        Numeric(10, 2),
        nullable=False,
    )

    usuario: Mapped["Usuario"] = relationship(
        back_populates="reservas"
    )

    cancha: Mapped["Cancha"] = relationship(
        back_populates="reservas"
    )