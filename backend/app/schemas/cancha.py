from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field


class CanchaCreate(BaseModel):
    nombre: str = Field(min_length=3, max_length=100)
    tipo: str = Field(min_length=3, max_length=50)
    precio_hora: Decimal = Field(gt=0)
    capacidad: int = Field(gt=0)
    estado: bool = True


class CanchaResponse(BaseModel):
    id: int
    nombre: str
    tipo: str
    precio_hora: Decimal
    capacidad: int
    estado: bool

    model_config = ConfigDict(from_attributes=True)