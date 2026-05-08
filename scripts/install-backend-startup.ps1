$ErrorActionPreference = "Stop"

$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$startupFolder = Join-Path $env:APPDATA "Microsoft\Windows\Start Menu\Programs\Startup"
$launcherPath = Join-Path $startupFolder "HexaPay Backend Startup.vbs"
$powershellPath = Join-Path $env:SystemRoot "System32\WindowsPowerShell\v1.0\powershell.exe"
$startScriptPath = Join-Path $projectRoot "scripts\start-backend-on-login.ps1"
$command = '{0} -NoProfile -ExecutionPolicy Bypass -File ""{1}""' -f $powershellPath, $startScriptPath
$launcherContent = @"
Set shell = CreateObject("WScript.Shell")
shell.Run "$command", 0, False
"@

if(-not (Test-Path -LiteralPath $startScriptPath)){
  throw "Startup script not found at $startScriptPath"
}

New-Item -ItemType Directory -Force -Path $startupFolder | Out-Null
Set-Content -LiteralPath $launcherPath -Value $launcherContent -Encoding ASCII

Write-Host "Installed HexaPay backend startup launcher at $launcherPath"
