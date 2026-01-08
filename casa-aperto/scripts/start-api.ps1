$python = Get-Command python -ErrorAction SilentlyContinue
if (-not $python) {
  Write-Host "Python n'est pas installé." -ForegroundColor Red
  exit 1
}

Set-Location "$PSScriptRoot\..\apps\api"

if (-not (Test-Path ".env")) {
  Copy-Item ".env.example" ".env"
}

if (-not (Test-Path ".venv")) {
  python -m venv .venv
}

& .\.venv\Scripts\Activate.ps1
pip install -r requirements.txt

uvicorn app.main:app --reload --port 8000
