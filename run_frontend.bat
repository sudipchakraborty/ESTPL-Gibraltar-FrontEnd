@echo off
setlocal
cd /d "%~dp0"

if not exist "C:\Program Files\nodejs\npm.cmd" (
  echo ERROR: Node.js/npm is not installed.
  exit /b 1
)

set "PATH=C:\Program Files\nodejs;%PATH%"
call "C:\Program Files\nodejs\npm.cmd" run dev -- --host 0.0.0.0 --open
exit /b %ERRORLEVEL%
