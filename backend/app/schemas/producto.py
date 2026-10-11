from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field


class ProductoCreate(BaseModel):
    nombre: str = Field(min_length=3, max_length=150)
    descripcion: str | None = None
    precio: Decimal = Field(gt=0)
    stock: int = Field(ge=0)
    categoria: str = Field(min_length=3, max_length=50)
    imagen: str | None = Field(default=None, max_length=500)
    estado: bool = True


class ProductoUpdate(BaseModel):
    nombre: str | None = Field(default=None, min_length=3, max_length=150)
    descripcion: str | None = None
    precio: Decimal | None = Field(default=None, gt=0)
    stock: int | None = Field(default=None, ge=0)
    categoria: str | None = Field(default=None, min_length=3, max_length=50)
    imagen: str | None = Field(default=None, max_length=500)
    estado: bool | None = None


class ProductoResponse(BaseModel):
    id: int
    nombre: str
    descripcion: str | None
    # float (no Decimal) para que el frontend reciba un número y no un texto
    precio: float
    stock: int
    categoria: str
    imagen: str | None
    estado: bool

    model_config = ConfigDict(from_attributes=True)
