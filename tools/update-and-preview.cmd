@echo off
setlocal
cd /d "%~dp0\.."

echo.
echo ========================================
echo Audio Library - Update and Preview
echo ========================================
echo.

where git >nul 2>nul
if errorlevel 1 (
  echo ERROR: Git was not found in PATH.
  pause
  exit /b 2
)

where node >nul 2>nul
if errorlevel 1 (
  echo ERROR: Node.js was not found in PATH.
  pause
  exit /b 2
)

echo [1/4] Downloading latest project changes...
git pull --ff-only
if errorlevel 1 (
  echo.
  echo ERROR: git pull failed.
  echo Check whether you have local changes that conflict with GitHub.
  pause
  exit /b 1
)

echo.
echo [2/4] Running local checks...
call tools\local-check.cmd
set CHECK_EXIT=%ERRORLEVEL%

if %CHECK_EXIT% GEQ 2 (
  exit /b %CHECK_EXIT%
)

echo.
echo [3/4] Starting local web server...
start "Audio Library Local Server" /min cmd /c "node tools\dev-server.js"
timeout /t 1 /nobreak >nul

echo.
echo [4/4] Opening browser...
start "" "http://127.0.0.1:8080/"

echo.
if %CHECK_EXIT% EQU 1 (
  echo Preview opened, but the Generator reported content errors.
  echo Review the Generator output before publishing.
) else (
  echo Preview ready: http://127.0.0.1:8080/
)

echo.
pause
exit /b %CHECK_EXIT%
