# Casa Aperto — Monorepo

## Pré-requis
- Docker
- Python 3.11+
- Node.js 18+

## Setup Windows (ordre exact)
1. `\scripts\start-db.ps1`
2. `\scripts\start-api.ps1`
3. `\scripts\migrate.ps1`
4. Ouvrir `http://localhost:8000/docs` puis exécuter `POST /auth/bootstrap`
5. `\scripts\start-pro.ps1`
6. Ouvrir `http://localhost:3000/login`
7. (Optionnel) `\scripts\start-public.ps1` puis `http://localhost:3001`

## Identifiants admin initiaux
- Email: `admin@casa-aperto.local`
- Mot de passe: `Admin123!`

## Création d'un utilisateur interne
Depuis l'interface `Casa Aperto PRO`, aller sur `/admin/users` puis remplir le formulaire.

## Commandes utiles (PowerShell)
```powershell
\scripts\format-api.ps1
\scripts\test-api.ps1
```
