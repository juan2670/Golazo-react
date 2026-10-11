from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_admin
from app.database import get_db
from app.models.cancha import Cancha
from app.models.usuario import Usuario
from app.schemas.cancha import CanchaCreate, CanchaResponse


router = APIRouter(
    prefix="/canchas",
    tags=["Canchas"],
)


@router.get(
    "/",
    response_model=list[CanchaResponse],
)
def listar_canchas(db: Session = Depends(get_db)):
    return db.query(Cancha).order_by(Cancha.id).all()


# Solo un administrador puede crear canchas: antes cualquiera podía hacerlo
# sin iniciar sesión.
@router.post(
    "/",
    response_model=CanchaResponse,
    status_code=status.HTTP_201_CREATED,
)
def crear_cancha(
    cancha: CanchaCreate,
    db: Session = Depends(get_db),
    _admin: Usuario = Depends(get_current_admin),
):
    nueva_cancha = Cancha(
        nombre=cancha.nombre,
        tipo=cancha.tipo,
        precio_hora=cancha.precio_hora,
        capacidad=cancha.capacidad,
        estado=cancha.estado,
    )

    db.add(nueva_cancha)
    db.commit()
    db.refresh(nueva_cancha)

    return nueva_cancha
