# Casa Aperto PRO API

## Endpoints
- `POST /auth/bootstrap` — crée l'admin par défaut (une seule fois)
- `POST /auth/login` — login, pose cookies httpOnly
- `POST /auth/logout` — logout
- `GET /auth/me` — utilisateur courant
- `GET /projects` — liste des projets (auth)
- `POST /projects` — crée un projet (auth)
- `GET /projects/{id}/openings` — ouvertures d'un projet (auth + ownership)
- `POST /projects/{id}/openings` — crée une ouverture (auth + ownership)
- `GET /admin/users` — liste users (admin)
- `POST /admin/users` — crée user interne (admin)

## Migrations Alembic
```powershell
cd apps/api
alembic upgrade head
```

## Qualité / Tests
```powershell
ruff check . --fix
black .
pytest -q
```

## Tests et base de données
Par défaut, les tests utilisent `DATABASE_URL` et recréent les tables au démarrage de la session.
Vous pouvez définir `DATABASE_URL_TEST` pour pointer vers une base séparée.
