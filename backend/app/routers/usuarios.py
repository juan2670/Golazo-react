from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.core.security import (
    create_access_token,
    hash_password,
    verify_password,
)
from app.database import get_db
from app.models.usuario import Usuario
from app.schemas.usuario import (
    TokenResponse,
    UsuarioCreate,
    UsuarioLogin,
    UsuarioResponse,
)

from app.schemas.usuario import (
    TokenResponse,
    UsuarioCreate,
    UsuarioLogin,
    UsuarioResponse,
    UsuarioUpdate,
)


router = APIRouter(
    prefix="/usuarios",
    tags=["Usuarios"],
)


@router.post(
    "/registro",
    response_model=UsuarioResponse,
    status_code=status.HTTP_201_CREATED,
)
def registrar_usuario(
    usuario: UsuarioCreate,
    db: Session = Depends(get_db),
):
    usuario_existente = (
        db.query(Usuario)
        .filter(Usuario.email == usuario.email)
        .first()
    )

    if usuario_existente:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="El correo electrónico ya está registrado.",
        )

    nuevo_usuario = Usuario(
        nombre=usuario.nombre,
        apellido=usuario.apellido,
        email=usuario.email,
        password_hash=hash_password(usuario.password),
        telefono=usuario.telefono,
    )

    db.add(nuevo_usuario)
    db.commit()
    db.refresh(nuevo_usuario)

    return nuevo_usuario

@router.post(
    "/login",
    response_model=TokenResponse,
)
def iniciar_sesion(
    datos: UsuarioLogin,
    db: Session = Depends(get_db),
):
    usuario = (
        db.query(Usuario)
        .filter(Usuario.email == datos.email)
        .first()
    )

    if not usuario:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales incorrectas.",
        )

    if not verify_password(
        datos.password,
        usuario.password_hash,
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales incorrectas.",
        )

    access_token = create_access_token(
        {
            "sub": str(usuario.id),
            "email": usuario.email,
            "rol": usuario.rol,
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
    }
    
@router.get("/me", response_model=UsuarioResponse)
def obtener_usuario_actual(
    usuario_actual: Usuario = Depends(get_current_user),
):
    return usuario_actual


@router.patch("/me", response_model=UsuarioResponse)
def actualizar_usuario_actual(
    datos: UsuarioUpdate,
    usuario_actual: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if datos.nombre is not None:
        usuario_actual.nombre = datos.nombre

    if datos.apellido is not None:
        usuario_actual.apellido = datos.apellido

    if datos.telefono is not None:
        usuario_actual.telefono = datos.telefono

    db.commit()
    db.refresh(usuario_actual)

    return usuario_actual