from datetime import date, time

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import and_
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.database import get_db
from app.models.cancha import Cancha
from app.models.reserva import Reserva
from app.models.usuario import Usuario
from app.schemas.reserva import ReservaCreate, ReservaResponse


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
        .order_by(Reserva.fecha, Reserva.hora_inicio)
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
    # =====================================================
    # 1. Buscar la cancha
    # =====================================================

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

    # =====================================================
    # 2. Validar fecha
    # =====================================================

    if reserva.fecha < date.today():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No se pueden realizar reservas para fechas pasadas.",
        )

    # =====================================================
    # 3. Validar horario
    # =====================================================

    hora_inicio = reserva.hora_inicio
    hora_fin = reserva.hora_fin

    if hora_inicio < time(8, 0):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Las reservas comienzan a las 08:00.",
        )

    # =====================================================
    # 4. Calcular duración
    # =====================================================

    minutos_inicio = (
        hora_inicio.hour * 60
        + hora_inicio.minute
    )

    if hora_fin == time(0, 0):
        # 00:00 representa el final del día.
        minutos_fin = 24 * 60
    else:
        minutos_fin = (
            hora_fin.hour * 60
            + hora_fin.minute
        )

    if minutos_fin <= minutos_inicio:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="La hora de finalización debe ser posterior a la hora de inicio.",
        )

    duracion_minutos = minutos_fin - minutos_inicio

    # =====================================================
    # 5. Validar duración
    # =====================================================

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

    # =====================================================
    # 6. Validar conflicto
    # =====================================================

    reservas_existentes = (
        db.query(Reserva)
        .filter(
            Reserva.cancha_id == reserva.cancha_id,
            Reserva.fecha == reserva.fecha,
            Reserva.estado != "cancelada",
        )
        .all()
    )

    for reserva_existente in reservas_existentes:
        inicio_existente = (
            reserva_existente.hora_inicio.hour * 60
            + reserva_existente.hora_inicio.minute
        )

        if reserva_existente.hora_fin == time(0, 0):
            fin_existente = 24 * 60
        else:
            fin_existente = (
                reserva_existente.hora_fin.hour * 60
                + reserva_existente.hora_fin.minute
            )

        if (
            inicio_existente < minutos_fin
            and fin_existente > minutos_inicio
        ):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="La cancha ya está reservada en ese horario.",
            )

    # =====================================================
    # 7. Calcular total
    # =====================================================

    total = cancha.precio_hora * horas

    # =====================================================
    # 8. Crear reserva
    # =====================================================

    nueva_reserva = Reserva(
        usuario_id=usuario_actual.id,
        cancha_id=reserva.cancha_id,
        fecha=reserva.fecha,
        hora_inicio=reserva.hora_inicio,
        hora_fin=reserva.hora_fin,
        estado="pendiente",
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
    # =====================================================
    # 1. Buscar cancha
    # =====================================================

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

    # =====================================================
    # 2. Validar fecha
    # =====================================================

    if fecha < date.today():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No se puede consultar disponibilidad para una fecha pasada.",
        )

    # =====================================================
    # 3. Obtener reservas activas
    # =====================================================

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

    # =====================================================
    # 4. Generar horarios
    # =====================================================

    horarios = []

    hora_actual = 8

    while hora_actual < 24:
        hora_inicio = time(hour=hora_actual)

        if hora_actual == 23:
            hora_fin = time(0, 0)
        else:
            hora_fin = time(hour=hora_actual + 1)

        inicio_minutos = hora_actual * 60
        fin_minutos = (hora_actual + 1) * 60

        ocupada = False

        for reserva_existente in reservas:
            reserva_inicio = (
                reserva_existente.hora_inicio.hour * 60
                + reserva_existente.hora_inicio.minute
            )

            if reserva_existente.hora_fin == time(0, 0):
                reserva_fin = 24 * 60
            else:
                reserva_fin = (
                    reserva_existente.hora_fin.hour * 60
                    + reserva_existente.hora_fin.minute
                )

            if (
                reserva_inicio < fin_minutos
                and reserva_fin > inicio_minutos
            ):
                ocupada = True
                break

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