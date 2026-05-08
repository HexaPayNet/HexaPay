$ErrorActionPreference = "Stop"

$version = "1.0.2"
$projectRoot = Split-Path -Parent $PSScriptRoot
$sourceAsar = Join-Path $projectRoot "dist\electron-builder\win-unpacked\resources\app.asar"
$outputRoot = Join-Path $projectRoot "dist\updates\HexaPay-$version"
$stagingRoot = Join-Path $outputRoot "staging"
$outputExe = Join-Path $outputRoot "HexaPay-$version-Update.exe"
$outputZip = Join-Path $outputRoot "HexaPay-$version-Update.zip"
$sedPath = Join-Path $outputRoot "HexaPay-$version-Update.sed"
$applyScriptPath = Join-Path $stagingRoot "Apply-HexaPay-$version-Update.ps1"
$readmePath = Join-Path $stagingRoot "README.txt"

if (-not (Test-Path $sourceAsar)) {
  throw "Packaged app.asar not found at $sourceAsar. Build the desktop package first."
}

if (Test-Path $outputRoot) {
  Remove-Item -LiteralPath $outputRoot -Recurse -Force
}

New-Item -ItemType Directory -Path $stagingRoot -Force | Out-Null
Copy-Item -LiteralPath $sourceAsar -Destination (Join-Path $stagingRoot "app.asar")

$applyScript = @'
$ErrorActionPreference = "Stop"

$version = "1.0.2"
$backupSuffix = "before-update-$version"
$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$updateAsar = Join-Path $scriptRoot "app.asar"

function Find-HexaPayInstall {
  $candidateDirs = @(
    (Join-Path $env:LocalAppData "Programs\HexaPay"),
    (Join-Path $env:ProgramFiles "HexaPay")
  )

  if ($env:ProgramFiles -and ${env:ProgramFiles(x86)}) {
    $candidateDirs += (Join-Path ${env:ProgramFiles(x86)} "HexaPay")
  }

  foreach ($candidate in $candidateDirs) {
    $asarPath = Join-Path $candidate "resources\app.asar"
    if (Test-Path $asarPath) {
      return $candidate
    }
  }

  $searchRoots = @(
    (Join-Path $env:LocalAppData "Programs"),
    $env:ProgramFiles
  ) | Where-Object { $_ -and (Test-Path $_) }

  if (${env:ProgramFiles(x86)} -and (Test-Path ${env:ProgramFiles(x86)})) {
    $searchRoots += ${env:ProgramFiles(x86)}
  }

  foreach ($root in $searchRoots) {
    $matches = Get-ChildItem -Path $root -Filter "HexaPay.exe" -Recurse -ErrorAction SilentlyContinue
    foreach ($match in $matches) {
      $candidate = $match.Directory.FullName
      $asarPath = Join-Path $candidate "resources\app.asar"
      if (Test-Path $asarPath) {
        return $candidate
      }
    }
  }

  return $null
}

if (-not (Test-Path $updateAsar)) {
  throw "Update payload app.asar is missing."
}

$installDir = Find-HexaPayInstall
if (-not $installDir) {
  throw "Could not find an existing HexaPay installation. Install HexaPay first, then run this update."
}

$asarPath = Join-Path $installDir "resources\app.asar"
$backupPath = Join-Path $installDir "resources\app.asar.$backupSuffix.bak"

Get-Process HexaPay,electron -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Milliseconds 500

Copy-Item -LiteralPath $asarPath -Destination $backupPath -Force
Copy-Item -LiteralPath $updateAsar -Destination $asarPath -Force

[System.Reflection.Assembly]::LoadWithPartialName("System.Windows.Forms") | Out-Null
[System.Windows.Forms.MessageBox]::Show(
  "HexaPay was updated successfully.`n`nInstall: $installDir`nBackup: $backupPath",
  "HexaPay Update Complete",
  [System.Windows.Forms.MessageBoxButtons]::OK,
  [System.Windows.Forms.MessageBoxIcon]::Information
) | Out-Null
'@

$readme = @'
HexaPay 1.0.2 update

This package updates an existing installed HexaPay app by replacing the installed app runtime file:
- resources\app.asar

What it does:
- closes HexaPay if it is running
- finds the existing HexaPay installation
- backs up the current resources\app.asar
- copies in the updated app.asar with today's changes

Backup naming:
- app.asar.before-update-1.0.2.bak

If you ever need to roll back:
1. Close HexaPay
2. Rename the backup file back to app.asar
3. Reopen HexaPay
'@

Set-Content -LiteralPath $applyScriptPath -Value $applyScript -Encoding ASCII
Set-Content -LiteralPath $readmePath -Value $readme -Encoding ASCII

$sed = @"
[Version]
Class=IEXPRESS
SEDVersion=3
[Options]
PackagePurpose=InstallApp
ShowInstallProgramWindow=0
HideExtractAnimation=1
UseLongFileName=1
InsideCompressed=1
CAB_FixedSize=0
CAB_ResvCodeSigning=0
RebootMode=N
InstallPrompt=
DisplayLicense=
FinishMessage=HexaPay 1.0.2 update completed.
TargetName=$outputExe
FriendlyName=HexaPay 1.0.2 Update
AppLaunched=powershell.exe -ExecutionPolicy Bypass -File Apply-HexaPay-1.0.2-Update.ps1
PostInstallCmd=<None>
AdminQuietInstCmd=
UserQuietInstCmd=
SourceFiles=SourceFiles
[SourceFiles]
SourceFiles0=$stagingRoot
[SourceFiles0]
%FILE0%=
%FILE1%=
%FILE2%=
[Strings]
FILE0=Apply-HexaPay-1.0.2-Update.ps1
FILE1=app.asar
FILE2=README.txt
"@

Set-Content -LiteralPath $sedPath -Value $sed -Encoding ASCII

Compress-Archive -Path (Join-Path $stagingRoot "*") -DestinationPath $outputZip -Force

& iexpress.exe /N $sedPath

for ($attempt = 0; $attempt -lt 20; $attempt++) {
  if (Test-Path $outputExe) {
    break
  }
  Start-Sleep -Milliseconds 500
}

if (-not (Test-Path $outputExe)) {
  throw "IExpress did not produce the update executable."
}

Write-Host "Update bundle created:"
Write-Host "  EXE: $outputExe"
Write-Host "  ZIP: $outputZip"
