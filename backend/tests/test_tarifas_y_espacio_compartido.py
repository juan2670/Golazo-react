import pytest

from app.models.cancha import Cancha
from app.seed import CANCHA_GRANDE, sembrar_canchas


@pytest.fixture()
def club(db):
    """Las canchas reales: 1 suelta, y 2 y 3 como mitades del fútbol 8."""
    sembrar_canchas(db)

    return {c.nombre: c for c in db.query(Cancha).all()}


def reservar(cliente, auth, cancha, fecha, inicio, fin):
    return cliente.post(
        "/reservas/",
        json={"cancha_id": cancha.id, "fecha": fecha, "hora_inicio": inicio, "hora_fin": fin},
        headers=auth,
    )


def disponibles(cliente, cancha, fecha):
    respuesta = cliente.get(f"/reservas/disponibilidad?cancha_id={cancha.id}&fecha={fecha}")

    return {h["hora_inicio"]: h for h in respuesta.json()["horarios"]}


# ---------------------------------------------------------------- tarifas


def test_tarifa_de_dia_y_de_noche(cliente, auth, club, manana):
    f5, f8 = club["Cancha 1"], club[CANCHA_GRANDE]

    assert reservar(cliente, auth, f5, manana, "10:00", "11:00").json()["total"] == 80000
    assert reservar(cliente, auth, f5, manana, "20:00", "21:00").json()["total"] == 100000
    assert reservar(cliente, auth, f8, manana, "10:00", "11:00").json()["total"] == 140000
    assert reservar(cliente, auth, f8, manana, "20:00", "21:00").json()["total"] == 160000


def test_reserva_que_cruza_las_seis_cobra_cada_hora(cliente, auth, club, manana):
    # 17:00 es de día y 18:00 de noche
    respuesta = reservar(cliente, auth, club[CANCHA_GRANDE], manana, "17:00", "19:00")

    assert respuesta.status_code == 201
    assert respuesta.json()["total"] == 140000 + 160000


def test_disponibilidad_trae_precio_y_noche(cliente, club, manana):
    horarios = disponibles(cliente, club["Cancha 1"], manana)

    assert horarios["17:00"]["noche"] is False
    assert float(horarios["17:00"]["precio"]) == 80000
    assert horarios["18:00"]["noche"] is True
    assert float(horarios["18:00"]["precio"]) == 100000


# ---------------------------------------------------- espacio compartido


def test_reservar_el_futbol_8_ocupa_sus_dos_mitades(cliente, auth, club, manana):
    assert reservar(cliente, auth, club[CANCHA_GRANDE], manana, "19:00", "20:00").status_code == 201

    for mitad in ("Cancha 2", "Cancha 3"):
        assert disponibles(cliente, club[mitad], manana)["19:00"]["disponible"] is False

        choque = reservar(cliente, auth, club[mitad], manana, "19:00", "20:00")

        assert choque.status_code == 409
        assert "comparte espacio" in choque.json()["detail"]

    # La cancha 1 no comparte espacio con nadie
    assert disponibles(cliente, club["Cancha 1"], manana)["19:00"]["disponible"] is True


def test_reservar_una_mitad_ocupa_el_futbol_8_pero_no_la_otra(cliente, auth, club, manana):
    assert reservar(cliente, auth, club["Cancha 2"], manana, "15:00", "17:00").status_code == 201

    assert disponibles(cliente, club[CANCHA_GRANDE], manana)["16:00"]["disponible"] is False
    assert reservar(cliente, auth, club[CANCHA_GRANDE], manana, "16:00", "17:00").status_code == 409

    assert reservar(cliente, auth, club["Cancha 3"], manana, "15:00", "17:00").status_code == 201


def test_cancelar_libera_el_espacio_compartido(cliente, auth, club, manana):
    creada = reservar(cliente, auth, club["Cancha 3"], manana, "09:00", "10:00").json()

    cliente.patch(f"/reservas/{creada['id']}/cancelar", headers=auth)

    assert reservar(cliente, auth, club[CANCHA_GRANDE], manana, "09:00", "10:00").status_code == 201


# ------------------------------------------------------------------ seed


def test_seed_es_idempotente_y_corrige_tarifas(db, club):
    club["Cancha 1"].precio_noche = 1
    db.commit()

    creadas, ajustadas = sembrar_canchas(db)

    assert (creadas, ajustadas) == (0, 1)
    assert db.query(Cancha).count() == 4
    assert club["Cancha 1"].precio_noche == 100000
    assert club["Cancha 2"].cancha_padre_id == club[CANCHA_GRANDE].id
    assert club["Cancha 1"].cancha_padre_id is None


# --------------------------------------------------------- crear canchas


def test_crear_mitad_de_una_mitad_es_rechazado(cliente, auth_admin, club):
    respuesta = cliente.post(
        "/canchas/",
        json={
            "nombre": "Cuarto de cancha",
            "tipo": "Fútbol 5",
            "precio_hora": "50000",
            "capacidad": 10,
            "cancha_padre_id": club["Cancha 2"].id,
        },
        headers=auth_admin,
    )

    assert respuesta.status_code == 400


def test_crear_cancha_sin_tarifa_de_noche_usa_la_de_dia(cliente, auth_admin):
    respuesta = cliente.post(
        "/canchas/",
        json={"nombre": "Cancha nueva", "tipo": "Fútbol 5", "precio_hora": "90000", "capacidad": 10},
        headers=auth_admin,
    )

    assert respuesta.status_code == 201
    assert float(respuesta.json()["precio_noche"]) == 90000
