from http import HTTPStatus


def test_bootstrap_once(client):
    response = client.post("/auth/bootstrap")
    assert response.status_code == HTTPStatus.OK
    response_second = client.post("/auth/bootstrap")
    assert response_second.status_code == HTTPStatus.BAD_REQUEST


def test_login_me(client):
    client.post("/auth/bootstrap")
    response = client.post(
        "/auth/login",
        json={"email": "admin@casa-aperto.local", "password": "Admin123!"},
    )
    assert response.status_code == HTTPStatus.OK
    assert "access_token" in response.cookies
    me_response = client.get("/auth/me")
    assert me_response.status_code == HTTPStatus.OK
    assert me_response.json()["email"] == "admin@casa-aperto.local"
