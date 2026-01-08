$node = Get-Command node -ErrorAction SilentlyContinue
if (-not $node) {
  Write-Host "Node.js n'est pas installé." -ForegroundColor Red
  exit 1
}

Set-Location "$PSScriptRoot\..\apps\pro"
npm install
npm run dev
