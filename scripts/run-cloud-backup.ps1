param(
  [switch]$SkipUpload,
  [switch]$SkipPrune
)

$ErrorActionPreference = "Stop"

$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$logDirectory = Join-Path $projectRoot "backend\storage\backup-logs"
$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$logPath = Join-Path $logDirectory "cloud-backup-$timestamp.log"

New-Item -ItemType Directory -Force -Path $logDirectory | Out-Null
Set-Location $projectRoot

$arguments = @("run", "backup:cloud")
if($SkipUpload){
  $arguments += "--"
  $arguments += "--skip-upload"
}
if($SkipPrune){
  if(-not $SkipUpload){
    $arguments += "--"
  }
  $arguments += "--skip-prune"
}

& npm @arguments 2>&1 | Tee-Object -FilePath $logPath

if($LASTEXITCODE -ne 0){
  exit $LASTEXITCODE
}
