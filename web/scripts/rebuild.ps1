$ErrorActionPreference = "Continue"
Set-Location $PSScriptRoot\..
Get-NetTCPConnection -LocalPort 4173 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }
Start-Sleep 1
& "$env:USERPROFILE\.bun\bin\bun.exe" run build 2>&1 | Select-String -Pattern "error|Compiled|Failed" 
Start-Process -WindowStyle Hidden -FilePath "$env:USERPROFILE\.bun\bin\bunx.exe" -ArgumentList "serve","out","-l","4173"
Start-Sleep 6
$env:CHROME = (Get-ChildItem "$env:USERPROFILE\AppData\Local\ms-playwright\chromium-1234\chrome-win64\chrome.exe").FullName
node scripts/shots.mjs 2>&1 | Select-Object -Last 12
Write-Output "SHOTS DONE"
