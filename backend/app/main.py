from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import canchas, reservas, usuarios


app = FastAPI(
    title="Golazo API",
    description="API para el sistema de reservas y tienda de Golazo",
    version="1.0.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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