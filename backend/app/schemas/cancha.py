from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field


class CanchaCreate(BaseModel):
    nombre: str = Field(min_length=3, max_length=100)
    tipo: str = Field(min_length=3, max_length=50)
    # Tarifa de día
    precio_hora: Decimal = Field(gt=0)
    # Tarifa de noche; si no se envía, se cobra lo mismo que de día
    precio_noche: Decimal | None = Field(default=None, gt=0)
    # Cancha que la contiene (por ejemplo, una mitad del fútbol 8)
    cancha_padre_id: int | None = None
    capacidad: int = Field(gt=0)
    estado: bool = True


class CanchaResponse(BaseModel):
    id: int
    nombre: str
    tipo: str
    precio_hora: Decimal
    precio_noche: Decimal
    cancha_padre_id: int | None
    capacidad: int
    estado: bool

    model_config = ConfigDict(from_attributes=True)
