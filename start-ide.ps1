# start-ide.ps1
# This script downloads the official VS Code CLI and starts the Web Server.
# It automatically loads the Deexen custom extensions (Theme & AI Panel)

$ErrorActionPreference = "Stop"

$VsCodePath = "$env:USERPROFILE\.vscode-cli"
$VsCodeExe = "$VsCodePath\code.exe"

if (-not (Test-Path $VsCodeExe)) {
    Write-Host "Downloading VS Code CLI..." -ForegroundColor Cyan
    New-Item -ItemType Directory -Force $VsCodePath | Out-Null
    
    # Download the standalone VS Code CLI wrapper
    $downloadUrl = "https://code.visualstudio.com/sha/download?build=stable&os=cli-win32-x64"
    $zipPath = "$VsCodePath\vscode-cli.zip"
    
    Invoke-WebRequest -Uri $downloadUrl -OutFile $zipPath
    Expand-Archive -Path $zipPath -DestinationPath $VsCodePath -Force
    Remove-Item $zipPath
}

$ProjectDir = if ($args.Length -gt 0) { $args[0] } else { "." }
$ExtensionsDir = (Resolve-Path ".\vscode-extensions").Path

$GlobalExtensionsDir = "$env:USERPROFILE\.vscode\extensions"
if (-not (Test-Path $GlobalExtensionsDir)) {
    New-Item -ItemType Directory -Force $GlobalExtensionsDir | Out-Null
}

$ThemeDir = "$ExtensionsDir\deexen-theme"
$ThemeLink = "$GlobalExtensionsDir\deexen-theme"
if (-not (Test-Path $ThemeLink)) {
    New-Item -ItemType Junction -Path $ThemeLink -Target $ThemeDir | Out-Null
}

$AiDir = "$ExtensionsDir\deexen-ai-panel"
$AiLink = "$GlobalExtensionsDir\deexen-ai-panel"
if (-not (Test-Path $AiLink)) {
    New-Item -ItemType Junction -Path $AiLink -Target $AiDir | Out-Null
}

Write-Host "Starting Deexen IDE (VS Code Server)..." -ForegroundColor Green
Write-Host "Project: $ProjectDir" -ForegroundColor Cyan

# We use serve-web, accept the license, and run locally on 8080
# --without-connection-token disables the security token so we can easily stick it in our React iframe
& $VsCodeExe serve-web `
    --port 8080 `
    --host 127.0.0.1 `
    --accept-server-license-terms `
    --without-connection-token

