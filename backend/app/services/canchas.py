"""Reglas de negocio de las canchas: tarifa de día y de noche, y canchas que
comparten espacio.

El club tiene tres canchas de fútbol 5. Las dos de la derecha son las mitades
de la cancha de fútbol 8, así que:

- reservar el fútbol 8 ocupa las dos mitades;
- reservar una mitad ocupa el fútbol 8 (pero no la otra mitad).
"""

from decimal import Decimal

from sqlalchemy.orm import Session

from app.models.cancha import Cancha


# Desde esta hora se cobra la tarifa de noche (se juega con luz LED).
HORA_NOCHE = 18


def es_noche(hora: int) -> bool:
    return hora >= HORA_NOCHE


def precio_de_hora(cancha: Cancha, hora: int) -> Decimal:
    """Precio de la hora que empieza a las `hora` en punto."""
    return cancha.precio_noche if es_noche(hora) else cancha.precio_hora


def calcular_total(cancha: Cancha, hora_inicio: int, horas: int) -> Decimal:
    """Suma hora por hora: una reserva de 17:00 a 19:00 cobra una hora de día
    y una de noche."""
    return sum(
        (precio_de_hora(cancha, hora) for hora in range(hora_inicio, hora_inicio + horas)),
        Decimal("0"),
    )


def ids_que_comparten_espacio(db: Session, cancha: Cancha) -> list[int]:
    """La cancha, la que la contiene (si es una mitad) y sus mitades (si es
    la grande). Una reserva activa en cualquiera de ellas la ocupa."""
    ids = {cancha.id}

    if cancha.cancha_padre_id is not None:
        ids.add(cancha.cancha_padre_id)

    mitades = db.query(Cancha.id).filter(Cancha.cancha_padre_id == cancha.id).all()
    ids.update(mitad_id for (mitad_id,) in mitades)

    return sorted(ids)
