param(
  [string]$BackupTime = "01:00",
  [string]$BackupDrillDay = "Sunday",
  [string]$BackupDrillTime = "02:00",
  [int]$HealthIntervalMinutes = 5
)

$ErrorActionPreference = "Stop"

if($HealthIntervalMinutes -lt 5){
  throw "HealthIntervalMinutes must be 5 or greater."
}

$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$powershellPath = Join-Path $env:SystemRoot "System32\WindowsPowerShell\v1.0\powershell.exe"
$backupScriptPath = Join-Path $projectRoot "scripts\run-cloud-backup.ps1"
$healthScriptPath = Join-Path $projectRoot "scripts\run-ops-health.ps1"
$drillCommand = "cd /d `"$projectRoot`" && npm run ops:backup:drill"

if(-not (Test-Path -LiteralPath $backupScriptPath)){
  throw "Backup script not found at $backupScriptPath"
}

if(-not (Test-Path -LiteralPath $healthScriptPath)){
  throw "Health script not found at $healthScriptPath"
}

$backupAction = New-ScheduledTaskAction `
  -Execute $powershellPath `
  -Argument "-NoProfile -ExecutionPolicy Bypass -File `"$backupScriptPath`""

$backupTrigger = New-ScheduledTaskTrigger -Daily -At $BackupTime

$healthAction = New-ScheduledTaskAction `
  -Execute $powershellPath `
  -Argument "-NoProfile -ExecutionPolicy Bypass -File `"$healthScriptPath`" -Strict"

$healthTrigger = New-ScheduledTaskTrigger -Once -At (Get-Date).Date
$healthTrigger.Repetition = New-ScheduledTaskTrigger -Once -At (Get-Date).Date `
  | Select-Object -ExpandProperty Repetition
$healthTrigger.Repetition.Interval = "PT${HealthIntervalMinutes}M"
$healthTrigger.Repetition.Duration = "P1D"

$drillAction = New-ScheduledTaskAction `
  -Execute $env:ComSpec `
  -Argument "/c $drillCommand"

$drillTrigger = New-ScheduledTaskTrigger -Weekly -DaysOfWeek $BackupDrillDay -At $BackupDrillTime

$principal = New-ScheduledTaskPrincipal -UserId $env:USERNAME -LogonType Interactive -RunLevel Highest
$settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -StartWhenAvailable

Register-ScheduledTask `
  -TaskName "HexaPay Cloud Backup" `
  -Action $backupAction `
  -Trigger $backupTrigger `
  -Principal $principal `
  -Settings $settings `
  -Force | Out-Null

Register-ScheduledTask `
  -TaskName "HexaPay Ops Health Check" `
  -Action $healthAction `
  -Trigger $healthTrigger `
  -Principal $principal `
  -Settings $settings `
  -Force | Out-Null

Register-ScheduledTask `
  -TaskName "HexaPay Backup Drill" `
  -Action $drillAction `
  -Trigger $drillTrigger `
  -Principal $principal `
  -Settings $settings `
  -Force | Out-Null

Write-Host "Installed scheduled tasks:"
Write-Host "- HexaPay Cloud Backup at $BackupTime daily"
Write-Host "- HexaPay Ops Health Check every $HealthIntervalMinutes minutes"
Write-Host "- HexaPay Backup Drill every $BackupDrillDay at $BackupDrillTime"
