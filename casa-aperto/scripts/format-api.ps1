Set-Location "$PSScriptRoot\..\apps\api"

& .\.venv\Scripts\Activate.ps1
ruff check . --fix
black .
