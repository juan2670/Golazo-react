from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class ItemPedido(BaseModel):
    producto_id: int = Field(gt=0)
    cantidad: int = Field(gt=0, le=50)


class PedidoCreate(BaseModel):
    items: list[ItemPedido] = Field(min_length=1, max_length=50)


class ProductoEnPedido(BaseModel):
    id: int
    nombre: str
    imagen: str | None

    model_config = ConfigDict(from_attributes=True)


class DetallePedidoResponse(BaseModel):
    id: int
    producto_id: int
    producto: ProductoEnPedido
    cantidad: int
    precio_unitario: float
    subtotal: float

    model_config = ConfigDict(from_attributes=True)


class PedidoResponse(BaseModel):
    id: int
    usuario_id: int
    fecha: datetime
    total: float
    estado: str
    detalles: list[DetallePedidoResponse]

    model_config = ConfigDict(from_attributes=True)
