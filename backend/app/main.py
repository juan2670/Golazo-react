from fastapi import FastAPI

from app.routers import canchas, reservas, usuarios

app = FastAPI(
    title="Golazo API",
    description="API para el sistema de reservas y tienda de Golazo",
    version="1.0.0",
)


app.include_router(canchas.router)
app.include_router(reservas.router)
app.include_router(usuarios.router)


@app.get("/")
def root():
    return {
        "message": "Golazo API funcionando",
        "status": "ok",
    }