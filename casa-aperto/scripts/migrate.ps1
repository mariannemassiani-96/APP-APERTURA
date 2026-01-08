Set-Location "$PSScriptRoot\..\apps\api"

& .\.venv\Scripts\Activate.ps1
alembic upgrade head
