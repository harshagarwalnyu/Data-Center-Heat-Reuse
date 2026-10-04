#!/usr/bin/env bash
# build, serve web/out on :4173 and screenshot every story step
cd "$(dirname "$0")/.."
powershell.exe -NoProfile -Command "Get-NetTCPConnection -LocalPort 4173 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id \$_.OwningProcess -Force -ErrorAction SilentlyContinue }"
sleep 1
/c/Users/007ha/.bun/bin/bun.exe run build 2>&1 | grep -iE "error|Compiled|Failed"
(node scripts/serve.mjs >/tmp/serve.log 2>&1 &)
sleep 2
CHROME="$(cygpath -w ~/AppData/Local/ms-playwright/chromium-1234/chrome-win64/chrome.exe)" node scripts/shots.mjs 2>&1 | tail -8
echo SHOTS DONE
