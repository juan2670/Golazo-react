from app.models.producto import Producto
from tests.conftest import registrar_y_entrar


def test_listar_solo_productos_activos(cliente, productos):
    respuesta = cliente.get("/productos/")
    nombres = [p["nombre"] for p in respuesta.json()]

    assert respuesta.status_code == 200
    assert nombres == ["Balón Golazo Pro", "Agua"]
    assert isinstance(respuesta.json()[0]["precio"], (int, float))


def test_filtrar_por_categoria(cliente, productos):
    respuesta = cliente.get("/productos/", params={"categoria": "Bebidas"})

    assert [p["nombre"] for p in respuesta.json()] == ["Agua"]


def test_producto_inactivo_no_se_muestra(cliente, productos):
    retirado = productos[2]

    assert cliente.get(f"/productos/{retirado.id}").status_code == 404


def test_crear_producto_requiere_admin(cliente, auth, auth_admin):
    nuevo = {"nombre": "Guayos Pro", "categoria": "Fútbol", "precio": "180000", "stock": 3}

    assert cliente.post("/productos/", json=nuevo, headers=auth).status_code == 403

    creado = cliente.post("/productos/", json=nuevo, headers=auth_admin)

    assert creado.status_code == 201
    assert creado.json()["precio"] == 180000


def test_admin_actualiza_stock(cliente, auth_admin, productos):
    respuesta = cliente.patch(f"/productos/{productos[0].id}", json={"stock": 20}, headers=auth_admin)

    assert respuesta.status_code == 200
    assert respuesta.json()["stock"] == 20
    assert respuesta.json()["nombre"] == "Balón Golazo Pro"


def test_pedido_requiere_sesion(cliente, productos):
    respuesta = cliente.post("/pedidos/", json={"items": [{"producto_id": productos[0].id, "cantidad": 1}]})

    assert respuesta.status_code in (401, 403)


def test_crear_pedido_calcula_total_y_descuenta_stock(cliente, auth, productos, db):
    balon, agua, _ = productos

    respuesta = cliente.post(
        "/pedidos/",
        json={
            "items": [
                {"producto_id": balon.id, "cantidad": 2},
                {"producto_id": agua.id, "cantidad": 3},
                {"producto_id": agua.id, "cantidad": 1},  # línea repetida: se une
            ]
        },
        headers=auth,
    )
    pedido = respuesta.json()

    assert respuesta.status_code == 201
    assert pedido["estado"] == "pendiente"
    assert pedido["total"] == 2 * 85000 + 4 * 4000
    assert {d["producto"]["nombre"]: d["cantidad"] for d in pedido["detalles"]} == {
        "Balón Golazo Pro": 2,
        "Agua": 4,
    }

    db.expire_all()
    assert db.get(Producto, balon.id).stock == 3
    assert db.get(Producto, agua.id).stock == 6


def test_precio_sale_de_la_base_no_del_navegador(cliente, auth, productos):
    # Un campo "precio" enviado por el cliente se ignora.
    respuesta = cliente.post(
        "/pedidos/",
        json={"items": [{"producto_id": productos[0].id, "cantidad": 1, "precio": 1}]},
        headers=auth,
    )

    assert respuesta.json()["total"] == 85000


def test_stock_insuficiente_no_crea_nada(cliente, auth, productos, db):
    balon, agua, _ = productos

    respuesta = cliente.post(
        "/pedidos/",
        json={"items": [{"producto_id": agua.id, "cantidad": 1}, {"producto_id": balon.id, "cantidad": 6}]},
        headers=auth,
    )

    assert respuesta.status_code == 409
    assert "Balón Golazo Pro" in respuesta.json()["detail"]

    db.expire_all()
    assert db.get(Producto, agua.id).stock == 10  # nada se descontó
    assert cliente.get("/pedidos/", headers=auth).json() == []


def test_producto_inexistente_o_inactivo(cliente, auth, productos):
    inexistente = cliente.post("/pedidos/", json={"items": [{"producto_id": 999, "cantidad": 1}]}, headers=auth)
    inactivo = cliente.post(
        "/pedidos/", json={"items": [{"producto_id": productos[2].id, "cantidad": 1}]}, headers=auth
    )

    assert inexistente.status_code == 404
    assert inactivo.status_code == 400


def test_pedido_vacio_o_cantidad_invalida(cliente, auth, productos):
    assert cliente.post("/pedidos/", json={"items": []}, headers=auth).status_code == 422
    assert (
        cliente.post("/pedidos/", json={"items": [{"producto_id": productos[0].id, "cantidad": 0}]}, headers=auth)
        .status_code
        == 422
    )


def test_cancelar_pedido_devuelve_stock(cliente, auth, productos, db):
    balon = productos[0]

    pedido = cliente.post(
        "/pedidos/", json={"items": [{"producto_id": balon.id, "cantidad": 2}]}, headers=auth
    ).json()

    cancelado = cliente.patch(f"/pedidos/{pedido['id']}/cancelar", headers=auth)
    otra_vez = cliente.patch(f"/pedidos/{pedido['id']}/cancelar", headers=auth)

    assert cancelado.status_code == 200
    assert cancelado.json()["estado"] == "cancelado"
    assert otra_vez.status_code == 400

    db.expire_all()
    assert db.get(Producto, balon.id).stock == 5


def test_cada_usuario_ve_solo_sus_pedidos(cliente, auth, productos):
    pedido = cliente.post(
        "/pedidos/", json={"items": [{"producto_id": productos[1].id, "cantidad": 1}]}, headers=auth
    ).json()

    otro = registrar_y_entrar(cliente, email="otro@ejemplo.com")

    assert len(cliente.get("/pedidos/", headers=auth).json()) == 1
    assert cliente.get("/pedidos/", headers=otro).json() == []
    assert cliente.patch(f"/pedidos/{pedido['id']}/cancelar", headers=otro).status_code == 404


def test_semilla_es_idempotente(db):
    from app.seed import PRODUCTOS, sembrar_productos

    assert sembrar_productos(db) == len(PRODUCTOS)
    assert sembrar_productos(db) == 0
    assert db.query(Producto).count() == len(PRODUCTOS)
