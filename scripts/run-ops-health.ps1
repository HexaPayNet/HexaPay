param(
  [switch]$Strict
)

$ErrorActionPreference = "Stop"

$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$logDirectory = Join-Path $projectRoot "backend\storage\ops-logs"
$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$logPath = Join-Path $logDirectory "ops-health-$timestamp.log"

New-Item -ItemType Directory -Force -Path $logDirectory | Out-Null
Set-Location $projectRoot

& npm run ops:health 2>&1 | Tee-Object -FilePath $logPath

if($LASTEXITCODE -ne 0){
  if($Strict){
    throw "HexaPay ops health check failed. Review $logPath"
  }

  exit $LASTEXITCODE
}
