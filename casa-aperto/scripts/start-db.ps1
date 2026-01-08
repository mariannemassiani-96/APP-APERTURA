$docker = Get-Command docker -ErrorAction SilentlyContinue
if (-not $docker) {
  Write-Host "Docker n'est pas installé." -ForegroundColor Red
  exit 1
}

Write-Host "Démarrage de Postgres..."
Set-Location "$PSScriptRoot\..\docker"
docker compose up -d
