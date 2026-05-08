$ErrorActionPreference = "Stop"

$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$envPath = Join-Path $projectRoot ".env"
$stdoutPath = Join-Path $projectRoot "backend.out.log"
$stderrPath = Join-Path $projectRoot "backend.err.log"
$port = 4000

if(Test-Path -LiteralPath $envPath){
  $portLine = Select-String -Path $envPath -Pattern "^PORT=" | Select-Object -First 1
  if($portLine){
    $configuredPort = $portLine.Line.Substring(5).Trim()
    if($configuredPort -match "^\d+$"){
      $port = [int]$configuredPort
    }
  }
}

$listeningOnPort = netstat -ano -p TCP | Select-String -Pattern "[:\.]$port\s+.*LISTENING"

if($listeningOnPort){
  exit 0
}

$nodePath = (Get-Command node -ErrorAction Stop).Source

Set-Location $projectRoot

$cmdArguments = '/c cd /d "{0}" && "{1}" backend\server.js 1>> "{2}" 2>> "{3}"' -f $projectRoot, $nodePath, $stdoutPath, $stderrPath
$processInfo = New-Object System.Diagnostics.ProcessStartInfo
$processInfo.FileName = $env:ComSpec
$processInfo.Arguments = $cmdArguments
$processInfo.WorkingDirectory = $projectRoot
$processInfo.UseShellExecute = $false
$processInfo.CreateNoWindow = $true

[System.Diagnostics.Process]::Start($processInfo) | Out-Null
