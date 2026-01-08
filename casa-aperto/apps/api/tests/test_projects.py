from http import HTTPStatus


def login(client):
    client.post("/auth/bootstrap")
    response = client.post(
        "/auth/login",
        json={"email": "admin@casa-aperto.local", "password": "Admin123!"},
    )
    assert response.status_code == HTTPStatus.OK


def test_projects_flow(client):
    unauthorized = client.get("/projects")
    assert unauthorized.status_code == HTTPStatus.UNAUTHORIZED

    login(client)

    create_project = client.post(
        "/projects",
        json={"name": "Projet Test", "building_type": "villa_moderne"},
    )
    assert create_project.status_code == HTTPStatus.CREATED
    project_id = create_project.json()["id"]

    list_projects = client.get("/projects")
    assert list_projects.status_code == HTTPStatus.OK
    assert any(p["id"] == project_id for p in list_projects.json())

    create_opening = client.post(
        f"/projects/{project_id}/openings",
        json={
            "type": "window",
            "width": 1200,
            "height": 1000,
            "quantity": 2,
        },
    )
    assert create_opening.status_code == HTTPStatus.CREATED

    list_openings = client.get(f"/projects/{project_id}/openings")
    assert list_openings.status_code == HTTPStatus.OK
    assert len(list_openings.json()) == 1
