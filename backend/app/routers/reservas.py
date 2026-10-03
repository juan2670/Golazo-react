from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import and_
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.database import get_db
from app.models.cancha import Cancha
from app.models.reserva import Reserva
from app.models.usuario import Usuario
from app.schemas.reserva import ReservaCreate, ReservaResponse
from decimal import Decimal
from datetime import date, time


router = APIRouter(
    prefix="/reservas",
    tags=["Reservas"],
)


@router.get(
    "/",
    response_model=list[ReservaResponse],
)
def listar_reservas(
    db: Session = Depends(get_db),
    usuario_actual: Usuario = Depends(get_current_user),
):
    return (
        db.query(Reserva)
        .filter(Reserva.usuario_id == usuario_actual.id)
        .all()
    )


@router.post(
    "/",
    response_model=ReservaResponse,
    status_code=status.HTTP_201_CREATED,
)
def crear_reserva(
    reserva: ReservaCreate,
    db: Session = Depends(get_db),
    usuario_actual: Usuario = Depends(get_current_user),
):
    cancha = (
        db.query(Cancha)
        .filter(Cancha.id == reserva.cancha_id)
        .first()
    )

    if not cancha:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="La cancha no existe.",
        )

    if not cancha.estado:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="La cancha no está disponible.",
        )

    if reserva.hora_fin <= reserva.hora_inicio:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="La hora de finalización debe ser posterior a la hora de inicio.",
        )

    reserva_conflictiva = (
        db.query(Reserva)
        .filter(
            and_(
                Reserva.cancha_id == reserva.cancha_id,
                Reserva.fecha == reserva.fecha,
                Reserva.estado != "cancelada",
                Reserva.hora_inicio < reserva.hora_fin,
                Reserva.hora_fin > reserva.hora_inicio,
            )
        )
        .first()
    )

    if reserva_conflictiva:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="La cancha ya está reservada en ese horario.",
        )

    hora_inicio_minutos = (
        reserva.hora_inicio.hour * 60
        + reserva.hora_inicio.minute
    )

    hora_fin_minutos = (
        reserva.hora_fin.hour * 60
        + reserva.hora_fin.minute
    )

    duracion_minutos = hora_fin_minutos - hora_inicio_minutos

    if duracion_minutos < 60:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="La reserva debe durar mínimo una hora.",
        )

    if duracion_minutos % 60 != 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="La reserva debe tener una duración en horas completas.",
        )

    horas = duracion_minutos // 60

    total = cancha.precio_hora * horas

    nueva_reserva = Reserva(
        usuario_id=usuario_actual.id,
        cancha_id=reserva.cancha_id,
        fecha=reserva.fecha,
        hora_inicio=reserva.hora_inicio,
        hora_fin=reserva.hora_fin,
        total=total,
    )

    db.add(nueva_reserva)
    db.commit()
    db.refresh(nueva_reserva)

    return nueva_reserva

@router.patch(
    "/{reserva_id}/cancelar",
    response_model=ReservaResponse,
)
def cancelar_reserva(
    reserva_id: int,
    db: Session = Depends(get_db),
    usuario_actual: Usuario = Depends(get_current_user),
):
    reserva = (
        db.query(Reserva)
        .filter(
            Reserva.id == reserva_id,
            Reserva.usuario_id == usuario_actual.id,
        )
        .first()
    )

    if not reserva:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reserva no encontrada.",
        )

    if reserva.estado == "cancelada":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="La reserva ya está cancelada.",
        )

    reserva.estado = "cancelada"

    db.commit()
    db.refresh(reserva)

    return reserva


@router.get(
    "/disponibilidad",
)
def consultar_disponibilidad(
    cancha_id: int,
    fecha: date,
    db: Session = Depends(get_db),
):
    cancha = (
        db.query(Cancha)
        .filter(Cancha.id == cancha_id)
        .first()
    )

    if not cancha:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="La cancha no existe.",
        )

    if not cancha.estado:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="La cancha no está disponible.",
        )

    reservas = (
        db.query(Reserva)
        .filter(
            Reserva.cancha_id == cancha_id,
            Reserva.fecha == fecha,
            Reserva.estado != "cancelada",
        )
        .order_by(Reserva.hora_inicio)
        .all()
    )

    horarios = []

    hora_actual = 8

    while hora_actual < 24:
        hora_inicio = time(hour=hora_actual)
        hora_fin = time(hour=(hora_actual + 1) % 24)

        ocupada = any(
            reserva.hora_inicio < hora_fin
            and reserva.hora_fin > hora_inicio
            for reserva in reservas
        )

        horarios.append(
            {
                "hora_inicio": hora_inicio.strftime("%H:%M"),
                "hora_fin": hora_fin.strftime("%H:%M"),
                "disponible": not ocupada,
            }
        )

        hora_actual += 1

    return {
        "cancha_id": cancha_id,
        "fecha": fecha,
        "horarios": horarios,
    }