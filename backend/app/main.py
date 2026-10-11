import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import canchas, pedidos, productos, reservas, usuarios


load_dotenv()


app = FastAPI(
    title="Golazo API",
    description="API para el sistema de reservas y tienda de Golazo",
    version="1.1.0",
)


# Orígenes permitidos separados por comas en CORS_ORIGINS (ver .env.example).
# Sin la variable se aceptan solo los del servidor de desarrollo de Vite.
ORIGENES_POR_DEFECTO = "http://localhost:5173,http://127.0.0.1:5173"

origenes_permitidos = [
    origen.strip()
    for origen in os.getenv("CORS_ORIGINS", ORIGENES_POR_DEFECTO).split(",")
    if origen.strip()
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origenes_permitidos,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(canchas.router)
app.include_router(reservas.router)
app.include_router(usuarios.router)
app.include_router(productos.router)
app.include_router(pedidos.router)


@app.get("/")
def root():
    return {
        "message": "Golazo API funcionando",
        "status": "ok",
    }
