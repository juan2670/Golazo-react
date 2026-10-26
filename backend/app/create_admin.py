"""Crea una cuenta administradora desde la consola, sin exponer un endpoint público.

Uso desde backend (con DATABASE_URL y JWT_SECRET_KEY configuradas):
    python -m app.create_admin

ADMIN_EMAIL y ADMIN_PASSWORD permiten elegir credenciales. Si no se define
ADMIN_PASSWORD, se genera una clave aleatoria y se muestra una sola vez.
"""

import os
import secrets

from pydantic import EmailStr, TypeAdapter
from sqlalchemy.orm import Session

from app.core.security import hash_password
from app.database import SessionLocal
from app.models.usuario import Usuario


EMAIL_ADMIN = "admin@example.com"


def crear_admin(db: Session, email: str, password: str) -> Usuario:
    email = TypeAdapter(EmailStr).validate_python(email.strip())
    if not 8 <= len(password) <= 128:
        raise ValueError("La contraseña debe tener entre 8 y 128 caracteres.")

    existente = db.query(Usuario).filter(Usuario.email == email).first()
    if existente:
        raise ValueError(
            "Ya existe una cuenta con ese correo. No se cambiarán su rol ni su contraseña."
        )

    admin = Usuario(
        nombre="Administrador",
        apellido="Golazo",
        email=email,
        password_hash=hash_password(password),
        rol="admin",
    )
    db.add(admin)
    db.commit()
    db.refresh(admin)
    return admin


def main() -> None:
    email = os.getenv("ADMIN_EMAIL", EMAIL_ADMIN)
    configured_password = os.getenv("ADMIN_PASSWORD")
    password = configured_password or secrets.token_urlsafe(24)

    with SessionLocal() as db:
        admin = crear_admin(db, email, password)

    print(f"Administrador creado: {admin.email} (id {admin.id}).")
    if configured_password is None:
        print(f"Contraseña generada (guárdala ahora): {password}")


if __name__ == "__main__":
    main()
