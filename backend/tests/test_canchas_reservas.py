from datetime import date, timedelta


NUEVA_CANCHA = {"nombre": "Cancha 8", "tipo": "Fútbol 8", "precio_hora": "150000", "capacidad": 16}


def test_listar_canchas_es_publico(cliente, cancha):
    respuesta = cliente.get("/canchas/")

    assert respuesta.status_code == 200
    assert [c["nombre"] for c in respuesta.json()] == ["Cancha 1"]


def test_crear_cancha_requiere_sesion(cliente):
    assert cliente.post("/canchas/", json=NUEVA_CANCHA).status_code in (401, 403)


def test_crear_cancha_requiere_admin(cliente, auth):
    assert cliente.post("/canchas/", json=NUEVA_CANCHA, headers=auth).status_code == 403


def test_admin_crea_cancha(cliente, auth_admin):
    respuesta = cliente.post("/canchas/", json=NUEVA_CANCHA, headers=auth_admin)

    assert respuesta.status_code == 201
    assert respuesta.json()["tipo"] == "Fútbol 8"


def test_disponibilidad_marca_hora_reservada(cliente, auth, cancha, manana):
    cliente.post(
        "/reservas/",
        json={"cancha_id": cancha.id, "fecha": manana, "hora_inicio": "18:00", "hora_fin": "20:00"},
        headers=auth,
    )

    respuesta = cliente.get(f"/reservas/disponibilidad?cancha_id={cancha.id}&fecha={manana}")
    horarios = {h["hora_inicio"]: h["disponible"] for h in respuesta.json()["horarios"]}

    assert respuesta.status_code == 200
    assert horarios["18:00"] is False
    assert horarios["19:00"] is False
    assert horarios["20:00"] is True
    assert len(horarios) == 16  # 08:00 a 00:00


def test_reserva_calcula_total_y_evita_choques(cliente, auth, cancha, manana):
    reserva = {"cancha_id": cancha.id, "fecha": manana, "hora_inicio": "18:00", "hora_fin": "20:00"}

    creada = cliente.post("/reservas/", json=reserva, headers=auth)
    choque = cliente.post(
        "/reservas/",
        json={**reserva, "hora_inicio": "19:00", "hora_fin": "21:00"},
        headers=auth,
    )

    assert creada.status_code == 201
    assert creada.json()["total"] == 200000
    assert creada.json()["estado"] == "pendiente"
    assert choque.status_code == 409


def test_reserva_hasta_medianoche(cliente, auth, cancha, manana):
    respuesta = cliente.post(
        "/reservas/",
        json={"cancha_id": cancha.id, "fecha": manana, "hora_inicio": "23:00", "hora_fin": "00:00"},
        headers=auth,
    )

    assert respuesta.status_code == 201
    assert respuesta.json()["total"] == 100000


def test_reserva_en_fecha_pasada(cliente, auth, cancha):
    ayer = (date.today() - timedelta(days=1)).isoformat()

    respuesta = cliente.post(
        "/reservas/",
        json={"cancha_id": cancha.id, "fecha": ayer, "hora_inicio": "18:00", "hora_fin": "19:00"},
        headers=auth,
    )

    assert respuesta.status_code == 400


def test_reserva_media_hora_rechazada(cliente, auth, cancha, manana):
    respuesta = cliente.post(
        "/reservas/",
        json={"cancha_id": cancha.id, "fecha": manana, "hora_inicio": "18:00", "hora_fin": "18:30"},
        headers=auth,
    )

    assert respuesta.status_code == 400


def test_cancelar_reserva_libera_horario(cliente, auth, cancha, manana):
    creada = cliente.post(
        "/reservas/",
        json={"cancha_id": cancha.id, "fecha": manana, "hora_inicio": "10:00", "hora_fin": "11:00"},
        headers=auth,
    ).json()

    cancelada = cliente.patch(f"/reservas/{creada['id']}/cancelar", headers=auth)
    otra_vez = cliente.patch(f"/reservas/{creada['id']}/cancelar", headers=auth)
    nueva = cliente.post(
        "/reservas/",
        json={"cancha_id": cancha.id, "fecha": manana, "hora_inicio": "10:00", "hora_fin": "11:00"},
        headers=auth,
    )

    assert cancelada.json()["estado"] == "cancelada"
    assert otra_vez.status_code == 400
    assert nueva.status_code == 201


def test_no_se_ven_reservas_ajenas(cliente, auth, cancha, manana):
    from tests.conftest import registrar_y_entrar

    creada = cliente.post(
        "/reservas/",
        json={"cancha_id": cancha.id, "fecha": manana, "hora_inicio": "12:00", "hora_fin": "13:00"},
        headers=auth,
    ).json()

    otro = registrar_y_entrar(cliente, email="otro@ejemplo.com")

    assert cliente.get("/reservas/", headers=otro).json() == []
    assert cliente.patch(f"/reservas/{creada['id']}/cancelar", headers=otro).status_code == 404
