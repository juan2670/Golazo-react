from datetime import date, time

from pydantic import BaseModel, Field


class ReservaCreate(BaseModel):
    cancha_id: int = Field(gt=0)
    fecha: date
    hora_inicio: time
    hora_fin: time


class ReservaResponse(BaseModel):
    id: int
    usuario_id: int
    cancha_id: int
    fecha: date
    hora_inicio: time
    hora_fin: time
    estado: str
    total: float

    class Config:
        from_attributes = True