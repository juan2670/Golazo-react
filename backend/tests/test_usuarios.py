from tests.conftest import registrar_y_entrar


def test_registro_login_y_perfil(cliente):
    cabeceras = registrar_y_entrar(cliente)

    perfil = cliente.get("/usuarios/me", headers=cabeceras)

    assert perfil.status_code == 200
    assert perfil.json()["email"] == "jugador@ejemplo.com"
    assert perfil.json()["rol"] == "cliente"
    assert "password_hash" not in perfil.json()


def test_registro_con_correo_repetido(cliente):
    registrar_y_entrar(cliente)

    repetido = cliente.post(
        "/usuarios/registro",
        json={"nombre": "Otro", "apellido": "Jugador", "email": "jugador@ejemplo.com", "password": "otra-clave-123"},
    )

    assert repetido.status_code == 409


def test_login_con_clave_incorrecta(cliente):
    registrar_y_entrar(cliente)

    respuesta = cliente.post("/usuarios/login", json={"email": "jugador@ejemplo.com", "password": "incorrecta-123"})

    assert respuesta.status_code == 401


def test_perfil_sin_token(cliente):
    assert cliente.get("/usuarios/me").status_code in (401, 403)


def test_token_invalido(cliente):
    respuesta = cliente.get("/usuarios/me", headers={"Authorization": "Bearer no-es-un-token"})

    assert respuesta.status_code == 401


def test_actualizar_perfil(cliente, auth):
    respuesta = cliente.patch("/usuarios/me", json={"telefono": "3125793699"}, headers=auth)

    assert respuesta.status_code == 200
    assert respuesta.json()["telefono"] == "3125793699"
    assert respuesta.json()["nombre"] == "Jugador"
